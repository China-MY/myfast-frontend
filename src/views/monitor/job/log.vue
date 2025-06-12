<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>定时任务日志</span>
          <div>
            <el-button
              type="danger"
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete()"
            >删除</el-button>
            <el-button
              type="warning"
              icon="Delete"
              @click="handleClean"
            >清空</el-button>
            <el-button
              type="primary"
              icon="Download"
              @click="handleExport"
            >导出</el-button>
            <el-button @click="goBack">返回</el-button>
          </div>
        </div>
      </template>

      <el-form :model="queryParams" ref="queryRef" :inline="true">
        <el-form-item label="任务名称" prop="jobName">
          <el-input
            v-model="queryParams.jobName"
            placeholder="请输入任务名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="任务组名" prop="jobGroup">
          <el-select
            v-model="queryParams.jobGroup"
            placeholder="请选择任务组名"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="dict in jobGroupOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="执行状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择执行状态"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="dict in statusOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="执行时间">
          <el-date-picker
            v-model="dateRange"
            style="width: 240px"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table
        v-loading="loading"
        :data="logList"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="日志编号" width="80" align="center" prop="jobLogId" />
        <el-table-column label="任务名称" align="center" prop="jobName" :show-overflow-tooltip="true" />
        <el-table-column label="任务组名" align="center" prop="jobGroup" :show-overflow-tooltip="true" />
        <el-table-column label="调用目标字符串" align="center" prop="invokeTarget" :show-overflow-tooltip="true" />
        <el-table-column label="日志信息" align="center" prop="jobMessage" :show-overflow-tooltip="true" />
        <el-table-column label="执行状态" align="center" prop="status">
          <template #default="scope">
            <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">
              {{ scope.row.status === '0' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="执行时间" align="center" prop="createTime" width="180" />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" text icon="View" @click="handleView(scope.row)">详细</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:currentPage="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 调度日志详细 -->
    <el-dialog title="任务日志详细" v-model="open" width="700px" append-to-body>
      <el-form :model="form" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="日志编号：">{{ form.jobLogId }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务名称：">{{ form.jobName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务组名：">{{ form.jobGroup }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行时间：">{{ form.createTime }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调用目标：">{{ form.invokeTarget }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务状态：">
              <el-tag :type="form.status === '0' ? 'success' : 'danger'">
                {{ form.status === '0' ? '成功' : '失败' }}
              </el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异常信息：">{{ form.exceptionInfo }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="日志信息：">{{ form.jobMessage }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="open = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 遮罩层
const loading = ref(false)
// 选中数组
const ids = ref([])
// 非多个禁用
const multiple = ref(true)
// 弹出层标题
const title = ref('')
// 是否显示弹出层
const open = ref(false)
// 日期范围
const dateRange = ref([])
// 表单参数
const form = reactive({
  jobLogId: undefined,
  jobName: undefined,
  jobGroup: undefined,
  invokeTarget: undefined,
  jobMessage: undefined,
  exceptionInfo: undefined,
  createTime: undefined,
  status: undefined
})
// 总条数
const total = ref(0)
// 调度日志表格数据
const logList = ref([])
// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  jobName: undefined,
  jobGroup: undefined,
  status: undefined,
  jobId: undefined
})

// 任务组名字典
const jobGroupOptions = [
  { label: '默认', value: 'DEFAULT' },
  { label: '系统', value: 'SYSTEM' }
]
// 状态字典
const statusOptions = [
  { label: '成功', value: '0' },
  { label: '失败', value: '1' }
]

/** 查询调度日志列表 */
function getList() {
  loading.value = true
  // 此处应调用接口获取数据
  // 临时模拟数据
  setTimeout(() => {
    logList.value = [
      {
        jobLogId: 1,
        jobName: '系统默认（无参）',
        jobGroup: 'DEFAULT',
        invokeTarget: 'ryTask.ryNoParams',
        jobMessage: '系统默认（无参） 总共耗时：2毫秒',
        status: '0',
        exceptionInfo: '',
        createTime: '2023-05-01 12:00:00'
      },
      {
        jobLogId: 2,
        jobName: '系统默认（有参）',
        jobGroup: 'DEFAULT',
        invokeTarget: 'ryTask.ryParams("ry")',
        jobMessage: '系统默认（有参） 总共耗时：3毫秒',
        status: '0',
        exceptionInfo: '',
        createTime: '2023-05-01 12:05:00'
      },
      {
        jobLogId: 3,
        jobName: '错误任务',
        jobGroup: 'SYSTEM',
        invokeTarget: 'ryTask.ryError()',
        jobMessage: '错误任务 总共耗时：0毫秒',
        status: '1',
        exceptionInfo: 'java.lang.RuntimeException: Error task',
        createTime: '2023-05-01 12:10:00'
      }
    ]
    total.value = 3
    loading.value = false
  }, 200)
}

/** 返回按钮操作 */
function goBack() {
  router.go(-1)
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = []
  queryParams.jobName = undefined
  queryParams.jobGroup = undefined
  queryParams.status = undefined
  queryParams.pageNum = 1
  getList()
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.jobLogId)
  multiple.value = !selection.length
}

/** 详细按钮操作 */
function handleView(row) {
  open.value = true
  Object.assign(form, row)
}

/** 删除按钮操作 */
function handleDelete(row) {
  const jobLogIds = row?.jobLogId ? [row.jobLogId] : ids.value

  ElMessageBox.confirm('是否确认删除日志编号为"' + jobLogIds + '"的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里应该调用删除API
    ElMessage.success('删除成功')
    getList()
  }).catch(() => {})
}

/** 清空按钮操作 */
function handleClean() {
  ElMessageBox.confirm('是否确认清空所有定时任务日志数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里应该调用清空API
    ElMessage.success('清空成功')
    getList()
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  // 这里应该调用导出API
  ElMessage.success('导出成功')
}

/** 分页大小改变 */
function handleSizeChange(val) {
  queryParams.pageSize = val
  getList()
}

/** 页码改变 */
function handleCurrentChange(val) {
  queryParams.pageNum = val
  getList()
}

// 初始化
onMounted(() => {
  const jobId = route.params.jobId
  if (jobId) {
    queryParams.jobId = parseInt(jobId)
  }
  getList()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>