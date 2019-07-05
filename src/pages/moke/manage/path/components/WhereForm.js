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
            labelCol: { span: 12 },
            wrapperCol: { span: 12 },
        };
        return (
            <Form onSubmit={this.handleSearch} layout={'inline'}>
                <Row>
                    <Col md={12} xl={6}>
                        <Form.Item label={'接口名'} {...formItemLayout}>
                            {
                                getFieldDecorator('name', {
                                    rules: [
                                        {
                                            max: 30,
                                            message: '长度请控制在30以内',
                                        },
                                    ],
                                })(
                                    <Input placeholder={'请输入接口名'} style={{ width: 160 }}/>,
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col md={12} xl={8}>
                        <Form.Item label={'路径（ant格式）'} {...formItemLayout}>
                            {
                                getFieldDecorator('antUri', {
                                    rules: [
                                        {
                                            max: 120,
                                            message: '长度请控制在120以内',
                                        },
                                    ],
                                })(
                                    <Input placeholder={'请输入路径（ant格式）'} style={{ width: 160 }}/>,
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col  md={12} xl={6}>
                        <Form.Item>
                            <AuthButton loading={loading} type={'primary'} htmlType={'submit'}
                                        permission='P_PATH_QUERY'>查询</AuthButton>
                            <Button onClick={this.handleReset} style={{ marginLeft: 8 }}>重置</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create()(WhereForm);
