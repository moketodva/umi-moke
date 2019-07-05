import React, { PureComponent } from 'react';
import {
    Icon,
    Tree,
    Input,
} from 'antd';

const { TreeNode } = Tree;

class SearchTree extends PureComponent {

    getExpandedKeys = (value, dataSource, key) => {
        let expandedKeysArray = [];
        const expandedKeys = dataSource
            .map(item => {
                if (item.children && item.children.length > 0) {
                    const childExpandedKeys = this.getExpandedKeys(value, item.children, item.key);
                    expandedKeysArray.push(...childExpandedKeys);
                }
                if (item.title.indexOf(value) > -1) {
                    return key;
                }
                return null;
            })
            .filter((item, i, self) => item && self.indexOf(item) === i);
        expandedKeysArray.push(...expandedKeys);
        return expandedKeysArray;
    };

    handleSearch = value => {
        const { dataSource, onSearch } = this.props;
        const expandedKeys = this.getExpandedKeys(value, dataSource);
        onSearch(value, expandedKeys);
    };

    render() {
        const { dataSource, showIcon, onExpand, expandedKeys, autoExpandParent, checkable, onCheck, checkedKeys, onSelect, selectedKeys, checkStrictly } = this.props;
        const renderTreeNodes = (data = []) =>
            data.map(item => {
                if (item.children) {
                    return (
                        <TreeNode title={item.title} key={item.key} dataRef={item} icon={<Icon type={item.icon}/>}>
                            {renderTreeNodes(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode {...item} />;
            });
        return (
            <div>
                <Input.Search placeholder='请输入路由名/操作名' onSearch={this.handleSearch}/>
                <Tree
                    showIcon={showIcon}
                    checkStrictly={checkStrictly}
                    autoExpandParent={autoExpandParent}
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    checkable={checkable}
                    onCheck={onCheck}
                    checkedKeys={checkedKeys}
                    onSelect={onSelect}
                    selectedKeys={selectedKeys}
                    onLoad={(a,b) => {
                        console.log(a);
                        console.log(b);
                    }}
                >
                    {renderTreeNodes(dataSource)}
                </Tree>
            </div>
        );
    }
}

export default SearchTree;
