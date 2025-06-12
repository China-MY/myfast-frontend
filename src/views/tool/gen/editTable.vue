<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>修改生成配置</span>
          <div>
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="cancel">返回</el-button>
          </div>
        </div>
      </template>
      
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="basic">
          <el-form ref="genForm" :model="form" :rules="rules" label-width="150px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="表名称" prop="tableName">
                  <el-input v-model="form.tableName" placeholder="请输入表名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="表描述" prop="tableComment">
                  <el-input v-model="form.tableComment" placeholder="请输入表描述" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实体类名称" prop="className">
                  <el-input v-model="form.className" placeholder="请输入实体类名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="作者" prop="functionAuthor">
                  <el-input v-model="form.functionAuthor" placeholder="请输入作者" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="字段信息" name="columns">
          <el-table :data="columns" border>
            <el-table-column label="序号" type="index" width="60" align="center" />
            <el-table-column label="字段名称" prop="columnName" min-width="120" />
            <el-table-column label="字段描述" prop="columnComment" min-width="120">
              <template #default="scope">
                <el-input v-model="scope.row.columnComment" />
              </template>
            </el-table-column>
            <el-table-column label="物理类型" prop="columnType" min-width="120" />
            <el-table-column label="Java类型" prop="javaType" min-width="120">
              <template #default="scope">
                <el-select v-model="scope.row.javaType">
                  <el-option label="String" value="String" />
                  <el-option label="Integer" value="Integer" />
                  <el-option label="Long" value="Long" />
                  <el-option label="Double" value="Double" />
                  <el-option label="BigDecimal" value="BigDecimal" />
                  <el-option label="Date" value="Date" />
                  <el-option label="Boolean" value="Boolean" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="Java属性" prop="javaField" min-width="120">
              <template #default="scope">
                <el-input v-model="scope.row.javaField" />
              </template>
            </el-table-column>
            <el-table-column label="查询方式" align="center" prop="queryType" min-width="100">
              <template #default="scope">
                <el-select v-model="scope.row.queryType">
                  <el-option label="=" value="EQ" />
                  <el-option label="!=" value="NE" />
                  <el-option label=">" value="GT" />
                  <el-option label=">=" value="GE" />
                  <el-option label="<" value="LT" />
                  <el-option label="<=" value="LE" />
                  <el-option label="LIKE" value="LIKE" />
                  <el-option label="BETWEEN" value="BETWEEN" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="必填" align="center" width="80">
              <template #default="scope">
                <el-checkbox v-model="scope.row.isRequired" true-label="1" false-label="0" />
              </template>
            </el-table-column>
            <el-table-column label="列表" align="center" width="80">
              <template #default="scope">
                <el-checkbox v-model="scope.row.isList" true-label="1" false-label="0" />
              </template>
            </el-table-column>
            <el-table-column label="查询" align="center" width="80">
              <template #default="scope">
                <el-checkbox v-model="scope.row.isQuery" true-label="1" false-label="0" />
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="生成信息" name="generate">
          <el-form ref="genInfoForm" :model="info" label-width="150px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="生成模板" prop="tplCategory">
                  <el-select v-model="info.tplCategory">
                    <el-option label="单表（增删改查）" value="crud" />
                    <el-option label="树表（增删改查）" value="tree" />
                    <el-option label="主子表（增删改查）" value="sub" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="包名" prop="packageName">
                  <el-input v-model="info.packageName" placeholder="请输入包名" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="模块名" prop="moduleName">
                  <el-input v-model="info.moduleName" placeholder="请输入模块名" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="业务名" prop="businessName">
                  <el-input v-model="info.businessName" placeholder="请输入业务名" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="功能名" prop="functionName">
                  <el-input v-model="info.functionName" placeholder="请输入功能名" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 选中的标签页
const activeTab = ref('basic')

// 表单参数
const form = reactive({
  tableId: undefined,
  tableName: '',
  tableComment: '',
  className: '',
  functionAuthor: '',
  remark: ''
})

// 生成信息
const info = reactive({
  tplCategory: 'crud',
  packageName: 'com.myfast',
  moduleName: 'system',
  businessName: '',
  functionName: ''
})

// 字段列表
const columns = ref([])

// 表单验证
const rules = {
  tableName: [
    { required: true, message: '表名称不能为空', trigger: 'blur' }
  ],
  tableComment: [
    { required: true, message: '表描述不能为空', trigger: 'blur' }
  ],
  className: [
    { required: true, message: '实体类名称不能为空', trigger: 'blur' }
  ],
  functionAuthor: [
    { required: true, message: '作者不能为空', trigger: 'blur' }
  ]
}

// 获取表和字段信息
const getTableAndColumnDetails = async (tableId) => {
  // 这里应该调用API获取表和字段信息
  // 临时模拟数据
  form.tableId = tableId
  form.tableName = 'sys_user'
  form.tableComment = '用户信息表'
  form.className = 'SysUser'
  form.functionAuthor = 'myfast'
  form.remark = '用户管理'

  info.businessName = 'user'
  info.functionName = '用户管理'

  columns.value = [
    {
      columnId: 1,
      tableId: tableId,
      columnName: 'user_id',
      columnComment: '用户ID',
      columnType: 'bigint',
      javaType: 'Long',
      javaField: 'userId',
      isPk: '1',
      isIncrement: '1',
      isRequired: '1',
      isInsert: '1',
      isEdit: '0',
      isList: '1',
      isQuery: '0',
      queryType: 'EQ',
      htmlType: 'input',
      dictType: ''
    },
    {
      columnId: 2,
      tableId: tableId,
      columnName: 'user_name',
      columnComment: '用户名称',
      columnType: 'varchar(30)',
      javaType: 'String',
      javaField: 'userName',
      isPk: '0',
      isIncrement: '0',
      isRequired: '1',
      isInsert: '1',
      isEdit: '1',
      isList: '1',
      isQuery: '1',
      queryType: 'LIKE',
      htmlType: 'input',
      dictType: ''
    },
    {
      columnId: 3,
      tableId: tableId,
      columnName: 'email',
      columnComment: '用户邮箱',
      columnType: 'varchar(50)',
      javaType: 'String',
      javaField: 'email',
      isPk: '0',
      isIncrement: '0',
      isRequired: '0',
      isInsert: '1',
      isEdit: '1',
      isList: '1',
      isQuery: '1',
      queryType: 'EQ',
      htmlType: 'input',
      dictType: ''
    }
  ]
}

// 提交表单
const submitForm = async () => {
  // 这里应该调用API保存表和字段信息
  ElMessage.success('保存成功')
  cancel()
}

// 取消按钮
const cancel = () => {
  router.back()
}

// 初始化
onMounted(() => {
  const tableId = route.params.tableId
  if (tableId) {
    getTableAndColumnDetails(tableId)
  }
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 