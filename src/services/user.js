import request from '@/utils/request';
import API from '@/constant/background-API'


export const listReq = data => {
    return request(API.user.list, data);
};

export const detailReq = data => {
    return request(API.user.detail, data);
};

export const addReq = data => {
    return request(API.user.add, data);
};

export const modifyReq = data => {
    return request(API.user.modify, data);
};

export const deleteBatchReq = data => {
    return request(API.user.deleteBatch, data);
};

export const enableReq = data => {
    return request(API.user.enable, data);
};

export const disableReq = data => {
    return request(API.user.disable, data);
};
