import React, { PureComponent } from 'react';
import {
    Modal,
    Form,
    Input,
} from 'antd';


class AddModal extends PureComponent {

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
        const { form: { getFieldDecorator }, visible, loading } = this.props;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        return (
            <Modal
                title={'角色信息'}
                visible={visible}
                okText={'保存'}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                confirmLoading={loading}
            >
                <Form {...formItemLayout} >
                    <Form.Item label={'角色名'} hasFeedback>
                        {
                            getFieldDecorator('name', {
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
                                <Input placeholder={'请输入角色名'} style={{ width: 160 }}/>,
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'角色描述'} hasFeedback>
                        {
                            getFieldDecorator('description', {
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
                                <Input placeholder={'请输入角色描述'} style={{ width: 160 }}/>,
                            )
                        }
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(AddModal);
