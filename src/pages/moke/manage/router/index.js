import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, message, Card } from 'antd';
import { NAMESPACE } from '@/constant/other';
import { wrapAuth } from '@/utils/wrapAuth';
import util from '@/utils/util';
import ModifyForm from './components/ModifyForm';
import AddModal from './components/AddModal';
import SearchTree from '@/components/SearchTree';
import styles from './index.css';
import DropdownButton from '@/components/DropdownButton';

const AuthDropdownButton = wrapAuth(DropdownButton);
const AuthButton = wrapAuth(Button);

class Role extends Component {

    constructor(props){
        super(props);
        this.modifyFormRef = React.createRef();
    }

    componentWillMount() {
        this.props.axiosAll();
        this.props.axiosAllPermission();
    }

    state = {
        addModalVisible: false,
        autoExpandParent: true,
        expandedKeys: [],
        checkedKeys: [],
        selectedKeys: [],
        addModalType: '0',
        detail: {},
    };

    handleExpand = expandedKeys => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    handleCheck = (checkedKeys, e) => {
        this.setState({ checkedKeys });
    };

    handleSelect = (selectedKeys, info) => {
        this.modifyFormRef.current.resetFields();
        this.setState({
            selectedKeys,
            detail: (!selectedKeys || selectedKeys.length === 0) ? {} : info.node.props.dataRef,
        });
    };

    handleSearch = (value, expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: true,
        });
    };

    /**
     * 批量删除（事件处理）
     */
    handleDeleteBatch = () => {
        const { checkedKeys } = this.state;
        if (checkedKeys.length === 0) {
            message.warn('未选中任何记录');
            return;
        }
        this.props.axiosDeleteBatch({
            ids: checkedKeys,
            callback: () => {
                const {expandedKeys} = this.state;
                const tempExpandedKeys = [...new Set([...expandedKeys].filter(n => !new Set(checkedKeys).has(n)))];
                this.setState({
                    checkedKeys: [],
                    selectedKeys: [],
                    expandedKeys: tempExpandedKeys,
                    detail: {},
                });
            },
        });
    };

    /**
     * 显示添加弹出框（事件处理）
     */
    handleShowAddModal = e => {
        const { key } = e;
        const { selectedKeys } = this.state;
        // if (!selectedKeys || selectedKeys.length === 0) {
        //     message.warn('请先选择一个路由节点');
        //     return;
        // }
        this.setState({
            addModalVisible: true,
            addModalType: key,
        });
    };

    /**
     * 添加弹出框确认处理
     */
    handleAddOk = (values, callback) => {
        console.log(values);
        this.props.axiosAdd({
            values,
            callback: () => {
                this.setState({
                    addModalVisible: false,
                }, callback);
            },
        });
    };

    /**
     * 添加弹出框取消处理
     */
    handleAddCancel = callback => {
        this.setState({
            addModalVisible: false,
        }, callback);
    };

    handleModifyOk = values => {
        const {selectedKeys} = this.state;
        if(selectedKeys.length > 0){
            this.props.axiosModify({ values });
        }else{
            message.warn('请选中一个节点！');
        }
    };

    /**
     * 重置
     */
    handleReload = () => {
        this.setState({ expandedKeys: [] });
    };

    render() {

        const { addModalVisible, detail, autoExpandParent, expandedKeys, checkedKeys, selectedKeys, addModalType } = this.state;
        const { all, allPermission, addLoading, deleteLoading, modifyLoding, allPermissionLoading } = this.props;
        const { dataSource } = util.route.parseForTree(all);
        const dropdownButtonDataSource = [
            {
                key: 0,
                text: '添加路由',
            }, {
                key: 1,
                text: '添加操作',
            },
        ];
        return (
            <div>
                <Row>
                    <Card className={styles.toolbar}>
                        <AuthDropdownButton icon='plus' type='primary' dataSource={dropdownButtonDataSource}
                                            onClick={this.handleShowAddModal} permission='P_ROUTER_ADD'>
                            新建
                        </AuthDropdownButton>
                        <AuthButton
                            icon='delete'
                            type='danger'
                            onClick={this.handleDeleteBatch}
                            loading={deleteLoading}
                            permission='P_ROUTER_DELETE'>
                            删除
                        </AuthButton>
                        <Button icon='reload' onClick={this.handleReload}>
                            重置
                        </Button>
                    </Card>
                </Row>
                <Row style={{ marginTop: 20 }}>
                    <Col offset={1} md={12} xl={6}>
                        <div style={{ height: 390, overflow: 'auto', marginBottom: 20 }}>
                            <SearchTree
                                showIcon={true}
                                autoExpandParent={autoExpandParent}
                                onExpand={this.handleExpand}
                                expandedKeys={expandedKeys}
                                checkable={true}
                                onCheck={this.handleCheck}
                                checkedKeys={checkedKeys}
                                onSelect={this.handleSelect}
                                selectedKeys={selectedKeys}
                                dataSource={dataSource}
                                onSearch={this.handleSearch}/>
                        </div>
                    </Col>
                    <Col offset={3} md={12} xl={6}>
                        <ModifyForm
                            initialData={detail}
                            permissionData={allPermission}
                            onOk={this.handleModifyOk}
                            loading={modifyLoding}
                            permissionLoading={allPermissionLoading}
                            ref={this.modifyFormRef}/>
                    </Col>
                </Row>
                <AddModal
                    type={addModalType}
                    visible={addModalVisible}
                    onOk={this.handleAddOk}
                    onCancel={this.handleAddCancel}
                    selectedKey={selectedKeys[0]}
                    permissionData={allPermission}
                    loading={addLoading}
                    permissionLoading={allPermissionLoading}/>
            </div>
        );
    }
}

const mapStateToProps = ({ loading, router, permission }) => {
    return {
        all: router.all,
        allPermission: permission.all,
        addLoading: loading.effects[`${NAMESPACE.ROUTER_MODEL}/add`],
        deleteLoading: loading.effects[`${NAMESPACE.ROUTER_MODEL}/deleteBatch`],
        modifyLoading: loading.effects[`${NAMESPACE.ROUTER_MODEL}/modify`],
        allPermissionLoading: loading.effects[`${NAMESPACE.PERMISSION_MODEL}/all`],
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        axiosAll: () => {
            dispatch({
                type: `${NAMESPACE.ROUTER_MODEL}/all`,
            });
        },
        axiosAdd: payload => {
            dispatch({
                type: `${NAMESPACE.ROUTER_MODEL}/add`,
                payload,
            });
        },
        axiosDeleteBatch: payload => {
            dispatch({
                type: `${NAMESPACE.ROUTER_MODEL}/deleteBatch`,
                payload,
            });
        },
        axiosModify: payload => {
            dispatch({
                type: `${NAMESPACE.ROUTER_MODEL}/modify`,
                payload,
            });
        },
        axiosAllPermission: () => {
            dispatch({
                type: `${NAMESPACE.PERMISSION_MODEL}/all`,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Role);
