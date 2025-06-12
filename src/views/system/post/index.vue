<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card class="search-box">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="岗位编码" prop="post_code">
          <el-input v-model="queryParams.post_code" placeholder="请输入岗位编码" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="岗位名称" prop="post_name">
          <el-input v-model="queryParams.post_name" placeholder="请输入岗位名称" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="岗位状态" clearable style="width: 120px">
            <el-option label="正常" value="0" />
            <el-option label="停用" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格区域 -->
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="header-title">岗位列表</span>
          <div>
            <el-button type="primary" icon="Plus" @click="handleAdd" v-hasPermi="['system:post:create']">新增</el-button>
          </div>
        </div>
      </template>

      <!-- 岗位表格数据 -->
      <el-table
        v-loading="loading"
        :data="postList"
        border
        stripe
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column type="index" width="50" align="center" />
        <el-table-column prop="post_name" label="岗位名称" :show-overflow-tooltip="true" min-width="120" />
        <el-table-column prop="post_code" label="岗位编码" :show-overflow-tooltip="true" min-width="120" />
        <el-table-column prop="post_sort" label="岗位顺序" width="100" align="center" />
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === '0' ? 'success' : 'info'" effect="plain">
              {{ scope.row.status === '0' ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="160" align="center" />
        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button plain size="small" type="primary" @click="handleEdit(scope.row)" v-hasPermi="['system:post:update']">
                <el-icon><Edit /></el-icon>
                <span>编辑</span>
              </el-button>
              <el-button plain size="small" type="danger" @click="handleDelete(scope.row)" v-hasPermi="['system:post:delete']">
                <el-icon><Delete /></el-icon>
                <span>删除</span>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-config-provider :locale="locale">
          <div>
            <!-- 添加自定义的总数显示 -->
            
            <el-pagination
              v-if="total > 0"
              :total="total"
              v-model:current-page="queryParams.page"
              v-model:page-size="queryParams.page_size"
              background
              :page-sizes="[10, 20, 30, 50]"
              :layout="paginationLayout"
              :locale="paginationLocale"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
            <span class="total-text">共 {{ total }} 条记录</span>
          </div>
        </el-config-provider>
      </div>
      
      <!-- 显示无数据提示 -->
      <div v-if="postList.length === 0 && !loading" class="empty-block">
        <el-empty description="暂无数据"></el-empty>
      </div>
    </el-card>

    <!-- 新增/编辑岗位对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body destroy-on-close>
      <el-form ref="postForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="岗位名称" prop="post_name">
          <el-input v-model="form.post_name" placeholder="请输入岗位名称" />
        </el-form-item>
        <el-form-item label="岗位编码" prop="post_code">
          <el-input v-model="form.post_code" placeholder="请输入岗位编码" />
        </el-form-item>
        <el-form-item label="岗位顺序" prop="post_sort">
          <el-input-number v-model="form.post_sort" :min="0" class="w-100" />
        </el-form-item>
        <el-form-item label="岗位状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio value="0">正常</el-radio>
            <el-radio value="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElConfigProvider } from 'element-plus'
import { Edit, Delete } from '@element-plus/icons-vue'
import {
  listPostsApiV1SystemPostListGet,
  getPostApiV1SystemPostPostIdGet,
  createPostApiV1SystemPostPost,
  updatePostApiV1SystemPostPostIdPut,
  deletePostApiV1SystemPostPostIdDelete
} from '@/api/gangweiguanli'
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

// 定义岗位数据类型
interface PostData {
  post_id?: number;
  post_name?: string | null;
  post_code?: string | null;
  post_sort?: number | null;
  status?: string | null;
  remark?: string | null;
  create_time?: string | null;
  update_time?: string | null;
  create_by?: string | null;
  update_by?: string | null;
}

// 分页查询参数类型
interface QueryParams {
  post_code: string;
  post_name: string;
  status: string;
  page: number;
  page_size: number;
}

// 岗位列表数据
const postList = ref<PostData[]>([]);
const loading = ref(false);
const total = ref(0);
const queryForm = ref<any>(null);
const postForm = ref<any>(null);

// 查询参数
const queryParams = reactive<QueryParams>({
  post_code: '',
  post_name: '',
  status: '',
  page: 1,
  page_size: 10
})

// 表单参数
const open = ref(false)
const title = ref('')
const form = reactive<any>({
  post_id: undefined,
  post_name: '',
  post_code: '',
  post_sort: 0,
  status: '0',
  remark: ''
})

// 表单校验规则
const rules = {
  post_name: [{ required: true, message: '岗位名称不能为空', trigger: 'blur' }],
  post_code: [{ required: true, message: '岗位编码不能为空', trigger: 'blur' }],
  post_sort: [{ required: true, message: '岗位顺序不能为空', trigger: 'blur' }]
}

// 初始化
onMounted(() => {
  getPostList()
})

// 查询岗位列表
const getPostList = async () => {
  loading.value = true
  try {
    // 构建查询参数对象
    const params: any = {
      page: queryParams.page,
      page_size: queryParams.page_size
    };
    
    // 只有在填写了值的情况下才添加到查询参数中
    if (queryParams.post_code) {
      params.post_code = queryParams.post_code;
    }
    
    if (queryParams.post_name) {
      params.post_name = queryParams.post_name;
    }
    
    if (queryParams.status) {
      params.status = queryParams.status;
    }
    
    ///console.log('查询参数:', params);
    
    const response = await listPostsApiV1SystemPostListGet(params)
    ///console.log('岗位列表响应数据:', response)
    
    // 正确处理API返回数据结构
    const res = response.data || response
    
    if (res.code === 200) {
      // 处理返回的数据结构
      if (res.rows && Array.isArray(res.rows)) {
        postList.value = res.rows as unknown as PostData[];
        ///console.log('设置的列表数据:', postList.value);
      } else {
        postList.value = [];
      }
      
      // 设置总数
      if (res.pageInfo && typeof res.pageInfo.total === 'number') {
        total.value = res.pageInfo.total;
        ///console.log('设置的总数:', total.value);
      } else {
        total.value = 0;
      }
    } else {
      ///console.error('获取岗位列表失败，返回码:', res.code)
      ElMessage.error(res.msg || '获取岗位列表失败')
      postList.value = [];
      total.value = 0;
    }
  } catch (error: any) {
    ///console.error('获取岗位列表失败', error)
    
    let errorMsg = '获取岗位列表失败，请检查网络连接'
    if (error.response) {
      if (error.response.data && error.response.data.detail) {
        errorMsg = `获取岗位列表失败: ${error.response.data.detail}`
      } else if (error.response.status === 500) {
        errorMsg = '服务器内部错误，请联系管理员'
      }
    } else if (error.message) {
      errorMsg = error.message
    }
    
    ElMessage.error(errorMsg)
    postList.value = [];
    total.value = 0;
  } finally {
    loading.value = false
  }
}

// 搜索按钮操作
const handleQuery = () => {
  queryParams.page = 1
  getPostList()
}

// 重置按钮操作
const resetQuery = () => {
  if (queryForm.value) {
    queryForm.value.resetFields();
  } else {
    queryParams.post_code = '';
    queryParams.post_name = '';
    queryParams.status = '';
  }
  queryParams.page = 1;
  handleQuery();
}

// 新增按钮操作
const handleAdd = () => {
  reset()
  title.value = '新增岗位'
  open.value = true
  
  // 重置表单验证
  if (postForm.value) {
    postForm.value.clearValidate();
  }
}

// 编辑按钮操作
const handleEdit = async (row: PostData) => {
  reset()
  try {
    // 确保post_id存在
    if (!row.post_id) {
      ElMessage.error('岗位ID不存在')
      return
    }
    
    const response = await getPostApiV1SystemPostPostIdGet({ post_id: row.post_id })
    const res = response.data || response
    
    if (res.code === 200 && res.data) {
      const { post_id, post_name, post_code, post_sort, status, remark } = res.data
      
      // 设置表单数据
      form.post_id = post_id
      form.post_name = post_name
      form.post_code = post_code
      form.post_sort = post_sort
      form.status = status
      form.remark = remark
      
      title.value = '编辑岗位'
      open.value = true
      
      // 重置表单验证
      if (postForm.value) {
        postForm.value.clearValidate();
      }
    } else {
      ElMessage.error(res.msg || '获取岗位详情失败')
    }
  } catch (error) {
    ///console.error('获取岗位详情失败', error)
    ElMessage.error('获取岗位详情失败，请检查网络连接')
  }
}

// 表单重置
const reset = () => {
  form.post_id = undefined
  form.post_name = ''
  form.post_code = ''
  form.post_sort = 0
  form.status = '0'
  form.remark = ''
}

// 取消按钮
const cancel = () => {
  open.value = false
  reset()
}

// 提交表单
const submitForm = async () => {
  try {
    if (!postForm.value) {
      ///console.error('表单引用不存在');
      ElMessage.error('表单引用不存在');
      return;
    }
    
    // 使用Element Plus表单验证
    await postForm.value.validate();
    
    if (form.post_id) {
      // 修改岗位
      try {
        const response = await updatePostApiV1SystemPostPostIdPut(
          { post_id: form.post_id }, 
          form
        )
        // 处理API返回数据
        const res = response.data || response
        if (res.code === 200) {
          ElMessage.success('修改岗位成功')
          open.value = false
          getPostList() // 刷新岗位列表
        } else {
          ElMessage.error(res.msg || '修改岗位失败')
        }
      } catch (error: any) {
        ///console.error('修改岗位失败:', error)
        let errorMsg = '修改岗位失败'
        
        // 检查是否有详细的错误信息
        if (error.response) {
          if (error.response.data && error.response.data.detail) {
            errorMsg = `修改岗位失败: ${error.response.data.detail}`
          } else if (error.response.data && error.response.data.msg) {
            errorMsg = error.response.data.msg
          } else if (error.response.status === 500) {
            errorMsg = '服务器内部错误，请联系管理员'
          }
        } else if (error.message) {
          errorMsg = error.message
        }
        
        ElMessage.error(errorMsg)
      }
    } else {
      // 新增岗位
      try {
        const response = await createPostApiV1SystemPostPost(form)
        // 处理API返回数据
        const res = response.data || response
        if (res.code === 200) {
          ElMessage.success('新增岗位成功')
          open.value = false
          getPostList() // 刷新岗位列表
        } else {
          ElMessage.error(res.msg || '新增岗位失败')
        }
      } catch (error: any) {
        ///console.error('新增岗位失败:', error)
        let errorMsg = '新增岗位失败'
        
        // 检查是否有详细的错误信息
        if (error.response) {
          if (error.response.data && error.response.data.detail) {
            errorMsg = `新增岗位失败: ${error.response.data.detail}`
          } else if (error.response.data && error.response.data.msg) {
            errorMsg = error.response.data.msg
          } else if (error.response.status === 500) {
            errorMsg = '服务器内部错误，请联系管理员'
          }
        } else if (error.message) {
          errorMsg = error.message
        }
        
        ElMessage.error(errorMsg)
      }
    }
  } catch (error) {
    ///console.error('表单验证失败:', error)
    ElMessage.error('表单数据有误，请检查必填项')
  }
}

// 删除按钮操作
const handleDelete = (row: PostData) => {
  // 确保post_id存在
  if (!row.post_id) {
    ElMessage.error('岗位ID不存在')
    return
  }
  
  ElMessageBox.confirm(
    `确认删除岗位 ${row.post_name || ''} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const response = await deletePostApiV1SystemPostPostIdDelete({ post_id: row.post_id as number })
      const res = response.data || response
      
      if (res.code === 200) {
        ElMessage.success('删除成功')
        getPostList() // 刷新岗位列表
      } else {
        ElMessage.error(res.msg || '删除失败')
      }
    } catch (error: any) {
      ///console.error('删除岗位失败:', error)
      
      let errorMsg = '删除失败'
      if (error.response) {
        if (error.response.data && error.response.data.detail) {
          errorMsg = `删除失败: ${error.response.data.detail}`
        } else if (error.response.data && error.response.data.msg) {
          errorMsg = error.response.data.msg
        }
      } else if (error.message) {
        errorMsg = error.message
      }
      
      ElMessage.error(errorMsg)
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 分页处理
const handleSizeChange = (size: number) => {
  queryParams.page_size = size
  getPostList()
}

const handleCurrentChange = (page: number) => {
  queryParams.page = page
  getPostList()
}
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 50px);
}

.search-box {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.search-box:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
}

.box-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.box-card:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  position: relative;
  padding-left: 12px;
}

.header-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background-color: #409eff;
  border-radius: 2px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  padding: 10px 0;
}

.pagination-container > div > div {
  display: flex;
  justify-content: center;
  align-items: center;
}

.total-text {
  margin-right: 15px;
  font-size: 14px;
  color: #606266;
}

.dialog-footer {
  text-align: right;
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
  margin-top: 15px;
}

.empty-block {
  margin: 40px 0;
  text-align: center;
}

.w-100 {
  width: 100%;
}

/* 表格样式优化 */
:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);
}

:deep(.el-table th) {
  background-color: #f5f7fa !important;
  color: #606266;
  font-weight: 600;
  height: 50px;
}

:deep(.el-table td) {
  padding: 12px 0;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: #fafafa;
}

:deep(.el-table__body tr:hover > td) {
  background-color: #f0f7ff !important;
}

/* 按钮样式优化 */
:deep(.el-button) {
  border-radius: 4px;
  transition: all 0.3s;
  font-weight: normal;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-button.el-button--small) {
  padding: 5px 10px;
  height: 28px;
  margin: 0;
  flex-shrink: 0;
}

:deep(.el-button--primary) {
  background-color: #409eff;
  border-color: #409eff;
}

:deep(.el-button--primary:hover) {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

:deep(.el-button--danger) {
  background-color: #f56c6c;
  border-color: #f56c6c;
}

:deep(.el-button--primary.is-plain) {
  color: #409eff;
  background-color: #ecf5ff;
  border-color: #b3d8ff;
}

:deep(.el-button--primary.is-plain:hover) {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}

:deep(.el-button--danger.is-plain) {
  color: #f56c6c;
  background-color: #fef0f0;
  border-color: #fbc4c4;
}

:deep(.el-button--danger.is-plain:hover) {
  color: #fff;
  background-color: #f56c6c;
  border-color: #f56c6c;
}

:deep(.el-button .el-icon) {
  font-size: 14px;
  margin-right: 4px;
}

:deep(.el-button span) {
  font-size: 13px;
}

:deep(.el-button.is-link) {
  padding: 3px 8px;
  height: auto;
}

:deep(.el-button.is-link:hover) {
  background-color: #ecf5ff;
}

:deep(.el-button.is-link[type="danger"]:hover) {
  background-color: #fef0f0;
}

:deep(.el-button.is-text) {
  padding: 3px 8px;
}

:deep(.el-button[link].el-button--primary) {
  background-color: transparent;
  border-color: transparent;
  color: #409eff;
}

:deep(.el-button[link].el-button--danger) {
  background-color: transparent;
  border-color: transparent;
  color: #f56c6c;
}

:deep(.el-button > span) {
  display: inline-block;
}

/* 表单样式优化 */
:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input__inner) {
  border-radius: 4px;
}

:deep(.el-input__inner:focus) {
  border-color: #409eff;
}

:deep(.el-select .el-input__inner:focus) {
  border-color: #409eff;
}

:deep(.el-tag) {
  border-radius: 4px;
  padding: 0 8px;
  height: 24px;
  line-height: 22px;
}

:deep(.el-tag--success) {
  background-color: #f0f9eb;
  color: #67c23a;
  border-color: #e1f3d8;
}

:deep(.el-tag--info) {
  background-color: #f4f4f5;
  color: #909399;
  border-color: #e9e9eb;
}

:deep(.el-dialog) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  padding: 20px 20px 10px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

/* 响应式布局优化 */
@media screen and (max-width: 768px) {
  .app-container {
    padding: 10px;
  }
  
  .el-form-item {
    margin-bottom: 15px;
  }
  
  .search-box, .box-card {
    border-radius: 6px;
  }
  
  .header-title {
    font-size: 16px;
  }
  
  :deep(.el-dialog) {
    width: 95% !important;
    margin: 10px auto !important;
  }
}

/* 过渡动画 */
.el-table-column, .el-form-item {
  transition: all 0.3s ease;
}

:deep(.el-pagination) {
  padding: 10px 5px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);
}

:deep(.el-select.el-select--small) {
  min-width: 120px !important;
}

:deep(.el-pagination .el-select .el-input) {
  width: 120px !important;
}

:deep(.el-pagination__sizes) {
  margin-right: 15px;
}

:deep(.el-pagination .btn-prev .el-icon),
:deep(.el-pagination .btn-next .el-icon) {
  font-size: 12px;
  font-weight: bold;
}

:deep(.el-pagination button:disabled) {
  background-color: #f4f4f5;
}

:deep(.el-pagination .el-select .el-input .el-select__caret) {
  display: inline-block;
}

:deep(.el-pagination .el-input__inner) {
  text-align: center;
}

:deep(.el-pagination .btn-prev) {
  padding-right: 12px;
}

:deep(.el-pagination .btn-next) {
  padding-left: 12px;
}

.operation-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 8px;
}
</style> 