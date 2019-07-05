// 命名空间
export const NAMESPACE = {
    // 认证模块
    AUTH_MODEL: 'auth',
    // 用户模块
    USER_MODEL: 'user',
    // 角色模块
    ROLE_MODEL: 'role',
    // 数据字典模块
    DICT_MODEL: 'dict',
    // 路由模块
    ROUTER_MODEL: 'router',
    // 接口模块
    PATH_MODEL: 'path',
    // 下载
    DOWNLOAD_MODEL: 'download',
    // 上传
    UPLOAD_MODEL: 'upload',
    // IP相关
    IP_MODAL: 'ip',
    // 权限
    PERMISSION_MODEL: 'permission'
};

// 信息提醒
export const MESSAGE = {
    // 数据没收到（业务码收到,但数据没有）
    NON_ACCEPT: '没接收到数据'
};

// 业务码
export const CODE = {
    // 成功
    OK: 0,
};

// 本地存储的key
export const STORE_KEY = {
    // 令牌
    TOKEN: 'jwtToken',
    // 用户
    USER: 'user',
    // 个人设置
    SETTING: 'setting',
    // 数据字典
    DICT: 'dict',
    // 路由
    ROUTER: 'router',
    // 权限
    PERMISSION: 'permission',
    // 根路径
    ROOT_PATH: 'root_path'
};

// 令牌前缀
export const TOKEN_PREFIX_BEARER = 'Bearer ';
// 请求认证头
export const HEADER_REQUEST_AUTHORIZATION= 'Authorization';
// 响应认证头
export const HEADER_RESPONSE_AUTHORIZATION= 'authorization';

// 路由路径
export const ROUTER = {
    // 登录
    AUTH_PATH: '/auth',
    // 服务条款
    TOS_PATH: '/auth/tos'
};

export const CODE_MESSAGE = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    405: '请求方法是不合法的',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    415: '请求的Content-Type是不合法的',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};
