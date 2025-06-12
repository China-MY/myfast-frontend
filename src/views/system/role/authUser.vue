<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>分配用户</span>
        </div>
      </template>
      <div>
        <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="用户名称" prop="userName">
            <el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable style="width: 240px" />
          </el-form-item>
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input v-model="queryParams.phonenumber" placeholder="请输入手机号码" clearable style="width: 240px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="userList" border>
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="用户名称" prop="userName" />
          <el-table-column label="用户昵称" prop="nickName" />
          <el-table-column label="手机号码" prop="phonenumber" />
          <el-table-column label="状态" align="center">
            <template #default="scope">
              <el-tag type="success" v-if="scope.row.status === '0'">正常</el-tag>
              <el-tag type="danger" v-else>停用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" />
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button type="primary" text @click="handleAdd(scope.row)" v-if="!scope.row.isSelected">分配</el-button>
              <el-button type="primary" text @click="handleCancel(scope.row)" v-else>取消</el-button>
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
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 总记录数
const total = ref(0)
// 用户列表
const userList = ref([])
// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  userName: undefined,
  phonenumber: undefined,
  roleId: undefined
})

// 初始化数据
onMounted(() => {
  const roleId = route.params.roleId
  if (roleId) {
    queryParams.roleId = parseInt(roleId)
    getList()
  }
})

// 获取用户列表
const getList = () => {
  // 这里应该调用API获取用户列表
  // 临时模拟数据
  userList.value = [
    {
      userId: 1,
      userName: 'admin',
      nickName: '管理员',
      phonenumber: '13800138000',
      status: '0',
      createTime: '2023-01-01',
      isSelected: true
    },
    {
      userId: 2,
      userName: 'test',
      nickName: '测试用户',
      phonenumber: '13800138001',
      status: '0',
      createTime: '2023-01-02',
      isSelected: false
    }
  ]
  total.value = 2
}

// 搜索按钮操作
const handleQuery = () => {
  queryParams.pageNum = 1
  getList()
}

// 重置按钮操作
const resetQuery = () => {
  queryParams.userName = undefined
  queryParams.phonenumber = undefined
  queryParams.pageNum = 1
  getList()
}

// 分配用户
const handleAdd = (row) => {
  // 这里应该调用API分配用户角色
  row.isSelected = true
  ElMessage.success('分配用户成功')
}

// 取消分配
const handleCancel = (row) => {
  // 这里应该调用API取消分配
  row.isSelected = false
  ElMessage.success('取消分配成功')
}

// 分页大小改变
const handleSizeChange = (val) => {
  queryParams.pageSize = val
  getList()
}

// 页码改变
const handleCurrentChange = (val) => {
  queryParams.pageNum = val
  getList()
}
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