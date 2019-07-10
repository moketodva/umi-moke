import React from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Icon, Button, Layout, Menu, Card } from 'antd';
import API from '@/constant/background-api'

export default class Index extends React.Component {
    render() {
        return (
            <iframe
                style={{width:'100%', height:600, overflow:'visible'}}
                // onLoad={() => {
                //     const obj = ReactDOM.findDOMNode(this);
                //     this.setState({
                //         "iFrameHeight":  obj.contentWindow.document.body.scrollHeight + 'px'
                //     });
                // }}
                ref="iframe"
                src=# swagger地址
                width="100%"
                height='600'
                // scrolling="no"
                frameBorder="0"
            />
        );
    }
}
