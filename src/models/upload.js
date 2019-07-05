import * as Service from '@/services/upload';
import { NAMESPACE } from '@/constant/other';

export default {
    namespace: NAMESPACE.UPLOAD_MODEL,
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
        * uploadAvatar( {payload}, {call} ){
            const wrapper = yield call(Service.uploadAvatarReq, payload);
            return wrapper.data;
        }
    },
    subscriptions: {}
}
