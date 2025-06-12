<template>
  <div class="right-toolbar">
    <el-tooltip class="item" effect="dark" content="刷新" placement="top">
      <el-button circle @click="refresh" :loading="refreshLoading">
        <el-icon>
          <Refresh />
        </el-icon>
      </el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
      <el-button circle @click="toggleSearch">
        <el-icon>
          <Search />
        </el-icon>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { Refresh, Search } from '@element-plus/icons-vue'
import { ref } from 'vue'

const props = defineProps({
  showSearch: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:showSearch', 'refreshList'])

// 刷新按钮加载状态
const refreshLoading = ref(false)

// 刷新
const refresh = () => {
  refreshLoading.value = true
  emit('refreshList')
  setTimeout(() => {
    refreshLoading.value = false
  }, 500)
}

// 显示/隐藏搜索
const toggleSearch = () => {
  emit('update:showSearch', !props.showSearch)
}
</script>

<style scoped>
.right-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
  margin-right: 10px;
}

.right-toolbar .el-button {
  margin-left: 8px;
}
</style> 