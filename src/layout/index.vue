<template>
  <a-layout class="layout-container">
    <!-- 侧边栏 -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      width="220"
      class="layout-sider"
    >
      <div class="logo" @click="$router.push('/')">
        <img src="../assets/logo.png" alt="Logo" class="logo-image" />
        <h1 v-if="!collapsed">MyFast-Admin</h1>
      </div>
      <side-menu :collapsed="collapsed" />
    </a-layout-sider>

    <a-layout>
      <!-- 顶部导航 -->
      <a-layout-header class="layout-header">
        <div class="header-left">
          <menu-unfold-outlined
            v-if="collapsed"
            class="trigger"
            @click="collapsed = !collapsed"
          />
          <menu-fold-outlined
            v-else
            class="trigger"
            @click="collapsed = !collapsed"
          />
          <breadcrumb class="breadcrumb" />
        </div>
        <div class="header-right">
          <header-right />
        </div>
      </a-layout-header>

      <!-- 标签导航 -->
      <div class="tags-nav">
        <a-tabs
          v-model:activeKey="activeKey"
          :hideAdd="true"
          type="editable-card"
          @edit="handleTagEdit"
        >
          <a-tab-pane
            v-for="tag in visitedTags"
            :key="tag.path"
            :tab="tag.title"
            :closable="tag.path !== '/dashboard'"
          />
        </a-tabs>
      </div>

      <!-- 内容区 -->
      <a-layout-content class="layout-content">
        <div class="content-container">
          <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
              <keep-alive :include="cachedViews">
                <component :is="Component" />
              </keep-alive>
            </transition>
          </router-view>
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
import { ref, reactive, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
import SideMenu from './components/SideMenu.vue';
import HeaderRight from './components/HeaderRight.vue';
import Breadcrumb from './components/Breadcrumb.vue';

const route = useRoute();
const router = useRouter();
const collapsed = ref(false);

// 标签导航
const visitedTags = reactive([
  { title: '仪表盘', path: '/dashboard' }
]);
const cachedViews = ref<string[]>([]);
const activeKey = ref('/dashboard');

// 根据路由变化更新标签导航
watch(() => route.path, (path) => {
  activeKey.value = path;
  addVisitedTag(route);
}, { immediate: true });

// 添加访问标签
const addVisitedTag = (route: any) => {
  const { name, path, meta } = route;
  if (path === '/login' || path === '/404') return;

  // 检查标签是否已存在
  const isExist = visitedTags.some(tag => tag.path === path);
  if (!isExist) {
    visitedTags.push({
      title: meta.title || name,
      path: path
    });
  }

  // 更新缓存视图
  if (name && !cachedViews.value.includes(name as string)) {
    cachedViews.value.push(name as string);
  }
};

// 处理标签编辑（关闭）
const handleTagEdit = (targetKey: string, action: string) => {
  if (action === 'remove') {
    removeVisitedTag(targetKey);
  }
};

// 移除访问标签
const removeVisitedTag = (path: string) => {
  // 查找要删除的标签索引
  const index = visitedTags.findIndex(tag => tag.path === path);
  if (index > -1) {
    // 获取被删除标签的路由名称，从缓存中移除
    const routeObj = router.getRoutes().find(r => r.path === path);
    if (routeObj && routeObj.name) {
      const cacheIndex = cachedViews.value.indexOf(routeObj.name as string);
      if (cacheIndex > -1) {
        cachedViews.value.splice(cacheIndex, 1);
      }
    }

    // 从已访问标签中移除
    visitedTags.splice(index, 1);

    // 如果关闭的是当前标签，则需要跳转到剩余标签中的一个
    if (path === activeKey.value) {
      const nextTag = visitedTags[index] || visitedTags[index - 1];
      if (nextTag) {
        router.push(nextTag.path);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.layout-container {
  min-height: 100vh;

  .layout-sider {
    box-shadow: 2px 0 6px rgba(0, 21, 41, 0.1);
    z-index: 10;
    position: fixed;
    left: 0;
    height: 100vh;
    overflow: auto;

    .logo {
      height: 64px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #001529;
      overflow: hidden;
      cursor: pointer;

      .logo-image {
        width: 32px;
        height: 32px;
        margin-right: 8px;
      }

      h1 {
        color: white;
        font-size: 18px;
        margin: 0;
        white-space: nowrap;
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
    width: calc(100% - v-bind('collapsed ? "80px" : "220px"'));
    right: 0;
    transition: width 0.2s;

    .header-left {
      display: flex;
      align-items: center;

      .trigger {
        font-size: 18px;
        padding: 0 24px;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #1890ff;
        }
      }

      .breadcrumb {
        margin-left: 8px;
      }
    }
  }

  .tags-nav {
    position: fixed;
    top: 64px;
    right: 0;
    width: calc(100% - v-bind('collapsed ? "80px" : "220px"'));
    height: 40px;
    background: #fff;
    padding: 0 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    z-index: 8;
    transition: width 0.2s;

    :deep(.ant-tabs) {
      height: 40px;
    }

    :deep(.ant-tabs-nav) {
      margin: 0;
    }

    :deep(.ant-tabs-tab) {
      background: transparent;
      border: none;
      border-radius: 0;
      margin-right: 0;
      transition: all 0.3s;
    }

    :deep(.ant-tabs-tab-active) {
      background: #e6f7ff;
      color: #1890ff;
    }

    :deep(.ant-tabs-tab-btn) {
      font-size: 12px;
    }
  }

  .layout-content {
    margin: 120px 16px 16px;
    margin-left: v-bind('collapsed ? "96px" : "236px"');
    transition: margin-left 0.2s;

    .content-container {
      padding: 16px;
      background: #fff;
      min-height: calc(100vh - 180px);
      border-radius: 4px;
    }
  }

  .layout-footer {
    text-align: center;
    padding: 16px;
    background: transparent;
    margin-left: v-bind('collapsed ? "80px" : "220px"');
    transition: margin-left 0.2s;

    .footer-content {
      color: rgba(0, 0, 0, 0.45);
      font-size: 12px;
    }
  }
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
