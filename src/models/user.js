import { message } from 'antd';
import util from '@/utils/util';
import * as Service from '@/services/user';
import {
    NAMESPACE,
    CODE
} from '@/constant/other';


export default {
    namespace: NAMESPACE.USER_MODEL,
    state:{
        list: [],
        detail:{},
        where: {},
        pagination:{
            current: 1,
            pageSize: 10,
            total: 0
        },
        sorter: {},
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
        * list( {payload}, {call, put} ){
            // 准备数据
            let {where, pagination, sorter, callback} = payload;
            if(pagination === undefined){
                pagination = {
                    current: 1,
                    pageSize: 10
                };
                yield put({
                    type: 'save',
                    payload:{where}
                });
            }
            yield put({
                type: 'save',
                payload:{sorter}
            });
            const tempSorter = util.other.sorterFormat(sorter);
            const params = {
                pageNum: pagination.current,
                pageSize: pagination.pageSize,
                sort: tempSorter.sort,
                isAsc: tempSorter.isAsc,
                ...where
            };
            // 请求后台
            const wrapper = yield call(Service.listReq, params);
            // 响应处理
            if(!wrapper) return;
            if(wrapper.code === CODE.OK){
                message.success(wrapper.msg);
                const {total, records} = wrapper.data;
                pagination.total = total;
                yield put({
                    type: 'save',
                    payload:{
                        list: records,
                        pagination
                    }
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
        * add( {payload}, {call, put, select} ){
            // 准备数据
            const {values, callback} = payload;
            values.password = util.encode.md5(values.password);
            // 请求后台
            const wrapper = yield call(Service.addReq, values);
            // 响应处理
            if(!wrapper) return;
            if(wrapper.code === CODE.OK){
                !callback || callback();
                const state = yield select(state => state[NAMESPACE.USER_MODEL]);
                yield put({
                    type: 'list',
                    payload:{
                        where: state.where,
                        pagination: state.pagination,
                        sorter: state.sorter
                    }
                });
            }else{
                message.error(wrapper.msg);
            }
        },
        * modify( {payload}, {call, put, select} ){
            // 准备数据
            const {values, callback} = payload;
            // 请求后台
            const wrapper = yield call(Service.modifyReq, values);
            // 响应处理
            if(!wrapper) return;
            if(wrapper.code === CODE.OK){
                !callback || callback();
                const state = yield select(state => state[NAMESPACE.USER_MODEL]);
                yield put({
                    type: 'list',
                    payload:{
                        where: state.where,
                        pagination: state.pagination,
                        sorter: state.sorter
                    }
                });
            }else{
                message.error(wrapper.msg);
            }
        },
        * deleteBatch( {payload}, {call, put, select} ){
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
                const state = yield select(state => state[NAMESPACE.USER_MODEL]);
                yield put({
                    type: 'list',
                    payload:{
                        where: state.where,
                        pagination: state.pagination,
                        sorter: state.sorter
                    }
                });
            }else{
                message.error(wrapper.msg);
            }
        },
        * enable( {payload}, {call, put, select} ){
            // 准备数据
            const {id} = payload;
            const data = {id};
            // 请求后台
            const wrapper = yield call(Service.enableReq, data);
            // 响应处理
            if(!wrapper) return;
            if(wrapper.code === CODE.OK){
                message.success(wrapper.msg);
                const state = yield select(state => state[NAMESPACE.USER_MODEL]);
                yield put({
                    type: 'list',
                    payload:{
                        where: state.where,
                        pagination: state.pagination,
                        sorter: state.sorter
                    }
                });
            }else{
                message.error(wrapper.msg);
            }
        },
        * disable( {payload}, {call, put, select} ){
            // 准备数据
            const {id} = payload;
            const data = {id};
            // 请求后台
            const wrapper = yield call(Service.disableReq, data);
            // 响应处理
            if(!wrapper) return;
            if(wrapper.code === CODE.OK){
                message.success(wrapper.msg);
                const state = yield select(state => state[NAMESPACE.USER_MODEL]);
                yield put({
                    type: 'list',
                    payload:{
                        where: state.where,
                        pagination: state.pagination,
                        sorter: state.sorter
                    }
                });
            }else{
                message.error(wrapper.msg);
            }
        }
    },
    // 监听路由
    subscriptions: {}
}
