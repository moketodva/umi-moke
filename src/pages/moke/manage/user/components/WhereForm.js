import React, { PureComponent } from 'react';
import { wrapAuth } from '@/utils/wrapAuth';
import {
    Form,
    Input,
    Button,
    Row,
    Col,
} from 'antd';

const AuthButton = wrapAuth(Button);

class WhereForm extends PureComponent {

    handleReset = () => {
        this.props.form.resetFields();
    };

    handleSearch = (e) => {
        e.preventDefault();
        const { form, onSearch } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                onSearch(values);
            }
        });
    };

    render() {
        const { form: { getFieldDecorator }, loading } = this.props;
        const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 },
        };
        return (
            <Form onSubmit={this.handleSearch} layout={'inline'}>
                <Row>
                    <Col md={12} xl={6}>
                        <Form.Item label={'用户名'} {...formItemLayout}>
                            {
                                getFieldDecorator('username', {
                                    rules: [
                                        {
                                            max: 30,
                                            message: '长度请控制在30以内',
                                        },
                                    ],
                                })(
                                    <Input placeholder={'请输入用户名'} style={{ width: 160 }}/>,
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col md={12} xl={6}>
                        <Form.Item label={'昵称'} {...formItemLayout}>
                            {
                                getFieldDecorator('nickname', {
                                    rules: [
                                        {
                                            max: 30,
                                            message: '长度请控制在30以内',
                                        },
                                    ],
                                })(
                                    <Input placeholder={'请输入昵称'} style={{ width: 160 }}/>,
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col md={12} xl={6}>
                        <Form.Item>
                            <AuthButton loading={loading} type={'primary'} htmlType={'submit'}
                                        permission='P_USER_QUERY'>查询</AuthButton>
                            <Button onClick={this.handleReset} style={{ marginLeft: 8 }}>重置</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create()(WhereForm);
