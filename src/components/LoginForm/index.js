import React from 'react';
import styles from './index.css';
import qr from '@/assets/qr.jpg';
import Title from '@/components/Title';
import { Form, Input, Icon, Button, Spin } from 'antd';

export default Form.create()(
    (props) => {
        const { onLogin, gotoRegisterArea, loading, form } = props;
        const { getFieldDecorator } = form;

        /**
         * 登录（事件处理）
         */
        const handleSubmit = e => {
            e.preventDefault();
            form.validateFields((err, values) => {
                if (!err) {
                    onLogin(values);
                }
            });
        };

        return (
            <Spin spinning={!!loading}>
                <div className={styles.wrapper}>
                    <Title value='登录界面'/>
                    <img src={qr} className={styles.qr_image} alt='扫码登录'/>
                    <Form onSubmit={handleSubmit}>
                        < Form.Item hasFeedback>
                            {
                                getFieldDecorator('username', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '不能为空',
                                        }, {
                                            min: 6,
                                            max: 18,
                                            message: '长度请控制在在6-18范围内',
                                        },
                                    ],
                                })(
                                    <Input placeholder='用户名' prefix={<Icon type='user'/>}/>,
                                )}
                        </ Form.Item>
                        < Form.Item hasFeedback>
                            {
                                getFieldDecorator('password',
                                    {
                                        rules: [
                                            {
                                                required: true,
                                                message: '不能为空',
                                            }, {
                                                min: 6,
                                                max: 18,
                                                message: '长度请控制在6-18范围内',
                                            },
                                        ],
                                    },
                                )(
                                    <Input.Password placeholder='密码' prefix={<Icon type='lock'/>}/>,
                                )
                            }
                        </ Form.Item>
                        <Button className={styles.login_button} type='primary' htmlType='submit'>登录</Button>
                        <div>
                            <a className={styles.goto_register} onClick={gotoRegisterArea}>
                                注册账号>>
                            </a>
                        </div>
                    </Form>
                </div>
            </Spin>
        );
    },
);

