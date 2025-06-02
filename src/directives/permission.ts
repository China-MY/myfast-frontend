import { DirectiveBinding } from 'vue';
import { useUserStore } from '@/stores/modules/user';

/**
 * 按钮权限指令
 * v-permission="['system:user:add']"
 */
export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;
    const userStore = useUserStore();

    if (value && value instanceof Array && value.length > 0) {
      const hasPermission = userStore.permissions.some(permission => {
        return value.includes(permission);
      });

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error('使用方式：v-permission="[\'system:user:add\']"');
    }
  }
};
