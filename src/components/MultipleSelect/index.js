import React, { PureComponent } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';

const Option = Select.Option;

class MultipleSelect extends PureComponent {

    constructor(props) {
        super(props);
        const value = props.value || props.defaultValue;
        this.state = { value };
    }

    componentWillReceiveProps(nextProps) {
        const value = 'value' in nextProps ? nextProps.value : nextProps.defaultValue;
        this.setState({ value });
    }

    handleChange = value => {
        if (!('value' in this.props)) {
            this.setState({ value });
        }

        const { onChange } = this.props;
        !onChange || onChange(value);
    };

    render() {
        const { value } = this.state;
        const { dataSource, mode, style, loading } = this.props;
        /**
         * data: [{
         *      value:string
         *      text:string
         * }]
         */
        const data = typeof dataSource === 'function' ? dataSource() : dataSource;

        const renderOptions = (data = []) => {
            return data.map(option => <Option key={option.value} value={option.value}>{option.text}</Option>);
        };
        return (
            <Select
                mode={!mode ? 'multiple' : mode}
                value={value}
                onChange={this.handleChange}
                loading={loading}
                style={style}>
                {renderOptions(data)}
            </Select>
        );
    }
}

MultipleSelect.propTypes = {
    dataSource: PropTypes.oneOfType([
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
        }).isRequired,
        PropTypes.func.isRequired,
    ]),
    value: PropTypes.arrayOf(PropTypes.string),
    defaultValue: PropTypes.arrayOf(PropTypes.string),
    style: PropTypes.object,
    mode: PropTypes.string,
};
export default MultipleSelect;
