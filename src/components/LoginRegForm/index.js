import React, { PureComponent } from 'react';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';


class LoginRegForm extends PureComponent {

    state = {
        visible: true,
    };

    handleClick = () => {
        const { visible } = this.state;
        this.setState({
            visible: !visible,
        });
    };

    render() {
        const { onLogin, onRegister, onCheckUsername, onCaptcha, onSmsCode, loginLoading, registerLoading } = this.props;
        const { visible } = this.state;
        return (
            <div>
                {visible
                    ? <LoginForm onLogin={onLogin} gotoRegisterArea={this.handleClick} loading={loginLoading}/>
                    : <RegisterForm
                        onRegister={onRegister}
                        onCheckUsername={onCheckUsername}
                        onCaptcha={onCaptcha}
                        onSmsCode={onSmsCode}
                        gotoLoginArea={this.handleClick}
                        loading={registerLoading}/>
                }
            </div>
        );
    }
}

export default LoginRegForm;

