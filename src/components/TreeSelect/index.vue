<template>
  <el-select
    v-model="selectedValue"
    placeholder="请选择"
    clearable
    style="width: 100%"
    @change="handleChange"
  >
    <el-option
      v-for="option in normalizedOptions"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    />
  </el-select>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'

// 定义选项接口
interface TreeOption {
  value: string | number
  label: string
  children?: TreeOption[]
}

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null
  },
  options: {
    type: Array as () => TreeOption[],
    default: () => []
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  allowClear: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

// 内部值
const selectedValue = ref(props.modelValue)

// 格式化选项，将树形结构扁平化为一维数组
const normalizedOptions = computed(() => {
  const result: { value: string | number; label: string }[] = []
  
  // 递归遍历树形结构
  const traverse = (options: TreeOption[], level = 0, prefix = '') => {
    options.forEach(option => {
      const label = prefix + option.label
      result.push({
        value: option.value,
        label
      })
      
      if (option.children && option.children.length > 0) {
        traverse(option.children, level + 1, label + ' / ')
      }
    })
  }
  
  traverse(props.options)
  return result
})

// 监听外部值变化
watch(() => props.modelValue, (newVal) => {
  selectedValue.value = newVal
}, { immediate: true })

// 监听内部值变化
watch(() => selectedValue.value, (newVal) => {
  emit('update:modelValue', newVal)
})

const handleChange = (val: string | number) => {
  emit('update:modelValue', val)
}

// 初始化
onMounted(() => {
  if (props.modelValue) {
    selectedValue.value = props.modelValue
  }
})
</script> 