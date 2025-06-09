<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1 class="dashboard-title">MyFast-Admin</h1>
      <p class="dashboard-desc">MyFast-Admin是一个企业级开发框架</p>
    </div>

    <!-- 统计卡片区域 -->
    <el-row :gutter="20" class="statistics-row">
      <el-col :xs="24" :sm="12" :md="6" v-for="(item, index) in statisticsData" :key="index">
        <el-card shadow="hover" class="statistics-card">
          <div class="statistics-card-inner">
            <div class="statistics-icon" :style="{ backgroundColor: item.bgColor }">
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
            </div>
            <div class="statistics-info">
              <div class="statistics-value">{{ item.value }}</div>
              <div class="statistics-title">{{ item.title }}</div>
            </div>
          </div>
          <div class="statistics-footer">
            <span>{{ item.footer }}</span>
            <el-icon v-if="item.increase"><ArrowUp /></el-icon>
            <el-icon v-else><ArrowDown /></el-icon>
            <span>{{ item.rate }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :sm="24" :md="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>用户增长趋势</span>
              <el-radio-group v-model="userGrowthTimeRange" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="year">全年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container" ref="userGrowthChart"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>系统资源占用</span>
              <el-switch
                v-model="realTimeMonitor"
                active-text="实时"
                inactive-text="静态"
                size="small"
              />
            </div>
          </template>
          <div class="chart-container" ref="resourceChart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近活动 -->
    <el-row :gutter="20" class="activity-row">
      <el-col :xs="24" :sm="24" :md="16">
        <el-card shadow="hover" class="activity-card">
          <template #header>
            <div class="activity-header">
              <span>最近活动</span>
              <el-button type="primary" size="small" plain>查看全部</el-button>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in recentActivities"
              :key="index"
              :timestamp="activity.time"
              :type="activity.type"
              :color="activity.color"
            >
              <div class="activity-content">
                <span class="activity-user">{{ activity.user }}</span>
                <span>{{ activity.action }}</span>
                <el-tag v-if="activity.tag" size="small" :type="activity.tagType">{{ activity.tag }}</el-tag>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8">
        <el-card shadow="hover" class="todo-card">
          <template #header>
            <div class="todo-header">
              <span>待办事项</span>
              <el-button type="primary" size="small" plain @click="addNewTodo">新增</el-button>
            </div>
          </template>
          <el-empty v-if="todoList.length === 0" description="暂无待办事项"></el-empty>
          <div v-else class="todo-list">
            <div v-for="(todo, index) in todoList" :key="index" class="todo-item">
              <el-checkbox v-model="todo.completed" @change="toggleTodo(index)">
                <span :class="{ 'todo-completed': todo.completed }">{{ todo.title }}</span>
              </el-checkbox>
              <div class="todo-actions">
                <el-tag size="small" :type="todo.priority === 'high' ? 'danger' : todo.priority === 'medium' ? 'warning' : 'info'">
                  {{ todo.priority === 'high' ? '紧急' : todo.priority === 'medium' ? '普通' : '低优' }}
                </el-tag>
                <el-button type="danger" size="small" icon="Delete" circle plain @click="removeTodo(index)"></el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, watch, onUnmounted, reactive, computed } from 'vue'
import * as echarts from 'echarts'
import { 
  ArrowUp, 
  ArrowDown, 
  Goods, 
  User, 
  ShoppingCart, 
  Money,
  Delete
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getServerInfoApiV1MonitorServerGet } from '@/api/fuwuqijiankong'

// 统计数据
const statisticsData = ref([
  {
    title: '活跃用户',
    value: '14,396',
    icon: 'User',
    footer: '较上月',
    increase: true,
    rate: '12%',
    bgColor: '#409EFF'
  },
  {
    title: '订单数量',
    value: '6,421',
    icon: 'ShoppingCart',
    footer: '较昨日',
    increase: true,
    rate: '8.5%',
    bgColor: '#67C23A'
  },
  {
    title: '商品总数',
    value: '9,854',
    icon: 'Goods',
    footer: '本月新增',
    increase: false,
    rate: '2.1%',
    bgColor: '#E6A23C'
  },
  {
    title: '总收入',
    value: '￥98,423',
    icon: 'Money',
    footer: '较上季度',
    increase: true,
    rate: '15.3%',
    bgColor: '#F56C6C'
  }
])

// 用户增长图表
const userGrowthChart = ref<HTMLElement | null>(null)
const userGrowthTimeRange = ref('week')
let userGrowthChartInstance: echarts.ECharts | null = null

// 系统资源图表
const resourceChart = ref<HTMLElement | null>(null)
const realTimeMonitor = ref(false)
let resourceChartInstance: echarts.ECharts | null = null

// 最近活动
const recentActivities = ref([
  {
    user: '管理员',
    action: '创建了新用户',
    time: '2023-12-01 10:30',
    type: 'primary',
    color: '#409EFF',
    tag: '用户管理',
    tagType: ''
  },
  {
    user: '系统',
    action: '检测到服务器负载过高',
    time: '2023-12-01 09:15',
    type: 'warning',
    color: '#E6A23C',
    tag: '系统警告',
    tagType: 'warning'
  },
  {
    user: '张三',
    action: '更新了产品价格',
    time: '2023-11-30 16:45',
    type: 'info',
    color: '#909399',
    tag: '产品管理',
    tagType: 'info'
  },
  {
    user: '李四',
    action: '完成了订单处理',
    time: '2023-11-30 14:20',
    type: 'success',
    color: '#67C23A',
    tag: '订单系统',
    tagType: 'success'
  },
  {
    user: '王五',
    action: '提交了错误报告',
    time: '2023-11-29 11:05',
    type: 'danger',
    color: '#F56C6C',
    tag: 'Bug修复',
    tagType: 'danger'
  }
])

// 待办事项
const todoList = ref([
  {
    title: '完成系统需求分析',
    completed: false,
    priority: 'high'
  },
  {
    title: '修复用户登录问题',
    completed: false,
    priority: 'high'
  },
  {
    title: '更新产品文档',
    completed: true,
    priority: 'medium'
  },
  {
    title: '准备周报',
    completed: false,
    priority: 'medium'
  },
  {
    title: '检查系统安全性',
    completed: false,
    priority: 'low'
  }
])

// 添加新待办
const addNewTodo = () => {
  todoList.value.unshift({
    title: '新建待办事项',
    completed: false,
    priority: 'medium'
  })
}

// 移除待办
const removeTodo = (index: number) => {
  todoList.value.splice(index, 1)
}

// 切换待办状态
const toggleTodo = (index: number) => {
  const todo = todoList.value[index]
  todo.completed = !todo.completed
}

// 创建一个缓存对象，存储服务器监控数据
const serverMonitorCache = {
  data: null as any,
  timestamp: 0, 
  expirationTime: 60000, // 数据有效期，默认1分钟
  isLoading: false,
  loadingPromise: null as Promise<any> | null
};

// 创建一个带缓存的获取服务器信息的函数
const fetchServerInfoWithCache = async () => {
  const now = Date.now();
  
  // 如果有正在进行的请求，直接返回该Promise
  if (serverMonitorCache.isLoading && serverMonitorCache.loadingPromise) {
    console.log('正在获取服务器信息，等待完成...');
    return await serverMonitorCache.loadingPromise;
  }
  
  // 检查缓存是否有效
  if (serverMonitorCache.data && now - serverMonitorCache.timestamp < serverMonitorCache.expirationTime) {
    console.log('使用缓存的服务器监控数据');
    return serverMonitorCache.data;
  }
  
  console.log('开始获取服务器监控数据');
  serverMonitorCache.isLoading = true;
  
  try {
    // 创建异步请求并保存Promise
    serverMonitorCache.loadingPromise = getServerInfoApiV1MonitorServerGet();
    const res = await serverMonitorCache.loadingPromise;
    
    console.log('服务器监控API响应:', res);
    
    // 适配不同的响应结构
    if (res?.data?.code === 200 && res.data.data) {
      // 标准响应结构 { code, msg, data: {...} }
      serverMonitorCache.data = res.data.data;
      serverMonitorCache.timestamp = now;
      console.log('服务器监控数据已更新 (标准结构)');
    } else if (res?.data && typeof res.data === 'object' && !res.data.code) {
      // 直接数据结构 { cpu: {...}, mem: {...}, ... }
      serverMonitorCache.data = res.data;
      serverMonitorCache.timestamp = now;
      console.log('服务器监控数据已更新 (直接数据)');
    } else {
      console.error('获取服务器信息失败，响应格式错误:', res);
      // 返回空数据或模拟数据
      serverMonitorCache.data = {
        cpu: { usage: 30 },
        mem: { usage: 40 },
        disk: [{ usage: 50 }],
        network: { sent_bytes: 1000000, recv_bytes: 2000000 }
      };
    }
    
    return serverMonitorCache.data;
  } catch (error) {
    console.error('获取服务器监控数据错误:', error);
    // 返回模拟数据以防止UI错误
    return {
      cpu: { usage: 25 },
      mem: { usage: 35 },
      disk: [{ usage: 45 }],
      network: { sent_bytes: 500000, recv_bytes: 1000000 }
    };
  } finally {
    serverMonitorCache.isLoading = false;
    serverMonitorCache.loadingPromise = null;
  }
};

// 初始化用户增长图表
const initUserGrowthChart = async () => {
  if (!userGrowthChart.value) return
  
  if (userGrowthChartInstance) {
    userGrowthChartInstance.dispose()
  }
  
  userGrowthChartInstance = echarts.init(userGrowthChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: userGrowthTimeRange.value === 'week' 
        ? ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        : userGrowthTimeRange.value === 'month'
          ? ['第1周', '第2周', '第3周', '第4周']
          : ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '新增用户',
        type: 'line',
        smooth: true,
        areaStyle: {
          opacity: 0.3
        },
        lineStyle: {
          width: 3
        },
        itemStyle: {
          color: '#409EFF'
        },
        data: userGrowthTimeRange.value === 'week'
          ? [120, 132, 101, 134, 90, 230, 210]
          : userGrowthTimeRange.value === 'month'
            ? [520, 632, 701, 834]
            : [320, 332, 301, 334, 390, 330, 320, 432, 501, 534, 690, 730]
      },
      {
        name: '活跃用户',
        type: 'line',
        smooth: true,
        areaStyle: {
          opacity: 0.3
        },
        lineStyle: {
          width: 3
        },
        itemStyle: {
          color: '#67C23A'
        },
        data: userGrowthTimeRange.value === 'week'
          ? [220, 182, 191, 234, 290, 330, 310]
          : userGrowthTimeRange.value === 'month'
            ? [1220, 1182, 1191, 1234]
            : [820, 932, 901, 934, 1290, 1330, 1320, 1432, 1501, 1534, 1590, 1630]
      }
    ]
  }
  
  userGrowthChartInstance.setOption(option)
}

// 初始化系统资源图表
const initResourceChart = async () => {
  if (!resourceChart.value) return
  
  if (resourceChartInstance) {
    resourceChartInstance.dispose()
  }

  // 获取服务器监控数据
  let serverInfo: any = null;
  try {
    serverInfo = await fetchServerInfoWithCache();
  } catch (error) {
    console.error('获取服务器监控数据失败:', error);
  }
  
  resourceChartInstance = echarts.init(resourceChart.value)
  
  // 处理磁盘使用率 - 如果是数组，取第一个磁盘或平均值
  let diskUsage = 0;
  if (serverInfo?.disk) {
    if (Array.isArray(serverInfo.disk)) {
      if (serverInfo.disk.length > 0) {
        // 可以选择第一个磁盘或计算平均值
        diskUsage = serverInfo.disk[0].usage;
      }
    } else if (typeof serverInfo.disk === 'object') {
      diskUsage = serverInfo.disk.usage || 0;
    }
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['CPU使用率', '内存使用率', '磁盘使用率', '网络流量']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']
      }
    ],
    yAxis: [
      {
        type: 'value',
        max: 100,
        axisLabel: {
          formatter: '{value}%'
        }
      }
    ],
    series: [
      {
        name: 'CPU使用率',
        type: 'line',
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        itemStyle: {
          color: '#F56C6C'
        },
        // 如果有真实数据则显示当前值，否则使用模拟数据
        data: serverInfo?.cpu?.usage !== undefined ? 
          [15, 20, 30, 40, 50, serverInfo.cpu.usage, serverInfo.cpu.usage] :
          [25, 30, 45, 70, 65, 55, 40]
      },
      {
        name: '内存使用率',
        type: 'line',
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        itemStyle: {
          color: '#E6A23C'
        },
        // 如果有真实数据则显示当前值，否则使用模拟数据
        data: serverInfo?.mem?.usage !== undefined ? 
          [30, 35, 40, 45, 50, serverInfo.mem.usage, serverInfo.mem.usage] :
          [45, 48, 52, 60, 65, 68, 63]
      },
      {
        name: '磁盘使用率',
        type: 'line',
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        itemStyle: {
          color: '#409EFF'
        },
        // 使用处理后的磁盘数据
        data: diskUsage ? 
          [40, 42, 44, 46, 48, diskUsage, diskUsage] :
          [60, 62, 65, 68, 70, 72, 75]
      },
      {
        name: '网络流量',
        type: 'line',
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        yAxisIndex: 0,
        itemStyle: {
          color: '#67C23A'
        },
        // 网络流量转换为百分比显示(0-100%)，基于典型千兆网络理论最大带宽
        data: serverInfo?.network ? 
          [10, 15, 20, 25, 30, Math.min(serverInfo.network.sent_bytes / 100000000 * 100, 100), Math.min(serverInfo.network.recv_bytes / 100000000 * 100, 100)] :
          [15, 20, 25, 30, 35, 40, 35]
      }
    ]
  }
  
  resourceChartInstance.setOption(option)
}

// 监听屏幕尺寸变化，调整图表大小
const handleResize = () => {
  userGrowthChartInstance?.resize()
  resourceChartInstance?.resize()
}

// 监听时间范围变化
watch(userGrowthTimeRange, () => {
  nextTick(() => {
    initUserGrowthChart()
  })
})

// 监听实时监控开关
watch(realTimeMonitor, (newVal) => {
  if (newVal) {
    // 模拟实时数据更新
    const timer = setInterval(async () => {
      if (!realTimeMonitor.value) {
        clearInterval(timer)
        return
      }
      
      try {
        // 获取实际服务器监控数据
        const serverInfo = await fetchServerInfoWithCache();
        
        if (serverInfo && resourceChartInstance) {
          const option = resourceChartInstance.getOption()
          const series = option.series as echarts.SeriesOption[]
          
          // 使用真实数据或模拟数据
          const cpuUsage = serverInfo?.cpu?.usage || Math.floor(Math.random() * 50) + 30;
          const memUsage = serverInfo?.mem?.usage || Math.floor(Math.random() * 20) + 50;
          const diskUsage = serverInfo?.disk?.usage || Math.floor(Math.random() * 10) + 60;
          
          // 更新CPU使用率数据
          const cpuData = series[0].data as number[]
          cpuData.shift()
          cpuData.push(cpuUsage)
          
          // 更新内存使用率数据
          const memData = series[1].data as number[]
          memData.shift()
          memData.push(memUsage)
          
          // 更新磁盘使用率数据
          const diskData = series[2].data as number[]
          diskData.shift()
          diskData.push(diskUsage)
          
          // 更新网络流量(模拟)
          const networkData = series[3].data as number[]
          networkData.shift()
          networkData.push(Math.floor(Math.random() * 30) + 20)
          
          // 更新图表
          resourceChartInstance.setOption({
            series: [
              { data: cpuData },
              { data: memData },
              { data: diskData },
              { data: networkData }
            ]
          })
        }
      } catch (error) {
        console.error('更新监控数据失败:', error);
      }
    }, 3000)
    
    return () => clearInterval(timer)
  }
})

onMounted(async () => {
  nextTick(async () => {
    await initUserGrowthChart();
    await initResourceChart();
    window.addEventListener('resize', handleResize);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  userGrowthChartInstance?.dispose()
  resourceChartInstance?.dispose()
})
</script>

<style lang="less" scoped>
.dashboard-container {
  padding: 20px;
}

.dashboard-header {
  margin-bottom: 24px;
  text-align: center;
  
  .dashboard-title {
    font-size: 28px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 8px;
  }
  
  .dashboard-desc {
    font-size: 16px;
    color: #606266;
  }
}

.statistics-row {
  margin-bottom: 20px;
}

.statistics-card {
  height: 120px;
  
  .statistics-card-inner {
    display: flex;
    align-items: center;
  }
  
  .statistics-icon {
    width: 56px;
    height: 56px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 16px;
    
    .el-icon {
      font-size: 28px;
      color: #fff;
    }
  }
  
  .statistics-info {
    flex: 1;
    
    .statistics-value {
      font-size: 24px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 4px;
    }
    
    .statistics-title {
      font-size: 14px;
      color: #606266;
    }
  }
  
  .statistics-footer {
    margin-top: 16px;
    font-size: 13px;
    color: #909399;
    
    .el-icon {
      margin: 0 4px;
    }
  }
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  margin-bottom: 20px;
  
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    span {
      font-size: 16px;
      font-weight: 500;
    }
  }
  
  .chart-container {
    height: 350px;
  }
}

.activity-card, .todo-card {
  margin-bottom: 20px;
  
  .activity-header, .todo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    span {
      font-size: 16px;
      font-weight: 500;
    }
  }
}

.activity-content {
  .activity-user {
    font-weight: 500;
    margin-right: 8px;
  }
  
  .el-tag {
    margin-left: 8px;
  }
}

.todo-list {
  max-height: 350px;
  overflow-y: auto;
  
  .todo-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #EBEEF5;
    
    &:last-child {
      border-bottom: none;
    }
    
    .todo-completed {
      text-decoration: line-through;
      color: #909399;
    }
    
    .todo-actions {
      display: flex;
      align-items: center;
      
      .el-tag {
        margin-right: 8px;
      }
    }
  }
}
</style>

