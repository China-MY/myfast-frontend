<template>
  <div class="app-container">
    <a-row :gutter="{ xs: 8, sm: 16, md: 24 }" class="flexible-layout">
      <!-- 左侧部门树 -->
      <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="5" class="dept-col">
        <a-card title="部门列表" :bordered="false" class="dept-tree-card">
          <div class="dept-search">
            <a-input-search
              v-model:value="deptSearchValue"
              placeholder="搜索部门"
              style="width: 100%"
              @search="handleDeptSearch"
              allow-clear
            />
          </div>
          <div class="dept-tree-wrapper">
            <a-spin :spinning="deptLoading">
              <a-tree
                :tree-data="filteredDeptTree"
                :default-expanded-keys="defaultExpandedKeys"
                :selected-keys="selectedDeptKeys"
                @select="handleDeptSelect"
                :fieldNames="{ title: 'title', key: 'id', children: 'children' }"
                show-line
              />
            </a-spin>
          </div>
        </a-card>
      </a-col>

      <!-- 右侧用户列表 -->
      <a-col :xs="24" :sm="24" :md="18" :lg="18" :xl="19" class="content-col">
        <!-- 查询条件 -->
        <a-card class="search-card" :bordered="false">
          <a-form layout="inline" :model="queryParams" @submit="handleQuery" class="responsive-form">
            <a-row :gutter="[16, 16]" style="width: 100%">
              <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
                <a-form-item label="用户名称" class="responsive-form-item">
                  <a-input v-model:value="queryParams.username" placeholder="请输入用户名称" allow-clear style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
                <a-form-item label="用户昵称" class="responsive-form-item">
                  <a-input v-model:value="queryParams.nickname" placeholder="请输入用户昵称" allow-clear style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
                <a-form-item label="状态" class="responsive-form-item">
                  <a-select v-model:value="queryParams.status" placeholder="请选择状态" allow-clear style="width: 100%">
                    <a-select-option value="0">正常</a-select-option>
                    <a-select-option value="1">停用</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12" :md="24" :lg="24" :xl="6" class="action-col">
                <a-form-item class="responsive-form-item action-form-item">
                  <a-space>
                    <a-button type="primary" html-type="submit">
                      <template #icon><SearchOutlined /></template>
                      查询
                    </a-button>
                    <a-button @click="resetQuery">
                      <template #icon><ReloadOutlined /></template>
                      重置
                    </a-button>
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>

        <!-- 操作按钮区域 -->
        <a-card class="table-card" :bordered="false">
          <template #title>
            <div class="table-toolbar">
              <div class="left-actions">
                <a-space>
                  <a-button type="primary" v-permission="['system:user:add']" @click="handleAdd">
                    <template #icon><PlusOutlined /></template>
                    新增
                  </a-button>
                  <a-button danger v-permission="['system:user:delete']" :disabled="!selectedRowKeys.length" @click="handleBatchDelete">
                    <template #icon><DeleteOutlined /></template>
                    删除
                  </a-button>
                </a-space>
              </div>
              <div class="right-actions">
                <!-- 可添加其他操作，如导出、刷新等 -->
              </div>
            </div>
          </template>

          <!-- 用户列表 -->
          <div class="responsive-table-container">
            <a-table
              :columns="columns"
              :loading="loading"
              :data-source="userList"
              :pagination="pagination"
              :row-key="(record) => record.user_id"
              :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
              @change="handleTableChange"
              :scroll="{ x: 'max-content' }"
            >
              <template #bodyCell="{ column, record }">
                <!-- 状态列 -->
                <template v-if="column.key === 'status'">
                  <a-tag :color="record.status === '0' ? 'green' : 'red'">
                    {{ record.status === '0' ? '正常' : '停用' }}
                  </a-tag>
                </template>

                <!-- 创建时间列 -->
                <template v-else-if="column.key === 'createTime'">
                  {{ formatDate(record.create_time) }}
                </template>

                <!-- 操作列 -->
                <template v-else-if="column.key === 'action'">
                  <a-space>
                    <a v-permission="['system:user:edit']" @click="handleEdit(record)">修改</a>
                    <a-divider type="vertical" />
                    <a v-permission="['system:user:delete']" @click="handleDelete(record)">删除</a>
                    <a-divider type="vertical" />
                    <a v-permission="['system:user:resetPwd']" @click="handleResetPassword(record)">重置密码</a>
                  </a-space>
                </template>
              </template>
            </a-table>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 用户信息表单对话框 -->
    <a-modal
      :title="formTitle"
      :visible="formVisible"
      :confirm-loading="formLoading"
      @ok="handleSubmit"
      @cancel="cancelForm"
      width="700px"
      :maskClosable="false"
      class="responsive-modal"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        layout="vertical"
      >
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="基本信息">
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item name="username" label="用户名称" :required="true">
                  <a-input v-model:value="formData.username" placeholder="请输入用户名称" :disabled="formType === 'edit'" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item name="nickname" label="用户昵称" :required="true">
                  <a-input v-model:value="formData.nickname" placeholder="请输入用户昵称" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item name="dept_id" label="归属部门">
                  <a-tree-select
                    v-model:value="formData.dept_id"
                    :tree-data="deptOptions"
                    placeholder="请选择归属部门"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    allow-clear
                    tree-default-expand-all
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item name="phonenumber" label="手机号码">
                  <a-input v-model:value="formData.phonenumber" placeholder="请输入手机号码" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item name="email" label="邮箱">
                  <a-input v-model:value="formData.email" placeholder="请输入邮箱" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item name="sex" label="用户性别">
                  <a-select v-model:value="formData.sex" placeholder="请选择性别">
                    <a-select-option value="0">男</a-select-option>
                    <a-select-option value="1">女</a-select-option>
                    <a-select-option value="2">未知</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item name="status" label="状态">
                  <a-select v-model:value="formData.status" placeholder="请选择状态">
                    <a-select-option value="0">正常</a-select-option>
                    <a-select-option value="1">停用</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12" v-if="formType === 'add'">
                <a-form-item name="password" label="密码" :required="formType === 'add'">
                  <a-input-password v-model:value="formData.password" placeholder="请输入密码" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="2" tab="角色权限">
            <a-form-item name="role_ids" label="角色">
              <a-checkbox-group v-model:value="formData.role_ids">
                <a-row>
                  <a-col :span="8" v-for="role in roleOptions" :key="role.role_id">
                    <a-checkbox :value="role.role_id">{{ role.role_name }}</a-checkbox>
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </a-modal>

    <!-- 重置密码对话框 -->
    <a-modal
      title="重置密码"
      :visible="resetPwdVisible"
      :confirm-loading="resetPwdLoading"
      @ok="confirmResetPassword"
      @cancel="cancelResetPassword"
      :maskClosable="false"
    >
      <a-form
        ref="resetPwdFormRef"
        :model="resetPwdForm"
        :rules="resetPwdRules"
        layout="vertical"
      >
        <a-form-item name="password" label="新密码" :required="true">
          <a-input-password v-model:value="resetPwdForm.password" placeholder="请输入新密码" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { 
  SearchOutlined, 
  ReloadOutlined, 
  PlusOutlined, 
  DeleteOutlined
} from '@ant-design/icons-vue'
import { 
  readUsersApiV1SystemUserGet, 
  createUserApiV1SystemUserPost, 
  readUserApiV1SystemUserUserIdGet,
  updateUserApiV1SystemUserUserIdPut, 
  deleteUserApiV1SystemUserUserIdDelete,
  resetPasswordApiV1SystemUserUserIdResetPasswordPut
} from '@/api/yonghuguanli'
import { 
  getDeptTreeApiV1SystemDeptTreeGet,
  getDeptOptionsApiV1SystemDeptSelectOptionsGet
} from '@/api/bumenguanli'
import { useUserStore } from '@/stores/modules/user'
import { useSystemData } from '@/hooks/useSystemData'
import dayjs from 'dayjs'
import type { User, PageResponse, ApiResponse } from '@/types/user'

// 获取部门和角色数据
const { deptOptions, roleOptions } = useSystemData();

// 部门树相关状态
const deptTreeData = ref<any[]>([]);
const defaultExpandedKeys = ref<string[]>([]);
const selectedDeptKeys = ref<string[]>([]);
const deptLoading = ref(false);
const deptSearchValue = ref('');

// 初始化部门树数据
const initDeptTree = async () => {
  try {
    deptLoading.value = true;
    const res = await getDeptTreeApiV1SystemDeptTreeGet();
    
    console.log('部门树原始数据:', res); // 添加日志，查看API返回的数据结构
    
    // 更灵活地处理响应结构，适应不同的API返回格式
    let deptData = [];
    if (res && res.data) {
      if (res.data.code === 200 && res.data.data) {
        deptData = res.data.data;
      } else if (res.data.code === 200 && Array.isArray(res.data)) {
        deptData = res.data;
      } else if (Array.isArray(res.data)) {
        deptData = res.data;
      }
    }
    
    if (deptData.length > 0) {
      deptTreeData.value = formatDeptTreeData(deptData);
      console.log('格式化后的部门树数据:', deptTreeData.value); // 添加日志，检查格式化后的数据
      
      // 默认展开第一级
      if (deptTreeData.value.length > 0) {
        defaultExpandedKeys.value = [deptTreeData.value[0].id.toString()];
      }
    } else {
      console.warn('未获取到部门数据或数据格式不正确');
      message.warning('未获取到部门数据');
    }
  } catch (error) {
    console.error('获取部门树出错', error);
    message.error('获取部门树失败');
  } finally {
    deptLoading.value = false;
  }
};

// 格式化部门树数据
const formatDeptTreeData = (data: any[]): any[] => {
  return data.map(item => {
    const node: any = {
      id: item.dept_id,
      pId: item.parent_id || 0,
      title: item.dept_name,
      key: item.dept_id.toString(),
      selectable: true,
      isLeaf: !item.children || !item.children.length,
    };

    if (item.children && item.children.length > 0) {
      node.children = formatDeptTreeData(item.children);
    }

    return node;
  });
};

// 过滤后的部门树
const filteredDeptTree = computed(() => {
  if (!deptSearchValue.value) {
    return deptTreeData.value;
  }
  return filterDeptTree(deptTreeData.value, deptSearchValue.value);
});

// 过滤部门树
const filterDeptTree = (treeData: any[], keyword: string): any[] => {
  const result: any[] = [];
  
  treeData.forEach(node => {
    if (node.title.includes(keyword)) {
      // 当前节点符合条件，直接添加
      result.push({...node});
    } else if (node.children && node.children.length) {
      // 递归检查子节点
      const filteredChildren = filterDeptTree(node.children, keyword);
      if (filteredChildren.length) {
        result.push({
          ...node,
          children: filteredChildren
        });
      }
    }
  });
  
  return result;
};

// 处理部门搜索
const handleDeptSearch = (value: string) => {
  deptSearchValue.value = value;
};

// 处理部门选择
const handleDeptSelect = (selectedKeys: string[], info: any) => {
  if (selectedKeys.length > 0) {
    selectedDeptKeys.value = selectedKeys;
    queryParams.dept_id = Number(selectedKeys[0]);
  } else {
    selectedDeptKeys.value = [];
    queryParams.dept_id = null;
  }
  queryParams.page = 1;
  getList();
};

// 查询参数
const queryParams = reactive({
  username: '',
  nickname: '',
  status: undefined,
  dept_id: undefined,
  page: 1,
  pageSize: 10
});

// 用户列表数据
const userList = ref<any[]>([]);
const loading = ref(false);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`
});

// 表格列定义
const columns = [
  { title: '用户编号', dataIndex: 'user_id', key: 'user_id', width: 100 },
  { title: '用户名称', dataIndex: 'username', key: 'username', width: 120 },
  { title: '用户昵称', dataIndex: 'nickname', key: 'nickname', width: 120 },
  { title: '部门', dataIndex: ['dept', 'dept_name'], key: 'dept_name', width: 120 },
  { title: '手机号码', dataIndex: 'phonenumber', key: 'phonenumber', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '创建时间', dataIndex: 'create_time', key: 'createTime', width: 180 },
  { title: '操作', key: 'action', width: 200 }
];

// 选中行
const selectedRowKeys = ref<any[]>([]);

// 表单数据
const formRef = ref();
const formVisible = ref(false);
const formLoading = ref(false);
const formType = ref('');
const formData = reactive<any>({
  username: '',
  nickname: '',
  password: '',
  email: '',
  phonenumber: '',
  sex: '0',
  status: '0',
  dept_id: undefined,
  role_ids: []
});

// 表单规则
const formRules = {
  username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }],
  password: [{ required: true, message: '请输入用户密码', trigger: 'blur' }]
};

// 重置密码表单
const resetPwdFormRef = ref();
const resetPwdVisible = ref(false);
const resetPwdLoading = ref(false);
const resetPwdForm = reactive({
  password: '',
  user_id: undefined
});

// 重置密码表单规则
const resetPwdRules = {
  password: [{ required: true, message: '请输入新密码', trigger: 'blur' }]
};

// 计算属性 - 表单标题
const formTitle = computed(() => {
  return formType.value === 'add' ? '添加用户' : '编辑用户';
});

// 初始化
onMounted(() => {
  initDeptTree();
  getList();
});

// 获取用户列表
const getList = async () => {
  try {
    loading.value = true;
    const res = await readUsersApiV1SystemUserGet(queryParams) as unknown as PageResponse<User>;
    if (res.code === 200) {
      userList.value = res.rows || [];
      pagination.total = res.pageInfo?.total || 0;
      pagination.current = res.pageInfo?.page || 1;
      pagination.pageSize = res.pageInfo?.pageSize || 10;
    } else {
      message.error(res.msg || '获取用户列表失败');
    }
  } catch (error) {
    console.error('获取用户列表出错', error);
    message.error('获取用户列表失败');
  } finally {
    loading.value = false;
  }
};

// 重置查询条件
const resetQuery = () => {
  Object.assign(queryParams, {
    username: '',
    nickname: '',
    status: undefined,
    dept_id: undefined,
    page: 1,
    pageSize: 10
  });
  selectedDeptKeys.value = [];
  getList();
};

// 处理查询
const handleQuery = () => {
  queryParams.page = 1;
  getList();
};

// 表格变化事件
const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  queryParams.page = pag.current;
  queryParams.pageSize = pag.pageSize;
  getList();
};

// 选择行变化
const onSelectChange = (keys: any[]) => {
  selectedRowKeys.value = keys;
};

// 批量删除
const handleBatchDelete = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请至少选择一条记录');
    return;
  }

  Modal.confirm({
    title: '确认删除',
    content: `是否确认删除选中的 ${selectedRowKeys.value.length} 条数据?`,
    onOk: async () => {
      try {
        // 实际应用中应该有批量删除API，这里使用循环单条删除模拟
        for (const id of selectedRowKeys.value) {
          await deleteUserApiV1SystemUserUserIdDelete({ user_id: id });
        }
        message.success('删除成功');
        selectedRowKeys.value = [];
        getList();
      } catch (error) {
        console.error('批量删除出错', error);
        message.error('批量删除失败');
      }
    }
  });
};

// 添加用户
const handleAdd = () => {
  formType.value = 'add';
  resetForm();
  // 如果已选择部门，将其设为默认值
  if (selectedDeptKeys.value.length > 0) {
    formData.dept_id = parseInt(selectedDeptKeys.value[0]);
  }
  formVisible.value = true;
};

// 编辑用户
const handleEdit = async (record: any) => {
  try {
    formType.value = 'edit';
    resetForm();
    formVisible.value = true;
    formLoading.value = true;
    
    // 获取用户详情
    const res = await readUserApiV1SystemUserUserIdGet({ user_id: record.user_id }) as unknown as ApiResponse<User>;
    if (res.code === 200 && res.data) {
      // 填充表单数据
      Object.assign(formData, {
        user_id: res.data.user_id,
        username: res.data.username,
        nickname: res.data.nickname,
        email: res.data.email,
        phonenumber: res.data.phonenumber,
        sex: res.data.sex,
        status: res.data.status,
        dept_id: res.data.dept_id,
        role_ids: res.data.roles?.map((role: any) => role.role_id) || []
      });
    } else {
      message.error(res.msg || '获取用户详情失败');
      formVisible.value = false;
    }
  } catch (error) {
    console.error('获取用户详情出错', error);
    message.error('获取用户详情失败');
    formVisible.value = false;
  } finally {
    formLoading.value = false;
  }
};

// 删除用户
const handleDelete = (record: any) => {
  Modal.confirm({
    title: '确认删除',
    content: `是否确认删除用户名称为"${record.username}"的数据?`,
    onOk: async () => {
      try {
        const res = await deleteUserApiV1SystemUserUserIdDelete({ user_id: record.user_id });
        if (res.code === 200) {
          message.success('删除成功');
          getList();
        } else {
          message.error(res.msg || '删除失败');
        }
      } catch (error) {
        console.error('删除用户出错', error);
        message.error('删除失败');
      }
    }
  });
};

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  Object.assign(formData, {
    user_id: undefined,
    username: '',
    nickname: '',
    password: '',
    email: '',
    phonenumber: '',
    sex: '0',
    status: '0',
    dept_id: undefined,
    role_ids: []
  });
};

// 取消表单
const cancelForm = () => {
  formVisible.value = false;
  resetForm();
};

// 提交表单
const handleSubmit = () => {
  formRef.value.validate().then(async () => {
    try {
      formLoading.value = true;
      
      if (formType.value === 'add') {
        // 创建用户
        const res = await createUserApiV1SystemUserPost(formData);
        if (res.code === 200) {
          message.success('新增用户成功');
          formVisible.value = false;
          getList();
        } else {
          message.error(res.msg || '新增用户失败');
        }
      } else {
        // 更新用户
        const res = await updateUserApiV1SystemUserUserIdPut({ user_id: formData.user_id }, formData);
        if (res.code === 200) {
          message.success('修改用户成功');
          formVisible.value = false;
          getList();
        } else {
          message.error(res.msg || '修改用户失败');
        }
      }
    } catch (error) {
      console.error('提交表单出错', error);
      message.error('提交表单失败');
    } finally {
      formLoading.value = false;
    }
  }).catch(error => {
    console.log('表单验证失败', error);
  });
};

// 处理重置密码
const handleResetPassword = (record: any) => {
  resetPwdForm.user_id = record.user_id;
  resetPwdForm.password = '';
  resetPwdVisible.value = true;
  setTimeout(() => {
    resetPwdFormRef.value?.resetFields();
  }, 0);
};

// 确认重置密码
const confirmResetPassword = () => {
  resetPwdFormRef.value.validate().then(async () => {
    try {
      resetPwdLoading.value = true;
      const res = await resetPasswordApiV1SystemUserUserIdResetPasswordPut(
        { user_id: resetPwdForm.user_id as number },
        { password: resetPwdForm.password }
      ) as unknown as ApiResponse;
      if (res.code === 200) {
        message.success('重置密码成功');
        resetPwdVisible.value = false;
      } else {
        message.error(res.msg || '重置密码失败');
      }
    } catch (error: any) {
      console.error('重置密码出错', error);
      message.error('重置密码失败');
    } finally {
      resetPwdLoading.value = false;
    }
  }).catch((error: any) => {
    console.log('表单验证失败', error);
  });
};

// 取消重置密码
const cancelResetPassword = () => {
  resetPwdVisible.value = false;
  resetPwdForm.password = '';
  resetPwdForm.user_id = undefined;
};

// 格式化日期
const formatDate = (date: string) => {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};
</script>

<style scoped lang="less">
.app-container {
  padding: 16px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.flexible-layout {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
}

.dept-col, .content-col {
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.3s;
}

.dept-tree-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  
  :deep(.ant-card-body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 16px;
  }
}

.dept-search {
  margin-bottom: 16px;
}

.dept-tree-wrapper {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 150px;
  max-height: calc(100vh - 300px);
}

.search-card {
  margin-bottom: 16px;
  
  :deep(.ant-card-body) {
    padding: 16px;
  }
}

.responsive-form {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  
  .responsive-form-item {
    width: 100%;
    margin-bottom: 0;
    
    @media (max-width: 576px) {
      margin-bottom: 16px;
    }
  }
  
  .action-form-item {
    display: flex;
    justify-content: flex-end;
    
    @media (max-width: 576px) {
      justify-content: flex-start;
    }
  }
}

.table-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  
  :deep(.ant-card-body) {
    flex: 1;
    padding: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 16px;
  
  .left-actions, .right-actions {
    margin-bottom: 8px;
  }
}

.responsive-table-container {
  flex: 1;
  overflow: auto;
  
  :deep(.ant-pagination) {
    padding: 16px;
    margin: 0;
  }
}

.action-col {
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    justify-content: flex-start;
  }
  
  @media (min-width: 768px) {
    justify-content: flex-end;
  }
}

// 响应式断点适配
@media (max-width: 768px) {
  .flexible-layout {
    flex-direction: column;
  }
  
  .dept-col {
    margin-bottom: 16px;
  }
  
  .dept-tree-wrapper {
    max-height: 300px;
  }
}

.responsive-modal {
  :deep(.ant-modal-body) {
    max-height: calc(100vh - 250px);
    overflow-y: auto;
  }
}
</style> 