<template>
  <div class="dashboard-container">
    <div class="welcome-section">
      <a-typography-title :level="2">MyFast-Admin</a-typography-title>
      <a-typography-paragraph>
        MyFast-Admin是一个企业级开发框架
      </a-typography-paragraph>
    </div>

    <!-- 统计卡片区域 -->
    <div class="stat-cards">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-card>
            <template #title>
              <div class="card-title">
                <user-outlined />
                <span>用户总数</span>
              </div>
            </template>
            <a-statistic :value="1256" :precision="0">
              <template #suffix>
                <span class="stat-trend up">
                  <arrow-up-outlined />
                  <span>12%</span>
                </span>
              </template>
            </a-statistic>
            <div class="stat-footer">较上周增长</div>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card>
            <template #title>
              <div class="card-title">
                <shopping-outlined />
                <span>订单数量</span>
              </div>
            </template>
            <a-statistic :value="862" :precision="0">
              <template #suffix>
                <span class="stat-trend up">
                  <arrow-up-outlined />
                  <span>5.2%</span>
                </span>
              </template>
            </a-statistic>
            <div class="stat-footer">较上周增长</div>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card>
            <template #title>
              <div class="card-title">
                <wallet-outlined />
                <span>总收入</span>
              </div>
            </template>
            <a-statistic :value="18960" :precision="0" prefix="¥">
              <template #suffix>
                <span class="stat-trend up">
                  <arrow-up-outlined />
                  <span>8.3%</span>
                </span>
              </template>
            </a-statistic>
            <div class="stat-footer">较上周增长</div>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card>
            <template #title>
              <div class="card-title">
                <calendar-outlined />
                <span>本月活跃</span>
              </div>
            </template>
            <a-statistic :value="756" :precision="0">
              <template #suffix>
                <span class="stat-trend down">
                  <arrow-down-outlined />
                  <span>2.3%</span>
                </span>
              </template>
            </a-statistic>
            <div class="stat-footer">较上周下降</div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 图表区域 -->
    <div class="chart-section">
      <a-row :gutter="16">
        <a-col :span="16">
          <a-card title="月度销售趋势">
            <a-space direction="vertical" :size="20" style="width: 100%">
              <a-radio-group v-model:value="chartType" button-style="solid">
                <a-radio-button value="day">日</a-radio-button>
                <a-radio-button value="week">周</a-radio-button>
                <a-radio-button value="month">月</a-radio-button>
                <a-radio-button value="year">年</a-radio-button>
              </a-radio-group>
              <div ref="salesChart" class="chart-container"></div>
            </a-space>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="销售分布">
            <div ref="pieChart" class="chart-container"></div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 最近活动和待办事项 -->
    <div class="activity-section">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-card title="最近活动" :tab-list="activityTabs" v-model:activeTabKey="activityActiveKey">
            <a-list :data-source="activityList" :pagination="{ pageSize: 5 }">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta :title="item.title">
                    <template #avatar>
                      <a-avatar :style="{ backgroundColor: item.color }">
                        <template #icon><component :is="item.icon" /></template>
                      </a-avatar>
                    </template>
                    <template #description>
                      <div>{{ item.description }}</div>
                      <div class="item-time">{{ item.time }}</div>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card title="待办事项">
            <a-list :data-source="todoList">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-checkbox v-model:checked="item.done">{{ item.title }}</a-checkbox>
                  <div class="todo-tag" :class="{ 'urgent': item.priority === 'urgent' }">
                    {{ item.priority === 'urgent' ? '紧急' : '普通' }}
                  </div>
                </a-list-item>
              </template>
            </a-list>
            <template #extra>
              <a-button type="primary">添加待办</a-button>
            </template>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import { 
  UserOutlined, 
  ShoppingOutlined, 
  WalletOutlined, 
  CalendarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  FileTextOutlined,
  MessageOutlined,
  ToolOutlined,
  BellOutlined
} from '@ant-design/icons-vue';
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
      },
      legend: {
        data: ['订单量', '销售额', '利润']
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
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '订单量',
          type: 'line',
          smooth: true,
          data: [150, 230, 224, 218, 135, 147, 260, 270, 310, 340, 350, 360]
        },
        {
          name: '销售额',
          type: 'line',
          smooth: true,
          data: [820, 932, 901, 934, 1290, 1330, 1320, 1450, 1600, 1700, 1750, 1820]
        },
        {
          name: '利润',
          type: 'line',
          smooth: true,
          data: [320, 332, 301, 334, 390, 330, 320, 350, 400, 450, 480, 520]
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
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        data: ['电子产品', '服装', '食品', '家居', '其他']
      },
      series: [
        {
          name: '销售分布',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '14',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 1048, name: '电子产品' },
            { value: 735, name: '服装' },
            { value: 580, name: '食品' },
            { value: 484, name: '家居' },
            { value: 300, name: '其他' }
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
</script>

<style lang="less" scoped>
.dashboard-container {
  padding: 24px;
  
  .welcome-section {
    margin-bottom: 24px;
    background-color: #fff;
    padding: 24px;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  
  .stat-cards {
    margin-bottom: 24px;
    
    .card-title {
      display: flex;
      align-items: center;
      
      .anticon {
        margin-right: 8px;
        font-size: 16px;
      }
    }
    
    .stat-trend {
      display: inline-flex;
      align-items: center;
      margin-left: 8px;
      
      &.up {
        color: #52c41a;
      }
      
      &.down {
        color: #f5222d;
      }
      
      .anticon {
        margin-right: 4px;
      }
    }
    
    .stat-footer {
      margin-top: 8px;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
  
  .chart-section {
    margin-bottom: 24px;
    
    .chart-container {
      height: 350px;
      width: 100%;
    }
  }
  
  .activity-section {
    .item-time {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
      margin-top: 4px;
    }
    
    .todo-tag {
      padding: 2px 8px;
      border-radius: 2px;
      font-size: 12px;
      background-color: #e6f7ff;
      color: #1890ff;
      
      &.urgent {
        background-color: #fff2f0;
        color: #ff4d4f;
      }
    }
  }
}
</style>
