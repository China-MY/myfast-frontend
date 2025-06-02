declare namespace API {
  type BodyBatchLogoutApiMonitorOnlineBatchLogoutDelete = {
    /** Online Ids */
    online_ids: number[]
  }

  type BodyChangeRoleStatusApiSystemRoleChangeStatusPut = {
    /** Role Id */
    role_id: number
    /** Status */
    status: string
  }

  type BodyChangeStatusApiMonitorJobChangeStatusPut = {
    /** Job Id */
    job_id: number
    /** Status */
    status: string
  }

  type BodyExecuteJobApiMonitorJobRunPut = {
    /** Job Id */
    job_id: number
  }

  type BodyLoginApiAuthLoginPost = {
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

  type BodyResetUserPasswordApiSystemUserResetPwdPut = {
    /** User Id */
    user_id: number
    /** New Password */
    new_password: string
  }

  type ConfigCreate = {
    /** Config Name 参数名称 */
    config_name: string
    /** Config Key 参数键名 */
    config_key: string
    /** Config Value 参数键值 */
    config_value: string
    /** Config Type 系统内置（Y是 N否） */
    config_type?: string
    /** Remark 备注 */
    remark?: string | null
  }

  type ConfigUpdate = {
    /** Config Name 参数名称 */
    config_name: string
    /** Config Key 参数键名 */
    config_key: string
    /** Config Value 参数键值 */
    config_value: string
    /** Config Type 系统内置（Y是 N否） */
    config_type?: string
    /** Remark 备注 */
    remark?: string | null
    /** Config Id 参数ID */
    config_id: number
  }

  type deleteRedisKeyApiMonitorCacheKeyKeyDeleteParams = {
    /** 键名 */
    key: string
  }

  type DeptCreate = {
    /** Parent Id 父部门ID */
    parent_id?: number
    /** Dept Name 部门名称 */
    dept_name: string
    /** Order Num 显示顺序 */
    order_num?: number
    /** Leader 负责人 */
    leader?: string | null
    /** Phone 联系电话 */
    phone?: string | null
    /** Email 邮箱 */
    email?: string | null
    /** Status 部门状态（0正常 1停用） */
    status?: string
  }

  type DeptUpdate = {
    /** Parent Id 父部门ID */
    parent_id?: number
    /** Dept Name 部门名称 */
    dept_name: string
    /** Order Num 显示顺序 */
    order_num?: number
    /** Leader 负责人 */
    leader?: string | null
    /** Phone 联系电话 */
    phone?: string | null
    /** Email 邮箱 */
    email?: string | null
    /** Status 部门状态（0正常 1停用） */
    status?: string
    /** Dept Id 部门ID */
    dept_id: number
  }

  type DictDataCreate = {
    /** Dict Sort 字典排序 */
    dict_sort?: number
    /** Dict Label 字典标签 */
    dict_label: string
    /** Dict Value 字典键值 */
    dict_value: string
    /** Dict Type 字典类型 */
    dict_type: string
    /** Css Class 样式属性（其他样式扩展） */
    css_class?: string | null
    /** List Class 表格回显样式 */
    list_class?: string | null
    /** Is Default 是否默认（Y是 N否） */
    is_default?: string
    /** Status 状态（0正常 1停用） */
    status?: string
    /** Remark 备注 */
    remark?: string | null
  }

  type DictDataUpdate = {
    /** Dict Sort 字典排序 */
    dict_sort?: number
    /** Dict Label 字典标签 */
    dict_label: string
    /** Dict Value 字典键值 */
    dict_value: string
    /** Dict Type 字典类型 */
    dict_type: string
    /** Css Class 样式属性（其他样式扩展） */
    css_class?: string | null
    /** List Class 表格回显样式 */
    list_class?: string | null
    /** Is Default 是否默认（Y是 N否） */
    is_default?: string
    /** Status 状态（0正常 1停用） */
    status?: string
    /** Remark 备注 */
    remark?: string | null
    /** Dict Code 字典编码 */
    dict_code: number
  }

  type DictTypeCreate = {
    /** Dict Name 字典名称 */
    dict_name: string
    /** Dict Type 字典类型 */
    dict_type: string
    /** Status 状态（0正常 1停用） */
    status?: string
    /** Remark 备注 */
    remark?: string | null
  }

  type DictTypeUpdate = {
    /** Dict Name 字典名称 */
    dict_name: string
    /** Dict Type 字典类型 */
    dict_type: string
    /** Status 状态（0正常 1停用） */
    status?: string
    /** Remark 备注 */
    remark?: string | null
    /** Dict Id 字典类型ID */
    dict_id: number
  }

  type forceLogoutApiMonitorOnlineRemoveOnlineIdDeleteParams = {
    /** 在线用户ID */
    online_id: number
  }

  type getConfigInfoApiSystemConfigInfoConfigIdGetParams = {
    /** 参数ID */
    config_id: number
  }

  type getConfigListApiSystemConfigListGetParams = {
    config_name?: string | null
    config_key?: string | null
    config_type?: string | null
    begin_time?: string | null
    end_time?: string | null
    page_num?: number
    page_size?: number
  }

  type getConfigValueByKeyApiSystemConfigKeyConfigKeyGetParams = {
    /** 参数键名 */
    config_key: string
  }

  type getDeptInfoApiSystemDeptInfoDeptIdGetParams = {
    /** 部门ID */
    dept_id: number
  }

  type getDeptListApiSystemDeptListGetParams = {
    dept_name?: string | null
    status?: string | null
  }

  type getDictDataByTypeApiSystemDictDataTypeDictTypeGetParams = {
    /** 字典类型 */
    dict_type: string
  }

  type getDictDataInfoApiSystemDictDataInfoDictCodeGetParams = {
    /** 字典数据ID */
    dict_code: number
  }

  type getDictDataListApiSystemDictDataListGetParams = {
    dict_type?: string | null
    dict_label?: string | null
    status?: string | null
    page_num?: number
    page_size?: number
  }

  type getDictTypeInfoApiSystemDictTypeInfoDictIdGetParams = {
    /** 字典类型ID */
    dict_id: number
  }

  type getDictTypeListApiSystemDictTypeListGetParams = {
    dict_name?: string | null
    dict_type?: string | null
    status?: string | null
    begin_time?: string | null
    end_time?: string | null
    page_num?: number
    page_size?: number
  }

  type getJobInfoApiMonitorJobInfoJobIdGetParams = {
    /** 任务ID */
    job_id: number
  }

  type getJobListApiMonitorJobListGetParams = {
    job_name?: string | null
    job_group?: string | null
    status?: string | null
    begin_time?: string | null
    end_time?: string | null
    page_num?: number
    page_size?: number
  }

  type getJobLogListApiMonitorJobLogListGetParams = {
    job_name?: string | null
    job_group?: string | null
    status?: string | null
    begin_time?: string | null
    end_time?: string | null
    page_num?: number
    page_size?: number
  }

  type getMenuInfoApiSystemMenuInfoMenuIdGetParams = {
    /** 菜单ID */
    menu_id: number
  }

  type getMenuListApiSystemMenuListGetParams = {
    /** 菜单名称 */
    menu_name?: string
    /** 菜单状态 */
    status?: string
  }

  type getOnlineUserListApiMonitorOnlineListGetParams = {
    username?: string | null
    ip_address?: string | null
    page_num?: number
    page_size?: number
  }

  type getPostInfoApiSystemPostInfoPostIdGetParams = {
    /** 岗位ID */
    post_id: number
  }

  type getPostListApiSystemPostListGetParams = {
    post_code?: string | null
    post_name?: string | null
    status?: string | null
    page_num?: number
    page_size?: number
  }

  type getRedisKeysApiMonitorCacheKeysGetParams = {
    pattern?: string
    limit?: number
  }

  type getRedisKeyValueApiMonitorCacheKeyKeyGetParams = {
    /** 键名 */
    key: string
  }

  type getRoleInfoApiSystemRoleInfoRoleIdGetParams = {
    /** 角色ID */
    role_id: number
  }

  type getRoleListApiSystemRoleListGetParams = {
    role_name?: string | null
    role_key?: string | null
    status?: string | null
    begin_time?: string | null
    end_time?: string | null
    page_num?: number
    page_size?: number
  }

  type getRoleMenuTreeSelectApiSystemMenuRoleMenuTreeselectRoleIdGetParams = {
    /** 角色ID */
    role_id: number
  }

  type getUserInfoApiSystemUserInfoUserIdGetParams = {
    /** 用户ID */
    user_id: number
  }

  type getUserListApiSystemUserListGetParams = {
    username?: string | null
    nickname?: string | null
    status?: string | null
    dept_id?: number | null
    begin_time?: string | null
    end_time?: string | null
    page_num?: number
    page_size?: number
  }

  type HTTPValidationError = {
    /** Detail */
    detail?: ValidationError[]
  }

  type JobCreate = {
    /** Job Name 任务名称 */
    job_name: string
    /** Job Group 任务组名 */
    job_group?: string
    /** Job Params 任务参数 */
    job_params?: string | null
    /** Cron Expression cron执行表达式 */
    cron_expression: string
    /** Misfire Policy 计划执行错误策略（1立即执行 2执行一次 3放弃执行） */
    misfire_policy?: string
    /** Concurrent 是否并发执行（0允许 1禁止） */
    concurrent?: string
    /** Status 状态（0正常 1暂停） */
    status?: string
    /** Remark 备注 */
    remark?: string | null
  }

  type JobUpdate = {
    /** Job Name 任务名称 */
    job_name: string
    /** Job Group 任务组名 */
    job_group?: string
    /** Job Params 任务参数 */
    job_params?: string | null
    /** Cron Expression cron执行表达式 */
    cron_expression: string
    /** Misfire Policy 计划执行错误策略（1立即执行 2执行一次 3放弃执行） */
    misfire_policy?: string
    /** Concurrent 是否并发执行（0允许 1禁止） */
    concurrent?: string
    /** Status 状态（0正常 1暂停） */
    status?: string
    /** Remark 备注 */
    remark?: string | null
    /** Job Id 任务ID */
    job_id: number
  }

  type LoginResponse = {
    /** Token 访问令牌 */
    token: string
    /** Expires In 过期时间 */
    expires_in: number
  }

  type MenuCreate = {
    /** Menu Name 菜单名称 */
    menu_name: string
    /** Parent Id 父菜单ID */
    parent_id?: number
    /** Order Num 显示顺序 */
    order_num?: number
    /** Path 路由地址 */
    path?: string | null
    /** Component 组件路径 */
    component?: string | null
    /** Query 路由参数 */
    query?: string | null
    /** Is Frame 是否为外链（0是 1否） */
    is_frame?: number
    /** Is Cache 是否缓存（0缓存 1不缓存） */
    is_cache?: number
    /** Menu Type 菜单类型（M目录 C菜单 F按钮） */
    menu_type: string
    /** Visible 菜单状态（0显示 1隐藏） */
    visible?: string
    /** Status 菜单状态（0正常 1停用） */
    status?: string
    /** Perms 权限标识 */
    perms?: string | null
    /** Icon 菜单图标 */
    icon?: string | null
    /** Remark 备注 */
    remark?: string | null
  }

  type MenuUpdate = {
    /** Menu Name 菜单名称 */
    menu_name: string
    /** Parent Id 父菜单ID */
    parent_id?: number
    /** Order Num 显示顺序 */
    order_num?: number
    /** Path 路由地址 */
    path?: string | null
    /** Component 组件路径 */
    component?: string | null
    /** Query 路由参数 */
    query?: string | null
    /** Is Frame 是否为外链（0是 1否） */
    is_frame?: number
    /** Is Cache 是否缓存（0缓存 1不缓存） */
    is_cache?: number
    /** Menu Type 菜单类型（M目录 C菜单 F按钮） */
    menu_type: string
    /** Visible 菜单状态（0显示 1隐藏） */
    visible?: string
    /** Status 菜单状态（0正常 1停用） */
    status?: string
    /** Perms 权限标识 */
    perms?: string | null
    /** Icon 菜单图标 */
    icon?: string | null
    /** Remark 备注 */
    remark?: string | null
    /** Menu Id 菜单ID */
    menu_id: number
  }

  type PostCreate = {
    /** Post Name 岗位名称 */
    post_name: string
    /** Post Code 岗位编码 */
    post_code: string
    /** Post Sort 岗位排序 */
    post_sort?: number
    /** Status 状态（0正常 1停用） */
    status?: string
    /** Remark 备注 */
    remark?: string | null
  }

  type PostUpdate = {
    /** Post Name 岗位名称 */
    post_name: string
    /** Post Code 岗位编码 */
    post_code: string
    /** Post Sort 岗位排序 */
    post_sort?: number
    /** Status 状态（0正常 1停用） */
    status?: string
    /** Remark 备注 */
    remark?: string | null
    /** Post Id 岗位ID */
    post_id: number
  }

  type removeConfigApiSystemConfigRemoveConfigIdDeleteParams = {
    /** 参数ID */
    config_id: number
  }

  type removeDeptApiSystemDeptRemoveDeptIdDeleteParams = {
    /** 部门ID */
    dept_id: number
  }

  type removeDictDataApiSystemDictDataRemoveDictCodeDeleteParams = {
    /** 字典数据ID */
    dict_code: number
  }

  type removeDictTypeApiSystemDictTypeRemoveDictIdDeleteParams = {
    /** 字典类型ID */
    dict_id: number
  }

  type removeJobApiMonitorJobRemoveJobIdDeleteParams = {
    /** 任务ID */
    job_id: number
  }

  type removeMenuApiSystemMenuRemoveMenuIdDeleteParams = {
    /** 菜单ID */
    menu_id: number
  }

  type removePostApiSystemPostRemovePostIdDeleteParams = {
    /** 岗位ID */
    post_id: number
  }

  type removeRoleApiSystemRoleRemoveRoleIdDeleteParams = {
    /** 角色ID */
    role_id: number
  }

  type removeUserApiSystemUserRemoveUserIdDeleteParams = {
    /** 用户ID */
    user_id: number
  }

  type renderFormApiToolFormRenderFormIdGetParams = {
    form_id: number
  }

  type RoleCreate = {
    /** Role Name 角色名称 */
    role_name: string
    /** Role Key 角色权限字符串 */
    role_key: string
    /** Role Sort 显示顺序 */
    role_sort: number
    /** Data Scope 数据范围（1全部数据权限 2自定数据权限 3本部门数据权限 4本部门及以下数据权限） */
    data_scope?: string | null
    /** Status 角色状态（0正常 1停用） */
    status?: string
    /** Remark 备注 */
    remark?: string | null
    /** Menu Ids 菜单ID列表 */
    menu_ids?: number[]
    /** Dept Ids 部门ID列表 */
    dept_ids?: number[] | null
  }

  type RoleUpdate = {
    /** Role Name 角色名称 */
    role_name: string
    /** Role Key 角色权限字符串 */
    role_key: string
    /** Role Sort 显示顺序 */
    role_sort: number
    /** Data Scope 数据范围（1全部数据权限 2自定数据权限 3本部门数据权限 4本部门及以下数据权限） */
    data_scope?: string | null
    /** Status 角色状态（0正常 1停用） */
    status?: string
    /** Remark 备注 */
    remark?: string | null
    /** Role Id 角色ID */
    role_id: number
    /** Menu Ids 菜单ID列表 */
    menu_ids?: number[] | null
    /** Dept Ids 部门ID列表 */
    dept_ids?: number[] | null
  }

  type UserCreate = {
    /** Username 用户名 */
    username: string
    /** Nickname 用户昵称 */
    nickname: string
    /** Email 邮箱 */
    email?: string | null
    /** Phonenumber 手机号码 */
    phonenumber?: string | null
    /** Sex 性别（0男 1女 2未知） */
    sex?: string | null
    /** Avatar 头像地址 */
    avatar?: string | null
    /** Status 帐号状态（0正常 1停用） */
    status?: string | null
    /** Dept Id 部门ID */
    dept_id?: number | null
    /** Remark 备注 */
    remark?: string | null
    /** Password 密码 */
    password: string
    /** Role Ids 角色ID列表 */
    role_ids?: number[]
    /** Post Ids 岗位ID列表 */
    post_ids?: number[]
  }

  type UserUpdate = {
    /** Username 用户名 */
    username: string
    /** Nickname 用户昵称 */
    nickname: string
    /** Email 邮箱 */
    email?: string | null
    /** Phonenumber 手机号码 */
    phonenumber?: string | null
    /** Sex 性别（0男 1女 2未知） */
    sex?: string | null
    /** Avatar 头像地址 */
    avatar?: string | null
    /** Status 帐号状态（0正常 1停用） */
    status?: string | null
    /** Dept Id 部门ID */
    dept_id?: number | null
    /** Remark 备注 */
    remark?: string | null
    /** User Id 用户ID */
    user_id: number
    /** Password 密码 */
    password?: string | null
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
