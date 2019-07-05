import { message } from 'antd';
import * as Service from '@/services/router';
import {
    NAMESPACE,
    CODE
} from '@/constant/other'

export default {
    namespace: NAMESPACE.ROUTER_MODEL,
    state:{
        all: [],
        checked: [],
        menu: [],
    },
    reducers:{
        save( state, {payload} ){
            return {
                ...state,
                ...payload
            }
        }
    },
    effects:{
        * all( {payload}, {call, put} ){
            // 请求后台
            const wrapper = yield call(Service.allReq);
            // 响应处理
            if(!wrapper) return;
            if(wrapper.code === CODE.OK){
                yield put({
                    type: 'save',
                    payload:{all: wrapper.data}
                });
            }else{
                message.error(wrapper.msg);
            }
        },
        * menu( {payload}, {call, put} ){
            // 请求后台
            const wrapper = yield call(Service.menuReq);
            // 响应处理
            if(!wrapper) return;
            if(wrapper.code === CODE.OK){
                const router = wrapper.data[0].children;
                yield put({
                    type: 'save',
                    payload:{menu: router}
                });
            }else{
                message.error(wrapper.msg);
            }
        },
        * checked( {payload}, {call, put} ){
            const {id, callback} = payload;
            const data = {roleId: id};
            // 请求后台
            const wrapper = yield call(Service.checkedReq, data);
            // 响应处理
            if(!wrapper) return;
            if(wrapper.code === CODE.OK){
                yield put({
                    type: 'save',
                    payload:{checked: wrapper.data}
                });
                !callback || callback();
            }else{
                message.error(wrapper.msg);
            }
        },
        * detail( {payload}, {call, put} ){
            // 准备数据
            const {id, callback} = payload;
            const data = {id};
            // 请求后台
            const wrapper = yield call(Service.detailReq, data);
            // 响应处理
            if(!wrapper) return;
            if(wrapper.code === CODE.OK){
                yield put({
                    type: 'save',
                    payload:{detail: wrapper.data}
                });
                !callback || callback();
            }else{
                message.error(wrapper.msg);
            }
        },
        * add( {payload}, {call, put} ){
            // 准备数据
            const {values, callback} = payload;
            // 请求后台
            const wrapper = yield call(Service.addReq, values);
            // 响应处理
            if(!wrapper) return;
            if(wrapper.code === CODE.OK){
                !callback || callback();
                yield put({type: 'all'});
            }else{
                message.error(wrapper.msg);
            }
        },
        * modify( {payload}, {call, put} ){
            // 准备数据
            const {values, callback} = payload;
            // 请求后台
            const wrapper = yield call(Service.modifyReq, values);
            // 响应处理
            if(!wrapper) return;
            if(wrapper.code === CODE.OK){
                message.success(wrapper.msg);
                !callback || callback();
                yield put({type: 'all'});
            }else{
                message.error(wrapper.msg);
            }
        },
        * deleteBatch( {payload}, {call, put} ){
            // 准备数据
            const {ids, callback} = payload;
            const data = {ids};
            // 请求后台
            const wrapper = yield call(Service.deleteBatchReq, data);
            // 响应处理
            if(!wrapper) return;
            if(wrapper.code === CODE.OK){
                message.success(`成功删除${ids.length}条记录`);
                !callback || callback();
                yield put({type: 'all'});
            }else{
                message.error(wrapper.msg);
            }
        }
    },
    subscriptions:{}
}
