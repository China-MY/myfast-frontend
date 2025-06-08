<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" @click="handleAdd" size="small">新增菜单</el-button>
      <el-button type="success" @click="handleExpandAll" size="small">{{ isExpandAll ? '折叠' : '展开' }}全部</el-button>
      <el-button type="warning" @click="refreshList" size="small">刷新</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="menuList"
      row-key="menu_id"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      border
    >
      <el-table-column prop="menu_name" label="菜单名称" width="200"></el-table-column>
      <el-table-column prop="icon" label="图标" width="100">
        <template #default="scope">
          <svg-icon v-if="scope.row.icon" :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="order_num" label="排序" width="80"></el-table-column>
      <el-table-column prop="perms" label="权限标识" width="200"></el-table-column>
      <el-table-column prop="component" label="组件路径" width="200"></el-table-column>
      <el-table-column prop="path" label="路由地址" width="200"></el-table-column>
      <el-table-column prop="menu_type" label="类型" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.menu_type === 'M'" type="success">目录</el-tag>
          <el-tag v-else-if="scope.row.menu_type === 'C'" type="warning">菜单</el-tag>
          <el-tag v-else-if="scope.row.menu_type === 'F'" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">
            {{ scope.row.status === '0' ? '正常' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">
          <el-button size="small" type="text" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button 
            size="small" 
            type="text" 
            @click="handleAdd(scope.row)"
            v-if="scope.row.menu_type !== 'F'"
          >添加子菜单</el-button>
          <el-button 
            size="small" 
            type="text" 
            class="text-danger" 
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 菜单表单对话框 -->
    <el-dialog 
      :title="dialogTitle" 
      v-model="dialogVisible" 
      width="600px" 
      :close-on-click-modal="false"
    >
      <el-form 
        ref="menuForm" 
        :model="menuForm" 
        :rules="rules" 
        label-width="100px"
      >
        <el-form-item label="上级菜单" prop="parentId">
          <el-tree-select
            v-model="menuForm.parentId"
            :data="parentMenuOptions"
            :props="{ label: 'menu_name', value: 'menu_id' }"
            clearable
            placeholder="选择上级菜单"
          />
        </el-form-item>

        <el-form-item label="菜单类型" prop="menu_type">
          <el-radio-group v-model="menuForm.menu_type">
            <el-radio label="M">目录</el-radio>
            <el-radio label="C">菜单</el-radio>
            <el-radio label="F" v-show="menuForm.parentId">按钮</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="菜单名称" prop="menu_name">
          <el-input v-model="menuForm.menu_name" placeholder="请输入菜单名称" maxlength="50" />
        </el-form-item>

        <el-form-item label="菜单图标" prop="icon" v-if="menuForm.menu_type !== 'F'">
          <el-input v-model="menuForm.icon" placeholder="请选择图标">
            <template #append>
              <el-button @click="showIconSelector = true">选择</el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="排序" prop="order_num">
          <el-input-number v-model="menuForm.order_num" :min="0" :max="999" controls-position="right" />
        </el-form-item>

        <el-form-item label="路由地址" prop="path" v-if="menuForm.menu_type !== 'F'">
          <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
        </el-form-item>

        <el-form-item label="组件路径" prop="component" v-if="menuForm.menu_type === 'C'">
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>

        <el-form-item label="权限标识" prop="perms" v-if="menuForm.menu_type !== 'M'">
          <el-input v-model="menuForm.perms" placeholder="请输入权限标识" maxlength="100" />
        </el-form-item>

        <el-form-item label="显示状态" prop="visible">
          <el-radio-group v-model="menuForm.visible">
            <el-radio label="0">显示</el-radio>
            <el-radio label="1">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="菜单状态" prop="status">
          <el-radio-group v-model="menuForm.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  listMenusApiV1SystemMenuGet,
  createMenuApiV1SystemMenuPost,
  updateMenuApiV1SystemMenuMenuIdPut,
  deleteMenuApiV1SystemMenuMenuIdDelete,
  getMenuTreeApiV1SystemMenuTreeGet
} from '@/api/caidanguanli'

// 菜单列表数据
const loading = ref(false)
const menuList = ref<any[]>([])
const isExpandAll = ref(true)

// 表单相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const menuForm = reactive<any>({
  id: undefined,
  parentId: 0,
  menu_name: '',
  icon: '',
  path: '',
  component: '',
  perms: '',
  menu_type: 'M', // M=目录，C=菜单，F=按钮
  order_num: 0,
  status: '0', // 0=正常，1=停用
  visible: '0', // 0=显示，1=隐藏
})

// 表单验证规则
const rules = reactive({
  menu_name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
  menu_type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
})

// 父级菜单选项
const parentMenuOptions = ref<any[]>([])

const menuRef = ref()

// 图标选择器
const showIconSelector = ref(false)

// 计算属性
const isEdit = computed(() => {
  return menuForm.id !== undefined
})

// 菜单类型映射
const menuTypeMap = {
  'M': 1, // 目录
  'C': 2, // 菜单
  'F': 3  // 按钮
}

// 生命周期钩子
onMounted(() => {
  loadMenuList()
})

// 获取菜单列表
async function loadMenuList() {
  loading.value = true
  try {
    const response = await listMenusApiV1SystemMenuGet({})
    const res = response.data
    if (res && res.code === 0) {
      menuList.value = res.data || []
      loadParentMenuOptions()
    } else {
      ElMessage.error(res?.msg || '获取菜单列表失败')
    }
  } catch (error) {
    console.error('加载菜单列表出错:', error)
    ElMessage.error('加载菜单列表出错')
  } finally {
    loading.value = false
  }
}

// 加载父级菜单选项
async function loadParentMenuOptions() {
  try {
    const response = await getMenuTreeApiV1SystemMenuTreeGet()
    const res = response.data
    if (res && res.code === 0) {
      // 顶级菜单选项
      parentMenuOptions.value = [
        { menu_id: 0, menu_name: '顶级菜单', children: [] },
        ...(res.data || [])
      ]
    }
  } catch (error) {
    console.error('加载父级菜单选项出错:', error)
  }
}

// 刷新列表
function refreshList() {
  loadMenuList()
}

// 展开/折叠全部
function handleExpandAll() {
  isExpandAll.value = !isExpandAll.value
}

// 重置表单
function resetForm() {
  menuForm.id = undefined
  menuForm.parentId = 0
  menuForm.menu_name = ''
  menuForm.icon = ''
  menuForm.path = ''
  menuForm.component = ''
  menuForm.perms = ''
  menuForm.menu_type = 'M'
  menuForm.order_num = 0
  menuForm.status = '0'
  menuForm.visible = '0'
}

// 打开新增菜单对话框
function handleAdd(row?: any) {
  resetForm()
  if (row) {
    menuForm.parentId = row.menu_id
  }
  dialogTitle.value = '新增菜单'
  dialogVisible.value = true
}

// 打开编辑菜单对话框
function handleUpdate(row: any) {
  resetForm()
  Object.assign(menuForm, {
    id: row.menu_id,
    parentId: row.parent_id,
    menu_name: row.menu_name,
    icon: row.icon,
    path: row.path,
    component: row.component,
    perms: row.perms,
    menu_type: row.menu_type,
    order_num: row.order_num,
    status: row.status,
    visible: row.visible
  })
  dialogTitle.value = '修改菜单'
  dialogVisible.value = true
}

// 提交表单
async function submitForm() {
  try {
    if (isEdit.value) {
      // 更新菜单
      const response = await updateMenuApiV1SystemMenuMenuIdPut(
        { menu_id: menuForm.id },
        {
          menu_name: menuForm.menu_name,
          parent_id: menuForm.parentId,
          order_num: menuForm.order_num,
          path: menuForm.path,
          component: menuForm.component,
          menu_type: menuForm.menu_type,
          visible: menuForm.visible,
          status: menuForm.status,
          perms: menuForm.perms,
          icon: menuForm.icon
        }
      )
      
      const res = response.data
      if (res && res.code === 0) {
        ElMessage.success('修改成功')
        dialogVisible.value = false
        loadMenuList()
      } else {
        ElMessage.error(res?.msg || '修改失败')
      }
    } else {
      // 新增菜单
      const response = await createMenuApiV1SystemMenuPost({
        menu_name: menuForm.menu_name,
        parent_id: menuForm.parentId,
        order_num: menuForm.order_num,
        path: menuForm.path,
        component: menuForm.component,
        menu_type: menuForm.menu_type,
        visible: menuForm.visible,
        status: menuForm.status,
        perms: menuForm.perms,
        icon: menuForm.icon
      })
      
      const res = response.data
      if (res && res.code === 0) {
        ElMessage.success('新增成功')
        dialogVisible.value = false
        loadMenuList()
      } else {
        ElMessage.error(res?.msg || '新增失败')
      }
    }
  } catch (error) {
    console.error('提交表单出错:', error)
    ElMessage.error('操作失败，请重试')
  }
}

// 删除菜单
function handleDelete(row: any) {
  ElMessageBox.confirm(
    `确定要删除【${row.menu_name}】菜单吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const response = await deleteMenuApiV1SystemMenuMenuIdDelete({ menu_id: row.menu_id })
      const res = response.data
      if (res && res.code === 0) {
        ElMessage.success('删除成功')
        loadMenuList()
      } else {
        ElMessage.error(res?.msg || '删除失败')
      }
    } catch (error) {
      console.error('删除菜单出错:', error)
      ElMessage.error('删除失败，请重试')
    }
  }).catch(() => {})
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.filter-container {
  margin-bottom: 20px;
}

.text-danger {
  color: #F56C6C;
}
</style> 