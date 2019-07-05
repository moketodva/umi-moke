import React, { PureComponent } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';

const Option = Select.Option;

class SingleSelect extends PureComponent {

    constructor(props) {
        super(props);
        const value = props.value || props.defaultValue;
        this.state = { value };
    }

    componentWillReceiveProps(nextProps) {
        let value = 'value' in nextProps ? nextProps.value : nextProps.defaultValue;
        value = !value ? '': value;
        this.setState({ value });
    }

    handleChange = value => {
        if (!('value' in this.props)) {
            this.setState({ value });
        }
        value = !value ? '': value;
        const { onChange } = this.props;
        !onChange || onChange(value);
    };

    render() {
        const { value } = this.state;
        const { dataSource, allowClear, loading, style } = this.props;
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
                showSearch
                allowClear={allowClear}
                value={value}
                onChange={this.handleChange}
                loading={loading}
                style={style}
                optionFilterProp="children"
                filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {renderOptions(data)}
            </Select>
        );
    }
}

SingleSelect.propTypes = {
    dataSource: PropTypes.oneOfType([
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
        }).isRequired,
        PropTypes.func.isRequired,
    ]),
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    style: PropTypes.object,
};
export default SingleSelect;
