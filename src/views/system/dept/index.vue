<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="部门名称" prop="dept_name">
          <el-input v-model="queryParams.dept_name" placeholder="请输入部门名称" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="部门状态" clearable style="width: 180px;">
            <el-option label="正常" value="0" />
            <el-option label="停用" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card class="box-card">
      <div class="operate-box">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:dept:create']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="ArrowDown" @click="handleExpandAll">展开/折叠</el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 部门表格数据 -->
      <el-table
        v-loading="loading"
        :data="deptList"
        row-key="dept_id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        border
        ref="deptTable"
        style="width: 100%; margin-top: 15px"
      >
        <el-table-column prop="dept_name" label="部门名称" width="260"></el-table-column>
        <el-table-column prop="order_num" label="排序" width="100"></el-table-column>
        <el-table-column prop="leader" label="负责人" width="120"></el-table-column>
        <el-table-column prop="phone" label="联系电话" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '0' ? 'success' : 'info'">
              {{ scope.row.status === '0' ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="create_time" width="180"></el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button type="primary" link icon="Edit" @click="handleEdit(scope.row)" v-hasPermi="['system:dept:update']">编辑</el-button>
            <el-button type="primary" link icon="Plus" @click="handleAdd(scope.row)" v-hasPermi="['system:dept:create']">新增</el-button>
            <el-button type="danger" link icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:dept:delete']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 显示无数据提示 -->
      <div v-if="deptList.length === 0 && !loading" class="empty-block">
        <el-empty description="暂无数据"></el-empty>
      </div>
    </el-card>

    <!-- 新增/编辑部门对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body destroy-on-close>
      <el-form ref="deptForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="上级部门" prop="parent_id">
          <el-tree-select
            v-model="form.parent_id"
            :data="deptOptions"
            :props="{ label: 'dept_name', value: 'dept_id', children: 'children', emitPath: false }"
            placeholder="选择上级部门"
            check-strictly
            clearable
            filterable
            :render-after-expand="false"
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="dept_name">
          <el-input v-model="form.dept_name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="显示排序" prop="order_num">
          <el-input-number v-model="form.order_num" :min="0" />
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
        </el-form-item>
        <el-form-item label="部门状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  listDeptsApiV1SystemDeptGet,
  getDeptOptionsApiV1SystemDeptSelectOptionsGet,
  createDeptApiV1SystemDeptPost,
  updateDeptApiV1SystemDeptDeptIdPut,
  deleteDeptApiV1SystemDeptDeptIdDelete,
  getDeptTreeApiV1SystemDeptTreeGet
} from '@/api/bumenguanli'

// 定义部门数据类型
interface DeptData {
  dept_id: number;
  parent_id: number | null;
  dept_name: string;
  order_num: number;
  leader: string;
  phone: string;
  email: string;
  status: string;
  create_time?: string;
  update_time?: string | null;
  create_by?: string;
  update_by?: string;
  ancestors?: string;
  children?: DeptData[];
}

// 定义API响应类型
interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

// 部门列表数据
const deptList = ref<DeptData[]>([]);
const loading = ref(false);
const isExpand = ref(true); // 是否展开
const deptOptions = ref<DeptData[]>([]);
const expandRowKeys = ref<number[]>([]); // 展开的行keys

// 表格实例
const deptTable = ref<any>(null);
const queryForm = ref<any>(null);
const deptForm = ref<any>(null);

// 查询参数
const queryParams = reactive({
  dept_name: '',
  status: ''
})

// 表单参数
const open = ref(false)
const title = ref('')
const form = reactive<DeptData>({
  dept_id: undefined as any,
  parent_id: 0,
  dept_name: '',
  order_num: 0,
  leader: '',
  phone: '',
  email: '',
  status: '0'
})

// 表单校验规则
const rules = {
  dept_name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
  order_num: [{ required: true, message: '显示排序不能为空', trigger: 'blur' }],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

// 初始化
onMounted(() => {
  getDeptList()
  getDeptTreeSelect()
})

// 查询部门列表
const getDeptList = async () => {
  loading.value = true
  try {
    // 构建查询参数对象，只有在填写了值的情况下才添加
    const params: any = {};
    
    if (queryParams.dept_name) {
      params.dept_name = queryParams.dept_name;
    }
    
    if (queryParams.status) {
      params.status = queryParams.status;
    }
    
    console.log('查询参数:', params);
    
    const response = await listDeptsApiV1SystemDeptGet(params)
    console.log('部门列表响应数据:', response)
    
    // 正确处理API返回数据
    const res = response.data || response
    
    if (res.code === 200 && res.data) {
      // 将扁平结构转换为树形结构
      deptList.value = handleTree(res.data)
      // 初始化默认展开所有行
      if (deptList.value.length > 0) {
        initTableExpand();
      }
    } else {
      console.error('获取部门列表失败，返回码:', res.code)
      ElMessage.error(res.msg || '获取部门列表失败')
      deptList.value = [];
    }
  } catch (error) {
    console.error('获取部门列表失败', error)
    ElMessage.error('获取部门列表失败，请检查网络连接')
    deptList.value = [];
  } finally {
    loading.value = false
  }
}

// 初始化表格展开行
const initTableExpand = () => {
  nextTick(() => {
    if (isExpand.value) {
      // 获取所有行的key
      const allKeys: number[] = [];
      const getKeys = (data: DeptData[]) => {
        data.forEach(item => {
          allKeys.push(item.dept_id);
          if (item.children && item.children.length > 0) {
            getKeys(item.children);
          }
        });
      };
      getKeys(deptList.value);
      expandRowKeys.value = allKeys;
      
      // 展开所有行
      allKeys.forEach(key => {
        deptTable.value?.toggleRowExpansion({ dept_id: key }, true);
      });
    }
  });
};

// 查询部门下拉树结构
const getDeptTreeSelect = async () => {
  try {
    const response = await getDeptOptionsApiV1SystemDeptSelectOptionsGet()
    console.log('部门选项响应数据:', response)
    
    const res = response.data || response
    
    if (res.code === 200 && res.data) {
      // 后端可能返回的是树形结构，直接使用
      deptOptions.value = res.data as unknown as DeptData[]
      
      // 打印出返回的部门选项数据，用于调试
      console.log('处理后的部门选项数据:', deptOptions.value)
    } else {
      console.error('获取部门选项失败，返回码:', res.code)
      ElMessage.error(res.msg || '获取部门选项失败')
      deptOptions.value = [];
    }
  } catch (error) {
    console.error('获取部门选项失败', error)
    ElMessage.error('获取部门选项失败，请检查网络连接')
    deptOptions.value = [];
  }
}

// 构建树形结构数据
const handleTree = (data: any[]): DeptData[] => {
  if (!data || data.length === 0) {
    return [];
  }
  
  // 创建数据副本，防止修改原数据
  const items = JSON.parse(JSON.stringify(data)) as DeptData[]
  // 创建一个映射用于快速查找
  const map = new Map<number, DeptData>()
  // 结果数组
  let result: DeptData[] = []
  
  // 第一步：建立映射关系
  items.forEach(item => {
    map.set(item.dept_id, { ...item, children: [] })
  })
  
  // 第二步：根据parent_id构建树形结构
  items.forEach(item => {
    const id = item.dept_id
    const parentId = item.parent_id
    const treeItem = map.get(id) as DeptData
    
    if (parentId === 0 || parentId === null) {
      // 根节点
      result.push(treeItem)
    } else {
      // 子节点，添加到父节点的children数组
      const parentItem = map.get(parentId as number)
      if (parentItem) {
        if (!parentItem.children) parentItem.children = []
        parentItem.children.push(treeItem)
      } else {
        // 找不到父节点，作为根节点处理
        result.push(treeItem)
      }
    }
  })
  
  return result
}

// 展开/折叠操作
const handleExpandAll = () => {
  isExpand.value = !isExpand.value;
  if (isExpand.value) {
    // 展开所有行
    const allKeys: number[] = [];
    const getKeys = (data: DeptData[]) => {
      data.forEach(item => {
        allKeys.push(item.dept_id);
        if (item.children && item.children.length > 0) {
          getKeys(item.children);
        }
      });
    };
    getKeys(deptList.value);
    
    allKeys.forEach(key => {
      deptTable.value?.toggleRowExpansion({ dept_id: key }, true);
    });
  } else {
    // 折叠所有行
    const allKeys: number[] = [];
    const getKeys = (data: DeptData[]) => {
      data.forEach(item => {
        allKeys.push(item.dept_id);
        if (item.children && item.children.length > 0) {
          getKeys(item.children);
        }
      });
    };
    getKeys(deptList.value);
    
    allKeys.forEach(key => {
      deptTable.value?.toggleRowExpansion({ dept_id: key }, false);
    });
  }
}

// 搜索按钮操作
const handleQuery = () => {
  getDeptList()
}

// 重置按钮操作
const resetQuery = () => {
  if (queryForm.value) {
    queryForm.value.resetFields();
  } else {
    queryParams.dept_name = '';
    queryParams.status = '';
  }
  handleQuery();
}

// 新增按钮操作
const handleAdd = (row?: DeptData) => {
  reset()
  if (row) {
    form.parent_id = row.dept_id
  }
  title.value = '新增部门'
  open.value = true
  
  // 重置表单验证
  nextTick(() => {
    if (deptForm.value) {
      deptForm.value.clearValidate();
    }
  });
}

// 编辑按钮操作
const handleEdit = (row: DeptData) => {
  reset()
  form.dept_id = row.dept_id
  form.parent_id = row.parent_id
  form.dept_name = row.dept_name
  form.order_num = row.order_num
  form.leader = row.leader
  form.phone = row.phone
  form.email = row.email
  form.status = row.status
  
  title.value = '编辑部门'
  open.value = true
  
  // 重置表单验证
  nextTick(() => {
    if (deptForm.value) {
      deptForm.value.clearValidate();
    }
  });
}

// 表单重置
const reset = () => {
  form.dept_id = undefined as any
  form.parent_id = 0
  form.dept_name = ''
  form.order_num = 0
  form.leader = ''
  form.phone = ''
  form.email = ''
  form.status = '0'
}

// 取消按钮
const cancel = () => {
  open.value = false
  reset()
}

// 提交表单
const submitForm = async () => {
  try {
    if (!deptForm.value) {
      console.error('表单引用不存在');
      ElMessage.error('表单引用不存在');
      return;
    }
    
    // 使用Element Plus表单验证
    await deptForm.value.validate();
    
    if (form.dept_id) {
      // 修改部门
      try {
        const response = await updateDeptApiV1SystemDeptDeptIdPut(
          { dept_id: form.dept_id }, 
          form
        )
        // 处理API返回数据
        const res = response.data || response
        if (res.code === 200) {
          ElMessage.success('修改部门成功')
          open.value = false
          getDeptList() // 刷新部门列表
          getDeptTreeSelect() // 更新部门树选择器
        } else {
          ElMessage.error(res.msg || '修改部门失败')
        }
      } catch (error: any) {
        console.error('修改部门失败:', error)
        let errorMsg = '修改部门失败'
        
        // 检查是否有详细的错误信息
        if (error.response) {
          if (error.response.data && error.response.data.detail) {
            errorMsg = `修改部门失败: ${error.response.data.detail}`
          } else if (error.response.data && error.response.data.msg) {
            errorMsg = error.response.data.msg
          } else if (error.response.status === 500) {
            errorMsg = '服务器内部错误，请联系管理员检查后端代码'
          }
        } else if (error.message) {
          errorMsg = error.message
        }
        
        ElMessage.error(errorMsg)
      }
    } else {
      // 新增部门
      try {
        const response = await createDeptApiV1SystemDeptPost(form)
        // 处理API返回数据
        const res = response.data || response
        if (res.code === 200) {
          ElMessage.success('新增部门成功')
          open.value = false
          getDeptList() // 刷新部门列表
          getDeptTreeSelect() // 更新部门树选择器
        } else {
          ElMessage.error(res.msg || '新增部门失败')
        }
      } catch (error: any) {
        console.error('新增部门失败:', error)
        let errorMsg = '新增部门失败'
        
        // 检查是否有详细的错误信息
        if (error.response) {
          if (error.response.data && error.response.data.detail) {
            const detail = error.response.data.detail
            if (detail.includes("get_by_name")) {
              errorMsg = '后端方法缺失: CRUDDept对象没有get_by_name方法，请联系管理员修复后端代码'
            } else {
              errorMsg = `新增部门失败: ${detail}`
            }
          } else if (error.response.data && error.response.data.msg) {
            errorMsg = error.response.data.msg
          } else if (error.response.status === 500) {
            errorMsg = '服务器内部错误，可能是后端缺少get_by_name方法，请联系管理员'
          }
        } else if (error.message) {
          errorMsg = error.message
        }
        
        ElMessage.error(errorMsg)
      }
    }
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error('表单数据有误，请检查必填项')
  }
}

// 删除按钮操作
const handleDelete = (row: DeptData) => {
  // 检查是否有子部门
  if (row.children && row.children.length > 0) {
    ElMessage.warning(`部门【${row.dept_name}】包含子部门，请先删除子部门`);
    return;
  }

  ElMessageBox.confirm(
    `确认删除部门 ${row.dept_name} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      loading.value = true;
      // 确保 dept_id 是数字类型
      const deptId = Number(row.dept_id);
      if (isNaN(deptId)) {
        throw new Error('部门ID无效');
      }
      
      console.log(`删除部门，ID: ${deptId}, 名称: ${row.dept_name}`);
      
      // 直接构建请求参数对象，确保类型正确
      const params = { 
        dept_id: deptId 
      };
      
      // 捕获网络级别错误
      try {
        const response = await deleteDeptApiV1SystemDeptDeptIdDelete(params);
        
        // 正确处理API返回数据
        const res = response.data || response;
        
        if (res.code === 200) {
          ElMessage.success('删除成功');
          getDeptList(); // 刷新部门列表
          getDeptTreeSelect(); // 更新部门选择器
        } else {
          // 显示后端返回的错误消息
          console.error('删除部门失败，API返回错误:', res);
          ElMessage.error(res.msg || '删除失败');
        }
      } catch (apiError: any) {
        console.error('删除部门API调用失败:', apiError);
        
        // 处理后端错误响应
        if (apiError.response) {
          // 尝试获取更详细的错误信息
          let errorMsg = '删除失败';
          const responseData = apiError.response.data;
          
          // 提取错误信息
          if (responseData) {
            if (responseData.detail && typeof responseData.detail === 'string') {
              // FastAPI 详细错误信息
              const detail = responseData.detail;
              
              // 针对特定错误提供更友好的提示
              if (detail.includes("has_users") || detail.includes("CRUDDept")) {
                errorMsg = `后端方法缺失: CRUDDept对象没有has_users方法，请联系管理员修复后端代码`;
              } else {
                errorMsg = detail;
              }
            } else if (responseData.msg) {
              errorMsg = responseData.msg;
            }
          } else if (apiError.response.status === 403) {
            errorMsg = '您没有权限执行此操作';
          } else if (apiError.response.status === 404) {
            errorMsg = '部门不存在或已被删除';
          } else if (apiError.response.status === 500) {
            errorMsg = '服务器内部错误，可能是后端缺少has_users方法，请联系管理员';
          }
          
          ElMessage.error(errorMsg);
        } else if (apiError.message) {
          ElMessage.error(apiError.message);
        } else {
          ElMessage.error('网络错误，请稍后重试');
        }
      }
    } catch (error: any) {
      // 处理参数验证等错误
      console.error('删除部门操作失败:', error);
      ElMessage.error(error.message || '操作失败');
    } finally {
      loading.value = false;
    }
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.search-box {
  margin-bottom: 20px;
  background-color: #fff;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.box-card {
  margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.operate-box {
  padding: 10px 0;
}

.mb8 {
  margin-bottom: 8px;
}

.dialog-footer {
  text-align: right;
  padding-top: 10px;
}

.empty-block {
  margin-top: 20px;
  text-align: center;
}
</style> 