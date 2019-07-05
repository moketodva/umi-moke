import * as Service from '@/services/download';
import { NAMESPACE } from '@/constant/other';

export default {
    namespace: NAMESPACE.DOWNLOAD_MODEL,
    state:{},
    reducers:{
        save( state,{payload} ){
            return {
                ...state,
                ...payload
            }
        }
    },
    effects:{
        * exportExcelMap( {payload}, {call}){
            const params = payload;
            const config = {responseType: 'blob'};
            // 请求后台
            const content = yield call(Service.excelMapReq, params, config);
            const blob = new Blob([content], {type: 'application/vnd.ms-excel;charset=utf-8'});
            const fileName = 'moke.xls';
            // 非IE下载
            if ('download' in document.createElement('a')) {
                const elink = document.createElement('a');
                // 文件名
                elink.download = fileName;
                elink.style.display = 'none';
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                // 下载
                elink.click();
                // 释放URL 对象
                URL.revokeObjectURL(elink.href);
                document.body.removeChild(elink);
            } else { // IE10+下载
                navigator.msSaveBlob(blob, fileName);
            }
        }
    },
    subscriptions: {}
}
