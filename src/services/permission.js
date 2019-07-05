import API from '@/constant/background-api';
import request from '@/utils/request';


export const listReq = data => {
    return request(API.permission.list, data);
};

export const detailReq = data => {
    return request(API.permission.detail, data);
};

export const addReq = data => {
    return request(API.permission.add, data);
};

export const modifyReq = data => {
    return request(API.permission.modify, data);
};

export const deleteBatchReq = data => {
    return request(API.permission.deleteBatch, data);
};

export const takeEffectReq = () => {
    return request(API.permission.takeEffect);
};
