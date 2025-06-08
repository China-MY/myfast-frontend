<template>
  <div class="settings-container">
    <a-row :gutter="24">
      <a-col :span="6">
        <a-card class="settings-menu">
          <template #title>
            <div class="menu-title">
              <user-outlined />
              <span>个人设置</span>
            </div>
          </template>
          <a-menu
            mode="vertical"
            v-model:selectedKeys="selectedMenu"
            class="settings-menu-list"
            :style="{ border: 'none' }"
          >
            <a-menu-item key="basic">
              <template #icon>
                <user-outlined />
              </template>
              基本信息
            </a-menu-item>
            <a-menu-item key="security">
              <template #icon>
                <lock-outlined />
              </template>
              账户安全
            </a-menu-item>
            <a-menu-item key="notifications">
              <template #icon>
                <bell-outlined />
              </template>
              通知设置
            </a-menu-item>
            <a-menu-item key="appearance">
              <template #icon>
                <skin-outlined />
              </template>
              外观设置
            </a-menu-item>
            <a-menu-item key="binding">
              <template #icon>
                <link-outlined />
              </template>
              账号绑定
            </a-menu-item>
          </a-menu>
        </a-card>
      </a-col>
      <a-col :span="18">
        <!-- 基本信息设置 -->
        <a-card v-if="selectedMenu.includes('basic')" class="settings-content">
          <template #title>基本信息</template>
          <a-form
            :model="basicInfo"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }"
            class="settings-form"
          >
            <a-form-item label="头像" name="avatar">
              <div class="avatar-uploader">
                <a-avatar :size="100" :src="basicInfo.avatar">
                  <template #icon v-if="!basicInfo.avatar"><user-outlined /></template>
                </a-avatar>
                <div class="upload-actions">
                  <a-upload
                    name="avatar"
                    :show-upload-list="false"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    :before-upload="beforeUpload"
                    @change="handleAvatarChange"
                  >
                    <a-button>
                      <upload-outlined />
                      更换头像
                    </a-button>
                  </a-upload>
                  <p class="upload-hint">支持 JPG、PNG 格式，文件小于 2MB</p>
                </div>
              </div>
            </a-form-item>
            <a-form-item label="用户名" name="username">
              <a-input v-model:value="basicInfo.username" placeholder="请输入用户名" />
            </a-form-item>
            <a-form-item label="昵称" name="nickname">
              <a-input v-model:value="basicInfo.nickname" placeholder="请输入昵称" />
            </a-form-item>
            <a-form-item label="个人简介" name="bio">
              <a-textarea v-model:value="basicInfo.bio" :rows="4" placeholder="请输入个人简介" />
            </a-form-item>
            <a-form-item label="邮箱" name="email">
              <a-input v-model:value="basicInfo.email" placeholder="请输入邮箱" />
            </a-form-item>
            <a-form-item label="手机号" name="phone">
              <a-input v-model:value="basicInfo.phone" placeholder="请输入手机号" />
            </a-form-item>
            <a-form-item label="所在地区" name="location">
              <a-cascader
                v-model:value="basicInfo.location"
                :options="locationOptions"
                placeholder="请选择所在地区"
              />
            </a-form-item>
            <a-form-item :wrapper-col="{ offset: 4, span: 18 }">
              <a-button type="primary" @click="saveBasicInfo">保存更改</a-button>
            </a-form-item>
          </a-form>
        </a-card>

        <!-- 账户安全设置 -->
        <a-card v-if="selectedMenu.includes('security')" class="settings-content">
          <template #title>账户安全</template>
          <div class="security-items">
            <div class="security-item">
              <div class="security-info">
                <div class="security-title">
                  <lock-outlined />
                  <span>登录密码</span>
                </div>
                <div class="security-desc">定期更换密码可以保护您的账号安全</div>
              </div>
              <a-button type="link" @click="showPasswordModal">修改</a-button>
            </div>
            <a-divider style="margin: 16px 0" />
            <div class="security-item">
              <div class="security-info">
                <div class="security-title">
                  <mobile-outlined />
                  <span>手机绑定</span>
                </div>
                <div class="security-desc">已绑定：{{ securityInfo.phone || '未绑定' }}</div>
              </div>
              <a-button type="link" @click="showPhoneModal">{{ securityInfo.phone ? '修改' : '绑定' }}</a-button>
            </div>
            <a-divider style="margin: 16px 0" />
            <div class="security-item">
              <div class="security-info">
                <div class="security-title">
                  <mail-outlined />
                  <span>邮箱绑定</span>
                </div>
                <div class="security-desc">已绑定：{{ securityInfo.email || '未绑定' }}</div>
              </div>
              <a-button type="link" @click="showEmailModal">{{ securityInfo.email ? '修改' : '绑定' }}</a-button>
            </div>
            <a-divider style="margin: 16px 0" />
            <div class="security-item">
              <div class="security-info">
                <div class="security-title">
                  <safety-outlined />
                  <span>双因素认证</span>
                </div>
                <div class="security-desc">提高账号安全等级，确保账号不被他人盗用</div>
              </div>
              <a-switch v-model:checked="securityInfo.mfaEnabled" @change="toggleMFA" />
            </div>
            <a-divider style="margin: 16px 0" />
            <div class="security-item">
              <div class="security-info">
                <div class="security-title">
                  <history-outlined />
                  <span>登录记录</span>
                </div>
                <div class="security-desc">查看您的登录设备和登录记录</div>
              </div>
              <a-button type="link" @click="showLoginHistoryModal">查看</a-button>
            </div>
          </div>
        </a-card>

        <!-- 通知设置 -->
        <a-card v-if="selectedMenu.includes('notifications')" class="settings-content">
          <template #title>通知设置</template>
          <div class="notification-items">
            <div class="notification-item">
              <div class="notification-info">
                <div class="notification-title">
                  <message-outlined />
                  <span>系统通知</span>
                </div>
                <div class="notification-desc">接收系统更新、维护相关的通知</div>
              </div>
              <div class="notification-actions">
                <a-checkbox-group v-model:value="notificationSettings.system" :options="notificationOptions" />
              </div>
            </div>
            <a-divider style="margin: 16px 0" />
            <div class="notification-item">
              <div class="notification-info">
                <div class="notification-title">
                  <file-text-outlined />
                  <span>任务通知</span>
                </div>
                <div class="notification-desc">接收任务创建、更新、评论相关的通知</div>
              </div>
              <div class="notification-actions">
                <a-checkbox-group v-model:value="notificationSettings.task" :options="notificationOptions" />
              </div>
            </div>
            <a-divider style="margin: 16px 0" />
            <div class="notification-item">
              <div class="notification-info">
                <div class="notification-title">
                  <team-outlined />
                  <span>团队通知</span>
                </div>
                <div class="notification-desc">接收团队活动、邀请相关的通知</div>
              </div>
              <div class="notification-actions">
                <a-checkbox-group v-model:value="notificationSettings.team" :options="notificationOptions" />
              </div>
            </div>
            <a-divider style="margin: 16px 0" />
            <div class="notification-item">
              <div class="notification-info">
                <div class="notification-title">
                  <project-outlined />
                  <span>项目通知</span>
                </div>
                <div class="notification-desc">接收项目更新、里程碑相关的通知</div>
              </div>
              <div class="notification-actions">
                <a-checkbox-group v-model:value="notificationSettings.project" :options="notificationOptions" />
              </div>
            </div>
            <a-form-item :wrapper-col="{ span: 24 }" style="margin-top: 24px; text-align: right;">
              <a-button type="primary" @click="saveNotificationSettings">保存设置</a-button>
            </a-form-item>
          </div>
        </a-card>

        <!-- 外观设置 -->
        <a-card v-if="selectedMenu.includes('appearance')" class="settings-content">
          <template #title>外观设置</template>
          <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" class="settings-form">
            <a-form-item label="主题模式" name="themeMode">
              <a-radio-group v-model:value="appearanceSettings.themeMode" button-style="solid">
                <a-radio-button value="light">
                  <template #icon><bulb-outlined /></template>
                  浅色模式
                </a-radio-button>
                <a-radio-button value="dark">
                  <template #icon><bulb-filled /></template>
                  深色模式
                </a-radio-button>
                <a-radio-button value="auto">
                  <template #icon><sync-outlined /></template>
                  跟随系统
                </a-radio-button>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="主题色" name="themeColor">
              <a-radio-group v-model:value="appearanceSettings.themeColor">
                <a-tooltip title="默认蓝">
                  <a-radio value="#1890ff" style="color: transparent;">
                    <div class="color-block" style="background-color: #1890ff;"></div>
                  </a-radio>
                </a-tooltip>
                <a-tooltip title="薄暮红">
                  <a-radio value="#f5222d" style="color: transparent;">
                    <div class="color-block" style="background-color: #f5222d;"></div>
                  </a-radio>
                </a-tooltip>
                <a-tooltip title="火山橙">
                  <a-radio value="#fa541c" style="color: transparent;">
                    <div class="color-block" style="background-color: #fa541c;"></div>
                  </a-radio>
                </a-tooltip>
                <a-tooltip title="日暮黄">
                  <a-radio value="#faad14" style="color: transparent;">
                    <div class="color-block" style="background-color: #faad14;"></div>
                  </a-radio>
                </a-tooltip>
                <a-tooltip title="极光绿">
                  <a-radio value="#52c41a" style="color: transparent;">
                    <div class="color-block" style="background-color: #52c41a;"></div>
                  </a-radio>
                </a-tooltip>
                <a-tooltip title="极客蓝">
                  <a-radio value="#2f54eb" style="color: transparent;">
                    <div class="color-block" style="background-color: #2f54eb;"></div>
                  </a-radio>
                </a-tooltip>
                <a-tooltip title="酱紫">
                  <a-radio value="#722ed1" style="color: transparent;">
                    <div class="color-block" style="background-color: #722ed1;"></div>
                  </a-radio>
                </a-tooltip>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="导航模式" name="layoutMode">
              <a-radio-group v-model:value="appearanceSettings.layoutMode">
                <a-radio-button value="side">侧边菜单</a-radio-button>
                <a-radio-button value="top">顶部菜单</a-radio-button>
                <a-radio-button value="mix">混合菜单</a-radio-button>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="内容区域宽度" name="contentWidth">
              <a-radio-group v-model:value="appearanceSettings.contentWidth">
                <a-radio-button value="fixed">固定宽度</a-radio-button>
                <a-radio-button value="fluid">流式宽度</a-radio-button>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="固定头部" name="fixedHeader">
              <a-switch v-model:checked="appearanceSettings.fixedHeader" />
            </a-form-item>
            <a-form-item label="固定侧边栏" name="fixedSidebar">
              <a-switch v-model:checked="appearanceSettings.fixedSidebar" />
            </a-form-item>
            <a-form-item label="分割菜单" name="splitMenus">
              <a-switch v-model:checked="appearanceSettings.splitMenus" />
            </a-form-item>
            <a-form-item :wrapper-col="{ offset: 4, span: 18 }">
              <a-button type="primary" @click="saveAppearanceSettings">保存设置</a-button>
              <a-button style="margin-left: 8px" @click="resetAppearanceSettings">恢复默认</a-button>
            </a-form-item>
          </a-form>
        </a-card>

        <!-- 账号绑定 -->
        <a-card v-if="selectedMenu.includes('binding')" class="settings-content">
          <template #title>账号绑定</template>
          <div class="binding-items">
            <div class="binding-item">
              <div class="binding-info">
                <div class="binding-icon wechat">
                  <WechatOutlined />
                </div>
                <div class="binding-details">
                  <div class="binding-name">绑定微信</div>
                  <div class="binding-desc">{{ bindingInfo.wechat ? '已绑定' : '未绑定' }}</div>
                </div>
              </div>
              <a-button 
                :type="bindingInfo.wechat ? 'default' : 'primary'"
                @click="handleBinding('wechat')"
              >
                {{ bindingInfo.wechat ? '解除绑定' : '立即绑定' }}
              </a-button>
            </div>
            <a-divider style="margin: 16px 0" />
            <div class="binding-item">
              <div class="binding-info">
                <div class="binding-icon dingding">
                  <DingdingOutlined />
                </div>
                <div class="binding-details">
                  <div class="binding-name">绑定钉钉</div>
                  <div class="binding-desc">{{ bindingInfo.dingding ? '已绑定' : '未绑定' }}</div>
                </div>
              </div>
              <a-button 
                :type="bindingInfo.dingding ? 'default' : 'primary'"
                @click="handleBinding('dingding')"
              >
                {{ bindingInfo.dingding ? '解除绑定' : '立即绑定' }}
              </a-button>
            </div>
            <a-divider style="margin: 16px 0" />
            <div class="binding-item">
              <div class="binding-info">
                <div class="binding-icon alipay">
                  <AlipayOutlined />
                </div>
                <div class="binding-details">
                  <div class="binding-name">绑定支付宝</div>
                  <div class="binding-desc">{{ bindingInfo.alipay ? '已绑定' : '未绑定' }}</div>
                </div>
              </div>
              <a-button 
                :type="bindingInfo.alipay ? 'default' : 'primary'"
                @click="handleBinding('alipay')"
              >
                {{ bindingInfo.alipay ? '解除绑定' : '立即绑定' }}
              </a-button>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 密码修改弹窗 -->
    <a-modal
      v-model:visible="passwordModalVisible"
      title="修改密码"
      :maskClosable="false"
      @ok="handlePasswordChange"
    >
      <a-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef">
        <a-form-item name="oldPassword" label="当前密码">
          <a-input-password v-model:value="passwordForm.oldPassword" placeholder="请输入当前密码" />
        </a-form-item>
        <a-form-item name="newPassword" label="新密码">
          <a-input-password v-model:value="passwordForm.newPassword" placeholder="请输入新密码" />
        </a-form-item>
        <a-form-item name="confirmPassword" label="确认新密码">
          <a-input-password v-model:value="passwordForm.confirmPassword" placeholder="请再次输入新密码" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import { message } from 'ant-design-vue';
import {
  UserOutlined,
  LockOutlined,
  BellOutlined,
  SkinOutlined,
  LinkOutlined,
  UploadOutlined,
  MobileOutlined,
  MailOutlined,
  SafetyOutlined,
  HistoryOutlined,
  MessageOutlined,
  FileTextOutlined,
  TeamOutlined,
  ProjectOutlined,
  BulbOutlined,
  BulbFilled,
  SyncOutlined,
  WechatOutlined,
  DingdingOutlined,
  AlipayOutlined
} from '@ant-design/icons-vue';

// 当前选中的菜单
const selectedMenu = ref(['basic']);

// 基本信息表单数据
const basicInfo = ref({
  avatar: '',
  username: 'zhangsan',
  nickname: '张三',
  bio: '资深前端开发工程师，热爱技术，专注于用户体验设计与前端架构',
  email: 'zhangsan@example.com',
  phone: '13800138000',
  location: ['110000', '110100', '110101'] // 北京市-北京市-东城区
});

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
const saveBasicInfo = () => {
  message.success('基本信息保存成功');
};

// 头像上传前检查
const beforeUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('您只能上传 JPG/PNG 格式的图片!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片必须小于 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

// 头像上传变化
const handleAvatarChange = (info: any) => {
  if (info.file.status === 'uploading') {
    return;
  }
  if (info.file.status === 'done') {
    // 获取上传后的URL
    basicInfo.value.avatar = info.file.response.url;
    message.success('头像上传成功');
  } else if (info.file.status === 'error') {
    message.error('头像上传失败');
  }
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
    .then(() => {
      // 调用密码修改API
      message.success('密码修改成功');
      passwordModalVisible.value = false;
      // 重置表单
      passwordForm.oldPassword = '';
      passwordForm.newPassword = '';
      passwordForm.confirmPassword = '';
    })
    .catch(() => {
      // 表单验证失败
    });
};

// 显示手机绑定弹窗
const showPhoneModal = () => {
  message.info('打开手机绑定弹窗');
};

// 显示邮箱绑定弹窗
const showEmailModal = () => {
  message.info('打开邮箱绑定弹窗');
};

// 切换双因素认证
const toggleMFA = (checked: boolean) => {
  securityInfo.value.mfaEnabled = checked;
  message.success(`双因素认证已${checked ? '开启' : '关闭'}`);
};

// 显示登录记录弹窗
const showLoginHistoryModal = () => {
  message.info('打开登录记录弹窗');
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
  message.success('通知设置保存成功');
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
  message.success('外观设置保存成功');
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
  message.success('已恢复默认设置');
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
    message.success(`解除${type}绑定成功`);
  } else {
    // 未绑定，执行绑定
    bindingInfo.value[type as keyof typeof bindingInfo.value] = true;
    message.success(`${type}绑定成功`);
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
      
      .anticon {
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
          color: rgba(0, 0, 0, 0.45);
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
            
            .anticon {
              margin-right: 8px;
            }
          }
          
          .security-desc, .notification-desc {
            color: rgba(0, 0, 0, 0.45);
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
              background-color: #1890ff;
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
              color: rgba(0, 0, 0, 0.45);
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
}
</style> 