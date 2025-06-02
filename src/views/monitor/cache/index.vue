<template>
  <div class="app-container">
    <a-card title="缓存监控" bordered>
      <a-button type="primary" class="refresh-btn" @click="getCacheData">
        <template #icon><ReloadOutlined /></template>
        刷新
      </a-button>

      <a-tabs v-model:activeKey="activeTabKey">
        <a-tab-pane key="info" tab="缓存信息">
          <a-row :gutter="24" v-if="cacheInfo">
            <a-col :span="12" style="margin-bottom: 20px;">
              <a-card title="Redis信息" :bordered="false">
                <a-descriptions :column="1" bordered>
                  <a-descriptions-item label="Redis版本">{{ cacheInfo.info.redis_version }}</a-descriptions-item>
                  <a-descriptions-item label="运行模式">{{ cacheInfo.info.redis_mode }}</a-descriptions-item>
                  <a-descriptions-item label="端口">{{ cacheInfo.info.tcp_port }}</a-descriptions-item>
                  <a-descriptions-item label="客户端数">{{ cacheInfo.info.connected_clients }}</a-descriptions-item>
                  <a-descriptions-item label="运行时间(天)">{{ cacheInfo.info.uptime_in_days }}</a-descriptions-item>
                  <a-descriptions-item label="使用内存">{{ formatSize(cacheInfo.info.used_memory) }}</a-descriptions-item>
                  <a-descriptions-item label="使用CPU">{{ cacheInfo.info.used_cpu_sys }}%</a-descriptions-item>
                </a-descriptions>
              </a-card>
            </a-col>
            <a-col :span="12" style="margin-bottom: 20px;">
              <a-card title="命令统计" :bordered="false">
                <a-descriptions :column="1" bordered>
                  <a-descriptions-item label="执行命令总数">{{ cacheInfo.info.total_commands_processed }}</a-descriptions-item>
                  <a-descriptions-item label="每秒执行命令">{{ cacheInfo.info.instantaneous_ops_per_sec }}</a-descriptions-item>
                  <a-descriptions-item label="网络入口流量">{{ formatSize(cacheInfo.info.total_net_input_bytes) }}</a-descriptions-item>
                  <a-descriptions-item label="网络出口流量">{{ formatSize(cacheInfo.info.total_net_output_bytes) }}</a-descriptions-item>
                  <a-descriptions-item label="过期的键数量">{{ cacheInfo.info.expired_keys }}</a-descriptions-item>
                  <a-descriptions-item label="被驱逐的键数量">{{ cacheInfo.info.evicted_keys }}</a-descriptions-item>
                  <a-descriptions-item label="键命中率">{{ cacheInfo.info.keyspace_hits }}%</a-descriptions-item>
                </a-descriptions>
              </a-card>
            </a-col>
            <a-col :span="24">
              <a-card title="数据库" :bordered="false">
                <a-table :dataSource="dbData" :columns="dbColumns" rowKey="name" :pagination="false">
                </a-table>
              </a-card>
            </a-col>
          </a-row>
          <a-empty v-else description="暂无数据" />
        </a-tab-pane>

        <a-tab-pane key="keys" tab="缓存列表">
          <a-form layout="inline" class="search-form">
            <a-form-item label="键名称">
              <a-input
                v-model:value="queryParams.pattern"
                placeholder="请输入键名称"
                allow-clear
                @keyup.enter="searchKeys"
              />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="searchKeys">
                <template #icon><SearchOutlined /></template>
                搜索
              </a-button>
              <a-button style="margin-left: 8px" @click="resetQuery">
                <template #icon><ReloadOutlined /></template>
                重置
              </a-button>
            </a-form-item>
          </a-form>

          <a-table
            :dataSource="keyList"
            :columns="keyColumns"
            :loading="loading"
            :pagination="pagination"
            @change="handleTableChange"
            rowKey="key"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <a-button type="link" @click="viewCacheValue(record.key)">详情</a-button>
                <a-button type="link" danger @click="handleDelete(record.key)">删除</a-button>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>

      <!-- 缓存值详情弹窗 -->
      <a-modal
        v-model:visible="valueModalVisible"
        title="缓存值详情"
        width="800px"
        :footer="null"
      >
        <a-descriptions bordered :column="1">
          <a-descriptions-item label="键名称">{{ currentKey }}</a-descriptions-item>
          <a-descriptions-item label="键类型">{{ cacheValue?.type }}</a-descriptions-item>
          <a-descriptions-item label="缓存内容">
            <div class="value-content">
              <pre>{{ JSON.stringify(cacheValue?.value, null, 2) }}</pre>
            </div>
          </a-descriptions-item>
        </a-descriptions>
      </a-modal>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { getCacheInfo, getCacheKeys, getCacheValue, deleteCacheKey } from '@/api/monitor/cache';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import type { TablePaginationConfig } from 'ant-design-vue';

// 活动标签页
const activeTabKey = ref<string>('info');

// 缓存信息
const cacheInfo = ref<any>(null);
const dbData = ref<any[]>([]);

// 缓存键列表
const keyList = ref<any[]>([]);
const loading = ref<boolean>(false);
const queryParams = reactive({
  pattern: '*',
  page_num: 1,
  page_size: 10
});

// 分页配置
const pagination = reactive<TablePaginationConfig>({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total) => `共 ${total} 条`
});

// 缓存值详情
const valueModalVisible = ref<boolean>(false);
const currentKey = ref<string>('');
const cacheValue = ref<any>(null);

// 表格列定义
const dbColumns = [
  { title: '数据库', dataIndex: 'name', key: 'name' },
  { title: '键数量', dataIndex: 'keys', key: 'keys' },
  { title: '过期数', dataIndex: 'expires', key: 'expires' },
  { title: '平均存活时间', dataIndex: 'avg_ttl', key: 'avg_ttl' }
];

const keyColumns = [
  { title: '键名称', dataIndex: 'key', key: 'key', ellipsis: true },
  { title: '键类型', dataIndex: 'type', key: 'type' },
  { title: '操作', key: 'action', width: 150 }
];

// 格式化文件大小
const formatSize = (size: number): string => {
  if (size === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return (size / Math.pow(1024, i)).toFixed(2) + ' ' + units[i];
};

// 获取缓存信息
const getCacheData = async () => {
  try {
    const res = await getCacheInfo();
    if (res.code === 200) {
      cacheInfo.value = res.data;

      // 处理数据库信息
      const dbInfo = [];
      for (const key in res.data.keyspace) {
        if (Object.prototype.hasOwnProperty.call(res.data.keyspace, key)) {
          const db = res.data.keyspace[key];
          dbInfo.push({
            name: key,
            keys: db.keys,
            expires: db.expires,
            avg_ttl: db.avg_ttl
          });
        }
      }
      dbData.value = dbInfo;
    } else {
      message.error(res.msg || '获取缓存信息失败');
    }
  } catch (error) {
    message.error('获取缓存信息失败');
    console.error(error);
  }
};

// 获取缓存键列表
const getKeyList = async () => {
  loading.value = true;
  try {
    const res = await getCacheKeys({
      pattern: queryParams.pattern,
      page_num: queryParams.page_num,
      page_size: queryParams.page_size
    });
    if (res.code === 200) {
      keyList.value = res.data.rows || [];
      pagination.total = res.data.total;
    } else {
      message.error(res.msg || '获取缓存键列表失败');
    }
  } catch (error) {
    message.error('获取缓存键列表失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 搜索键
const searchKeys = () => {
  queryParams.page_num = 1;
  getKeyList();
};

// 重置查询
const resetQuery = () => {
  queryParams.pattern = '*';
  searchKeys();
};

// 处理表格变化
const handleTableChange = (pag: TablePaginationConfig) => {
  pagination.current = pag.current || 1;
  pagination.pageSize = pag.pageSize || 10;
  queryParams.page_num = pagination.current;
  queryParams.page_size = pagination.pageSize;
  getKeyList();
};

// 查看缓存值
const viewCacheValue = async (key: string) => {
  try {
    const res = await getCacheValue(key);
    if (res.code === 200) {
      currentKey.value = key;
      cacheValue.value = res.data;
      valueModalVisible.value = true;
    } else {
      message.error(res.msg || '获取缓存值失败');
    }
  } catch (error) {
    message.error('获取缓存值失败');
    console.error(error);
  }
};

// 处理删除
const handleDelete = (key: string) => {
  Modal.confirm({
    title: '警告',
    content: `确定要删除缓存键 ${key} 吗？`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      try {
        const res = await deleteCacheKey(key);
        if (res.code === 200) {
          message.success('删除成功');
          getKeyList();
        } else {
          message.error(res.msg || '删除失败');
        }
      } catch (error) {
        message.error('删除失败');
        console.error(error);
      }
    }
  });
};

onMounted(() => {
  getCacheData();
  getKeyList();
});
</script>

<style scoped>
.app-container {
  padding: 20px;
}
.refresh-btn {
  margin-bottom: 20px;
}
.search-form {
  margin-bottom: 20px;
}
.value-content {
  max-height: 300px;
  overflow-y: auto;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
}
</style>
