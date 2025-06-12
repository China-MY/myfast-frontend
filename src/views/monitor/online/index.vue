<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="queryParams.ipaddr"
        placeholder="登录IP地址"
        class="filter-item"
        style="width: 200px;"
        @keyup.enter="handleQuery"
      />
      <el-input
        v-model="queryParams.user_name"
        placeholder="用户名称"
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
      <el-button type="danger" class="filter-item" @click="handleBatchForceLogout" :disabled="selectedTokens.length === 0">
        批量强退
      </el-button>
    </div>

    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="onlineList"
      style="width: 100%; margin-top: 15px;"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="会话编号" align="center" width="120">
        <template #default="scope">
          <el-tooltip :content="scope.row.sessionId" placement="top">
            <span>{{ formatSessionId(scope.row.sessionId) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="用户名称" align="center" prop="user_name" />
      <el-table-column label="登录IP地址" align="center" prop="ipaddr" width="130" />
      <el-table-column label="登录地点" align="center" prop="login_location" :show-overflow-tooltip="true" />
      <el-table-column label="浏览器" align="center" prop="browser" :show-overflow-tooltip="true" />
      <el-table-column label="操作系统" align="center" prop="os" :show-overflow-tooltip="true" />
      <el-table-column label="登录时间" align="center" prop="start_timestamp" width="180" />
      <el-table-column label="操作" align="center" width="120">
        <template #default="scope">
          <el-button 
            type="danger" 
            size="small" 
            @click="handleForceLogout(scope.row)"
            :disabled="isCurrentUser(scope.row)"
          >
            强退
          </el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox, ElConfigProvider } from 'element-plus'
import {
  listOnlineUsersApiV1MonitorOnlineListGet,
  forceLogoutApiV1MonitorOnlineTokenDelete,
  batchForceLogoutApiV1MonitorOnlineBatchLogoutPost
} from '@/api/zaixianyonghu'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { useUserStore } from '@/stores/modules/user'

// 获取用户存储
const userStore = useUserStore()

// 当前用户信息
const currentUser = computed(() => userStore.userInfo || {})

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

// 自定义在线用户类型定义
interface OnlineUser {
  sessionId: string;
  user_id?: number | null;
  user_name?: string;
  ipaddr?: string;
  login_location?: string;
  browser?: string;
  os?: string;
  status?: string;
  start_timestamp?: string | null;
  last_access_time?: string | null;
  expire_time?: number;
}

// 加载状态
const loading = ref(false)

// 总记录数
const total = ref(0)

// 在线用户列表数据
const onlineList = ref<OnlineUser[]>([])

// 查询参数
const queryParams = reactive({
  page: 1,
  page_size: 10,
  ipaddr: '',
  user_name: ''
})

// 选中的会话tokens
const selectedTokens = ref<string[]>([])

// 初始化
onMounted(() => {
  getList()
})

// 获取在线用户列表
const getList = async () => {
  loading.value = true
  try {
    ///console.log('获取在线用户列表，参数:', queryParams)
    const res = await listOnlineUsersApiV1MonitorOnlineListGet({
      page: queryParams.page,
      page_size: queryParams.page_size,
      ipaddr: queryParams.ipaddr || undefined,
      username: queryParams.user_name || undefined  // 使用API需要的参数名 username
    })
    
    ///console.log('在线用户列表响应:', res)
    // 处理响应数据
    const response = res.data || {}
    if (response.code === 200) {
      // 处理API返回的数据，确保类型转换正确
      onlineList.value = (response.rows || []).map((item: any) => ({
        sessionId: item.sessionId || '',
        user_id: item.user_id,
        user_name: item.user_name || '',
        ipaddr: item.ipaddr || '',
        login_location: item.login_location || '',
        browser: item.browser || '',
        os: item.os || '',
        status: item.status || '',
        start_timestamp: item.start_timestamp || '',
        last_access_time: item.last_access_time || '',
        expire_time: item.expire_time || 0
      }));
      total.value = response.pageInfo?.total || 0
    } else {
      ElMessage.error(response.msg || '获取在线用户列表失败')
    }
  } catch (error: any) {
    ///console.error('获取在线用户列表出错:', error)
    ElMessage.error('获取在线用户列表失败: ' + (error.message || String(error)))
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
  queryParams.ipaddr = ''
  queryParams.user_name = ''
  queryParams.page = 1
  getList()
}

// 多选框选中数据
const handleSelectionChange = (selection: OnlineUser[]) => {
  selectedTokens.value = selection.map(item => item.sessionId)
  ///console.log('选中的会话:', selectedTokens.value)
}

// 强制单个用户退出
const handleForceLogout = (row: OnlineUser) => {
  if (isCurrentUser(row)) {
    ElMessage.warning('不能强制退出自己的会话')
    return
  }
  
  ElMessageBox.confirm(
    `确认强制退出用户 ${row.user_name || '未知用户'} 的会话？`,
    '强制退出',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      loading.value = true
      ///console.log('开始强制退出用户，会话ID:', row.sessionId)
      const res = await forceLogoutApiV1MonitorOnlineTokenDelete({ token: row.sessionId })
      
      const response = res.data || {}
      if (response.code === 200) {
        ElMessage.success('强制退出成功')
        getList() // 刷新列表
      } else {
        ElMessage.error(response.msg || '强制退出失败')
      }
    } catch (error) {
      ///console.error('强制退出用户出错：', error)
      ElMessage.error('强制退出用户失败，请稍后再试')
    } finally {
      loading.value = false
    }
  }).catch(() => {
    // 用户取消操作
  })
}

// 批量强制退出
const handleBatchForceLogout = () => {
  if (selectedTokens.value.length === 0) {
    ElMessage.warning('请至少选择一个用户')
    return
  }
  
  ElMessageBox.confirm(`确认强制退出选中的 ${selectedTokens.value.length} 个用户吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      loading.value = true
      ///console.log('开始批量强制退出用户，会话IDs:', selectedTokens.value)
      const res = await batchForceLogoutApiV1MonitorOnlineBatchLogoutPost({
        session_ids: selectedTokens.value  // 使用API需要的参数名 session_ids
      })
      
      const response = res.data || {}
      if (response.code === 200) {
        ElMessage.success('批量强制退出成功')
        getList()
      } else {
        ElMessage.error(response.msg || '批量强制退出失败')
      }
    } catch (error) {
      ///console.error('批量强制退出用户出错：', error)
      ElMessage.error('批量强制退出用户出错')
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

// 格式化会话ID
const formatSessionId = (sessionId: string) => {
  if (!sessionId) return '';
  if (sessionId.length <= 12) return sessionId;
  return sessionId.substring(0, 6) + '...' + sessionId.substring(sessionId.length - 6);
}

// 判断是否为当前用户
const isCurrentUser = (row: OnlineUser) => {
  // 判断是否是当前登录用户
  const isSameUser = row.user_id === currentUser.value?.user_id;
  
  // 管理员账号限制逻辑 - 如果需要可以启用
  // const isAdmin = row.user_name === 'admin';
  
  // 返回是否为当前用户（如果是当前用户不允许强退）
  return isSameUser;
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