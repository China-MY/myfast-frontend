<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="queryParams.role_name"
        placeholder="角色名称"
        class="filter-item"
        style="width: 200px;"
        @keyup.enter="handleQuery"
      />
      <el-button type="primary" class="filter-item" @click="handleQuery">
        查询
      </el-button>
      <el-button type="success" class="filter-item" @click="handleAdd">
        新增
      </el-button>
    </div>

    <!-- 角色列表 -->
    <el-table
      v-loading="loading"
      :data="roleList"
      style="width: 100%; margin-top: 15px;"
    >
      <el-table-column label="角色ID" prop="role_id" align="center" width="80" />
      <el-table-column label="角色名称" prop="role_name" align="center" />
      <el-table-column label="角色标识" prop="role_key" align="center" />
      <el-table-column label="排序" prop="role_sort" align="center" width="80" />
      <el-table-column label="状态" prop="status" align="center" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">
            {{ scope.row.status === '0' ? '正常' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="create_time" align="center" width="180" />
      <el-table-column label="操作" align="center" width="230">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="pagination-container">
      <el-config-provider :locale="locale">
        <div>
          <!-- 添加自定义的总数显示 -->
          <span class="total-text">共 {{ total }} 条记录</span>
          <el-pagination
            v-model:current-page="queryParams.page"
            v-model:page-size="queryParams.page_size"
            :page-sizes="[10, 20, 30, 50]"
            :total="total"
            :locale="paginationLocale"
            background
            :layout="paginationLayout"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-config-provider>
    </div>

    <!-- 添加/编辑角色对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
      append-to-body
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="roleRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="roleForm.role_name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色标识" prop="role_key">
          <el-input v-model="roleForm.role_key" placeholder="请输入角色标识" />
        </el-form-item>
        <el-form-item label="角色排序" prop="role_sort">
          <el-input-number v-model="roleForm.role_sort" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="roleForm.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="roleForm.remark"
            type="textarea"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElConfigProvider } from 'element-plus'
import type { FormInstance } from 'element-plus'
import {
  listRolesApiV1SystemRoleListGet,
  createRoleApiV1SystemRolePost,
  updateRoleApiV1SystemRoleRoleIdPut,
  deleteRoleApiV1SystemRoleRoleIdDelete,
  getRoleApiV1SystemRoleRoleIdGet
} from '@/api/jiaoseguanli'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// Element Plus 本地化配置
const locale = zhCn

// 自定义分页文本配置
const paginationLocale = reactive({
  ...zhCn.el.pagination,
  goto: '前往',
  pagesize: '条/页',
  total: '共 {total} 条记录',
  pageClassifier: '页',
  prevText: '上一页',
  nextText: '下一页'
})

// 可以显示中文的分页组件布局
const paginationLayout = "sizes, prev, pager, next, jumper"

// 列表数据
const loading = ref(false)
const roleList = ref<any[]>([])
const total = ref(0)

// 查询参数
const queryParams = reactive({
  page: 1,
  page_size: 10,
  role_name: ''
})

// 表单参数
const roleFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const roleForm = reactive({
  role_id: undefined as number | undefined,
  role_name: '',
  role_key: '',
  role_sort: 0,
  status: '0',
  remark: ''
})

// 表单验证规则
const roleRules = {
  role_name: [
    { required: true, message: '角色名称不能为空', trigger: 'blur' },
    { min: 2, max: 20, message: '角色名称长度应在2-20个字符之间', trigger: 'blur' }
  ],
  role_key: [
    { required: true, message: '角色标识不能为空', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '角色标识只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  role_sort: [
    { required: true, message: '角色排序不能为空', trigger: 'blur' },
    { type: 'number', message: '角色排序必须为数字', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '状态不能为空', trigger: 'change' }
  ]
}

// 初始化
onMounted(() => {
  getList()
})

// 获取角色列表
const getList = async () => {
  loading.value = true
  try {
    console.log('获取角色列表，参数:', queryParams)
    const response = await listRolesApiV1SystemRoleListGet(queryParams)
    console.log('角色列表响应:', response)
    
    if (response.data) {
      // 正确处理API返回的数据结构
      // API返回的数据结构为 {code, msg, rows, total, page, page_size}
      const res = response.data
      
      if (res.code === 200) {
        // 使用rows作为数据源
        roleList.value = res.rows || []
        total.value = res.total || 0
        
        console.log('角色列表数据加载成功:', roleList.value)
      } else {
        ElMessage.error(res.msg || '获取角色列表失败')
      }
    }
  } catch (error) {
    console.error('获取角色列表失败:', error)
    ElMessage.error('获取角色列表失败')
  } finally {
    loading.value = false
  }
}

// 查询按钮操作
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

// 重置表单
const resetForm = () => {
  if (roleFormRef.value) {
    roleFormRef.value.resetFields()
  }
  roleForm.role_id = undefined
  roleForm.role_name = ''
  roleForm.role_key = ''
  roleForm.role_sort = 0
  roleForm.status = '0'
  roleForm.remark = ''
}

// 添加角色
const handleAdd = () => {
  resetForm()
  isEdit.value = false
  dialogTitle.value = '添加角色'
  dialogVisible.value = true
}

// 编辑角色
const handleEdit = async (row: any) => {
  resetForm()
  isEdit.value = true
  dialogTitle.value = '编辑角色'
  try {
    console.log('获取角色详情，ID:', row.role_id)
    const response = await getRoleApiV1SystemRoleRoleIdGet({ role_id: row.role_id })
    console.log('获取角色详情响应:', response)
    
    const data = response.data
    
    if (data && data.code === 200) {
      // API返回结构为 {code, msg, data}
      const roleData = data.data
      
      if (roleData) {
        console.log('获取到的角色数据:', roleData)
        
        // 设置表单数据
        roleForm.role_id = roleData.role_id
        roleForm.role_name = roleData.role_name || ''
        roleForm.role_key = roleData.role_key || ''
        roleForm.role_sort = roleData.role_sort || 0
        roleForm.status = roleData.status || '0'
        roleForm.remark = roleData.remark || ''
      } else {
        // 如果直接返回的是角色数据
        ElMessage.warning('获取角色数据格式异常')
      }
    } else if (data) {
      // 直接返回角色数据
      console.log('直接获取到的角色数据:', data)
      
      roleForm.role_id = row.role_id
      roleForm.role_name = row.role_name
      roleForm.role_key = row.role_key
      roleForm.role_sort = row.role_sort
      roleForm.status = row.status
      roleForm.remark = row.remark || ''
    }
    
    dialogVisible.value = true
  } catch (error) {
    console.error('获取角色详情失败:', error)
    ElMessage.error('获取角色详情失败')
  }
}

// 提交表单
const submitForm = async () => {
  if (!roleFormRef.value) return
  
  await roleFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    
    try {
      if (isEdit.value && roleForm.role_id) {
        // 更新角色
        await updateRoleApiV1SystemRoleRoleIdPut(
          { role_id: roleForm.role_id },
          {
            role_name: roleForm.role_name,
            role_key: roleForm.role_key,
            role_sort: roleForm.role_sort,
            status: roleForm.status
          }
        )
        ElMessage.success('修改成功')
      } else {
        // 创建角色
        await createRoleApiV1SystemRolePost({
          role_name: roleForm.role_name,
          role_key: roleForm.role_key,
          role_sort: roleForm.role_sort,
          status: roleForm.status
        })
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      getList()
    } catch (error) {
      console.error('保存角色失败:', error)
      ElMessage.error('保存失败')
    }
  })
}

// 删除角色
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确认删除角色"${row.role_name}"吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteRoleApiV1SystemRoleRoleIdDelete({ role_id: row.role_id })
      ElMessage.success('删除成功')
      getList()
    } catch (error) {
      console.error('删除角色失败:', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

// 每页数量变化
const handleSizeChange = (size: number) => {
  queryParams.page_size = size
  getList()
}

// 页码变化
const handleCurrentChange = (page: number) => {
  queryParams.page = page
  getList()
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.filter-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.filter-item {
  margin-right: 10px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.pagination-container > div > div {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.total-text {
  margin-right: 15px;
  font-size: 14px;
  color: #606266;
}
</style> 