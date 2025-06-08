<template>
  <div
    class="app-wrapper"
    :class="[
      isCollapse ? 'hideAside' : 'openAside',
      device === 'mobile' ? 'mobile' : ''
    ]"
  >
    <div class="sidebar-container" :class="{ 'is-collapse': isCollapse }">
      <div
        class="logo"
        :class="
          isCollapse ? 'collapse-logo' : device === 'mobile' ? 'mobile-logo' : ''
        "
      >
        <img src="../assets/logo.png" alt="logo" class="logo-img" />
        <h1 v-show="!isCollapse && device !== 'mobile'" class="logo-text">
          MyFast Admin
        </h1>
      </div>
      <el-scrollbar>
        <SideMenu />
      </el-scrollbar>
    </div>
    <div class="main-container">
      <div class="fixed-header">
        <div class="navbar flex-row flex-between">
          <div class="flex-row flex-center navbar-left">
            <div class="hamburger-container" @click="toggleSideBar">
              <el-icon :size="20">
                <component :is="isCollapse ? 'Expand' : 'Fold'" />
              </el-icon>
            </div>
            <Breadcrumb />
          </div>

          <div class="navbar-right flex-row flex-center">
            <HeaderRight />
          </div>
        </div>

        <!-- <div class="tab-view">
          <TabsNav />
        </div> -->
      </div>

      <div class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="keepAlivePages">
              <component :is="Component" :key="$route.fullPath" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useAppStore } from '../stores/modules/app';
import { useKeepAliveStore } from '../stores/modules/keepAlive';
import { useRoute, useRouter } from 'vue-router';
import SideMenu from './components/SideMenu.vue';
import Breadcrumb from './components/Breadcrumb.vue';
import HeaderRight from './components/HeaderRight.vue';
import TabsNav from './components/TabsNav.vue';

// 使用仓库
const appStore = useAppStore();
const keepAliveStore = useKeepAliveStore();
const router = useRouter();
const route = useRoute();

// 需要缓存的页面
const keepAlivePages = computed(() => keepAliveStore.getKeepAlivePages);

// 侧边栏收起状态
const isCollapse = computed(() => !appStore.sidebar.opened);

// 设备类型
const device = computed(() => appStore.device);

// 切换侧边栏展开/收起
const toggleSideBar = () => {
  appStore.toggleSidebar();

  // 移动设备上点击菜单后自动收起侧边栏
  if (device.value === 'mobile' && !isCollapse.value) {
    appStore.closeSidebar();
  }
};

// 监听窗口大小变化
const resizeHandler = () => {
  const { body } = document;
  const width = body.clientWidth;

  if (width < 992) {
    appStore.toggleDevice('mobile');
    appStore.closeSidebar();
  } else {
    appStore.toggleDevice('desktop');
    appStore.openSidebar();
  }
};

// 移动端下点击主区域关闭侧边栏
const closeSidebarOnClickOutside = (e: MouseEvent) => {
  if (device.value === 'mobile' && !isCollapse.value) {
    const target = e.target as HTMLElement;
    if (!target.closest('.sidebar-container') && !target.closest('.hamburger-container')) {
      appStore.closeSidebar();
    }
  }
};

// 监听路由变化
watch(
  () => route.path,
  () => {
    // 移动设备上路由变化后自动收起侧边栏
    if (device.value === 'mobile' && !isCollapse.value) {
      appStore.closeSidebar();
    }
  }
);

// 挂载时添加窗口尺寸变化监听
onMounted(() => {
  window.addEventListener('resize', resizeHandler);
  document.addEventListener('click', closeSidebarOnClickOutside);
  // 初始化设备类型
  resizeHandler();
});

// 卸载前移除事件监听
onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler);
  document.removeEventListener('click', closeSidebarOnClickOutside);
});
</script>

<style lang="scss" scoped>
.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-center {
  align-items: center;
}

.flex-between {
  justify-content: space-between;
}

.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  
  &.hideAside {
    .sidebar-container {
      width: 64px;
      transition: width 0.3s cubic-bezier(0.2, 0, 0, 1);
    }

    .main-container {
      margin-left: 64px;
      transition: margin-left 0.3s cubic-bezier(0.2, 0, 0, 1);
    }
  }

  &.openAside {
    .sidebar-container {
      width: 240px;
      transition: width 0.3s cubic-bezier(0.2, 0, 0, 1);
    }

    .main-container {
      margin-left: 240px;
      transition: margin-left 0.3s cubic-bezier(0.2, 0, 0, 1);
    }
  }

  &.mobile {
    .main-container {
      margin-left: 0;
    }
    
    .sidebar-container {
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      z-index: 1001;
      transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1);
      
      &.is-collapse {
        transform: translateX(-100%);
      }
    }
  }
}

.sidebar-container {
  background: var(--menu-bg-color);
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1001;
  transition: width 0.3s cubic-bezier(0.2, 0, 0, 1);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);

  .logo {
    display: flex;
    align-items: center;
    height: 64px;
    padding-left: 20px;
    overflow: hidden;
    background: transparent;
    cursor: pointer;
    box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.05);
    transition: all 0.3s;

    .logo-img {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      transition: all 0.3s;
    }

    .logo-text {
      margin: 0;
      margin-left: 12px;
      color: var(--menu-text-color);
      font-weight: 600;
      font-size: 18px;
      line-height: 64px;
      white-space: nowrap;
      transition: all 0.3s;
    }

    &.collapse-logo {
      padding-left: 16px;
      justify-content: center;

      .logo-img {
        margin-right: 0;
      }
    }

    &.mobile-logo {
      justify-content: center;
      padding-left: 0;
    }
  }
}

.main-container {
  flex: 1;
  min-width: 0;
  position: relative;
  overflow: hidden;
  transition: margin-left 0.3s cubic-bezier(0.2, 0, 0, 1);
}

.fixed-header {
  position: relative;
  z-index: 999;
  background-color: var(--header-bg-color);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.navbar {
  height: 64px;
  padding: 0;
  position: relative;
  background-color: var(--header-bg-color);
  overflow: hidden;

  .navbar-left {
    height: 100%;
    overflow: hidden;
    flex: 1;
    min-width: 0;
  }

  .navbar-right {
    height: 100%;
    padding-right: 20px;
    flex-shrink: 0;
  }

  .hamburger-container {
    line-height: 64px;
    height: 64px;
    padding: 0 20px;
    cursor: pointer;
    transition: background 0.3s;
    flex-shrink: 0;

    &:hover {
      background: rgba(0, 0, 0, 0.03);
    }
  }

  .right-item {
    padding: 0 16px;
    display: flex;
    align-items: center;
    height: 64px;
    cursor: pointer;
    font-size: 20px;
    transition: all 0.3s;

    &:hover {
      background: rgba(0, 0, 0, 0.03);
    }
  }
}

.tab-view {
  height: 42px;
  line-height: 42px;
  background: var(--tabs-bg-color);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.app-main {
  position: relative;
  padding: 20px;
  height: calc(100vh - 106px);
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--main-bg-color);
}

/* 过渡动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* 暗色主题适配 */
.layout-dark {
  .fixed-header {
    background-color: var(--header-bg-color);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  .navbar {
    background-color: var(--header-bg-color);

    .hamburger-container {
      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }
    }

    .right-item {
      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }
    }
  }

  .tab-view {
    background-color: var(--tabs-bg-color);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  }
}

/* 响应式设计 */
@media (max-width: 992px) {
  .navbar {
    padding: 0;
    
    .right-item {
      padding: 0 8px;
    }
  }
  
  .app-main {
    padding: 12px;
  }
}

@media (max-width: 768px) {
  .navbar {
    .right-item {
      padding: 0 6px;
      font-size: 18px;
    }
    
    .hamburger-container {
      padding: 0 12px;
    }
  }
  
  .app-main {
    padding: 10px;
    height: calc(100vh - 106px);
  }
}

@media (max-width: 576px) {
  .navbar {
    .navbar-right {
      padding-right: 4px;
    }
    
    .right-item {
      padding: 0 4px;
      font-size: 16px;
    }
    
    .hamburger-container {
      padding: 0 8px;
    }
  }
  
  .app-main {
    padding: 8px;
  }
}
</style>
