<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1 class="dashboard-title">MyFast-Admin</h1>
      <p class="dashboard-desc">MyFast-Admin是一个企业级开发框架</p>
    </div>
    
    <div class="stat-cards">
      <el-row :gutter="30">
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card shadow="never" class="stat-card">
            <div class="stat-card-inner">
              <div class="stat-icon">
                <el-icon><User /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-title">用户总数</div>
                <div class="stat-value">
                  <count-to :start-val="0" :end-val="1577536" :duration="2500" separator="," />
                  <span class="stat-trend positive">
                    <el-icon><CaretTop /></el-icon>12%
                  </span>
                </div>
                <div class="stat-desc">较上周增长</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card shadow="never" class="stat-card">
            <div class="stat-card-inner">
              <div class="stat-icon blue">
                <el-icon><List /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-title">订单数量</div>
                <div class="stat-value">
                  <count-to :start-val="0" :end-val="743044" :duration="2500" separator="," />
                  <span class="stat-trend positive">
                    <el-icon><CaretTop /></el-icon>5.2%
                  </span>
                </div>
                <div class="stat-desc">较上周增长</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card shadow="never" class="stat-card">
            <div class="stat-card-inner">
              <div class="stat-icon green">
                <el-icon><Money /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-title">总收入</div>
                <div class="stat-value">
                  ¥<count-to :start-val="0" :end-val="359481600" :duration="2500" separator="," />
                  <span class="stat-trend positive">
                    <el-icon><CaretTop /></el-icon>8.3%
                  </span>
                </div>
                <div class="stat-desc">较上周增长</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card shadow="never" class="stat-card">
            <div class="stat-card-inner">
              <div class="stat-icon orange">
                <el-icon><Calendar /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-title">本月活跃</div>
                <div class="stat-value">
                  <count-to :start-val="0" :end-val="571536" :duration="2500" separator="," />
                  <span class="stat-trend negative">
                    <el-icon><CaretBottom /></el-icon>2.3%
                  </span>
                </div>
                <div class="stat-desc">较上周下降</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <div class="chart-container">
      <el-row :gutter="30">
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
          <el-card shadow="never" class="chart-card">
            <template #header>
              <div class="chart-header">
                <span class="chart-title">月度销售趋势</span>
                <div class="chart-actions">
                  <el-radio-group v-model="salesTimeRange" size="small">
                    <el-radio-button label="day">日</el-radio-button>
                    <el-radio-button label="week">周</el-radio-button>
                    <el-radio-button label="month">月</el-radio-button>
                    <el-radio-button label="year">年</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
            </template>
            <div class="chart-placeholder" ref="salesChart">
              <el-empty v-if="!salesChartInstance" description="图表加载中..." />
            </div>
          </el-card>
        </el-col>
        
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <el-card shadow="never" class="chart-card">
            <template #header>
              <div class="chart-header">
                <span class="chart-title">销售分布</span>
              </div>
            </template>
            <div class="chart-placeholder" ref="pieChart">
              <el-empty v-if="!pieChartInstance" description="图表加载中..." />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import { 
  User, 
  ShoppingCart, 
  Wallet, 
  Calendar,
  ArrowUp,
  ArrowDown,
  Document,
  ChatLineRound,
  Tools,
  Bell,
  List,
  Money,
  CaretTop,
  CaretBottom
} from '@element-plus/icons-vue';
import * as echarts from 'echarts/core';
import { 
  LineChart, 
  BarChart,
  PieChart
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import CountTo from '@/components/CountTo/index.vue';

// 注册必须的组件
echarts.use([
  LineChart,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer
]);

// 图表类型
const chartType = ref('month');

// 图表实例
let salesChartInstance: echarts.ECharts | null = null;
let pieChartInstance: echarts.ECharts | null = null;
const salesChart = ref<HTMLElement | null>(null);
const pieChart = ref<HTMLElement | null>(null);

// 活动标签页
const activityActiveKey = ref('1');
const activityTabs = [
  { key: '1', tab: '系统消息' },
  { key: '2', tab: '用户反馈' },
];

// 解析图标组件
const resolveIcon = (iconName: string) => {
  const iconMap: Record<string, any> = {
    'BellOutlined': Bell,
    'UserOutlined': User,
    'FileTextOutlined': Document,
    'ToolOutlined': Tools,
    'MessageOutlined': ChatLineRound
  };
  return iconMap[iconName] || Bell;
};

// 活动列表数据
const activityList = ref([
  { 
    title: '系统更新完成', 
    description: '系统已成功更新到最新版本v2.3.0', 
    time: '2023-06-15 10:30',
    icon: 'BellOutlined',
    color: '#1890ff'
  },
  { 
    title: '新用户注册', 
    description: '用户张三已成功注册系统', 
    time: '2023-06-14 15:20',
    icon: 'UserOutlined',
    color: '#52c41a'
  },
  { 
    title: '数据备份', 
    description: '系统数据已自动备份完成', 
    time: '2023-06-14 03:00',
    icon: 'FileTextOutlined',
    color: '#722ed1'
  },
  { 
    title: '服务器维护', 
    description: '服务器将于今晚22:00进行例行维护', 
    time: '2023-06-13 16:45',
    icon: 'ToolOutlined',
    color: '#fa8c16'
  },
  { 
    title: '用户反馈', 
    description: '收到3条新的用户反馈', 
    time: '2023-06-12 09:15',
    icon: 'MessageOutlined',
    color: '#eb2f96'
  },
]);

// 待办事项列表
const todoList = ref([
  { title: '完成月度报表', done: false, priority: 'urgent' },
  { title: '审核新用户申请', done: false, priority: 'normal' },
  { title: '更新系统文档', done: true, priority: 'normal' },
  { title: '准备产品发布会', done: false, priority: 'urgent' },
  { title: '召开团队周会', done: false, priority: 'normal' },
]);

// 初始化销售趋势图表
const initSalesChart = () => {
  if (salesChart.value) {
    salesChartInstance = echarts.init(salesChart.value);
    
    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(0, 0, 0, 0.05)',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        },
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(0, 0, 0, 0.03)'
          }
        }
      },
      legend: {
        data: ['订单量', '销售额', '利润'],
        right: '4%',
        top: '0%',
        textStyle: {
          fontSize: 12
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '40px',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        axisLine: {
          lineStyle: {
            color: '#eaeaea'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#999'
        }
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            color: '#f5f5f5'
          }
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#999'
        }
      },
      series: [
        {
          name: '订单量',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          showSymbol: false,
          lineStyle: {
            width: 3,
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 10,
            shadowOffsetY: 5
          },
          itemStyle: {
            borderWidth: 2
          },
          emphasis: {
            focus: 'series'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(64, 158, 255, 0.2)'
                },
                {
                  offset: 1,
                  color: 'rgba(64, 158, 255, 0.01)'
                }
              ]
            }
          },
          data: [250, 330, 324, 418, 435, 535, 622, 680, 750, 820, 880, 940]
        },
        {
          name: '销售额',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          showSymbol: false,
          lineStyle: {
            width: 3,
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 10,
            shadowOffsetY: 5
          },
          itemStyle: {
            borderWidth: 2
          },
          emphasis: {
            focus: 'series'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(83, 194, 64, 0.2)'
                },
                {
                  offset: 1,
                  color: 'rgba(83, 194, 64, 0.01)'
                }
              ]
            }
          },
          data: [82000, 93200, 101000, 134000, 154000, 180000, 210000, 230000, 264000, 280000, 320000, 350000]
        },
        {
          name: '利润',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          showSymbol: false,
          lineStyle: {
            width: 3,
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 10,
            shadowOffsetY: 5
          },
          itemStyle: {
            borderWidth: 2
          },
          emphasis: {
            focus: 'series'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(255, 153, 0, 0.2)'
                },
                {
                  offset: 1,
                  color: 'rgba(255, 153, 0, 0.01)'
                }
              ]
            }
          },
          data: [32000, 38000, 42000, 48000, 55000, 62000, 68000, 74000, 81000, 89000, 96000, 104000]
        }
      ]
    };
    
    salesChartInstance.setOption(option);
  }
};

// 初始化销售分布图表
const initPieChart = () => {
  if (pieChart.value) {
    pieChartInstance = echarts.init(pieChart.value);
    
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(0, 0, 0, 0.05)',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        }
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'center',
        itemGap: 12,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          fontSize: 12
        },
        data: ['电子产品', '服装', '食品', '家居', '其他']
      },
      series: [
        {
          name: '销售分布',
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['30%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '16',
              fontWeight: 'bold'
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.2)'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 135300000, name: '电子产品' },
            { value: 89600000, name: '服装' },
            { value: 64900000, name: '食品' },
            { value: 42500000, name: '家居' },
            { value: 27100000, name: '其他' }
          ]
        }
      ]
    };
    
    pieChartInstance.setOption(option);
  }
};

// 监听窗口大小变化，重新调整图表大小
const handleResize = () => {
  salesChartInstance?.resize();
  pieChartInstance?.resize();
};

onMounted(() => {
  nextTick(() => {
    initSalesChart();
    initPieChart();
    window.addEventListener('resize', handleResize);
  });
});

// 监听图表类型变化
watch(chartType, () => {
  // 这里可以根据不同的图表类型加载不同的数据
  // 简化实现，仅示意
  if (salesChartInstance) {
    const xAxisData = chartType.value === 'day' ? 
      Array.from({length: 30}, (_, i) => `${i+1}日`) :
      chartType.value === 'week' ? 
        ['第1周', '第2周', '第3周', '第4周'] :
        chartType.value === 'month' ? 
          ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] :
          ['2020年', '2021年', '2022年', '2023年'];
          
    salesChartInstance.setOption({
      xAxis: {
        data: xAxisData
      }
    });
  }
});

const salesTimeRange = ref('month');
</script>

<style lang="less" scoped>
.dashboard-container {
  padding: 0;
  
  .dashboard-header {
    margin-bottom: 24px;
    
    .dashboard-title {
      font-size: 28px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin: 0 0 10px 0;
      position: relative;
      
      &:after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -5px;
        width: 50px;
        height: 4px;
        background: var(--el-color-primary);
        border-radius: 2px;
      }
    }
    
    .dashboard-desc {
      font-size: 16px;
      color: var(--el-text-color-secondary);
      margin: 0;
    }
  }
  
  .stat-cards {
    margin-bottom: 50px;
    
    .stat-card {
      transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
      border-radius: 12px;
      border: none;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      margin-bottom: 30px;
      
      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
      }
      
      .stat-card-inner {
        display: flex;
        align-items: center;
        padding: 16px;
      }
      
      .stat-icon {
        width: 64px;
        height: 64px;
        border-radius: 12px;
        background: linear-gradient(135deg, var(--el-color-primary-light-8) 0%, var(--el-color-primary) 100%);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;
        font-size: 28px;
        
        &.blue {
          background: linear-gradient(135deg, var(--el-color-info-light-8) 0%, var(--el-color-info) 100%);
        }
        
        &.green {
          background: linear-gradient(135deg, var(--el-color-success-light-8) 0%, var(--el-color-success) 100%);
        }
        
        &.orange {
          background: linear-gradient(135deg, var(--el-color-warning-light-8) 0%, var(--el-color-warning) 100%);
        }
      }
      
      .stat-content {
        flex: 1;
      }
      
      .stat-title {
        font-size: 16px;
        color: var(--el-text-color-secondary);
        margin-bottom: 10px;
      }
      
      .stat-value {
        font-size: 28px;
        font-weight: 700;
        color: var(--el-text-color-primary);
        display: flex;
        align-items: center;
        line-height: 1.2;
      }
      
      .stat-trend {
        font-size: 14px;
        margin-left: 12px;
        display: flex;
        align-items: center;
        font-weight: 500;
        padding: 4px 8px;
        border-radius: 10px;
        
        &.positive {
          color: var(--el-color-success);
          background-color: var(--el-color-success-light-9);
        }
        
        &.negative {
          color: var(--el-color-danger);
          background-color: var(--el-color-danger-light-9);
        }
      }
      
      .stat-desc {
        font-size: 14px;
        color: var(--el-text-color-secondary);
        margin-top: 6px;
      }
    }
  }
  
  .chart-container {
    margin-top: 20px;
    
    .chart-card {
      margin-bottom: 40px;
      border-radius: 12px;
      border: none;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
      
      &:hover {
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
      }
      
      .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid var(--el-border-color-lighter);
      }
      
      .chart-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
      
      .chart-placeholder {
        height: 350px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

// 响应式布局调整
@media (max-width: 768px) {
  .dashboard-container {
    .dashboard-header {
      .dashboard-title {
        font-size: 24px;
      }
      
      .dashboard-desc {
        font-size: 14px;
      }
    }
    
    .stat-cards {
      .stat-card {
        margin-bottom: 20px;
        
        .stat-icon {
          width: 56px;
          height: 56px;
          font-size: 24px;
          margin-right: 16px;
        }
        
        .stat-title {
          font-size: 14px;
        }
        
        .stat-value {
          font-size: 24px;
        }
      }
    }
    
    .chart-container {
      .chart-card {
        .chart-placeholder {
          height: 280px;
        }
      }
    }
  }
}

// 暗色模式适配
:deep(.is-dark) {
  .dashboard-header {
    .dashboard-title {
      color: rgba(255, 255, 255, 0.85);
    }
    
    .dashboard-desc {
      color: rgba(255, 255, 255, 0.65);
    }
  }
  
  .stat-card {
    background-color: var(--card-bg-color);
    border-color: transparent;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    
    &:hover {
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
    }
    
    .stat-title, .stat-desc {
      color: rgba(255, 255, 255, 0.65);
    }
    
    .stat-value {
      color: rgba(255, 255, 255, 0.85);
    }
    
    .stat-trend {
      &.positive {
        background-color: rgba(82, 196, 26, 0.15);
      }
      
      &.negative {
        background-color: rgba(245, 34, 45, 0.15);
      }
    }
  }
  
  .chart-card {
    background-color: var(--card-bg-color);
    border-color: transparent;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    
    &:hover {
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
    }
    
    .chart-title {
      color: rgba(255, 255, 255, 0.85);
    }
    
    .chart-header {
      border-bottom-color: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>

