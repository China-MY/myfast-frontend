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
                <el-form-item label="类名称" prop="className">
                  <el-input v-model="form.className" placeholder="请输入类名称" />
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
            <el-table-column label="字段名称" prop="column_name" min-width="120" />
            <el-table-column label="字段描述" prop="column_comment" min-width="120">
              <template #default="scope">
                <el-input v-model="scope.row.column_comment" />
              </template>
            </el-table-column>
            <el-table-column label="物理类型" prop="column_type" min-width="120" />
            <el-table-column label="Python类型" prop="python_type" min-width="120">
              <template #default="scope">
                <el-select v-model="scope.row.python_type">
                  <el-option label="str" value="str" />
                  <el-option label="int" value="int" />
                  <el-option label="float" value="float" />
                  <el-option label="bool" value="bool" />
                  <el-option label="datetime" value="datetime" />
                  <el-option label="date" value="date" />
                  <el-option label="time" value="time" />
                  <el-option label="dict" value="dict" />
                  <el-option label="list" value="list" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="字段名" prop="field_name" min-width="120">
              <template #default="scope">
                <el-input v-model="scope.row.field_name" />
              </template>
            </el-table-column>
            <el-table-column label="查询方式" align="center" prop="query_type" min-width="100">
              <template #default="scope">
                <el-select v-model="scope.row.query_type">
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
                <el-checkbox v-model="scope.row.is_required" true-value="1" false-value="0" />
              </template>
            </el-table-column>
            <el-table-column label="列表" align="center" width="80">
              <template #default="scope">
                <el-checkbox v-model="scope.row.is_list" true-value="1" false-value="0" />
              </template>
            </el-table-column>
            <el-table-column label="查询" align="center" width="80">
              <template #default="scope">
                <el-checkbox v-model="scope.row.is_query" true-value="1" false-value="0" />
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

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getTableDetailApiV1ToolGenIdGet as getGenTable, 
         updateTableApiV1ToolGenIdPut as updateGenTable, 
         updateTableColumnsApiV1ToolGenIdColumnsPut as updateGenTableColumn } from '@/api/daimashengcheng'

// 定义类型
interface TableColumn {
  column_name: string;
  column_comment: string;
  column_type: string;
  python_type: string;
  field_name: string;
  is_pk: string;
  is_increment: string;
  is_required: string;
  is_insert: string;
  is_edit: string;
  is_list: string;
  is_query: string;
  query_type: string;
  html_type: string;
  dict_type: string;
  sort: number;
}

interface TableForm {
  id?: number;
  tableName: string;
  tableComment: string;
  className: string;
  functionAuthor: string;
  remark: string;
}

interface GenInfo {
  tplCategory: string;
  packageName: string;
  moduleName: string;
  businessName: string;
  functionName: string;
}

const route = useRoute()
const router = useRouter()

// 选中的标签页
const activeTab = ref('basic')

// 表单参数
const form = reactive<TableForm>({
  tableName: '',
  tableComment: '',
  className: '',
  functionAuthor: '',
  remark: ''
})

// 生成信息
const info = reactive<GenInfo>({
  tplCategory: 'crud',
  packageName: 'app.models',
  moduleName: 'system',
  businessName: '',
  functionName: ''
})

// 字段列表
const columns = ref<TableColumn[]>([])

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
const getTableAndColumnDetails = async (tableId: string | string[]) => {
  try {
    // console.log('正在获取表详情，ID:', tableId)
    const numId = Number(tableId)
    if (isNaN(numId)) {
      // console.error('表ID不是有效数字:', tableId)
      ElMessage.error('表ID格式不正确')
      return
    }
    
    const response = await getGenTable({ id: numId })
    if (!response || !response.data) {
      // console.error('API返回数据为空')
      ElMessage.error('获取表详情失败: API返回数据为空')
      return
    }
    
    // 检查响应数据格式
    // console.log('API响应数据:', response)
    
    // 获取数据主体 - 处理API响应结构
    let data: any
    if (response.data && 'code' in response.data && 'data' in response.data) {
      // 如果响应格式是 { code, msg, data }
      data = response.data.data
    } else {
      // 如果响应直接就是数据
      data = response.data
    }
    
    // console.log('处理后的表详情数据:', data)
    
    if (!data) {
      // console.error('无法提取有效数据')
      ElMessage.error('获取表详情失败: 无效数据结构')
      return
    }
    
    // 设置表单数据
    form.id = data.id ? Number(data.id) : undefined
    form.tableName = data.table_name || ''
    form.tableComment = data.table_comment || ''
    form.className = data.class_name || ''
    form.functionAuthor = data.function_author || ''
    form.remark = data.remark || ''

    // 设置生成信息
    info.tplCategory = data.tpl_category || 'crud'
    info.packageName = data.package_name || 'app.models'
    info.moduleName = data.module_name || 'system'
    info.businessName = data.business_name || ''
    info.functionName = data.function_name || ''

    // 设置字段信息
    // console.log('字段数据:', data.columns)
    if (data.columns && Array.isArray(data.columns)) {
      columns.value = data.columns.map((column: any) => {
        // 将API返回的字段属性映射到TableColumn接口
        return {
          column_name: column.column_name || '',
          column_comment: column.column_comment || '',
          column_type: column.column_type || '',
          python_type: column.python_type || '',
          field_name: column.field_name || '',
          is_pk: column.is_pk || '0',
          is_increment: column.is_increment || '0',
          is_required: column.is_required || '0',
          is_insert: column.is_insert || '0',
          is_edit: column.is_edit || '0',
          is_list: column.is_list || '0',
          is_query: column.is_query || '0',
          query_type: column.query_type || 'EQ',
          html_type: column.html_type || 'input',
          dict_type: column.dict_type || '',
          sort: column.sort || 0
        } as TableColumn
      })
    } else {
      // console.error('字段数据不是数组或为空:', data.columns)
      columns.value = []
      ElMessage.warning('未获取到字段信息')
    }
  } catch (error) {
    // console.error('获取表详情失败:', error)
    ElMessage.error('获取表详情失败，请检查网络连接')
  }
}

// 提交表单
const submitForm = async () => {
  try {
    if (!form.id) {
      ElMessage.error('表ID不存在，无法保存')
      return
    }
    
    // 合并表单和生成信息，转换为后端API格式
    const data = {
      table_name: form.tableName,
      table_comment: form.tableComment,
      class_name: form.className,
      function_author: form.functionAuthor,
      remark: form.remark,
      tpl_category: info.tplCategory,
      package_name: info.packageName,
      module_name: info.moduleName,
      business_name: info.businessName,
      function_name: info.functionName
    }
    
    // 更新表信息
    await updateGenTable({ id: form.id }, data)
    
    // 将columns转换为后端API格式
    const columnsData = columns.value.map(col => ({
      column_name: col.column_name,
      column_comment: col.column_comment,
      column_type: col.column_type,
      python_type: col.python_type,
      field_name: col.field_name,
      is_pk: col.is_pk,
      is_increment: col.is_increment,
      is_required: col.is_required,
      is_insert: col.is_insert,
      is_edit: col.is_edit,
      is_list: col.is_list,
      is_query: col.is_query,
      query_type: col.query_type,
      html_type: col.html_type,
      dict_type: col.dict_type,
      sort: col.sort
    }))
    
    // 更新字段信息
    await updateGenTableColumn({ id: form.id }, columnsData)
    
    ElMessage.success('保存成功')
    cancel()
  } catch (error) {
    // console.error('保存失败', error)
    ElMessage.error('保存失败')
  }
}

// 取消按钮
const cancel = () => {
  router.back()
}

// 初始化
onMounted(() => {
  // console.log('编辑页面已挂载，路由参数:', route.params)
  const tableId = route.params.tableId
  if (tableId) {
    // console.log('获取到表ID:', tableId)
    getTableAndColumnDetails(tableId)
  } else {
    // console.error('未能获取表ID，route.params:', route.params)
    ElMessage.error('未能获取表ID，请返回列表重试')
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