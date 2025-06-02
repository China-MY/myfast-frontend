<template>
  <div class="side-menu-container">
    <a-menu
      v-model:selectedKeys="selectedKeys"
      v-model:openKeys="openKeys"
      mode="inline"
      theme="dark"
      :inline-collapsed="collapsed"
    >
      <template v-for="menu in menuList" :key="menu.path">
        <!-- 有子菜单 -->
        <template v-if="menu.children && menu.children.length > 0">
          <a-sub-menu :key="menu.path">
            <template #title>
              <span>
                <component :is="iconComponents[menu.meta?.icon] || iconComponents.AppstoreOutlined" />
                <span>{{ menu.meta?.title }}</span>
              </span>
            </template>
            <!-- 递归渲染子菜单项 -->
            <template v-for="subMenu in menu.children" :key="subMenu.path">
              <!-- 第二级菜单还有子菜单 -->
              <template v-if="subMenu.children && subMenu.children.length > 0">
                <a-sub-menu :key="menu.path + '/' + subMenu.path">
                  <template #title>
                    <span>
                      <component :is="iconComponents[subMenu.meta?.icon] || iconComponents.BarsOutlined" />
                      <span>{{ subMenu.meta?.title }}</span>
                    </span>
                  </template>
                  <a-menu-item
                    v-for="item in subMenu.children"
                    :key="menu.path + '/' + subMenu.path + '/' + item.path"
                    @click="handleMenuClick(menu.path + '/' + subMenu.path + '/' + item.path)"
                  >
                    <component :is="iconComponents[item.meta?.icon] || iconComponents.BarsOutlined" />
                    <span>{{ item.meta?.title }}</span>
                  </a-menu-item>
                </a-sub-menu>
              </template>
              <!-- 第二级菜单没有子菜单 -->
              <template v-else>
                <a-menu-item
                  :key="menu.path + '/' + subMenu.path"
                  @click="handleMenuClick(menu.path + '/' + subMenu.path)"
                >
                  <component :is="iconComponents[subMenu.meta?.icon] || iconComponents.BarsOutlined" />
                  <span>{{ subMenu.meta?.title }}</span>
                </a-menu-item>
              </template>
            </template>
          </a-sub-menu>
        </template>
        <!-- 无子菜单 -->
        <template v-else>
          <a-menu-item :key="menu.path" @click="handleMenuClick(menu.path)">
            <component :is="iconComponents[menu.meta?.icon] || iconComponents.BarsOutlined" />
            <span>{{ menu.meta?.title }}</span>
          </a-menu-item>
        </template>
      </template>
    </a-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';
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
  EditOutlined
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
  DictOutlined: EditOutlined // 使用EditOutlined作为字典图标
};

// 接收父组件传递的collapsed属性
const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
});

const route = useRoute();
const router = useRouter();

// 当前选中的菜单项
const selectedKeys = ref<string[]>([]);
// 当前展开的子菜单
const openKeys = ref<string[]>([]);

// 监听路由变化更新菜单选中状态
watch(() => route.path, (path) => {
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
      return true;
    });

  // 构建菜单树
  const rootRoutes = routes.filter(route => route.path === '/' || route.path.split('/').length === 2);

  // 处理根路由
  const menuData = rootRoutes.map(route => {
    // 查找子路由
    const children = routes
      .filter(r => {
        // 查找直接子路由
        const isDirectChild = r.path.startsWith(route.path + '/') &&
                              r.path.split('/').length === route.path.split('/').length + 1;
        return isDirectChild;
      })
      .map(child => {
        const path = child.path.replace(route.path + '/', '');

        // 查找第三级路由
        const grandChildren = routes
          .filter(r => {
            // 查找当前子路由的子路由
            const isGrandChild = r.path.startsWith(child.path + '/') &&
                                r.path.split('/').length === child.path.split('/').length + 1;
            return isGrandChild;
          })
          .map(grandChild => {
            const grandPath = grandChild.path.replace(child.path + '/', '');
            return {
              path: grandPath,
              name: grandChild.name,
              meta: grandChild.meta || { title: grandChild.name }
            };
          });

        return {
          path,
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
  }).filter(menu => menu.path !== '/' || (menu.children && menu.children.length > 0));

  return menuData;
});

// 处理菜单点击事件
const handleMenuClick = (path: string) => {
  router.push(path);
};

// 自动展开当前路由对应的菜单
onMounted(() => {
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
});
</script>

<style lang="less" scoped>
.side-menu-container {
  height: calc(100vh - 64px);
  overflow-y: auto;
  overflow-x: hidden;

  :deep(.ant-menu) {
    border-right: none;
  }

  :deep(.ant-menu-submenu-title) {
    display: flex;
    align-items: center;
  }

  :deep(.ant-menu-item) {
    display: flex;
    align-items: center;

    .anticon {
      font-size: 16px;
      margin-right: 10px;
    }
  }

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
</style>
