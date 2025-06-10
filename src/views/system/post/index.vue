<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="部门名称" prop="dept_name">
          <el-input v-model="queryParams.dept_name" placeholder="请输入部门名称" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="部门状态" clearable>
            <el-option label="正常" value="0" />
            <el-option label="停用" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="operate-box">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" @click="handleExpandAll">展开/折叠</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 部门表格数据 -->
    <el-table
      v-loading="loading"
      :data="deptList"
      row-key="dept_id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      border
      :expand-row-keys="expandKeys"
      ref="deptTable"
    >
      <el-table-column prop="dept_name" label="部门名称" width="260"></el-table-column>
      <el-table-column prop="order_num" label="排序" width="100"></el-table-column>
      <el-table-column prop="leader" label="负责人" width="120"></el-table-column>
      <el-table-column prop="phone" label="联系电话" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === '0' ? 'success' : 'info'">
            {{ scope.row.status === '0' ? '正常' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="create_time" width="200"></el-table-column>
      <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="primary" link @click="handleAdd(scope.row)">新增</el-button>
          <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑部门对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="deptForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="上级部门" prop="parent_id">
          <el-tree-select
            v-model="form.parent_id"
            :data="deptOptions"
            :props="{ label: 'label', value: 'id', children: 'children' }"
            placeholder="选择上级部门"
            clearable
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="dept_name">
          <el-input v-model="form.dept_name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="显示排序" prop="order_num">
          <el-input-number v-model="form.order_num" :min="0" />
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
        </el-form-item>
        <el-form-item label="部门状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  listDeptsApiV1SystemDeptGet,
  getDeptOptionsApiV1SystemDeptSelectOptionsGet,
  createDeptApiV1SystemDeptPost,
  updateDeptApiV1SystemDeptDeptIdPut,
  deleteDeptApiV1SystemDeptDeptIdDelete,
  getDeptTreeApiV1SystemDeptTreeGet
} from '@/api/bumenguanli'

// 部门列表数据
const deptList = ref([])
const loading = ref(false)
const expandKeys = ref([])
const deptOptions = ref([])

// 查询参数
const queryParams = reactive({
  dept_name: '',
  status: ''
})

// 表单参数
const open = ref(false)
const title = ref('')
const form = reactive({
  dept_id: undefined,
  parent_id: 0,
  dept_name: '',
  order_num: 0,
  leader: '',
  phone: '',
  email: '',
  status: '0'
})

// 表单校验规则
const rules = {
  dept_name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
  order_num: [{ required: true, message: '显示排序不能为空', trigger: 'blur' }],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

// 表格树
const deptTable = ref(null)

// 初始化
onMounted(() => {
  getDeptList()
  getDeptTreeSelect()
})

// 查询部门列表
const getDeptList = async () => {
  loading.value = true
  try {
    const res = await listDeptsApiV1SystemDeptGet({})
    if (res.code === 0 && res.data) {
      deptList.value = res.data
      // 默认展开第一级
      expandKeys.value = deptList.value.map(item => item.dept_id)
    }
  } finally {
    loading.value = false
  }
}

// 查询部门下拉树结构
const getDeptTreeSelect = async () => {
  try {
    const res = await getDeptOptionsApiV1SystemDeptSelectOptionsGet()
    if (res.code === 0 && res.data) {
      deptOptions.value = res.data
    }
  } catch (error) {
    console.error('获取部门选项失败', error)
  }
}

// 展开/折叠操作
const handleExpandAll = () => {
  if (expandKeys.value && expandKeys.value.length) {
    expandKeys.value = []
  } else {
    expandKeys.value = deptList.value.map(item => item.dept_id)
  }
}

// 搜索按钮操作
const handleQuery = () => {
  getDeptList()
}

// 重置按钮操作
const resetQuery = () => {
  queryParams.dept_name = ''
  queryParams.status = ''
  handleQuery()
}

// 新增按钮操作
const handleAdd = (row?) => {
  reset()
  if (row) {
    form.parent_id = row.dept_id
  }
  title.value = '新增部门'
  open.value = true
}

// 编辑按钮操作
const handleEdit = (row) => {
  reset()
  form.dept_id = row.dept_id
  form.parent_id = row.parent_id
  form.dept_name = row.dept_name
  form.order_num = row.order_num
  form.leader = row.leader
  form.phone = row.phone
  form.email = row.email
  form.status = row.status
  
  title.value = '编辑部门'
  open.value = true
}

// 表单重置
const reset = () => {
  form.dept_id = undefined
  form.parent_id = 0
  form.dept_name = ''
  form.order_num = 0
  form.leader = ''
  form.phone = ''
  form.email = ''
  form.status = '0'
}

// 取消按钮
const cancel = () => {
  open.value = false
  reset()
}

// 提交表单
const submitForm = async () => {
  const deptForm = document.querySelector('form') as any
  try {
    await deptForm.validate()
    if (form.dept_id) {
      // 修改部门
      const res = await updateDeptApiV1SystemDeptDeptIdPut(
        { dept_id: form.dept_id }, 
        form
      )
      if (res.code === 0) {
        ElMessage.success('修改成功')
        open.value = false
        getDeptList()
      }
    } else {
      // 新增部门
      const res = await createDeptApiV1SystemDeptPost(form)
      if (res.code === 0) {
        ElMessage.success('新增成功')
        open.value = false
        getDeptList()
      }
    }
  } catch (error) {
    console.error('提交表单失败', error)
  }
}

// 删除按钮操作
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确认删除部门 ${row.dept_name} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const res = await deleteDeptApiV1SystemDeptDeptIdDelete({ dept_id: row.dept_id })
      if (res.code === 0) {
        ElMessage.success('删除成功')
        getDeptList()
      }
    } catch (error) {
      console.error('删除失败', error)
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.search-box {
  margin-bottom: 20px;
}

.operate-box {
  margin-bottom: 20px;
}

.mb8 {
  margin-bottom: 8px;
}

.dialog-footer {
  text-align: center;
}
</style> 