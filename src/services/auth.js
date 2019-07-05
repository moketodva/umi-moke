import request from '@/utils/request';
import API from '@/constant/background-api';


export const loginReq = data => {
    return request(API.auth.login, data, true);
};

export const registerReq = data => {
    return request(API.auth.register, data, true);
};

export const checkUsernameReq = data => {
    return request(API.auth.check, data, true);
};

export const captchaReq = data => {
    return request(API.captcha.id, data, true);
};

export const modifyPwdReq = data => {
    return request(API.auth.modifyPwd, data);
};

export const modifyUserInfoReq = data => {
    return request(API.auth.modifyInfo, data);
};

export const logoutReq = () => {
    return request(API.auth.logout);
};

export const smsCodeReq = data => {
    return request(API.captcha.sms, data, true);
};
