<template>
  <div class="app-container">
    <a-card title="服务器信息" bordered>
      <a-button type="primary" class="refresh-btn" @click="getServerData">
        <template #icon><ReloadOutlined /></template>
        刷新
      </a-button>

      <a-row :gutter="24" v-if="serverInfo">
        <a-col :span="12" style="margin-bottom: 20px;">
          <a-card title="CPU使用率" :bordered="false">
            <div ref="cpuChartRef" class="chart-container"></div>
            <a-descriptions :column="1" bordered>
              <a-descriptions-item label="核心数">{{ serverInfo.cpu.cpuNum }}</a-descriptions-item>
              <a-descriptions-item label="使用率">{{ serverInfo.cpu.used }}%</a-descriptions-item>
              <a-descriptions-item label="空闲率">{{ serverInfo.cpu.free }}%</a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>
        <a-col :span="12" style="margin-bottom: 20px;">
          <a-card title="内存使用率" :bordered="false">
            <div ref="memChartRef" class="chart-container"></div>
            <a-descriptions :column="1" bordered>
              <a-descriptions-item label="总内存">{{ formatSize(serverInfo.mem.total) }}</a-descriptions-item>
              <a-descriptions-item label="已用内存">{{ formatSize(serverInfo.mem.used) }}</a-descriptions-item>
              <a-descriptions-item label="剩余内存">{{ formatSize(serverInfo.mem.free) }}</a-descriptions-item>
              <a-descriptions-item label="使用率">{{ serverInfo.mem.usage }}%</a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>
        <a-col :span="24">
          <a-card title="磁盘使用率" :bordered="false">
            <a-table :dataSource="serverInfo.disks" :columns="diskColumns" rowKey="dirName" :pagination="false">
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'usage'">
                  <a-progress :percent="record.usage" :status="record.usage > 80 ? 'exception' : 'normal'" />
                </template>
              </template>
            </a-table>
          </a-card>
        </a-col>
      </a-row>
      <a-empty v-else description="暂无数据" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef } from 'vue';
import { ReloadOutlined } from '@ant-design/icons-vue';
import { getServerInfo } from '@/api/monitor/server';
import { message } from 'ant-design-vue';
import * as echarts from 'echarts/core';
import { GaugeChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { TitleComponent, TooltipComponent } from 'echarts/components';

// 注册必要的组件
echarts.use([GaugeChart, CanvasRenderer, TitleComponent, TooltipComponent]);

const serverInfo = ref<any>(null);
const cpuChartRef = ref<HTMLElement | null>(null);
const memChartRef = ref<HTMLElement | null>(null);
let cpuChart: echarts.ECharts | null = null;
let memChart: echarts.ECharts | null = null;

// 磁盘列表列定义
const diskColumns = [
  { title: '盘符路径', dataIndex: 'dirName', key: 'dirName' },
  { title: '文件系统', dataIndex: 'sysTypeName', key: 'sysTypeName' },
  { title: '总大小', dataIndex: 'total', key: 'total',
    customRender: ({ text }: { text: number }) => formatSize(text) },
  { title: '已用大小', dataIndex: 'used', key: 'used',
    customRender: ({ text }: { text: number }) => formatSize(text) },
  { title: '可用大小', dataIndex: 'free', key: 'free',
    customRender: ({ text }: { text: number }) => formatSize(text) },
  { title: '使用率', dataIndex: 'usage', key: 'usage' },
];

// 格式化文件大小
const formatSize = (size: number): string => {
  if (size === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return (size / Math.pow(1024, i)).toFixed(2) + ' ' + units[i];
};

// 初始化CPU使用率图表
const initCpuChart = () => {
  if (!cpuChartRef.value) return;

  cpuChart = echarts.init(cpuChartRef.value);
  const option = {
    series: [
      {
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false
        },
        progress: {
          show: true,
          width: 30
        },
        axisLine: {
          lineStyle: {
            width: 30
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        detail: {
          valueAnimation: true,
          fontSize: 30,
          offsetCenter: [0, '0%'],
          formatter: '{value}%',
          color: 'inherit'
        },
        data: [
          {
            value: serverInfo.value?.cpu.used || 0,
            name: 'CPU使用率',
            title: {
              offsetCenter: ['0%', '30%']
            },
            detail: {
              offsetCenter: ['0%', '0%']
            }
          }
        ]
      }
    ]
  };

  cpuChart.setOption(option);
};

// 初始化内存使用率图表
const initMemChart = () => {
  if (!memChartRef.value) return;

  memChart = echarts.init(memChartRef.value);
  const option = {
    series: [
      {
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false
        },
        progress: {
          show: true,
          width: 30
        },
        axisLine: {
          lineStyle: {
            width: 30
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        detail: {
          valueAnimation: true,
          fontSize: 30,
          offsetCenter: [0, '0%'],
          formatter: '{value}%',
          color: 'inherit'
        },
        data: [
          {
            value: serverInfo.value?.mem.usage || 0,
            name: '内存使用率',
            title: {
              offsetCenter: ['0%', '30%']
            },
            detail: {
              offsetCenter: ['0%', '0%']
            }
          }
        ]
      }
    ]
  };

  memChart.setOption(option);
};

// 获取服务器数据
const getServerData = async () => {
  try {
    const res = await getServerInfo();
    if (res.code === 200) {
      serverInfo.value = res.data;

      // 初始化图表
      setTimeout(() => {
        initCpuChart();
        initMemChart();
      }, 100);
    } else {
      message.error(res.msg || '获取服务器信息失败');
    }
  } catch (error) {
    message.error('获取服务器信息失败');
    console.error(error);
  }
};

onMounted(() => {
  getServerData();

  // 窗口大小变化时，重新调整图表大小
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  // 销毁图表
  cpuChart?.dispose();
  memChart?.dispose();
});

// 处理窗口大小变化
const handleResize = () => {
  cpuChart?.resize();
  memChart?.resize();
};
</script>

<style scoped>
.app-container {
  padding: 20px;
}
.refresh-btn {
  margin-bottom: 20px;
}
.chart-container {
  height: 200px;
  width: 100%;
}
</style>
