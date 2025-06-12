<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="queryParams.job_name"
        placeholder="任务名称"
        class="filter-item"
        style="width: 200px;"
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
      <el-button type="danger" class="filter-item" @click="handleCleanLogs">
        清空日志
      </el-button>
    </div>

    <!-- 任务列表 -->
    <el-table
      v-loading="loading"
      :data="jobList"
      style="width: 100%; margin-top: 15px;"
    >
      <el-table-column label="任务ID" prop="job_id" align="center" width="80" />
      <el-table-column label="任务名称" prop="job_name" align="center" />
      <el-table-column label="任务组" prop="job_group" align="center" />
      <el-table-column label="调用目标" prop="invoke_target" align="center" width="200">
        <template #default="scope">
          <el-tooltip :content="scope.row.invoke_target" placement="top" effect="light">
            <span>{{ scope.row.invoke_target }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="cron表达式" prop="cron_expression" align="center" width="120" />
      <el-table-column label="状态" prop="status" align="center" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">
            {{ scope.row.status === '0' ? '正常' : '暂停' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="280">
        <template #default="scope">
          <el-button 
            type="primary" 
            size="small" 
            @click="handleRun(scope.row)"
            :disabled="scope.row.status !== '0'"
          >执行</el-button>
          <el-button 
            :type="scope.row.status === '0' ? 'warning' : 'success'" 
            size="small" 
            @click="handleChangeStatus(scope.row)"
          >{{ scope.row.status === '0' ? '暂停' : '恢复' }}</el-button>
          <el-button type="info" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="primary" size="small" plain @click="handleViewLogs(scope.row)">日志</el-button>
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

    <!-- 添加/编辑任务对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      append-to-body
    >
      <el-form
        ref="jobFormRef"
        :model="jobForm"
        :rules="jobRules"
        label-width="100px"
      >
        <el-form-item label="任务名称" prop="job_name">
          <el-input v-model="jobForm.job_name" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="任务组" prop="job_group">
          <el-input v-model="jobForm.job_group" placeholder="请输入任务组" />
        </el-form-item>
        <el-form-item label="调用目标" prop="invoke_target">
          <el-input v-model="jobForm.invoke_target" placeholder="请输入调用目标（包含参数）" />
        </el-form-item>
        <el-form-item label="cron表达式" prop="cron_expression">
          <el-input v-model="jobForm.cron_expression" placeholder="请输入cron表达式" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="jobForm.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">暂停</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="jobForm.remark"
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

    <!-- 任务日志列表 -->
    <el-dialog
      title="任务日志"
      v-model="logDialogVisible"
      width="800px"
      append-to-body
    >
      <el-table
        v-loading="logLoading"
        :data="jobLogList"
        style="width: 100%;"
      >
        <el-table-column label="日志ID" prop="job_log_id" align="center" width="80" />
        <el-table-column label="任务名称" prop="job_name" align="center" />
        <el-table-column label="调用目标" prop="invoke_target" align="center" width="180">
          <template #default="scope">
            <el-tooltip :content="scope.row.invoke_target" placement="top" effect="light">
              <span>{{ scope.row.invoke_target }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" align="center" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">
              {{ scope.row.status === '0' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="耗时(ms)" prop="cost_time" align="center" width="100" />
        <el-table-column label="执行时间" prop="create_time" align="center" width="180" />
      </el-table>
      
      <!-- 日志分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="logQueryParams.page"
          v-model:page-size="logQueryParams.page_size"
          :page-sizes="[10, 20, 30, 50]"
          :total="logTotal"
          background
          :layout="paginationLayout"
          @size-change="handleLogSizeChange"
          @current-change="handleLogCurrentChange"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElConfigProvider } from 'element-plus'
import type { FormInstance } from 'element-plus'
import {
  listJobsApiV1MonitorJobListGet,
  createJobApiV1MonitorJobPost,
  updateJobApiV1MonitorJobJobIdPut,
  deleteJobApiV1MonitorJobJobIdDelete,
  getJobApiV1MonitorJobJobIdGet,
  runJobApiV1MonitorJobJobIdRunPost,
  changeJobStatusApiV1MonitorJobJobIdStatusStatusPut,
  listJobLogsApiV1MonitorJobLogListGet,
  cleanJobLogsApiV1MonitorJobLogCleanDelete
} from '@/api/dingshirenwu'
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
const jobList = ref<any[]>([])
const total = ref(0)

// 日志数据
const logLoading = ref(false)
const logDialogVisible = ref(false)
const jobLogList = ref<any[]>([])
const logTotal = ref(0)

// 查询参数
const queryParams = reactive({
  page: 1,
  page_size: 10,
  job_name: '',
  job_group: '',
  status: '' // 留空表示查询所有状态
})

// 日志查询参数
const logQueryParams = reactive({
  page: 1,
  page_size: 10,
  job_id: undefined as number | undefined,
  job_name: '',
  status: ''
})

// 表单参数
const jobFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const jobForm = reactive({
  job_id: undefined as number | undefined,
  job_name: '',
  job_group: '',
  invoke_target: '',
  cron_expression: '',
  status: '0',
  remark: ''
})

// 表单验证规则
const jobRules = {
  job_name: [
    { required: true, message: '任务名称不能为空', trigger: 'blur' },
    { min: 2, max: 50, message: '任务名称长度应在2-50个字符之间', trigger: 'blur' }
  ],
  job_group: [
    { required: true, message: '任务组不能为空', trigger: 'blur' }
  ],
  invoke_target: [
    { required: true, message: '调用目标不能为空', trigger: 'blur' }
  ],
  cron_expression: [
    { required: true, message: 'cron表达式不能为空', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '状态不能为空', trigger: 'change' }
  ]
}

// 初始化
onMounted(() => {
  // 清空之前查询条件并重新加载数据
  queryParams.job_name = ''
  queryParams.job_group = ''
  queryParams.status = ''
  queryParams.page = 1
  setTimeout(() => {
    ///console.log('初始化加载定时任务列表...')
    getList()
  }, 100)
})

// 获取任务列表
const getList = async () => {
  loading.value = true
  try {
    // 构建有效的查询参数
    const params = {
      page: queryParams.page,
      page_size: queryParams.page_size
    } as any
    
    // 只添加有值的参数
    if (queryParams.job_name) params.job_name = queryParams.job_name
    if (queryParams.job_group) params.job_group = queryParams.job_group
    if (queryParams.status) params.status = queryParams.status
    
    ///console.log('获取定时任务列表，处理后参数:', params)
    ///console.log('开始请求定时任务列表API...')
    const response = await listJobsApiV1MonitorJobListGet(params)
    ///console.log('定时任务列表完整响应:', response)
    ///console.log('响应类型:', typeof response)
    ///console.log('响应结构:', Object.keys(response).join(','))
    
    if (response.data) {
      const res = response.data as any
      ///console.log('API响应数据结构:', JSON.stringify(res))
      
      if (res.code === 200) {
        // 检查API返回的所有可能位置，优先尝试通过数据库表名直接访问数据
        if (res.sys_job && Array.isArray(res.sys_job)) {
          jobList.value = res.sys_job
          ///console.log('使用sys_job表数据:', res.sys_job)
        } else if (Array.isArray(res.rows)) {
          jobList.value = res.rows
          ///console.log('使用rows数据:', res.rows)
        } else if (res.data && Array.isArray(res.data)) {
          jobList.value = res.data
          ///console.log('使用data数据:', res.data)
        } else if (res.items && Array.isArray(res.items)) {
          jobList.value = res.items
          ///console.log('使用items数据:', res.items)
        } else if (res.list && Array.isArray(res.list)) {
          jobList.value = res.list
          ///console.log('使用list数据:', res.list)
        } else {
          // 尝试直接查找第一个数组类型的属性
          const arrayProp = Object.keys(res).find(key => Array.isArray(res[key]))
          if (arrayProp) {
            jobList.value = res[arrayProp]
            ///console.log(`使用找到的数组属性 ${arrayProp}:`, res[arrayProp])
          } else {
            jobList.value = []
            ///console.warn('未找到有效的列表数据，响应结构:', res)
          }
        }
        
        // 处理总数，尝试更多可能的位置
        if (res.pageInfo && typeof res.pageInfo.total === 'number') {
          total.value = res.pageInfo.total
        } else if (typeof res.total === 'number') {
          total.value = res.total
        } else if (res.pagination && typeof res.pagination.total === 'number') {
          total.value = res.pagination.total
        } else if (res.meta && typeof res.meta.total === 'number') {
          total.value = res.meta.total
        } else {
          total.value = jobList.value.length || 0
        }
        
        ///console.log('定时任务列表数据加载成功:', jobList.value, '总数:', total.value)
      } else {
        ElMessage.error(res.msg || '获取定时任务列表失败')
      }
    }
  } catch (error) {
    ///console.error('获取定时任务列表失败:', error)
    ElMessage.error('获取定时任务列表失败')
  } finally {
    loading.value = false
  }
}

// 获取任务日志列表
const getJobLogs = async () => {
  logLoading.value = true
  try {
    // 构建有效的查询参数
    const params = {
      page: logQueryParams.page,
      page_size: logQueryParams.page_size
    } as any
    
    if (logQueryParams.job_id) params.job_id = logQueryParams.job_id
    if (logQueryParams.job_name) params.job_name = logQueryParams.job_name
    if (logQueryParams.status) params.status = logQueryParams.status
    
    ///console.log('获取任务日志列表，参数:', params)
    const response = await listJobLogsApiV1MonitorJobLogListGet(params)
    ///console.log('任务日志列表完整响应:', response)
    
    if (response.data) {
      const res = response.data as any
      ///console.log('日志API响应数据结构:', JSON.stringify(res))
      
      if (res.code === 200) {
        // 检查API返回的所有可能位置，优先尝试通过数据库表名直接访问数据
        if (res.sys_job_log && Array.isArray(res.sys_job_log)) {
          jobLogList.value = res.sys_job_log
          ///console.log('使用sys_job_log表数据:', res.sys_job_log)
        } else if (Array.isArray(res.rows)) {
          jobLogList.value = res.rows
          ///console.log('使用rows数据:', res.rows)
        } else if (res.data && Array.isArray(res.data)) {
          jobLogList.value = res.data
          ///console.log('使用data数据:', res.data)
        } else if (res.items && Array.isArray(res.items)) {
          jobLogList.value = res.items
          ///console.log('使用items数据:', res.items)
        } else if (res.list && Array.isArray(res.list)) {
          jobLogList.value = res.list
          ///console.log('使用list数据:', res.list)
        } else {
          // 尝试直接查找第一个数组类型的属性
          const arrayProp = Object.keys(res).find(key => Array.isArray(res[key]))
          if (arrayProp) {
            jobLogList.value = res[arrayProp]
            ///console.log(`使用找到的数组属性 ${arrayProp}:`, res[arrayProp])
          } else {
            jobLogList.value = []
            ///console.warn('未找到有效的日志列表数据，响应结构:', res)
          }
        }
        
        // 处理总数，尝试更多可能的位置
        if (res.pageInfo && typeof res.pageInfo.total === 'number') {
          logTotal.value = res.pageInfo.total
        } else if (typeof res.total === 'number') {
          logTotal.value = res.total
        } else if (res.pagination && typeof res.pagination.total === 'number') {
          logTotal.value = res.pagination.total
        } else if (res.meta && typeof res.meta.total === 'number') {
          logTotal.value = res.meta.total
        } else {
          logTotal.value = jobLogList.value.length || 0
        }
        
        ///console.log('任务日志列表数据加载成功:', jobLogList.value, '总数:', logTotal.value)
      } else {
        ElMessage.error(res.msg || '获取任务日志列表失败')
      }
    }
  } catch (error) {
    ///console.error('获取任务日志列表失败:', error)
    ElMessage.error('获取任务日志列表失败')
  } finally {
    logLoading.value = false
  }
}

// 查询按钮操作
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

// 重置表单
const resetForm = () => {
  if (jobFormRef.value) {
    jobFormRef.value.resetFields()
  }
  jobForm.job_id = undefined
  jobForm.job_name = ''
  jobForm.job_group = ''
  jobForm.invoke_target = ''
  jobForm.cron_expression = ''
  jobForm.status = '0'
  jobForm.remark = ''
}

// 添加任务
const handleAdd = () => {
  resetForm()
  isEdit.value = false
  dialogTitle.value = '添加任务'
  dialogVisible.value = true
}

// 编辑任务
const handleEdit = async (row: any) => {
  resetForm()
  isEdit.value = true
  dialogTitle.value = '编辑任务'
  try {
    ///console.log('获取任务详情，ID:', row.job_id)
    const response = await getJobApiV1MonitorJobJobIdGet({ job_id: row.job_id })
    ///console.log('获取任务详情响应:', response)
    
    // 使用any类型临时绕过类型检查问题
    const data = response.data as any
    
    if (data && data.code === 200) {
      const jobData = data.data as any
      
      if (jobData) {
        ///console.log('获取到的任务数据:', jobData)
        
        // 设置表单数据
        jobForm.job_id = jobData.job_id
        jobForm.job_name = jobData.job_name || ''
        jobForm.job_group = jobData.job_group || ''
        jobForm.invoke_target = jobData.invoke_target || ''
        jobForm.cron_expression = jobData.cron_expression || ''
        jobForm.status = jobData.status || '0'
        jobForm.remark = jobData.remark || ''
      } else {
        ElMessage.warning('获取任务数据格式异常')
      }
    } else {
      ElMessage.error(data?.msg || '获取任务详情失败')
    }
    
    dialogVisible.value = true
  } catch (error) {
    ///console.error('获取任务详情失败:', error)
    ElMessage.error('获取任务详情失败')
  }
}

// 提交表单
const submitForm = async () => {
  if (!jobFormRef.value) return
  
  await jobFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    
    try {
      if (isEdit.value && jobForm.job_id) {
        // 更新任务
        await updateJobApiV1MonitorJobJobIdPut(
          { job_id: jobForm.job_id },
          {
            job_id: jobForm.job_id,
            job_name: jobForm.job_name,
            job_group: jobForm.job_group,
            invoke_target: jobForm.invoke_target,
            cron_expression: jobForm.cron_expression,
            status: jobForm.status,
            remark: jobForm.remark
          } as any // 使用any类型临时绕过类型检查问题
        )
        ElMessage.success('修改成功')
      } else {
        // 创建任务
        await createJobApiV1MonitorJobPost({
          job_name: jobForm.job_name,
          job_group: jobForm.job_group,
          invoke_target: jobForm.invoke_target,
          cron_expression: jobForm.cron_expression,
          status: jobForm.status,
          remark: jobForm.remark
        } as any) // 使用any类型临时绕过类型检查问题
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      getList()
    } catch (error) {
      ///console.error('保存任务失败:', error)
      ElMessage.error('保存失败')
    }
  })
}

// 删除任务
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确认删除任务"${row.job_name}"吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      ///console.log('开始删除任务，ID:', row.job_id)
      const response = await deleteJobApiV1MonitorJobJobIdDelete({ job_id: row.job_id })
      
      if (response.data && response.data.code === 200) {
        ElMessage.success('删除成功')
        getList()
      } else {
        ElMessage.error(response.data?.msg || '删除失败')
      }
    } catch (error) {
      ///console.error('删除任务失败:', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

// 执行任务
const handleRun = (row: any) => {
  ElMessageBox.confirm(`确认立即执行任务"${row.job_name}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      ///console.log('开始执行任务，ID:', row.job_id)
      const response = await runJobApiV1MonitorJobJobIdRunPost({ job_id: row.job_id })
      
      if (response.data && response.data.code === 200) {
        ElMessage.success('执行成功')
      } else {
        ElMessage.error(response.data?.msg || '执行失败')
      }
    } catch (error) {
      ///console.error('执行任务失败:', error)
      ElMessage.error('执行失败')
    }
  }).catch(() => {})
}

// 修改任务状态
const handleChangeStatus = (row: any) => {
  const newStatus = row.status === '0' ? '1' : '0'
  const statusText = newStatus === '0' ? '恢复' : '暂停'
  
  ElMessageBox.confirm(`确认${statusText}任务"${row.job_name}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      ///console.log(`开始${statusText}任务，ID:${row.job_id}, 新状态:${newStatus}`)
      const response = await changeJobStatusApiV1MonitorJobJobIdStatusStatusPut({ 
        job_id: row.job_id, 
        status: newStatus 
      })
      
      if (response.data && response.data.code === 200) {
        ElMessage.success(`${statusText}成功`)
        getList()
      } else {
        ElMessage.error(response.data?.msg || `${statusText}失败`)
      }
    } catch (error) {
      ///console.error(`${statusText}任务失败:`, error)
      ElMessage.error(`${statusText}失败`)
    }
  }).catch(() => {})
}

// 清空任务日志
const handleCleanLogs = () => {
  ElMessageBox.confirm('确认清空所有任务日志吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      ///console.log('开始清空任务日志')
      const response = await cleanJobLogsApiV1MonitorJobLogCleanDelete()
      
      if (response.data && response.data.code === 200) {
        ElMessage.success('清空成功')
        if (logDialogVisible.value) {
          getJobLogs()
        }
      } else {
        ElMessage.error(response.data?.msg || '清空失败')
      }
    } catch (error) {
      ///console.error('清空任务日志失败:', error)
      ElMessage.error('清空失败')
    }
  }).catch(() => {})
}

// 查看任务日志
const handleViewLogs = (row: any) => {
  logQueryParams.job_id = row.job_id
  logQueryParams.job_name = row.job_name
  logQueryParams.page = 1
  logDialogVisible.value = true
  getJobLogs()
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

// 日志每页数量变化
const handleLogSizeChange = (size: number) => {
  logQueryParams.page_size = size
  getJobLogs()
}

// 日志页码变化
const handleLogCurrentChange = (page: number) => {
  logQueryParams.page = page
  getJobLogs()
}

// 重置按钮操作
const handleReset = () => {
  queryParams.job_name = ''
  queryParams.job_group = ''
  queryParams.status = ''
  queryParams.page = 1
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