import request from '@/utils/request';
import API from '@/constant/background-API'


export const weatherReq = () => {
    return request(API.ip.weather);
};

