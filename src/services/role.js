import request from '@/utils/request';
import API from '@/constant/background-api';


export const listReq = data => {
    return request(API.role.list, data);
};

export const detailReq = data => {
    return request(API.role.detail, data);
};

export const addReq = data => {
    return request(API.role.add, data);
};

export const modifyReq = data => {
    return request(API.role.modify, data);
};

export const deleteBatchReq = data => {
    return request(API.role.deleteBatch, data);
};

export const defaultReq = (data, config) => {
    return request(API.role.default, data, false, config);
};

export const setRouterReq = (data, config) => {
    return request(API.role.setRouter, data, false, config);
};

