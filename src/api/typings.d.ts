declare namespace API {
  type BodyLoginAccessTokenApiV1AuthLoginPost = {
    /** Grant Type */
    grant_type?: string | null
    /** Username */
    username: string
    /** Password */
    password: string
    /** Scope */
    scope?: string
    /** Client Id */
    client_id?: string | null
    /** Client Secret */
    client_secret?: string | null
  }

  type BodyResetPasswordApiV1SystemUser_userId_resetPasswordPut = {
    /** Password */
    password: string
  }

  type BodyUpdatePasswordApiV1SystemUserProfileUpdatePasswordPut = {
    /** Current Password */
    current_password: string
    /** New Password */
    new_password: string
  }

  type deleteUserApiV1SystemUserUserIdDeleteParams = {
    /** 用户ID */
    user_id: number
  }

  type DeptBrief = {
    /** Dept Id 部门ID */
    dept_id: number
    /** Dept Name 部门名称 */
    dept_name: string
  }

  type HTTPValidationError = {
    /** Detail */
    detail?: ValidationError[]
  }

  type PageInfo = {
    /** Page 当前页码 */
    page?: number
    /** Pagesize 每页大小 */
    pageSize?: number
    /** Total 总条数 */
    total?: number
  }

  type PageResponseModelUser_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** Rows 数据列表 */
    rows?: User[]
    pageInfo?: PageInfo
  }

  type readUserApiV1SystemUserUserIdGetParams = {
    /** 用户ID */
    user_id: number
  }

  type readUsersApiV1SystemUserGetParams = {
    /** 用户名 */
    username?: string
    /** 用户昵称 */
    nickname?: string
    /** 状态 */
    status?: string
    /** 部门ID */
    dept_id?: number
    /** 页码 */
    page?: number
    /** 每页记录数 */
    pageSize?: number
  }

  type resetPasswordApiV1SystemUserUserIdResetPasswordPutParams = {
    /** 用户ID */
    user_id: number
  }

  type ResponseModel = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** Data 响应数据 */
    data?: any | null
  }

  type ResponseModelToken_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** 响应数据 */
    data?: Token | null
  }

  type ResponseModelUser_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** 响应数据 */
    data?: User | null
  }

  type ResponseModelUserInfo_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** 响应数据 */
    data?: UserInfo | null
  }

  type RoleBrief = {
    /** Role Id 角色ID */
    role_id: number
    /** Role Name 角色名称 */
    role_name: string
    /** Role Key 角色标识 */
    role_key: string
  }

  type Token = {
    /** Access Token 访问令牌 */
    access_token: string
    /** Token Type 令牌类型，通常是bearer */
    token_type: string
  }

  type updateUserApiV1SystemUserUserIdPutParams = {
    /** 用户ID */
    user_id: number
  }

  type User = {
    /** Username 用户账号 */
    username?: string | null
    /** Nickname 用户昵称 */
    nickname?: string | null
    /** Email 用户邮箱 */
    email?: string | null
    /** Phonenumber 手机号码 */
    phonenumber?: string | null
    /** Sex 用户性别（0男 1女 2未知） */
    sex?: string | null
    /** Status 帐号状态（0正常 1停用） */
    status?: string | null
    /** User Id 用户ID */
    user_id: number
    /** Dept Id 部门ID */
    dept_id?: number | null
    /** Create Time 创建时间 */
    create_time: string
    /** Update Time 更新时间 */
    update_time?: string | null
    /** Roles 用户角色列表 */
    roles?: RoleBrief[] | null
    /** 用户部门 */
    dept?: DeptBrief | null
  }

  type UserCreate = {
    /** Username 用户账号 */
    username: string
    /** Nickname 用户昵称 */
    nickname: string
    /** Email 用户邮箱 */
    email?: string | null
    /** Phonenumber 手机号码 */
    phonenumber?: string | null
    /** Sex 用户性别（0男 1女 2未知） */
    sex?: string | null
    /** Status 帐号状态（0正常 1停用） */
    status?: string | null
    /** Password 用户密码 */
    password: string
    /** Dept Id 部门ID */
    dept_id?: number | null
    /** Role Ids 角色ID列表 */
    role_ids?: number[] | null
    /** Post Ids 岗位ID列表 */
    post_ids?: number[] | null
  }

  type UserInfo = {
    /** 用户信息 */
    user: User
    /** Roles 角色标识列表 */
    roles?: string[]
    /** Permissions 权限列表 */
    permissions?: string[]
  }

  type UserLogin = {
    /** Username 用户名 */
    username: string
    /** Password 密码 */
    password: string
  }

  type UserUpdate = {
    /** Username 用户账号 */
    username?: string | null
    /** Nickname 用户昵称 */
    nickname?: string | null
    /** Email 用户邮箱 */
    email?: string | null
    /** Phonenumber 手机号码 */
    phonenumber?: string | null
    /** Sex 用户性别（0男 1女 2未知） */
    sex?: string | null
    /** Status 帐号状态（0正常 1停用） */
    status?: string | null
    /** Password 用户密码 */
    password?: string | null
    /** Dept Id 部门ID */
    dept_id?: number | null
    /** Role Ids 角色ID列表 */
    role_ids?: number[] | null
    /** Post Ids 岗位ID列表 */
    post_ids?: number[] | null
  }

  type ValidationError = {
    /** Location */
    loc: (string | number)[]
    /** Message */
    msg: string
    /** Error Type */
    type: string
  }
}
