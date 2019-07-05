import React, { PureComponent } from 'react';
import SingleSelect from '@/components/SingleSelect';
import {
    Modal,
    Form,
    Input,
    Switch,
} from 'antd';
import util from '@/utils/util';

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
        const { form: { getFieldDecorator }, visible, initialData, permissionData, loading, permissionLoading } = this.props;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        return (
            <Modal
                title={'接口信息'}
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
                    <Form.Item label={'接口名'} hasFeedback>
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
                                <Input placeholder={'请输入接口名'} style={{ width: 160 }}/>,
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'路径（ant格式）'} hasFeedback>
                        {
                            getFieldDecorator('antUri', {
                                initialValue: initialData.antUri,
                                rules: [
                                    {
                                        required: true,
                                        message: '不能为空',
                                    }, {
                                        max: 120,
                                        message: '长度请控制120以内',
                                    },
                                ],
                            })(
                                <Input placeholder={'请输入路径（ant格式）'} style={{ width: 160 }}/>,
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'请求方式'} hasFeedback>
                        {
                            getFieldDecorator('method', {
                                initialValue: initialData.method
                            })(
                                <SingleSelect dataSource={() => util.dict.findByType('method')} style={{ width: 160 }} allowClear={true}/>,
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'权限'} hasFeedback>
                        {
                            getFieldDecorator('permissionId', {
                                initialValue: initialData.permissionId,
                            })(
                                <SingleSelect dataSource={() => permissionData.map(permission => {
                                    return { value: permission.id, text: permission.description };
                                })} style={{ width: 300 }} allowClear={true} loading={permissionLoading}/>,
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'是否启用'}>
                        {
                            getFieldDecorator('isActive', {
                                valuePropName: 'checked',
                                initialValue: !!initialData.isActive ,
                            })(<Switch/>)
                        }
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(ModifyModal);
