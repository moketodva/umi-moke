import React, { Component } from 'react';
import { Menu, Dropdown, Button, Icon } from 'antd';

class DropdownButton extends Component {

    render() {
        const { icon, type, dataSource, onClick, children } = this.props;
        const renderMenu = (dataSource = []) =>
            <Menu onClick={onClick}>
                {dataSource.map(item => <Menu.Item key={item.key}>{item.text}</Menu.Item>)}
            </Menu>;

        return (
            <Dropdown overlay={() => renderMenu(dataSource)}>
                <Button icon={icon} type={type}>
                    {children} <Icon type="down"/>
                </Button>
            </Dropdown>
        );
    }
}

export default DropdownButton;
