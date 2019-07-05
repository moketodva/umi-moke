import React, { PureComponent } from 'react';
import {
    Modal,
    Form,
    Input,
} from 'antd';


class ModifyModal extends PureComponent {

    handleOk = () => {
        const { form, onOk } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                onOk(values, () => {
                    form.resetFields();
                });
            }
        });
    };

    handleCancel = () => {
        const { form, onCancel } = this.props;
        onCancel(() => {
            form.resetFields();
        });
    };

    render() {
        const { form: { getFieldDecorator }, visible, initialData, loading } = this.props;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        return (
            <Modal
                title={'权限信息'}
                visible={visible}
                okText={'保存'}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                confirmLoading={loading}
            >
                <Form {...formItemLayout} >
                    <Form.Item style={{ display: 'none' }}>
                        {
                            getFieldDecorator('id',
                                {
                                    initialValue: initialData.id,
                                },
                            )(
                                <Input/>,
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'权限名'} hasFeedback>
                        {
                            getFieldDecorator('name', {
                                initialValue: initialData.name,
                                rules: [
                                    {
                                        required: true,
                                        message: '不能为空',
                                    }, {
                                        max: 30,
                                        message: '长度请控制30以内',
                                    },
                                ],
                            })(
                                <Input placeholder={'请输入权限名'} style={{ width: 160 }}/>,
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'权限描述'} hasFeedback>
                        {
                            getFieldDecorator('description', {
                                initialValue: initialData.description,
                                rules: [
                                    {
                                        required: true,
                                        message: '不能为空',
                                    }, {
                                        max: 30,
                                        message: '长度请控制30以内',
                                    },
                                ],
                            })(
                                <Input placeholder={'请输入权限描述'} style={{ width: 160 }}/>,
                            )
                        }
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(ModifyModal);
