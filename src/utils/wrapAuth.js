import React, { Component } from 'react';
import util from '@/utils/util';
import { message, Button } from 'antd'

export let wrapAuth = ComposedComponent => class WrapComponent extends Component {
    render() {
        if (this.props.permission && util.permission.check(this.props.permission)) {
            return <ComposedComponent  {...this.props} />;
        } else {
            return <ComposedComponent  {...this.props} disabled={true} onClick={() => message.warn('抱歉，您没有该权限！')}/>;
        }
    }
};
