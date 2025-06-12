<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>字典数据</span>
          <div>
            <el-button type="primary" icon="Plus" @click="handleAdd">新增</el-button>
            <el-button
              type="success"
              icon="Edit"
              :disabled="single"
              @click="handleUpdate()"
            >修改</el-button>
            <el-button
              type="danger"
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete()"
            >删除</el-button>
            <el-button @click="handleBack">返回</el-button>
          </div>
        </div>
      </template>
      <div>
        <!-- 搜索表单 -->
        <el-form :model="queryParams" ref="queryRef" :inline="true">
          <el-form-item label="字典标签" prop="dictLabel">
            <el-input
              v-model="queryParams.dictLabel"
              placeholder="请输入字典标签"
              clearable
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="字典状态" clearable>
              <el-option
                v-for="dict in statusOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 数据表格 -->
        <el-table
          v-loading="loading"
          :data="dataList"
          @selection-change="handleSelectionChange"
          border
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="字典编码" align="center" prop="dictCode" />
          <el-table-column label="字典标签" align="center" prop="dictLabel" />
          <el-table-column label="字典键值" align="center" prop="dictValue" />
          <el-table-column label="字典排序" align="center" prop="dictSort" />
          <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
              <el-tag
                :type="scope.row.status === '0' ? 'primary' : 'danger'"
              >{{ scope.row.status === '0' ? '正常' : '停用' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
          <el-table-column label="操作" align="center" width="150">
            <template #default="scope">
              <el-button type="primary" text icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
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
      </div>
    </el-card>

    <!-- 添加或修改对话框 -->
    <el-dialog
      :title="title"
      v-model="open"
      width="500px"
      append-to-body
    >
      <el-form ref="dataForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="form.dictType" :disabled="true" />
        </el-form-item>
        <el-form-item label="数据标签" prop="dictLabel">
          <el-input v-model="form.dictLabel" placeholder="请输入数据标签" />
        </el-form-item>
        <el-form-item label="数据键值" prop="dictValue">
          <el-input v-model="form.dictValue" placeholder="请输入数据键值" />
        </el-form-item>
        <el-form-item label="显示排序" prop="dictSort">
          <el-input-number v-model="form.dictSort" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.value"
              :label="dict.value"
            >{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
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
// 非单个禁用
const single = ref(true)
// 非多个禁用
const multiple = ref(true)
// 弹出层标题
const title = ref('')
// 是否显示弹出层
const open = ref(false)
// 总记录数
const total = ref(0)
// 状态数据字典
const statusOptions = [
  { label: '正常', value: '0' },
  { label: '停用', value: '1' }
]
// 数据列表
const dataList = ref([])
// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  dictName: undefined,
  dictType: undefined,
  dictLabel: undefined,
  status: undefined
})
// 表单参数
const form = reactive({
  dictCode: undefined,
  dictLabel: undefined,
  dictValue: undefined,
  dictType: undefined,
  dictSort: 0,
  status: '0',
  remark: undefined
})
// 表单校验
const rules = {
  dictLabel: [
    { required: true, message: '数据标签不能为空', trigger: 'blur' }
  ],
  dictValue: [
    { required: true, message: '数据键值不能为空', trigger: 'blur' }
  ],
  dictSort: [
    { required: true, message: '数据顺序不能为空', trigger: 'blur' }
  ]
}

/** 查询字典数据列表 */
function getList() {
  loading.value = true
  // 这里应该调用API获取字典数据列表
  // 临时模拟数据
  setTimeout(() => {
    dataList.value = [
      {
        dictCode: 1,
        dictLabel: '男',
        dictValue: '0',
        dictSort: 1,
        status: '0',
        remark: '性别男'
      },
      {
        dictCode: 2,
        dictLabel: '女',
        dictValue: '1',
        dictSort: 2,
        status: '0',
        remark: '性别女'
      }
    ]
    total.value = 2
    loading.value = false
  }, 300)
}

// 返回按钮
function handleBack() {
  router.back()
}

// 表单重置
function reset() {
  form.dictCode = undefined
  form.dictLabel = undefined
  form.dictValue = undefined
  form.dictSort = 0
  form.status = '0'
  form.remark = undefined
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  queryParams.dictLabel = undefined
  queryParams.status = undefined
  queryParams.pageNum = 1
  getList()
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.dictCode)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  form.dictType = route.params.dictId
  open.value = true
  title.value = '添加字典数据'
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  if (row) {
    Object.assign(form, row)
  } else if (ids.value.length === 1) {
    const dictCode = ids.value[0]
    const selected = dataList.value.find(item => item.dictCode === dictCode)
    if (selected) {
      Object.assign(form, selected)
    }
  }
  open.value = true
  title.value = '修改字典数据'
}

/** 提交按钮 */
function submitForm() {
  // 这里应该调用API保存或更新数据
  ElMessage.success('操作成功')
  open.value = false
  getList()
}

/** 删除按钮操作 */
function handleDelete(row) {
  const dictCodes = row?.dictCode ? [row.dictCode] : ids.value
  
  ElMessageBox.confirm('是否确认删除字典编码为"' + dictCodes + '"的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里应该调用API删除数据
    ElMessage.success('删除成功')
    getList()
  }).catch(() => {})
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
  const dictId = route.params.dictId
  if (dictId) {
    queryParams.dictType = dictId
    getList()
  }
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