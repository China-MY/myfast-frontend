<template>
  <div class="app-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">字典管理</span>
          <div class="right">
            <el-input
              v-model="typeQueryParams.dict_name"
              placeholder="请输入字典名称"
              style="width: 200px; margin-right: 10px"
              clearable
              @keyup.enter="handleQueryDictTypes"
            />
            <el-input
              v-model="typeQueryParams.dict_type"
              placeholder="请输入字典类型"
              style="width: 200px; margin-right: 10px"
              clearable
              @keyup.enter="handleQueryDictTypes"
            />
            <el-button type="primary" :icon="Search" @click="handleQueryDictTypes">搜索</el-button>
            <el-button :icon="Refresh" @click="resetTypeQuery">重置</el-button>
            <el-button type="primary" :icon="Plus" @click="handleAddDictType">新增字典类型</el-button>
          </div>
        </div>
      </template>
      
      <!-- 字典类型表格 -->
      <el-table
        v-loading="dictTypeLoading"
        :data="dictTypeList"
        border
        highlight-current-row
        @row-click="handleRowClick"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="dict_name" label="字典名称" :show-overflow-tooltip="true" />
        <el-table-column prop="dict_type" label="字典类型" :show-overflow-tooltip="true" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'danger'">
              {{ row.status === '0' ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" />
        <el-table-column label="操作" width="260" fixed="right">
          <template #default="{ row }">
            <div class="operation-buttons">
              <el-button link type="primary" :icon="View" @click.stop="handleViewDictData(row)">字典数据</el-button>
              <el-button link type="primary" :icon="Edit" @click.stop="handleEditDictType(row)">编辑</el-button>
              <el-button link type="primary" :icon="Delete" @click.stop="handleDeleteDictType(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 字典类型分页 -->
      <el-config-provider :locale="locale">
        <div class="pagination">
          <el-pagination
            v-if="typeTotal > 0"
            :total="typeTotal"
            v-model:current-page="typeQueryParams.page"
            v-model:page-size="typeQueryParams.page_size"
            :page-sizes="[10, 20, 50, 100]"
            background
            :layout="paginationLayout"
            @size-change="handleTypePageSizeChange"
            @current-change="handleTypePageCurrentChange"
            :pager-count="5"
          >
            <template #total>共 {{ typeTotal }} 条</template>
            <template #sizes="scope">
              <span class="el-pagination__sizes">
                <span class="el-select-trigger">
                  {{ scope.pageSize }}条/页
                  <i class="el-select__caret el-input__icon el-icon-arrow-up"></i>
                </span>
              </span>
            </template>
          </el-pagination>
        </div>
      </el-config-provider>
    </el-card>

    <!-- 字典类型表单对话框 -->
    <el-dialog
      v-model="dictTypeDialog.visible"
      :title="dictTypeDialog.title"
      width="600px"
      append-to-body
      destroy-on-close
    >
      <el-form
        ref="dictTypeFormRef"
        :model="dictTypeForm"
        :rules="dictTypeRules"
        label-width="100px"
      >
        <el-form-item label="字典名称" prop="dict_name">
          <el-input v-model="dictTypeForm.dict_name" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典类型" prop="dict_type">
          <el-input v-model="dictTypeForm.dict_type" placeholder="请输入字典类型" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="dictTypeForm.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dictTypeForm.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dictTypeDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitDictType">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 字典数据列表对话框 -->
    <el-dialog
      v-model="dictDataListDialog.visible"
      :title="`字典数据管理: ${currentDictType.dict_name}`"
      width="900px"
      append-to-body
      destroy-on-close
    >
      <div class="dict-data-toolbar">
        <div class="left">
          <el-input
            v-model="dataQueryParams.dict_label"
            placeholder="请输入字典标签"
            style="width: 200px; margin-right: 10px"
            clearable
            @keyup.enter="handleQueryDictData"
          />
          <el-button type="primary" :icon="Search" @click="handleQueryDictData">搜索</el-button>
          <el-button :icon="Refresh" @click="resetDataQuery">重置</el-button>
        </div>
        <div class="right">
          <el-button type="primary" :icon="Plus" @click="handleAddDictData">新增字典数据</el-button>
        </div>
      </div>
      
      <!-- 字典数据表格 -->
      <el-table
        v-loading="dictDataLoading"
        :data="dictDataList"
        border
        highlight-current-row
        style="width: 100%; margin-top: 15px;"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="dict_label" label="字典标签" :show-overflow-tooltip="true" />
        <el-table-column prop="dict_value" label="字典键值" :show-overflow-tooltip="true" />
        <el-table-column prop="dict_sort" label="排序" width="80" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'danger'">
              {{ row.status === '0' ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <div class="operation-buttons">
              <el-button link type="primary" :icon="Edit" @click.stop="handleEditDictData(row)">编辑</el-button>
              <el-button link type="primary" :icon="Delete" @click.stop="handleDeleteDictData(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 字典数据分页 -->
      <el-config-provider :locale="locale">
        <div class="pagination">
          <el-pagination
            v-if="dataTotal > 0"
            :total="dataTotal"
            v-model:current-page="dataQueryParams.page"
            v-model:page-size="dataQueryParams.page_size"
            :page-sizes="[10, 20, 50, 100]"
            background
            :layout="paginationLayout"
            @size-change="handleDataPageSizeChange"
            @current-change="handleDataPageCurrentChange"
            :pager-count="5"
          >
            <template #total>共 {{ dataTotal }} 条</template>
            <template #sizes="scope">
              <span class="el-pagination__sizes">
                <span class="el-select-trigger">
                  {{ scope.pageSize }}条/页
                  <i class="el-select__caret el-input__icon el-icon-arrow-up"></i>
                </span>
              </span>
            </template>
          </el-pagination>
        </div>
      </el-config-provider>
    </el-dialog>

    <!-- 字典数据表单对话框 -->
    <el-dialog
      v-model="dictDataDialog.visible"
      :title="dictDataDialog.title"
      width="600px"
      append-to-body
      destroy-on-close
    >
      <el-form
        ref="dictDataFormRef"
        :model="dictDataForm"
        :rules="dictDataRules"
        label-width="100px"
      >
        <el-form-item label="字典类型">
          <el-input v-model="currentDictType.dict_type" disabled />
        </el-form-item>
        <el-form-item label="字典标签" prop="dict_label">
          <el-input v-model="dictDataForm.dict_label" placeholder="请输入字典标签" />
        </el-form-item>
        <el-form-item label="字典键值" prop="dict_value">
          <el-input v-model="dictDataForm.dict_value" placeholder="请输入字典键值" />
        </el-form-item>
        <el-form-item label="排序" prop="dict_sort">
          <el-input-number v-model="dictDataForm.dict_sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="dictDataForm.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dictDataForm.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dictDataDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitDictData">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElConfigProvider } from 'element-plus'
import { Search, Plus, Edit, Delete, Refresh, View } from '@element-plus/icons-vue'
import {
  listDictTypesApiV1SystemDictTypeListGet,
  createDictTypeApiV1SystemDictTypePost,
  updateDictTypeApiV1SystemDictTypeDictIdPut,
  deleteDictTypeApiV1SystemDictTypeDictIdDelete,
  getDictTypeApiV1SystemDictTypeDictIdGet,
  listDictDataApiV1SystemDictDataListGet,
  createDictDataApiV1SystemDictDataPost,
  updateDictDataApiV1SystemDictDataDictCodePut,
  deleteDictDataApiV1SystemDictDataDictCodeDelete
} from '@/api/zidianguanli'
import type { FormInstance } from 'element-plus'
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

// 字典类型相关
const dictTypeLoading = ref(false)
const dictTypeList = ref<any[]>([])
const typeTotal = ref(0)
const dictTypeFormRef = ref<FormInstance | null>(null)

const typeQueryParams = reactive({
  page: 1,
  page_size: 10,
  dict_name: '',
  dict_type: ''
})

const dictTypeDialog = reactive({
  visible: false,
  title: '',
  isEdit: false
})

const dictTypeForm = reactive<any>({
  dict_id: undefined,
  dict_name: '',
  dict_type: '',
  status: '0',
  remark: ''
})

const dictTypeRules = {
  dict_name: [
    { required: true, message: '字典名称不能为空', trigger: 'blur' },
    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
  ],
  dict_type: [
    { required: true, message: '字典类型不能为空', trigger: 'blur' },
    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
  ]
}

// 字典数据相关
const dictDataLoading = ref(false)
const dictDataList = ref<any[]>([])
const dataTotal = ref(0)
const dictDataFormRef = ref<FormInstance | null>(null)

const dataQueryParams = reactive({
  page: 1,
  page_size: 10,
  dict_type: '',
  dict_label: ''
})

const dictDataDialog = reactive({
  visible: false,
  title: '',
  isEdit: false
})

const dictDataForm = reactive<any>({
  dict_code: undefined,
  dict_type: '',
  dict_label: '',
  dict_value: '',
  dict_sort: 0,
  status: '0',
  remark: ''
})

const dictDataRules = {
  dict_label: [
    { required: true, message: '字典标签不能为空', trigger: 'blur' },
    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
  ],
  dict_value: [
    { required: true, message: '字典键值不能为空', trigger: 'blur' },
    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
  ],
  dict_sort: [
    { required: true, message: '排序不能为空', trigger: 'blur' }
  ]
}

const currentDictType = reactive<any>({
  dict_id: undefined,
  dict_name: '',
  dict_type: '',
  status: '',
  remark: ''
})

// 字典数据列表对话框
const dictDataListDialog = reactive({
  visible: false
})

// 生命周期钩子
onMounted(() => {
  getDictTypeList()
})

// 字典类型方法
const getDictTypeList = async () => {
  dictTypeLoading.value = true
  try {
    const response = await listDictTypesApiV1SystemDictTypeListGet({
      page: typeQueryParams.page,
      page_size: typeQueryParams.page_size,
      dict_name: typeQueryParams.dict_name || undefined,
      dict_type: typeQueryParams.dict_type || undefined
    })
    
    const { data } = response
    console.log('字典类型API响应:', data)
    
    if (data && data.code === 200) {
      // @ts-ignore
      dictTypeList.value = Array.isArray(data.rows) ? data.rows : []
      // @ts-ignore
      typeTotal.value = data.pageInfo?.total || 0
      
      // 如果列表为空且是第一页，可能是刚创建的数据还未加载，尝试延迟刷新
      if (Array.isArray(data.rows) && data.rows.length === 0 && typeQueryParams.page === 1) {
        console.log('列表为空，可能是新创建的数据，尝试刷新...')
      }
    } else {
      ElMessage.error(data?.msg || '获取字典类型列表失败')
    }
  } catch (error) {
    console.error('获取字典类型列表出错:', error)
    ElMessage.error('获取字典类型列表失败')
  } finally {
    dictTypeLoading.value = false
  }
}

const handleQueryDictTypes = () => {
  typeQueryParams.page = 1
  getDictTypeList()
}

const resetTypeQuery = () => {
  typeQueryParams.dict_name = ''
  typeQueryParams.dict_type = ''
  handleQueryDictTypes()
}

const handleTypePageSizeChange = (size: number) => {
  typeQueryParams.page_size = size
  getDictTypeList()
}

const handleTypePageCurrentChange = (page: number) => {
  typeQueryParams.page = page
  getDictTypeList()
}

const handleAddDictType = () => {
  dictTypeDialog.visible = true
  dictTypeDialog.title = '添加字典类型'
  dictTypeDialog.isEdit = false
  Object.assign(dictTypeForm, {
    dict_id: undefined,
    dict_name: '',
    dict_type: '',
    status: '0',
    remark: ''
  })
}

const handleEditDictType = async (row: any) => {
  dictTypeDialog.visible = true
  dictTypeDialog.title = '编辑字典类型'
  dictTypeDialog.isEdit = true
  
  try {
    const response = await getDictTypeApiV1SystemDictTypeDictIdGet({ dict_id: row.dict_id })
    const { data } = response
    
    if (data && data.code === 200) {
      Object.assign(dictTypeForm, data.data)
    } else {
      ElMessage.error(data?.msg || '获取字典类型详情失败')
    }
  } catch (error) {
    console.error('获取字典类型详情出错:', error)
    ElMessage.error('获取字典类型详情失败')
  }
}

const handleDeleteDictType = async (row: any) => {
  try {
    // 先检查该字典类型下是否有字典数据
    const checkResponse = await listDictDataApiV1SystemDictDataListGet({
      page: 1,
      page_size: 1,
      dict_type: row.dict_type
    })
    
    const { data: checkData } = checkResponse
    
    // 如果有字典数据，提示用户先删除字典数据
    if (checkData?.code === 200 && checkData.rows && checkData.rows.length > 0) {
      ElMessageBox.alert(
        `该字典类型【${row.dict_name}】下有${checkData.pageInfo?.total || checkData.rows.length}条字典数据，请先删除字典数据后再删除此字典类型。`,
        '无法删除',
        {
          confirmButtonText: '我知道了',
          type: 'warning'
        }
      )
      return
    }
    
    // 如果没有字典数据，则继续执行删除操作
    ElMessageBox.confirm(`确认删除字典类型【${row.dict_name}】吗？`, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        try {
          const response = await deleteDictTypeApiV1SystemDictTypeDictIdDelete({ dict_id: row.dict_id })
          const { data } = response
          
          if (data && data.code === 200) {
            ElMessage.success('删除成功')
            getDictTypeList()
            // 如果删除的是当前选中的字典类型，则关闭字典数据弹窗
            if (currentDictType.dict_id === row.dict_id) {
              dictDataListDialog.visible = false
            }
          } else {
            ElMessage.error(data?.msg || '删除失败')
          }
        } catch (error: any) {
          console.error('删除字典类型出错:', error)
          // 直接提取后端返回的详细错误信息
          let errorMsg = '删除失败'
          
          if (error.response) {
            // 尝试从不同的位置获取错误信息
            const { data } = error.response
            if (data) {
              if (data.detail) {
                errorMsg = data.detail
              } else if (data.msg) {
                errorMsg = data.msg
              } else if (typeof data === 'string') {
                errorMsg = data
              }
            }
          }
          
          ElMessage({
            message: errorMsg,
            type: 'error',
            duration: 5000
          })
        }
      })
      .catch(() => {})
  } catch (error) {
    console.error('检查字典数据出错:', error)
    ElMessage.error('检查字典数据失败')
  }
}

const submitDictType = async () => {
  if (!dictTypeFormRef.value) return
  
  try {
    await dictTypeFormRef.value.validate()
    
    if (dictTypeDialog.isEdit) {
      // 编辑
      const response = await updateDictTypeApiV1SystemDictTypeDictIdPut(
        { dict_id: dictTypeForm.dict_id },
        {
          dict_name: dictTypeForm.dict_name,
          dict_type: dictTypeForm.dict_type,
          status: dictTypeForm.status,
          remark: dictTypeForm.remark
        }
      )
      
      const { data } = response
      
      if (data && data.code === 200) {
        ElMessage.success('更新成功')
        dictTypeDialog.visible = false
        
        // 重置为第一页，确保能看到更新的数据
        typeQueryParams.page = 1
        await getDictTypeList()
      } else {
        ElMessage.error(data?.msg || '更新失败')
      }
    } else {
      // 创建
      const response = await createDictTypeApiV1SystemDictTypePost({
        dict_name: dictTypeForm.dict_name,
        dict_type: dictTypeForm.dict_type,
        status: dictTypeForm.status,
        remark: dictTypeForm.remark
      })
      
      const { data } = response
      
      if (data && data.code === 200) {
        ElMessage.success('创建成功')
        dictTypeDialog.visible = false
        
        // 重置为第一页，确保能看到新创建的数据
        typeQueryParams.page = 1
        
        // 延迟刷新，确保后端数据已经保存
        setTimeout(() => {
          getDictTypeList()
        }, 500)
      } else {
        ElMessage.error(data?.msg || '创建失败')
      }
    }
  } catch (error) {
    console.error('提交字典类型表单出错:', error)
    ElMessage.error('提交失败，请检查表单内容')
  }
}

// 字典数据方法
const getDictDataList = async () => {
  if (!currentDictType.dict_type) return
  
  dictDataLoading.value = true
  try {
    const response = await listDictDataApiV1SystemDictDataListGet({
      page: dataQueryParams.page,
      page_size: dataQueryParams.page_size,
      dict_type: dataQueryParams.dict_type,
      dict_label: dataQueryParams.dict_label || undefined
    })
    
    const { data } = response
    console.log('字典数据API响应:', data)
    
    if (data && data.code === 200) {
      // @ts-ignore
      dictDataList.value = Array.isArray(data.rows) ? data.rows : []
      // @ts-ignore
      dataTotal.value = data.pageInfo?.total || 0
    } else {
      ElMessage.error(data?.msg || '获取字典数据列表失败')
    }
  } catch (error) {
    console.error('获取字典数据列表出错:', error)
    ElMessage.error('获取字典数据列表失败')
  } finally {
    dictDataLoading.value = false
  }
}

const handleQueryDictData = () => {
  dataQueryParams.page = 1
  getDictDataList()
}

const resetDataQuery = () => {
  dataQueryParams.dict_label = ''
  handleQueryDictData()
}

const handleDataPageSizeChange = (size: number) => {
  dataQueryParams.page_size = size
  getDictDataList()
}

const handleDataPageCurrentChange = (page: number) => {
  dataQueryParams.page = page
  getDictDataList()
}

const handleRowClick = (row: any) => {
  handleViewDictData(row)
}

const handleViewDictData = (row: any) => {
  Object.assign(currentDictType, row)
  // 打开字典数据弹窗而不是显示下方区域
  dictDataListDialog.visible = true
  // 重置数据查询参数
  dataQueryParams.page = 1
  dataQueryParams.page_size = 10
  dataQueryParams.dict_type = row.dict_type
  dataQueryParams.dict_label = ''
  // 获取字典数据列表
  getDictDataList()
}

const handleAddDictData = () => {
  dictDataDialog.visible = true
  dictDataDialog.title = '添加字典数据'
  dictDataDialog.isEdit = false
  Object.assign(dictDataForm, {
    dict_code: undefined,
    dict_type: currentDictType.dict_type,
    dict_label: '',
    dict_value: '',
    dict_sort: 0,
    status: '0',
    remark: ''
  })
}

const handleEditDictData = (row: any) => {
  dictDataDialog.visible = true
  dictDataDialog.title = '编辑字典数据'
  dictDataDialog.isEdit = true
  Object.assign(dictDataForm, row)
}

const handleDeleteDictData = (row: any) => {
  ElMessageBox.confirm(`确认删除字典数据【${row.dict_label}】吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        const response = await deleteDictDataApiV1SystemDictDataDictCodeDelete({ dict_code: row.dict_code })
        const { data } = response
        
        if (data && data.code === 200) {
          ElMessage.success('删除成功')
          getDictDataList()
        } else {
          ElMessage.error(data?.msg || '删除失败')
        }
      } catch (error) {
        console.error('删除字典数据出错:', error)
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {})
}

const submitDictData = async () => {
  if (!dictDataFormRef.value) return
  
  try {
    await dictDataFormRef.value.validate()
    
    if (dictDataDialog.isEdit) {
      // 编辑
      const response = await updateDictDataApiV1SystemDictDataDictCodePut(
        { dict_code: dictDataForm.dict_code },
        {
          dict_type: dictDataForm.dict_type,
          dict_label: dictDataForm.dict_label,
          dict_value: dictDataForm.dict_value,
          dict_sort: dictDataForm.dict_sort,
          css_class: dictDataForm.css_class,
          list_class: dictDataForm.list_class,
          is_default: dictDataForm.is_default,
          status: dictDataForm.status,
          remark: dictDataForm.remark
        }
      )
      
      const { data } = response
      
      if (data && data.code === 200) {
        ElMessage.success('更新成功')
        dictDataDialog.visible = false
        
        // 重置为第一页，确保能看到更新的数据
        dataQueryParams.page = 1
        await getDictDataList()
      } else {
        ElMessage.error(data?.msg || '更新失败')
      }
    } else {
      // 创建
      const response = await createDictDataApiV1SystemDictDataPost({
        dict_type: dictDataForm.dict_type,
        dict_label: dictDataForm.dict_label,
        dict_value: dictDataForm.dict_value,
        dict_sort: dictDataForm.dict_sort,
        css_class: dictDataForm.css_class,
        list_class: dictDataForm.list_class,
        is_default: dictDataForm.is_default,
        status: dictDataForm.status,
        remark: dictDataForm.remark
      })
      
      const { data } = response
      
      if (data && data.code === 200) {
        ElMessage.success('创建成功')
        dictDataDialog.visible = false
        
        // 重置为第一页，确保能看到新创建的数据
        dataQueryParams.page = 1
        
        // 延迟刷新，确保后端数据已经保存
        setTimeout(() => {
          getDictDataList()
        }, 500)
      } else {
        ElMessage.error(data?.msg || '创建失败')
      }
    }
  } catch (error) {
    console.error('提交字典数据表单出错:', error)
    ElMessage.error('提交失败，请检查表单内容')
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}
.box-card {
  margin-bottom: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  font-size: 16px;
  font-weight: bold;
}
.right {
  display: flex;
  align-items: center;
}
.pagination {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}
.dialog-footer {
  text-align: right;
}
.dict-data-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dict-data-toolbar .left,
.dict-data-toolbar .right {
  display: flex;
  align-items: center;
}
.operation-buttons {
  display: flex;
  align-items: center;
  white-space: nowrap;
  justify-content: space-around;
}
.operation-buttons .el-button {
  margin-right: 8px;
}
</style> 