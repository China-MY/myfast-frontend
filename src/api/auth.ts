import request from '@/utils/request';

// 获取验证码
export function getCaptcha() {
  // 尝试请求后端API
  try {
    return request({
      url: '/api/v1/auth/captcha',
      method: 'get'
    });
  } catch (error) {
    console.error('获取验证码失败，使用模拟验证码', error);
    return mockCaptcha();
  }
}

// 模拟验证码
function mockCaptcha() {
  // 生成随机验证码ID
  const captchaId = 'mock_' + Math.random().toString(36).substring(2, 10);

  // 创建一个模拟的验证码图片（使用base64格式）
  // 这里生成一个简单的彩色背景图片，包含4位随机数字
  const canvas = document.createElement('canvas');
  canvas.width = 120;
  canvas.height = 40;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // 生成随机的验证码（4位数字）
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    // 绘制背景
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制干扰线
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // 绘制文字
    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 分开绘制每个数字，并随机旋转
    for (let i = 0; i < code.length; i++) {
      ctx.save();
      ctx.translate(20 + i * 25, 20);
      ctx.rotate((Math.random() - 0.5) * 0.3);
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }

    // 将canvas转为base64图片
    const captchaImg = canvas.toDataURL('image/png');

    // 将验证码保存到sessionStorage，模拟后端验证
    sessionStorage.setItem('mock_captcha_' + captchaId, code);

    // 返回Promise，模拟异步请求
    return Promise.resolve({
      code: 200,
      msg: '操作成功',
      data: {
        captchaId,
        captchaImg
      }
    });
  }

  // 如果canvas上下文获取失败，返回错误
  return Promise.reject(new Error('生成验证码失败'));
}

// 登录接口
export function login(data: {
  username: string;
  password: string;
  captcha_id: string;
  captcha_code: string;
}) {
  // 检查是否使用的是模拟验证码
  if (data.captcha_id && data.captcha_id.startsWith('mock_')) {
    // 验证模拟验证码
    const savedCode = sessionStorage.getItem('mock_captcha_' + data.captcha_id);
    if (!savedCode || savedCode !== data.captcha_code) {
      return Promise.reject({ message: '验证码错误' });
    }

    // 简单的用户验证逻辑
    if (data.username === 'admin' && data.password === 'admin123') {
      // 模拟成功的登录响应
      const token = 'mock_token_' + Math.random().toString(36).substring(2);
      localStorage.setItem('token', token);
      return Promise.resolve({
        code: 200,
        msg: '登录成功',
        data: {
          token,
          user: {
            id: 1,
            username: 'admin',
            nickname: '管理员',
            email: 'admin@example.com',
            avatar: '',
            roles: ['admin'],
            permissions: ['*:*:*']
          }
        }
      });
    } else {
      // 模拟登录失败
      return Promise.reject({ message: '用户名或密码错误' });
    }
  }

  // 真实请求
  return request({
    url: '/api/v1/system/auth/login',
    method: 'post',
    data,
  });
}

// 获取当前登录用户信息
export function getUserInfo() {
  // 检查是否使用模拟token
  const token = localStorage.getItem('token');
  if (token && token.startsWith('mock_token_')) {
    // 返回模拟的用户信息
    return Promise.resolve({
      code: 200,
      msg: '操作成功',
      data: {
        user: {
          id: 1,
          username: 'admin',
          nickname: '管理员',
          email: 'admin@example.com',
          avatar: '',
          roles: ['admin'],
          permissions: ['*:*:*']
        }
      }
    });
  }

  // 真实请求
  return request({
    url: '/api/v1/system/auth/profile',
    method: 'get',
  });
}

// 登出接口
export function logout() {
  // 检查是否使用模拟token
  const token = localStorage.getItem('token');
  if (token && token.startsWith('mock_token_')) {
    // 清除模拟token
    localStorage.removeItem('token');
    return Promise.resolve({
      code: 200,
      msg: '登出成功',
      data: null
    });
  }

  // 真实请求
  return request({
    url: '/api/v1/system/auth/logout',
    method: 'post',
  });
}

// 注册接口
export function register(data: {
  username: string;
  nickname: string;
  email: string;
  password: string;
  dept_id: number;
  captcha_id: string;
  captcha_code: string;
}) {
  return request({
    url: '/api/v1/system/auth/register',
    method: 'post',
    data
  });
}
