<template>
  <div class="side-menu-container">
    <a-menu
      v-model:selectedKeys="selectedKeys"
      v-model:openKeys="openKeys"
      mode="inline"
      :theme="theme"
      :inline-collapsed="collapsed"
      :class="{ 'menu-scrollable': true }"
    >
      <template v-for="menu in menuList" :key="menu.path">
        <!-- 只有有标题的菜单项才显示 -->
        <template v-if="menu.meta && menu.meta.title">
          <!-- 有子菜单 -->
          <template v-if="menu.children && menu.children.length > 0">
            <a-sub-menu :key="menu.path">
              <template #icon>
                <component :is="getIconComponent(menu.meta?.icon, menu.path)" />
              </template>
              <template #title>
                <span>{{ menu.meta?.title }}</span>
              </template>
              <!-- 递归渲染子菜单项 -->
              <template v-for="subMenu in menu.children" :key="subMenu.path">
                <!-- 第二级菜单还有子菜单 -->
                <template v-if="subMenu.children && subMenu.children.length > 0">
                  <a-sub-menu :key="menu.path + '/' + subMenu.path">
                    <template #icon>
                      <component :is="getIconComponent(subMenu.meta?.icon, subMenu.path)" />
                    </template>
                    <template #title>
                      <span>{{ subMenu.meta?.title }}</span>
                    </template>
                    <a-menu-item
                      v-for="item in subMenu.children"
                      :key="menu.path + '/' + subMenu.path + '/' + item.path"
                      @click="handleMenuClick(item.fullPath || (menu.path + '/' + subMenu.path + '/' + item.path))"
                    >
                      <template #icon>
                        <component :is="getIconComponent(item.meta?.icon, item.path)" />
                      </template>
                      <span>{{ item.meta?.title }}</span>
                    </a-menu-item>
                  </a-sub-menu>
                </template>
                <!-- 第二级菜单没有子菜单 -->
                <template v-else>
                  <a-menu-item
                    :key="subMenu.fullPath || (menu.path + '/' + subMenu.path)"
                    @click="handleMenuClick(subMenu.fullPath || (menu.path + '/' + subMenu.path))"
                  >
                    <template #icon>
                      <component :is="getIconComponent(subMenu.meta?.icon, subMenu.path)" />
                    </template>
                    <span>{{ subMenu.meta?.title }}</span>
                  </a-menu-item>
                </template>
              </template>
            </a-sub-menu>
          </template>
          <!-- 无子菜单 -->
          <template v-else>
            <a-menu-item :key="menu.path" @click="handleMenuClick(menu.path)">
              <template #icon>
                <component :is="getIconComponent(menu.meta?.icon, menu.path)" />
              </template>
              <span>{{ menu.meta?.title }}</span>
            </a-menu-item>
          </template>
        </template>
      </template>
    </a-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  MenuOutlined,
  BarsOutlined,
  AppstoreOutlined,
  SettingOutlined,
  MonitorOutlined,
  CloudServerOutlined,
  ApiOutlined,
  CodeOutlined,
  FormOutlined,
  IdcardOutlined,
  FontSizeOutlined,
  ToolOutlined,
  DatabaseOutlined,
  DesktopOutlined,
  FieldTimeOutlined,
  KeyOutlined,
  LineChartOutlined,
  ClockCircleOutlined,
  UserSwitchOutlined,
  ControlOutlined,
  EditOutlined,
  FileOutlined,
  FolderOutlined,
  ProfileOutlined
} from '@ant-design/icons-vue';

// 图标组件映射
const iconComponents: Record<string, any> = {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  MenuOutlined,
  BarsOutlined,
  AppstoreOutlined,
  SettingOutlined,
  MonitorOutlined,
  CloudServerOutlined,
  ApiOutlined,
  CodeOutlined,
  FormOutlined,
  IdcardOutlined,
  FontSizeOutlined,
  ToolOutlined,
  DatabaseOutlined,
  DesktopOutlined,
  FieldTimeOutlined,
  KeyOutlined,
  LineChartOutlined,
  ClockCircleOutlined,
  UserSwitchOutlined,
  ControlOutlined,
  EditOutlined,
  FileOutlined,
  FolderOutlined,
  ProfileOutlined
};

// 安全获取图标组件
const getIconComponent = (iconName: unknown, path?: string): any => {
  // 优先使用meta中定义的图标
  if (iconName && typeof iconName === 'string' && iconName in iconComponents) {
    return iconComponents[iconName as keyof typeof iconComponents];
  }
  
  // 为特定路径提供默认图标
  if (path === '/dashboard' || path === 'dashboard') {
    return iconComponents.LineChartOutlined; // 数据可视化图标
  } else if (path === 'user' || path?.includes('user')) {
    return iconComponents.UserOutlined;
  } else if (path === 'role' || path?.includes('role')) {
    return iconComponents.SafetyCertificateOutlined;
  } else if (path === 'menu' || path?.includes('menu')) {
    return iconComponents.MenuOutlined;
  } else if (path === 'dept' || path?.includes('dept')) {
    return iconComponents.TeamOutlined;
  } else if (path === 'post' || path?.includes('post')) {
    return iconComponents.IdcardOutlined;
  } else if (path === 'dict' || path?.includes('dict')) {
    return iconComponents.FontSizeOutlined;
  } else if (path === 'config' || path?.includes('config')) {
    return iconComponents.ControlOutlined;
  } else if (path === 'online' || path?.includes('online')) {
    return iconComponents.UserSwitchOutlined;
  } else if (path === 'server' || path?.includes('server')) {
    return iconComponents.CloudServerOutlined;
  } else if (path === 'cache' || path?.includes('cache')) {
    return iconComponents.DatabaseOutlined;
  } else if (path === 'job' || path?.includes('job')) {
    return iconComponents.ClockCircleOutlined;
  } else if (path === 'data' || path?.includes('data')) {
    return iconComponents.LineChartOutlined;
  } else if (path === 'gen' || path?.includes('gen')) {
    return iconComponents.CodeOutlined;
  } else if (path === 'swagger' || path?.includes('swagger')) {
    return iconComponents.ApiOutlined;
  } else if (path === 'form' || path?.includes('form')) {
    return iconComponents.FormOutlined;
  } else if (path === '/system' || path === 'system') {
    return iconComponents.SettingOutlined;
  } else if (path === '/monitor' || path === 'monitor') {
    return iconComponents.MonitorOutlined;
  } else if (path === '/tool' || path === 'tool') {
    return iconComponents.ToolOutlined;
  }
  
  // 默认图标
  return iconComponents.AppstoreOutlined;
};

// 接收父组件传递的属性
const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  },
  theme: {
    type: String,
    default: 'dark'
  }
});

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
    const openKeyArray = [];
    let currentPath = '';

    for (let i = 0; i < pathParts.length - 1; i++) {
      currentPath += '/' + pathParts[i];
      openKeyArray.push(currentPath);
    }

    openKeys.value = openKeyArray;
  }
}, { immediate: true });

// 监听折叠状态变化
watch(() => props.collapsed, (newVal) => {
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
      const openKeyArray = [];
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
  console.log('菜单点击路径:', path, '当前路由:', route.path);
  
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
    const openKeyArray = [];
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

<style lang="less" scoped>
.side-menu-container {
  height: calc(100% - 64px);

  .menu-scrollable {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;

  // 优化滚动条样式
    &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.05);
    }
  }

  // 折叠状态下的菜单项
  :deep(.ant-menu-inline-collapsed) {
    .ant-menu-item {
      padding: 0 !important;
      display: flex;
      justify-content: center;
      
      .ant-menu-title-content {
        opacity: 0;
        transition: opacity 0.2s;
      }
    }
    
    .ant-menu-submenu-title {
      padding: 0 !important;
      display: flex;
      justify-content: center;
      
      .ant-menu-title-content {
        opacity: 0;
        transition: opacity 0.2s;
      }
    }
  }

  // 移动端特殊样式
  @media (max-width: 768px) {
    .ant-menu-item, .ant-menu-submenu-title {
      height: 48px !important;
      line-height: 48px !important;
      padding-left: 16px !important;
      font-size: 14px !important;
    }
    
    :deep(.ant-menu-submenu-arrow) {
      right: 12px !important;
    }
    
    :deep(.ant-menu-item-icon) {
      font-size: 18px !important;
    }
  }
}
</style>
