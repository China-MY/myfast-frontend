<template>
  <div>
    <div v-if="linkUrl">
      <iframe :src="linkUrl" frameborder="0" class="inner-link-iframe"></iframe>
    </div>
    <div v-else class="inner-link-loading">
      <el-empty description="链接加载中或无效的链接地址" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 链接地址
const linkUrl = ref('')

// 计算链接地址
const computeLinkAddress = () => {
  if (route.meta && route.meta.link) {
    // 如果是http开头，则是完整的URL
    if (isHttp(route.meta.link)) {
      linkUrl.value = route.meta.link
    } else {
      // 否则拼接当前域名
      linkUrl.value = window.location.origin + route.meta.link
    }
  } else if (route.query && route.query.url) {
    // 如果有URL查询参数
    linkUrl.value = decodeURIComponent(route.query.url)
  } else {
    linkUrl.value = ''
  }
  ///console.log('内部链接地址:', linkUrl.value)
}

// 检查是否为HTTP地址
const isHttp = (url) => {
  return url.toLowerCase().startsWith('http://') || url.toLowerCase().startsWith('https://')
}

// 监听路由变化
watch(() => [route.meta, route.query], () => {
  computeLinkAddress()
}, { deep: true })

// 组件初始化
onMounted(() => {
  computeLinkAddress()
})
</script>

<style scoped>
.inner-link-iframe {
  width: 100%;
  height: calc(100vh - 84px);
  overflow: auto;
  border: none;
}
.inner-link-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 84px);
}
</style> 