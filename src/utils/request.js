import qs from 'qs';
import axios from 'axios';
import { message } from 'antd';
import { router } from 'umi';
import {
    TOKEN_PREFIX_BEARER,
    HEADER_REQUEST_AUTHORIZATION,
    HEADER_RESPONSE_AUTHORIZATION,
    ROUTER,
    CODE_MESSAGE,
} from '@/constant/other';
import API from '@/constant/background-api';
import util from '@/utils/util';


const UNKNOWN_CODE_MESSAGE = '发生未知错误！！！';
const TIMEOUT_MESSAGE = '连接超时,请刷新试试';

const API_FORMAT_ERROR = 'api格式存在问题';
const CANCEL_AUTH_HEADER_CONFIG = 'isCancelAuth';

axios.defaults.baseURL = API.baseUrl;
axios.defaults.timeout = 8000;
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';


/**
 * 利用axios的请求拦截器
 * 做一些附带Token的操作
 */
axios.interceptors.request.use(
    config => {
        // 给请求自动带上Token（除了配置中包含特定的自定义信息的请求）
        if (config && !config.headers[CANCEL_AUTH_HEADER_CONFIG] && util.auth.get() != null) {
            config.headers[HEADER_REQUEST_AUTHORIZATION] = `${TOKEN_PREFIX_BEARER}${util.auth.get()}`;
        }
        // 将自定义的配置删除
        if (config && config.headers[CANCEL_AUTH_HEADER_CONFIG]) {
            delete config.headers[CANCEL_AUTH_HEADER_CONFIG];
        }
        return config;
    },
    error => {
        message.error(UNKNOWN_CODE_MESSAGE);
        console.error(error);
    },
);

/**
 * 利用axios的响应拦截器
 * 做一些接收响应的准备工作
 */
axios.interceptors.response.use(
    response => {
        if (response && response.headers && HEADER_RESPONSE_AUTHORIZATION in response.headers) {
            util.auth.save(response.headers[HEADER_RESPONSE_AUTHORIZATION]);
        }
        return response.data;
    },
    error => {
        // 响应code友好提示处理
        if (error && error.response) {
            if (CODE_MESSAGE[error.response.status]) {
                message.error(CODE_MESSAGE[error.response.status]);
                if (error.response.status === 401) {
                    util.auth.remove();
                    util.permission.remove();
                    router.push(ROUTER.AUTH_PATH);
                }
            } else {
                message.error(UNKNOWN_CODE_MESSAGE);
            }
        } else if (JSON.stringify(error).indexOf('timeout') !== -1) {
            message.error(TIMEOUT_MESSAGE);
        }
    },
);

const restfulUrlFormat = (url, data = {}) => {
    if (data === {}) {
        return;
    }

    let query = {};
    for (let key of Object.keys(data)) {
        if (!new RegExp(`:${key}`, 'g').test(url)) {
            query[key] = data[key];
        }
        url = url.replace(new RegExp(`:${key}`, 'g'), data[key]);
    }

    return {
        url,
        query,
    };
};

export default (api, data, isCancelAuth = false, config = {}) => {
    if (!api || !api.method || !api.path) {
        message.error(API_FORMAT_ERROR);
        console.error(API_FORMAT_ERROR);
        return;
    }

    let { method, path } = api;
    const {
        url,
        query,
    } = restfulUrlFormat(path, data);

    if ('GET' === method.toUpperCase() || 'DELETE' === method.toUpperCase() || 'HEAD' === method.toUpperCase()) {
        config.params = query;
    }

    if (isCancelAuth) {
        config.headers = {};
        config.headers[CANCEL_AUTH_HEADER_CONFIG] = true;
    }

    config.paramsSerializer = params => {
        return qs.stringify(params, { indices: false });
    };
    switch (method.toUpperCase()) {
        case 'POST':
            return axios.post(url, query, config);
        case 'PUT':
            return axios.put(url, query, config);
        case 'DELETE':
            return axios.delete(url, config);
        case 'HEAD':
            return axios.delete(url, config);
        default:
            return axios.get(url, config);
    }
};
