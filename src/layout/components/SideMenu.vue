<template>
  <div class="side-menu-container">
    <el-menu
      :default-active="selectedKeys[0]"
      :collapse="collapsed"
      :class="{ 'menu-scrollable': true }"
      background-color="transparent"
      text-color="rgba(255, 255, 255, 0.85)"
      :active-text-color="'#64b5f6'"
      :unique-opened="true"
      :collapse-transition="false"
    >
      <template v-for="menu in menuList" :key="menu.path">
        <!-- 只有有标题的菜单项才显示 -->
        <template v-if="menu.meta && menu.meta.title">
          <!-- 有子菜单 -->
          <template v-if="menu.children && menu.children.length > 0">
            <el-sub-menu :index="menu.path">
              <template #title>
                <el-icon><component :is="getIconComponent(menu.meta?.icon, menu.path)" /></el-icon>
                <span v-if="!collapsed">{{ menu.meta?.title }}</span>
              </template>
              <!-- 递归渲染子菜单项 -->
              <template v-for="subMenu in menu.children" :key="subMenu.path">
                <!-- 第二级菜单还有子菜单 -->
                <template v-if="subMenu.children && subMenu.children.length > 0">
                  <el-sub-menu :index="menu.path + '/' + subMenu.path">
                    <template #title>
                      <el-icon><component :is="getIconComponent(subMenu.meta?.icon, subMenu.path)" /></el-icon>
                      <span v-if="!collapsed">{{ subMenu.meta?.title }}</span>
                    </template>
                    <el-menu-item
                      v-for="item in subMenu.children"
                      :key="menu.path + '/' + subMenu.path + '/' + item.path"
                      :index="menu.path + '/' + subMenu.path + '/' + item.path"
                      @click="handleMenuClick(item.fullPath || (menu.path + '/' + subMenu.path + '/' + item.path))"
                    >
                      <el-icon><component :is="getIconComponent(item.meta?.icon, item.path)" /></el-icon>
                      <span v-if="!collapsed">{{ item.meta?.title }}</span>
                    </el-menu-item>
                  </el-sub-menu>
                </template>
                <!-- 第二级菜单没有子菜单 -->
                <template v-else>
                  <el-menu-item
                    :index="subMenu.fullPath || (menu.path + '/' + subMenu.path)"
                    @click="handleMenuClick(subMenu.fullPath || (menu.path + '/' + subMenu.path))"
                  >
                    <el-icon><component :is="getIconComponent(subMenu.meta?.icon, subMenu.path)" /></el-icon>
                    <span v-if="!collapsed">{{ subMenu.meta?.title }}</span>
                  </el-menu-item>
                </template>
              </template>
            </el-sub-menu>
          </template>
          <!-- 无子菜单 -->
          <template v-else>
            <el-menu-item :index="menu.path" @click="handleMenuClick(menu.path)">
              <el-icon><component :is="getIconComponent(menu.meta?.icon, menu.path)" /></el-icon>
              <span v-if="!collapsed">{{ menu.meta?.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter, RouteRecordRaw } from 'vue-router';
import { useAppStore } from '../../stores/modules/app';
import {
  Grid,
  User,
  Lock,
  Menu as MenuIcon,
  Operation,
  SetUp,
  Monitor,
  Connection,
  Document,
  Setting,
  Odometer,
  Coin,
  Timer,
  Tools,
  List,
  Edit,
  Files,
  Collection,
  Notebook,
  OfficeBuilding,
  Management,
  Histogram,
  Platform,
  DataAnalysis
} from '@element-plus/icons-vue';

// 获取应用状态
const appStore = useAppStore();

// 图标组件映射
const iconComponents: Record<string, any> = {
  Grid,
  User,
  Lock,
  MenuIcon,
  Operation,
  SetUp,
  Monitor,
  Connection,
  Document,
  Setting,
  Odometer,
  Coin,
  Timer,
  Tools,
  List,
  Edit,
  Files,
  Collection,
  Notebook,
  OfficeBuilding,
  Management,
  Histogram,
  Platform,
  DataAnalysis
};

// 获取图标组件
const getIconComponent = (iconName: unknown, path?: string): any => {
  // 优先使用meta中定义的图标
  if (iconName && typeof iconName === 'string' && iconName in iconComponents) {
    return iconComponents[iconName as keyof typeof iconComponents];
  }
  
  // 为特定路径提供默认图标
  if (path === '/dashboard' || path === 'dashboard') {
    return Histogram; // 数据可视化图标
  } else if (path === 'user' || path?.includes('user')) {
    return User;
  } else if (path === 'role' || path?.includes('role')) {
    return Lock;
  } else if (path === 'menu' || path?.includes('menu')) {
    return MenuIcon;
  } else if (path === 'dept' || path?.includes('dept')) {
    return OfficeBuilding;
  } else if (path === 'post' || path?.includes('post')) {
    return Collection;
  } else if (path === 'dict' || path?.includes('dict')) {
    return Notebook;
  } else if (path === 'config' || path?.includes('config')) {
    return Setting;
  } else if (path === 'online' || path?.includes('online')) {
    return Platform;
  } else if (path === 'server' || path?.includes('server')) {
    return Monitor;
  } else if (path === 'cache' || path?.includes('cache')) {
    return DataAnalysis;
  } else if (path === 'job' || path?.includes('job')) {
    return Timer;
  } else if (path === 'data' || path?.includes('data')) {
    return Document;
  } else if (path === 'gen' || path?.includes('gen')) {
    return Document;
  } else if (path === 'swagger' || path?.includes('swagger')) {
    return Connection;
  } else if (path === 'form' || path?.includes('form')) {
    return Edit;
  } else if (path === '/system' || path === 'system') {
    return SetUp;
  } else if (path === '/monitor' || path === 'monitor') {
    return Monitor;
  } else if (path === '/tool' || path === 'tool') {
    return Tools;
  }
  
  // 默认图标
  return Grid;
};

// 计算侧边栏收起状态
const collapsed = computed(() => !appStore.sidebar.opened);

// 计算主题
const theme = computed(() => appStore.theme);

const route = useRoute();
const router = useRouter();

// 当前选中的菜单项
const selectedKeys = ref<string[]>([]);
// 当前展开的子菜单
const openKeys = ref<string[]>([]);

// 在脚本部分添加移动设备检测
const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

// 监听窗口大小变化
const handleResize = () => {
  checkMobile();
};

// 监听路由变化更新菜单选中状态
watch(() => route.path, (path) => {
  console.log('路由变化:', path);
  
  // 特殊处理数据可视化路径
  if (path === '/dashboard') {
    selectedKeys.value = ['/dashboard'];
    return;
  }
  
  selectedKeys.value = [path];

  // 找出应该展开的菜单
  const pathParts = path.split('/').filter(Boolean);
  if (pathParts.length > 1) {
    // 如果路径有多层，则需要展开上层菜单
    // 构建展开的路径数组
    const openKeyArray: string[] = [];
    let currentPath = '';

    for (let i = 0; i < pathParts.length - 1; i++) {
      currentPath += '/' + pathParts[i];
      openKeyArray.push(currentPath);
    }

    openKeys.value = openKeyArray;
  }
}, { immediate: true });

// 监听折叠状态变化
watch(collapsed, (newVal) => {
  if (newVal) {
    openKeys.value = [];
  } else {
    // 恢复展开状态
    const path = route.path;
    
    // 特殊处理数据可视化路径
    if (path === '/dashboard') {
      openKeys.value = [];
      return;
    }
    
    const pathParts = path.split('/').filter(Boolean);
    if (pathParts.length > 1) {
      // 构建展开的路径数组
      const openKeyArray: string[] = [];
      let currentPath = '';

      for (let i = 0; i < pathParts.length - 1; i++) {
        currentPath += '/' + pathParts[i];
        openKeyArray.push(currentPath);
      }

      openKeys.value = openKeyArray;
    }
  }
});

// 从路由获取菜单数据
const menuList = computed(() => {
  // 过滤出不需要隐藏的路由作为菜单
  const routes = router.getRoutes()
    .filter(route => {
      // 排除登录、404和动态路径的路由
      if (route.path === '/login' || route.path === '/404' || route.path.includes('/:')) {
        return false;
      }
      // 排除带有hidden标记的路由
      if (route.meta && route.meta.hidden) {
        return false;
      }
      // 排除没有名称或标题的路由
      if ((!route.name && !route.meta?.title) || !route.path) {
        return false;
      }
      return true;
    });

  // 构建菜单树
  const rootRoutes = routes.filter(route => {
    // 处理根路由，确保dashboard作为一级菜单
    if (route.path === '/dashboard') {
      return true;
    }
    // 其他常规一级菜单(例如/system、/monitor等)
    return route.path === '/' || route.path.split('/').length === 2;
  });
  
  console.log('菜单根路由:', rootRoutes);

  // 处理根路由
  const menuData = rootRoutes.map(route => {
    // 查找子路由
    const children = routes
      .filter(r => {
        // 对于数据可视化，确保它不会有子路由
        if (route.path === '/dashboard') {
          return false;
        }
        
        // 排除没有名称或标题的子路由
        if (!r.name && !r.meta?.title) {
          return false;
        }
        
        // 查找直接子路由
        const isDirectChild = r.path.startsWith(route.path + '/') &&
                              r.path.split('/').length === route.path.split('/').length + 1;
        return isDirectChild;
      })
      .map(child => {
        // 提取子路由路径，保留完整路径以便于导航
        // 将 '/system/role' 保留为 '/system/role' 而不是简化为 'role'
        const fullPath = child.path;
        const path = child.path.replace(route.path + '/', '');

        // 查找第三级路由
        const grandChildren = routes
          .filter(r => {
            // 排除没有名称或标题的孙路由
            if (!r.name && !r.meta?.title) {
              return false;
            }
            
            // 查找当前子路由的子路由
            const isGrandChild = r.path.startsWith(child.path + '/') &&
                                r.path.split('/').length === child.path.split('/').length + 1;
            return isGrandChild;
          })
          .map(grandChild => {
            const grandFullPath = grandChild.path;
            const grandPath = grandChild.path.replace(child.path + '/', '');
            return {
              path: grandPath,
              fullPath: grandFullPath, // 保存完整路径
              name: grandChild.name,
              meta: grandChild.meta || { title: grandChild.name }
            };
          });

        return {
          path,
          fullPath, // 保存完整路径
          name: child.name,
          meta: child.meta || { title: child.name },
          children: grandChildren.length > 0 ? grandChildren : undefined
        };
      });

    return {
      path: route.path,
      name: route.name,
      meta: route.meta || { title: route.name },
      children: children.length > 0 ? children : undefined
    };
  }).filter(menu => {
    // 过滤掉没有标题或名称的菜单项
    if (!menu.meta?.title && !menu.name) {
      return false;
    }
    // 根路由只有在有子路由时才显示
    return menu.path !== '/' || (menu.children && menu.children.length > 0);
  });
  
  console.log('过滤后的菜单数据:', menuData);
  return menuData;
});

// 处理菜单点击事件
const handleMenuClick = (path: string) => {
  // 在移动设备上，点击菜单后自动折叠侧边栏
  if (isMobile.value) {
    // 通过事件通知父组件关闭菜单
    document.dispatchEvent(new CustomEvent('mobile-menu-click'));
  }
  
  // 检查路径是否已经是完整路径（以/开头）
  if (path.startsWith('/')) {
    console.log('使用完整路径导航:', path);
    if (path === route.path) {
      console.log('路径相同，强制刷新');
      router.replace({
        path: '/redirect' as any,
        query: { path: path, t: Date.now().toString() }
      }).then(() => {
        router.replace(path);
      }).catch((err) => {
        console.error('导航错误:', err);
        // 直接强制刷新页面
        window.location.href = path;
      });
    } else {
      router.push(path).catch((err) => {
        console.error('导航错误:', err);
        // 导航失败时尝试直接修改地址
        window.location.href = path;
      });
    }
    return;
  }
  
  // 如果是相对路径，需要构建完整路径
  // 处理二级菜单，例如 '/system' + '/' + 'role' 需要转换为 '/system/role'
  if (path.includes('/')) {
    // 这种情况通常是已经拼接好的路径，例如 'system/role'
    // 确保路径以/开头
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    console.log('转换后的路径:', path);
    
    if (path === route.path) {
      console.log('路径相同，强制刷新');
      router.replace({
        path: '/redirect' as any,
        query: { path: path, t: Date.now().toString() }
      }).then(() => {
        router.replace(path);
      }).catch((err) => {
        console.error('导航错误:', err);
        // 直接强制刷新页面
        window.location.href = path;
      });
    } else {
      router.push(path).catch((err) => {
        console.error('导航错误:', err);
        // 导航失败时尝试直接修改地址
        window.location.href = path;
      });
    }
    return;
  }
  
  // 处理一级菜单，例如 '/dashboard'
  console.log('处理一级菜单:', path);
  router.push(path).catch((err) => {
    console.error('导航错误:', err);
    // 导航失败时尝试直接修改地址
    window.location.href = path;
  });
};

// 自动展开当前路由对应的菜单
onMounted(() => {
  checkMobile();
  window.addEventListener('resize', handleResize);
  
  // 设置当前选中菜单
  selectedKeys.value = [route.path];
  
  const pathParts = route.path.split('/').filter(Boolean);
  if (pathParts.length > 1) {
    // 构建展开的路径数组
    const openKeyArray: string[] = [];
    let currentPath = '';

    for (let i = 0; i < pathParts.length - 1; i++) {
      currentPath += '/' + pathParts[i];
      openKeyArray.push(currentPath);
    }

    openKeys.value = openKeyArray;
  }
  
  // 特殊处理数据可视化路径
  if (route.path === '/dashboard') {
    selectedKeys.value = ['/dashboard'];
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style lang="scss" scoped>
.side-menu-container {
  height: calc(100% - 64px);
  background: var(--menu-bg-color);

  .menu-scrollable {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    border-right: none !important;
    background: transparent;

    // 优化滚动条样式
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
    }
  }
  
  // Element Plus菜单样式调整
  :deep(.el-menu) {
    border-right: none;
    background: transparent !important;
  }
  
  // 折叠状态下的菜单项样式
  :deep(.el-menu--collapse) {
    width: 64px;
    
    .el-sub-menu__title {
      padding: 0 20px !important;
    }
  }
  
  :deep(.el-sub-menu__title),
  :deep(.el-menu-item) {
    height: 50px;
    line-height: 50px;
    transition: all 0.3s;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.08) !important;
    }
  }
  
  :deep(.el-sub-menu.is-active) > .el-sub-menu__title {
    color: var(--sidebar-active-color) !important;
  }
  
  :deep(.el-menu-item.is-active) {
    background: rgba(100, 181, 246, 0.2) !important;
    color: var(--sidebar-active-color) !important;
    font-weight: 500;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 3px;
      height: 100%;
      background-color: var(--sidebar-active-color);
      transition: all 0.3s;
    }
  }

  // 菜单项图标样式优化
  :deep(.el-icon) {
    margin-right: 10px;
    font-size: 18px;
    vertical-align: middle;
  }
  
  // 菜单项文本样式优化
  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    span {
      font-size: 14px;
      transition: opacity 0.3s, margin 0.3s;
    }
  }

  // 移动端特殊样式
  @media (max-width: 768px) {
    :deep(.el-sub-menu__title),
    :deep(.el-menu-item) {
      height: 48px !important;
      line-height: 48px !important;
      padding-left: 16px !important;
      font-size: 14px !important;
    }
    
    :deep(.el-sub-menu__icon-arrow) {
      right: 12px !important;
    }
    
    :deep(.el-icon) {
      font-size: 18px !important;
    }
  }
}
</style>
