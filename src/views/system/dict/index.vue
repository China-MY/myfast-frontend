<template>
  <div class="dict-container">
    <a-card class="box-card">
      <template #title>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-input
              v-model:value="queryParams.dictName"
              placeholder="请输入字典名称"
              allow-clear
              style="width: 200px"
              @keyup.enter="handleQuery"
            />
          </a-col>
          <a-col :span="8">
            <a-input
              v-model:value="queryParams.dictType"
              placeholder="请输入字典类型"
              allow-clear
              style="width: 200px"
              @keyup.enter="handleQuery"
            />
          </a-col>
          <a-col :span="8">
            <a-select
              v-model:value="queryParams.status"
              placeholder="字典状态"
              allow-clear
              style="width: 200px"
            >
              <a-select-option value="0">正常</a-select-option>
              <a-select-option value="1">停用</a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </template>
      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleQuery">
            <search-outlined />
            搜索
          </a-button>
          <a-button @click="resetQuery">
            <redo-outlined />
            重置
          </a-button>
          <a-button type="primary" @click="handleAdd">
            <plus-outlined />
            新增
          </a-button>
          <a-button type="danger" :disabled="selectedRowKeys.length === 0" @click="handleBatchDelete">
            <delete-outlined />
            删除
          </a-button>
          <a-button>
            <upload-outlined />
            导入
          </a-button>
          <a-button>
            <download-outlined />
            导出
          </a-button>
        </a-space>
      </template>
      <a-table
        :columns="columns"
        :data-source="dictList"
        :loading="loading"
        :pagination="pagination"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        row-key="dictId"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <a-tag :color="record.status === '0' ? 'green' : 'red'">
              {{ record.status === '0' ? '正常' : '停用' }}
            </a-tag>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-space>
              <a-button type="link" @click="handleDictData(record)">
                <database-outlined />
                字典数据
              </a-button>
              <a-button type="link" @click="handleUpdate(record)">
                <edit-outlined />
                修改
              </a-button>
              <a-popconfirm
                title="确定删除该字典吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(record)"
              >
                <a-button type="link" danger>
                  <delete-outlined />
                  删除
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 添加或修改对话框 -->
    <a-modal
      v-model:visible="open"
      :title="title"
      width="600px"
      @ok="submitForm"
      @cancel="cancel"
    >
      <a-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <a-form-item label="字典名称" name="dictName">
          <a-input v-model:value="form.dictName" placeholder="请输入字典名称" />
        </a-form-item>
        <a-form-item label="字典类型" name="dictType">
          <a-input v-model:value="form.dictType" placeholder="请输入字典类型" />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-radio-group v-model:value="form.status">
            <a-radio value="0">正常</a-radio>
            <a-radio value="1">停用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="form.remark" placeholder="请输入内容" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  SearchOutlined,
  RedoOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  DownloadOutlined,
  DatabaseOutlined
} from '@ant-design/icons-vue';

const router = useRouter();

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  dictName: '',
  dictType: '',
  status: ''
});

// 表格列定义
const columns = [
  {
    title: '字典编号',
    dataIndex: 'dictId',
    width: 100
  },
  {
    title: '字典名称',
    dataIndex: 'dictName',
    ellipsis: true
  },
  {
    title: '字典类型',
    dataIndex: 'dictType',
    ellipsis: true
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100
  },
  {
    title: '备注',
    dataIndex: 'remark',
    ellipsis: true
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 280
  }
];

// 表格数据
const dictList = ref([]);
const loading = ref(false);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条数据`
});
const selectedRowKeys = ref<number[]>([]);

// 弹窗表单
const open = ref(false);
const title = ref('');
const formRef = ref();
const form = reactive({
  dictId: undefined,
  dictName: '',
  dictType: '',
  status: '0',
  remark: ''
});
const rules = {
  dictName: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
  dictType: [{ required: true, message: '请输入字典类型', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
};

// 生命周期钩子
onMounted(() => {
  getList();
});

// 获取字典列表
const getList = async () => {
  loading.value = true;
  // 模拟API调用
  setTimeout(() => {
    dictList.value = [
      {
        dictId: 1,
        dictName: '用户性别',
        dictType: 'sys_user_sex',
        status: '0',
        remark: '用户性别列表',
        createTime: '2023-01-01 00:00:00'
      },
      {
        dictId: 2,
        dictName: '菜单状态',
        dictType: 'sys_show_hide',
        status: '0',
        remark: '菜单状态列表',
        createTime: '2023-01-01 00:00:00'
      },
      {
        dictId: 3,
        dictName: '系统开关',
        dictType: 'sys_normal_disable',
        status: '0',
        remark: '系统开关列表',
        createTime: '2023-01-01 00:00:00'
      }
    ];
    pagination.total = 3;
    loading.value = false;
  }, 500);
};

// 表格选择变化事件
const onSelectChange = (rowKeys: number[]) => {
  selectedRowKeys.value = rowKeys;
};

// 分页变化事件
const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  getList();
};

// 查询按钮
const handleQuery = () => {
  pagination.current = 1;
  getList();
};

// 重置按钮
const resetQuery = () => {
  queryParams.dictName = '';
  queryParams.dictType = '';
  queryParams.status = '';
  handleQuery();
};

// 新增按钮
const handleAdd = () => {
  open.value = true;
  title.value = '添加字典类型';
  form.dictId = undefined;
  form.dictName = '';
  form.dictType = '';
  form.status = '0';
  form.remark = '';
};

// 修改按钮
const handleUpdate = (row: any) => {
  open.value = true;
  title.value = '修改字典类型';
  form.dictId = row.dictId;
  form.dictName = row.dictName;
  form.dictType = row.dictType;
  form.status = row.status;
  form.remark = row.remark || '';
};

// 删除按钮
const handleDelete = (row: any) => {
  message.success('删除成功');
  getList();
};

// 批量删除
const handleBatchDelete = () => {
  message.success(`删除成功，数量：${selectedRowKeys.value.length}`);
  selectedRowKeys.value = [];
  getList();
};

// 查看字典数据
const handleDictData = (row: any) => {
  router.push(`/system/dict/data/${row.dictType}`);
};

// 提交表单
const submitForm = async () => {
  formRef.value
    .validate()
    .then(() => {
      message.success('保存成功');
      open.value = false;
      getList();
    })
    .catch((error: any) => {
      console.log('表单校验失败:', error);
    });
};

// 取消按钮
const cancel = () => {
  open.value = false;
};
</script>

<style scoped>
.dict-container {
  padding: 16px;
}
</style>
