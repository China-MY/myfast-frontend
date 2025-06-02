<template>
  <div class="role-container">
    <!-- 搜索表单 -->
    <a-card class="search-card" :bordered="false">
      <a-form layout="inline" :model="queryParams" @finish="handleQuery">
        <a-form-item label="角色名称" name="roleName">
          <a-input
            v-model:value="queryParams.roleName"
            placeholder="请输入角色名称"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="权限字符" name="roleKey">
          <a-input
            v-model:value="queryParams.roleKey"
            placeholder="请输入权限字符"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-select
            v-model:value="queryParams.status"
            placeholder="角色状态"
            style="width: 120px"
            allow-clear
          >
            <a-select-option value="0">正常</a-select-option>
            <a-select-option value="1">停用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit">查询</a-button>
            <a-button @click="resetQuery">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 操作按钮和表格 -->
    <a-card class="table-card" :bordered="false">
      <template #title>
        <a-space>
          <a-button type="primary" @click="handleAdd" v-permission="['system:role:add']">
            <plus-outlined />新增
          </a-button>
          <a-button type="danger" :disabled="selectedRowKeys.length === 0" @click="handleBatchDelete" v-permission="['system:role:remove']">
            <delete-outlined />删除
          </a-button>
        </a-space>
      </template>

      <a-table
        :columns="columns"
        :row-key="(record) => record.roleId"
        :data-source="roleList"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <a-switch
              :checked="record.status === '0'"
              :loading="record.id === statusLoading"
              @change="(checked) => handleStatusChange(record, checked)"
              v-permission="['system:role:edit']"
            />
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-space>
              <a-button type="link" @click="handleEdit(record)" v-permission="['system:role:edit']">
                编辑
              </a-button>
              <a-button type="link" @click="handleDelete(record)" v-permission="['system:role:remove']">
                删除
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 添加/编辑角色 -->
    <a-modal
      :title="modalTitle"
      :visible="modalVisible"
      :confirm-loading="modalLoading"
      @ok="handleModalSubmit"
      @cancel="modalVisible = false"
      width="700px"
    >
      <a-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="rules"
        label-col="{ span: 4 }"
        wrapper-col="{ span: 20 }"
      >
        <a-form-item label="角色名称" name="roleName">
          <a-input
            v-model:value="roleForm.roleName"
            placeholder="请输入角色名称"
          />
        </a-form-item>
        <a-form-item label="权限字符" name="roleKey">
          <a-input
            v-model:value="roleForm.roleKey"
            placeholder="请输入权限字符"
          />
        </a-form-item>
        <a-form-item label="显示顺序" name="roleSort">
          <a-input-number
            v-model:value="roleForm.roleSort"
            :min="0"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-radio-group v-model:value="roleForm.status">
            <a-radio value="0">正常</a-radio>
            <a-radio value="1">停用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="数据权限" name="dataScope">
          <a-select v-model:value="roleForm.dataScope">
            <a-select-option value="1">全部数据权限</a-select-option>
            <a-select-option value="2">自定义数据权限</a-select-option>
            <a-select-option value="3">本部门数据权限</a-select-option>
            <a-select-option value="4">本部门及以下数据权限</a-select-option>
            <a-select-option value="5">仅本人数据权限</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea
            v-model:value="roleForm.remark"
            placeholder="请输入备注"
            :rows="2"
          />
        </a-form-item>
        <a-form-item label="菜单权限" name="menuIds">
          <a-tree
            v-model:checked-keys="roleForm.menuIds"
            :tree-data="menuOptions"
            checkable
            check-strictly
          />
        </a-form-item>
        <a-form-item label="部门权限" name="deptIds" v-if="roleForm.dataScope === '2'">
          <a-tree
            v-model:checked-keys="roleForm.deptIds"
            :tree-data="deptOptions"
            checkable
            check-strictly
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch, nextTick } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { getRoleList, getRole, addRole, updateRole, deleteRole, changeRoleStatus } from '@/api/system/role';
import { getMenuTreeselect } from '@/api/system/menu';
import { getDeptTreeselect } from '@/api/system/dept';

// 表格列定义
const columns = [
  {
    title: '角色编号',
    dataIndex: 'roleId',
    width: 100,
  },
  {
    title: '角色名称',
    dataIndex: 'roleName',
    ellipsis: true,
  },
  {
    title: '权限字符',
    dataIndex: 'roleKey',
    ellipsis: true,
  },
  {
    title: '显示顺序',
    dataIndex: 'roleSort',
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 180,
  },
];

// 查询参数
const queryParams = reactive({
  roleName: '',
  roleKey: '',
  status: undefined,
  pageNum: 1,
  pageSize: 10,
});

// 状态
const loading = ref(false);
const roleList = ref<any[]>([]);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
});
const selectedRowKeys = ref<number[]>([]);
const statusLoading = ref<number | null>(null);

// 模态框状态
const modalVisible = ref(false);
const modalTitle = ref('添加角色');
const modalLoading = ref(false);
const roleFormRef = ref();
const roleForm = reactive({
  roleId: undefined,
  roleName: '',
  roleKey: '',
  roleSort: 0,
  status: '0',
  dataScope: '1',
  remark: '',
  menuIds: [] as number[],
  deptIds: [] as number[],
});

// 表单验证规则
const rules = {
  roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
  roleKey: [{ required: true, message: '权限字符不能为空', trigger: 'blur' }],
  roleSort: [{ required: true, message: '显示顺序不能为空', trigger: 'blur' }],
};

// 树形选择数据
const menuOptions = ref<any[]>([]);
const deptOptions = ref<any[]>([]);

// 初始化
onMounted(() => {
  getList();
});

// 获取角色列表
const getList = async () => {
  loading.value = true;
  try {
    const res = await getRoleList({
      ...queryParams,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    });
    roleList.value = res.rows;
    pagination.total = res.total;
  } catch (error) {
    console.error('获取角色列表失败', error);
  } finally {
    loading.value = false;
  }
};

// 查询
const handleQuery = () => {
  pagination.current = 1;
  getList();
};

// 重置查询
const resetQuery = () => {
  queryParams.roleName = '';
  queryParams.roleKey = '';
  queryParams.status = undefined;
  handleQuery();
};

// 表格变化
const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  getList();
};

// 选择行变化
const onSelectChange = (keys: number[]) => {
  selectedRowKeys.value = keys;
};

// 获取菜单树
const getMenuTree = async () => {
  try {
    const res = await getMenuTreeselect();
    menuOptions.value = res;
  } catch (error) {
    console.error('获取菜单树失败', error);
  }
};

// 获取部门树
const getDeptTree = async () => {
  try {
    const res = await getDeptTreeselect();
    deptOptions.value = res;
  } catch (error) {
    console.error('获取部门树失败', error);
  }
};

// 新增角色
const handleAdd = async () => {
  modalTitle.value = '添加角色';
  modalVisible.value = true;

  // 重置表单
  resetForm();

  // 获取树形选择数据
  await getMenuTree();
  await getDeptTree();
};

// 编辑角色
const handleEdit = async (record: any) => {
  modalTitle.value = '编辑角色';
  modalVisible.value = true;
  modalLoading.value = true;

  // 获取树形选择数据
  await getMenuTree();
  await getDeptTree();

  // 获取角色详情
  try {
    const res = await getRole(record.roleId);
    // 重置表单
    resetForm();

    // 填充表单数据
    Object.assign(roleForm, {
      roleId: res.roleId,
      roleName: res.roleName,
      roleKey: res.roleKey,
      roleSort: res.roleSort,
      status: res.status,
      dataScope: res.dataScope,
      remark: res.remark,
      menuIds: res.menuIds,
      deptIds: res.deptIds,
    });
  } catch (error) {
    console.error('获取角色详情失败', error);
  } finally {
    modalLoading.value = false;
  }
};

// 提交表单
const handleModalSubmit = () => {
  roleFormRef.value.validate().then(async () => {
    modalLoading.value = true;
    try {
      const formData = {
        ...roleForm,
      };

      if (roleForm.roleId) {
        // 更新
        await updateRole(formData);
        message.success('修改成功');
      } else {
        // 新增
        await addRole(formData);
        message.success('新增成功');
      }

      modalVisible.value = false;
      getList();
    } catch (error: any) {
      message.error(error.message || '操作失败');
    } finally {
      modalLoading.value = false;
    }
  });
};

// 重置表单
const resetForm = () => {
  roleForm.roleId = undefined;
  roleForm.roleName = '';
  roleForm.roleKey = '';
  roleForm.roleSort = 0;
  roleForm.status = '0';
  roleForm.dataScope = '1';
  roleForm.remark = '';
  roleForm.menuIds = [];
  roleForm.deptIds = [];

  // 清除表单验证
  nextTick(() => {
    roleFormRef.value?.resetFields();
  });
};

// 删除角色
const handleDelete = (record: any) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除角色 ${record.roleName} 吗？`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      try {
        await deleteRole(record.roleId);
        message.success('删除成功');
        // 如果当前页只有一条数据，且不是第一页，则跳转到上一页
        if (roleList.value.length === 1 && pagination.current > 1) {
          pagination.current -= 1;
        }
        getList();
      } catch (error: any) {
        message.error(error.message || '删除失败');
      }
    },
  });
};

// 批量删除
const handleBatchDelete = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请至少选择一条记录');
    return;
  }

  Modal.confirm({
    title: '确认批量删除',
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 条记录吗？`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      try {
        // 这里应该调用批量删除接口，但后端可能没有提供，所以我们循环调用单个删除
        for (const id of selectedRowKeys.value) {
          await deleteRole(id);
        }
        message.success('批量删除成功');
        selectedRowKeys.value = [];
        getList();
      } catch (error: any) {
        message.error(error.message || '批量删除失败');
      }
    },
  });
};

// 修改角色状态
const handleStatusChange = async (record: any, checked: boolean) => {
  const newStatus = checked ? '0' : '1';
  if (record.status === newStatus) return;

  statusLoading.value = record.roleId;
  try {
    await changeRoleStatus(record.roleId, newStatus);
    message.success(`${checked ? '启用' : '停用'}成功`);
    record.status = newStatus;
  } catch (error: any) {
    message.error(error.message || '操作失败');
  } finally {
    statusLoading.value = null;
  }
};

// 监听数据权限变化，显示/隐藏部门选择树
watch(() => roleForm.dataScope, (newVal) => {
  if (newVal === '2' && deptOptions.value.length === 0) {
    getDeptTree();
  }
});
</script>

<style lang="less" scoped>
.role-container {
  .search-card {
    margin-bottom: 16px;
  }

  .table-card {
    margin-bottom: 16px;
  }
}
</style>
