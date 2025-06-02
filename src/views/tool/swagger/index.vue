<template>
  <div class="app-container">
    <a-card title="Swagger API文档" bordered>
      <div class="action-buttons">
        <a-button type="primary" @click="openSwaggerUI">
          <template #icon><LinkOutlined /></template>
          打开Swagger UI
        </a-button>
        <a-button type="primary" style="margin-left: 8px" @click="getSwaggerData">
          <template #icon><ReloadOutlined /></template>
          刷新
        </a-button>
      </div>

      <a-tabs v-model:activeKey="activeTabKey">
        <a-tab-pane key="paths" tab="接口列表">
          <a-input-search
            v-model:value="searchValue"
            placeholder="搜索接口路径或描述"
            style="width: 300px; margin-bottom: 16px"
            @search="onSearch"
            allow-clear
          />

          <a-collapse v-if="swaggerData">
            <a-collapse-panel
              v-for="(pathObj, path) in filteredPaths"
              :key="path"
              :header="path"
            >
              <a-collapse>
                <a-collapse-panel
                  v-for="(operation, method) in pathObj"
                  :key="`${path}-${method}`"
                  :header="`${method.toUpperCase()} ${operation.summary || path}`"
                  :style="{ color: getMethodColor(method) }"
                >
                  <a-descriptions title="接口信息" bordered :column="1">
                    <a-descriptions-item label="接口路径">{{ path }}</a-descriptions-item>
                    <a-descriptions-item label="请求方式">{{ method.toUpperCase() }}</a-descriptions-item>
                    <a-descriptions-item label="接口描述">{{ operation.summary || '-' }}</a-descriptions-item>
                    <a-descriptions-item label="详细说明">{{ operation.description || '-' }}</a-descriptions-item>
                    <a-descriptions-item label="接口标签">
                      <a-tag v-for="tag in operation.tags" :key="tag">{{ tag }}</a-tag>
                    </a-descriptions-item>
                  </a-descriptions>

                  <a-divider orientation="left">请求参数</a-divider>
                  <a-empty v-if="!operation.parameters || operation.parameters.length === 0" description="无请求参数" />
                  <a-table
                    v-else
                    :columns="paramColumns"
                    :dataSource="operation.parameters"
                    rowKey="name"
                    :pagination="false"
                    size="small"
                  />

                  <a-divider orientation="left">请求体</a-divider>
                  <a-empty v-if="!operation.requestBody" description="无请求体" />
                  <div v-else>
                    <div v-for="(contentType, mediaType) in operation.requestBody.content" :key="mediaType">
                      <p><strong>媒体类型：</strong>{{ mediaType }}</p>
                      <pre v-if="contentType.schema" class="schema-preview">{{ formatSchema(contentType.schema) }}</pre>
                    </div>
                  </div>

                  <a-divider orientation="left">响应结果</a-divider>
                  <a-empty v-if="!operation.responses" description="无响应信息" />
                  <div v-else>
                    <a-collapse>
                      <a-collapse-panel
                        v-for="(response, statusCode) in operation.responses"
                        :key="statusCode"
                        :header="`状态码：${statusCode} - ${response.description || '无描述'}`"
                      >
                        <div v-if="response.content">
                          <div v-for="(contentType, mediaType) in response.content" :key="mediaType">
                            <p><strong>媒体类型：</strong>{{ mediaType }}</p>
                            <pre v-if="contentType.schema" class="schema-preview">{{ formatSchema(contentType.schema) }}</pre>
                          </div>
                        </div>
                        <a-empty v-else description="无响应体定义" />
                      </a-collapse-panel>
                    </a-collapse>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </a-collapse-panel>
          </a-collapse>

          <a-empty v-else description="暂无数据" />
        </a-tab-pane>

        <a-tab-pane key="schemas" tab="数据模型">
          <a-input-search
            v-model:value="schemaSearchValue"
            placeholder="搜索模型名称"
            style="width: 300px; margin-bottom: 16px"
            @search="onSchemaSearch"
            allow-clear
          />

          <a-collapse v-if="swaggerData && swaggerData.components && swaggerData.components.schemas">
            <a-collapse-panel
              v-for="(schema, name) in filteredSchemas"
              :key="name"
              :header="name"
            >
              <pre class="schema-preview">{{ formatSchema(schema) }}</pre>
            </a-collapse-panel>
          </a-collapse>

          <a-empty v-else description="暂无数据模型" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { getSwaggerJson } from '@/api/tool/swagger';
import { message } from 'ant-design-vue';
import { ReloadOutlined, LinkOutlined } from '@ant-design/icons-vue';

// 当前激活的标签页
const activeTabKey = ref<string>('paths');

// Swagger数据
const swaggerData = ref<any>(null);
const loading = ref<boolean>(false);

// 搜索相关
const searchValue = ref<string>('');
const schemaSearchValue = ref<string>('');

// 参数表格列定义
const paramColumns = [
  { title: '参数名称', dataIndex: 'name', key: 'name' },
  { title: '参数位置', dataIndex: 'in', key: 'in' },
  { title: '是否必填', dataIndex: 'required', key: 'required',
    customRender: ({ text }: { text: boolean }) => text ? '是' : '否' },
  { title: '参数类型', dataIndex: 'schema', key: 'schema',
    customRender: ({ record }: { record: any }) => {
      if (record.schema) {
        return record.schema.type || (record.schema.$ref ? record.schema.$ref.split('/').pop() : '未知');
      }
      return record.type || '未知';
    }
  },
  { title: '参数描述', dataIndex: 'description', key: 'description' }
];

// 过滤后的路径
const filteredPaths = computed(() => {
  if (!swaggerData.value || !swaggerData.value.paths) return {};

  if (!searchValue.value) return swaggerData.value.paths;

  const result: Record<string, any> = {};
  const lowerSearchValue = searchValue.value.toLowerCase();

  for (const path in swaggerData.value.paths) {
    if (path.toLowerCase().includes(lowerSearchValue)) {
      result[path] = swaggerData.value.paths[path];
      continue;
    }

    const methods = swaggerData.value.paths[path];
    const filteredMethods: Record<string, any> = {};
    let hasMatch = false;

    for (const method in methods) {
      const operation = methods[method];
      if (
        (operation.summary && operation.summary.toLowerCase().includes(lowerSearchValue)) ||
        (operation.description && operation.description.toLowerCase().includes(lowerSearchValue)) ||
        (operation.tags && operation.tags.some((tag: string) => tag.toLowerCase().includes(lowerSearchValue)))
      ) {
        filteredMethods[method] = operation;
        hasMatch = true;
      }
    }

    if (hasMatch) {
      result[path] = filteredMethods;
    }
  }

  return result;
});

// 过滤后的模型
const filteredSchemas = computed(() => {
  if (!swaggerData.value || !swaggerData.value.components || !swaggerData.value.components.schemas) return {};

  if (!schemaSearchValue.value) return swaggerData.value.components.schemas;

  const result: Record<string, any> = {};
  const lowerSearchValue = schemaSearchValue.value.toLowerCase();

  for (const name in swaggerData.value.components.schemas) {
    if (name.toLowerCase().includes(lowerSearchValue)) {
      result[name] = swaggerData.value.components.schemas[name];
    }
  }

  return result;
});

// 获取请求方法对应的颜色
const getMethodColor = (method: string): string => {
  const colors: Record<string, string> = {
    get: '#61affe',
    post: '#49cc90',
    put: '#fca130',
    delete: '#f93e3e',
    patch: '#50e3c2',
    head: '#9012fe',
    options: '#0d5aa7'
  };
  return colors[method.toLowerCase()] || '#000000';
};

// 格式化schema显示
const formatSchema = (schema: any): string => {
  return JSON.stringify(schema, null, 2);
};

// 搜索接口
const onSearch = (value: string) => {
  searchValue.value = value;
};

// 搜索模型
const onSchemaSearch = (value: string) => {
  schemaSearchValue.value = value;
};

// 获取Swagger数据
const getSwaggerData = async () => {
  loading.value = true;
  try {
    const res = await getSwaggerJson();
    if (res.code === 200) {
      swaggerData.value = res.data;
    } else {
      message.error(res.msg || '获取Swagger文档失败');
    }
  } catch (error) {
    message.error('获取Swagger文档失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 打开Swagger UI
const openSwaggerUI = () => {
  window.open('/api/v1/tool/swagger/ui', '_blank');
};

onMounted(() => {
  getSwaggerData();
});
</script>

<style scoped>
.app-container {
  padding: 20px;
}
.action-buttons {
  margin-bottom: 20px;
}
.schema-preview {
  max-height: 300px;
  overflow-y: auto;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
}
</style>
