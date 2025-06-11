<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="queryParams.config_key"
        placeholder="参数键名"
        class="filter-item"
        style="width: 200px;"
        @keyup.enter="handleQuery"
      />
      <el-input
        v-model="queryParams.config_name"
        placeholder="参数名称"
        class="filter-item"
        style="width: 200px; margin-left: 10px;"
        @keyup.enter="handleQuery"
      />
      <el-button type="primary" class="filter-item" @click="handleQuery">
        查询
      </el-button>
      <el-button type="info" class="filter-item" @click="handleReset">
        重置
      </el-button>
      <el-button type="success" class="filter-item" @click="handleAdd">
        新增
      </el-button>
    </div>

    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="configList"
      style="width: 100%; margin-top: 15px;"
      border
    >
      <el-table-column label="参数ID" align="center" prop="config_id" width="80" />
      <el-table-column label="参数名称" align="center" prop="config_name" />
      <el-table-column label="参数键名" align="center" prop="config_key" />
      <el-table-column label="参数键值" align="center" prop="config_value" />
      <el-table-column label="系统内置" align="center" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.system_builtin ? 'danger' : 'success'">
            {{ scope.row.system_builtin ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="create_time" width="180" />
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" width="220">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleUpdate(scope.row)" :disabled="scope.row.system_builtin">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)" :disabled="scope.row.system_builtin">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="pagination-container">
      <el-config-provider :locale="locale">
        <div>
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
          <span class="total-text">共 {{ total }} 条记录</span>
        </div>
      </el-config-provider>
    </div>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
      append-to-body
      @close="resetForm"
    >
      <el-form
        ref="configFormRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="参数名称" prop="config_name">
          <el-input v-model="formData.config_name" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="参数键名" prop="config_key">
          <el-input v-model="formData.config_key" placeholder="请输入参数键名" />
        </el-form-item>
        <el-form-item label="参数键值" prop="config_value">
          <el-input v-model="formData.config_value" placeholder="请输入参数键值" />
        </el-form-item>
        <el-form-item label="系统内置" prop="system_builtin">
          <el-radio-group v-model="formData.system_builtin">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="info" @click="resetForm">重 置</el-button>
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
  listConfigsApiV1SystemConfigListGet,
  getConfigApiV1SystemConfigConfigIdGet,
  createConfigApiV1SystemConfigPost,
  updateConfigApiV1SystemConfigConfigIdPut,
  deleteConfigApiV1SystemConfigConfigIdDelete
} from '@/api/canshushezhi'
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

// 定义接口类型
interface ConfigItem {
  config_id: number;
  config_name: string;
  config_key: string;
  config_value: string;
  config_type?: string;
  remark?: string;
  create_by?: string;
  create_time?: string;
  update_by?: string;
  update_time?: string;
  system_builtin?: boolean; // 前端使用布尔值
}

// 加载状态
const loading = ref(false)

// 总记录数
const total = ref(0)

// 参数列表数据
const configList = ref<ConfigItem[]>([])

// 查询参数
const queryParams = reactive({
  page: 1,
  page_size: 10,
  config_key: '',
  config_name: ''
})

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)

// 表单对象
const configFormRef = ref<FormInstance>()
const formData = reactive<{
  config_id: number;
  config_name: string;
  config_key: string;
  config_value: string;
  config_type?: string;
  remark?: string;
  system_builtin?: boolean;
}>({
  config_id: 0,
  config_name: '',
  config_key: '',
  config_value: '',
  config_type: 'N',
  remark: '',
  system_builtin: false
})

// 表单校验规则
const formRules = reactive({
  config_name: [
    { required: true, message: '参数名称不能为空', trigger: 'blur' },
    { min: 2, max: 50, message: '参数名称长度必须在2到50之间', trigger: 'blur' }
  ],
  config_key: [
    { required: true, message: '参数键名不能为空', trigger: 'blur' },
    { min: 1, max: 100, message: '参数键名长度必须在1到100之间', trigger: 'blur' }
  ],
  config_value: [
    { required: true, message: '参数键值不能为空', trigger: 'blur' }
  ]
})

// 初始化
onMounted(() => {
  getList()
})

// 获取参数列表
const getList = async () => {
  loading.value = true
  try {
    console.log('获取参数列表，参数:', queryParams)
    const res = await listConfigsApiV1SystemConfigListGet({
      page: queryParams.page,
      page_size: queryParams.page_size,
      config_key: queryParams.config_key || undefined,
      config_name: queryParams.config_name || undefined
    })
    
    console.log('参数列表响应:', res)
    // 处理响应数据
    const response = res.data || {}
    if (response.code === 200) {
      // API返回的是二维数组rows，需要扁平化处理
      const rows = response.rows || []
      const items = Array.isArray(rows[0]) ? rows.flat() : rows

      // 将数据转换为前端格式
      configList.value = items.map(item => ({
        ...item,
        system_builtin: item.config_type === 'Y'
      }))
      
      console.log('参数列表数据加载成功:', configList.value)
      
      // 获取分页信息中的总数
      total.value = response.pageInfo?.total || 0
    } else {
      ElMessage.error(response.msg || '获取参数列表失败')
    }
  } catch (error) {
    console.error('获取参数列表出错：', error)
    ElMessage.error('获取参数列表出错')
  } finally {
    loading.value = false
  }
}

// 搜索按钮操作
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

// 重置按钮操作
const handleReset = () => {
  queryParams.config_key = ''
  queryParams.config_name = ''
  queryParams.page = 1
  getList()
}

// 新增按钮操作
const handleAdd = () => {
  resetForm()
  isEdit.value = false
  dialogTitle.value = '添加参数'
  dialogVisible.value = true
}

// 编辑按钮操作
const handleUpdate = async (row: ConfigItem) => {
  resetForm()
  isEdit.value = true
  dialogTitle.value = '修改参数'
  
  try {
    loading.value = true
    console.log('获取参数详情，ID:', row.config_id)
    const res = await getConfigApiV1SystemConfigConfigIdGet({ config_id: row.config_id })
    
    console.log('获取参数详情响应:', res)
    // 处理响应数据
    const response = res.data || {}
    if (response.code === 200 && response.data) {
      console.log('获取到的参数数据:', response.data)
      Object.assign(formData, response.data, {
        system_builtin: response.data.config_type === 'Y'
      })
      dialogVisible.value = true
    } else {
      ElMessage.error(response.msg || '获取参数详情失败')
    }
  } catch (error) {
    console.error('获取参数详情出错：', error)
    ElMessage.error('获取参数详情出错')
  } finally {
    loading.value = false
  }
}

// 提交表单
const submitForm = async () => {
  if (!configFormRef.value) return
  
  await configFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    
    try {
      loading.value = true
      
      // 将布尔值转换为Y/N
      const configType = formData.system_builtin ? 'Y' : 'N'
      
      if (isEdit.value && formData.config_id) {
        // 修改
        console.log('开始更新参数，ID:', formData.config_id)
        const res = await updateConfigApiV1SystemConfigConfigIdPut(
          { config_id: formData.config_id },
          {
            config_name: formData.config_name,
            config_key: formData.config_key,
            config_value: formData.config_value,
            config_type: configType,
            remark: formData.remark
          }
        )
        
        const response = res.data || {}
        if (response.code === 200) {
          ElMessage.success('修改成功')
          dialogVisible.value = false
          getList()
        } else {
          ElMessage.error(response.msg || '修改失败')
        }
      } else {
        // 新增
        console.log('开始创建新参数')
        const res = await createConfigApiV1SystemConfigPost({
          config_name: formData.config_name,
          config_key: formData.config_key,
          config_value: formData.config_value,
          config_type: configType,
          remark: formData.remark
        })
        
        const response = res.data || {}
        if (response.code === 200) {
          ElMessage.success('新增成功')
          dialogVisible.value = false
          getList()
        } else {
          ElMessage.error(response.msg || '新增失败')
        }
      }
    } catch (error) {
      console.error('提交表单出错：', error)
      ElMessage.error('提交表单出错')
    } finally {
      loading.value = false
    }
  })
}

// 删除按钮操作
const handleDelete = (row: ConfigItem) => {
  ElMessageBox.confirm(`确认删除参数 ${row.config_name} 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      loading.value = true
      console.log('开始删除参数，ID:', row.config_id)
      const res = await deleteConfigApiV1SystemConfigConfigIdDelete({ config_id: row.config_id })
      
      const response = res.data || {}
      if (response.code === 200) {
        ElMessage.success('删除成功')
        getList()
      } else {
        ElMessage.error(response.msg || '删除失败')
      }
    } catch (error) {
      console.error('删除出错：', error)
      ElMessage.error('删除出错')
    } finally {
      loading.value = false
    }
  }).catch(() => {})
}

// 每页数量改变
const handleSizeChange = (size: number) => {
  queryParams.page_size = size
  getList()
}

// 当前页改变
const handleCurrentChange = (page: number) => {
  queryParams.page = page
  getList()
}

// 重置表单
const resetForm = () => {
  if (configFormRef.value) {
    configFormRef.value.resetFields()
  }
  Object.assign(formData, {
    config_id: 0,
    config_name: '',
    config_key: '',
    config_value: '',
    config_type: 'N',
    remark: '',
    system_builtin: false
  })
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