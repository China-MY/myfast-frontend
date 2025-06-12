<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>分配角色</span>
        </div>
      </template>
      <div>
        <el-form :model="form" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="form.userName" disabled />
          </el-form-item>
          <el-form-item label="角色列表">
            <el-checkbox-group v-model="form.roleIds">
              <el-checkbox v-for="role in roleOptions" :key="role.id" :label="role.id">
                {{ role.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">保存</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 表单数据
const form = reactive({
  userId: undefined,
  userName: '',
  nickName: '',
  roleIds: []
})

// 角色选项
const roleOptions = ref([])

// 初始化数据
onMounted(() => {
  const userId = route.params.userId
  if (userId) {
    form.userId = parseInt(userId)
    // 这里应该调用API获取用户信息和角色列表
    // 临时模拟数据
    form.userName = '测试用户'
    form.nickName = '测试昵称'
    roleOptions.value = [
      { id: 1, name: '管理员' },
      { id: 2, name: '普通用户' }
    ]
  }
})

// 提交表单
const submitForm = () => {
  // 这里应该调用API保存角色分配
  ElMessage.success('保存成功')
  cancel()
}

// 取消
const cancel = () => {
  router.back()
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 