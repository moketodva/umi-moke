import React, { Component } from 'react';
import { Modal } from 'antd';
import SearchTree from '@/components/SearchTree';

class TreeModal extends Component {

    render() {
        const { title, visible, onOk, onCancel, loading } = this.props;
        const { dataSource, showIcon, onExpand, autoExpandParent, onCheck, checkedKeys, onSelect, selectedKeys, expandedKeys, onSearch } = this.props;

        return (
            <Modal
                title={title}
                visible={visible}
                okText={'保存'}
                onOk={onOk}
                onCancel={onCancel}
                confirmLoading={loading}
            >
                <div style={{height: 390, overflow: 'auto'}}>
                    <SearchTree
                        dataSource={dataSource}
                        showIcon={showIcon}
                        autoExpandParent={autoExpandParent}
                        checkable={true}
                        expandedKeys={expandedKeys}
                        checkedKeys={checkedKeys}
                        selectedKeys={selectedKeys}
                        onExpand={onExpand}
                        onCheck={onCheck}
                        onSelect={onSelect}
                        onSearch={onSearch}/>
                </div>
            </Modal>
        );
    }
}

export default TreeModal;
