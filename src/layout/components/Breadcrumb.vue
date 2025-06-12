<template>
  <div class="breadcrumb-container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
        <template v-if="item.path && index < breadcrumbList.length - 1">
          <router-link :to="item.path">
            <el-icon v-if="item.meta && item.meta.icon" class="breadcrumb-icon">
              <component :is="getIconComponent(String(item.meta.icon))" />
            </el-icon>
            <span class="breadcrumb-text">{{ item.meta?.title || '首页' }}</span>
          </router-link>
        </template>
        <template v-else>
          <el-icon v-if="item.meta && item.meta.icon" class="breadcrumb-icon">
            <component :is="getIconComponent(String(item.meta.icon))" />
          </el-icon>
          <span class="breadcrumb-last">{{ item.meta?.title || '首页' }}</span>
        </template>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, nextTick, computed, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { RouteLocationMatched } from 'vue-router';
import {
  HomeFilled,
  User,
  Lock,
  Menu as MenuIcon,
  Operation,
  SetUp,
  Monitor,
  Connection,
  Edit,
  Setting,
  Platform,
  Collection,
  Notebook,
  Histogram,
  DataAnalysis
} from '@element-plus/icons-vue';

// 图标组件映射
const iconComponents: Record<string, any> = {
  HomeFilled,
  User,
  Lock,
  MenuIcon,
  Operation,
  SetUp,
  Monitor,
  Connection,
  Edit,
  Setting,
  Platform,
  Collection,
  Notebook,
  Histogram,
  DataAnalysis
};

// 获取图标组件
const getIconComponent = (iconName: string): any => {
  return iconComponents[iconName] || HomeFilled;
};

const route = useRoute();
const router = useRouter();
const breadcrumbList = ref<RouteLocationMatched[]>([]);

// 计算是否是移动设备
const isMobile = computed(() => {
  return window.innerWidth < 768;
});

// 根据当前路由生成面包屑导航
const getBreadcrumb = () => {
  // 首先过滤出具有meta.title的路由
  let matched = route.matched.filter(item => item.meta && item.meta.title);
  ///console.log('当前匹配的路由:', matched);

  // 如果没有匹配到面包屑项，添加首页
  if (!matched.length) {
    const home = router.getRoutes().find(r => r.path === '/dashboard');
    if (home) {
      matched = [home];
    }
  }

  // 如果不是从首页开始，添加首页到最前面
  const first = matched[0];
  if (first && first.path !== '/dashboard' && route.path !== '/dashboard') {
    const home = router.getRoutes().find(r => r.path === '/dashboard');
    if (home) {
      matched.unshift(home);
    }
  }

  // 处理仪表盘特殊情况
  if (route.path === '/dashboard') {
    const dashboard = router.getRoutes().find(r => r.path === '/dashboard');
    if (dashboard && dashboard.children && dashboard.children.length > 0) {
      // 使用完整的仪表盘路由信息
      matched = [dashboard];
    }
  }

  // 根据屏幕尺寸调整面包屑
  if (isMobile.value && matched.length > 2) {
    // 在移动设备上，如果路径太长，只保留首页和当前页
    breadcrumbList.value = [matched[0], matched[matched.length - 1]];
  } else {
    breadcrumbList.value = matched;
  }

  ///console.log('生成的面包屑列表:', breadcrumbList.value);
};

// 监听路由变化，更新面包屑
watch(() => route.path, () => {
  nextTick(() => {
    getBreadcrumb();
  });
}, { immediate: true });

// 监听路由的matched属性变化
watch(() => route.matched, () => {
  nextTick(() => {
    getBreadcrumb();
  });
}, { deep: true });

// 监听窗口大小变化
const handleResize = () => {
  getBreadcrumb();
};

// 组件挂载时
onMounted(() => {
  getBreadcrumb();
  window.addEventListener('resize', handleResize);
});

// 组件卸载前移除事件监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style lang="scss" scoped>
.breadcrumb-container {
  display: flex;
  align-items: center;
  height: 100%;
  min-width: 0;
  flex: 1;
  padding-left: 20px;
  margin-left: 16px;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    height: 24px;
    width: 3px;
    background: linear-gradient(to bottom, var(--el-color-primary-light-5), var(--el-color-primary));
    transform: translateY(-50%);
    border-radius: 2px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  :deep(.el-breadcrumb) {
    line-height: 64px;
    font-size: 14px;
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    overflow: hidden;

    .el-breadcrumb__item {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
      white-space: nowrap;
      position: relative;

      &:last-child {
        flex-shrink: 1;
        overflow: hidden;
      }

      .el-breadcrumb__inner {
        display: inline-flex;
        align-items: center;
        color: rgba(0, 0, 0, 0.65);
        font-weight: normal;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 4px 8px;
        border-radius: 4px;

        &:hover {
          color: var(--el-color-primary);
          background-color: var(--el-color-primary-light-9);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transform: translateY(-1px);
        }

        .el-icon {
          margin-right: 6px;
          font-size: 16px;
          flex-shrink: 0;
        }
      }

      .el-breadcrumb__separator {
        margin: 0 4px;
        color: rgba(0, 0, 0, 0.3);
        flex-shrink: 0;
        font-weight: 300;
        opacity: 0.8;
      }

      &:last-child {
        .el-breadcrumb__inner {
          font-weight: 600;
          color: var(--el-color-primary);
          background-color: var(--el-color-primary-light-9);
          padding: 4px 12px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }
      }

      &:not(:last-child) {
        position: relative;
        &::after {
          content: '';
          position: absolute;
          bottom: 22px;
          left: 8px;
          width: calc(100% - 16px);
          height: 2px;
          background-color: transparent;
          border-radius: 1px;
          transition: background-color 0.3s;
        }

        &:hover::after {
          background-color: var(--el-color-primary-light-7);
        }
      }
    }
  }

  .breadcrumb-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    letter-spacing: 0.3px;
  }

  .breadcrumb-last {
    font-weight: 500;
    color: var(--el-color-primary);
    margin-left: 4px;
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 160px;
    letter-spacing: 0.3px;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: var(--el-color-primary);
      border-radius: 1px;
      transform: scaleX(0);
      transition: transform 0.3s;
      transform-origin: 0 0;
    }

    &:hover::after {
      transform: scaleX(1);
    }
  }

  .breadcrumb-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    margin-right: 6px;
    color: var(--el-color-primary);
  }
}

/* 暗色主题适配 */
:deep(.layout-dark) {
  .breadcrumb-container {
    &::before {
      background: linear-gradient(to bottom, var(--el-color-primary-light-3), var(--el-color-primary));
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .el-breadcrumb__inner {
      color: rgba(255, 255, 255, 0.75) !important;

      &:hover {
        color: #fff !important;
        background-color: rgba(255, 255, 255, 0.1) !important;
      }
    }

    .el-breadcrumb__separator {
      color: rgba(255, 255, 255, 0.4) !important;
    }

    .breadcrumb-last {
      color: #fff !important;

      &::after {
        background-color: rgba(255, 255, 255, 0.6);
      }
    }

    .el-breadcrumb__item:last-child .el-breadcrumb__inner {
      color: #fff !important;
      background-color: rgba(255, 255, 255, 0.15) !important;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }

    .breadcrumb-icon {
      color: var(--el-color-primary-light-3);
    }
  }
}

/* 响应式设计 */
@media (max-width: 992px) {
  .breadcrumb-container {
    padding-left: 16px;
    margin-left: 12px;

    &::before {
      height: 20px;
      width: 2px;
    }

    :deep(.el-breadcrumb) {
      font-size: 13px;

      .el-icon {
        font-size: 14px !important;
      }

      .el-breadcrumb__separator {
        margin: 0 4px;
      }

      .el-breadcrumb__inner {
        padding: 3px 6px;
      }

      .el-breadcrumb__item:last-child .el-breadcrumb__inner {
        padding: 3px 8px;
      }
    }

    .breadcrumb-last {
      max-width: 120px;
    }
  }
}

@media (max-width: 768px) {
  .breadcrumb-container {
    padding-left: 12px;
    margin-left: 8px;

    &::before {
      height: 16px;
      width: 2px;
    }

    :deep(.el-breadcrumb) {
      font-size: 12px;

      .el-icon {
        margin-right: 3px;
        font-size: 12px !important;
      }

      .el-breadcrumb__inner {
        padding: 2px 4px;
      }

      .el-breadcrumb__item:last-child .el-breadcrumb__inner {
        padding: 2px 6px;
      }
    }

    .breadcrumb-last {
      max-width: 100px;
    }

    .breadcrumb-icon {
      font-size: 12px;
      margin-right: 4px;
    }
  }
}

@media (max-width: 576px) {
  .breadcrumb-container {
    max-width: 160px;

    .breadcrumb-last {
      max-width: 80px;
    }
  }
}
</style>
