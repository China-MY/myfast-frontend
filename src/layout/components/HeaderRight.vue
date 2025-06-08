<template>
  <div class="header-right-container">
    <!-- 搜索 - 在移动端隐藏 -->
    <div class="action-item search-input-wrapper" v-if="!isMobile">
      <a-input-search
        placeholder="站内搜索"
        style="width: 200px"
        size="small"
        @search="onSearch"
      />
    </div>

    <!-- 布局设置 - 在移动端隐藏 -->
    <div class="action-item" v-if="!isMobile" @click="openSettingDrawer">
      <skin-outlined class="action-icon" />
    </div>

    <!-- 文档 - 在移动端隐藏 -->
    <div class="action-item" v-if="!isMobile">
      <a-tooltip title="系统文档">
        <question-circle-outlined class="action-icon" />
      </a-tooltip>
    </div>

    <!-- 全屏切换 - 在移动端隐藏 -->
    <div class="action-item" v-if="!isMobile">
      <a-tooltip :title="isFullscreen ? '退出全屏' : '全屏显示'">
        <component :is="isFullscreen ? 'FullscreenExitOutlined' : 'FullscreenOutlined'" class="action-icon" @click="toggleFullScreen" />
      </a-tooltip>
    </div>

    <!-- 通知中心 -->
    <div class="action-item">
      <a-popover
        placement="bottomRight"
        trigger="click"
        :overlayStyle="isMobile ? { width: '250px' } : { width: '300px' }"
      >
        <template #content>
          <a-tabs>
            <a-tab-pane key="notice" tab="通知">
              <a-list size="small" :data-source="notices" :pagination="false">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta :title="item.title" :description="isMobile ? null : item.time">
                      <template #avatar>
                        <a-avatar :style="{ backgroundColor: item.color }">
                          <template #icon><notification-outlined /></template>
                        </a-avatar>
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </template>
                <template #footer>
                  <div style="text-align: center">
                    <a-button type="text">全部已读</a-button>
                    <a-button type="text">查看更多</a-button>
                  </div>
                </template>
              </a-list>
            </a-tab-pane>
            <a-tab-pane key="message" tab="消息">
              <a-list size="small" :data-source="messages" :pagination="false">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta :title="item.title" :description="isMobile ? null : item.time">
                      <template #avatar>
                        <a-avatar :style="{ backgroundColor: item.color }">
                          <template #icon><message-outlined /></template>
                        </a-avatar>
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </template>
                <template #footer>
                  <div style="text-align: center">
                    <a-button type="text">全部已读</a-button>
                    <a-button type="text">查看更多</a-button>
                  </div>
                </template>
              </a-list>
            </a-tab-pane>
          </a-tabs>
        </template>
        <a-badge :count="noticeTotal">
          <bell-outlined class="action-icon" />
        </a-badge>
      </a-popover>
    </div>

    <!-- 用户头像和下拉菜单 -->
    <a-dropdown :overlay-style="isMobile ? { width: '120px' } : {}">
      <div class="user-info">
        <a-avatar :src="userAvatar" :size="isMobile ? 28 : 32" />
        <span class="username" v-if="!isMobile">{{ userNickname }}</span>
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item key="profile" @click="goToProfile">
            <user-outlined />
            <span>个人中心</span>
          </a-menu-item>
          <a-menu-item key="settings" @click="goToSettings">
            <setting-outlined />
            <span>个人设置</span>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="logout" @click="handleLogout">
            <logout-outlined />
            <span>退出登录</span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>

    <!-- 主题设置抽屉 -->
    <a-drawer
      title="主题设置"
      placement="right"
      :open="settingDrawerVisible"
      :width="isMobile ? 250 : 300"
      @close="settingDrawerVisible = false"
    >
      <div class="setting-drawer-block-checbox">
        <div class="setting-drawer-block-checbox-item" @click="handleThemeChange('dark')">
          <img src="https://gw.alipayobjects.com/zos/antfincdn/XwFOFbLkSM/LCkqqYNmvBEbokSDscrm.svg" alt="暗色主题">
          <div class="setting-drawer-block-checbox-selectIcon" v-if="theme === 'dark'">
            <check-outlined />
          </div>
        </div>
        <div class="setting-drawer-block-checbox-item" @click="handleThemeChange('light')">
          <img src="https://gw.alipayobjects.com/zos/antfincdn/NQ%24zoisaD2/jpRkZQMyYRryryPNtyIC.svg" alt="亮色主题">
          <div class="setting-drawer-block-checbox-selectIcon" v-if="theme === 'light'">
            <check-outlined />
          </div>
        </div>
      </div>
      <a-divider />

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
            <check-outlined v-if="primaryColor === color" />
          </div>
        </div>
      </div>
      <a-divider />

      <div class="other-setting">
        <h3>其他设置</h3>
        <div>
          <a-switch :checked="fixedHeader" @change="setFixedHeader" />
          <span style="margin-left: 8px">固定头部</span>
        </div>
        <div style="margin-top: 16px">
          <a-switch :checked="sideMenuCollapsed" @change="setSideMenuCollapsed" />
          <span style="margin-left: 8px">折叠菜单</span>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { Modal } from 'ant-design-vue';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  QuestionCircleOutlined,
  SkinOutlined,
  NotificationOutlined,
  MessageOutlined,
  CheckOutlined,
} from '@ant-design/icons-vue';
import { useUserStore } from '@/stores/modules/user';
import { logoutApiV1AuthLogoutPost } from '@/api/renzheng';

const router = useRouter();
const userStore = useUserStore();

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
const onSearch = (value: string) => {
  console.log('搜索:', value);
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
};

const handlePrimaryColorChange = (color: string) => {
  primaryColor.value = color;
  // 实际应用中，这里应该修改主题色
};

const setFixedHeader = (checked: boolean) => {
  fixedHeader.value = checked;
  // 实际应用中，这里应该修改布局
};

const setSideMenuCollapsed = (checked: boolean) => {
  sideMenuCollapsed.value = checked;
  // 实际应用中，这里应该触发菜单折叠
};

// 退出登录
const handleLogout = () => {
  Modal.confirm({
    title: '提示',
    content: '确定要退出登录吗？',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        // 调用登出API
        await logoutApiV1AuthLogoutPost();
        // 重置用户状态
        await userStore.logout();
        // 跳转到登录页
        router.push('/login');
      } catch (error) {
        console.error('登出失败:', error);
      }
    }
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
    height: 100%;
    padding: 0 12px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.025);
    }

    .action-icon {
      font-size: 16px;
    }
  }

  .search-input-wrapper {
    padding: 0 12px;
  }

  .user-info {
    height: 100%;
    padding: 0 12px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.025);
    }

    .username {
      margin-left: 8px;
      font-size: 14px;
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

    img {
      width: 100%;
      height: 100%;
    }

    &-selectIcon {
      position: absolute;
      right: 8px;
        top: 8px;
      color: #1890ff;
    }
  }
}

.theme-color-block {
    margin-bottom: 24px;

  h3 {
    margin-bottom: 12px;
  }

  &-item {
    width: 20px;
    height: 20px;
      border-radius: 2px;
    margin-right: 8px;
    cursor: pointer;
      display: inline-flex;
    align-items: center;
    justify-content: center;
      color: #fff;
    }
    
    .theme-color-content {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
  }
}

.other-setting {
  h3 {
    margin-bottom: 12px;
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
      padding: 0 8px;
    }
  }
}
</style>
