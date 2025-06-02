<template>
  <div class="online-container">
    <a-card class="box-card">
      <template #title>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-input
              v-model:value="queryParams.ipaddr"
              placeholder="请输入登录地址"
              allow-clear
              style="width: 200px"
              @keyup.enter="handleQuery"
            />
          </a-col>
          <a-col :span="8">
            <a-input
              v-model:value="queryParams.userName"
              placeholder="请输入用户名称"
              allow-clear
              style="width: 200px"
              @keyup.enter="handleQuery"
            />
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
          <a-button type="danger" :disabled="selectedRowKeys.length === 0" @click="handleBatchForceLogout">
            <disconnect-outlined />
            批量强退
          </a-button>
        </a-space>
      </template>
      <a-table
        :columns="columns"
        :data-source="onlineList"
        :loading="loading"
        :pagination="pagination"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        row-key="tokenId"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <a-popconfirm
              title="确定强退该用户吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleForceLogout(record)"
            >
              <a-button type="link" danger>
                <disconnect-outlined />
                强退
              </a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import {
  SearchOutlined,
  RedoOutlined,
  DisconnectOutlined
} from '@ant-design/icons-vue';

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  ipaddr: '',
  userName: ''
});

// 表格列定义
const columns = [
  {
    title: '会话编号',
    dataIndex: 'tokenId',
    width: 120
  },
  {
    title: '登录名称',
    dataIndex: 'userName',
    ellipsis: true
  },
  {
    title: '部门',
    dataIndex: 'deptName',
    ellipsis: true
  },
  {
    title: '主机地址',
    dataIndex: 'ipaddr'
  },
  {
    title: '登录地点',
    dataIndex: 'loginLocation',
    ellipsis: true
  },
  {
    title: '浏览器',
    dataIndex: 'browser'
  },
  {
    title: '操作系统',
    dataIndex: 'os'
  },
  {
    title: '登录时间',
    dataIndex: 'loginTime',
    width: 180
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 100
  }
];

// 表格数据
const onlineList = ref<any[]>([]);
const loading = ref(false);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条数据`
});
const selectedRowKeys = ref<string[]>([]);

// 生命周期钩子
onMounted(() => {
  getList();
});

// 获取在线用户列表
const getList = async () => {
  loading.value = true;
  // 模拟API调用
  setTimeout(() => {
    onlineList.value = [
      {
        tokenId: '01234567-89ab-cdef-0123-456789abcdef',
        userName: 'admin',
        deptName: '研发部门',
        ipaddr: '127.0.0.1',
        loginLocation: '内网IP',
        browser: 'Chrome',
        os: 'Windows 10',
        loginTime: '2023-05-20 10:30:45'
      },
      {
        tokenId: '12345678-89ab-cdef-0123-456789abcdef',
        userName: 'test',
        deptName: '测试部门',
        ipaddr: '192.168.1.100',
        loginLocation: '内网IP',
        browser: 'Firefox',
        os: 'Windows 11',
        loginTime: '2023-05-20 09:15:30'
      },
      {
        tokenId: '23456789-89ab-cdef-0123-456789abcdef',
        userName: 'demo',
        deptName: '运维部门',
        ipaddr: '192.168.2.200',
        loginLocation: '内网IP',
        browser: 'Edge',
        os: 'macOS',
        loginTime: '2023-05-20 08:45:12'
      }
    ];
    pagination.total = 3;
    loading.value = false;
  }, 500);
};

// 表格选择变化事件
const onSelectChange = (rowKeys: string[]) => {
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
  queryParams.ipaddr = '';
  queryParams.userName = '';
  handleQuery();
};

// 强制退出
const handleForceLogout = (row: any) => {
  message.success(`已强制退出用户：${row.userName}`);
  getList();
};

// 批量强制退出
const handleBatchForceLogout = () => {
  message.success(`已强制退出选定的 ${selectedRowKeys.value.length} 个用户`);
  selectedRowKeys.value = [];
  getList();
};
</script>

<style scoped>
.online-container {
  padding: 16px;
}
</style>
