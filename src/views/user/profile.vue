<template>
  <div class="profile-container">
    <!-- 用户基本信息卡片 -->
    <el-card class="user-info-card">
      <div class="user-info-header">
        <div class="user-avatar">
          <el-avatar :size="80" :src="userInfo.avatar">
            <template #default v-if="!userInfo.avatar"><el-icon><User /></el-icon></template>
          </el-avatar>
          <div class="avatar-edit">
            <el-icon><Upload /></el-icon>
          </div>
        </div>
        <div class="user-details">
          <h2>{{ userInfo.name }}</h2>
          <div class="user-bio">{{ userInfo.bio }}</div>
          <div class="user-tags">
            <el-tag type="primary">{{ userInfo.role }}</el-tag>
            <el-tag type="success">{{ userInfo.department }}</el-tag>
            <el-tag v-if="userInfo.online" type="success">在线</el-tag>
          </div>
        </div>
        <div class="user-contact">
          <div class="contact-item">
            <el-icon><Message /></el-icon>
            <span>{{ userInfo.email }}</span>
          </div>
          <div class="contact-item">
            <el-icon><Phone /></el-icon>
            <span>{{ userInfo.phone }}</span>
          </div>
          <div class="contact-item">
            <el-icon><Location /></el-icon>
            <span>{{ userInfo.location }}</span>
          </div>
        </div>
      </div>
      <el-divider />
      <div class="action-buttons">
        <el-button type="primary" @click="goToSettings">
          <el-icon><Setting /></el-icon>
          修改资料
        </el-button>
        <el-button>
          <el-icon><ChatDotRound /></el-icon>
          发送消息
        </el-button>
      </div>
    </el-card>

    <!-- 用户统计数据 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card>
          <div class="statistic-item">
            <div class="statistic-title">项目数量</div>
            <div class="statistic-value">
              <count-to :start-val="0" :end-val="userStats.projects" :duration="2500" separator="," />
              <el-icon><Folder /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card>
          <div class="statistic-item">
            <div class="statistic-title">任务完成</div>
            <div class="statistic-value">
              <count-to :start-val="0" :end-val="userStats.tasksCompleted" :duration="2500" separator="," />
              <span>/ {{ userStats.totalTasks }}</span>
              <el-icon><Check /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card>
          <div class="statistic-item">
            <div class="statistic-title">团队贡献</div>
            <div class="statistic-value">
              <count-to :start-val="0" :end-val="userStats.contribution" :duration="2500" separator="," />%
              <el-icon><User /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card>
          <div class="statistic-item">
            <div class="statistic-title">积分</div>
            <div class="statistic-value">
              <count-to :start-val="0" :end-val="userStats.points" :duration="2500" separator="," />
              <el-icon><Medal /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 动态和快捷操作 -->
    <el-row :gutter="16" class="content-row">
      <el-col :span="16">
        <el-card title="近期动态" class="activity-card">
          <el-tabs v-model="activeTab">
            <el-tab-pane name="all" label="所有动态">
              <el-timeline>
                <el-timeline-item v-for="(activity, index) in activities" :key="index" :type="activity.color">
                  <el-icon v-if="activity.icon" class="timeline-icon"><component :is="activity.icon" /></el-icon>
                  <div class="activity-content">
                    <div class="activity-title">{{ activity.title }}</div>
                    <div class="activity-time">{{ activity.time }}</div>
                    <div class="activity-desc">{{ activity.description }}</div>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </el-tab-pane>
            <el-tab-pane name="project" label="项目动态">
              <el-empty v-if="!projectActivities.length" description="暂无项目动态" />
              <el-timeline v-else>
                <el-timeline-item v-for="(activity, index) in projectActivities" :key="index" :type="activity.color">
                  <div class="activity-content">
                    <div class="activity-title">{{ activity.title }}</div>
                    <div class="activity-time">{{ activity.time }}</div>
                    <div class="activity-desc">{{ activity.description }}</div>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </el-tab-pane>
            <el-tab-pane name="task" label="任务动态">
              <el-empty v-if="!taskActivities.length" description="暂无任务动态" />
              <el-timeline v-else>
                <el-timeline-item v-for="(activity, index) in taskActivities" :key="index" :type="activity.color">
                  <div class="activity-content">
                    <div class="activity-title">{{ activity.title }}</div>
                    <div class="activity-time">{{ activity.time }}</div>
                    <div class="activity-desc">{{ activity.description }}</div>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="quick-actions">
          <template #header>
            <div class="card-header">
              <span>快捷操作</span>
            </div>
          </template>
          <el-space direction="vertical" style="width: 100%">
            <el-button
              v-for="item in quickActions" 
              :key="item.title" 
              :type="item.type === 'primary' ? 'primary' : ''" 
              class="action-button" 
              @click="item.action"
              icon-position="left"
            >
              <el-icon><component :is="getIcon(item.icon)"/></el-icon>
              {{ item.title }}
            </el-button>
          </el-space>
        </el-card>

        <el-card class="skills-card">
          <template #header>
            <div class="card-header">
              <span>技能标签</span>
            </div>
          </template>
          <div class="skills-container">
            <el-tag v-for="skill in userSkills" :key="skill.name" :type="getTagType(skill.color)" class="skill-tag">
              <el-icon><component :is="getIcon(skill.icon)" /></el-icon>
              {{ skill.name }}
            </el-tag>
          </div>
        </el-card>

        <el-card class="work-summary">
          <template #header>
            <div class="card-header">
              <span>本周工作</span>
            </div>
          </template>
          <el-progress :percentage="workSummary.completed" status="success" />
          <div class="summary-text">
            已完成 {{ workSummary.completedTasks }} 个任务，剩余 {{ workSummary.remainingTasks }} 个任务
          </div>

          <el-table size="small" :data="workSummary.recentTasks" class="summary-list">
            <el-table-column prop="title" label="任务名称" />
            <el-table-column prop="dueDate" label="截止时间" width="180" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === '已完成' ? 'success' : 'primary'">{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  User, 
  Message, 
  Wallet, 
  Calendar,
  CaretTop,
  CaretBottom,
  Document,
  ChatDotRound,
  Setting,
  Bell,
  List,
  Phone,
  Medal,
  Check,
  Folder,
  Location,
  Upload
} from '@element-plus/icons-vue';
import CountTo from '@/components/CountTo/index.vue';

const router = useRouter();

// 用户基本信息
const userInfo = ref({
  name: '张三',
  avatar: '',
  bio: '资深前端开发工程师，热爱技术，专注于用户体验设计与前端架构',
  role: '开发工程师',
  department: '技术部',
  email: 'zhangsan@example.com',
  phone: '13800138000',
  location: '北京市朝阳区',
  online: true
});

// 用户统计数据
const userStats = ref({
  projects: 12,
  tasksCompleted: 34,
  totalTasks: 42,
  contribution: 89,
  points: 1250
});

// 动态标签页
const activeTab = ref('all');

// 所有动态
const activities = ref([
  {
    title: '完成了任务',
    description: '完成了"首页界面设计"任务',
    time: '今天 09:30',
    color: 'success',
    icon: 'Check'
  },
  {
    title: '创建了项目',
    description: '创建了新项目"电子商务平台优化"',
    time: '昨天 14:20',
    color: 'primary',
    icon: 'Folder'
  },
  {
    title: '评论了任务',
    description: '在"API接口开发"任务中发表了评论',
    time: '昨天 11:30',
    color: 'warning',
    icon: 'ChatDotRound'
  },
  {
    title: '上传了文档',
    description: '上传了"系统架构设计文档v2.0"',
    time: '2023-06-14 16:45',
    color: 'danger',
    icon: 'Document'
  }
]);

// 项目动态（筛选）
const projectActivities = computed(() => {
  return activities.value.filter(activity => 
    activity.title.includes('项目') || activity.description.includes('项目')
  );
});

// 任务动态（筛选）
const taskActivities = computed(() => {
  return activities.value.filter(activity => 
    activity.title.includes('任务') || activity.description.includes('任务')
  );
});

// 快捷操作
const quickActions = ref([
  {
    title: '创建任务',
    icon: 'Document',
    type: 'primary',
    action: () => console.log('创建任务')
  },
  {
    title: '发起项目',
    icon: 'Folder',
    type: 'default',
    action: () => console.log('发起项目')
  },
  {
    title: '编写周报',
    icon: 'Document',
    type: 'default',
    action: () => console.log('编写周报')
  },
  {
    title: '预约会议',
    icon: 'User',
    type: 'default',
    action: () => console.log('预约会议')
  }
]);

// 用户技能
const userSkills = ref([
  { name: 'Vue.js', color: 'green', icon: 'Document' },
  { name: 'React', color: 'blue', icon: 'Document' },
  { name: 'TypeScript', color: 'geekblue', icon: 'Document' },
  { name: 'Node.js', color: 'lime', icon: 'Document' },
  { name: 'MongoDB', color: 'green', icon: 'List' },
  { name: 'UI设计', color: 'purple', icon: 'Document' },
  { name: 'AWS', color: 'orange', icon: 'Document' }
]);

// 本周工作
const workSummary = ref({
  completed: 60,
  completedTasks: 6,
  remainingTasks: 4,
  recentTasks: [
    { title: '完成首页改版', status: '已完成', dueDate: '截止: 2023-06-15' },
    { title: '用户认证模块开发', status: '进行中', dueDate: '截止: 2023-06-18' },
    { title: '性能优化', status: '进行中', dueDate: '截止: 2023-06-20' }
  ]
});

// 跳转到设置页面
const goToSettings = () => {
  router.push('/user/settings');
};

// 转换图标名称
const getIcon = (iconName: string) => {
  const iconMap: Record<string, string> = {
    'BellOutlined': 'Bell',
    'UserOutlined': 'User',
    'FileTextOutlined': 'Document',
    'ToolOutlined': 'Tools',
    'MessageOutlined': 'ChatDotRound',
    'ProjectOutlined': 'Folder',
    'CheckCircleOutlined': 'Check',
    'TeamOutlined': 'User',
    'TrophyOutlined': 'Medal',
    'DatabaseOutlined': 'List',
    'AppstoreOutlined': 'Menu',
    'CloudOutlined': 'Cloudy'
  };
  return iconMap[iconName] || iconName;
};

// 转换标签颜色
const getTagType = (color: string) => {
  const colorMap: Record<string, string> = {
    'green': 'success',
    'blue': 'primary',
    'geekblue': 'info',
    'lime': 'success',
    'purple': 'danger',
    'orange': 'warning'
  };
  return colorMap[color] || '';
};
</script>

<style lang="less" scoped>
.profile-container {
  padding: 20px;
  
  .user-info-card {
    margin-bottom: 20px;
    
    .user-info-header {
      display: flex;
      align-items: flex-start;
      
      .user-avatar {
        position: relative;
        margin-right: 24px;
        
        .avatar-edit {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: var(--el-color-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 12px;
        }
      }
      
      .user-details {
        flex: 1;
        
        h2 {
          margin-bottom: 8px;
        }
        
        .user-bio {
          color: var(--el-text-color-secondary);
          margin-bottom: 12px;
        }
        
        .user-tags {
          margin-bottom: 8px;
          
          .el-tag {
            margin-right: 8px;
          }
        }
      }
      
      .user-contact {
        min-width: 200px;
        
        .contact-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          
          .el-icon {
            margin-right: 8px;
            color: var(--el-text-color-secondary);
          }
        }
      }
    }
    
    .action-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  }
  
  .stat-row {
    margin-bottom: 20px;
    
    .statistic-item {
      padding: 8px 0;
      
      .statistic-title {
        font-size: 14px;
        color: var(--el-text-color-secondary);
        margin-bottom: 8px;
      }
      
      .statistic-value {
        font-size: 24px;
        font-weight: bold;
        color: var(--el-text-color-primary);
        display: flex;
        align-items: center;
        
        .el-icon {
          margin-left: 8px;
          color: var(--el-color-primary);
        }
      }
    }
  }
  
  .content-row {
    .activity-card {
      margin-bottom: 20px;
      
      .activity-content {
        .activity-title {
          font-weight: 500;
        }
        
        .activity-time {
          font-size: 12px;
          color: var(--el-text-color-secondary);
          margin: 4px 0;
        }
        
        .activity-desc {
          color: var(--el-text-color-secondary);
        }
      }
      
      .timeline-icon {
        font-size: 18px;
      }
    }
    
    .quick-actions {
      margin-bottom: 20px;
      
      .action-button {
        width: 100%;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
    }
    
    .skills-card {
      margin-bottom: 20px;
      
      .skills-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        
        .skill-tag {
          margin-right: 0;
          display: flex;
          align-items: center;
          
          .el-icon {
            margin-right: 4px;
          }
        }
      }
    }
    
    .work-summary {
      .summary-text {
        margin: 12px 0;
        color: var(--el-text-color-secondary);
        font-size: 14px;
      }
      
      .summary-list {
        margin-top: 16px;
      }
    }
  }
  
  .card-header {
    font-weight: bold;
  }
}
</style> 