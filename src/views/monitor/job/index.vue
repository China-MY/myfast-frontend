<template>
  <div class="app-container">
    <a-card title="定时任务" bordered>
      <!-- 查询工具栏 -->
      <a-form :model="queryParams" layout="inline" class="toolbar">
        <a-form-item label="任务名称">
          <a-input
            v-model:value="queryParams.job_name"
            placeholder="请输入任务名称"
            allow-clear
            @keyup.enter="handleQuery"
          />
        </a-form-item>
        <a-form-item label="任务组名">
          <a-input
            v-model:value="queryParams.job_group"
            placeholder="请输入任务组名"
            allow-clear
            @keyup.enter="handleQuery"
          />
        </a-form-item>
        <a-form-item label="状态">
          <a-select
            v-model:value="queryParams.status"
            placeholder="请选择状态"
            style="width: 120px"
            allow-clear
          >
            <a-select-option value="0">正常</a-select-option>
            <a-select-option value="1">暂停</a-select-option>
          </a-select>
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
        <a-button type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          新增
        </a-button>
      </div>

      <!-- 表格区域 -->
      <a-table
        :columns="columns"
        :dataSource="tableData"
        :pagination="pagination"
        :loading="loading"
        rowKey="job_id"
        @change="onTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <a-tag :color="record.status === '0' ? 'success' : 'error'">
              {{ record.status === '0' ? '正常' : '暂停' }}
            </a-tag>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-button
              type="link"
              size="small"
              @click="handleRun(record)"
              :disabled="record.status === '1'"
            >
              执行一次
            </a-button>
            <a-button
              v-if="record.status === '0'"
              type="link"
              size="small"
              @click="handleChangeStatus(record, '1')"
            >
              暂停
            </a-button>
            <a-button
              v-else
              type="link"
              size="small"
              @click="handleChangeStatus(record, '0')"
            >
              恢复
            </a-button>
            <a-button type="link" size="small" @click="handleEdit(record)">
              编辑
            </a-button>
            <a-button type="link" size="small" danger @click="handleDelete(record)">
              删除
            </a-button>
          </template>
        </template>
      </a-table>

      <!-- 任务表单弹窗 -->
      <a-modal
        :title="formTitle"
        v-model:visible="formVisible"
        :confirm-loading="formLoading"
        @ok="handleFormSubmit"
      >
        <a-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-col="{ span: 6 }"
          wrapper-col="{ span: 16 }"
        >
          <a-form-item label="任务名称" name="job_name">
            <a-input v-model:value="formData.job_name" placeholder="请输入任务名称" />
          </a-form-item>
          <a-form-item label="任务组名" name="job_group">
            <a-input v-model:value="formData.job_group" placeholder="请输入任务组名" />
          </a-form-item>
          <a-form-item label="调用目标字符串" name="invoke_target">
            <a-input v-model:value="formData.invoke_target" placeholder="请输入调用目标字符串" />
          </a-form-item>
          <a-form-item label="Cron表达式" name="cron_expression">
            <a-input v-model:value="formData.cron_expression" placeholder="请输入Cron表达式" />
          </a-form-item>
          <a-form-item label="计划策略" name="misfire_policy">
            <a-select v-model:value="formData.misfire_policy" placeholder="请选择计划策略">
              <a-select-option value="1">立即执行</a-select-option>
              <a-select-option value="2">执行一次</a-select-option>
              <a-select-option value="3">放弃执行</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="是否并发执行" name="concurrent">
            <a-radio-group v-model:value="formData.concurrent">
              <a-radio value="0">允许</a-radio>
              <a-radio value="1">禁止</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="状态" name="status">
            <a-radio-group v-model:value="formData.status">
              <a-radio value="0">正常</a-radio>
              <a-radio value="1">暂停</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="备注" name="remark">
            <a-textarea v-model:value="formData.remark" placeholder="请输入备注" />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import {
  getJobList,
  getJobInfo,
  addJob,
  updateJob,
  deleteJob,
  runJob,
  changeJobStatus
} from '@/api/monitor/job';
import { message, Modal } from 'ant-design-vue';
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined
} from '@ant-design/icons-vue';
import type { TablePaginationConfig } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';

// 查询参数
const queryParams = reactive({
  job_name: '',
  job_group: '',
  status: undefined,
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
const columns = [
  { title: '任务编号', dataIndex: 'job_id', key: 'job_id', width: 100 },
  { title: '任务名称', dataIndex: 'job_name', key: 'job_name', ellipsis: true },
  { title: '任务组名', dataIndex: 'job_group', key: 'job_group' },
  { title: '调用目标字符串', dataIndex: 'invoke_target', key: 'invoke_target', ellipsis: true },
  { title: 'Cron表达式', dataIndex: 'cron_expression', key: 'cron_expression' },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 280 }
];

// 表单相关
const formRef = ref<FormInstance>();
const formVisible = ref<boolean>(false);
const formLoading = ref<boolean>(false);
const formMode = ref<'add' | 'edit'>('add');
const formTitle = computed(() => formMode.value === 'add' ? '添加任务' : '编辑任务');

// 表单数据
const defaultFormData = {
  job_id: 0,
  job_name: '',
  job_group: 'DEFAULT',
  invoke_target: '',
  cron_expression: '',
  misfire_policy: '1',
  concurrent: '0',
  status: '0',
  remark: ''
};
const formData = reactive({...defaultFormData});

// 表单校验规则
const formRules = {
  job_name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  job_group: [{ required: true, message: '请输入任务组名', trigger: 'blur' }],
  invoke_target: [{ required: true, message: '请输入调用目标字符串', trigger: 'blur' }],
  cron_expression: [{ required: true, message: '请输入Cron表达式', trigger: 'blur' }],
  misfire_policy: [{ required: true, message: '请选择计划策略', trigger: 'change' }],
  concurrent: [{ required: true, message: '请选择是否并发执行', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
};

// 获取任务列表
const getList = async () => {
  loading.value = true;
  try {
    const res = await getJobList({
      job_name: queryParams.job_name,
      job_group: queryParams.job_group,
      status: queryParams.status,
      page_num: queryParams.page_num,
      page_size: queryParams.page_size
    });
    if (res.code === 200) {
      tableData.value = res.data.rows || [];
      pagination.total = res.data.total;
    } else {
      message.error(res.msg || '获取定时任务列表失败');
    }
  } catch (error) {
    message.error('获取定时任务列表失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 查询按钮操作
const handleQuery = () => {
  queryParams.page_num = 1;
  getList();
};

// 重置查询
const resetQuery = () => {
  queryParams.job_name = '';
  queryParams.job_group = '';
  queryParams.status = undefined;
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

// 新增按钮操作
const handleAdd = () => {
  formMode.value = 'add';
  Object.assign(formData, defaultFormData);
  formVisible.value = true;
};

// 编辑按钮操作
const handleEdit = async (record: any) => {
  formMode.value = 'edit';
  formVisible.value = true;
  formLoading.value = true;

  try {
    const res = await getJobInfo(record.job_id);
    if (res.code === 200) {
      Object.assign(formData, res.data);
    } else {
      message.error(res.msg || '获取任务详情失败');
    }
  } catch (error) {
    message.error('获取任务详情失败');
    console.error(error);
  } finally {
    formLoading.value = false;
  }
};

// 表单提交
const handleFormSubmit = () => {
  formRef.value?.validate().then(async () => {
    formLoading.value = true;
    try {
      const submitData = { ...formData };
      let res;

      if (formMode.value === 'add') {
        res = await addJob(submitData);
      } else {
        res = await updateJob(submitData);
      }

      if (res.code === 200) {
        message.success(formMode.value === 'add' ? '添加成功' : '修改成功');
        formVisible.value = false;
        getList();
      } else {
        message.error(res.msg || (formMode.value === 'add' ? '添加失败' : '修改失败'));
      }
    } catch (error) {
      message.error(formMode.value === 'add' ? '添加失败' : '修改失败');
      console.error(error);
    } finally {
      formLoading.value = false;
    }
  });
};

// 删除按钮操作
const handleDelete = (record: any) => {
  Modal.confirm({
    title: '警告',
    content: `确定要删除任务 ${record.job_name} 吗？`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      try {
        const res = await deleteJob(record.job_id);
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

// 执行一次任务
const handleRun = (record: any) => {
  Modal.confirm({
    title: '警告',
    content: `确定要立即执行一次任务 ${record.job_name} 吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        const res = await runJob(record.job_id);
        if (res.code === 200) {
          message.success('执行成功');
        } else {
          message.error(res.msg || '执行失败');
        }
      } catch (error) {
        message.error('执行失败');
        console.error(error);
      }
    }
  });
};

// 修改任务状态
const handleChangeStatus = (record: any, status: string) => {
  const statusText = status === '0' ? '恢复' : '暂停';
  Modal.confirm({
    title: '警告',
    content: `确定要${statusText}任务 ${record.job_name} 吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        const res = await changeJobStatus(record.job_id, status);
        if (res.code === 200) {
          message.success(`${statusText}成功`);
          getList();
        } else {
          message.error(res.msg || `${statusText}失败`);
        }
      } catch (error) {
        message.error(`${statusText}失败`);
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
</style>
