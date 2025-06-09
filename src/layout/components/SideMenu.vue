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
        <template v-if="menu.menu_name || menu.title || menu.meta?.title">
          <!-- 有子菜单 -->
          <template v-if="menu.children && menu.children.length > 0">
            <el-sub-menu :index="menu.path">
              <template #title>
                <el-icon><component :is="getIconComponent(menu.icon || menu.meta?.icon, menu.path)" /></el-icon>
                <span v-if="!collapsed">{{ menu.meta?.title || menu.menu_name || menu.title }}</span>
              </template>
              <!-- 递归渲染子菜单项 -->
              <template v-for="subMenu in menu.children" :key="subMenu.path">
                <!-- 第二级菜单还有子菜单 -->
                <template v-if="subMenu.children && subMenu.children.length > 0">
                  <el-sub-menu :index="getFullPath(menu.path, subMenu.path)">
                    <template #title>
                      <el-icon><component :is="getIconComponent(subMenu.icon || subMenu.meta?.icon, subMenu.path)" /></el-icon>
                      <span v-if="!collapsed">{{ subMenu.meta?.title || subMenu.menu_name || subMenu.title }}</span>
                    </template>
                    <el-menu-item
                      v-for="item in subMenu.children"
                      :key="getFullPath(menu.path, subMenu.path, item.path)"
                      :index="getFullPath(menu.path, subMenu.path, item.path)"
                      @click="handleMenuClick(getFullPath(menu.path, subMenu.path, item.path))"
                    >
                      <el-icon><component :is="getIconComponent(item.icon || item.meta?.icon, item.path)" /></el-icon>
                      <span v-if="!collapsed">{{ item.meta?.title || item.menu_name || item.title }}</span>
                    </el-menu-item>
                  </el-sub-menu>
                </template>
                <!-- 第二级菜单没有子菜单 -->
                <template v-else>
                  <el-menu-item
                    :index="getFullPath(menu.path, subMenu.path)"
                    @click="handleMenuClick(getFullPath(menu.path, subMenu.path))"
                  >
                    <el-icon><component :is="getIconComponent(subMenu.icon || subMenu.meta?.icon, subMenu.path)" /></el-icon>
                    <span v-if="!collapsed">{{ subMenu.meta?.title || subMenu.menu_name || subMenu.title }}</span>
                  </el-menu-item>
                </template>
              </template>
            </el-sub-menu>
          </template>
          <!-- 无子菜单 -->
          <template v-else>
            <el-menu-item :index="menu.path" @click="handleMenuClick(menu.path)">
              <el-icon><component :is="getIconComponent(menu.icon || menu.meta?.icon, menu.path)" /></el-icon>
              <span v-if="!collapsed">{{ menu.meta?.title || menu.menu_name || menu.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAppStore } from '../../stores/modules/app';
import { getUserMenusApiV1SystemMenuUserGet } from '@/api/caidanguanli';
import { menuState } from '@/router';
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
  
  // 特殊处理仪表盘路径
  if (path === '/' || path === '/index') {
    selectedKeys.value = ['/index'];
    return;
  }
  
  // 处理重定向路径，不改变选中状态
  if (path.startsWith('/redirect')) {
    return;
  }
  
  // 更新选中的菜单项
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
    console.log('展开菜单:', openKeyArray);
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

// 菜单数据
const menuList = ref<any[]>([]);
// 使用路由模块中的全局菜单加载状态
const menuLoaded = computed(() => menuState.menuLoaded);

// 获取菜单数据
const fetchMenuData = async () => {
  // 如果菜单已经加载过，直接使用全局菜单数据
  if (menuState.menuLoaded && menuState.menuData) {
    console.log('使用全局菜单数据');
    menuList.value = menuState.menuData;
    // 打印菜单结构，用于调试
    console.log('菜单数据结构:', JSON.stringify(menuList.value.slice(0, 2), null, 2));
    return;
  }

  // 如果有正在进行的菜单加载请求，等待其完成
  if (menuState.loadingPromise) {
    console.log('等待已有菜单加载请求完成');
    await menuState.loadingPromise;
    if (menuState.menuData) {
      menuList.value = menuState.menuData;
      // 打印菜单结构，用于调试
      console.log('菜单数据结构:', JSON.stringify(menuList.value.slice(0, 2), null, 2));
    }
    return;
  }

  try {
    // 创建新的菜单加载请求
    const requestPromise = getUserMenusApiV1SystemMenuUserGet();
    menuState.loadingPromise = requestPromise as unknown as Promise<any>;
    const res = await requestPromise;
    
    console.log('SideMenu获取菜单响应:', res);
    
    if (res?.data?.code === 200 && res.data.data && Array.isArray(res.data.data)) {
      menuList.value = res.data.data;
      menuState.menuData = res.data.data;
      menuState.menuLoaded = true;
      console.log('从后端获取的菜单数据:', res.data.data);
      // 打印菜单结构，用于调试
      console.log('菜单数据结构:', JSON.stringify(res.data.data.slice(0, 2), null, 2));
    } else if (res?.data && Array.isArray(res.data)) {
      // 兼容直接返回数组的情况
      menuList.value = res.data;
      menuState.menuData = res.data;
      menuState.menuLoaded = true;
      console.log('从后端获取的菜单数据(直接数组):', res.data);
      // 打印菜单结构，用于调试
      console.log('菜单数据结构:', JSON.stringify(res.data.slice(0, 2), null, 2));
    } else {
      console.error('获取菜单数据失败:', res);
    }
  } catch (error) {
    console.error('获取菜单出错:', error);
  } finally {
    menuState.loadingPromise = null;
  }
};

// 菜单点击处理
const handleMenuClick = (path: string) => {
  console.log('菜单点击原始路径:', path);
  
  // 如果路径包含http或https，表示外链
  if (path.startsWith('http://') || path.startsWith('https://')) {
    window.open(path, '_blank');
    return;
  }
  
  // 规范化路径，处理特殊情况
  let normalizedPath = path;
  
  // 特殊处理系统管理菜单项路径
  if (path.includes('/system/')) {
    const pathParts = path.split('/').filter(Boolean);
    // 提取最后一级路径，如user、role等
    if (pathParts.length >= 2) {
      const lastPart = pathParts[pathParts.length - 1];
      console.log('系统管理菜单项:', lastPart);
      // 特殊处理常见菜单项
      if (['user', 'role', 'menu', 'dept', 'post', 'dict', 'config'].includes(lastPart)) {
        normalizedPath = `/system/${lastPart}`;
      }
    }
  }
  
  // 处理监控菜单项路径
  if (path.includes('/monitor/')) {
    const pathParts = path.split('/').filter(Boolean);
    if (pathParts.length >= 2) {
      const lastPart = pathParts[pathParts.length - 1];
      console.log('监控菜单项:', lastPart);
      if (['online', 'job', 'data', 'server', 'cache'].includes(lastPart)) {
        normalizedPath = `/monitor/${lastPart}`;
      }
    }
  }
  
  // 处理工具菜单项路径
  if (path.includes('/tool/')) {
    const pathParts = path.split('/').filter(Boolean);
    if (pathParts.length >= 2) {
      const lastPart = pathParts[pathParts.length - 1];
      console.log('工具菜单项:', lastPart);
      if (['gen', 'swagger', 'build'].includes(lastPart)) {
        normalizedPath = `/tool/${lastPart}`;
      }
    }
  }
  
  console.log('菜单点击最终路径:', normalizedPath);
  
  // 正常导航
  if (normalizedPath) {
    // 如果路径相同，使用redirect进行刷新
    if (normalizedPath === route.path) {
      router.replace({
        path: `/redirect${normalizedPath}`,
        query: { t: Date.now() }
      });
    } else {
      // 否则正常导航
      router.push(normalizedPath);
    }
  }
};

// 初始化时获取菜单数据
const initMenus = async () => {
  // 获取菜单数据
  await fetchMenuData();
  
  // 标记初始化完成
  initialized.value = true;
};

// 使用ref标记初始化状态
const initialized = ref(false);

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
  
  // 获取菜单数据
  initMenus();
  
  // 注册自定义事件处理auth/info轮询控制
  const stopPolling = () => {
    console.log('停止不必要的auth/info轮询');
    // 创建自定义事件通知停止轮询
    const event = new CustomEvent('stop-auth-polling');
    document.dispatchEvent(event);
  };
  
  // 5秒后尝试停止轮询
  setTimeout(stopPolling, 5000);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

// 处理路径拼接问题
const getFullPath = (parentPath: string, childPath: string, grandchildPath?: string): string => {
  console.log('拼接路径:', parentPath, childPath, grandchildPath || '');
  
  // 如果子路径本身就是完整路径，直接返回
  if (childPath.startsWith('/')) {
    if (grandchildPath) {
      return childPath + (grandchildPath.startsWith('/') ? grandchildPath : `/${grandchildPath}`);
    }
    return childPath;
  }
  
  // 规范化父路径，确保以/结尾
  let normalizedParent = parentPath;
  if (!normalizedParent.startsWith('/')) {
    normalizedParent = '/' + normalizedParent;
  }
  if (!normalizedParent.endsWith('/')) {
    normalizedParent = normalizedParent + '/';
  }
  
  // 规范化子路径，去掉开头的/
  const normalizedChild = childPath.startsWith('/') ? childPath.substring(1) : childPath;
  
  // 如果有孙子路径，继续拼接
  if (grandchildPath) {
    const normalizedGrandchild = grandchildPath.startsWith('/') ? grandchildPath.substring(1) : grandchildPath;
    const result = `${normalizedParent}${normalizedChild}/${normalizedGrandchild}`;
    console.log('拼接完成路径:', result);
    return result;
  }
  
  const result = `${normalizedParent}${normalizedChild}`;
  console.log('拼接完成路径:', result);
  return result;
};
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
