<template>
  <div class="role-container">
    <!-- 查询区域 -->
    <a-card class="search-card" :bordered="false">
      <a-form layout="inline" :model="queryParams" ref="queryForm">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="8" :md="12" :sm="24">
            <a-form-item label="角色名称" name="role_name">
              <a-input v-model:value="queryParams.role_name" placeholder="请输入角色名称" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="8" :md="12" :sm="24">
            <a-form-item label="权限字符" name="role_key">
              <a-input v-model:value="queryParams.role_key" placeholder="请输入权限字符" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="8" :md="12" :sm="24">
            <a-form-item label="状态" name="status">
              <a-select v-model:value="queryParams.status" placeholder="角色状态" allow-clear>
                <a-select-option value="0">正常</a-select-option>
                <a-select-option value="1">停用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="{span: 8}" :md="{span: 12}" :sm="{span: 24}">
            <a-space>
              <a-button type="primary" @click="handleQuery">
                <template #icon><search-outlined /></template>
                查询
              </a-button>
              <a-button @click="resetQuery">
                <template #icon><redo-outlined /></template>
                重置
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!-- 操作区域 -->
    <a-card class="table-card" :bordered="false">
      <template #title>
        <a-space>
          <a-button type="primary" @click="handleAdd" v-permission="['system:role:add']">
            <template #icon><plus-outlined /></template>
            新增
          </a-button>
          <a-button danger @click="handleBatchDelete" :disabled="selectedRowKeys.length === 0" v-permission="['system:role:delete']">
            <template #icon><delete-outlined /></template>
            批量删除
          </a-button>
          <a-button @click="refreshTable">
            <template #icon><reload-outlined /></template>
            刷新
          </a-button>
        </a-space>
      </template>
      
      <!-- 表格区域 -->
      <a-table
        :columns="columns"
        :data-source="roleList"
        :pagination="pagination"
        :loading="loading"
        rowKey="role_id"
        @change="handleTableChange"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <a-tag :color="record.status === '0' ? 'success' : 'error'">
              {{ record.status === '0' ? '正常' : '停用' }}
            </a-tag>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-space size="small">
              <a @click="handleEdit(record)" v-permission="['system:role:edit']">
                <edit-outlined /> 编辑
              </a>
              <a-divider type="vertical" />
              <a @click="handleAssignMenu(record)" v-permission="['system:role:edit']">
                <setting-outlined /> 分配权限
              </a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确定要删除此角色吗？"
                @confirm="handleDelete(record)"
                ok-text="确定"
                cancel-text="取消"
                v-permission="['system:role:delete']"
              >
                <a><delete-outlined /> 删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 添加/编辑角色弹窗 -->
    <a-modal
      :title="formTitle"
      :visible="open"
      :maskClosable="false"
      width="50%"
      :footer="null"
      :destroy-on-close="true"
      @cancel="cancel"
    >
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        layout="vertical"
      >
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="角色名称" name="role_name">
              <a-input v-model:value="form.role_name" placeholder="请输入角色名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="权限字符" name="role_key">
              <a-input v-model:value="form.role_key" placeholder="请输入权限字符" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="角色顺序" name="role_sort">
              <a-input-number v-model:value="form.role_sort" :min="0" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="状态" name="status">
              <a-radio-group v-model:value="form.status">
                <a-radio value="0">正常</a-radio>
                <a-radio value="1">停用</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="form.remark" placeholder="请输入备注" :rows="3" />
        </a-form-item>
        <div class="modal-footer">
          <a-button @click="cancel">取消</a-button>
          <a-button type="primary" @click="submitForm" :loading="submitLoading">保存</a-button>
        </div>
      </a-form>
    </a-modal>

    <!-- 分配权限弹窗 -->
    <a-modal
      title="分配权限"
      :visible="menuOpen"
      :maskClosable="false"
      width="50%"
      :footer="null"
      :destroy-on-close="true"
      @cancel="menuOpen = false"
    >
      <a-spin :spinning="menuLoading">
        <a-form layout="vertical">
          <a-form-item label="角色名称">
            <a-input v-model:value="currentRole.role_name" disabled />
          </a-form-item>
          <a-form-item label="菜单权限">
            <a-tree
              v-model:checkedKeys="checkedMenuKeys"
              :treeData="menuTree"
              checkable
              :defaultExpandAll="true"
              :fieldNames="{ title: 'menu_name', key: 'menu_id', children: 'children' }"
            />
          </a-form-item>
          <div class="modal-footer">
            <a-button @click="menuOpen = false">取消</a-button>
            <a-button type="primary" @click="submitMenuAssign" :loading="menuSubmitLoading">保存</a-button>
          </div>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue';
import { 
  listRolesApiV1SystemRoleListGet, 
  createRoleApiV1SystemRolePost, 
  updateRoleApiV1SystemRoleRoleIdPut, 
  deleteRoleApiV1SystemRoleRoleIdDelete, 
  getRoleApiV1SystemRoleRoleIdGet 
} from '@/api/jiaoseguanli';
import { message } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import { 
  PlusOutlined, 
  SearchOutlined, 
  RedoOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  ReloadOutlined,
  SettingOutlined
} from '@ant-design/icons-vue';
import { getRoleMenusApiV1SystemMenuRoleRoleIdGet } from '@/api/caidanguanli';

// 查询参数
const queryParams = reactive({
  role_name: undefined,
  role_key: undefined,
  status: undefined,
  page: 1,
  page_size: 10
});

// 分页参数
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`
});

// 表格数据和加载状态
const roleList = ref<any[]>([]);
const loading = ref(false);
const selectedRowKeys = ref<number[]>([]);

// 表单相关
const open = ref(false);
const formTitle = computed(() => form.role_id ? '编辑角色' : '新增角色');
const form = reactive<API.RoleCreate & { role_id?: number, remark?: string }>({
  role_name: '',
  role_key: '',
  role_sort: 0,
  status: '0',
  menu_ids: [],
  remark: ''
});
const formRef = ref<FormInstance>();
const submitLoading = ref(false);

// 菜单权限分配相关
const menuOpen = ref(false);
const menuLoading = ref(false);
const menuSubmitLoading = ref(false);
const currentRole = ref<any>({});
const menuTree = ref<any[]>([]);
const checkedMenuKeys = ref<number[]>([]);

// 表单校验规则
const rules = {
  role_name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
  role_key: [{ required: true, message: '权限字符不能为空', trigger: 'blur' }],
  role_sort: [{ required: true, message: '角色顺序不能为空', trigger: 'blur' }]
};

// 表格列定义
const columns = [
  {
    title: '角色编号',
    dataIndex: 'role_id',
    width: 100
  },
  {
    title: '角色名称',
    dataIndex: 'role_name',
    ellipsis: true
  },
  {
    title: '权限字符',
    dataIndex: 'role_key',
    ellipsis: true
  },
  {
    title: '显示顺序',
    dataIndex: 'role_sort'
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    width: 180
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 220,
    fixed: 'right'
  }
];

// 初始化
onMounted(() => {
  getList();
});

// 查询角色列表
const getList = async () => {
  loading.value = true;
  try {
    // 发起请求并获取响应
    const response = await listRolesApiV1SystemRoleListGet({
      ...queryParams,
      page: pagination.current,
      page_size: pagination.pageSize
    });
    
    // 详细打印API响应，便于调试
    console.log('API响应状态:', response.status);
    console.log('API响应数据详情:', response);
    
    // 使用类型断言处理API响应
    const res = response as any;
    
    // 调试数据
    if (res.rows) {
      console.log('获取到角色数据条数:', Array.isArray(res.rows) ? res.rows.length : '非数组格式');
      if (Array.isArray(res.rows) && res.rows.length === 0) {
        console.log('警告: 角色列表为空数组');
      }
    } else {
      console.error('错误: 返回数据中没有rows字段');
    }
    
    // 正确处理API响应数据结构
    if (res && res.code === 200) {
      // 安全处理API返回数据
      if (res.rows && Array.isArray(res.rows)) {
        // 优先使用rows字段
        console.log('使用rows字段获取角色列表');
        roleList.value = res.rows;
      } else if (res.data && Array.isArray(res.data)) {
        // 如果没有rows字段，使用data字段
        console.log('使用data字段获取角色列表');
        roleList.value = res.data;
      } else {
        // 兜底处理
        console.error('无法在响应中找到有效的角色数据数组');
        roleList.value = [];
      }
      
      // 安全处理分页信息
      pagination.total = res.total || res.pageInfo?.total || 0;
      console.log('设置分页总数:', pagination.total);
    } else {
      const errorMsg = res?.msg || '获取角色列表失败';
      message.error(errorMsg);
      console.error('获取角色列表失败:', errorMsg);
    }
  } catch (error) {
    console.error('获取角色列表出错:', error);
    message.error('获取角色列表失败');
  } finally {
    loading.value = false;
  }
};

// 查询按钮操作
const handleQuery = () => {
  pagination.current = 1;
  getList();
};

// 重置查询
const resetQuery = () => {
  if (formRef.value) {
    queryParams.role_name = undefined;
    queryParams.role_key = undefined;
    queryParams.status = undefined;
    pagination.current = 1;
    getList();
  }
};

// 表格变化
const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  getList();
};

// 刷新表格
const refreshTable = () => {
  getList();
};

// 多选框选中事件
const onSelectChange = (selectedKeys: number[]) => {
  selectedRowKeys.value = selectedKeys;
};

// 新增角色按钮操作
const handleAdd = () => {
  resetForm();
  open.value = true;
};

// 编辑角色按钮操作
const handleEdit = async (record: any) => {
  resetForm();
  const roleId = record.role_id;
  try {
    const response = await getRoleApiV1SystemRoleRoleIdGet({ role_id: roleId });
    const res = response as any;
    
    if (res && res.code === 200 && res.data) {
      const roleData = res.data;
      Object.assign(form, {
        role_id: roleData.role_id,
        role_name: roleData.role_name,
        role_key: roleData.role_key,
        role_sort: roleData.role_sort,
        status: roleData.status,
        remark: roleData.remark
      });
      
      open.value = true;
    } else {
      message.error(res?.msg || '获取角色详情失败');
    }
  } catch (error) {
    console.error('获取角色详情出错:', error);
    message.error('获取角色详情失败');
  }
};

// 分配权限按钮操作
const handleAssignMenu = async (record: any) => {
  currentRole.value = record;
  menuLoading.value = true;
  menuOpen.value = true;
  
  try {
    const menuResponse = await getRoleMenusApiV1SystemMenuRoleRoleIdGet({ role_id: record.role_id });
    const menuRes = menuResponse as any;
    
    if (menuRes && menuRes.code === 200) {
      menuTree.value = menuRes.data || [];
      
      // 获取角色已分配的菜单ID
      const roleResponse = await getRoleApiV1SystemRoleRoleIdGet({ role_id: record.role_id });
      const roleRes = roleResponse as any;
      
      if (roleRes && roleRes.code === 200 && roleRes.data) {
        checkedMenuKeys.value = roleRes.data.menu_ids || [];
      }
    } else {
      message.error(menuRes?.msg || '获取菜单树失败');
    }
  } catch (error) {
    console.error('获取菜单权限出错:', error);
    message.error('获取菜单权限失败');
  } finally {
    menuLoading.value = false;
  }
};

// 提交权限分配
const submitMenuAssign = async () => {
  menuSubmitLoading.value = true;
  try {
    const response = await updateRoleApiV1SystemRoleRoleIdPut(
      { role_id: currentRole.value.role_id },
      { 
        menu_ids: checkedMenuKeys.value,
        role_name: currentRole.value.role_name,
        role_key: currentRole.value.role_key,
        role_sort: currentRole.value.role_sort,
        status: currentRole.value.status
      }
    );
    const res = response as any;
    
    if (res && res.code === 200) {
      message.success('权限分配成功');
      menuOpen.value = false;
    } else {
      message.error(res?.msg || '权限分配失败');
    }
  } catch (error) {
    console.error('权限分配出错:', error);
    message.error('权限分配失败');
  } finally {
    menuSubmitLoading.value = false;
  }
};

// 删除角色
const handleDelete = async (record: any) => {
  try {
    const response = await deleteRoleApiV1SystemRoleRoleIdDelete({ role_id: record.role_id });
    const res = response as any;
    
    if (res && res.code === 200) {
      message.success('删除成功');
      getList();
    } else {
      message.error(res?.msg || '删除失败');
    }
  } catch (error) {
    console.error('删除角色出错:', error);
    message.error('删除失败');
  }
};

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请至少选择一条记录');
    return;
  }
  
  try {
    // 循环删除所选角色
    for (const roleId of selectedRowKeys.value) {
      await deleteRoleApiV1SystemRoleRoleIdDelete({ role_id: roleId });
    }
    message.success('批量删除成功');
    getList();
    selectedRowKeys.value = [];
  } catch (error) {
    console.error('批量删除出错:', error);
    message.error('批量删除失败');
  }
};

// 提交表单
const submitForm = () => {
  formRef.value?.validate().then(async () => {
    submitLoading.value = true;
    try {
      if (form.role_id) {
        // 编辑
        const response = await updateRoleApiV1SystemRoleRoleIdPut(
          { role_id: form.role_id },
          {
            role_name: form.role_name,
            role_key: form.role_key,
            role_sort: form.role_sort,
            status: form.status,
            data_scope: form.data_scope,
            menu_ids: form.menu_ids
          }
        );
        const res = response as any;
        
        if (res && res.code === 200) {
          message.success('修改成功');
          open.value = false;
          getList();
        } else {
          message.error(res?.msg || '修改失败');
        }
      } else {
        // 新增
        const response = await createRoleApiV1SystemRolePost({
          role_name: form.role_name,
          role_key: form.role_key,
          role_sort: form.role_sort,
          status: form.status,
          data_scope: form.data_scope,
          menu_ids: form.menu_ids
        });
        const res = response as any;
        
        if (res && res.code === 200) {
          message.success('新增成功');
          open.value = false;
          getList();
        } else {
          message.error(res?.msg || '新增失败');
        }
      }
    } catch (error) {
      console.error('提交表单出错:', error);
      message.error('操作失败');
    } finally {
      submitLoading.value = false;
    }
  });
};

// 取消按钮
const cancel = () => {
  open.value = false;
  resetForm();
};

// 重置表单
const resetForm = () => {
  form.role_id = undefined;
  form.role_name = '';
  form.role_key = '';
  form.role_sort = 0;
  form.status = '0';
  form.data_scope = undefined;
  form.menu_ids = [];
  form.remark = '';
};
</script>

<style lang="less" scoped>
.role-container {
  padding: 12px;
  
  .search-card {
    margin-bottom: 16px;
  }
  
  .table-card {
    .ant-card-body {
      padding-top: 0;
    }
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 24px;
  }
  
  :deep(.ant-form-item) {
    margin-bottom: 16px;
  }
  
  :deep(.ant-table-pagination.ant-pagination) {
    margin: 16px 0;
  }
  
  @media (max-width: 768px) {
    padding: 8px;
    
    .ant-form-inline .ant-form-item {
      margin-bottom: 16px;
    }
  }
}
</style> 