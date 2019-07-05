import API from '@/constant/background-api';
import request from '@/utils/request';


export const listReq = data => {
    return request(API.dict.list, data);
};

export const detailReq = data => {
    return request(API.dict.detail, data);
};

export const addReq = data => {
    return request(API.dict.add, data);
};

export const modifyReq = data => {
    return request(API.dict.modify, data);
};

export const deleteBatchReq = data => {
    return request(API.dict.deleteBatch, data);
};
