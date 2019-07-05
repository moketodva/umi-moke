import React,{ PureComponent } from 'react'
import SingleSelect from '@/components/SingleSelect'
import AvatarUpload from '@/components/AvatarUpload'
import StringDatePicker from '@/components/StringDatePicker'
import API from '@/constant/background-api'
import util from '@/utils/util'
import {
    HEADER_REQUEST_AUTHORIZATION,
    TOKEN_PREFIX_BEARER,
    CODE_MESSAGE
} from '@/constant/other'
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    message
} from 'antd'


class ModifyUserInfoModal extends PureComponent{

    handleOk = () => {
        const {form, onOk} = this.props;
        form.validateFields((err, values) => {
            if(!err){
                onOk(values, () => {
                    form.resetFields();
                });
            }
        });
    };

    handleCancel = () => {
        const {form, onCancel} = this.props;
        onCancel(() => {
            form.resetFields();
        });
    };

    /**
     * 手机号码（校验）
     */
    validatorPhone = (_, value, callback) => {
        if(!value) callback();
        /^1[34578]\d{9}$/.test(value) ? callback() : callback('手机号码格式错误');
    };

    /**
     * 邮箱（校验）
     */
    validatorEmail = (_, value, callback) => {
        if(!value) callback();
        /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(value) ? callback() : callback('邮箱格式错误');
    };

    render(){
        const {getFieldDecorator} = this.props.form;
        const {visible, initialData, loading} = this.props;
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const phonePrefix = getFieldDecorator('phonePrefix', {
            initialValue: initialData.phonePrefix
        })(
            <Select >
                <Select.Option value='86'>+86</Select.Option>
            </Select>
        );
        return(
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
                                    initialValue: initialData.avatar
                                }
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
                                    headers={{[HEADER_REQUEST_AUTHORIZATION]: TOKEN_PREFIX_BEARER + util.auth.get()}}/>
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'手机号'}  hasFeedback>
                        {
                            getFieldDecorator('phone',{
                                initialValue: initialData.phone,
                                validateFirst: true,
                                rules:[
                                    {
                                        required: true,
                                        message: '不能为空'
                                    },{
                                        validator: this.validatorPhone
                                    }
                                ]
                            })(
                                <Input addonBefore={phonePrefix}  placeholder={'请输入手机号'} style={{width: 260}}/>
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'昵称'} hasFeedback>
                        {
                            getFieldDecorator('nickname',{
                                initialValue: initialData.nickname,
                                rules:[
                                    {
                                        max: 30,
                                        message: '长度请控制30以内'
                                    }
                                ]
                            })(
                                <Input placeholder={'请输入昵称'} style={{width: 160}}/>
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'出生日期'} hasFeedback>
                        {
                            getFieldDecorator('birthday', {
                                initialValue: initialData.birthday,
                            })(
                                <StringDatePicker style={{width: 130}}/>
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'年龄'}  hasFeedback>
                        {
                            getFieldDecorator('age', {
                                initialValue: initialData.age,
                            })(
                                <InputNumber min={0} max={150} style={{width: 60}}/>
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'性别'} hasFeedback>
                        {
                            getFieldDecorator('gender',{
                                initialValue: initialData.gender,
                            })(
                                <SingleSelect dataSource={() => util.dict.findByType('gender')} style={{width: 70}}/>
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'邮箱'} hasFeedback>
                        {
                            getFieldDecorator('email', {
                                initialValue: initialData.email,
                                rules:[
                                    {
                                        validator: this.validatorEmail
                                    }
                                ]
                            })(
                                <Input placeholder={'请输入邮箱'} style={{width: 200}}/>
                            )
                        }
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(ModifyUserInfoModal);
