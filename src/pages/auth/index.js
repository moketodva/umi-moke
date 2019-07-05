import React,{Component} from 'react';
import {connect} from 'dva';
import LoginRegForm from '@/components/LoginRegForm';
import PicNav from '@/components/BasePicNav'
import {NAMESPACE} from '@/constant/other'
import styles from './index.css';
import {
    Row,
    Col
} from 'antd';

class AuthPage extends Component{

    constructor(props){
        super(props);
        this.picNavList= [
            {
                key: 0,
                name: 'QQ群',
                iconfont: {
                    default: 'icon-qq',
                },
                url: '//shang.qq.com/wpa/qunwpa?idkey=6367feb5feb7fe081da77af873c7c9061d452798144858c3e9458675c0bcc695',
                alt: '加入QQ群'
            }
        ]
    }

    /**
     * 登录
     */
    handleLogin = values => {
        this.props.axiosLogin(values);
    };

    /**
     * 注册
     */
    handleRegister = (values, callback) => {
        this.props.axiosRegister({values, callback});
    };

    /**
     * 用户名是否可用
     */
    handleCheckUsername = (value, callback) => {
        this.props.axiosCheckUsername({value, callback});
    };

    /**
     * 验证码
     */
    handleCaptcha = callback => {
        this.props.axiosCaptcha(callback);
    };

    /**
     * 短信验证码
     */
    handleSmsCode= values => {
        this.props.axiosSmsCode(values);
    };

    render(){
        const picNavList = this.picNavList;
        const {loginLoading, registerLoading} = this.props;
        return(
            <div className={styles.wrapper}>
                <Row className={styles.header}>
                    <Col span={4} offset={2}/>
                    <Col span={18} >
                        <div className={styles.pic_nav_box}>
                            <PicNav data={picNavList}/>
                        </div>
                    </Col>
                </Row>
                <Row className={styles.content}>
                    <Col span={24}>
                        <div className={styles.login_register_form_box}>
                            <LoginRegForm
                                onLogin={this.handleLogin}
                                onRegister={this.handleRegister}
                                onCheckUsername={this.handleCheckUsername}
                                onCaptcha={this.handleCaptcha}
                                onSmsCode={this.handleSmsCode}
                                loginLoading={loginLoading}
                                registerLoading={registerLoading} />
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = ( {loading} ) => {
    return {
        loginLoading: loading.effects[`${NAMESPACE.AUTH_MODEL}/login`],
        registerLoading: loading.effects[`${NAMESPACE.AUTH_MODEL}/register`]
    };
};

const mapDispatchToProps = dispatch => {
    return {
        axiosLogin: payload => {
            dispatch({
                type: `${NAMESPACE.AUTH_MODEL}/login`,
                payload
            });
        },
        axiosRegister: payload => {
            dispatch({
                type: `${NAMESPACE.AUTH_MODEL}/register`,
                payload
            });
        },
        axiosCheckUsername: payload => {
            dispatch({
                type: `${NAMESPACE.AUTH_MODEL}/checkUsername`,
                payload
            });
        },
        axiosCaptcha: payload => {
            dispatch({
                type: `${NAMESPACE.AUTH_MODEL}/captcha`,
                payload
            });
        },
        axiosSmsCode: payload => {
            dispatch({
                type: `${NAMESPACE.AUTH_MODEL}/smsCode`,
                payload
            });
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthPage);
