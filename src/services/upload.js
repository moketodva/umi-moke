import request from '@/utils/request';
import API from '@/constant/background-API'


export const uploadAvatarReq = (data) => {
    return request(API.upload.avatar, data);
};

