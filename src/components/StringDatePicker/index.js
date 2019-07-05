import React, { PureComponent } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';


class StringDatePicker extends PureComponent {

    constructor(props) {
        super(props);
        const value = props.value || props.defaultValue;
        this.state = { value };
    }

    componentWillReceiveProps(nextProps) {
        const value = 'value' in nextProps ? nextProps.value : nextProps.defaultValue;
        this.setState({ value });
    }

    handleChange = momentValue => {
        const value = !momentValue ? null : momentValue.format('YYYY-MM-DD');
        if (!('value' in this.props)) {
            this.setState({ value });
        }

        const { onChange } = this.props;
        !onChange || onChange(value);
    };

    render() {
        const { value } = this.state;
        const { style } = this.props;
        const momentValue = !value ? null : moment(value, 'YYYY-MM-DD');
        return (
            <DatePicker onChange={this.handleChange} value={momentValue} style={style}/>
        );
    }
}

StringDatePicker.propTypes = {
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    style: PropTypes.object,
};
export default StringDatePicker;
