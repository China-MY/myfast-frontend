<template>
  <div class="settings-container">
    <el-row :gutter="24">
      <el-col :span="6">
        <el-card class="settings-menu">
          <template #header>
            <div class="menu-title">
              <el-icon><User /></el-icon>
              <span>个人设置</span>
            </div>
          </template>
          <el-menu
            mode="vertical"
            :default-active="activeMenu"
            @select="handleMenuSelect"
            class="settings-menu-list"
            :style="{ border: 'none' }"
          >
            <el-menu-item index="basic">
              <el-icon><User /></el-icon>
              <template #title>基本信息</template>
            </el-menu-item>
            <el-menu-item index="security">
              <el-icon><Lock /></el-icon>
              <template #title>账户安全</template>
            </el-menu-item>
            <el-menu-item index="notifications">
              <el-icon><Bell /></el-icon>
              <template #title>通知设置</template>
            </el-menu-item>
            <el-menu-item index="appearance">
              <el-icon><Brush /></el-icon>
              <template #title>外观设置</template>
            </el-menu-item>
            <el-menu-item index="binding">
              <el-icon><Link /></el-icon>
              <template #title>账号绑定</template>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      <el-col :span="18">
        <!-- 基本信息设置 -->
        <el-card v-if="activeMenu === 'basic'" class="settings-content">
          <template #header>基本信息</template>
          <el-form
            :model="basicInfo"
            label-width="120px"
            class="settings-form"
          >
            <el-form-item label="头像" prop="avatar">
              <div class="avatar-uploader">
                <el-avatar :size="100" :src="basicInfo.avatar">
                  <template #default v-if="!basicInfo.avatar"><el-icon><User /></el-icon></template>
                </el-avatar>
                <div class="upload-actions">
                  <el-upload
                    class="avatar-uploader"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                    :on-success="handleAvatarSuccess"
                    :on-error="handleAvatarError"
                  >
                    <el-button>
                      <el-icon><Upload /></el-icon>
                      更换头像
                    </el-button>
                  </el-upload>
                  <p class="upload-hint">支持 JPG、PNG 格式，文件小于 2MB</p>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <el-input v-model="basicInfo.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="basicInfo.nickname" placeholder="请输入昵称" />
            </el-form-item>
            <el-form-item label="个人简介" prop="bio">
              <el-input type="textarea" v-model="basicInfo.bio" :rows="4" placeholder="请输入个人简介" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="basicInfo.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="basicInfo.phone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="所在地区" prop="location">
              <el-cascader
                v-model="basicInfo.location"
                :options="locationOptions"
                placeholder="请选择所在地区"
              />
            </el-form-item>
            <el-form-item>
              <div class="form-buttons">
                <el-button type="primary" @click="saveBasicInfo">保存更改</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 账户安全设置 -->
        <el-card v-if="activeMenu === 'security'" class="settings-content">
          <template #header>账户安全</template>
          <div class="security-items">
            <div class="security-item">
              <div class="security-info">
                <div class="security-title">
                  <el-icon><Lock /></el-icon>
                  <span>登录密码</span>
                </div>
                <div class="security-desc">定期更换密码可以保护您的账号安全</div>
              </div>
              <el-button type="primary" link @click="showPasswordModal">修改</el-button>
            </div>
            <el-divider />
            <div class="security-item">
              <div class="security-info">
                <div class="security-title">
                  <el-icon><Iphone /></el-icon>
                  <span>手机绑定</span>
                </div>
                <div class="security-desc">已绑定：{{ securityInfo.phone || '未绑定' }}</div>
              </div>
              <el-button type="primary" link @click="showPhoneModal">{{ securityInfo.phone ? '修改' : '绑定' }}</el-button>
            </div>
            <el-divider />
            <div class="security-item">
              <div class="security-info">
                <div class="security-title">
                  <el-icon><Message /></el-icon>
                  <span>邮箱绑定</span>
                </div>
                <div class="security-desc">已绑定：{{ securityInfo.email || '未绑定' }}</div>
              </div>
              <el-button type="primary" link @click="showEmailModal">{{ securityInfo.email ? '修改' : '绑定' }}</el-button>
            </div>
            <el-divider />
            <div class="security-item">
              <div class="security-info">
                <div class="security-title">
                  <el-icon><Key /></el-icon>
                  <span>双因素认证</span>
                </div>
                <div class="security-desc">提高账号安全等级，确保账号不被他人盗用</div>
              </div>
              <el-switch v-model="securityInfo.mfaEnabled" @change="toggleMFA" />
            </div>
            <el-divider />
            <div class="security-item">
              <div class="security-info">
                <div class="security-title">
                  <el-icon><Clock /></el-icon>
                  <span>登录记录</span>
                </div>
                <div class="security-desc">查看您的登录设备和登录记录</div>
              </div>
              <el-button type="primary" link @click="showLoginHistoryModal">查看</el-button>
            </div>
          </div>
        </el-card>

        <!-- 通知设置 -->
        <el-card v-if="activeMenu === 'notifications'" class="settings-content">
          <template #header>通知设置</template>
          <div class="notification-items">
            <div class="notification-item">
              <div class="notification-info">
                <div class="notification-title">
                  <el-icon><Message /></el-icon>
                  <span>系统通知</span>
                </div>
                <div class="notification-desc">接收系统更新、维护相关的通知</div>
              </div>
              <div class="notification-actions">
                <el-checkbox-group v-model="notificationSettings.system">
                  <el-checkbox v-for="option in notificationOptions" :key="option.value" :label="option.value">{{ option.label }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <el-divider />
            <div class="notification-item">
              <div class="notification-info">
                <div class="notification-title">
                  <el-icon><Document /></el-icon>
                  <span>任务通知</span>
                </div>
                <div class="notification-desc">接收任务创建、更新、评论相关的通知</div>
              </div>
              <div class="notification-actions">
                <el-checkbox-group v-model="notificationSettings.task">
                  <el-checkbox v-for="option in notificationOptions" :key="option.value" :label="option.value">{{ option.label }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <el-divider />
            <div class="notification-item">
              <div class="notification-info">
                <div class="notification-title">
                  <el-icon><User /></el-icon>
                  <span>团队通知</span>
                </div>
                <div class="notification-desc">接收团队活动、邀请相关的通知</div>
              </div>
              <div class="notification-actions">
                <el-checkbox-group v-model="notificationSettings.team">
                  <el-checkbox v-for="option in notificationOptions" :key="option.value" :label="option.value">{{ option.label }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <el-divider />
            <div class="notification-item">
              <div class="notification-info">
                <div class="notification-title">
                  <el-icon><Folder /></el-icon>
                  <span>项目通知</span>
                </div>
                <div class="notification-desc">接收项目更新、里程碑相关的通知</div>
              </div>
              <div class="notification-actions">
                <el-checkbox-group v-model="notificationSettings.project">
                  <el-checkbox v-for="option in notificationOptions" :key="option.value" :label="option.value">{{ option.label }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div class="form-buttons">
              <el-button type="primary" @click="saveNotificationSettings">保存设置</el-button>
            </div>
          </div>
        </el-card>

        <!-- 外观设置 -->
        <el-card v-if="activeMenu === 'appearance'" class="settings-content">
          <template #header>外观设置</template>
          <el-form label-width="120px" class="settings-form">
            <el-form-item label="主题模式" prop="themeMode">
              <el-radio-group v-model="appearanceSettings.themeMode">
                <el-radio-button label="light">
                  <el-icon><Sunny /></el-icon> 浅色模式
                </el-radio-button>
                <el-radio-button label="dark">
                  <el-icon><Moon /></el-icon> 深色模式
                </el-radio-button>
                <el-radio-button label="auto">
                  <el-icon><Refresh /></el-icon> 跟随系统
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="主题色" prop="themeColor">
              <el-radio-group v-model="appearanceSettings.themeColor">
                <el-tooltip content="默认蓝" placement="top">
                  <el-radio label="#1890ff" style="color: transparent;">
                    <div class="color-block" style="background-color: #1890ff;"></div>
                  </el-radio>
                </el-tooltip>
                <el-tooltip content="薄暮红" placement="top">
                  <el-radio label="#f5222d" style="color: transparent;">
                    <div class="color-block" style="background-color: #f5222d;"></div>
                  </el-radio>
                </el-tooltip>
                <el-tooltip content="火山橙" placement="top">
                  <el-radio label="#fa541c" style="color: transparent;">
                    <div class="color-block" style="background-color: #fa541c;"></div>
                  </el-radio>
                </el-tooltip>
                <el-tooltip content="日暮黄" placement="top">
                  <el-radio label="#faad14" style="color: transparent;">
                    <div class="color-block" style="background-color: #faad14;"></div>
                  </el-radio>
                </el-tooltip>
                <el-tooltip content="极光绿" placement="top">
                  <el-radio label="#52c41a" style="color: transparent;">
                    <div class="color-block" style="background-color: #52c41a;"></div>
                  </el-radio>
                </el-tooltip>
                <el-tooltip content="极客蓝" placement="top">
                  <el-radio label="#2f54eb" style="color: transparent;">
                    <div class="color-block" style="background-color: #2f54eb;"></div>
                  </el-radio>
                </el-tooltip>
                <el-tooltip content="酱紫" placement="top">
                  <el-radio label="#722ed1" style="color: transparent;">
                    <div class="color-block" style="background-color: #722ed1;"></div>
                  </el-radio>
                </el-tooltip>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="导航模式" prop="layoutMode">
              <el-radio-group v-model="appearanceSettings.layoutMode">
                <el-radio-button label="side">侧边菜单</el-radio-button>
                <el-radio-button label="top">顶部菜单</el-radio-button>
                <el-radio-button label="mix">混合菜单</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="内容区域宽度" prop="contentWidth">
              <el-radio-group v-model="appearanceSettings.contentWidth">
                <el-radio-button label="fixed">固定宽度</el-radio-button>
                <el-radio-button label="fluid">流式宽度</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="固定头部" prop="fixedHeader">
              <el-switch v-model="appearanceSettings.fixedHeader" />
            </el-form-item>
            <el-form-item label="固定侧边栏" prop="fixedSidebar">
              <el-switch v-model="appearanceSettings.fixedSidebar" />
            </el-form-item>
            <el-form-item label="分割菜单" prop="splitMenus">
              <el-switch v-model="appearanceSettings.splitMenus" />
            </el-form-item>
            <el-form-item>
              <div class="form-buttons">
                <el-button type="primary" @click="saveAppearanceSettings">保存设置</el-button>
                <el-button @click="resetAppearanceSettings">恢复默认</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 账号绑定 -->
        <el-card v-if="activeMenu === 'binding'" class="settings-content">
          <template #header>账号绑定</template>
          <div class="binding-items">
            <div class="binding-item">
              <div class="binding-info">
                <div class="binding-icon wechat">
                  <el-icon><ChatDotRound /></el-icon>
                </div>
                <div class="binding-details">
                  <div class="binding-name">绑定微信</div>
                  <div class="binding-desc">{{ bindingInfo.wechat ? '已绑定' : '未绑定' }}</div>
                </div>
              </div>
              <el-button 
                :type="bindingInfo.wechat ? '' : 'primary'"
                @click="handleBinding('wechat')"
              >
                {{ bindingInfo.wechat ? '解除绑定' : '立即绑定' }}
              </el-button>
            </div>
            <el-divider />
            <div class="binding-item">
              <div class="binding-info">
                <div class="binding-icon dingding">
                  <el-icon><Bell /></el-icon>
                </div>
                <div class="binding-details">
                  <div class="binding-name">绑定钉钉</div>
                  <div class="binding-desc">{{ bindingInfo.dingding ? '已绑定' : '未绑定' }}</div>
                </div>
              </div>
              <el-button 
                :type="bindingInfo.dingding ? '' : 'primary'"
                @click="handleBinding('dingding')"
              >
                {{ bindingInfo.dingding ? '解除绑定' : '立即绑定' }}
              </el-button>
            </div>
            <el-divider />
            <div class="binding-item">
              <div class="binding-info">
                <div class="binding-icon alipay">
                  <el-icon><Money /></el-icon>
                </div>
                <div class="binding-details">
                  <div class="binding-name">绑定支付宝</div>
                  <div class="binding-desc">{{ bindingInfo.alipay ? '已绑定' : '未绑定' }}</div>
                </div>
              </div>
              <el-button 
                :type="bindingInfo.alipay ? '' : 'primary'"
                @click="handleBinding('alipay')"
              >
                {{ bindingInfo.alipay ? '解除绑定' : '立即绑定' }}
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 密码修改弹窗 -->
    <el-dialog
      v-model="passwordModalVisible"
      title="修改密码"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px">
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入当前密码" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" show-password />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="passwordModalVisible = false">取消</el-button>
          <el-button type="primary" @click="handlePasswordChange">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import {
  User,
  Lock,
  Bell,
  Brush,
  Link,
  Upload,
  Iphone,
  Message,
  Key,
  Clock,
  Document,
  Folder,
  Sunny,
  Moon,
  Refresh,
  ChatDotRound,
  Money
} from '@element-plus/icons-vue';
import { readUserMeApiV1SystemUserProfileGet, updateUserMeApiV1SystemUserProfilePut, updatePasswordApiV1SystemUserProfileUpdatePasswordPut } from '@/api/yonghuxinxi';

// 当前选中的菜单
const activeMenu = ref('basic');
const loading = ref(false);

// 处理菜单选择
const handleMenuSelect = (index: string) => {
  activeMenu.value = index;
};

// 基本信息表单数据
const basicInfo = ref({
  avatar: '',
  username: '',
  nickname: '',
  bio: '这个人很懒，什么也没有留下。',
  email: '',
  phone: '',
  location: [] as string[]
});

// 获取用户信息
const fetchUserInfo = async () => {
  loading.value = true;
  const loadingInstance = ElLoading.service({
    target: '.settings-container',
    text: '加载中...'
  });
  
  try {
    const response = await readUserMeApiV1SystemUserProfileGet();
    const res = response.data;
    if (res.code === 200 && res.data) {
      const userData = res.data;
      basicInfo.value = {
        avatar: '',
        username: userData.username || '',
        nickname: userData.nickname || '',
        bio: '这个人很懒，什么也没有留下。',
        email: userData.email || '',
        phone: userData.phonenumber || '',
        location: []
      };
      
      // 设置安全信息
      securityInfo.value = {
        phone: userData.phonenumber ? userData.phonenumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '',
        email: userData.email ? userData.email.replace(/(.{2}).+(@.+)/, '$1****$2') : '',
        mfaEnabled: false
      };
      
      ///console.log('获取用户信息成功:', userData);
    } else {
      ElMessage.error(res?.msg || '获取用户信息失败');
    }
  } catch (error) {
    ///console.error('获取用户信息出错:', error);
    ElMessage.error('获取用户信息失败，请重试');
  } finally {
    loading.value = false;
    loadingInstance.close();
  }
};

// 地区级联选择器数据
const locationOptions = [
  {
    value: '110000',
    label: '北京市',
    children: [
      {
        value: '110100',
        label: '北京市',
        children: [
          { value: '110101', label: '东城区' },
          { value: '110102', label: '西城区' },
          { value: '110105', label: '朝阳区' },
          { value: '110106', label: '丰台区' },
          { value: '110107', label: '石景山区' },
          { value: '110108', label: '海淀区' },
        ]
      }
    ]
  },
  {
    value: '120000',
    label: '天津市',
    children: [
      {
        value: '120100',
        label: '天津市',
        children: [
          { value: '120101', label: '和平区' },
          { value: '120102', label: '河东区' },
          { value: '120103', label: '河西区' },
          { value: '120104', label: '南开区' },
          { value: '120105', label: '河北区' },
        ]
      }
    ]
  },
  // 更多地区数据...
];

// 保存基本信息
const saveBasicInfo = async () => {
  loading.value = true;
  try {
    // 准备更新的用户信息
    const updateData = {
      username: basicInfo.value.username,
      nickname: basicInfo.value.nickname,
      email: basicInfo.value.email,
      phonenumber: basicInfo.value.phone,
      // 其他字段根据后端API需要添加
    };

    const response = await updateUserMeApiV1SystemUserProfilePut(updateData);
    const res = response.data;
    if (res.code === 200) {
      ElMessage.success('基本信息保存成功');
      // 重新获取最新的用户信息
      await fetchUserInfo();
    } else {
      ElMessage.error(res?.msg || '保存失败，请重试');
    }
  } catch (error) {
    ///console.error('保存用户信息出错:', error);
    ElMessage.error('保存失败，请重试');
  } finally {
    loading.value = false;
  }
};

// 头像上传前检查
const beforeUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    ElMessage.error('您只能上传 JPG/PNG 格式的图片!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error('图片必须小于 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

// 头像上传成功
const handleAvatarSuccess = (response: any) => {
  basicInfo.value.avatar = response.url;
  ElMessage.success('头像上传成功');
};

// 头像上传失败
const handleAvatarError = () => {
  ElMessage.error('头像上传失败');
};

// 安全信息
const securityInfo = ref({
  phone: '138****8000',
  email: 'zha****@example.com',
  mfaEnabled: false
});

// 密码修改相关
const passwordModalVisible = ref(false);
const passwordFormRef = ref();
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, message: '密码长度不能少于8个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string) => {
        if (value !== passwordForm.newPassword) {
          return Promise.reject('两次输入的密码不一致');
        }
        return Promise.resolve();
      },
      trigger: 'blur'
    }
  ]
};

// 显示密码修改弹窗
const showPasswordModal = () => {
  passwordModalVisible.value = true;
};

// 处理密码修改
const handlePasswordChange = () => {
  passwordFormRef.value
    .validate()
    .then(async () => {
      try {
        loading.value = true;
        // 调用密码修改API
        const response = await updatePasswordApiV1SystemUserProfileUpdatePasswordPut({
          current_password: passwordForm.oldPassword,
          new_password: passwordForm.newPassword
        });
        
        const res = response.data;
        if (res.code === 200) {
          ElMessage.success('密码修改成功');
          passwordModalVisible.value = false;
          // 重置表单
          passwordForm.oldPassword = '';
          passwordForm.newPassword = '';
          passwordForm.confirmPassword = '';
        } else {
          ElMessage.error(res?.msg || '密码修改失败');
        }
      } catch (error) {
        ///console.error('密码修改出错:', error);
        ElMessage.error('密码修改失败，请重试');
      } finally {
        loading.value = false;
      }
    })
    .catch(() => {
      // 表单验证失败
    });
};

// 页面加载时获取用户信息
onMounted(() => {
  fetchUserInfo();
});

// 显示手机绑定弹窗
const showPhoneModal = () => {
  ElMessage.info('打开手机绑定弹窗');
};

// 显示邮箱绑定弹窗
const showEmailModal = () => {
  ElMessage.info('打开邮箱绑定弹窗');
};

// 切换双因素认证
const toggleMFA = (checked: boolean) => {
  securityInfo.value.mfaEnabled = checked;
  ElMessage.success(`双因素认证已${checked ? '开启' : '关闭'}`);
};

// 显示登录记录弹窗
const showLoginHistoryModal = () => {
  ElMessage.info('打开登录记录弹窗');
};

// 通知设置
const notificationOptions = [
  { label: '站内消息', value: 'site' },
  { label: '邮件通知', value: 'email' },
  { label: '手机通知', value: 'phone' }
];

const notificationSettings = ref({
  system: ['site', 'email'],
  task: ['site', 'email'],
  team: ['site'],
  project: ['site', 'email']
});

// 保存通知设置
const saveNotificationSettings = () => {
  ElMessage.success('通知设置保存成功');
};

// 外观设置
const appearanceSettings = ref({
  themeMode: 'light',
  themeColor: '#1890ff',
  layoutMode: 'side',
  contentWidth: 'fixed',
  fixedHeader: true,
  fixedSidebar: true,
  splitMenus: false
});

// 保存外观设置
const saveAppearanceSettings = () => {
  ElMessage.success('外观设置保存成功');
};

// 重置外观设置
const resetAppearanceSettings = () => {
  appearanceSettings.value = {
    themeMode: 'light',
    themeColor: '#1890ff',
    layoutMode: 'side',
    contentWidth: 'fixed',
    fixedHeader: true,
    fixedSidebar: true,
    splitMenus: false
  };
  ElMessage.success('已恢复默认设置');
};

// 账号绑定信息
const bindingInfo = ref({
  wechat: true,
  dingding: false,
  alipay: false
});

// 处理账号绑定/解绑
const handleBinding = (type: string) => {
  if (bindingInfo.value[type as keyof typeof bindingInfo.value]) {
    // 已绑定，执行解绑
    bindingInfo.value[type as keyof typeof bindingInfo.value] = false;
    ElMessage.success(`解除${type}绑定成功`);
  } else {
    // 未绑定，执行绑定
    bindingInfo.value[type as keyof typeof bindingInfo.value] = true;
    ElMessage.success(`${type}绑定成功`);
  }
};
</script>

<style lang="less" scoped>
.settings-container {
  padding: 20px;
  
  .settings-menu {
    margin-bottom: 20px;
    
    .menu-title {
      display: flex;
      align-items: center;
      
      .el-icon {
        margin-right: 8px;
      }
    }
    
    .settings-menu-list {
      border-right: none;
    }
  }
  
  .settings-content {
    margin-bottom: 20px;
    
    .avatar-uploader {
      display: flex;
      align-items: center;
      
      .upload-actions {
        margin-left: 24px;
        
        .upload-hint {
          color: var(--el-text-color-secondary);
          margin-top: 8px;
          font-size: 12px;
        }
      }
    }
    
    .security-items, .notification-items, .binding-items {
      .security-item, .notification-item, .binding-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .security-info, .notification-info, .binding-info {
          .security-title, .notification-title {
            font-weight: 500;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            
            .el-icon {
              margin-right: 8px;
            }
          }
          
          .security-desc, .notification-desc {
            color: var(--el-text-color-secondary);
            font-size: 14px;
          }
        }
        
        .binding-info {
          display: flex;
          align-items: center;
          
          .binding-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            margin-right: 16px;
            
            &.wechat {
              background-color: #07c160;
              color: white;
            }
            
            &.dingding {
              background-color: var(--el-color-primary);
              color: white;
            }
            
            &.alipay {
              background-color: #1677ff;
              color: white;
            }
          }
          
          .binding-details {
            .binding-name {
              font-weight: 500;
              margin-bottom: 4px;
            }
            
            .binding-desc {
              color: var(--el-text-color-secondary);
              font-size: 14px;
            }
          }
        }
      }
    }
    
    .color-block {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 8px;
    }
  }
  
  .form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
  }
  
  .el-divider {
    margin: 16px 0;
  }
}
</style> 