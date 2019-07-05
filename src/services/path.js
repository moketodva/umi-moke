import API from '@/constant/background-api';
import request from '@/utils/request';


export const listReq = data => {
    return request(API.path.list, data);
};

export const detailReq = data => {
    return request(API.path.detail, data);
};

export const addReq = data => {
    return request(API.path.add, data);
};

export const modifyReq = data => {
    return request(API.path.modify, data);
};

export const deleteBatchReq = data => {
    return request(API.path.deleteBatch, data);
};
