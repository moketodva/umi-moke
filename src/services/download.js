import request from '@/utils/request';
import API from '@/constant/background-API'


export const excelMapReq = (data, config) => {
    return request(API.download.excelMap, data, false, config);
};

