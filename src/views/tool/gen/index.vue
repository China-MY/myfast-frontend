<template>
  <div class="app-container">
    <a-tabs v-model:activeKey="activeTabKey">
      <a-tab-pane key="table" tab="代码生成列表">
        <a-card title="代码生成列表" bordered>
          <!-- 查询工具栏 -->
          <a-form :model="queryParams" layout="inline" class="toolbar">
            <a-form-item label="表名称">
              <a-input
                v-model:value="queryParams.table_name"
                placeholder="请输入表名称"
                allow-clear
                @keyup.enter="handleQuery"
              />
            </a-form-item>
            <a-form-item label="表描述">
              <a-input
                v-model:value="queryParams.table_comment"
                placeholder="请输入表描述"
                allow-clear
                @keyup.enter="handleQuery"
              />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="handleQuery">
                <template #icon><SearchOutlined /></template>
                搜索
              </a-button>
              <a-button style="margin-left: 8px" @click="resetQuery">
                <template #icon><ReloadOutlined /></template>
                重置
              </a-button>
            </a-form-item>
          </a-form>

          <!-- 操作按钮区域 -->
          <div class="action-buttons">
            <a-button type="primary" @click="handleImport">
              <template #icon><ImportOutlined /></template>
              导入表
            </a-button>
          </div>

          <!-- 表格区域 -->
          <a-table
            :columns="tableColumns"
            :dataSource="tableData"
            :pagination="pagination"
            :loading="loading"
            rowKey="table_id"
            @change="onTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <a-button type="link" @click="handlePreview(record)">预览</a-button>
                <a-button type="link" @click="handleEdit(record)">编辑</a-button>
                <a-button type="link" @click="handleGenCode(record)">生成代码</a-button>
                <a-button type="link" danger @click="handleDelete(record)">删除</a-button>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-tab-pane>

      <a-tab-pane key="import" tab="导入表" :force-render="false">
        <a-card title="导入表" bordered>
          <!-- 导入表查询工具栏 -->
          <a-form :model="importQueryParams" layout="inline" class="toolbar">
            <a-form-item label="表名称">
              <a-input
                v-model:value="importQueryParams.table_name"
                placeholder="请输入表名称"
                allow-clear
                @keyup.enter="handleImportQuery"
              />
            </a-form-item>
            <a-form-item label="表描述">
              <a-input
                v-model:value="importQueryParams.table_comment"
                placeholder="请输入表描述"
                allow-clear
                @keyup.enter="handleImportQuery"
              />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="handleImportQuery">
                <template #icon><SearchOutlined /></template>
                搜索
              </a-button>
              <a-button style="margin-left: 8px" @click="resetImportQuery">
                <template #icon><ReloadOutlined /></template>
                重置
              </a-button>
            </a-form-item>
          </a-form>

          <!-- 导入表区域 -->
          <a-table
            :columns="importTableColumns"
            :dataSource="importTableData"
            :loading="importLoading"
            :pagination="false"
            rowKey="table_name"
            :row-selection="{
              selectedRowKeys: selectedTables,
              onChange: handleSelectionChange
            }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'create_time' || column.key === 'update_time'">
                {{ formatDateTime(record[column.key]) }}
              </template>
            </template>
          </a-table>

          <!-- 导入按钮 -->
          <div class="table-footer">
            <a-button
              type="primary"
              :disabled="selectedTables.length === 0"
              @click="confirmImport"
            >
              导入
            </a-button>
          </div>
        </a-card>
      </a-tab-pane>
    </a-tabs>

    <!-- 预览代码弹窗 -->
    <a-modal
      v-model:visible="previewVisible"
      title="预览代码"
      width="900px"
      :footer="null"
      :destroyOnClose="true"
    >
      <a-tabs v-model:activeKey="previewActiveTabKey">
        <a-tab-pane
          v-for="item in previewList"
          :key="item.file_name"
          :tab="item.file_name.split('/').pop()"
        >
          <pre class="code-preview">{{ item.content }}</pre>
        </a-tab-pane>
      </a-tabs>
    </a-modal>

    <!-- 表编辑弹窗 -->
    <a-modal
      v-model:visible="editVisible"
      title="编辑表"
      width="900px"
      :confirm-loading="editLoading"
      @ok="handleEditSubmit"
    >
      <a-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-tabs v-model:activeKey="editActiveTabKey">
          <a-tab-pane key="basic" tab="基本信息">
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item label="表名称" name="table_name">
                  <a-input v-model:value="editForm.table_name" disabled />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="表描述" name="table_comment">
                  <a-input v-model:value="editForm.table_comment" placeholder="请输入表描述" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="实体类名称" name="class_name">
                  <a-input v-model:value="editForm.class_name" placeholder="请输入实体类名称" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="作者" name="function_author">
                  <a-input v-model:value="editForm.function_author" placeholder="请输入作者" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="生成包路径" name="package_name">
                  <a-input v-model:value="editForm.package_name" placeholder="请输入生成包路径" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="生成模块名" name="module_name">
                  <a-input v-model:value="editForm.module_name" placeholder="请输入生成模块名" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="生成业务名" name="business_name">
                  <a-input v-model:value="editForm.business_name" placeholder="请输入生成业务名" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="生成功能名" name="function_name">
                  <a-input v-model:value="editForm.function_name" placeholder="请输入生成功能名" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-tab-pane>

          <a-tab-pane key="columns" tab="字段信息">
            <a-table
              :columns="columnColumns"
              :dataSource="editForm.columns"
              rowKey="column_id"
              size="small"
              :pagination="false"
              bordered
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'is_pk'">
                  <a-checkbox
                    :checked="record.is_pk === '1'"
                    @change="e => handleColumnCheckboxChange(record, 'is_pk', e.target.checked)"
                  />
                </template>
                <template v-else-if="column.key === 'is_increment'">
                  <a-checkbox
                    :checked="record.is_increment === '1'"
                    @change="e => handleColumnCheckboxChange(record, 'is_increment', e.target.checked)"
                  />
                </template>
                <template v-else-if="column.key === 'is_required'">
                  <a-checkbox
                    :checked="record.is_required === '1'"
                    @change="e => handleColumnCheckboxChange(record, 'is_required', e.target.checked)"
                  />
                </template>
                <template v-else-if="column.key === 'is_insert'">
                  <a-checkbox
                    :checked="record.is_insert === '1'"
                    @change="e => handleColumnCheckboxChange(record, 'is_insert', e.target.checked)"
                  />
                </template>
                <template v-else-if="column.key === 'is_edit'">
                  <a-checkbox
                    :checked="record.is_edit === '1'"
                    @change="e => handleColumnCheckboxChange(record, 'is_edit', e.target.checked)"
                  />
                </template>
                <template v-else-if="column.key === 'is_list'">
                  <a-checkbox
                    :checked="record.is_list === '1'"
                    @change="e => handleColumnCheckboxChange(record, 'is_list', e.target.checked)"
                  />
                </template>
                <template v-else-if="column.key === 'is_query'">
                  <a-checkbox
                    :checked="record.is_query === '1'"
                    @change="e => handleColumnCheckboxChange(record, 'is_query', e.target.checked)"
                  />
                </template>
                <template v-else-if="column.key === 'query_type'">
                  <a-select
                    v-model:value="record.query_type"
                    style="width: 100%"
                    size="small"
                  >
                    <a-select-option value="EQ">等于</a-select-option>
                    <a-select-option value="NE">不等于</a-select-option>
                    <a-select-option value="GT">大于</a-select-option>
                    <a-select-option value="GTE">大于等于</a-select-option>
                    <a-select-option value="LT">小于</a-select-option>
                    <a-select-option value="LTE">小于等于</a-select-option>
                    <a-select-option value="LIKE">模糊查询</a-select-option>
                  </a-select>
                </template>
                <template v-else-if="column.key === 'html_type'">
                  <a-select
                    v-model:value="record.html_type"
                    style="width: 100%"
                    size="small"
                  >
                    <a-select-option value="input">文本框</a-select-option>
                    <a-select-option value="textarea">文本域</a-select-option>
                    <a-select-option value="select">下拉框</a-select-option>
                    <a-select-option value="checkbox">复选框</a-select-option>
                    <a-select-option value="radio">单选框</a-select-option>
                    <a-select-option value="datetime">日期控件</a-select-option>
                  </a-select>
                </template>
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import {
  getGenTableList,
  getDbTableList,
  importTable,
  getGenTableInfo,
  updateGenTable,
  deleteGenTable,
  previewCode,
  downloadCode
} from '@/api/tool/gen';
import {
  SearchOutlined,
  ReloadOutlined,
  ImportOutlined
} from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import type { TablePaginationConfig } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import { saveAs } from 'file-saver';

// 标签页
const activeTabKey = ref<string>('table');
const previewActiveTabKey = ref<string>('');
const editActiveTabKey = ref<string>('basic');

// 表格列表查询参数
const queryParams = reactive({
  table_name: '',
  table_comment: '',
  page_num: 1,
  page_size: 10
});

// 表格数据
const tableData = ref<any[]>([]);
const loading = ref<boolean>(false);
const pagination = reactive<TablePaginationConfig>({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total) => `共 ${total} 条`
});

// 表格列定义
const tableColumns = [
  { title: '表名称', dataIndex: 'table_name', key: 'table_name' },
  { title: '表描述', dataIndex: 'table_comment', key: 'table_comment' },
  { title: '实体类名称', dataIndex: 'class_name', key: 'class_name' },
  { title: '创建时间', dataIndex: 'create_time', key: 'create_time' },
  { title: '更新时间', dataIndex: 'update_time', key: 'update_time' },
  { title: '操作', key: 'action', width: 280 }
];

// 导入表查询参数
const importQueryParams = reactive({
  table_name: '',
  table_comment: ''
});
const importTableData = ref<any[]>([]);
const importLoading = ref<boolean>(false);
const selectedTables = ref<string[]>([]);

// 导入表格列定义
const importTableColumns = [
  { title: '表名称', dataIndex: 'table_name', key: 'table_name' },
  { title: '表描述', dataIndex: 'table_comment', key: 'table_comment' },
  { title: '创建时间', dataIndex: 'create_time', key: 'create_time' },
  { title: '更新时间', dataIndex: 'update_time', key: 'update_time' }
];

// 预览代码
const previewVisible = ref<boolean>(false);
const previewList = ref<any[]>([]);

// 编辑表单
const editVisible = ref<boolean>(false);
const editLoading = ref<boolean>(false);
const editFormRef = ref<FormInstance>();
const editForm = reactive({
  table_id: 0,
  table_name: '',
  table_comment: '',
  class_name: '',
  tpl_category: 'crud',
  package_name: 'app',
  module_name: '',
  business_name: '',
  function_name: '',
  function_author: '',
  columns: [] as any[]
});

// 编辑表单校验规则
const editFormRules = {
  table_name: [{ required: true, message: '表名称不能为空', trigger: 'blur' }],
  class_name: [{ required: true, message: '实体类名称不能为空', trigger: 'blur' }],
  package_name: [{ required: true, message: '生成包路径不能为空', trigger: 'blur' }],
  module_name: [{ required: true, message: '生成模块名不能为空', trigger: 'blur' }],
  business_name: [{ required: true, message: '生成业务名不能为空', trigger: 'blur' }],
  function_name: [{ required: true, message: '生成功能名不能为空', trigger: 'blur' }],
  function_author: [{ required: true, message: '作者不能为空', trigger: 'blur' }]
};

// 表字段列
const columnColumns = [
  { title: '列名称', dataIndex: 'column_name', key: 'column_name', width: 150 },
  { title: '列描述', dataIndex: 'column_comment', key: 'column_comment', width: 150 },
  { title: '列类型', dataIndex: 'column_type', key: 'column_type', width: 100 },
  { title: '主键', dataIndex: 'is_pk', key: 'is_pk', width: 60 },
  { title: '自增', dataIndex: 'is_increment', key: 'is_increment', width: 60 },
  { title: '必填', dataIndex: 'is_required', key: 'is_required', width: 60 },
  { title: '插入', dataIndex: 'is_insert', key: 'is_insert', width: 60 },
  { title: '编辑', dataIndex: 'is_edit', key: 'is_edit', width: 60 },
  { title: '列表', dataIndex: 'is_list', key: 'is_list', width: 60 },
  { title: '查询', dataIndex: 'is_query', key: 'is_query', width: 60 },
  { title: '查询方式', dataIndex: 'query_type', key: 'query_type', width: 120 },
  { title: '显示类型', dataIndex: 'html_type', key: 'html_type', width: 120 }
];

// 格式化日期时间
const formatDateTime = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString();
};

// 获取表格列表
const getList = async () => {
  loading.value = true;
  try {
    const res = await getGenTableList({
      table_name: queryParams.table_name,
      table_comment: queryParams.table_comment,
      page_num: queryParams.page_num,
      page_size: queryParams.page_size
    });
    if (res.code === 200) {
      tableData.value = res.data.rows || [];
      pagination.total = res.data.total;
    } else {
      message.error(res.msg || '获取表格列表失败');
    }
  } catch (error) {
    message.error('获取表格列表失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 获取数据库表列表
const getDbList = async () => {
  importLoading.value = true;
  try {
    const res = await getDbTableList({
      table_name: importQueryParams.table_name,
      table_comment: importQueryParams.table_comment
    });
    if (res.code === 200) {
      importTableData.value = res.data || [];
    } else {
      message.error(res.msg || '获取数据库表列表失败');
    }
  } catch (error) {
    message.error('获取数据库表列表失败');
    console.error(error);
  } finally {
    importLoading.value = false;
  }
};

// 查询按钮操作
const handleQuery = () => {
  queryParams.page_num = 1;
  getList();
};

// 重置查询
const resetQuery = () => {
  queryParams.table_name = '';
  queryParams.table_comment = '';
  handleQuery();
};

// 表格变化
const onTableChange = (pag: TablePaginationConfig) => {
  pagination.current = pag.current || 1;
  pagination.pageSize = pag.pageSize || 10;
  queryParams.page_num = pagination.current;
  queryParams.page_size = pagination.pageSize;
  getList();
};

// 导入表查询按钮
const handleImportQuery = () => {
  getDbList();
};

// 重置导入表查询
const resetImportQuery = () => {
  importQueryParams.table_name = '';
  importQueryParams.table_comment = '';
  handleImportQuery();
};

// 导入表按钮操作
const handleImport = () => {
  selectedTables.value = [];
  activeTabKey.value = 'import';
  getDbList();
};

// 处理表选择变化
const handleSelectionChange = (keys: string[]) => {
  selectedTables.value = keys;
};

// 确认导入表
const confirmImport = async () => {
  if (selectedTables.value.length === 0) {
    message.warning('请选择要导入的表');
    return;
  }

  try {
    const res = await importTable(selectedTables.value);
    if (res.code === 200) {
      message.success('导入成功');
      activeTabKey.value = 'table';
      getList();
    } else {
      message.error(res.msg || '导入失败');
    }
  } catch (error) {
    message.error('导入失败');
    console.error(error);
  }
};

// 预览代码
const handlePreview = async (record: any) => {
  try {
    const res = await previewCode(record.table_id);
    if (res.code === 200) {
      previewList.value = res.data || [];
      previewVisible.value = true;
      if (previewList.value.length > 0) {
        previewActiveTabKey.value = previewList.value[0].file_name;
      }
    } else {
      message.error(res.msg || '预览失败');
    }
  } catch (error) {
    message.error('预览失败');
    console.error(error);
  }
};

// 编辑表
const handleEdit = async (record: any) => {
  try {
    const res = await getGenTableInfo(record.table_id);
    if (res.code === 200) {
      Object.assign(editForm, res.data);
      editVisible.value = true;
    } else {
      message.error(res.msg || '获取表信息失败');
    }
  } catch (error) {
    message.error('获取表信息失败');
    console.error(error);
  }
};

// 字段复选框变化
const handleColumnCheckboxChange = (record: any, field: string, checked: boolean) => {
  record[field] = checked ? '1' : '0';
};

// 提交编辑表单
const handleEditSubmit = () => {
  editFormRef.value?.validate().then(async () => {
    editLoading.value = true;
    try {
      const res = await updateGenTable(editForm);
      if (res.code === 200) {
        message.success('更新成功');
        editVisible.value = false;
        getList();
      } else {
        message.error(res.msg || '更新失败');
      }
    } catch (error) {
      message.error('更新失败');
      console.error(error);
    } finally {
      editLoading.value = false;
    }
  });
};

// 生成代码
const handleGenCode = async (record: any) => {
  try {
    const res = await downloadCode(record.table_id);
    const blob = new Blob([res], { type: 'application/zip' });
    saveAs(blob, `${record.table_name}.zip`);
  } catch (error) {
    message.error('生成代码失败');
    console.error(error);
  }
};

// 删除表
const handleDelete = (record: any) => {
  Modal.confirm({
    title: '警告',
    content: `确定要删除表 ${record.table_name} 吗？`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      try {
        const res = await deleteGenTable([record.table_id]);
        if (res.code === 200) {
          message.success('删除成功');
          getList();
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
  getList();
});
</script>

<style scoped>
.app-container {
  padding: 20px;
}
.toolbar {
  margin-bottom: 20px;
}
.action-buttons {
  margin-bottom: 20px;
}
.table-footer {
  margin-top: 20px;
  text-align: right;
}
.code-preview {
  max-height: 600px;
  overflow-y: auto;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
}
</style>
