import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getDeptOptionsApiV1SystemDeptSelectOptionsGet } from '@/api/bumenguanli'
import { getRoleOptionsApiV1SystemRoleSelectOptionsGet } from '@/api/jiaoseguanli'

/**
 * 获取系统数据（部门和角色）的Hook
 */
export function useSystemData() {
  // 部门树数据
  const deptOptions = ref<any[]>([]);
  // 角色列表数据
  const roleOptions = ref<any[]>([]);
  // 加载状态
  const loading = ref(false);

  /**
   * 获取部门树形数据
   */
  const getDeptOptions = async () => {
    try {
      loading.value = true;
      const res = await getDeptOptionsApiV1SystemDeptSelectOptionsGet();
      if (res.data && res.data.code === 200 && res.data.data) {
        // 将后端返回的树形结构转换为TreeSelect组件需要的格式
        deptOptions.value = formatDeptTreeData(res.data.data);
      } else {
        ElMessage.error(res.data?.msg || '获取部门数据失败');
      }
    } catch (error) {
      // console.error('获取部门数据出错', error);
      ElMessage.error('获取部门数据失败');
    } finally {
      loading.value = false;
    }
  };

  /**
   * 获取角色选项数据
   */
  const getRoleOptions = async () => {
    try {
      loading.value = true;
      const res = await getRoleOptionsApiV1SystemRoleSelectOptionsGet();
      if (res.data && res.data.code === 200 && res.data.data) {
        roleOptions.value = res.data.data;
      } else {
        ElMessage.error(res.data?.msg || '获取角色数据失败');
      }
    } catch (error) {
      // console.error('获取角色数据出错', error);
      ElMessage.error('获取角色数据失败');
    } finally {
      loading.value = false;
    }
  };

  /**
   * 格式化部门树数据
   * @param data 原始部门树数据
   * @returns 处理后符合TreeSelect格式的树形数据
   */
  const formatDeptTreeData = (data: any[]): any[] => {
    return data.map(item => {
      const node: {
        id: any;
        pId: any;
        value: any;
        title: any;
        isLeaf: boolean;
        selectable: boolean;
        children?: any[];
      } = {
        id: item.dept_id,
        pId: item.parent_id || 0,
        value: item.dept_id,
        title: item.dept_name,
        isLeaf: !item.children || !item.children.length,
        selectable: true,
      };

      if (item.children && item.children.length > 0) {
        node.children = formatDeptTreeData(item.children);
      }

      return node;
    });
  };

  /**
   * 加载所有系统数据
   */
  const loadAllData = async () => {
    await Promise.all([getDeptOptions(), getRoleOptions()]);
  };

  // 组件挂载时自动加载数据
  onMounted(() => {
    loadAllData();
  });

  return {
    deptOptions,
    roleOptions,
    loading,
    getDeptOptions,
    getRoleOptions,
    loadAllData
  };
} 