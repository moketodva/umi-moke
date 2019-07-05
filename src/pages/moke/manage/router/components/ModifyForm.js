import React, { PureComponent } from 'react';
import { wrapAuth } from '@/utils/wrapAuth';
import {
    InputNumber,
    Form,
    Input,
    Switch,
    Button,
} from 'antd';
import SingleSelect from '@/components/SingleSelect';

const AuthButton = wrapAuth(Button);

class ModifyForm extends PureComponent {

    handleReset = () => {
        this.props.form.resetFields();
    };

    handleSubmit = e => {
        e.preventDefault();
        const { form, onOk } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                onOk(values);
            }
        });
    };

    render() {
        const { form: { getFieldDecorator }, initialData, permissionData, loading, permissionLoading } = this.props;
        const formItemLayout = {
            labelCol: { md: 12, xl: 12 },
            wrapperCol: { md:12, xl: 12},
        };
        const buttonFormItemLayout = {
            wrapperCol: { offset: 8, span: 16 },
        };
        return (
            initialData.type === '1'
                ? <Form {...formItemLayout} onSubmit={this.handleSubmit}>
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
                    <Form.Item label={'操作名'} hasFeedback>
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
                                <Input placeholder={'请输入操作名'} style={{ width: 160 }}/>,
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
                    <Form.Item label={'图标'} hasFeedback>
                        {
                            getFieldDecorator('icon', {
                                initialValue: initialData.icon,
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
                                initialValue: initialData.sortNum,
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
                                initialValue: !!initialData.isActive,
                            })(
                                <Switch/>,
                            )
                        }
                    </Form.Item>
                    <Form.Item {...buttonFormItemLayout}>
                        <AuthButton loading={loading} type={'primary'} htmlType={'submit'}
                                    permission='P_ROUTER_MODIFY'>保存</AuthButton>
                        <Button onClick={this.handleReset} style={{ marginLeft: 8 }}>重置</Button>
                    </Form.Item>
                </Form>
                : <Form {...formItemLayout} onSubmit={this.handleSubmit}>
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
                    <Form.Item label={'路由名'} hasFeedback>
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
                                <Input placeholder={'请输入路由名'} style={{ width: 160 }}/>,
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
                    <Form.Item label={'路由相对路径'} hasFeedback>
                        {
                            getFieldDecorator('relativePath', {
                                initialValue: initialData.relativePath,
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
                                initialValue: initialData.component,
                                rules: [
                                    {
                                        max: 30,
                                        message: '长度请控制30以内',
                                    },
                                ],
                            })(
                                <Input placeholder={'请输入组件路径'} style={{ width: 200 }}/>,
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'图标'} hasFeedback>
                        {
                            getFieldDecorator('icon', {
                                initialValue: initialData.icon,
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
                                initialValue: initialData.sortNum,
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
                                initialValue: initialData.exact,
                            })(
                                <Switch/>,
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'是否启用'}>
                        {
                            getFieldDecorator('isActive', {
                                valuePropName: 'checked',
                                initialValue: !!initialData.isActive,
                            })(
                                <Switch/>,
                            )
                        }
                    </Form.Item>
                    <Form.Item {...buttonFormItemLayout}>
                        <AuthButton loading={loading} type={'primary'} htmlType={'submit'}
                                    permission='P_ROUTER_MODIFY'>保存</AuthButton>
                        <Button onClick={this.handleReset} style={{ marginLeft: 8 }}>重置</Button>
                    </Form.Item>
                </Form>
        );
    }
}

export default Form.create()(ModifyForm);
