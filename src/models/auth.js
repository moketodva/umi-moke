import { router } from 'umi';
import { message } from 'antd';
import util from '@/utils/util';
import * as Service from '@/services/auth';
import {
    NAMESPACE,
    CODE,
    ROUTER,
} from '@/constant/other';

export default {
    namespace: NAMESPACE.AUTH_MODEL,
    state: {},
    reducers: {
        save(state, {payload}) {
            return {
                ...state,
                ...payload,
            };
        }
    },
    effects: {
        * login( {payload}, {call} ) {
            // 准备数据
            payload.password = util.encode.md5(payload.password);
            // 请求后台
            const wrapper = yield call(Service.loginReq, payload);
            // 响应处理
            if(!wrapper) return;
            if(wrapper.code === CODE.OK){
                // 存令牌
                util.auth.save(wrapper.data.token);
                // 存权限
                util.permission.save(wrapper.data.user.permissions);
                const rootPath = util.route.getRootPath();
                if(!rootPath){
                    message.error('系统异常，请联系管理员！');
                    return;
                }
                router.push(rootPath);
            }else{
                message.error(wrapper.msg);
            }
        },
        * register( {payload}, {call} ) {
            // 准备数据
            const {values, callback} = payload;
            values.password = util.encode.md5(values.password);
            delete values.confirmPwd;
            // 请求后台
            const wrapper = yield call(Service.registerReq, values);
            // 响应处理
            if(!wrapper) return;
            if(wrapper.code === CODE.OK){
                message.success(wrapper.msg);
                !callback || callback();
            }else{
                message.error(wrapper.msg);
            }
        },
        * checkUsername( {payload}, {call} ) {
            // 准备数据
            const {value, callback} = payload;
            const data = {username: value};
            // 请求后台
            const wrapper = yield call(Service.checkUsernameReq, data);
            // 响应处理
            if(!wrapper) return;
            if(wrapper.code === CODE.OK){
                !callback || callback();
            }else{
                !callback || callback(wrapper.msg);
            }
        },
        * captcha( {payload}, {call} ) {
            // 准备数据
            const callback = payload;
            // 请求后台
            const wrapper = yield call(Service.captchaReq);
            // 响应处理
            if(!wrapper) return;
            if(wrapper.code === CODE.OK){
                !callback || callback(wrapper.data);
            }else{
                message.error(wrapper.msg);
            }
        },
        * modifyPwd( {payload}, {call} ) {
            // 准备数据
            const {values, callback} = payload;
            values.oldPassword = util.encode.md5(values.oldPassword);
            values.newPassword = util.encode.md5(values.newPassword);
            delete values.confirmPwd;
            // 请求后台
            const wrapper = yield call(Service.modifyPwdReq, values);
            // 响应处理
            if(!wrapper) return;
            if(wrapper.code === CODE.OK){
                util.auth.remove();
                message.success(wrapper.msg);
                !callback || callback();
            }else{
                message.error(wrapper.msg);
            }
        },
        * modifyUserInfo( {payload}, {call, put} ){
            // 准备数据
            const {values, callback} = payload;
            // 请求后台
            const wrapper = yield call(Service.modifyUserInfoReq, values);
            // 响应处理
            if(!wrapper) return;
            if(wrapper.code === CODE.OK){
                message.success(wrapper.msg);
                !callback || callback();
                const id = util.auth.getUserId();
                yield put({
                    type: `${NAMESPACE.USER_MODEL}/detail`,
                    payload:{id}
                });
            }else{
                message.error(wrapper.msg);
            }
        },
        * logout( _, {call} ) {
            // 请求后台
            const wrapper = yield call(Service.logoutReq);
            // 响应处理
            if(!wrapper) return;
            if(wrapper.code === CODE.OK){
                // 移除令牌
                util.auth.remove();
                // 移除权限
                util.permission.remove();
                message.success(wrapper.msg);
                router.push(ROUTER.AUTH_PATH);
            }else{
                message.error(wrapper.msg);
            }
        },
        * smsCode( {payload}, {call} ) {
            // 准备数据
            const {data, callback} = payload;
            // 请求后台
            const wrapper = yield call(Service.smsCodeReq, data);
            // 响应处理
            if(!wrapper) return;
            if(wrapper.code === CODE.OK){
                !callback || callback();
            }else{
                message.error(wrapper.msg);
            }
        }
    }
};




