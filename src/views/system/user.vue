<template>
  <div class="app-container">
    <a-card :bordered="false">
      <!-- 查询表单 -->
      <a-form :model="queryParams" ref="queryForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" layout="inline">
        <a-form-item label="用户名称" name="username">
          <a-input v-model:value="queryParams.username" placeholder="请输入用户名称" allow-clear style="width: 240px" />
        </a-form-item>
        <a-form-item label="手机号码" name="phonenumber">
          <a-input v-model:value="queryParams.phonenumber" placeholder="请输入手机号码" allow-clear style="width: 240px" />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-select v-model:value="queryParams.status" placeholder="用户状态" allow-clear style="width: 240px">
            <a-select-option value="0">正常</a-select-option>
            <a-select-option value="1">停用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleQuery">
            <template #icon><SearchOutlined /></template>
            搜索
          </a-button>
          <a-button style="margin-left: 8px" @click="resetQuery">
            <template #icon><RedoOutlined /></template>
            重置
          </a-button>
        </a-form-item>
      </a-form>

      <!-- 操作按钮 -->
      <div class="table-operations">
        <a-button type="primary" v-has-perm="['system:user:add']" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          新增
        </a-button>
        <a-button type="danger" :disabled="multiple" v-has-perm="['system:user:remove']" @click="handleDelete">
          <template #icon><DeleteOutlined /></template>
          删除
        </a-button>
        <a-button type="primary" @click="handleExport" v-has-perm="['system:user:export']">
          <template #icon><ExportOutlined /></template>
          导出
        </a-button>
      </div>

      <!-- 数据表格 -->
      <a-table
        v-loading="loading"
        :columns="columns"
        :data-source="userList"
        :pagination="pagination"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
        row-key="user_id"
      >
        <!-- 用户状态 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <a-switch
              :checked="record.status === '0'"
              @change="(checked) => handleStatusChange(record, checked)"
              :loading="record.statusLoading"
              checked-children="正常"
              un-checked-children="停用"
              v-has-perm="['system:user:edit']"
            />
          </template>

          <!-- 操作列 -->
          <template v-else-if="column.dataIndex === 'operation'">
            <a @click="handleUpdate(record)" v-has-perm="['system:user:edit']">修改</a>
            <a-divider type="vertical" />
            <a @click="handleResetPwd(record)" v-has-perm="['system:user:resetPwd']">重置密码</a>
            <a-divider type="vertical" />
            <a @click="handleDelete(record)" v-has-perm="['system:user:remove']">删除</a>
          </template>
        </template>
      </a-table>

      <!-- 添加或修改用户对话框 -->
      <a-modal
        :title="title"
        :visible="open"
        :confirm-loading="submitLoading"
        @ok="submitForm"
        @cancel="cancel"
        width="600px"
      >
        <a-form ref="form" :model="form" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <!-- 用户表单内容 -->
          <a-form-item label="用户名称" name="username">
            <a-input v-model:value="form.username" placeholder="请输入用户名称" :disabled="form.user_id !== undefined" />
          </a-form-item>
          <a-form-item label="用户昵称" name="nickname">
            <a-input v-model:value="form.nickname" placeholder="请输入用户昵称" />
          </a-form-item>
          <a-form-item label="密码" name="password" v-if="!form.user_id">
            <a-input-password v-model:value="form.password" placeholder="请输入密码" />
          </a-form-item>
          <a-form-item label="部门" name="dept_id">
            <a-tree-select
              v-model:value="form.dept_id"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="deptOptions"
              placeholder="请选择归属部门"
              tree-default-expand-all
            />
          </a-form-item>
          <a-form-item label="手机号码" name="phonenumber">
            <a-input v-model:value="form.phonenumber" placeholder="请输入手机号码" />
          </a-form-item>
          <a-form-item label="邮箱" name="email">
            <a-input v-model:value="form.email" placeholder="请输入邮箱" />
          </a-form-item>
          <a-form-item label="性别" name="sex">
            <a-select v-model:value="form.sex" placeholder="请选择性别">
              <a-select-option value="0">男</a-select-option>
              <a-select-option value="1">女</a-select-option>
              <a-select-option value="2">未知</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="状态" name="status">
            <a-radio-group v-model:value="form.status">
              <a-radio value="0">正常</a-radio>
              <a-radio value="1">停用</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="角色" name="role_ids">
            <a-checkbox-group v-model:value="form.role_ids">
              <a-checkbox v-for="role in roleOptions" :key="role.role_id" :value="role.role_id">{{ role.role_name }}</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item label="岗位" name="post_ids">
            <a-checkbox-group v-model:value="form.post_ids">
              <a-checkbox v-for="post in postOptions" :key="post.post_id" :value="post.post_id">{{ post.post_name }}</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item label="备注" name="remark">
            <a-textarea v-model:value="form.remark" placeholder="请输入备注" />
          </a-form-item>
        </a-form>
      </a-modal>

      <!-- 用户导入对话框 -->
      <a-modal
        title="导入用户"
        :visible="importOpen"
        @ok="handleImportOk"
        @cancel="importOpen = false"
        width="400px"
      >
        <a-upload
          name="file"
          :headers="headers"
          :action="importUrl"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          @change="handleImportChange"
        >
          <a-button>
            <template #icon><UploadOutlined /></template>
            选择文件
          </a-button>
        </a-upload>
        <div style="margin-top: 20px">
          <a-button type="link" @click="downloadTemplate">下载模板</a-button>
        </div>
      </a-modal>

      <!-- 用户密码重置对话框 -->
      <a-modal
        title="重置密码"
        :visible="resetPwdOpen"
        @ok="handleResetPwdOk"
        @cancel="resetPwdOpen = false"
        width="400px"
      >
        <a-form ref="resetPwdForm" :model="resetPwdForm" :rules="resetPwdRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-form-item label="新密码" name="password">
            <a-input-password v-model:value="resetPwdForm.password" placeholder="请输入新密码" />
          </a-form-item>
          <a-form-item label="确认密码" name="confirmPassword">
            <a-input-password v-model:value="resetPwdForm.confirmPassword" placeholder="请再次输入新密码" />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import { message, Modal } from 'ant-design-vue';
import {
  SearchOutlined, RedoOutlined, PlusOutlined, DeleteOutlined,
  ExportOutlined, UploadOutlined
} from '@ant-design/icons-vue';
import { listUser, getUser, delUser, addUser, updateUser, resetUserPwd } from '@/api/system/user';
import { listRole } from '@/api/system/role';
import { listPost } from '@/api/system/post';
import { treeselect } from '@/api/system/dept';

export default {
  name: 'User',
  components: {
    SearchOutlined,
    RedoOutlined,
    PlusOutlined,
    DeleteOutlined,
    ExportOutlined,
    UploadOutlined
  },
  setup() {
    // 遮罩层
    const loading = ref(false);
    const submitLoading = ref(false);

    // 选中数组
    const selectedRowKeys = ref([]);

    // 非单个禁用
    const single = computed(() => selectedRowKeys.value.length !== 1);

    // 非多个禁用
    const multiple = computed(() => selectedRowKeys.value.length === 0);

    // 显示搜索条件
    const showSearch = ref(true);

    // 总条数
    const total = ref(0);

    // 用户表格数据
    const userList = ref([]);

    // 弹出层标题
    const title = ref('');

    // 部门树选项
    const deptOptions = ref([]);

    // 角色选项
    const roleOptions = ref([]);

    // 岗位选项
    const postOptions = ref([]);

    // 是否显示弹出层
    const open = ref(false);
    const resetPwdOpen = ref(false);
    const importOpen = ref(false);

    // 导入参数
    const importUrl = process.env.VUE_APP_BASE_API + '/system/user/importData';

    // 查询参数
    const queryParams = reactive({
      page_num: 1,
      page_size: 10,
      username: undefined,
      phonenumber: undefined,
      status: undefined,
      dept_id: undefined
    });

    // 表单参数
    const form = reactive({
      user_id: undefined,
      dept_id: undefined,
      username: undefined,
      nickname: undefined,
      password: undefined,
      phonenumber: undefined,
      email: undefined,
      sex: '0',
      status: '0',
      role_ids: [],
      post_ids: [],
      remark: undefined
    });

    // 表单校验
    const rules = {
      username: [{ required: true, message: '用户名称不能为空', trigger: 'blur' }],
      nickname: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
      password: [{ required: true, message: '用户密码不能为空', trigger: 'blur' }],
      email: [
        { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
      ],
      phonenumber: [
        { required: true, message: '手机号码不能为空', trigger: 'blur' },
        { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }
      ]
    };

    // 重置密码表单
    const resetPwdForm = reactive({
      user_id: undefined,
      password: undefined,
      confirmPassword: undefined
    });

    // 重置密码表单校验
    const resetPwdRules = {
      password: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
      confirmPassword: [
        { required: true, message: '确认密码不能为空', trigger: 'blur' },
        { validator: validateConfirmPassword, trigger: 'blur' }
      ]
    };

    // 验证确认密码是否一致
    function validateConfirmPassword(rule, value, callback) {
      if (value !== resetPwdForm.password) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    }

    // 表格列定义
    const columns = [
      {
        title: '用户编号',
        dataIndex: 'user_id',
        key: 'user_id',
        align: 'center'
      },
      {
        title: '用户名称',
        dataIndex: 'username',
        key: 'username',
        align: 'center'
      },
      {
        title: '用户昵称',
        dataIndex: 'nickname',
        key: 'nickname',
        align: 'center'
      },
      {
        title: '部门',
        dataIndex: 'dept_name',
        key: 'dept_name',
        align: 'center'
      },
      {
        title: '手机号码',
        dataIndex: 'phonenumber',
        key: 'phonenumber',
        align: 'center'
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        align: 'center',
        sorter: true
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center'
      }
    ];

    // 分页配置
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true,
      showTotal: (total) => `共 ${total} 条`
    });

    // 生命周期钩子
    onMounted(() => {
      // 获取用户列表
      getList();
      // 获取部门树列表
      getDeptTree();
      // 获取角色列表
      getRoleOptions();
      // 获取岗位列表
      getPostOptions();
    });

    // 查询用户列表
    function getList() {
      loading.value = true;
      listUser(queryParams).then(response => {
        userList.value = response.data.rows;
        pagination.total = response.data.total;
        loading.value = false;
      });
    }

    // 获取部门树列表
    function getDeptTree() {
      treeselect().then(response => {
        deptOptions.value = response.data;
      });
    }

    // 获取角色列表
    function getRoleOptions() {
      listRole().then(response => {
        roleOptions.value = response.data.rows;
      });
    }

    // 获取岗位列表
    function getPostOptions() {
      listPost().then(response => {
        postOptions.value = response.data.rows;
      });
    }

    // 表格选择行变化事件
    function onSelectChange(selection) {
      selectedRowKeys.value = selection;
    }

    // 表格变化事件
    function handleTableChange(pagination, filters, sorter) {
      queryParams.page_num = pagination.current;
      queryParams.page_size = pagination.pageSize;
      if (sorter.field) {
        queryParams.sort_by = sorter.field;
        queryParams.sort_order = sorter.order === 'ascend' ? 'asc' : 'desc';
      }
      getList();
    }

    // 搜索按钮操作
    function handleQuery() {
      queryParams.page_num = 1;
      getList();
    }

    // 重置按钮操作
    function resetQuery() {
      Object.assign(queryParams, {
        page_num: 1,
        page_size: 10,
        username: undefined,
        phonenumber: undefined,
        status: undefined,
        dept_id: undefined
      });
      getList();
    }

    // 新增按钮操作
    function handleAdd() {
      reset();
      open.value = true;
      title.value = '添加用户';
    }

    // 修改按钮操作
    function handleUpdate(row) {
      reset();
      const userId = row.user_id || selectedRowKeys.value[0];
      getUser(userId).then(response => {
        Object.assign(form, response.data);
        form.role_ids = response.data.roles.map(item => item.role_id);
        form.post_ids = response.data.posts.map(item => item.post_id);
        open.value = true;
        title.value = '修改用户';
      });
    }

    // 重置密码按钮操作
    function handleResetPwd(row) {
      resetPwdForm.user_id = row.user_id;
      resetPwdForm.password = '';
      resetPwdForm.confirmPassword = '';
      resetPwdOpen.value = true;
    }

    // 删除按钮操作
    function handleDelete(row) {
      const userIds = row.user_id || selectedRowKeys.value;
      Modal.confirm({
        title: '警告',
        content: `确认删除用户编号为"${userIds}"的数据吗？`,
        okText: '确认',
        cancelText: '取消',
        onOk() {
          return delUser(userIds).then(() => {
            getList();
            message.success('删除成功');
          });
        }
      });
    }

    // 导出按钮操作
    function handleExport() {
      // 实现导出功能
    }

    // 表单重置
    function reset() {
      Object.assign(form, {
        user_id: undefined,
        dept_id: undefined,
        username: undefined,
        nickname: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: '0',
        status: '0',
        role_ids: [],
        post_ids: [],
        remark: undefined
      });
    }

    // 取消按钮
    function cancel() {
      open.value = false;
      reset();
    }

    // 提交按钮
    function submitForm() {
      submitLoading.value = true;
      if (form.user_id !== undefined) {
        updateUser(form).then(response => {
          message.success('修改成功');
          open.value = false;
          getList();
        }).finally(() => {
          submitLoading.value = false;
        });
      } else {
        addUser(form).then(response => {
          message.success('新增成功');
          open.value = false;
          getList();
        }).finally(() => {
          submitLoading.value = false;
        });
      }
    }

    // 重置密码确认
    function handleResetPwdOk() {
      if (resetPwdForm.password !== resetPwdForm.confirmPassword) {
        message.error('两次输入的密码不一致');
        return;
      }

      resetUserPwd({
        user_id: resetPwdForm.user_id,
        new_password: resetPwdForm.password
      }).then(() => {
        message.success('密码重置成功');
        resetPwdOpen.value = false;
      });
    }

    // 导入相关函数
    function beforeUpload(file) {
      // 实现上传前校验
      return false;
    }

    function handleImportChange(info) {
      // 处理上传状态变化
    }

    function handleImportOk() {
      // 处理导入确认
      importOpen.value = false;
    }

    function downloadTemplate() {
      // 下载导入模板
    }

    // 修改用户状态
    function handleStatusChange(row, status) {
      const text = status ? '启用' : '停用';
      row.statusLoading = true;
      updateUser({
        user_id: row.user_id,
        status: status ? '0' : '1'
      }).then(() => {
        row.status = status ? '0' : '1';
        message.success(`${text}成功`);
      }).finally(() => {
        row.statusLoading = false;
      });
    }

    return {
      loading,
      submitLoading,
      selectedRowKeys,
      single,
      multiple,
      showSearch,
      total,
      userList,
      title,
      deptOptions,
      roleOptions,
      postOptions,
      open,
      resetPwdOpen,
      importOpen,
      importUrl,
      queryParams,
      form,
      rules,
      resetPwdForm,
      resetPwdRules,
      columns,
      pagination,
      getList,
      onSelectChange,
      handleTableChange,
      handleQuery,
      resetQuery,
      handleAdd,
      handleUpdate,
      handleResetPwd,
      handleDelete,
      handleExport,
      cancel,
      submitForm,
      handleResetPwdOk,
      beforeUpload,
      handleImportChange,
      handleImportOk,
      downloadTemplate,
      handleStatusChange
    };
  }
};
</script>

<style scoped>
.table-operations {
  margin-bottom: 16px;
}
.table-operations > button {
  margin-right: 8px;
}
</style>
