import React, { Component } from 'react';
import { Button } from 'antd';

class CountDownButton extends Component {

    state = {
        time: 0,
    };

    handleClick = e => {
        const { onClick } = this.props;
        onClick(e, () => this.countdown(60));
    };

    countdown = time => {
        if (time >= 1) {
            time--;
            this.setState({
                time,
            });
            setTimeout(() => {
                this.countdown(time);
            }, 1000);
        }
    };

    render() {
        const { text, style } = this.props;
        const { time } = this.state;
        return (
            <Button disabled={time !== 0} onClick={this.handleClick}
                    style={style}>{time === 0 ? text : `${time}s后重新获取`}</Button>
        );
    }
}

export default CountDownButton;
