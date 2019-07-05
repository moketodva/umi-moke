import React, {Component} from 'react';
import {connect} from 'dva';
import {router} from 'umi'
import ModifyUserInfoModal from './components/ModifyUserInfoModal'
import ModifyPwdModal from './components/ModifyPwdModal'
import styles from './index.css';
import util from '@/utils/util';
import {
    NAMESPACE,
    ROUTER
} from '@/constant/other';
import {
    Dropdown,
    Avatar,
    Menu
} from 'antd'

class Header extends Component{

    state = {
        modifyPwdModalVisible: false,
        modifyUserInfoModalVisible: false
    };

    componentWillMount(){
        const id = util.auth.getUserId();
        this.props.axiosDetailUser({id});
        // this.props.axiosIpWeather();
    }

    handleMenuClick = ({key})=>{
        switch (key){
            case '1':
                this.setState({settingModalVisible: true});
                break;
            case '2':
                this.setState({modifyPwdModalVisible: true});
                break;
            case '99':
                this.props.axiosLogout();
                break;
            default:
        }
    };
    handleAvatarClick = () => {
        this.setState({modifyUserInfoModalVisible: true});
    };

    handleModifyPwdOk = (values, callback) => {
        this.props.axiosModifyPwd({
            values,
            callback: () => {
                this.setState({modifyPwdModalVisible: false}, callback);
                router.push(ROUTER.AUTH_PATH);
            }
        });
    };

    handleModifyPwdCancel = () => {
        this.setState({modifyPwdModalVisible: false});
    };

    handleModifyUserInfoOk = (values, callback) => {
        this.props.axiosModifyUserInfo({
            values,
            callback: () => {
                this.setState({modifyUserInfoModalVisible: false}, callback);
            }
        });
    };

    handleModifyUserInfoCancel = callback => {
        this.setState({modifyUserInfoModalVisible: false}, callback);
    };

    render(){
        const {modifyPwdModalVisible, modifyUserInfoModalVisible} = this.state;
        const {userDetail, weather, modifyPwdLoading, modifyUserInfoLoading} = this.props;
        const renderMenu = () => (
            <Menu onClick={this.handleMenuClick}>
                {/*<Menu.Item key={1}>个人设置</Menu.Item>*/}
                <Menu.Item key={2}>密码修改</Menu.Item>
                <Menu.Divider/>
                <Menu.Item key={99}>注销</Menu.Item>
            </Menu>
        );
        return (
            <div>
                <div className={styles.nav_area}>
                    <div className={styles.nav_wrap}>
                        <Dropdown overlay={renderMenu} placement='bottomRight' >
                            {userDetail && userDetail.avatar
                                ?<Avatar
                                    size={52}
                                    src={userDetail.avatar}
                                    onClick={this.handleAvatarClick}
                                    style={{cursor: 'pointer'}}
                                    alt='编辑个人信息' />
                                :<Avatar
                                    size={52}
                                    icon='user'
                                    onClick={this.handleAvatarClick}
                                    style={{cursor: 'pointer'}}
                                    alt='编辑个人信息' />
                            }
                        </Dropdown>
                    </div>
                </div>
                <div className={styles.bread_area}>
                    <div className={styles.bread_wrap}>

                    </div>
                </div>
                <ModifyPwdModal
                    loading={modifyPwdLoading}
                    visible={modifyPwdModalVisible}
                    onOk={this.handleModifyPwdOk}
                    onCancel={this.handleModifyPwdCancel} />
                <ModifyUserInfoModal
                    loading={modifyUserInfoLoading}
                    visible={modifyUserInfoModalVisible}
                    onOk={this.handleModifyUserInfoOk}
                    onCancel={this.handleModifyUserInfoCancel}
                    initialData={userDetail} />
            </div>
        );
    }
}

const mapStateToProps = ( {user, ip, loading} ) => {
    return {
        userDetail: user.detail,
        weather: ip.weather,
        modifyPwdLoading: loading.effects[`${NAMESPACE.AUTH_MODEL}/modifyPwd`],
        modifyUserInfoLoading: loading.effects[`${NAMESPACE.AUTH_MODEL}/modifyUserInfo`]
    }
};

const mapDispatchToProps = dispatch => {
    return {
        axiosModifyPwd: payload => {
            dispatch({
                type:`${NAMESPACE.AUTH_MODEL}/modifyPwd`,
                payload
            });
        },
        axiosLogout: () => {
            dispatch({
                type:`${NAMESPACE.AUTH_MODEL}/logout`
            });
        },
        axiosDetailUser: payload => {
            dispatch({
                type:`${NAMESPACE.USER_MODEL}/detail`,
                payload
            });
        },
        axiosModifyUserInfo: payload => {
            dispatch({
                type:`${NAMESPACE.AUTH_MODEL}/modifyUserInfo`,
                payload
            });
        },
        axiosIpWeather: () => {
            dispatch({
                type:`${NAMESPACE.IP_MODAL}/weather`
            });
        }
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Header);
