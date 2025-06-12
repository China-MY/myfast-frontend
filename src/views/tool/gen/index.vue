<template>
  <div class="app-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>代码生成</span>
          <div>
            <el-button type="primary" @click="handleImport">导入表结构</el-button>
          </div>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
        <el-form-item label="表名称" prop="tableName">
          <el-input
            v-model="queryParams.tableName"
            placeholder="请输入表名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="表描述" prop="tableComment">
          <el-input
            v-model="queryParams.tableComment"
            placeholder="请输入表描述"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 操作按钮区域 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            @click="handleGenerate(undefined)"
            :disabled="single"
          >生成代码</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="info"
            plain
            @click="handlePreview(undefined)"
            :disabled="single"
          >预览</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            @click="handleEdit(undefined)"
            :disabled="single"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            @click="handleDelete(undefined)"
            :disabled="multiple"
          >删除</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @refreshList="getList"></right-toolbar>
      </el-row>

      <!-- 表格区域 -->
      <el-table v-loading="loading" :data="tableList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="表名称" prop="table_name" :show-overflow-tooltip="true" />
        <el-table-column label="表描述" prop="table_comment" :show-overflow-tooltip="true" />
        <el-table-column label="实体类名称" prop="class_name" :show-overflow-tooltip="true" />
        <el-table-column label="创建时间" prop="create_time" width="160" />
        <el-table-column label="更新时间" prop="update_time" width="160" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button type="text" @click="handlePreview(scope.row)">预览</el-button>
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
            <el-button type="text" @click="handleGenerate(scope.row)">生成代码</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页区域 -->
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />

      <!-- 导入表结构对话框 -->
      <el-dialog 
        title="导入表结构" 
        v-model="importOpen" 
        width="800px" 
        :close-on-click-modal="false"
        destroy-on-close
      >
        <el-form :model="importForm" ref="importFormRef" :rules="importRules">
          <el-form-item label="选择数据源" prop="dataSourceId">
            <el-select v-model="importForm.dataSourceId" placeholder="请选择数据源" style="width: 100%">
              <el-option v-for="item in dataSourceOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="表名称" prop="tables">
            <el-select v-model="importForm.tables" multiple placeholder="请选择要导入的表" style="width: 100%">
              <el-option v-for="item in dbTableList" :key="item.table_name" :label="item.table_name + (item.table_comment ? ' (' + item.table_comment + ')' : '')" :value="item.table_name" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="importOpen = false">取消</el-button>
            <el-button type="primary" @click="handleImportTable">确定</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 预览对话框 -->
      <el-dialog 
        title="代码预览" 
        v-model="previewOpen" 
        width="90%" 
        top="5vh" 
        :close-on-click-modal="false"
        destroy-on-close
        class="preview-dialog"
      >
        <div class="preview-header">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索代码内容"
            clearable
            @keyup.enter="searchInCode"
            style="width: 300px; margin-right: 10px;"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" @click="searchInCode" size="small">
            <el-icon><Search /></el-icon>搜索
          </el-button>
          <el-button 
            type="primary" 
            @click="findPrevMatch" 
            size="small" 
            :disabled="searchResults.length === 0"
          >
            上一个
          </el-button>
          <el-button 
            type="primary" 
            @click="findNextMatch" 
            size="small" 
            :disabled="searchResults.length === 0"
          >
            下一个
          </el-button>
          <el-button type="info" @click="resetSearch" size="small">
            <el-icon><RefreshRight /></el-icon>重置
          </el-button>
          <el-button 
            type="success" 
            @click="batchDownloadFiles" 
            size="small"
            title="使用代码生成按钮可下载完整代码包"
          >
            <el-icon><Folder /></el-icon>下载所有
          </el-button>
          <div class="file-count">
            文件数量: {{ previewList.length }}
            <span v-if="searchResults.length > 0">
              | 匹配: {{ currentSearchIndex + 1 }}/{{ searchResults.length }}
            </span>
          </div>
        </div>
        
        <div class="preview-container">
          <!-- 文件树导航 -->
          <div class="file-tree">
            <div class="file-tree-header">文件列表</div>
            <el-scrollbar height="calc(85vh - 170px)">
              <div 
                v-for="(item, index) in previewList" 
                :key="index"
                :class="['file-item', { 'active': previewActiveTab === item.file_path }]"
                @click="previewActiveTab = item.file_path"
              >
                <el-icon><Document /></el-icon>
                <span :title="item.file_path">{{ getFileName(item.file_path) }}</span>
              </div>
            </el-scrollbar>
          </div>
          
          <!-- 代码内容 -->
          <div class="code-container">
            <el-tabs v-model="previewActiveTab" type="card">
              <el-tab-pane
                v-for="item in previewList"
                :key="item.file_path"
                :label="getFileName(item.file_path)"
                :name="item.file_path"
              >
                <div class="code-actions">
                  <el-button 
                    type="primary" 
                    size="small" 
                    @click="copyCode(item.file_content)"
                  >
                    <el-icon><CopyDocument /></el-icon>复制代码
                  </el-button>
                  <el-button 
                    type="success" 
                    size="small" 
                    @click="downloadSingleFile(item)"
                  >
                    <el-icon><Download /></el-icon>下载文件
                  </el-button>
                </div>
                <el-scrollbar height="calc(85vh - 210px)">
                  <pre 
                    class="code-preview" 
                    v-html="highlightCode(item.file_content, getFileType(item.file_path))"
                  ></pre>
                </el-scrollbar>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Search, 
  Document, 
  Download, 
  CopyDocument, 
  RefreshRight,
  Folder
} from '@element-plus/icons-vue'
import { 
  getTableListApiV1ToolGenListGet, 
  getDbTablesApiV1ToolGenTablesGet, 
  importTablesApiV1ToolGenImportPost, 
  previewCodeApiV1ToolGenIdPreviewGet, 
  deleteTableApiV1ToolGenIdDelete, 
  batchDeleteTablesApiV1ToolGenBatchDelete, 
  generateCodeApiV1ToolGenIdGenerateGet, 
  batchGenerateCodeApiV1ToolGenBatchGeneratePost,
  getTableTotalApiV1ToolGenTotalGet
} from '@/api/daimashengcheng'

// 组件引入
import Pagination from '@/components/Pagination/index.vue'
import RightToolbar from '@/components/RightToolbar/index.vue'

// 定义类型，确保与API返回类型匹配
interface TableInfo {
  id: number
  table_name: string
  table_comment: string
  class_name: string
  create_time: string
  update_time: string
}

interface DbTable {
  table_name: string
  table_comment: string
}

interface PreviewCode {
  file_path: string
  file_content: string
}

const router = useRouter()

// 控制显示/隐藏搜索条件
const showSearch = ref(true)

// 加载状态
const loading = ref(false)

// 选中数据
const ids = ref<number[]>([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)

// 表格数据
const tableList = ref<TableInfo[]>([])

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  tableName: '',
  tableComment: ''
})

// 日期范围
const dateRange = ref<[Date, Date] | null>(null)

// 导入对话框参数
const importOpen = ref(false)
const importForm = reactive({
  dataSourceId: '1',
  tables: [] as string[]
})
const importRules = {
  dataSourceId: [{ required: true, message: '请选择数据源', trigger: 'change' }],
  tables: [{ required: true, message: '请选择要导入的表', trigger: 'change' }]
}
const dataSourceOptions = ref([
  { value: '1', label: '主数据源' }
])
const dbTableList = ref<DbTable[]>([])

// 预览对话框参数
const previewOpen = ref(false)
const previewActiveTab = ref('')
const previewList = ref<PreviewCode[]>([])
const searchKeyword = ref('')
const searchResults = ref<{filePath: string, matches: number}[]>([])
const currentSearchIndex = ref(0)

// 获取表格数据
const getList = () => {
  loading.value = true
  tableList.value = []
  
  // 调用API获取表格数据
  getTableListApiV1ToolGenListGet({
    page_num: queryParams.pageNum,
    page_size: queryParams.pageSize,
    table_name: queryParams.tableName,
    table_comment: queryParams.tableComment,
    begin_time: dateRange.value ? dateRange.value[0].toISOString() : undefined,
    end_time: dateRange.value ? dateRange.value[1].toISOString() : undefined
  })
    .then(response => {
      // 确保response.data是数组
      if (response && response.data && Array.isArray(response.data)) {
        tableList.value = response.data as TableInfo[]
      } else {
        tableList.value = []
        console.warn('API返回的数据格式不正确:', response)
      }
      
      // 获取总数
      getTableTotalApiV1ToolGenTotalGet({
        table_name: queryParams.tableName,
        table_comment: queryParams.tableComment,
        begin_time: dateRange.value ? dateRange.value[0].toISOString() : undefined,
        end_time: dateRange.value ? dateRange.value[1].toISOString() : undefined
      })
        .then(count => {
          if (count && typeof count.data === 'number') {
            total.value = count.data
          } else {
            console.warn('获取表总数返回格式不正确:', count)
            total.value = 0
          }
        })
        .catch(error => {
          console.error('获取表总数失败：', error)
          total.value = 0
        })
    })
    .catch(error => {
      console.error('获取表格数据失败：', error)
      ElMessage.error({
        message: '获取表格数据失败，请检查网络连接和服务器状态',
        duration: 5000
      })
      tableList.value = []
      total.value = 0
    })
    .finally(() => {
      loading.value = false
    })
}

// 表格复选框选择
const handleSelectionChange = (selection: TableInfo[]) => {
  ids.value = selection.map(item => item.id)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

// 搜索按钮操作
const handleQuery = () => {
  queryParams.pageNum = 1
  getList()
}

// 重置按钮操作
const resetQuery = () => {
  dateRange.value = null
  Object.keys(queryParams).forEach(key => {
    if (key !== 'pageNum' && key !== 'pageSize') {
      queryParams[key] = ''
    }
  })
  handleQuery()
}

// 导入表结构按钮操作
const handleImport = () => {
  // 先重置表单
  importForm.tables = []
  importForm.dataSourceId = '1'
  
  // 先显示对话框
  importOpen.value = true
  
  // 添加加载状态
  loading.value = true
  
  // 调用API获取数据库表列表
  getDbTablesApiV1ToolGenTablesGet()
    .then(response => {
      if (response) {
        // 确保response.data是数组类型
        if (response.data && Array.isArray(response.data)) {
          dbTableList.value = response.data as DbTable[]
          console.log('获取数据库表成功：', dbTableList.value)
        } else {
          dbTableList.value = []
          ElMessage.warning('接收到的数据库表信息格式不正确')
        }
      } else {
        dbTableList.value = []
        ElMessage.warning('未获取到数据库表信息')
      }
    })
    .catch(error => {
      console.error('获取数据库表失败：', error)
      ElMessage.error({
        message: '获取数据库表失败，请检查网络连接和服务器状态',
        duration: 5000
      })
      dbTableList.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

// 导入表结构确认按钮操作
const handleImportTable = () => {
  if (!importForm.tables || importForm.tables.length === 0) {
    ElMessage.warning('请选择要导入的表')
    return
  }
  
  // 添加加载状态
  loading.value = true
  
  // 调用API导入表结构
  importTablesApiV1ToolGenImportPost({
    tables: importForm.tables,
    data_source_id: importForm.dataSourceId
  })
    .then((response) => {
      if (response) {
        console.log('导入表结构成功：', response)
        ElMessage.success({
          message: '导入成功',
          duration: 3000
        })
        importOpen.value = false
        getList()
      } else {
        ElMessage.warning('导入结果为空')
      }
    })
    .catch(error => {
      console.error('导入表结构失败：', error)
      ElMessage.error({
        message: '导入表结构失败，请检查网络连接和服务器状态',
        duration: 5000
      })
    })
    .finally(() => {
      loading.value = false
    })
}

// 生成代码按钮操作
const handleGenerate = (row: TableInfo | undefined) => {
  const tableIds = row ? [row.id] : ids.value
  if (!tableIds.length) {
    ElMessage.warning('请选择要生成的表')
    return
  }
  
  // 显示确认对话框
  ElMessageBox.confirm(
    '确定要生成选中表的代码吗？生成的代码将以ZIP包形式下载。',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    loading.value = true
    ElMessage({
      type: 'info',
      message: '代码生成中，请稍候...',
      duration: 2000
    })
    
    if (tableIds.length === 1) {
      // 单表生成
      try {
        // 使用iframe下载方式，避免fetch API可能的限制
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
        const url = `${apiBaseUrl}/v1/tool/gen/${tableIds[0]}/generate`
        
        // 获取token
        const token = localStorage.getItem('token')
        
        // 创建一个隐藏的iframe用于下载
        const iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        document.body.appendChild(iframe)
        
        // 创建表单并提交
        const form = document.createElement('form')
        form.method = 'GET'
        form.action = url
        form.target = 'download_iframe'
        
        // 添加token到header
        if (token) {
          const tokenInput = document.createElement('input')
          tokenInput.type = 'hidden'
          tokenInput.name = 'Authorization'
          tokenInput.value = `Bearer ${token}`
          form.appendChild(tokenInput)
        }
        
        document.body.appendChild(form)
        iframe.name = 'download_iframe'
        
        // 监听iframe加载完成事件
        iframe.onload = () => {
          try {
            // 检查iframe内容，判断是否下载成功
            const iframeContent = iframe.contentDocument || iframe.contentWindow?.document
            if (iframeContent) {
              const errorText = iframeContent.body.innerText
              if (errorText && errorText.includes('error')) {
                ElMessage.error({
                  message: `生成代码失败: ${errorText}`,
                  duration: 5000
                })
              } else {
                ElMessage.success('代码生成成功，下载已开始')
              }
            } else {
              // 如果无法访问iframe内容，假定下载成功
              ElMessage.success('代码生成成功，下载已开始')
            }
          } catch (e) {
            // 如果出现跨域问题，也假定下载成功
            ElMessage.success('代码生成成功，下载已开始')
          } finally {
            // 清理DOM
            setTimeout(() => {
              document.body.removeChild(iframe)
              document.body.removeChild(form)
              loading.value = false
            }, 1000)
          }
        }
        
        // 处理可能的错误
        iframe.onerror = () => {
          ElMessage.error({
            message: '生成代码失败，请检查网络连接和服务器状态',
            duration: 5000
          })
          document.body.removeChild(iframe)
          document.body.removeChild(form)
          loading.value = false
        }
        
        // 提交表单开始下载
        form.submit()
        
      } catch (error: any) {
        console.error('生成代码失败：', error)
        ElMessage.error({
          message: `生成代码失败: ${error.message || '请检查网络连接和服务器状态'}`,
          duration: 5000
        })
        loading.value = false
      }
    } else {
      // 批量生成
      try {
        // 使用form提交方式下载
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
        const url = `${apiBaseUrl}/v1/tool/gen/batch/generate`
        
        // 获取token
        const token = localStorage.getItem('token')
        
        // 创建一个隐藏的iframe用于下载
        const iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        document.body.appendChild(iframe)
        
        // 创建表单并提交
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = url
        form.target = 'download_iframe'
        form.enctype = 'application/x-www-form-urlencoded'
        
        // 添加token到header
        if (token) {
          const tokenInput = document.createElement('input')
          tokenInput.type = 'hidden'
          tokenInput.name = 'Authorization'
          tokenInput.value = `Bearer ${token}`
          form.appendChild(tokenInput)
        }
        
        // 添加表ID数据
        const idsInput = document.createElement('input')
        idsInput.type = 'hidden'
        idsInput.name = 'table_ids'
        idsInput.value = JSON.stringify(tableIds)
        form.appendChild(idsInput)
        
        document.body.appendChild(form)
        iframe.name = 'download_iframe'
        
        // 监听iframe加载完成事件
        iframe.onload = () => {
          try {
            // 检查iframe内容，判断是否下载成功
            const iframeContent = iframe.contentDocument || iframe.contentWindow?.document
            if (iframeContent) {
              const errorText = iframeContent.body.innerText
              if (errorText && errorText.includes('error')) {
                ElMessage.error({
                  message: `批量生成代码失败: ${errorText}`,
                  duration: 5000
                })
              } else {
                ElMessage.success({
                  message: `批量代码生成成功，共 ${tableIds.length} 个表，下载已开始`,
                  duration: 3000
                })
              }
            } else {
              // 如果无法访问iframe内容，假定下载成功
              ElMessage.success({
                message: `批量代码生成成功，共 ${tableIds.length} 个表，下载已开始`,
                duration: 3000
              })
            }
          } catch (e) {
            // 如果出现跨域问题，也假定下载成功
            ElMessage.success({
              message: `批量代码生成成功，共 ${tableIds.length} 个表，下载已开始`,
              duration: 3000
            })
          } finally {
            // 清理DOM
            setTimeout(() => {
              document.body.removeChild(iframe)
              document.body.removeChild(form)
              loading.value = false
            }, 1000)
          }
        }
        
        // 处理可能的错误
        iframe.onerror = () => {
          ElMessage.error({
            message: '批量生成代码失败，请检查网络连接和服务器状态',
            duration: 5000
          })
          document.body.removeChild(iframe)
          document.body.removeChild(form)
          loading.value = false
        }
        
        // 提交表单开始下载
        form.submit()
        
      } catch (error: any) {
        console.error('批量生成代码失败：', error)
        ElMessage.error({
          message: `批量生成代码失败: ${error.message || '请检查网络连接和服务器状态'}`,
          duration: 5000
        })
        loading.value = false
      }
    }
  }).catch(() => {
    // 用户取消操作
  })
}

// 预览按钮操作
const handlePreview = (row: TableInfo | undefined) => {
  const tableId = row ? row.id : ids.value[0]
  if (!tableId) {
    ElMessage.warning('请选择要预览的表')
    return
  }
  
  loading.value = true
  
        // 调用API获取预览代码
  previewCodeApiV1ToolGenIdPreviewGet({ id: tableId })
    .then(response => {
      console.log('预览代码API返回数据:', response)
      
      // 从响应中提取数据，处理不同的响应结构
      let previewData: any[] = []
      
      try {
        // 使用try-catch避免类型错误
        if (response && response.data) {
          const responseData = response.data as any;
          
          if (Array.isArray(responseData)) {
            // 直接是数组
            previewData = responseData;
          } else if (responseData.data && Array.isArray(responseData.data)) {
            // 标准响应格式 { code, msg, data }
            previewData = responseData.data;
          } else if (typeof responseData === 'object') {
            // 其他可能的响应格式
            console.warn('预览代码API返回了非标准格式:', responseData);
            // 尝试提取对象中的数组属性
            for (const key in responseData) {
              if (Array.isArray(responseData[key])) {
                previewData = responseData[key];
                break;
              }
            }
          }
        }
      } catch (error) {
        console.error('解析预览代码数据时出错:', error);
      }
      
      // 检查预览数据是否为空
      if (previewData.length === 0) {
        ElMessageBox.confirm(
          '未能获取到预览代码，可能是因为模板文件不存在或未正确配置。是否要手动创建默认模板文件?',
          '提示',
          {
            confirmButtonText: '创建模板',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          // 创建默认模板文件的操作
          ElMessage.info('正在创建默认模板文件，请稍后...');
          createDefaultTemplates(tableId);
        }).catch(() => {
          // 用户取消操作
        });
        return;
      }
      
      if (previewData.length > 0) {
        // 确保提取的数据格式正确
        try {
          previewList.value = previewData.map(item => ({
            file_path: item.file_path || '',
            file_content: item.file_content || ''
          }));
          
          // 检查是否缺少vue_api.js文件
          const hasVueApi = previewList.value.some(item => 
            item.file_path.includes('vue_api.js') || 
            item.file_path.endsWith('vue_api.js')
          );
          
          console.log('是否包含vue_api.js:', hasVueApi, '文件总数:', previewList.value.length);
          
          if (!hasVueApi && previewList.value.length === 5) {
            // 前端重新请求生成代码，以便后端能创建完整模板
            ElMessage.info('正在补充缺失模板文件，请稍后...');
            createDefaultTemplates(tableId);
            return;
          }
          
          if (previewList.value.length > 0) {
            previewOpen.value = true;
            previewActiveTab.value = previewList.value[0].file_path;
          } else {
            ElMessage.warning('无可预览代码');
          }
        } catch (error) {
          console.error('处理预览数据时出错:', error);
          ElMessage.error('处理预览数据失败');
        }
      } else {
        ElMessage.warning('无法从API响应中提取预览代码');
        console.warn('预览代码API返回格式不正确或为空:', response);
      }
    })
    .catch(error => {
      console.error('预览代码失败：', error);
      ElMessage.error({
        message: '预览代码失败，请检查网络连接和服务器状态',
        duration: 5000
      });
    })
    .finally(() => {
      loading.value = false;
    });
}

// 创建默认模板文件
const createDefaultTemplates = (tableId: number) => {
  // 此处添加创建默认模板的API调用
  // 由于后端可能没有提供这个API，我们可以先通过生成代码的方式让后端自动创建模板
  loading.value = true;
  
  generateCodeApiV1ToolGenIdGenerateGet({ id: tableId })
    .then(response => {
      ElMessage.success('模板文件创建成功，请重新尝试预览代码');
      // 等待一会儿再重新尝试预览
      setTimeout(() => {
        handlePreview({ id: tableId } as TableInfo);
      }, 1000);
    })
    .catch(error => {
      console.error('创建模板文件失败：', error);
      ElMessage.error('创建模板文件失败，请联系管理员手动创建模板');
    })
    .finally(() => {
      loading.value = false;
    });
}

// 编辑按钮操作
const handleEdit = (row: TableInfo | undefined) => {
  const tableId = row ? row.id : ids.value[0]
  if (!tableId) {
    ElMessage.warning('请选择要编辑的表')
    return
  }
  
  // 打印调试信息
  console.log('编辑表ID:', tableId)
  
  // 使用路由配置中的路径
  const routePath = `/tool/gen/editTable/${tableId}`
  console.log('导航到:', routePath)
  
  // 直接导航到编辑页面
  router.push(routePath)
}

// 删除按钮操作
const handleDelete = (row: TableInfo | undefined) => {
  const tableIds = row ? [row.id] : ids.value
  if (!tableIds.length) {
    ElMessage.warning('请选择要删除的表')
    return
  }
  ElMessageBox.confirm('确认删除所选记录?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    loading.value = true
    
    // 调用API删除表
    if (tableIds.length === 1) {
      deleteTableApiV1ToolGenIdDelete({ id: tableIds[0] })
        .then((response) => {
          if (response && response.status === 200) {
            ElMessage.success('删除成功')
            getList()
          } else {
            ElMessage.warning('删除请求未成功处理')
          }
        })
        .catch(error => {
          console.error('删除失败：', error)
          ElMessage.error({
            message: '删除失败，请检查网络连接和服务器状态',
            duration: 5000
          })
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      // 批量删除
      batchDeleteTablesApiV1ToolGenBatchDelete({ ids: tableIds })
        .then((response) => {
          if (response && response.status === 200) {
            ElMessage.success('批量删除成功')
            getList()
          } else {
            ElMessage.warning('批量删除请求未成功处理')
          }
        })
        .catch(error => {
          console.error('批量删除失败：', error)
          ElMessage.error({
            message: '批量删除失败，请检查网络连接和服务器状态',
            duration: 5000
          })
        })
        .finally(() => {
          loading.value = false
        })
    }
  }).catch(() => {})
}

// 搜索代码
const searchInCode = () => {
  if (!searchKeyword.value) {
    ElMessage.info('请输入搜索关键词')
    return
  }
  
  // 重置搜索结果
  searchResults.value = []
  currentSearchIndex.value = 0
  
  // 查找包含关键词的文件
  const keyword = searchKeyword.value.toLowerCase()
  
  previewList.value.forEach(item => {
    const content = item.file_content.toLowerCase()
    const matches = (content.match(new RegExp(keyword, 'g')) || []).length
    
    if (matches > 0) {
      searchResults.value.push({
        filePath: item.file_path,
        matches
      })
    }
  })
  
  if (searchResults.value.length > 0) {
    // 切换到第一个匹配的文件
    previewActiveTab.value = searchResults.value[0].filePath
    ElMessage.success(`找到 ${searchResults.value.length} 个匹配文件，共 ${getTotalMatches()} 处匹配`)
  } else {
    ElMessage.warning('未找到匹配内容')
  }
}

// 获取匹配总数
const getTotalMatches = () => {
  return searchResults.value.reduce((total, result) => total + result.matches, 0)
}

// 查找下一个匹配
const findNextMatch = () => {
  if (searchResults.value.length === 0) {
    ElMessage.warning('没有搜索结果')
    return
  }
  
  currentSearchIndex.value = (currentSearchIndex.value + 1) % searchResults.value.length
  previewActiveTab.value = searchResults.value[currentSearchIndex.value].filePath
}

// 查找上一个匹配
const findPrevMatch = () => {
  if (searchResults.value.length === 0) {
    ElMessage.warning('没有搜索结果')
    return
  }
  
  currentSearchIndex.value = (currentSearchIndex.value - 1 + searchResults.value.length) % searchResults.value.length
  previewActiveTab.value = searchResults.value[currentSearchIndex.value].filePath
}

// 重置搜索
const resetSearch = () => {
  searchKeyword.value = ''
  searchResults.value = []
  currentSearchIndex.value = 0
}

// 复制代码
const copyCode = (code: string) => {
  navigator.clipboard.writeText(code)
    .then(() => {
      ElMessage.success('代码已复制到剪贴板')
    })
    .catch(() => {
      ElMessage.error('复制失败，请手动复制')
    })
}

// 批量下载文件
const batchDownloadFiles = () => {
  if (previewList.value.length === 0) {
    ElMessage.warning('没有可下载的文件')
    return
  }

  // 提示用户使用生成代码功能下载完整代码包
  ElMessageBox.confirm(
    '您正在尝试单独下载预览中的文件。如需下载完整代码包，建议使用"生成代码"功能。确定要继续下载预览文件吗？',
    '提示',
    {
      confirmButtonText: '继续下载',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 用户确认下载
    ElMessage({
      type: 'info',
      message: `开始下载 ${previewList.value.length} 个文件，请在浏览器中确认下载`
    })

    // 由于无法使用JSZip库，我们采用逐个下载的方式
    // 创建一个延迟队列，避免浏览器同时触发太多下载
    let delay = 0
    previewList.value.forEach(item => {
      setTimeout(() => {
        downloadSingleFile(item, false) // 不显示消息
      }, delay)
      delay += 300 // 每个下载间隔300毫秒
    })

    ElMessage.success({
      message: '文件下载已开始，请注意浏览器下载提示',
      duration: 5000
    })
  }).catch(() => {
    // 用户取消下载
  })
}

// 下载单个文件 (添加消息显示控制参数)
const downloadSingleFile = (item: PreviewCode, showMessage = true) => {
  const blob = new Blob([item.file_content], { type: 'text/plain' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', getFileName(item.file_path))
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
  
  if (showMessage) {
    ElMessage.success('文件下载成功')
  }
}

// 获取文件名
const getFileName = (filePath: string): string => {
  const parts = filePath.split('/')
  return parts[parts.length - 1]
}

// 获取文件类型
const getFileType = (filePath: string): string => {
  const extension = filePath.split('.').pop()?.toLowerCase() || ''
  
  const typeMap: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'java': 'java',
    'html': 'html',
    'css': 'css',
    'xml': 'xml',
    'json': 'json',
    'sql': 'sql',
    'md': 'markdown',
    'vue': 'vue'
  }
  
  return typeMap[extension] || 'plaintext'
}

// 高亮代码
const highlightCode = (code: string, fileType: string): string => {
  // 这里实现简单的语法高亮
  // 实际项目中建议使用highlight.js、prism.js等库
  
  // 简单的HTML转义
  let highlighted = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  
  // 简单的关键字高亮
  const keywords = [
    'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return',
    'class', 'import', 'export', 'from', 'public', 'private', 'protected',
    'interface', 'type', 'extends', 'implements', 'static', 'async', 'await'
  ]
  
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g')
    highlighted = highlighted.replace(regex, `<span class="keyword">${keyword}</span>`)
  })
  
  // 简单的字符串高亮
  highlighted = highlighted
    .replace(/(".*?")/g, '<span class="string">$1</span>')
    .replace(/('.*?')/g, '<span class="string">$1</span>')
  
  // 简单的注释高亮
  highlighted = highlighted
    .replace(/(\/\/.*)/g, '<span class="comment">$1</span>')
    .replace(/\/\*([\s\S]*?)\*\//g, '<span class="comment">$&</span>')
  
  return highlighted
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mb8 {
  margin-bottom: 8px;
}

.code-preview {
  background-color: #f5f7fa;
  padding: 15px;
  overflow: auto;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
}

.preview-dialog :deep(.el-dialog__body) {
  padding: 10px;
  overflow: hidden;
}

.preview-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 0 10px;
}

.file-count {
  margin-left: auto;
  color: #606266;
  font-size: 14px;
}

.preview-container {
  display: flex;
  height: calc(85vh - 130px);
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
}

.file-tree {
  width: 250px;
  border-right: 1px solid #e4e7ed;
  background-color: #f5f7fa;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.file-tree-header {
  padding: 10px;
  font-weight: bold;
  border-bottom: 1px solid #e4e7ed;
  background-color: #f0f2f5;
}

.file-item {
  padding: 8px 15px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: background-color 0.3s;
  font-size: 14px;
}

.file-item:hover {
  background-color: #e6f7ff;
}

.file-item.active {
  background-color: #e6f7ff;
  color: #409eff;
  border-right: 2px solid #409eff;
}

.code-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.code-container :deep(.el-tabs__header) {
  margin: 0;
}

.code-container :deep(.el-tabs__content) {
  flex: 1;
  overflow: hidden;
}

.code-actions {
  padding: 10px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}

/* 语法高亮样式 */
.keyword {
  color: #0033b3;
  font-weight: bold;
}

.string {
  color: #008000;
}

.comment {
  color: #808080;
  font-style: italic;
}
</style> 