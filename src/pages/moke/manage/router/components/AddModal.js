import React, { PureComponent } from 'react';
import {
    Modal,
    Form,
    Input,
    Switch,
    InputNumber,
} from 'antd';
import SingleSelect from '@/components/SingleSelect';


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
        const { form: { getFieldDecorator }, visible, loading, selectedKey, type, permissionData, permissionLoading } = this.props;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        return (
            <Modal
                title={'路由信息'}
                visible={visible}
                okText={'保存'}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                confirmLoading={loading}
            >
                {type === '1'
                    ? <Form {...formItemLayout} >
                        <Form.Item style={{ display: 'none' }}>
                            {
                                getFieldDecorator('parentId', {
                                    initialValue: selectedKey,
                                })(<Input/>)
                            }
                        </Form.Item>
                        <Form.Item style={{ display: 'none' }}>
                            {
                                getFieldDecorator('type', {
                                    initialValue: type,
                                })(<Input/>)
                            }
                        </Form.Item>
                        <Form.Item label={'操作名'} hasFeedback>
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
                                    <Input placeholder={'请输入操作名'} style={{ width: 160 }}/>,
                                )
                            }
                        </Form.Item>
                        <Form.Item label={'权限'} hasFeedback>
                            {
                                getFieldDecorator('permissionId')(
                                    <SingleSelect dataSource={() => permissionData.map(permission => {
                                        return { value: permission.id, text: permission.description };
                                    })} style={{ width: 300 }} allowClear={true} loading={permissionLoading}/>,
                                )
                            }
                        </Form.Item>
                        <Form.Item label={'图标'} hasFeedback>
                            {
                                getFieldDecorator('icon', {
                                    rules: [
                                        {
                                            max: 30,
                                            message: '长度请控制30以内',
                                        },
                                    ],
                                })(
                                    <Input placeholder={'请输入图标'} style={{ width: 160 }}/>,
                                )
                            }
                        </Form.Item>
                        <Form.Item label={'排序号'} hasFeedback>
                            {
                                getFieldDecorator('sortNum', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '不能为空',
                                        },
                                    ],
                                })(
                                    <InputNumber min={0} max={999} step={0.01} style={{ width: 160 }}/>,
                                )
                            }
                        </Form.Item>
                        <Form.Item label={'是否启用'}>
                            {
                                getFieldDecorator('isActive', {
                                    valuePropName: 'checked',
                                    initialValue: false,
                                })(
                                    <Switch/>,
                                )
                            }
                        </Form.Item>
                    </Form>
                    : <Form {...formItemLayout} >
                        <Form.Item style={{ display: 'none' }}>
                            {
                                getFieldDecorator('parentId', {
                                    initialValue: selectedKey,
                                })(<Input/>)
                            }
                        </Form.Item>
                        <Form.Item style={{ display: 'none' }}>
                            {
                                getFieldDecorator('type', {
                                    initialValue: type,
                                })(<Input/>)
                            }
                        </Form.Item>
                        <Form.Item label={'路由名'} hasFeedback>
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
                                    <Input placeholder={'请输入路由名'} style={{ width: 160 }}/>,
                                )
                            }
                        </Form.Item>
                        <Form.Item label={'权限'} hasFeedback>
                            {
                                getFieldDecorator('permissionId')(
                                    <SingleSelect dataSource={() => permissionData.map(permission => {
                                        return { value: permission.id, text: permission.description };
                                    })} style={{ width: 300 }} allowClear={true} loading={permissionLoading}/>,
                                )
                            }
                        </Form.Item>
                        <Form.Item label={'路由相对路径'} hasFeedback>
                            {
                                getFieldDecorator('relativePath', {
                                    rules: [
                                       {
                                            max: 30,
                                            message: '长度请控制30以内',
                                        },
                                    ],
                                })(
                                    <Input placeholder={'请输入路由相对路径'} style={{ width: 160 }}/>,
                                )
                            }
                        </Form.Item>
                        <Form.Item label={'组件路径'} hasFeedback>
                            {
                                getFieldDecorator('component', {
                                    rules: [
                                        {
                                            max: 30,
                                            message: '长度请控制30以内',
                                        },
                                    ],
                                })(
                                    <Input placeholder={'请输入组件路径'} style={{ width: 160 }}/>,
                                )
                            }
                        </Form.Item>
                        <Form.Item label={'图标'} hasFeedback>
                            {
                                getFieldDecorator('icon', {
                                    rules: [
                                        {
                                            max: 30,
                                            message: '长度请控制30以内',
                                        },
                                    ],
                                })(
                                    <Input placeholder={'请输入图标'} style={{ width: 160 }}/>,
                                )
                            }
                        </Form.Item>
                        <Form.Item label={'排序号'} hasFeedback>
                            {
                                getFieldDecorator('sortNum', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '不能为空',
                                        },
                                    ],
                                })(
                                    <InputNumber min={0} max={999} step={0.01} style={{ width: 160 }}/>,
                                )
                            }
                        </Form.Item>
                        <Form.Item label={'是否精准匹配'}>
                            {
                                getFieldDecorator('exact', {
                                    valuePropName: 'checked',
                                    initialValue: false,
                                })(
                                    <Switch/>,
                                )
                            }
                        </Form.Item>
                        <Form.Item label={'是否启用'}>
                            {
                                getFieldDecorator('isActive', {
                                    valuePropName: 'checked',
                                    initialValue: false,
                                })(
                                    <Switch/>,
                                )
                            }
                        </Form.Item>
                    </Form>
                }
            </Modal>
        );
    }
}

export default Form.create()(AddModal);
