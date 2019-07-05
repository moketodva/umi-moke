import { message } from 'antd';
import * as Service from '@/services/ip';
import {
    CODE,
    NAMESPACE
} from '@/constant/other';


export default {
    namespace: NAMESPACE.IP_MODAL,
    state:{
        weather:{}
    },
    reducers:{
        save( state,{payload} ){
            return {
                ...state,
                ...payload
            }
        }
    },
    effects:{
        * weather( {payload}, {call, put}){
            // 请求后台
            const wrapper = yield call(Service.weatherReq);
            // 响应处理
            if(!wrapper) return;
            if(wrapper.code === CODE.OK){
                yield put({
                    type: 'save',
                    payload:{weather: wrapper.data}
                });
            }else{
                message.error(wrapper.msg);
            }
        }
    },
    subscriptions: {}
}
