<template>
  <div class="app-container">
    <h2>服务器监控</h2>
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>服务器信息</span>
          <el-button type="primary" size="small" @click="refreshData" :loading="loading">刷新</el-button>
        </div>
      </template>
      <div class="server-info" v-if="!loading && serverInfo">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-descriptions title="系统信息" :column="1" border>
              <el-descriptions-item label="操作系统">{{ serverInfo.os }}</el-descriptions-item>
              <el-descriptions-item label="系统架构">{{ serverInfo.arch }}</el-descriptions-item>
              <el-descriptions-item label="处理器">{{ serverInfo.processor }}</el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col :span="8">
            <el-descriptions title="内存信息" :column="1" border>
              <el-descriptions-item label="总内存">{{ formatSize(serverInfo.total_memory) }}</el-descriptions-item>
              <el-descriptions-item label="已用内存">{{ formatSize(serverInfo.used_memory) }}</el-descriptions-item>
              <el-descriptions-item label="内存使用率">
                <el-progress :percentage="serverInfo.memory_percent" :color="getColorByPercent(serverInfo.memory_percent)"></el-progress>
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col :span="8">
            <el-descriptions title="磁盘信息" :column="1" border>
              <el-descriptions-item label="总空间">{{ formatSize(serverInfo.disk_total) }}</el-descriptions-item>
              <el-descriptions-item label="已用空间">{{ formatSize(serverInfo.disk_used) }}</el-descriptions-item>
              <el-descriptions-item label="磁盘使用率">
                <el-progress :percentage="serverInfo.disk_percent" :color="getColorByPercent(serverInfo.disk_percent)"></el-progress>
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mt-20">
          <el-col :span="24">
            <el-descriptions title="CPU信息" :column="3" border>
              <el-descriptions-item label="CPU使用率">
                <el-progress :percentage="serverInfo.cpu_percent" :color="getColorByPercent(serverInfo.cpu_percent)"></el-progress>
              </el-descriptions-item>
              <el-descriptions-item label="CPU核心数">{{ serverInfo.cpu_count }}</el-descriptions-item>
              <el-descriptions-item label="系统负载">{{ serverInfo.load_avg?.join(' / ') || '未知' }}</el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mt-20">
          <el-col :span="24">
            <el-descriptions title="网络信息" :column="3" border>
              <el-descriptions-item label="主机名">{{ serverInfo.hostname }}</el-descriptions-item>
              <el-descriptions-item label="IP地址">{{ serverInfo.ip }}</el-descriptions-item>
              <el-descriptions-item label="启动时间">{{ formatUptime(serverInfo.boot_time) }}</el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
      </div>
      <el-empty v-else-if="!loading && !serverInfo" description="暂无服务器信息"></el-empty>
      <div v-else class="server-info">
        <p>正在加载服务器信息...</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getServerInfoApiV1MonitorServerGet } from '@/api/fuwuqijiankong';
import { ElMessage } from 'element-plus';

const loading = ref(false);
const serverInfo = ref<any>();

// 获取服务器信息
const fetchServerInfo = async () => {
  loading.value = true;
  try {
    const response = await getServerInfoApiV1MonitorServerGet();
    const res = response.data;
    if (res.code === 200) {
      serverInfo.value = res.data;
    } else {
      ElMessage.error(res.msg || '获取服务器信息失败');
    }
  } catch (error) {
    ///console.error('获取服务器信息出错:', error);
    ElMessage.error('获取服务器信息出错');
  } finally {
    loading.value = false;
  }
};

// 刷新数据
const refreshData = () => {
  fetchServerInfo();
};

// 格式化文件大小
const formatSize = (size: number | undefined): string => {
  if (size === undefined) return '未知';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let index = 0;
  let sizeNum = size;
  
  while (sizeNum >= 1024 && index < units.length - 1) {
    sizeNum /= 1024;
    index++;
  }
  
  return `${sizeNum.toFixed(2)} ${units[index]}`;
};

// 根据百分比获取颜色
const getColorByPercent = (percent: number | undefined): string => {
  if (percent === undefined) return '#909399';
  if (percent < 60) return '#67C23A';
  if (percent < 80) return '#E6A23C';
  return '#F56C6C';
};

// 格式化运行时间
const formatUptime = (timestamp: number | undefined): string => {
  if (timestamp === undefined) return '未知';
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

onMounted(() => {
  ///console.log('服务器监控组件已加载');
  fetchServerInfo();
});
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
.server-info {
  margin-top: 10px;
}
.mt-20 {
  margin-top: 20px;
}
</style>