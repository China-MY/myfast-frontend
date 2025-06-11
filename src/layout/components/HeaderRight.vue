<template>
  <div class="header-right-container">
    <!-- 搜索 - 在移动端隐藏 -->
    <div class="action-item search-input-wrapper" v-if="!isMobile">
      <el-input
        placeholder="站内搜索"
        style="width: 200px"
        size="small"
        v-model="searchText"
        @keyup.enter="onSearch"
      >
        <template #suffix>
          <el-icon class="cursor-pointer" @click="onSearch">
            <Search />
          </el-icon>
        </template>
      </el-input>
    </div>

    <!-- 布局设置 - 在移动端隐藏 -->
    <!-- <div class="action-item" v-if="!isMobile" @click="openSettingDrawer">
      <el-icon class="action-icon"><Setting /></el-icon>
    </div> -->

    <!-- 文档 - 在移动端隐藏 -->
    <!-- <div class="action-item" v-if="!isMobile">
      <el-tooltip content="系统文档">
        <el-icon class="action-icon"><QuestionFilled /></el-icon>
      </el-tooltip>
    </div> -->

    <!-- 全屏切换 - 在移动端隐藏 -->
    <div class="action-item" v-if="!isMobile">
      <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏显示'">
        <el-icon class="action-icon" @click="toggleFullScreen">
          <component :is="isFullscreen ? 'FullScreen' : 'FullScreen'" />
        </el-icon>
      </el-tooltip>
    </div>

    <!-- 通知中心 -->
    <!-- <div class="action-item">
      <el-popover
        placement="bottom-end"
        trigger="click"
        :width="isMobile ? 250 : 300"
      >
        <template #reference>
          <el-badge :value="noticeTotal" :max="99">
            <el-icon class="action-icon"><Bell /></el-icon>
          </el-badge>
        </template>
        <el-tabs>
          <el-tab-pane label="通知" name="notice">
            <el-scrollbar height="300px">
              <el-list>
                <el-list-item v-for="item in notices" :key="item.id">
                  <template #prefix>
                    <el-avatar :size="32" :style="{ backgroundColor: item.color }">
                      <el-icon><Notification /></el-icon>
                    </el-avatar>
                  </template>
                  <div class="notification-content">
                    <div class="notification-title">{{ item.title }}</div>
                    <div class="notification-time" v-if="!isMobile">{{ item.time }}</div>
                  </div>
                </el-list-item>
                <div style="text-align: center; padding: 10px 0;">
                  <el-button text @click="markAllRead">全部已读</el-button>
                  <el-button text @click="viewMoreNotices">查看更多</el-button>
                </div>
              </el-list>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="消息" name="message">
            <el-scrollbar height="300px">
              <el-list>
                <el-list-item v-for="item in messages" :key="item.id">
                  <template #prefix>
                    <el-avatar :size="32" :style="{ backgroundColor: item.color }">
                      <el-icon><ChatLineRound /></el-icon>
                    </el-avatar>
                  </template>
                  <div class="notification-content">
                    <div class="notification-title">{{ item.title }}</div>
                    <div class="notification-time" v-if="!isMobile">{{ item.time }}</div>
                  </div>
                </el-list-item>
                <div style="text-align: center; padding: 10px 0;">
                  <el-button text @click="markAllRead">全部已读</el-button>
                  <el-button text @click="viewMoreMessages">查看更多</el-button>
                </div>
              </el-list>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </el-popover>
    </div> -->

    <!-- 用户头像和下拉菜单 -->
    <el-dropdown trigger="click">
      <div class="user-info">
        <el-avatar :src="userAvatar" :size="isMobile ? 28 : 32" />
        <span class="username" v-if="!isMobile">{{ userNickname }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu :style="isMobile ? { width: '120px' } : {}">
          <el-dropdown-item @click="goToProfile">
            <el-icon><User /></el-icon>
            <span>个人中心</span>
          </el-dropdown-item>
          <el-dropdown-item @click="goToSettings">
            <el-icon><Setting /></el-icon>
            <span>个人设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 主题设置抽屉 -->
    <el-drawer
      title="主题设置"
      v-model="settingDrawerVisible"
      :size="isMobile ? '80%' : '300px'"
      direction="rtl"
    >
      <div class="setting-drawer-block-checbox">
        <div class="setting-drawer-block-checbox-item" @click="handleThemeChange('dark')">
          <img src="https://gw.alipayobjects.com/zos/antfincdn/XwFOFbLkSM/LCkqqYNmvBEbokSDscrm.svg" alt="暗色主题">
          <div class="setting-drawer-block-checbox-selectIcon" v-if="theme === 'dark'">
            <el-icon><Check /></el-icon>
          </div>
        </div>
        <div class="setting-drawer-block-checbox-item" @click="handleThemeChange('light')">
          <img src="https://gw.alipayobjects.com/zos/antfincdn/NQ%24zoisaD2/jpRkZQMyYRryryPNtyIC.svg" alt="亮色主题">
          <div class="setting-drawer-block-checbox-selectIcon" v-if="theme === 'light'">
            <el-icon><Check /></el-icon>
          </div>
        </div>
      </div>
      <el-divider />

      <div class="theme-color-block">
        <h3>主题色</h3>
        <div class="theme-color-content">
          <div
            v-for="(color, index) in themeColors"
            :key="index"
            class="theme-color-block-item"
            :style="{ backgroundColor: color }"
            @click="handlePrimaryColorChange(color)"
          >
            <el-icon v-if="primaryColor === color"><Check /></el-icon>
          </div>
        </div>
      </div>
      <el-divider />

      <div class="other-setting">
        <h3>其他设置</h3>
        <div>
          <el-switch v-model="fixedHeader" />
          <span style="margin-left: 8px">固定头部</span>
        </div>
        <div style="margin-top: 16px">
          <el-switch v-model="sideMenuCollapsed" />
          <span style="margin-left: 8px">折叠菜单</span>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  User,
  Setting,
  SwitchButton,
  Bell,
  FullScreen,
  QuestionFilled,
  Notification,
  ChatLineRound,
  Check,
  Search
} from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/modules/user';
import { logoutApiV1AuthPost } from '@/api/renzheng';

const router = useRouter();
const userStore = useUserStore();
const searchText = ref('');

// 检测是否为移动设备
const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

// 用户信息
const userNickname = computed(() => {
  return userStore.userInfo?.nickname || userStore.userInfo?.username || '用户';
});

const userAvatar = computed(() => {
  return userStore.userInfo?.avatar || defaultAvatar;
});

// 默认头像
const defaultAvatar = 'https://joeschmoe.io/api/v1/random';

// 全屏状态
const isFullscreen = ref(false);

// 通知数据
const notices = ref([
  { id: 1, title: '系统将于今晚23:00进行升级维护', time: '10分钟前', color: '#1890ff' },
  { id: 2, title: '您的密码将在7天后过期', time: '1小时前', color: '#faad14' },
  { id: 3, title: '您有3个待审批的工单', time: '1天前', color: '#52c41a' }
]);

const messages = ref([
  { id: 1, title: '张三给您发送了一条消息', time: '刚刚', color: '#1890ff' },
  { id: 2, title: '李四邀请您参加会议', time: '30分钟前', color: '#722ed1' },
  { id: 3, title: '系统管理员向您推送了最新通知', time: '2小时前', color: '#eb2f96' }
]);

const noticeTotal = computed(() => notices.value.length + messages.value.length);

// 搜索
const onSearch = () => {
  console.log('搜索:', searchText.value);
  ElMessage.info(`搜索: ${searchText.value}`);
  searchText.value = '';
};

// 消息操作
const markAllRead = () => {
  ElMessage.success('已全部标为已读');
};

const viewMoreNotices = () => {
  router.push('/notice/list');
};

const viewMoreMessages = () => {
  router.push('/message/list');
};

// 切换全屏
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.error(`无法进入全屏模式: ${err.message}`);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};

// 监听全屏状态变化
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

// 监听窗口大小变化
const handleResize = () => {
  checkMobile();
};

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  window.addEventListener('resize', handleResize);
  checkMobile();
});

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  window.removeEventListener('resize', handleResize);
});

// 主题设置抽屉
const settingDrawerVisible = ref(false);
const openSettingDrawer = () => {
  settingDrawerVisible.value = true;
};

// 主题设置
const theme = ref('light');
const primaryColor = ref('#1890ff');
const fixedHeader = ref(true);
const sideMenuCollapsed = ref(false);

// 主题色选项
const themeColors = [
  '#1890ff', // 蓝色
  '#722ed1', // 紫色
  '#13c2c2', // 青色
  '#52c41a', // 绿色
  '#eb2f96', // 粉色
  '#faad14', // 黄色
  '#f5222d'  // 红色
];

const handleThemeChange = (themeType: string) => {
  theme.value = themeType;
  // 实际应用中，这里应该修改全局样式
  ElMessage.success(`已切换至${themeType === 'dark' ? '深色' : '浅色'}主题`);
};

const handlePrimaryColorChange = (color: string) => {
  primaryColor.value = color;
  // 实际应用中，这里应该修改主题色
  ElMessage.success(`已切换主题色为 ${color}`);
};

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // 调用登出API
      await logoutApiV1AuthPost();
      // 重置用户状态
      await userStore.logout();
      // 跳转到登录页
      router.push('/login');
    } catch (error) {
      console.error('登出失败:', error);
    }
  }).catch(() => {
    // 取消操作
  });
};

// 跳转到个人中心
const goToProfile = () => {
  router.push('/user/profile');
};

// 跳转到个人设置
const goToSettings = () => {
  router.push('/user/settings');
};
</script>

<style lang="less" scoped>
.header-right-container {
  display: flex;
  align-items: center;
  height: 100%;

  .action-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 12px;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;

    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .action-icon {
      font-size: 18px;
      color: rgba(0, 0, 0, 0.75);
    }
  }

  .search-input-wrapper {
    padding: 0 16px;
    
    :deep(.el-input__inner) {
      border-radius: 40px;
      transition: all 0.3s;
      
      &:focus {
        width: 220px;
        box-shadow: 0 0 0 2px var(--el-color-primary-light-8);
      }
    }
    
    :deep(.el-input__suffix) {
      cursor: pointer;
    }
  }

  .user-info {
    height: 100%;
    padding: 0 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .username {
      margin-left: 10px;
      font-size: 14px;
      font-weight: 500;
    }
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .notification-content {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    width: 100%;
    overflow: hidden;

    .notification-title {
      font-size: 14px;
      color: var(--el-text-color-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .notification-time {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      margin-top: 4px;
    }
  }
  
  :deep(.el-badge__content) {
    box-shadow: 0 0 0 1px #fff;
  }
  
  :deep(.el-list-item) {
    padding: 10px 0;
    
    &:hover {
      background-color: var(--el-fill-color-light);
    }
  }

  .setting-drawer-block-checbox {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;

    &-item {
      position: relative;
      width: 44%;
      height: 64px;
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
      border: 1px solid #f0f0f0;
      transition: all 0.3s;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
      }

      img {
        width: 100%;
        height: 100%;
      }

      &-selectIcon {
        position: absolute;
        right: 8px;
        top: 8px;
        color: var(--el-color-primary);
      }
    }
  }

  .theme-color-block {
    margin-bottom: 24px;

    h3 {
      margin-bottom: 12px;
      font-size: 15px;
      font-weight: 500;
    }

    &-item {
      width: 24px;
      height: 24px;
      border-radius: 2px;
      margin-right: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      transition: all 0.3s;
      
      &:hover {
        transform: scale(1.1);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }
    }

    .theme-color-content {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 12px;
    }
  }

  .other-setting {
    h3 {
      margin-bottom: 16px;
      font-size: 15px;
      font-weight: 500;
    }
    
    .setting-item {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      
      .setting-label {
        margin-left: 10px;
        font-size: 14px;
      }
    }
  }
}

/* 暗色主题适配 */
:deep(.layout-dark) {
  .header-right-container {
    .action-item {
      &:hover {
        background-color: rgba(255, 255, 255, 0.05);
      }
      
      .action-icon {
        color: rgba(255, 255, 255, 0.85);
      }
    }
    
    .user-info {
      &:hover {
        background-color: rgba(255, 255, 255, 0.05);
      }
      
      .username {
        color: rgba(255, 255, 255, 0.85);
      }
    }
    
    .setting-drawer-block-checbox-item {
      border-color: #303030;
    }
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .header-right-container {
    .action-item {
      padding: 0 8px;
    }

    .user-info {
      padding: 0 10px;
    }
    
    .search-input-wrapper {
      padding: 0 10px;
    }
  }
}
</style>
