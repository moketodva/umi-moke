import React, { Component } from 'react';
import { Redirect } from 'umi';
import Error from '@/pages/404';
import { ROUTER } from '@/constant/other';
import util from '@/utils/util';

class Authoritied extends Component {
    render() {
        const { route, children } = this.props;
        const jwt = util.auth.get();
        const isLogin = !!jwt;
        const isAuth = util.permission.check(route.permission);
        if (!isLogin) {
            return <Redirect to={ROUTER.AUTH_PATH}/>;
        }
        if (!isAuth) {
            return <Error/>;
        }
        return <div>{children}</div>;
    }
}

export default Authoritied;

