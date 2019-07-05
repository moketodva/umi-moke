import React, { PureComponent } from 'react';
import SingleSelect from '@/components/SingleSelect';
import MultipleSelect from '@/components/MultipleSelect';
import AvatarUpload from '@/components/AvatarUpload';
import StringDatePicker from '@/components/StringDatePicker';
import API from '@/constant/background-api';
import util from '@/utils/util';
import { CODE_MESSAGE, HEADER_REQUEST_AUTHORIZATION, TOKEN_PREFIX_BEARER } from '@/constant/other';
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
} from 'antd';
import { message } from 'antd/lib/index';

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

    handleUsernameBlur = e => {
        if (e.target.value === '') return;
        this.isOnBluring = true;
        this.props.form.validateFields(['username'], { force: true });
    };

    /**
     * 手机号码（校验）
     */
    validatorPhone = (_, value, callback) => {
        if (!value) callback();
        /^1[34578]\d{9}$/.test(value) ? callback() : callback('手机号码格式错误');
    };

    /**
     * 邮箱（校验）
     */
    validatorEmail = (_, value, callback) => {
        if (!value) callback();
        /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(value) ? callback() : callback('邮箱格式错误');
    };

    /**
     * 校验用户名是否已经存在（校验）
     */
    validateUsername = (_, value, callback) => {
        if (!this.isOnBluring) {
            callback();
            return;
        }
        const { form, onCheckUsername } = this.props;
        if (!form.getFieldError('username') && value) {
            onCheckUsername(value, callback);
        }
        this.isOnBluring = false;
    };

    render() {
        const { form: { getFieldDecorator }, visible, roleData, loading, roleLoading } = this.props;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const phonePrefix = getFieldDecorator('phonePrefix', {
            initialValue: '86',
        })(
            <Select>
                <Select.Option value='86'>+86</Select.Option>
            </Select>,
        );
        return (
            <Modal
                title={'用户信息'}
                visible={visible}
                okText={'保存'}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                confirmLoading={loading}
            >
                <Form {...formItemLayout} >
                    <Form.Item label={'头像'}>
                        {
                            getFieldDecorator('avatar',
                                {
                                    valuePropName: 'avatar',
                                },
                            )(
                                <AvatarUpload
                                    name='file'
                                    onError={response => {
                                        if(!response){
                                            message.error('系统异常');
                                        }
                                        if(CODE_MESSAGE[response.code]){
                                            message.error(CODE_MESSAGE[response.code]);
                                        }
                                    }}
                                    action={API.baseUrl + API.upload.avatar.path}
                                    headers={{ [HEADER_REQUEST_AUTHORIZATION]: TOKEN_PREFIX_BEARER + util.auth.get() }}/>,
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'用户名'} hasFeedback>
                        {
                            getFieldDecorator('username', {
                                rules: [
                                    {
                                        required: true,
                                        message: '不能为空',
                                    }, {
                                        min: 6,
                                        max: 30,
                                        message: '长度请控制在6-30范围内',
                                    }, {
                                        validator: this.validateUsername,
                                    },
                                ],
                            })(
                                <Input placeholder={'请输入用户名'} style={{ width: 160 }} onBlur={this.handleUsernameBlur}/>,
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'密码'} hasFeedback>
                        {
                            getFieldDecorator('password', {
                                rules: [
                                    {
                                        required: true,
                                        message: '不能为空',
                                    }, {
                                        min: 6,
                                        max: 30,
                                        message: '长度请控制在6-30范围内',
                                    },
                                ],
                            })(
                                <Input.Password placeholder={'请输入密码'} style={{ width: 160 }}/>,
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'手机号'} hasFeedback>
                        {
                            getFieldDecorator('phone', {
                                validateFirst: true,
                                rules: [
                                    {
                                        required: true,
                                        message: '不能为空',
                                    }, {
                                        validator: this.validatorPhone,
                                    },
                                ],
                            })(
                                <Input addonBefore={phonePrefix} placeholder={'请输入手机号'} style={{ width: 260 }}/>,
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'昵称'} hasFeedback>
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
                    <Form.Item label={'角色'} hasFeedback>
                        {
                            getFieldDecorator('roleIds')(
                                <MultipleSelect dataSource={() => roleData.map(role => {
                                    return { value: role.id, text: role.description };
                                })} style={{ width: 300 }} loading={roleLoading}/>,
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'出生日期'} hasFeedback>
                        {
                            getFieldDecorator('birthday')(
                                <StringDatePicker style={{ width: 130 }}/>,
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'年龄'} hasFeedback>
                        {
                            getFieldDecorator('age')(
                                <InputNumber min={0} max={150} style={{ width: 60 }}/>,
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'性别'} hasFeedback>
                        {
                            getFieldDecorator('gender', {
                                initialValue: '0',
                            })(
                                <SingleSelect dataSource={() => util.dict.findByType('gender')} style={{ width: 70 }}/>,
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'邮箱'} hasFeedback>
                        {
                            getFieldDecorator('email', {
                                rules: [
                                    {
                                        validator: this.validatorEmail,
                                    },
                                ],
                            })(
                                <Input placeholder={'请输入邮箱'} style={{ width: 200 }}/>,
                            )
                        }
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(AddModal);
