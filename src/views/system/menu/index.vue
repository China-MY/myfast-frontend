<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="queryParams.menu_name"
        placeholder="菜单名称"
        clearable
        class="filter-item"
        style="width: 200px;"
        @keyup.enter="handleQuery"
      />
      <el-select v-model="queryParams.status" placeholder="菜单状态" clearable style="width: 120px" class="filter-item">
        <el-option label="正常" value="0" />
        <el-option label="停用" value="1" />
      </el-select>
      <el-button type="primary" class="filter-item" @click="handleQuery">
        查询
      </el-button>
      <el-button type="success" class="filter-item" @click="handleAdd(null)">
        新增
      </el-button>
      <el-button type="warning" class="filter-item" @click="handleExpandAll">
        {{ isExpandAll ? '折叠' : '展开' }}
      </el-button>
    </div>

    <!-- 菜单表格 -->
    <el-table
      ref="menuTableRef"
      v-loading="loading"
      :data="menuList"
      row-key="menu_id"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      border
    >
      <el-table-column prop="menu_name" label="菜单名称" :show-overflow-tooltip="true" width="180" />
      <el-table-column prop="icon" label="图标" align="center" width="60" />
      <el-table-column prop="order_num" label="排序" align="center" width="60" />
      <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true" width="180" />
      <el-table-column prop="path" label="路由地址" :show-overflow-tooltip="true" />
      <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true" />
      <el-table-column label="类型" align="center" width="80">
        <template #default="scope">
          <el-tag v-if="scope.row.menu_type === 'M'" type="success">目录</el-tag>
          <el-tag v-else-if="scope.row.menu_type === 'C'" type="primary">菜单</el-tag>
          <el-tag v-else-if="scope.row.menu_type === 'F'" type="warning">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="可见" align="center" width="80">
        <template #default="scope">
          <el-tag v-if="scope.row.visible === '0'" type="success">显示</el-tag>
          <el-tag v-else type="info">隐藏</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80">
        <template #default="scope">
          <el-tag v-if="scope.row.status === '0'" type="success">正常</el-tag>
          <el-tag v-else type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <el-button type="text" @click="handleAdd(scope.row)" v-if="scope.row.menu_type !== 'F'">新增</el-button>
          <el-button type="text" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="text" style="color: #f56c6c;" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑菜单对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      append-to-body
    >
      <el-form
        ref="menuFormRef"
        :model="menuForm"
        :rules="menuRules"
        label-width="100px"
      >
        <el-form-item label="上级菜单">
          <TreeSelect
            v-model="menuForm.parent_id"
            :options="parentMenuOptions"
            :allow-clear="true"
            placeholder="选择上级菜单"
          />
        </el-form-item>
        <el-form-item label="菜单类型" prop="menu_type">
          <el-radio-group v-model="menuForm.menu_type" @change="handleMenuTypeChange">
            <el-radio label="M">目录</el-radio>
            <el-radio label="C">菜单</el-radio>
            <el-radio label="F">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menu_name">
          <el-input v-model="menuForm.menu_name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="显示排序" prop="order_num">
          <el-input-number v-model="menuForm.order_num" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="图标" prop="icon" v-if="menuForm.menu_type !== 'F'">
          <el-input v-model="menuForm.icon" placeholder="请输入图标" />
        </el-form-item>
        <el-form-item label="路由地址" prop="path" v-if="menuForm.menu_type !== 'F'">
          <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component" v-if="menuForm.menu_type === 'C'">
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="权限标识" prop="perms" v-if="menuForm.menu_type !== 'M'">
          <el-input v-model="menuForm.perms" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item label="显示状态" prop="visible" v-if="menuForm.menu_type !== 'F'">
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
        <el-form-item label="是否外链" prop="is_frame" v-if="menuForm.menu_type !== 'F'">
          <el-radio-group v-model="menuForm.is_frame">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="路由参数" prop="query" v-if="menuForm.menu_type === 'C'">
          <el-input v-model="menuForm.query" placeholder="请输入路由参数" />
        </el-form-item>
        <el-form-item label="是否缓存" prop="is_cache" v-if="menuForm.menu_type === 'C'">
          <el-radio-group v-model="menuForm.is_cache">
            <el-radio :label="0">缓存</el-radio>
            <el-radio :label="1">不缓存</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  listMenusApiV1SystemMenuGet,
  createMenuApiV1SystemMenuPost,
  updateMenuApiV1SystemMenuMenuIdPut,
  deleteMenuApiV1SystemMenuMenuIdDelete,
  getMenuApiV1SystemMenuMenuIdGet,
  getMenuTreeApiV1SystemMenuTreeGet
} from '@/api/caidanguanli'
import TreeSelect from '@/components/TreeSelect/index.vue'

// 菜单列表
const menuList = ref<any[]>([])
const loading = ref(false)
const isExpandAll = ref(true)
const menuTableRef = ref() // 表格引用

// 查询参数
const queryParams = reactive({
  menu_name: '',
  status: ''
})

// 表单参数
const menuFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const menuForm = reactive({
  menu_id: undefined as number | undefined,
  menu_name: '',
  parent_id: 0,
  order_num: 0,
  path: '',
  component: '',
  query: '',
  is_frame: 1,
  is_cache: 0,
  menu_type: 'M',
  visible: '0',
  status: '0',
  perms: '',
  icon: '',
  remark: ''
})

// 父级菜单选项
const parentMenuOptions = ref<any[]>([])

// 表单验证规则
const menuRules = reactive<FormRules>({
  menu_name: [
    { required: true, message: '菜单名称不能为空', trigger: 'blur' }
  ],
  order_num: [
    { required: true, message: '菜单顺序不能为空', trigger: 'blur' }
  ],
  path: [
    { required: true, message: '路由地址不能为空', trigger: 'blur' }
  ],
  menu_type: [
    { required: true, message: '菜单类型不能为空', trigger: 'change' }
  ]
})

// 初始化
onMounted(() => {
  getList()
})

// 获取菜单列表
const getList = async () => {
  loading.value = true
  try {
    const response = await listMenusApiV1SystemMenuGet({
      menu_name: queryParams.menu_name,
      status: queryParams.status
    })
    
    if (response.data && response.data.code === 200) {
      // 处理后端返回的菜单数据，构建树形结构
      if (response.data.data) {
        menuList.value = handleTree(response.data.data)
        
        // 根据isExpandAll状态设置初始展开/折叠
        setTimeout(() => {
          if (menuTableRef.value && isExpandAll.value) {
            menuList.value.forEach(row => {
              menuTableRef.value.toggleRowExpansion(row, true)
              if (row.children && row.children.length > 0) {
                expandChildren(row.children, true)
              }
            })
          }
        }, 100)
      } else {
        menuList.value = []
      }
      // 生成父级菜单选项
      getParentMenuOptions()
    } else {
      ElMessage.error(response.data?.msg || '获取菜单列表失败')
    }
  } catch (error) {
    console.error('获取菜单列表失败:', error)
    ElMessage.error('获取菜单列表失败')
  } finally {
    loading.value = false
  }
}

// 查询按钮操作
const handleQuery = () => {
  getList()
}

// 展开/折叠操作
const handleExpandAll = () => {
  isExpandAll.value = !isExpandAll.value
  
  // 使用表格实例方法控制展开折叠
  if (menuTableRef.value) {
    if (isExpandAll.value) {
      // 展开所有行
      menuList.value.forEach(row => {
        menuTableRef.value.toggleRowExpansion(row, true)
        if (row.children && row.children.length > 0) {
          expandChildren(row.children, true)
        }
      })
    } else {
      // 折叠所有行
      menuList.value.forEach(row => {
        menuTableRef.value.toggleRowExpansion(row, false)
        if (row.children && row.children.length > 0) {
          expandChildren(row.children, false)
        }
      })
    }
  }
}

// 递归处理子节点的展开/折叠
const expandChildren = (children: any[], isExpand: boolean) => {
  if (!menuTableRef.value) return
  
  children.forEach(child => {
    menuTableRef.value.toggleRowExpansion(child, isExpand)
    if (child.children && child.children.length > 0) {
      expandChildren(child.children, isExpand)
    }
  })
}

// 重置表单
const resetForm = () => {
  if (menuFormRef.value) {
    menuFormRef.value.resetFields()
  }
  menuForm.menu_id = undefined
  menuForm.menu_name = ''
  menuForm.parent_id = 0
  menuForm.order_num = 0
  menuForm.path = ''
  menuForm.component = ''
  menuForm.query = ''
  menuForm.is_frame = 1
  menuForm.is_cache = 0
  menuForm.menu_type = 'M'
  menuForm.visible = '0'
  menuForm.status = '0'
  menuForm.perms = ''
  menuForm.icon = ''
  menuForm.remark = ''
}

// 添加菜单
const handleAdd = (row: any | null) => {
  resetForm()
  if (row && row.menu_id) {
    menuForm.parent_id = row.menu_id
  }
  isEdit.value = false
  dialogTitle.value = '添加菜单'
  dialogVisible.value = true
}

// 编辑菜单
const handleEdit = async (row: any) => {
  resetForm()
  isEdit.value = true
  dialogTitle.value = '修改菜单'
  
  try {
    console.log('获取菜单详情，传递的ID:', row.menu_id)
    // 直接使用行数据，避免额外的请求
    if (row) {
      console.log('使用行数据填充表单:', row)
      
      // 设置表单数据
      menuForm.menu_id = row.menu_id
      menuForm.menu_name = row.menu_name || ''
      menuForm.parent_id = row.parent_id || 0
      menuForm.order_num = row.order_num || 0
      menuForm.path = row.path || ''
      menuForm.component = row.component || ''
      menuForm.query = row.query || ''
      menuForm.is_frame = row.is_frame !== null ? Number(row.is_frame) : 1
      menuForm.is_cache = row.is_cache !== null ? Number(row.is_cache) : 0
      menuForm.menu_type = row.menu_type || 'M'
      menuForm.visible = row.visible || '0'
      menuForm.status = row.status || '0'
      menuForm.perms = row.perms || ''
      menuForm.icon = row.icon || ''
      menuForm.remark = row.remark || ''
      
      dialogVisible.value = true
    }
  } catch (error) {
    console.error('获取菜单详情失败:', error)
    ElMessage.error('获取菜单详情失败')
  }
}

// 提交表单
const submitForm = async () => {
  if (!menuFormRef.value) return
  
  await menuFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    
    try {
      // 根据菜单类型设置必要的字段
      if (menuForm.menu_type === 'M') {
        menuForm.component = ''
        menuForm.perms = ''
      } else if (menuForm.menu_type === 'F') {
        menuForm.path = ''
        menuForm.component = ''
        menuForm.icon = ''
        menuForm.is_frame = 1
        menuForm.is_cache = 0
      }
      
      // 提交表单
      if (isEdit.value && menuForm.menu_id) {
        // 更新菜单
        const updateData = {
          menu_name: menuForm.menu_name,
          parent_id: menuForm.parent_id,
          order_num: menuForm.order_num,
          path: menuForm.path,
          component: menuForm.component,
          query: menuForm.query,
          is_frame: menuForm.is_frame,
          is_cache: menuForm.is_cache,
          menu_type: menuForm.menu_type,
          visible: menuForm.visible,
          status: menuForm.status,
          perms: menuForm.perms,
          icon: menuForm.icon,
          remark: menuForm.remark
        }
        
        console.log('更新菜单，ID:', menuForm.menu_id)
        console.log('更新菜单数据:', updateData)
        
        try {
          // 使用项目自带的API函数，避免CORS问题
          const response = await updateMenuApiV1SystemMenuMenuIdPut(
            { menu_id: menuForm.menu_id },
            updateData
          )
          
          console.log('更新菜单响应:', response)
          
          if (response.data && response.data.code === 200) {
            ElMessage.success('修改成功')
            dialogVisible.value = false
            getList() // 刷新列表
          } else {
            ElMessage.error(response.data?.msg || '修改失败')
          }
        } catch (error: any) {
          console.error('更新菜单请求失败:', error)
          console.error('错误详情:', error.message, error.stack)
          ElMessage.error(`更新失败: ${error.message || '未知错误'}`)
        }
      } else {
        // 创建菜单
        const createData = {
          menu_name: menuForm.menu_name,
          parent_id: menuForm.parent_id,
          order_num: menuForm.order_num,
          path: menuForm.path,
          component: menuForm.component,
          query: menuForm.query,
          is_frame: menuForm.is_frame,
          is_cache: menuForm.is_cache,
          menu_type: menuForm.menu_type,
          visible: menuForm.visible,
          status: menuForm.status,
          perms: menuForm.perms,
          icon: menuForm.icon,
          remark: menuForm.remark
        }
        
        console.log('创建菜单数据:', createData)
        
        try {
          // 使用项目自带的API函数，避免CORS问题
          const response = await createMenuApiV1SystemMenuPost(createData)
          
          console.log('创建菜单响应:', response)
          
          if (response.data && response.data.code === 200) {
            ElMessage.success('新增成功')
            dialogVisible.value = false
            getList() // 刷新列表
          } else {
            ElMessage.error(response.data?.msg || '新增失败')
          }
        } catch (error: any) {
          console.error('创建菜单请求失败:', error)
          console.error('错误详情:', error.message, error.stack)
          ElMessage.error(`新增失败: ${error.message || '未知错误'}`)
        }
      }
    } catch (error: any) {
      console.error('保存菜单失败:', error)
      console.error('错误类型:', typeof error)
      console.error('错误消息:', error.message)
      ElMessage.error(`保存菜单失败: ${error.message || '未知错误'}`)
    }
  })
}

// 删除菜单
const handleDelete = (row: any) => {
  // 不允许删除有子菜单的菜单
  if (row.children && row.children.length > 0) {
    ElMessage.warning('该菜单下有子菜单，不允许删除')
    return
  }
  
  ElMessageBox.confirm(`确认删除菜单"${row.menu_name}"吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      console.log('删除菜单，ID:', row.menu_id)
      
      // 使用项目自带的API函数，避免CORS问题
      const response = await deleteMenuApiV1SystemMenuMenuIdDelete({ menu_id: row.menu_id })
      
      console.log('删除菜单响应:', response)
      
      if (response.data && response.data.code === 200) {
        ElMessage.success('删除成功')
        getList() // 刷新列表
      } else {
        ElMessage.error(response.data?.msg || '删除失败')
      }
    } catch (error: any) {
      console.error('删除菜单失败:', error)
      console.error('错误详情:', error.message)
      ElMessage.error(`删除失败: ${error.message || '未知错误'}`)
    }
  }).catch(() => {})
}

// 生成父级菜单选项
const getParentMenuOptions = () => {
  // 过滤掉按钮类型和当前编辑的菜单，以避免自己选择自己作为父级
  const menuOptions = [
    { value: 0, label: '主目录', children: [] }
  ]
  
  // 将菜单列表转换为树形结构
  const menus = menuList.value.filter(menu => menu.menu_type !== 'F' && menu.menu_id !== menuForm.menu_id)
  
  // 转换为TreeSelect需要的格式
  const convertToTreeOptions = (items) => {
    return items.map(item => ({
      value: item.menu_id,
      label: item.menu_name,
      children: item.children && item.children.length > 0 
        ? convertToTreeOptions(item.children.filter(child => child.menu_type !== 'F' && child.menu_id !== menuForm.menu_id))
        : undefined
    }))
  }
  
  // 添加菜单选项
  if (menus.length > 0) {
    menuOptions[0].children = convertToTreeOptions(menus)
  }
  
  parentMenuOptions.value = menuOptions
}

// 菜单类型改变事件
const handleMenuTypeChange = (value: string) => {
  if (value === 'F') {
    menuForm.is_frame = 1
    menuForm.is_cache = 0
    menuForm.path = ''
    menuForm.icon = ''
    menuForm.component = ''
  }
}

// 将一维数组转换为树形结构
const handleTree = (data: any[], id = 'menu_id', parentId = 'parent_id', children = 'children') => {
  const result: any[] = []
  const map = new Map()
  
  // 首先将所有节点存入Map，以便快速查找
  data.forEach(item => {
    map.set(item[id], { ...item, [children]: [] })
  })
  
  // 将节点加入到对应的父节点的children中
  data.forEach(item => {
    const node = map.get(item[id])
    if (item[parentId] === 0 || !map.has(item[parentId])) {
      // 如果是根节点，直接加入结果数组
      result.push(node)
    } else {
      // 否则，将节点加入到父节点的children中
      const parent = map.get(item[parentId])
      parent[children].push(node)
    }
  })
  
  return result
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.filter-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.filter-item {
  margin-right: 10px;
}

/* 针对树形表格的样式调整 */
:deep(.el-table__row--level-0) .el-table__indent {
  padding-left: 0 !important;
}

:deep(.el-table__row--level-1) .el-table__indent {
  padding-left: 20px !important;
}

:deep(.el-table__row--level-2) .el-table__indent {
  padding-left: 40px !important;
}
</style> 