import React, { PureComponent } from 'react';
import { Link } from 'umi';
import styles from './index.css';
import Title from '@/components/Title';
import CountDownButton from '@/components/CountDownButton';
import API from '@/constant/background-api';
import { ROUTER } from '@/constant/other';
import {
    Form,
    Input,
    Button,
    Spin,
    Checkbox,
    Select,
    Row,
    Col, Icon,
} from 'antd';

class RegisterForm extends PureComponent {

    /**
     * 构造函数
     */
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            captchaId: '',
        };
        this.isOnBluring = false;
    }

    /**
     * 生命周期函数
     */
    componentWillMount() {
        // 请求验证码Id（后端接口）
        this.handleClick();
    }

    /**
     * 注册（事件处理）
     */
    handleSubmit = e => {
        e.preventDefault();
        const { form, onRegister, gotoLoginArea } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                // 注册（后端接口）
                onRegister(values, () => {
                    form.resetFields();
                    gotoLoginArea();
                });
            }
        });
    };

    handleBlur = (e, type) => {
        const { value } = e.target;
        switch (type) {
            case 'username':
                if (value === '') return;
                this.isOnBluring = true;
                this.props.form.validateFields(['username'], { force: true });
                break;
            case 'confirmPwd':
                this.setState({ confirmDirty: this.state.confirmDirty || !!value });
                break;
            default:
        }
    };

    /**
     * 验证码图片（事件处理）
     */
    handleClick = () => {
        // 获取新验证码图片（后端接口）
        const { onCaptcha } = this.props;
        onCaptcha(captchaId => {
            this.setState({ captchaId });
        });
    };

    /**
     * 校验用户名是否已经存在（校验）
     */
    confirmUserName = (_, value, callback) => {
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

    /**
     * 强制让ConfirmPwd进行校验（校验）
     */
    validateToConfirmPwd = (_, value, callback) => {
        const { form } = this.props;
        const { confirmDirty } = this.state;
        if (value && confirmDirty) {
            form.validateFields(['confirmPwd'], { force: true });
        }
        callback();
    };

    /**
     * 确认密码与密码是否一致（校验）
     */
    compareToPassword = (_, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('与密码不一致');
        } else {
            callback();
        }
    };

    /**
     * 是否同意服务条款（校验）
     */
    validatorTos = (_, value, callback) => {
        value ? callback() : callback('需同意服务条款才能注册');
    };

    /**
     * 手机号格式（校验）
     */
    validatorPhone = (_, value, callback) => {
        if (!value) callback();
        /^1[34578]\d{9}$/.test(value) ? callback() : callback('手机号码有误');
    };

    /**
     * 发送短信验证码（事件处理）
     */
    handleSmsCode = (e, callback) => {
        const { form, onSmsCode } = this.props;
        const phonePrefix = form.getFieldValue('phonePrefix');
        const phone = form.getFieldValue('phone');
        form.validateFields(['phone'], { force: true });
        if (!form.getFieldError('phone')) {
            callback();
            // 发送短信验证码（后端接口）
            onSmsCode({
                data: {
                    phonePrefix,
                    phone,
                },
            });
        }
    };

    render() {
        const { gotoLoginArea, loading, form: { getFieldDecorator } } = this.props;
        const { captchaId } = this.state;
        const formItemLayout = {
            wrapperCol: {
                span: 24,
            },
        };
        const phonePrefix = getFieldDecorator('phonePrefix', {
            initialValue: '86',
        })(
            <Select>
                <Select.Option value='86'>+86</Select.Option>
            </Select>,
        );

        return (
            <Spin spinning={!!loading}>
                <Form {...formItemLayout} onSubmit={this.handleSubmit} className={styles.register_form}>
                    <Title value='注册界面'/>
                    <Form.Item hasFeedback>
                        {
                            getFieldDecorator('username',
                                {
                                    rules: [
                                        {
                                            validateTrigger: 'onChange',
                                            required: true,
                                            message: '用户名不能为空',
                                        }, {
                                            validateTrigger: 'onChange',
                                            min: 6,
                                            max: 18,
                                            message: '长度请控制在6-18范围内',
                                        }, {
                                            validator: this.confirmUserName,
                                        },
                                    ],
                                },
                            )(
                                <Input placeholder='用户名（必填）' onBlur={e => this.handleBlur(e, 'username')}/>,
                            )
                        }
                    </Form.Item>
                    <Form.Item hasFeedback>
                        {
                            getFieldDecorator('password',
                                {
                                    validateFirst: true,
                                    rules: [
                                        {
                                            required: true,
                                            message: '不能为空',
                                        }, {
                                            validator: this.validateToConfirmPwd,
                                        }, {
                                            min: 6,
                                            max: 18,
                                            message: '长度请控制在6-18范围内',
                                        },
                                    ],
                                },
                            )(
                                <Input.Password placeholder='密码（必填）'/>,
                            )
                        }
                    </Form.Item>
                    <Form.Item hasFeedback>
                        {
                            getFieldDecorator('confirmPwd',
                                {
                                    validateFirst: true,
                                    rules: [
                                        {
                                            required: true,
                                            message: '不能为空',
                                        }, {
                                            validator: this.compareToPassword,
                                        }, {
                                            min: 6,
                                            max: 18,
                                            message: '长度请控制在6-18范围内',
                                        },
                                    ],
                                },
                            )(
                                <Input.Password placeholder='确认密码（必填）' onBlur={e => this.handleBlur(e, 'confirmPwd')}/>,
                            )
                        }
                    </Form.Item>
                    <Form.Item hasFeedback>
                        {
                            getFieldDecorator('phone',
                                {
                                    validateFirst: true,
                                    rules: [
                                        {
                                            required: true,
                                            message: '不能为空',
                                        }, {
                                            validator: this.validatorPhone,
                                        },
                                    ],
                                },
                            )(
                                <Input addonBefore={phonePrefix} placeholder='手机号（必填）'/>,
                            )
                        }
                    </Form.Item>
                    <Row gutter={8}>
                        <Col span={14}>
                            <Form.Item hasFeedback>
                                {
                                    getFieldDecorator('smsCode',
                                        {
                                            validateFirst: true,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                }, {
                                                    min: 6,
                                                    max: 6,
                                                    message: '短信验证码长度有误',
                                                },
                                            ],
                                        },
                                    )(
                                        <Input placeholder='短信验证码（必填）'/>,
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={9}>
                            <CountDownButton text='获取验证码' onClick={this.handleSmsCode}
                                             style={{ verticalAlign: '-9px' }}/>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={14}>
                            <Form.Item hasFeedback>
                                {
                                    getFieldDecorator('captcha',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                }, {
                                                    min: 4,
                                                    max: 4,
                                                    message: '验证码长度有误',
                                                },
                                            ],
                                        },
                                    )(
                                        <Input placeholder='验证码（必填）'/>,
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={9}>
                            {
                                captchaId !== ''
                                    ? <img style={{ width: 80, height: 30, verticalAlign: '-19px', cursor: 'pointer' }}
                                           src={'/api' + API.captcha.pic.path + '/' + captchaId}
                                           onClick={this.handleClick} alt='验证码'/>
                                    : <Icon type='loading' style={{fontSize: 30,width: 80, height: 30, verticalAlign: '-19px', backgroundColor: 'white'}}/>
                            }
                        </Col>
                    </Row>
                    <Form.Item style={{ display: 'none' }}>
                        {
                            getFieldDecorator('captchaId',
                                {
                                    initialValue: captchaId,
                                },
                            )(
                                <Input/>,
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {
                            getFieldDecorator('tos',
                                {
                                    initialValue: false,
                                    valuePropName: 'checked',
                                    rules: [
                                        {
                                            validator: this.validatorTos,
                                        },
                                    ],
                                },
                            )(
                                <Checkbox>我已经阅读<Link to={ROUTER.TOS_PATH} target='_blank'>《服务条款》</Link></Checkbox>,
                            )
                        }
                    </Form.Item>
                    <Row>
                        <Col span={6}>
                            <a className={styles.goto_login} onClick={gotoLoginArea}>
                                &lt;&lt;登录
                            </a>
                        </Col>
                        <Col span={18}>
                            <Button className={styles.register_button} type='primary' htmlType='submit'>注册</Button>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        );
    }
}

export default Form.create()(RegisterForm);
