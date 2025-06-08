<template>
  <div class="profile-container">
    <!-- 用户基本信息卡片 -->
    <a-card class="user-info-card">
      <div class="user-info-header">
        <div class="user-avatar">
          <a-avatar :size="80" :src="userInfo.avatar">
            <template #icon v-if="!userInfo.avatar"><user-outlined /></template>
          </a-avatar>
          <div class="avatar-edit">
            <upload-outlined />
          </div>
        </div>
        <div class="user-details">
          <h2>{{ userInfo.name }}</h2>
          <div class="user-bio">{{ userInfo.bio }}</div>
          <div class="user-tags">
            <a-tag color="blue">{{ userInfo.role }}</a-tag>
            <a-tag color="green">{{ userInfo.department }}</a-tag>
            <a-tag v-if="userInfo.online" color="success">在线</a-tag>
          </div>
        </div>
        <div class="user-contact">
          <div class="contact-item">
            <mail-outlined />
            <span>{{ userInfo.email }}</span>
          </div>
          <div class="contact-item">
            <phone-outlined />
            <span>{{ userInfo.phone }}</span>
          </div>
          <div class="contact-item">
            <environment-outlined />
            <span>{{ userInfo.location }}</span>
          </div>
        </div>
      </div>
      <a-divider />
      <div class="action-buttons">
        <a-button type="primary" @click="goToSettings">
          <setting-outlined />
          修改资料
        </a-button>
        <a-button>
          <message-outlined />
          发送消息
        </a-button>
      </div>
    </a-card>

    <!-- 用户统计数据 -->
    <a-row :gutter="16" class="stat-row">
      <a-col :span="6">
        <a-card>
          <a-statistic title="项目数量" :value="userStats.projects" :precision="0">
            <template #prefix>
              <project-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic title="任务完成" :value="userStats.tasksCompleted" :precision="0">
            <template #prefix>
              <check-circle-outlined />
            </template>
            <template #suffix>
              <span>/ {{ userStats.totalTasks }}</span>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic title="团队贡献" :value="userStats.contribution" :precision="0" suffix="%">
            <template #prefix>
              <team-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic title="积分" :value="userStats.points" :precision="0">
            <template #prefix>
              <trophy-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- 动态和快捷操作 -->
    <a-row :gutter="16" class="content-row">
      <a-col :span="16">
        <a-card title="近期动态" class="activity-card">
          <a-tabs v-model:activeKey="activeTab">
            <a-tab-pane key="all" tab="所有动态">
              <a-timeline>
                <a-timeline-item v-for="(activity, index) in activities" :key="index" :color="activity.color">
                  <template #dot v-if="activity.icon">
                    <component :is="activity.icon" />
                  </template>
                  <div class="activity-content">
                    <div class="activity-title">{{ activity.title }}</div>
                    <div class="activity-time">{{ activity.time }}</div>
                    <div class="activity-desc">{{ activity.description }}</div>
                  </div>
                </a-timeline-item>
              </a-timeline>
            </a-tab-pane>
            <a-tab-pane key="project" tab="项目动态">
              <a-empty description="暂无项目动态" v-if="!projectActivities.length" />
              <a-timeline v-else>
                <a-timeline-item v-for="(activity, index) in projectActivities" :key="index" :color="activity.color">
                  <div class="activity-content">
                    <div class="activity-title">{{ activity.title }}</div>
                    <div class="activity-time">{{ activity.time }}</div>
                    <div class="activity-desc">{{ activity.description }}</div>
                  </div>
                </a-timeline-item>
              </a-timeline>
            </a-tab-pane>
            <a-tab-pane key="task" tab="任务动态">
              <a-empty description="暂无任务动态" v-if="!taskActivities.length" />
              <a-timeline v-else>
                <a-timeline-item v-for="(activity, index) in taskActivities" :key="index" :color="activity.color">
                  <div class="activity-content">
                    <div class="activity-title">{{ activity.title }}</div>
                    <div class="activity-time">{{ activity.time }}</div>
                    <div class="activity-desc">{{ activity.description }}</div>
                  </div>
                </a-timeline-item>
              </a-timeline>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="快捷操作" class="quick-actions">
          <a-list :data-source="quickActions">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-button :type="item.type" :icon="item.icon" class="action-button" @click="item.action">
                  {{ item.title }}
                </a-button>
              </a-list-item>
            </template>
          </a-list>
        </a-card>

        <a-card title="技能标签" class="skills-card">
          <div class="skills-container">
            <a-tag v-for="skill in userSkills" :key="skill.name" :color="skill.color" class="skill-tag">
              {{ skill.name }}
              <template #icon>
                <component :is="skill.icon" />
              </template>
            </a-tag>
          </div>
        </a-card>

        <a-card title="本周工作" class="work-summary">
          <a-progress :percent="workSummary.completed" status="active" />
          <div class="summary-text">
            已完成 {{ workSummary.completedTasks }} 个任务，剩余 {{ workSummary.remainingTasks }} 个任务
          </div>

          <a-list size="small" class="summary-list">
            <a-list-item v-for="(task, index) in workSummary.recentTasks" :key="index">
              <template #actions>
                <a-tag :color="task.status === '已完成' ? 'success' : 'processing'">{{ task.status }}</a-tag>
              </template>
              <a-list-item-meta :title="task.title" :description="task.dueDate" />
            </a-list-item>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined,
  SettingOutlined,
  MessageOutlined,
  ProjectOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  TrophyOutlined,
  FileTextOutlined,
  UploadOutlined,
  CodeOutlined,
  DatabaseOutlined,
  AppstoreOutlined,
  CloudOutlined
} from '@ant-design/icons-vue';

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
    color: 'green',
    icon: 'CheckCircleOutlined'
  },
  {
    title: '创建了项目',
    description: '创建了新项目"电子商务平台优化"',
    time: '昨天 14:20',
    color: 'blue',
    icon: 'ProjectOutlined'
  },
  {
    title: '评论了任务',
    description: '在"API接口开发"任务中发表了评论',
    time: '昨天 11:30',
    color: 'orange',
    icon: 'MessageOutlined'
  },
  {
    title: '上传了文档',
    description: '上传了"系统架构设计文档v2.0"',
    time: '2023-06-14 16:45',
    color: 'purple',
    icon: 'FileTextOutlined'
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
    icon: 'FileTextOutlined',
    type: 'primary',
    action: () => console.log('创建任务')
  },
  {
    title: '发起项目',
    icon: 'ProjectOutlined',
    type: 'default',
    action: () => console.log('发起项目')
  },
  {
    title: '编写周报',
    icon: 'FileTextOutlined',
    type: 'default',
    action: () => console.log('编写周报')
  },
  {
    title: '预约会议',
    icon: 'TeamOutlined',
    type: 'default',
    action: () => console.log('预约会议')
  }
]);

// 用户技能
const userSkills = ref([
  { name: 'Vue.js', color: 'green', icon: 'CodeOutlined' },
  { name: 'React', color: 'blue', icon: 'CodeOutlined' },
  { name: 'TypeScript', color: 'geekblue', icon: 'CodeOutlined' },
  { name: 'Node.js', color: 'lime', icon: 'CodeOutlined' },
  { name: 'MongoDB', color: 'green', icon: 'DatabaseOutlined' },
  { name: 'UI设计', color: 'purple', icon: 'AppstoreOutlined' },
  { name: 'AWS', color: 'orange', icon: 'CloudOutlined' }
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
          background-color: #1890ff;
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
          color: rgba(0, 0, 0, 0.65);
          margin-bottom: 12px;
        }
        
        .user-tags {
          margin-bottom: 8px;
        }
      }
      
      .user-contact {
        min-width: 200px;
        
        .contact-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          
          .anticon {
            margin-right: 8px;
            color: rgba(0, 0, 0, 0.45);
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
          color: rgba(0, 0, 0, 0.45);
          margin: 4px 0;
        }
        
        .activity-desc {
          color: rgba(0, 0, 0, 0.65);
        }
      }
    }
    
    .quick-actions {
      margin-bottom: 20px;
      
      .action-button {
        width: 100%;
        text-align: left;
        margin-bottom: 8px;
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
        }
      }
    }
    
    .work-summary {
      .summary-text {
        margin: 12px 0;
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
      }
      
      .summary-list {
        margin-top: 16px;
      }
    }
  }
}
</style> 