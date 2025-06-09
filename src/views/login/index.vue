<template>
  <div class="login-container">
    <div class="login-left">
      <div class="login-left-content">
        <div class="brand">
          <h1 class="animate__animated animate__fadeInDown">MyFast-Admin</h1>
          <p class="animate__animated animate__fadeIn animate__delay-1s">基于FastAPI和Vue3的现代企业级管理系统</p>
        </div>
        <div class="login-features animate__animated animate__fadeInUp animate__delay-1s">
          <div class="feature-item">
            <el-icon class="feature-icon"><CircleCheck /></el-icon>
            <span>高效的权限管理</span>
          </div>
          <div class="feature-item">
            <el-icon class="feature-icon"><CircleCheck /></el-icon>
            <span>响应式设计</span>
          </div>
          <div class="feature-item">
            <el-icon class="feature-icon"><CircleCheck /></el-icon>
            <span>多种主题切换</span>
          </div>
          <div class="feature-item">
            <el-icon class="feature-icon"><CircleCheck /></el-icon>
            <span>系统监控与日志</span>
          </div>
        </div>
      </div>
      <div class="wave-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="rgba(255,255,255,0.1)" fill-opacity="1" d="M0,32L48,58.7C96,85,192,139,288,176C384,213,480,235,576,224C672,213,768,171,864,165.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>

    <div class="login-right animate__animated animate__fadeIn">
      <div class="login-form-container">
        <!-- 系统通知显示 -->
        <el-alert v-if="noticeMessage" :title="noticeMessage" :type="noticeType" show-icon closable @close="noticeMessage = ''" style="margin-bottom: 24px" />

        <div class="login-header">
          <h2>MyFast-Admin</h2>
          <p>企业级后台管理系统</p>
        </div>

        <el-tabs v-model="activeTabKey" class="login-tabs">
          <el-tab-pane name="login" label="账号登录">
            <el-form
              ref="loginFormRef"
              :model="loginForm"
              :rules="loginRules"
              @submit.prevent="handleLoginSubmit"
              class="login-form"
            >
              <el-form-item prop="username">
                <el-input
                  v-model="loginForm.username"
                  size="large"
                  placeholder="用户名"
                  class="login-input"
                  clearable
                  @keyup.enter="handleLoginSubmit"
                >
                  <template #prefix>
                    <el-icon class="input-icon"><User /></el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  size="large"
                  placeholder="密码"
                  class="login-input"
                  clearable
                  show-password
                  @keyup.enter="handleLoginSubmit"
                >
                  <template #prefix>
                    <el-icon class="input-icon"><Lock /></el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <div class="login-options">
                <el-checkbox v-model="loginForm.remember">
                  记住我
                </el-checkbox>
                <a class="login-forgot" @click="handleForgotPassword">忘记密码？</a>
              </div>

              <el-button
                type="primary"
                native-type="submit"
                size="large"
                :loading="loginLoading"
                class="login-button"
              >
                {{ loginLoading ? '登录中...' : '登 录' }}
              </el-button>
            </el-form>
          </el-tab-pane>

          <el-tab-pane name="register" label="注册账号">
            <el-form
              ref="registerFormRef"
              :model="registerForm"
              :rules="registerRules"
              @submit.prevent="handleRegisterSubmit"
              class="login-form"
            >
              <el-form-item prop="username">
                <el-input
                  v-model="registerForm.username"
                  size="large"
                  placeholder="用户名"
                  class="login-input"
                  clearable
                >
                  <template #prefix>
                    <el-icon class="input-icon"><User /></el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item prop="nickname">
                <el-input
                  v-model="registerForm.nickname"
                  size="large"
                  placeholder="昵称"
                  class="login-input"
                  clearable
                >
                  <template #prefix>
                    <el-icon class="input-icon"><User /></el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item prop="email">
                <el-input
                  v-model="registerForm.email"
                  size="large"
                  placeholder="邮箱"
                  class="login-input"
                  clearable
                >
                  <template #prefix>
                    <el-icon class="input-icon"><Message /></el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item prop="password">
                <el-input
                  v-model="registerForm.password"
                  type="password"
                  size="large"
                  placeholder="密码"
                  class="login-input"
                  clearable
                  show-password
                >
                  <template #prefix>
                    <el-icon class="input-icon"><Lock /></el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <!-- 密码强度指示器 -->
              <div class="password-strength-meter" v-if="registerForm.password">
                <div class="strength-label">密码强度：</div>
                <div class="strength-bars">
                  <div
                    v-for="n in 3"
                    :key="n"
                    class="strength-bar"
                    :class="{ active: passwordStrength >= n }"
                  ></div>
                </div>
                <div class="strength-text" :class="`strength-${passwordStrengthLevel}`">
                  {{ passwordStrengthText }}
                </div>
              </div>

              <el-form-item prop="confirmPassword">
                <el-input
                  v-model="registerForm.confirmPassword"
                  type="password"
                  size="large"
                  placeholder="确认密码"
                  class="login-input"
                  clearable
                  show-password
                >
                  <template #prefix>
                    <el-icon class="input-icon"><Lock /></el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item prop="agreement">
                <el-checkbox v-model="registerForm.agreement">
                  我已阅读并同意 <a href="javascript:void(0)" @click="showTerms">服务条款</a> 和 <a href="javascript:void(0)" @click="showPrivacy">隐私政策</a>
                </el-checkbox>
              </el-form-item>

              <el-button
                type="primary"
                native-type="submit"
                size="large"
                :loading="registerLoading"
                class="login-button"
                :disabled="!registerForm.agreement"
              >
                {{ registerLoading ? '注册中...' : '注 册' }}
              </el-button>
            </el-form>
          </el-tab-pane>
        </el-tabs>

        <div class="login-footer">
          <p>版权所有 © {{ new Date().getFullYear() }} MyFast-Admin Team</p>
        </div>
      </div>
    </div>

    <!-- 服务条款模态框 -->
    <el-dialog
      v-model="termsVisible"
      title="服务条款"
      width="600px"
    >
      <div class="terms-content">
        <h3>MyFast-Admin 服务条款</h3>
        <p>欢迎使用 MyFast-Admin 服务！</p>
        <p>本服务条款是您与 MyFast-Admin 之间关于您使用 MyFast-Admin 服务所订立的协议。</p>
        <p>使用本服务，您必须同意以下条款：</p>
        <ol>
          <li>用户在使用本服务时，必须遵守中华人民共和国相关法律法规的规定。</li>
          <li>用户不得利用本服务进行任何违法或不当的活动。</li>
          <li>用户需要对账号安全负责，保管好自己的账号和密码。</li>
          <li>MyFast-Admin 保留随时修改或中断服务的权利。</li>
        </ol>
      </div>
    </el-dialog>

    <!-- 隐私政策模态框 -->
    <el-dialog
      v-model="privacyVisible"
      title="隐私政策"
      width="600px"
    >
      <div class="terms-content">
        <h3>MyFast-Admin 隐私政策</h3>
        <p>MyFast-Admin 非常重视您的隐私保护。</p>
        <p>本隐私政策描述了我们如何收集、使用和保护您的个人信息：</p>
        <ol>
          <li>我们可能收集您的个人信息，包括但不限于姓名、电子邮件地址和登录凭据。</li>
          <li>我们使用您的信息来提供、维护和改进我们的服务。</li>
          <li>我们不会未经您的许可将您的个人信息提供给第三方。</li>
          <li>我们采取合理的安全措施来保护您的个人信息。</li>
        </ol>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, computed, watch } from 'vue';
import {
  User,
  Lock,
  CircleCheck,
  Message
} from '@element-plus/icons-vue';
import { ElMessage, ElNotification } from 'element-plus';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/modules/user';
import { loginByAccountApiV1AuthLoginAccountPost } from '@/api/renzheng';
import { registerUserApiV1AuthRegisterPost } from '@/api/zhuce';
import { setToken } from '@/utils/auth';

// 表单引用
const loginFormRef = ref();
const registerFormRef = ref();

// 当前激活标签
const activeTabKey = ref('login');

// 通知信息
const noticeMessage = ref('');
const noticeType = ref('info');

// 模态框控制
const termsVisible = ref(false);
const privacyVisible = ref(false);

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
  remember: true
});

// 登录表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应为3-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' }
  ]
};

// 注册表单数据
const registerForm = reactive({
  username: '',
  nickname: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreement: false,
  dept_id: 1,  // 默认部门ID
  sex: '2',    // 默认未知性别
  status: '0'  // 默认正常状态
});

// 注册表单验证规则
const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应为3-20个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]+$/, message: '用户名只能包含字母、数字、下划线和短横线', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 30, message: '昵称长度应为2-30个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' },
    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, message: '密码必须包含大小写字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value === registerForm.password) {
          callback();
        } else {
          callback(new Error('两次输入的密码不一致'));
        }
      },
      trigger: 'blur'
    }
  ],
  agreement: [
    {
      validator: (rule: any, value: boolean, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error('请阅读并同意服务条款和隐私政策'));
        }
      },
      trigger: 'change'
    }
  ]
};

// 密码强度计算
const passwordStrength = computed(() => {
  const password = registerForm.password;
  if (!password) return 0;

  let strength = 0;
  // 长度检查
  if (password.length >= 8) strength += 1;
  // 包含大小写字母和数字
  if (/[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password)) strength += 1;
  // 包含特殊字符
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

  return strength;
});

const passwordStrengthLevel = computed(() => {
  switch (passwordStrength.value) {
    case 0: return 'weak';
    case 1: return 'medium';
    case 2: return 'strong';
    case 3: return 'very-strong';
    default: return 'weak';
  }
});

const passwordStrengthText = computed(() => {
  switch (passwordStrength.value) {
    case 0: return '弱';
    case 1: return '中';
    case 2: return '强';
    case 3: return '非常强';
    default: return '弱';
  }
});

// 状态
const loginLoading = ref(false);
const registerLoading = ref(false);
const router = useRouter();
const userStore = useUserStore();

// 监听密码变化，自动验证确认密码
watch(() => registerForm.password, () => {
  if (registerForm.confirmPassword) {
    registerFormRef.value?.validateField('confirmPassword');
  }
});

// 登录提交
const handleLoginSubmit = async () => {
  try {
    await loginFormRef.value.validate();
    loginLoading.value = true;

    // 准备登录数据
    const loginData: API.UserLogin = {
      username: loginForm.username,
      password: loginForm.password
    };

    // 调用登录API
    const response = await loginByAccountApiV1AuthLoginAccountPost(loginData) as any;
    console.log('登录响应:', response);

    if (response.data && response.data.code === 200) {
      // 保存token到cookies
      const token = response.data.data.access_token;
      setToken(token);

      ElNotification({
        title: '登录成功',
        message: `欢迎回来，${loginForm.username}！`,
        type: 'success',
        duration: 3000
      });

      // 获取用户信息
      await userStore.getUserInfo();

      // 从查询参数中获取重定向地址，如果没有则跳转到仪表盘
      const redirect = router.currentRoute.value.query.redirect as string;
      console.log('重定向地址:', redirect);

      // 跳转
      if (redirect) {
        router.push({ path: decodeURIComponent(redirect) });
      } else {
        router.push({ path: '/dashboard' });
      }
    } else {
      noticeMessage.value = response.data?.msg || '登录失败：用户名或密码错误';
      noticeType.value = 'error';
    }
  } catch (error: any) {
    console.error('登录失败:', error);
    noticeMessage.value = error.message || '登录失败，请稍后再试';
    noticeType.value = 'error';
  } finally {
    loginLoading.value = false;
  }
};

// 注册提交
const handleRegisterSubmit = async () => {
  try {
    await registerFormRef.value.validate();
    registerLoading.value = true;

    // 准备注册数据
    const registerData: API.UserCreate = {
      username: registerForm.username,
      nickname: registerForm.nickname,
      email: registerForm.email,
      password: registerForm.password,
      dept_id: registerForm.dept_id,
      sex: registerForm.sex,
      status: registerForm.status
    };

    // 调用注册API
    const response = await registerUserApiV1AuthRegisterPost(registerData) as any;

    if (response.code === 200) {
      ElNotification({
        title: '注册成功',
        type: 'success',
        duration: 3000
      });

      // 切换到登录标签
      activeTabKey.value = 'login';

      // 清空注册表单
      registerFormRef.value.resetFields();

      // 自动填充登录表单的用户名
      loginForm.username = registerForm.username;
    } else {
      noticeMessage.value = response.msg || '注册失败，请稍后再试';
      noticeType.value = 'error';
    }
  } catch (error: any) {
    console.error('注册失败:', error);
    noticeMessage.value = error.message || '注册失败，请稍后再试';
    noticeType.value = 'error';
  } finally {
    registerLoading.value = false;
  }
};

// 忘记密码处理
const handleForgotPassword = () => {
  ElMessage.info('忘记密码功能开发中，请联系管理员重置密码');
};

// 显示服务条款
const showTerms = (e: Event) => {
  e.preventDefault();
  termsVisible.value = true;
};

// 显示隐私政策
const showPrivacy = (e: Event) => {
  e.preventDefault();
  privacyVisible.value = true;
};

// 重置表单
const resetForms = () => {
  if (activeTabKey.value === 'login') {
    loginFormRef.value?.resetFields();
  } else {
    registerFormRef.value?.resetFields();
  }
  noticeMessage.value = '';
};

// 监听标签页切换，重置提示信息
watch(() => activeTabKey.value, () => {
  noticeMessage.value = '';
});

// onMounted钩子中添加调试日志
onMounted(() => {
  console.log('登录页面已挂载');
  console.log('当前路由路径:', router.currentRoute.value.path);
  console.log('当前路由参数:', router.currentRoute.value.query);

  // 自动设置焦点到用户名输入框
  setTimeout(() => {
    const usernameInput = document.querySelector('input[name="username"]');
    if (usernameInput) {
      (usernameInput as HTMLInputElement).focus();
    }
  }, 500);
});
</script>

<style lang="less" scoped>
@import 'animate.css/animate.css';

.login-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #f0f2f5;
}

.login-left {
  position: relative;
  width: 40%;
  background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  overflow: hidden;

  .wave-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    opacity: 0.6;
    animation: wave 15s infinite linear;
  }

  @keyframes wave {
    0% {
      transform: translateX(0) translateY(0);
    }
    50% {
      transform: translateX(-2%) translateY(1%);
    }
    100% {
      transform: translateX(0) translateY(0);
    }
  }

  .login-left-content {
    position: relative;
    width: 80%;
    max-width: 500px;
    z-index: 1;

    .brand {
      margin-bottom: 60px;

      h1 {
        font-size: 42px;
        font-weight: 700;
        margin-bottom: 20px;
        color: #fff;
        letter-spacing: 1px;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      p {
        font-size: 18px;
        line-height: 1.6;
        opacity: 0.9;
      }
    }

    .login-features {
      .feature-item {
        display: flex;
        align-items: center;
        margin-bottom: 22px;
        font-size: 18px;
        transition: all 0.3s;

        &:hover {
          transform: translateX(5px);
        }

        .feature-icon {
          margin-right: 12px;
          font-size: 20px;
          color: #fff;
        }
      }
    }
  }
}

.login-right {
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  box-shadow: -4px 0 10px rgba(0, 0, 0, 0.05);
}

.login-form-container {
  width: 400px;
  padding: 40px 20px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  }

  .login-header {
    text-align: center;
    margin-bottom: 30px;

    h2 {
      font-size: 28px;
      font-weight: 600;
      color: #1890ff;
      margin-bottom: 8px;
    }

    p {
      color: #666;
      font-size: 15px;
    }
  }

  .login-tabs {
    margin-bottom: 20px;
  }

  .login-form {
    margin-top: 20px;

    .login-input {
      height: 48px;
      border-radius: 4px;
      transition: all 0.3s;

      &:focus, &:hover {
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
      }

      .input-icon {
        color: #bfbfbf;
        font-size: 16px;
      }
    }

    .el-form-item {
      margin-bottom: 24px;
    }
  }

  .login-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .login-forgot {
      color: #1890ff;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        color: #40a9ff;
        text-decoration: underline;
      }
    }
  }

  .login-button {
    width: 100%;
    height: 48px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 4px;
    margin-bottom: 16px;
    box-shadow: 0 2px 0 rgba(0,0,0,0.045);
    transition: all 0.3s;

    &:hover {
      background: #40a9ff;
      border-color: #40a9ff;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 0 rgba(0,0,0,0.045);
    }
  }

  .login-footer {
    margin-top: 30px;
    text-align: center;
    color: #999;
    font-size: 12px;
  }
}

// 密码强度指示器样式
.password-strength-meter {
  margin: -15px 0 20px;
  padding: 0 5px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .strength-label {
    font-size: 12px;
    color: #666;
    margin-right: 10px;
  }

  .strength-bars {
    display: flex;
    gap: 5px;
    margin-right: 10px;

    .strength-bar {
      width: 30px;
      height: 6px;
      background-color: #e8e8e8;
      border-radius: 3px;
      transition: all 0.3s;

      &.active {
        &:nth-child(1) {
          background-color: #ff4d4f;
        }
        &:nth-child(2) {
          background-color: #faad14;
        }
        &:nth-child(3) {
          background-color: #52c41a;
        }
      }
    }
  }

  .strength-text {
    font-size: 12px;

    &.strength-weak {
      color: #ff4d4f;
    }
    &.strength-medium {
      color: #faad14;
    }
    &.strength-strong {
      color: #52c41a;
    }
    &.strength-very-strong {
      color: #13c2c2;
    }
  }
}

// 服务条款和隐私政策内容样式
.terms-content {
  max-height: 400px;
  overflow-y: auto;
  padding: 0 10px;

  h3 {
    margin-bottom: 16px;
    font-weight: 600;
  }

  p {
    margin-bottom: 12px;
    line-height: 1.6;
  }

  ol {
    padding-left: 20px;

    li {
      margin-bottom: 8px;
      line-height: 1.6;
    }
  }
}

// 响应式布局
@media (max-width: 992px) {
  .login-left {
    display: none;
  }

  .login-right {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .login-form-container {
    width: 90%;
    padding: 20px;
  }
}
</style>
