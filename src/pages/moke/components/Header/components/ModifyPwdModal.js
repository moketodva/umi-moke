import React,{ PureComponent } from 'react'
import {
    Modal,
    Form,
    Input
} from 'antd'


class ModifyPwdModal extends PureComponent{
    state = {
        confirmDirty: false
    };

    handleOk = () => {
        const {form, onOk} = this.props;
        form.validateFields((err, values)=>{
            if(!err){
                onOk(values, ()=>{
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

    handleBlur = e => {
        const {value} = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    /**
     * 校验回调接口：强制让ConfirmPwd进行校验
     */
    validateToConfirmPwd = (_, value, callback) => {
        const {form} = this.props;
        const {confirmDirty} = this.state;
        if (value && confirmDirty) {
            form.validateFields(['confirmPwd'], { force: true });
        }
        callback();
    };

    /**
     * 校验回调接口：校验确认密码与密码是否一致
     */
    compareToPassword = (_, value, callback) => {
        const {form} = this.props;
        if (value && value !== form.getFieldValue('newPassword')) {
            callback('与密码不一致');
        } else {
            callback();
        }
    };

    render(){
        const {visible, loading, form: {getFieldDecorator}} = this.props;
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 15}
        };
        return(
            <Modal
                title={'密码修改'}
                visible={visible}
                okText={'保存'}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                confirmLoading={loading}
            >
                <Form.Item label={'旧密码'} {...formItemLayout} >
                    {
                        getFieldDecorator('oldPassword',{
                            rules:[
                                {
                                    required: true,
                                    message: '不能为空'
                                },{
                                    min: 6,
                                    max: 18,
                                    message: '长度请控制在在6-18范围内'
                                }
                            ]
                        })(
                            <Input.Password placeholder={'请输入旧密码'} style={{width: 130}}/>
                        )
                    }
                </Form.Item>
                <Form.Item label={'新密码'} {...formItemLayout} >
                    {
                        getFieldDecorator('newPassword',{
                            validateFirst: true,
                            rules:[
                                {
                                    required: true,
                                    message: '不能为空'
                                },{
                                    validator: this.validateToConfirmPwd,
                                },{
                                    min: 6,
                                    max: 18,
                                    message: '长度请控制在在6-18范围内'
                                }
                            ]
                        })(
                            <Input.Password placeholder={'请输入新密码'} style={{width: 130}}/>
                        )
                    }
                </Form.Item>
                <Form.Item label={'密码确认'} {...formItemLayout} >
                    {
                        getFieldDecorator('confirmPwd',{
                            validateFirst: true,
                            rules:[
                                {
                                    required: true,
                                    message: '不能为空'
                                },{
                                    min: 6,
                                    max: 18,
                                    message: '长度请控制在在6-18范围内'
                                },{
                                    validator: this.compareToPassword,
                                }
                            ]
                        })(
                            <Input.Password placeholder={'请输入密码确认'} style={{width: 130}} onBlur={this.handleBlur}/>
                        )
                    }
                </Form.Item>
            </Modal>
        );
    }
}

export default Form.create()(ModifyPwdModal);
