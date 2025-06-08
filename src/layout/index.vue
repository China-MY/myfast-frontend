<template>
  <a-layout class="layout-container" :class="{ 'layout-dark': isDarkTheme, 'layout-mobile': isMobile }">
    <!-- 移动端菜单遮罩层 -->
    <div 
      v-if="isMobile && !collapsed" 
      class="mobile-mask" 
      @click="toggleCollapsed"
    ></div>
    
    <!-- 侧边栏 -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      width="240"
      :collapsed-width="isMobile ? 0 : 64"
      class="layout-sider"
      :theme="siderTheme"
      :class="{ 'mobile-sider': isMobile }"
    >
      <div class="logo" @click="$router.push('/')">
        <img src="../assets/logo.png" alt="Logo" class="logo-image" />
        <h1 v-show="!collapsed">MyFast-Admin</h1>
      </div>
      <side-menu :collapsed="collapsed" :theme="siderTheme" />
    </a-layout-sider>

    <a-layout class="main-content-wrapper">
      <!-- 顶部导航 -->
      <a-layout-header class="layout-header">
        <div class="header-left">
          <span class="trigger-wrapper">
            <menu-unfold-outlined
              v-if="collapsed"
              class="trigger"
              @click="toggleCollapsed"
            />
            <menu-fold-outlined
              v-else
              class="trigger"
              @click="toggleCollapsed"
            />
          </span>
          <breadcrumb class="breadcrumb" v-if="!isMobile" />
        </div>
        <div class="header-right">
          <a-tooltip title="刷新当前页" v-if="!isMobile">
            <reload-outlined class="action-icon" @click="refreshCurrentPage" />
          </a-tooltip>
          <a-tooltip :title="isDarkTheme ? '浅色模式' : '深色模式'" v-if="!isMobile">
            <component :is="isDarkTheme ? 'bulb-filled' : 'bulb-outlined'" class="action-icon" @click="toggleTheme" />
          </a-tooltip>
          <a-tooltip title="全屏" v-if="!isMobile">
            <component :is="isFullscreen ? 'fullscreen-exit-outlined' : 'fullscreen-outlined'" class="action-icon" @click="toggleFullscreen" />
          </a-tooltip>
          <header-right />
        </div>
      </a-layout-header>

      <!-- 标签导航 -->
      <div class="tags-nav" v-if="!isMobile">
        <a-tabs
          v-model:activeKey="activeKey"
          :hideAdd="true"
          type="editable-card"
          @edit="handleTagEdit"
          @change="handleTagChange"
        >
          <a-tab-pane
            v-for="tag in tagsViewStore.visitedTags"
            :key="tag.path"
            :tab="tag.title"
            :closable="tag.path !== '/dashboard'"
          />
        </a-tabs>
        <div class="tags-actions">
          <a-dropdown>
            <template #overlay>
              <a-menu>
                <a-menu-item key="refresh-current" @click="refreshCurrentPage">
                  <reload-outlined /> 刷新当前页
                </a-menu-item>
                <a-menu-item key="close-current" @click="closeCurrentTag" :disabled="activeKey === '/dashboard'">
                  <close-outlined /> 关闭当前
                </a-menu-item>
                <a-menu-item key="close-others" @click="closeOtherTags">
                  <close-circle-outlined /> 关闭其他
                </a-menu-item>
                <a-menu-item key="close-all" @click="closeAllTags">
                  <close-square-outlined /> 关闭所有
                </a-menu-item>
              </a-menu>
            </template>
            <down-outlined class="tags-action-icon" />
          </a-dropdown>
        </div>
      </div>

      <!-- 内容区 -->
      <a-layout-content class="layout-content">
        <div class="content-container">
          <router-view v-slot="{ Component }" v-if="!isRefreshing">
            <transition name="fade-transform" mode="out-in">
              <keep-alive :include="tagsViewStore.cachedViews">
                <component :is="Component" :key="routeKey" />
              </keep-alive>
            </transition>
          </router-view>
          <div v-else class="page-loading">
            <a-spin size="large" tip="加载中..." />
          </div>
        </div>
      </a-layout-content>

      <!-- 页脚 -->
      <a-layout-footer class="layout-footer">
        <div class="footer-content">
          <p>Copyright © {{ new Date().getFullYear() }} MyFast-Admin. All Rights Reserved.</p>
        </div>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  ReloadOutlined, 
  DownOutlined,
  BulbOutlined,
  BulbFilled,
  FullscreenOutlined,
  FullscreenExitOutlined,
  CloseOutlined,
  CloseCircleOutlined,
  CloseSquareOutlined
} from '@ant-design/icons-vue';
import SideMenu from './components/SideMenu.vue';
import HeaderRight from './components/HeaderRight.vue';
import Breadcrumb from './components/Breadcrumb.vue';
import { useUserStore } from '@/stores/modules/user';
import { useTagsViewStore } from '@/stores/modules/tagsView';
import { message } from 'ant-design-vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const tagsViewStore = useTagsViewStore();
const collapsed = ref(false);
const isDarkTheme = ref(false);
const isFullscreen = ref(false);
const isMobile = ref(false);
const siderTheme = computed(() => isDarkTheme.value ? 'dark' : 'dark'); // 统一使用暗色主题
const isRefreshing = ref(false);

// 路由key，用于强制刷新组件
const routeKey = computed(() => route.path + (route.query.t || ''));

// 当前激活的标签
const activeKey = ref('/dashboard');

// 检测是否为移动设备
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
  if (isMobile.value && !collapsed.value) {
    collapsed.value = true;
  }
};

// 监听窗口大小变化，在小屏幕上自动折叠侧边栏
const handleResize = () => {
  checkMobile();
  if (window.innerWidth < 992 && !collapsed.value && !isMobile.value) {
    collapsed.value = true;
  } else if (window.innerWidth >= 1200 && collapsed.value && !isMobile.value) {
    collapsed.value = false;
  }
};

// 切换侧边栏折叠状态
const toggleCollapsed = () => {
  collapsed.value = !collapsed.value;
};

// 页面加载时从本地存储加载主题设置
onMounted(() => {
  // 从localStorage加载主题设置
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    isDarkTheme.value = savedTheme === 'dark';
  }
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize);
  checkMobile();
  
  // 监听全屏变化
  document.addEventListener('fullscreenchange', handleFullscreenChange);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
});

// 根据路由变化更新标签导航
watch(() => route.path, (path: string) => {
  activeKey.value = path;
  tagsViewStore.addVisitedTag(route);
}, { immediate: true });

// 处理标签点击
const handleTagChange = (key: string) => {
  router.push(key);
};

// 处理标签编辑（关闭）
const handleTagEdit = (targetKey: string, action: string) => {
  if (action === 'remove') {
    removeVisitedTag(targetKey);
  }
};

// 移除访问标签
const removeVisitedTag = (path: string) => {
  // 从store中移除标签
  const updatedTags = tagsViewStore.removeVisitedTag(path);
  
  // 如果关闭的是当前标签，则需要跳转到剩余标签中的一个
  if (path === activeKey.value) {
    // 找到关闭标签在原数组中的位置
    let nextPath = '/dashboard';
    const currentTags = tagsViewStore.visitedTags;
    const index = currentTags.findIndex(tag => tag.path === path);
    
    if (index > 0) {
      nextPath = currentTags[index - 1].path;
    } else if (currentTags.length > 1) {
      nextPath = currentTags[1].path;
    }
    
    router.push(nextPath);
  }
};

// 关闭当前标签
const closeCurrentTag = () => {
  if (activeKey.value !== '/dashboard') {
    removeVisitedTag(activeKey.value);
  }
};

// 关闭其他标签
const closeOtherTags = () => {
  tagsViewStore.closeOtherTags(activeKey.value);
  message.success('已关闭其他标签');
};

// 关闭所有标签
const closeAllTags = () => {
  tagsViewStore.closeAllTags();
  router.push('/dashboard');
  message.success('已关闭所有标签');
};

// 刷新当前页面
const refreshCurrentPage = () => {
  isRefreshing.value = true;
  
  // 从缓存中移除当前路由
  const name = route.name as string;
  if (name) {
    tagsViewStore.refreshCache(name);
  }
  
  // 添加随机参数强制刷新
  const { query } = route;
  router.replace({
    path: route.path,
    query: {
      ...query,
      t: Date.now().toString()
    }
  });
  
  // 延迟恢复显示，确保组件被完全重新创建
  setTimeout(() => {
    isRefreshing.value = false;
    message.success('页面已刷新');
  }, 500);
};

// 切换主题
const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  localStorage.setItem('theme', isDarkTheme.value ? 'dark' : 'light');
  message.success(`已切换至${isDarkTheme.value ? '深色' : '浅色'}模式`);
};

// 切换全屏
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
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
</script>

<style lang="less" scoped>
.layout-container {
  min-height: 100vh;
  
  &.layout-mobile {
    // 移动端特有样式
    .main-content-wrapper {
      margin-left: 0 !important;
      transition: margin-left 0.3s;
    }
    
    .layout-header {
      width: 100% !important;
      
      .header-left {
        .breadcrumb {
          display: none;
        }
      }
    }
    
    .layout-content {
      margin: 64px 8px 0 !important;
      padding: 8px 0 !important;
      
      .content-container {
        padding: 16px !important;
      }
    }

    .mobile-sider {
      position: fixed;
      z-index: 100;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.45);
      height: 100vh;
      left: 0;
    }
  }
  
  // 移动端菜单遮罩层
  .mobile-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.45);
    z-index: 99;
  }
  
  &.layout-dark {
    background-color: #141414;
    
    .layout-header {
      background: #1f1f1f;
      color: rgba(255, 255, 255, 0.85);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
      
      .trigger, .action-icon {
        color: rgba(255, 255, 255, 0.85);
        &:hover {
          color: #1890ff;
        }
      }
    }
    
    .tags-nav {
      background: #1f1f1f;
      border-color: #303030;
      
      :deep(.ant-tabs-tab) {
        color: rgba(255, 255, 255, 0.65);
      }
      
      :deep(.ant-tabs-tab-active) {
        background: #111b26;
      }
    }
    
    .content-container {
      background: #1f1f1f;
      color: rgba(255, 255, 255, 0.85);
      border-color: #303030;
    }
    
    .layout-footer .footer-content {
      color: rgba(255, 255, 255, 0.45);
    }
  }

  .main-content-wrapper {
    margin-left: v-bind('isMobile ? "0" : (collapsed ? "64px" : "240px")');
    transition: margin-left 0.2s;
    min-height: 100vh;
  }

  .layout-sider {
    box-shadow: 2px 0 8px rgba(0, 21, 41, 0.15);
    z-index: 10;
    position: fixed;
    left: 0;
    height: 100vh;
    overflow: auto;
    transition: all 0.2s;

    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 3px;
    }

    .logo {
      height: 64px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      background: #001529;
      overflow: hidden;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      transition: all 0.3s;

      .logo-image {
        width: 32px;
        height: 32px;
        margin-right: 12px;
        transition: margin 0.3s;
      }

      h1 {
        color: white;
        font-size: 18px;
        margin: 0;
        white-space: nowrap;
        font-weight: 600;
        letter-spacing: 0.5px;
        opacity: 1;
        transition: opacity 0.3s, transform 0.3s;
      }
    }
  }

  .layout-header {
    background: #fff;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    z-index: 9;
    position: fixed;
    width: calc(100% - v-bind('isMobile ? "0" : (collapsed ? "64px" : "240px")'));
    right: 0;
    transition: all 0.2s;

    .header-left {
      display: flex;
      align-items: center;

      .trigger-wrapper {
        display: flex;
        align-items: center;
      }

      .trigger {
        font-size: 18px;
        padding: 0 24px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          color: #1890ff;
        }
      }

      .breadcrumb {
        margin-left: 8px;
      }
    }
    
    .header-right {
      display: flex;
      align-items: center;
      margin-right: 16px;
      
      .action-icon {
        font-size: 16px;
        padding: 0 12px;
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          color: #1890ff;
        }
      }
    }
  }

  .tags-nav {
    position: fixed;
    top: 64px;
    right: 0;
    width: calc(100% - v-bind('collapsed ? "64px" : "240px"'));
    height: 40px;
    background: #fff;
    padding: 0 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    z-index: 8;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;

    :deep(.ant-tabs) {
      height: 40px;
      flex: 1;
      overflow: hidden;
    }

    :deep(.ant-tabs-nav) {
      margin: 0;
    }

    :deep(.ant-tabs-tab) {
      background: transparent;
      border: none;
      border-radius: 3px;
      margin: 4px 4px 4px 0;
      padding: 0 10px;
      height: 32px;
      line-height: 32px;
      transition: all 0.3s;
      user-select: none;
      
      &:hover {
        color: #1890ff;
        background: #e6f7ff;
      }
    }

    :deep(.ant-tabs-tab-active) {
      background: #e6f7ff;
      color: #1890ff;
      font-weight: 500;
    }

    :deep(.ant-tabs-tab-btn) {
      font-size: 13px;
    }
    
    .tags-actions {
      padding: 0 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .tags-action-icon {
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s;
        padding: 8px;
        border-radius: 4px;
        
        &:hover {
          color: #1890ff;
          background: #f0f0f0;
        }
      }
    }
  }

  .layout-content {
    margin: 104px 16px 0;
    padding: 16px 0;
    transition: all 0.2s;

    .content-container {
      padding: 24px;
      background: #fff;
      min-height: calc(100vh - 188px);
      border-radius: 4px;
      border: 1px solid #f0f0f0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
      
      .page-loading {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
      }
    }
  }

  .layout-footer {
    text-align: center;
    padding: 16px;
    background: transparent;
    transition: all 0.2s;

    .footer-content {
      color: rgba(0, 0, 0, 0.45);
      font-size: 12px;
    }
  }
}

/* 媒体查询适配不同设备 */
@media (max-width: 768px) {
  .layout-container {
    .layout-content {
      margin: 64px 8px 0 !important;
      padding: 8px 0;
      
      .content-container {
        padding: 12px;
      }
    }
    
    .layout-header {
      padding: 0 8px;
      
      .header-left {
      .trigger {
        padding: 0 12px;
        }
      }
      
      .header-right {
        margin-right: 8px;
        
        .action-icon {
          padding: 0 8px;
        }
      }
    }
    
    .layout-footer {
      padding: 12px 8px;
    }
  }
}

/* 平板设备适配 */
@media (min-width: 769px) and (max-width: 991px) {
  .layout-container {
    .layout-content {
      margin: 104px 12px 0;
      
      .content-container {
        padding: 16px;
      }
    }
  }
}

/* 动画过渡效果 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s ease;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
