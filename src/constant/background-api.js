export default {
    baseUrl: # 后端api根路径,
    // baseUrl: 'http://localhost:8000/api',
    captcha:{
        id:{
            path: '/captcha/id',
            method: 'GET'
        },
        pic:{
            path: '/captcha/pic',
            method: 'GET'
        },
        sms:{
            path: '/captcha/sms',
            method: 'GET'
        }
    },
    auth: {
        login: {
            path: '/auth/login',
            method: 'POST'
        },
        register: {
            path: '/auth/register',
            method: 'POST'
        },
        check: {
            path: '/auth/check',
            method: 'GET'
        },
        modifyPwd: {
            path: '/auth/pwd',
            method: 'PUT'
        },
        modifyInfo: {
            path: '/auth/info',
            method: 'PUT'
        },
        logout: {
            path: '/auth/logout',
            method: 'PUT'
        }
    },
    dict: {
        list: {
            path: '/dict',
            method: 'GET'
        },
        detail: {
            path: '/dict/:id',
            method: 'GET'
        },
        add: {
            path: '/dict',
            method:'POST'
        },
        deleteBatch: {
            path: '/dict',
            method: 'DELETE'
        },
        modify: {
            path: '/dict/:id',
            method: 'PUT'
        }
    },
    router: {
        allForRegister: {
            path: '/router',
            method: 'GET'
        },
        menu: {
            path: '/router/menu',
            method: 'GET'
        },
        current: {
            path: '/router/current',
            method: 'GET'
        },
        all: {
            path: '/router/all',
            method: 'GET'
        },
        checked: {
            path: '/router/checked/:roleId',
            method: 'GET'
        },
        add: {
            path: '/router',
            method:'POST'
        },
        deleteBatch: {
            path: '/router',
            method: 'DELETE'
        },
        modify: {
            path: '/router/:id',
            method: 'PUT'
        }
    },
    user: {
        list: {
            path: '/user',
            method: 'GET'
        },
        detail: {
            path: '/user/:id',
            method: 'GET'
        },
        add: {
            path: '/user',
            method:'POST'
        },
        deleteBatch: {
            path: '/user',
            method: 'DELETE'
        },
        modify: {
            path: '/user/:id',
            method: 'PUT'
        },
        enable: {
            path: '/user/enable/:id',
            method: 'PUT'
        },
        disable: {
            path: '/user/disable/:id',
            method: 'PUT'
        },
        setRole: {
            path: '/user/setRole/:id',
            method: 'PUT'
        }
    },
    role: {
        list: {
            path: '/role',
            method: 'GET'
        },
        detail: {
            path: '/role/:id',
            method: 'GET'
        },
        add: {
            path: '/role',
            method:'POST'
        },
        modify: {
            path: '/role/:id',
            method: 'PUT'
        },
        deleteBatch: {
            path: '/role',
            method: 'DELETE'
        },
        default: {
            path: '/role/default/:id',
            method: 'PUT'
        },
        setRouter: {
            path: '/role/router/:id',
            method: 'PUT'
        }
    },
    path: {
        list: {
            path: '/path',
            method: 'GET'
        },
        detail: {
            path: '/path/:id',
            method: 'GET'
        },
        add: {
            path: '/path',
            method:'POST'
        },
        deleteBatch: {
            path: '/path',
            method: 'DELETE'
        },
        modify: {
            path: '/path/:id',
            method: 'PUT'
        }
    },
    permission: {
        list: {
            path: '/permission',
            method: 'GET'
        },
        detail: {
            path: '/permission/:id',
            method: 'GET'
        },
        add: {
            path: '/permission',
            method:'POST'
        },
        deleteBatch: {
            path: '/permission',
            method: 'DELETE'
        },
        modify: {
            path: '/permission/:id',
            method: 'PUT'
        },
        takeEffect: {
            path: '/permission/takeEffect',
            method: 'PUT'
        }
    },
    ip: {
        weather: {
            path: '/ip/weather',
            method: 'GET'
        }
    },
    upload: {
        avatar: {
            path: '/upload/avatar',
            method: 'POST'
        },
        base64Avatar: {
            path: '/upload/base64/avatar',
            method: 'POST'
        }
    },
    download: {
        excel: {
            path: '/download/excel',
            method: 'POST'
        },
        excelMap: {
            path: '/download/excel/map',
            method: 'POST'
        }
    },
    druid: '/druid',
    interface: '/swagger-ui.html'
}
