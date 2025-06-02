<template>
  <div class="dashboard">
    <!-- 顶部欢迎和用户信息 -->
    <a-row :gutter="16">
      <a-col :span="24">
        <a-card :bordered="false" class="welcome-card">
          <div class="welcome-header">
            <div class="welcome-left">
              <h2>欢迎使用 MyFast-Admin 后台管理系统</h2>
              <p>{{ welcomeMessage }}</p>
            </div>
            <div class="welcome-right">
              <a-tag color="blue">当前版本: v1.0.0</a-tag>
              <a-tooltip title="文档">
                <a-button type="link" icon="FilePdfOutlined">使用文档</a-button>
              </a-tooltip>
              <a-tooltip title="源码">
                <a-button type="link" icon="GithubOutlined">官方源码</a-button>
              </a-tooltip>
            </div>
          </div>
          <a-divider />
          <div class="platform-intro">
            <h3>平台简介</h3>
            <p>MyFast-Admin 是一个基于 FastAPI 和 Vue3 的前后端分离的企业级中后台管理系统，采用 Python + Vue3 + Ant Design Vue 的前后端分离架构，是开发者快速开发的最佳实践方案。系统提供了完善的权限管理、数据字典、参数配置等基础功能，集成代码生成器，大幅度提高开发效率。</p>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" style="margin-top: 16px">
      <!-- 统计数据卡片 -->
      <a-col :xs="24" :sm="12" :md="6" v-for="(stat, index) in statistics" :key="index">
        <a-card :bordered="false" class="stat-card">
          <div class="stat-content">
            <component :is="stat.icon" class="stat-icon" :style="{ color: stat.color }" />
            <div class="stat-info">
              <div class="stat-title">{{ stat.title }}</div>
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-footer">{{ stat.footer }}</div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 功能模块导航 -->
    <a-row :gutter="16" style="margin-top: 16px">
      <a-col :span="24">
        <a-card :bordered="false" title="功能模块导航">
          <div class="module-nav">
            <div class="module-section">
              <h3>系统管理</h3>
              <div class="module-cards">
                <div class="module-card" v-for="(item, index) in systemModules" :key="index" @click="handleModuleClick(item)">
                  <component :is="item.icon" class="module-icon" :style="{ color: item.color }" />
                  <span>{{ item.title }}</span>
                </div>
              </div>
            </div>

            <div class="module-section">
              <h3>系统监控</h3>
              <div class="module-cards">
                <div class="module-card" v-for="(item, index) in monitorModules" :key="index" @click="handleModuleClick(item)">
                  <component :is="item.icon" class="module-icon" :style="{ color: item.color }" />
                  <span>{{ item.title }}</span>
                </div>
              </div>
            </div>

            <div class="module-section">
              <h3>系统工具</h3>
              <div class="module-cards">
                <div class="module-card" v-for="(item, index) in toolModules" :key="index" @click="handleModuleClick(item)">
                  <component :is="item.icon" class="module-icon" :style="{ color: item.color }" />
                  <span>{{ item.title }}</span>
                </div>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" style="margin-top: 16px">
      <!-- 图表卡片 -->
      <a-col :span="12">
        <a-card :bordered="false" title="访问量趋势">
          <div class="chart" ref="visitChart"></div>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card :bordered="false" title="系统负载">
          <div class="chart" ref="loadChart"></div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" style="margin-top: 16px">
      <!-- 任务列表 -->
      <a-col :span="12">
        <a-card :bordered="false" title="待处理任务">
          <a-list :data-source="todoTasks" :pagination="false">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta
                  :title="item.title"
                  :description="item.description"
                />
                <template #extra>
                  <a-tag :color="item.status === '紧急' ? 'red' : 'blue'">{{ item.status }}</a-tag>
                </template>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>

      <!-- 通知列表 -->
      <a-col :span="12">
        <a-card :bordered="false" title="系统通知">
          <a-list :data-source="notifications" :pagination="false">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta
                  :title="item.title"
                  :description="item.time"
                />
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/modules/user';
import * as echarts from 'echarts';
import {
  UserOutlined,
  TeamOutlined,
  AppstoreOutlined,
  SafetyCertificateOutlined,
  FileOutlined,
  BellOutlined,
  DatabaseOutlined,
  DesktopOutlined,
  MonitorOutlined,
  CloudServerOutlined,
  ApiOutlined,
  CodeOutlined,
  FormOutlined,
  SettingOutlined,
  KeyOutlined,
  BookOutlined,
  ClockCircleOutlined,
  ApartmentOutlined,
  IdcardOutlined,
  FontSizeOutlined,
  ToolOutlined
} from '@ant-design/icons-vue';

const router = useRouter();
const userStore = useUserStore();
const visitChart = ref<HTMLElement | null>(null);
const loadChart = ref<HTMLElement | null>(null);

// 欢迎消息
const welcomeMessage = computed(() => {
  const date = new Date();
  const hours = date.getHours();
  const username = userStore.nickname || userStore.username;

  let greeting = '';
  if (hours < 6) {
    greeting = '凌晨好';
  } else if (hours < 9) {
    greeting = '早上好';
  } else if (hours < 12) {
    greeting = '上午好';
  } else if (hours < 14) {
    greeting = '中午好';
  } else if (hours < 17) {
    greeting = '下午好';
  } else if (hours < 19) {
    greeting = '傍晚好';
  } else {
    greeting = '晚上好';
  }

  return `${greeting}，${username}，欢迎使用 MyFast-Admin 企业级中后台管理系统`;
});

// 统计数据
const statistics = reactive([
  {
    title: '用户总数',
    value: '1,286',
    footer: '较昨日 +12',
    icon: UserOutlined,
    color: '#1890ff'
  },
  {
    title: '在线用户',
    value: '128',
    footer: '当前在线用户数',
    icon: DesktopOutlined,
    color: '#52c41a'
  },
  {
    title: '系统消息',
    value: '56',
    footer: '未读消息 8 条',
    icon: BellOutlined,
    color: '#faad14'
  },
  {
    title: '服务器负载',
    value: '32%',
    footer: '服务器运行正常',
    icon: DatabaseOutlined,
    color: '#722ed1'
  }
]);

// 系统管理模块
const systemModules = reactive([
  {
    title: '用户管理',
    icon: UserOutlined,
    path: '/system/user',
    color: '#1890ff'
  },
  {
    title: '角色管理',
    icon: SafetyCertificateOutlined,
    path: '/system/role',
    color: '#13c2c2'
  },
  {
    title: '菜单管理',
    icon: AppstoreOutlined,
    path: '/system/menu',
    color: '#52c41a'
  },
  {
    title: '部门管理',
    icon: TeamOutlined,
    path: '/system/dept',
    color: '#722ed1'
  },
  {
    title: '岗位管理',
    icon: IdcardOutlined,
    path: '/system/post',
    color: '#eb2f96'
  },
  {
    title: '字典管理',
    icon: FontSizeOutlined,
    path: '/system/dict',
    color: '#fa8c16'
  },
  {
    title: '参数设置',
    icon: SettingOutlined,
    path: '/system/config',
    color: '#fa541c'
  }
]);

// 系统监控模块
const monitorModules = reactive([
  {
    title: '在线用户',
    icon: DesktopOutlined,
    path: '/monitor/online',
    color: '#1890ff'
  },
  {
    title: '定时任务',
    icon: ClockCircleOutlined,
    path: '/monitor/job',
    color: '#13c2c2'
  },
  {
    title: '数据监控',
    icon: DatabaseOutlined,
    path: '/monitor/data',
    color: '#52c41a'
  },
  {
    title: '服务监控',
    icon: CloudServerOutlined,
    path: '/monitor/server',
    color: '#722ed1'
  },
  {
    title: '缓存监控',
    icon: MonitorOutlined,
    path: '/monitor/cache',
    color: '#eb2f96'
  },
  {
    title: '缓存列表',
    icon: BellOutlined,
    path: '/monitor/cache-list',
    color: '#fa8c16'
  }
]);

// 系统工具模块
const toolModules = reactive([
  {
    title: '代码生成',
    icon: CodeOutlined,
    path: '/tool/gen',
    color: '#1890ff'
  },
  {
    title: '系统接口',
    icon: ApiOutlined,
    path: '/tool/swagger',
    color: '#13c2c2'
  },
  {
    title: '表单构建',
    icon: FormOutlined,
    path: '/tool/form',
    color: '#52c41a'
  }
]);

// 待处理任务
const todoTasks = reactive([
  {
    title: '系统升级计划',
    description: '升级系统核心组件',
    status: '紧急'
  },
  {
    title: '安全漏洞修复',
    description: '修复最新发现的安全漏洞',
    status: '紧急'
  },
  {
    title: '用户体验优化',
    description: '优化系统操作流程',
    status: '普通'
  },
  {
    title: '数据备份',
    description: '执行周期性数据备份',
    status: '普通'
  }
]);

// 系统通知
const notifications = reactive([
  {
    title: '系统将于今晚 23:00 进行例行维护',
    time: '10 分钟前'
  },
  {
    title: '已成功修复用户模块的登录问题',
    time: '1 小时前'
  },
  {
    title: '新增部门管理功能已上线',
    time: '2 小时前'
  },
  {
    title: '系统安全策略已更新',
    time: '1 天前'
  }
]);

// 处理模块点击
const handleModuleClick = (item: any) => {
  router.push(item.path);
};

// 初始化图表
onMounted(() => {
  if (visitChart.value) {
    const chart = echarts.init(visitChart.value);
    chart.setOption({
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
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '访问量',
          type: 'line',
          smooth: true,
          areaStyle: {
            opacity: 0.3
          },
          emphasis: {
            focus: 'series'
          },
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          itemStyle: {
            color: '#1890ff'
          }
        }
      ]
    });

    window.addEventListener('resize', () => {
      chart.resize();
    });
  }

  if (loadChart.value) {
    const chart = echarts.init(loadChart.value);
    chart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '系统负载',
          type: 'bar',
          data: [10, 15, 35, 45, 40, 35, 25],
          itemStyle: {
            color: '#1890ff'
          }
        }
      ]
    });

    window.addEventListener('resize', () => {
      chart.resize();
    });
  }
});
</script>

<style lang="less" scoped>
.dashboard {
  .welcome-card {
    margin-bottom: 16px;

    .welcome-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .welcome-left {
        h2 {
          font-size: 20px;
          margin-bottom: 8px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.85);
        }

        p {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
        }
      }

      .welcome-right {
        display: flex;
        align-items: center;
        gap: 16px;
      }
    }

    .platform-intro {
      h3 {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 8px;
        color: rgba(0, 0, 0, 0.85);
      }

      p {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
        line-height: 1.6;
      }
    }
  }

  .stat-card {
    .stat-content {
      display: flex;
      align-items: center;

      .stat-icon {
        font-size: 48px;
        margin-right: 16px;
      }

      .stat-info {
        flex: 1;

        .stat-title {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
        }

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          margin: 4px 0;
        }

        .stat-footer {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.45);
        }
      }
    }
  }

  .module-nav {
    .module-section {
      margin-bottom: 24px;

      h3 {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 16px;
        color: rgba(0, 0, 0, 0.85);
      }

      .module-cards {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;

        .module-card {
          width: 120px;
          height: 100px;
          border-radius: 8px;
          background-color: #f9f9f9;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            background-color: #f0f0f0;
            transform: translateY(-2px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .module-icon {
            font-size: 28px;
            margin-bottom: 8px;
          }

          span {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.65);
          }
        }
      }
    }
  }

  .chart {
    height: 300px;
  }
}
</style>
