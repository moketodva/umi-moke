import request from '@/utils/request'
import API from '@/constant/background-api'


export const allReq = () => {
    return request(API.router.all);
};

export const menuReq = () => {
    return request(API.router.menu);
};

export const checkedReq = data => {
    return request(API.router.checked, data);
};

export const detailReq = data => {
    return request(API.router.detail, data);
};

export const addReq = data => {
    return request(API.router.add, data);
};

export const modifyReq = data => {
    return request(API.router.modify, data);
};

export const deleteBatchReq = data => {
    return request(API.router.deleteBatch, data);
};
