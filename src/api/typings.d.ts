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

  type changeJobStatusApiV1MonitorJobJobIdStatusStatusPutParams = {
    job_id: number
    status: string
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

  type ConfigOut = {
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
    /** Config Id */
    config_id: number
    /** Create By */
    create_by: string
    /** Create Time */
    create_time: string
    /** Update By */
    update_by?: string | null
    /** Update Time */
    update_time?: string | null
  }

  type ConfigUpdate = {
    /** Config Name 参数名称 */
    config_name?: string | null
    /** Config Key 参数键名 */
    config_key?: string | null
    /** Config Value 参数键值 */
    config_value?: string | null
    /** Config Type 系统内置（Y是 N否） */
    config_type?: string | null
    /** Remark 备注 */
    remark?: string | null
  }

  type CpuInfo = {
    /** Name CPU名称 */
    name?: string
    /** Model CPU型号 */
    model?: string
    /** Arch CPU架构 */
    arch?: string
    /** Cores CPU物理核心数 */
    cores?: number
    /** Logical Cores CPU逻辑核心数 */
    logical_cores?: number
    /** Usage CPU使用率 */
    usage?: number
  }

  type deleteCacheApiV1MonitorCacheKeyKeyDeleteParams = {
    key: string
  }

  type deleteConfigApiV1SystemConfigConfigIdDeleteParams = {
    config_id: number
  }

  type deleteDeptApiV1SystemDeptDeptIdDeleteParams = {
    dept_id: number
  }

  type deleteDictDataApiV1SystemDictDataDictCodeDeleteParams = {
    dict_code: number
  }

  type deleteDictTypeApiV1SystemDictTypeDictIdDeleteParams = {
    dict_id: number
  }

  type deleteJobApiV1MonitorJobJobIdDeleteParams = {
    job_id: number
  }

  type deleteMenuApiV1SystemMenuMenuIdDeleteParams = {
    menu_id: number
  }

  type deletePostApiV1SystemPostPostIdDeleteParams = {
    post_id: number
  }

  type deleteRoleApiV1SystemRoleRoleIdDeleteParams = {
    role_id: number
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

  type DeptCreate = {
    /** Dept Name */
    dept_name: string
    /** Parent Id */
    parent_id?: number | null
    /** Ancestors */
    ancestors?: string | null
    /** Order Num */
    order_num?: number | null
    /** Leader */
    leader?: string | null
    /** Phone */
    phone?: string | null
    /** Email */
    email?: string | null
    /** Status */
    status?: string | null
  }

  type DeptOut = {
    /** Dept Name */
    dept_name?: string | null
    /** Parent Id */
    parent_id?: number | null
    /** Ancestors */
    ancestors?: string | null
    /** Order Num */
    order_num?: number | null
    /** Leader */
    leader?: string | null
    /** Phone */
    phone?: string | null
    /** Email */
    email?: string | null
    /** Status */
    status?: string | null
    /** Dept Id */
    dept_id: number
    /** Create Time */
    create_time: string
    /** Update Time */
    update_time?: string | null
    /** Create By */
    create_by?: string | null
    /** Update By */
    update_by?: string | null
  }

  type DeptTree = {
    /** Dept Name */
    dept_name?: string | null
    /** Parent Id */
    parent_id?: number | null
    /** Ancestors */
    ancestors?: string | null
    /** Order Num */
    order_num?: number | null
    /** Leader */
    leader?: string | null
    /** Phone */
    phone?: string | null
    /** Email */
    email?: string | null
    /** Status */
    status?: string | null
    /** Dept Id */
    dept_id: number
    /** Children */
    children?: DeptTree[]
  }

  type DeptUpdate = {
    /** Dept Name */
    dept_name?: string | null
    /** Parent Id */
    parent_id?: number | null
    /** Ancestors */
    ancestors?: string | null
    /** Order Num */
    order_num?: number | null
    /** Leader */
    leader?: string | null
    /** Phone */
    phone?: string | null
    /** Email */
    email?: string | null
    /** Status */
    status?: string | null
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
    /** Css Class 样式属性 */
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
    dict_sort?: number | null
    /** Dict Label 字典标签 */
    dict_label?: string | null
    /** Dict Value 字典键值 */
    dict_value?: string | null
    /** Dict Type 字典类型 */
    dict_type?: string | null
    /** Css Class 样式属性 */
    css_class?: string | null
    /** List Class 表格回显样式 */
    list_class?: string | null
    /** Is Default 是否默认（Y是 N否） */
    is_default?: string | null
    /** Status 状态（0正常 1停用） */
    status?: string | null
    /** Remark 备注 */
    remark?: string | null
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
    dict_name?: string | null
    /** Dict Type 字典类型 */
    dict_type?: string | null
    /** Status 状态（0正常 1停用） */
    status?: string | null
    /** Remark 备注 */
    remark?: string | null
  }

  type DiskInfo = {
    /** Name 磁盘名称 */
    name?: string
    /** Mount Point 挂载点 */
    mount_point?: string
    /** Fs Type 文件系统类型 */
    fs_type?: string
    /** Total 总容量 */
    total?: number
    /** Used 已用容量 */
    used?: number
    /** Free 剩余容量 */
    free?: number
    /** Usage 使用率 */
    usage?: number
  }

  type forceLogoutApiV1MonitorOnlineTokenDeleteParams = {
    token: string
  }

  type ForceLogoutParams = {
    /** Session Ids 会话ID列表 */
    session_ids: string[]
  }

  type getCacheValueApiV1MonitorCacheValueKeyGetParams = {
    key: string
  }

  type getConfigApiV1SystemConfigConfigIdGetParams = {
    config_id: number
  }

  type getConfigByKeyApiV1SystemConfigKeyConfigKeyGetParams = {
    config_key: string
  }

  type getDeptApiV1SystemDeptDeptIdGetParams = {
    dept_id: number
  }

  type getDictDataApiV1SystemDictDataDictCodeGetParams = {
    dict_code: number
  }

  type getDictDataByTypeApiV1SystemDictDataTypeDictTypeGetParams = {
    dict_type: string
  }

  type getDictDataOptionsApiV1SystemDictDataOptionsDictTypeGetParams = {
    dict_type: string
  }

  type getDictTypeApiV1SystemDictTypeDictIdGetParams = {
    dict_id: number
  }

  type getJobApiV1MonitorJobJobIdGetParams = {
    job_id: number
  }

  type getMenuApiV1SystemMenuMenuIdGetParams = {
    menu_id: number
  }

  type getPostApiV1SystemPostPostIdGetParams = {
    post_id: number
  }

  type getRoleApiV1SystemRoleRoleIdGetParams = {
    role_id: number
  }

  type getRoleMenusApiV1SystemMenuRoleRoleIdGetParams = {
    role_id: number
  }

  type getTableDetailApiV1MonitorDataTableTableNameGetParams = {
    table_name: string
  }

  type HTTPValidationError = {
    /** Detail */
    detail?: ValidationError[]
  }

  type JobCreate = {
    /** Job Name 任务名称 */
    job_name: string
    /** Job Group 任务组名 */
    job_group: string
    /** Invoke Target 调用目标字符串 */
    invoke_target: string
    /** Cron Expression cron执行表达式 */
    cron_expression?: string | null
    /** Misfire Policy 计划执行策略（1立即执行 2执行一次 3放弃执行） */
    misfire_policy?: string | null
    /** Concurrent 是否并发执行（0允许 1禁止） */
    concurrent?: string | null
    /** Status 状态（0正常 1暂停） */
    status?: string | null
    /** Remark 备注信息 */
    remark?: string | null
  }

  type JobLogOut = {
    /** Job Name 任务名称 */
    job_name: string
    /** Job Group 任务组名 */
    job_group: string
    /** Invoke Target 调用目标字符串 */
    invoke_target: string
    /** Job Message 日志信息 */
    job_message?: string | null
    /** Status 执行状态（0正常 1失败） */
    status?: string
    /** Exception Info 异常信息 */
    exception_info?: string | null
    /** Job Log Id */
    job_log_id: number
    /** Job Id */
    job_id?: number | null
    /** Start Time */
    start_time?: string | null
    /** End Time */
    end_time?: string | null
    /** Create Time */
    create_time: string
    /** Run Time */
    run_time?: number | null
  }

  type JobOut = {
    /** Job Name 任务名称 */
    job_name: string
    /** Job Group 任务组名 */
    job_group: string
    /** Invoke Target 调用目标字符串 */
    invoke_target: string
    /** Cron Expression cron执行表达式 */
    cron_expression?: string | null
    /** Misfire Policy 计划执行策略（1立即执行 2执行一次 3放弃执行） */
    misfire_policy?: string | null
    /** Concurrent 是否并发执行（0允许 1禁止） */
    concurrent?: string | null
    /** Status 状态（0正常 1暂停） */
    status?: string | null
    /** Remark 备注信息 */
    remark?: string | null
    /** Job Id */
    job_id: number
    /** Create By */
    create_by: string
    /** Create Time */
    create_time: string
    /** Update By */
    update_by?: string | null
    /** Update Time */
    update_time?: string | null
  }

  type JobUpdate = {
    /** Job Name 任务名称 */
    job_name?: string | null
    /** Job Group 任务组名 */
    job_group?: string | null
    /** Invoke Target 调用目标字符串 */
    invoke_target?: string | null
    /** Cron Expression cron执行表达式 */
    cron_expression?: string | null
    /** Misfire Policy 计划执行策略（1立即执行 2执行一次 3放弃执行） */
    misfire_policy?: string | null
    /** Concurrent 是否并发执行（0允许 1禁止） */
    concurrent?: string | null
    /** Status 状态（0正常 1暂停） */
    status?: string | null
    /** Remark 备注信息 */
    remark?: string | null
    /** Job Id 任务ID */
    job_id: number
  }

  type listConfigsApiV1SystemConfigListGetParams = {
    config_name?: string | null
    config_key?: string | null
    config_type?: string | null
    page?: number
    page_size?: number
  }

  type listDeptsApiV1SystemDeptGetParams = {
    dept_name?: string | null
    status?: string | null
  }

  type listDictDataApiV1SystemDictDataListGetParams = {
    page?: number
    page_size?: number
    dict_type?: string | null
    dict_label?: string | null
    status?: string | null
  }

  type listDictTypesApiV1SystemDictTypeListGetParams = {
    page?: number
    page_size?: number
    dict_name?: string | null
    dict_type?: string | null
    status?: string | null
  }

  type listJobLogsApiV1MonitorJobLogListGetParams = {
    job_name?: string | null
    job_group?: string | null
    status?: string | null
    page?: number
    page_size?: number
  }

  type listJobsApiV1MonitorJobListGetParams = {
    job_name?: string | null
    job_group?: string | null
    status?: string | null
    page?: number
    page_size?: number
  }

  type listMenusApiV1SystemMenuGetParams = {
    menu_name?: string | null
    status?: string | null
  }

  type listOnlineUsersApiV1MonitorOnlineListGetParams = {
    ipaddr?: string | null
    username?: string | null
    page?: number
    page_size?: number
  }

  type listPostsApiV1SystemPostListGetParams = {
    post_code?: string | null
    post_name?: string | null
    status?: string | null
    page?: number
    page_size?: number
  }

  type listRolesApiV1SystemRoleListGetParams = {
    role_name?: string | null
    role_key?: string | null
    status?: string | null
    page?: number
    page_size?: number
  }

  type MemInfo = {
    /** Total 总内存 */
    total?: number
    /** Used 已用内存 */
    used?: number
    /** Free 剩余内存 */
    free?: number
    /** Usage 内存使用率 */
    usage?: number
  }

  type MenuCreate = {
    /** Menu Name */
    menu_name: string
    /** Parent Id */
    parent_id?: number | null
    /** Order Num */
    order_num?: number | null
    /** Path */
    path?: string | null
    /** Component */
    component?: string | null
    /** Query */
    query?: string | null
    /** Is Frame */
    is_frame?: string | number | null
    /** Is Cache */
    is_cache?: string | number | null
    /** Menu Type */
    menu_type: string
    /** Visible */
    visible?: string | null
    /** Status */
    status?: string | null
    /** Perms */
    perms?: string | null
    /** Icon */
    icon?: string | null
    /** Remark */
    remark?: string | null
  }

  type MenuOut = {
    /** Menu Name */
    menu_name?: string | null
    /** Parent Id */
    parent_id?: number | null
    /** Order Num */
    order_num?: number | null
    /** Path */
    path?: string | null
    /** Component */
    component?: string | null
    /** Query */
    query?: string | null
    /** Is Frame */
    is_frame?: string | number | null
    /** Is Cache */
    is_cache?: string | number | null
    /** Menu Type */
    menu_type?: string | null
    /** Visible */
    visible?: string | null
    /** Status */
    status?: string | null
    /** Perms */
    perms?: string | null
    /** Icon */
    icon?: string | null
    /** Remark */
    remark?: string | null
    /** Menu Id */
    menu_id: number
    /** Create Time */
    create_time: string
    /** Update Time */
    update_time?: string | null
    /** Create By */
    create_by?: string | null
    /** Update By */
    update_by?: string | null
  }

  type MenuTree = {
    /** Menu Name */
    menu_name?: string | null
    /** Parent Id */
    parent_id?: number | null
    /** Order Num */
    order_num?: number | null
    /** Path */
    path?: string | null
    /** Component */
    component?: string | null
    /** Query */
    query?: string | null
    /** Is Frame */
    is_frame?: string | number | null
    /** Is Cache */
    is_cache?: string | number | null
    /** Menu Type */
    menu_type?: string | null
    /** Visible */
    visible?: string | null
    /** Status */
    status?: string | null
    /** Perms */
    perms?: string | null
    /** Icon */
    icon?: string | null
    /** Remark */
    remark?: string | null
    /** Menu Id */
    menu_id: number
    /** Children */
    children?: MenuTree[]
  }

  type MenuUpdate = {
    /** Menu Name */
    menu_name?: string | null
    /** Parent Id */
    parent_id?: number | null
    /** Order Num */
    order_num?: number | null
    /** Path */
    path?: string | null
    /** Component */
    component?: string | null
    /** Query */
    query?: string | null
    /** Is Frame */
    is_frame?: string | number | null
    /** Is Cache */
    is_cache?: string | number | null
    /** Menu Type */
    menu_type?: string | null
    /** Visible */
    visible?: string | null
    /** Status */
    status?: string | null
    /** Perms */
    perms?: string | null
    /** Icon */
    icon?: string | null
    /** Remark */
    remark?: string | null
  }

  type NetworkInfo = {
    /** Sent Bytes 发送字节数 */
    sent_bytes?: number
    /** Recv Bytes 接收字节数 */
    recv_bytes?: number
    /** Sent Packets 发送数据包数 */
    sent_packets?: number
    /** Recv Packets 接收数据包数 */
    recv_packets?: number
  }

  type OnlineUserOut = {
    /** Sessionid 用户会话id */
    sessionId: string
    /** User Id 用户ID */
    user_id?: number | null
    /** User Name 用户账号 */
    user_name?: string
    /** Ipaddr 登录IP地址 */
    ipaddr?: string
    /** Login Location 登录地点 */
    login_location?: string
    /** Browser 浏览器类型 */
    browser?: string
    /** Os 操作系统 */
    os?: string
    /** Status 在线状态on_line在线off_line离线 */
    status?: string
    /** Start Timestamp session创建时间 */
    start_timestamp?: string | null
    /** Last Access Time session最后访问时间 */
    last_access_time?: string | null
    /** Expire Time 超时时间，单位为分钟 */
    expire_time?: number
  }

  type PageInfo = {
    /** Page 当前页码 */
    page?: number
    /** Pagesize 每页大小 */
    pageSize?: number
    /** Total 总条数 */
    total?: number
  }

  type PageResponseModel = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** Rows 数据列表 */
    rows?: any[]
    pageInfo?: PageInfo
  }

  type PageResponseModelListConfigOut_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** Rows 数据列表 */
    rows?: ConfigOut[][]
    pageInfo?: PageInfo
  }

  type PageResponseModelListJobLogOut_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** Rows 数据列表 */
    rows?: JobLogOut[][]
    pageInfo?: PageInfo
  }

  type PageResponseModelListJobOut_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** Rows 数据列表 */
    rows?: JobOut[][]
    pageInfo?: PageInfo
  }

  type PageResponseModelListOnlineUserOut_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** Rows 数据列表 */
    rows?: OnlineUserOut[][]
    pageInfo?: PageInfo
  }

  type PageResponseModelPostOut_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** Rows 数据列表 */
    rows?: PostOut[]
    pageInfo?: PageInfo
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

  type PostBrief = {
    /** Post Id 岗位ID */
    post_id: number
    /** Post Name 岗位名称 */
    post_name: string
    /** Post Code 岗位编码 */
    post_code: string
  }

  type PostCreate = {
    /** Post Name */
    post_name: string
    /** Post Code */
    post_code: string
    /** Post Sort */
    post_sort: number
    /** Status */
    status?: string | null
    /** Remark */
    remark?: string | null
  }

  type PostOut = {
    /** Post Name */
    post_name?: string | null
    /** Post Code */
    post_code?: string | null
    /** Post Sort */
    post_sort?: number | null
    /** Status */
    status?: string | null
    /** Remark */
    remark?: string | null
    /** Post Id */
    post_id: number
    /** Create Time */
    create_time: string
    /** Update Time */
    update_time?: string | null
    /** Create By */
    create_by?: string | null
    /** Update By */
    update_by?: string | null
  }

  type PostUpdate = {
    /** Post Name */
    post_name?: string | null
    /** Post Code */
    post_code?: string | null
    /** Post Sort */
    post_sort?: number | null
    /** Status */
    status?: string | null
    /** Remark */
    remark?: string | null
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

  type ResponseModelConfigOut_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** 响应数据 */
    data?: ConfigOut | null
  }

  type ResponseModelDeptOut_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** 响应数据 */
    data?: DeptOut | null
  }

  type ResponseModelDict_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** Data 响应数据 */
    data?: Record<string, any> | null
  }

  type ResponseModelJobOut_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** 响应数据 */
    data?: JobOut | null
  }

  type ResponseModelListDeptOut_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** Data 响应数据 */
    data?: DeptOut[] | null
  }

  type ResponseModelListDeptTree_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** Data 响应数据 */
    data?: DeptTree[] | null
  }

  type ResponseModelListDict_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** Data 响应数据 */
    data?: Record<string, any>[] | null
  }

  type ResponseModelListMenuOut_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** Data 响应数据 */
    data?: MenuOut[] | null
  }

  type ResponseModelListMenuTree_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** Data 响应数据 */
    data?: MenuTree[] | null
  }

  type ResponseModelListPostOut_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** Data 响应数据 */
    data?: PostOut[] | null
  }

  type ResponseModelListRoleOut_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** Data 响应数据 */
    data?: RoleOut[] | null
  }

  type ResponseModelListStr_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** Data 响应数据 */
    data?: string[] | null
  }

  type ResponseModelMenuOut_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** 响应数据 */
    data?: MenuOut | null
  }

  type ResponseModelPostOut_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** 响应数据 */
    data?: PostOut | null
  }

  type ResponseModelRoleOut_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** 响应数据 */
    data?: RoleOut | null
  }

  type ResponseModelServerInfo_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** 响应数据 */
    data?: ServerInfo | null
  }

  type ResponseModelStr_ = {
    /** Code 响应状态码：200成功，其他为失败 */
    code?: number
    /** Msg 响应消息 */
    msg?: string
    /** Data 响应数据 */
    data?: string | null
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

  type RoleCreate = {
    /** Role Name */
    role_name: string
    /** Role Key */
    role_key: string
    /** Role Sort */
    role_sort: number
    /** Data Scope */
    data_scope?: string | null
    /** Status */
    status?: string | null
    /** Menu Ids */
    menu_ids?: number[] | null
  }

  type RoleOut = {
    /** Role Name */
    role_name?: string | null
    /** Role Key */
    role_key?: string | null
    /** Role Sort */
    role_sort?: number | null
    /** Data Scope */
    data_scope?: string | null
    /** Status */
    status?: string | null
    /** Role Id */
    role_id: number
    /** Create Time */
    create_time: string
    /** Update Time */
    update_time?: string | null
    /** Create By */
    create_by?: string | null
    /** Update By */
    update_by?: string | null
    /** Remark */
    remark?: string | null
  }

  type RoleUpdate = {
    /** Role Name */
    role_name?: string | null
    /** Role Key */
    role_key?: string | null
    /** Role Sort */
    role_sort?: number | null
    /** Data Scope */
    data_scope?: string | null
    /** Status */
    status?: string | null
    /** Menu Ids */
    menu_ids?: number[] | null
  }

  type runJobApiV1MonitorJobJobIdRunPostParams = {
    job_id: number
  }

  type ServerInfo = {
    cpu?: CpuInfo
    mem?: MemInfo
    sys?: SysInfo
    /** Disk 磁盘信息 */
    disk?: DiskInfo[]
    network?: NetworkInfo
  }

  type SysInfo = {
    /** Os Name 操作系统名称 */
    os_name?: string
    /** Os Version 系统版本 */
    os_version?: string
    /** Hostname 主机名 */
    hostname?: string
    /** Ip IP地址 */
    ip?: string
    /** Python Version Python版本 */
    python_version?: string
    /** Boot Time 启动时间 */
    boot_time?: string
    /** Run Time 运行时间 */
    run_time?: string
  }

  type Token = {
    /** Access Token 访问令牌 */
    access_token: string
    /** Token Type 令牌类型，通常是bearer */
    token_type: string
  }

  type updateConfigApiV1SystemConfigConfigIdPutParams = {
    config_id: number
  }

  type updateDeptApiV1SystemDeptDeptIdPutParams = {
    dept_id: number
  }

  type updateDictDataApiV1SystemDictDataDictCodePutParams = {
    dict_code: number
  }

  type updateDictTypeApiV1SystemDictTypeDictIdPutParams = {
    dict_id: number
  }

  type updateJobApiV1MonitorJobJobIdPutParams = {
    job_id: number
  }

  type updateMenuApiV1SystemMenuMenuIdPutParams = {
    menu_id: number
  }

  type updatePostApiV1SystemPostPostIdPutParams = {
    post_id: number
  }

  type updateRoleApiV1SystemRoleRoleIdPutParams = {
    role_id: number
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
    /** Posts 用户岗位列表 */
    posts?: PostBrief[] | null
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
