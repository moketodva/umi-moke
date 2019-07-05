import React, { Component } from 'react';
import { Card, Table, Icon, Modal, Button, Tag, message } from 'antd';
import { connect } from 'dva';
import styles from './index.css';
import AddModal from './components/AddModal';
import ModifyModal from './components/ModifyModal';
import WhereForm from './components/WhereForm';
import TreeModal from '@/components/TreeModal';
import { NAMESPACE } from '@/constant/other';
import { wrapAuth } from '@/utils/wrapAuth';
import util from '@/utils/util';

const AuthIcon = wrapAuth(Icon);
const AuthButton = wrapAuth(Button);

class Role extends Component {

    state = {
        addModalVisible: false,
        modifyModalVisible: false,
        routerModalVisible: false,
        selectedRowKeys: [],
        selectedRows: [],
        detail: {},
        dataSource: [],
        autoExpandParent: true,
        expandedKeys: [],
        checkedKeys: [],
        checkedRouterKeys: [],
        otherCheckedKeys: []
    };

    columns = [
        {
            title: '角色名',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            width: 150,
            fixed: 'left',
            sorter: true,
        }, {
            title: '角色描述',
            dataIndex: 'description',
            key: 'description',
            align: 'center',
            width: 150,
            sorter: true,
        }, {
            title: '状态',
            dataIndex: 'isDefault',
            key: 'isDefault',
            align: 'center',
            width: 100,
            render: record => {
                let color = record === true ? 'volcano' : 'green';
                let text = record === true ? '默认角色' : '非默认角色';
                return <Tag color={color} key={text}>{text}</Tag>;
            },
        }, {
            title: '录入时间',
            dataIndex: 'createTime',
            key: 'createTime',
            align: 'center',
            width: 200,
        }, {
            title: '录入人',
            dataIndex: 'createUser',
            key: 'createUser',
            align: 'center',
            width: 150,
        }, {
            title: '最后更新时间',
            dataIndex: 'modifyTime',
            key: 'modifyTime',
            align: 'center',
            width: 200,
        }, {
            title: '最后更新人',
            dataIndex: 'modifyUser',
            key: 'modifyUser',
            align: 'center',
            width: 150,
        }, {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            align: 'center',
            width: 200,
            render: record => <div>
                <AuthIcon
                    title='编辑'
                    type='edit'
                    onClick={e => this.handleOperate(e, 'edit', record)}
                    permission='P_ROLE_MODIFY'/>
                <AuthIcon
                    title='删除'
                    type='delete'
                    style={{ marginLeft: 13 }}
                    onClick={e => this.handleOperate(e, 'delete', record)}
                    permission='P_ROLE_DELETE'/>
                {record.isDefault
                    ? <AuthIcon
                        title='不作为默认角色'
                        type='close-circle'
                        style={{ marginLeft: 13 }}
                        onClick={e => this.handleOperate(e, 'unDefault', record)}
                        permission='P_ROLE_SET_DEFAULT'/>
                    : <AuthIcon
                        title='作为默认角色'
                        type='check-circle'
                        style={{ marginLeft: 13 }}
                        onClick={e => this.handleOperate(e, 'default', record)}
                        permission='P_ROLE_SET_DEFAULT'/>
                }
                <AuthIcon
                    title='配置路由/操作权限'
                    type='user'
                    style={{ marginLeft: 13 }}
                    onClick={e => this.handleOperate(e, 'setRouter', record)}
                    permission='P_ROLE_SET_MENU_PERMISSION'/>
            </div>,
        },
    ];

    componentWillMount() {
        this.headers = this.columns.filter((item, index) => index !== this.columns.length - 1)
            .map((item) => {
                return {
                    title: item.title,
                    dataIndex: item.dataIndex,
                };
            });
    }

    /**
     * 查询按钮（事件处理）
     */
    handleList = (where, pagination, sorter = {}) => {
        const params = {
            where,
            pagination,
            sorter,
            callback: () => {
                this.setState({
                    selectedRowKeys: [],
                    selectedRows: [],
                });
            }
        };
        this.props.axiosList(params);
    };

    /**
     * 表格状态变化, 如分页、排序、过滤（事件处理）
     */
    handleTableChange = (pagination, filter, sorter) => {
        const { where } = this.props;
        this.handleList(where, pagination, sorter);
    };

    /**
     * 操作列中的按钮被点击（事件处理）
     */
    handleOperate = (e, type, record) => {
        switch (type) {
            case 'edit':
                this.setState({
                    detail: { ...record },
                    modifyModalVisible: true,
                });
                break;
            case 'delete':
                Modal.confirm({
                    content: '确认要删除吗？',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => this.handleDeleteOk(record.id),
                });
                break;
            case 'default':
                this.props.axiosDefault({
                    id: record.id,
                    isDefault: true,
                });
                break;
            case 'unDefault':
                this.props.axiosDefault({
                    id: record.id,
                    isDefault: false,
                });
                break;
            case 'setRouter':
                this.props.axiosCheckedRouter({
                    id: record.id,
                    callback: () => {
                        const { dataSource, checkedKeys, otherCheckedKeys } = util.route.parseForTree(this.props.checkedRouter);
                        this.setState({
                            dataSource,
                            checkedKeys,
                            expandedKeys: checkedKeys,
                            checkedRouterKeys: checkedKeys,
                            autoExpandParent: true,
                            routerModalVisible: true,
                            otherCheckedKeys
                        });
                        this.selectId = record.id;
                    },
                });
                break;
            default:
        }
    };

    /**
     * 删除弹出框确认处理
     */
    handleDeleteOk = id => {
        this.props.axiosDeleteBatch({
            ids: [id],
            callback: () => {
                this.setState({
                    selectedRowKeys: [],
                    selectedRows: [],
                });
            }
        });
    };

    /**
     * 添加弹出框确认处理
     */
    handleAddOk = (values, callback) => {
        this.props.axiosAdd({
            values,
            callback: () => {
                this.setState({
                    addModalVisible: false,
                    selectedRowKeys: [],
                    selectedRows: [],
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

    /**
     * 编辑弹出框确认处理
     */
    handleModifyOk = (values, callback) => {
        this.props.axiosModify({
            values,
            callback: () => {
                this.setState({
                    modifyModalVisible: false,
                    selectedRowKeys: [],
                    selectedRows: [],
                }, callback);
            },
        });
    };

    /**
     * 编辑弹出框取消处理
     */
    handleModifyCancel = callback => {
        this.setState({
            modifyModalVisible: false,
        }, callback);
    };

    /**
     * 行多选框状态变换（事件处理）
     */
    handleRowChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows,
        });
    };

    /**
     * 显示添加弹出框（事件处理）
     */
    handleShowAddModal = () => {
        this.setState({
            addModalVisible: true,
        });
    };

    /**
     * 批量删除（事件处理）
     */
    handleDeleteBatch = () => {
        const { selectedRowKeys } = this.state;
        if (selectedRowKeys.length === 0) {
            message.warn('未选中任何记录');
            return;
        }
        this.props.axiosDeleteBatch({
            ids: selectedRowKeys,
            callback: () => {
                this.setState({
                    selectedRowKeys: [],
                    selectedRows: [],
                });
            },
        });
    };

    /**
     * 导出Excel（事件处理）
     */
    handleExportExcel = () => {
        const { selectedRows } = this.state;
        const headers = this.headers;
        if (selectedRows.length === 0) {
            message.warn('未选中任何记录');
            return;
        }
        const rows = selectedRows.map((item) => {
            let row = {};
            headers.forEach((header) => {
                if (header.dataIndex in item) {
                    if (header.dataIndex === 'isDefault') {
                        row[header.dataIndex] = item[header.dataIndex] ? '默认角色' : '非默认角色';
                        return;
                    }
                    row[header.dataIndex] = item[header.dataIndex];
                }
            });
            return row;
        });
        this.props.axiosExportExcelMap({
            headers,
            data: rows,
        });
    };

    handleExpand = expandedKeys => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    handleCheck = (checkedKeys, e) => {
        const checkedRouterKeys = [...new Set([...e.halfCheckedKeys, ...checkedKeys])];
        this.setState({
            checkedKeys,
            checkedRouterKeys,
            otherCheckedKeys: []
        });
    };

    handleSearch = (value, expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: true,
        });
    };

    handleRouterOk = () => {
        const id = this.selectId;
        const { checkedRouterKeys, otherCheckedKeys } = this.state;
        const allCheckedRouterKeys = [...new Set([...checkedRouterKeys, ...otherCheckedKeys])];
        this.props.axiosSetRouter({
            id,
            routerIds: allCheckedRouterKeys,
            callback: () => this.setState({ routerModalVisible: false })
        });
    };

    handleRouterCancel = () => {
        this.setState({ routerModalVisible: false });
    };

    render() {
        const { addModalVisible, modifyModalVisible, routerModalVisible, selectedRowKeys, dataSource, autoExpandParent, expandedKeys, checkedKeys, detail } = this.state;
        let { list, pagination, listLoading, addLoading, deleteLoading, modifyLoading, setRouterLoading, exportExcelLoading } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.handleRowChange,
        };
        pagination = {
            ...pagination,
            showTotal: total => `总数 ${total} `,
            showSizeChanger: true,
            showQuickJumper: true,
        };
        return (
            <div>
                <Card>
                    <WhereForm onSearch={this.handleList} loading={listLoading}/>
                </Card>
                <Card className={styles.toolbar}>
                    <AuthButton icon='plus' type='primary' onClick={this.handleShowAddModal} permission='P_ROLE_ADD'>
                        新建
                    </AuthButton>
                    <AuthButton loading={deleteLoading} icon='delete' type='danger' onClick={this.handleDeleteBatch} permission='P_ROLE_DELETE'>
                        删除
                    </AuthButton>
                    <AuthButton loading={exportExcelLoading} icon='export' onClick={this.handleExportExcel} permission='P_DOWNLOAD_EXCEL'>
                        导出
                    </AuthButton>
                </Card>
                <Card>
                    <Table
                        dataSource={list}
                        columns={this.columns}
                        pagination={pagination}
                        rowSelection={rowSelection}
                        bordered={true}
                        scroll={{ x: 1350 }}
                        rowKey={record => record.id}
                        onChange={this.handleTableChange}
                        loading={listLoading}/>
                </Card>
                <AddModal
                    loading={addLoading}
                    visible={addModalVisible}
                    onOk={this.handleAddOk}
                    onCancel={this.handleAddCancel}/>
                <ModifyModal
                    loading={modifyLoading}
                    visible={modifyModalVisible}
                    onOk={this.handleModifyOk}
                    onCancel={this.handleModifyCancel}
                    initialData={detail}/>
                <TreeModal
                    title='路由设置'
                    dataSource={dataSource}
                    showIcon={true}
                    visible={routerModalVisible}
                    autoExpandParent={autoExpandParent}
                    checkedKeys={checkedKeys}
                    expandedKeys={expandedKeys}
                    onCheck={this.handleCheck}
                    onExpand={this.handleExpand}
                    onSearch={this.handleSearch}
                    onOk={this.handleRouterOk}
                    onCancel={this.handleRouterCancel}
                    loading={setRouterLoading}
                />
            </div>
        );
    }
}

const mapStateToProps = ({ loading, role, router }) => {
    return {
        list: role.list,
        where: role.where,
        pagination: role.pagination,
        checkedRouter: router.checked,
        listLoading: loading.effects[`${NAMESPACE.ROLE_MODEL}/list`],
        addLoading: loading.effects[`${NAMESPACE.ROLE_MODEL}/add`],
        deleteLoading: loading.effects[`${NAMESPACE.ROLE_MODEL}/deleteBatch`],
        modifyLoading: loading.effects[`${NAMESPACE.ROLE_MODEL}/modify`],
        setRouterLoading: loading.effects[`${NAMESPACE.ROLE_MODEL}/setRouter`],
        exportExcelLoading: loading.effects[`${NAMESPACE.DOWNLOAD_MODEL}/exportExcelMap`],
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        axiosList: payload => {
            dispatch({
                type: `${NAMESPACE.ROLE_MODEL}/list`,
                payload,
            });
        },
        axiosDetail: payload => {
            dispatch({
                type: `${NAMESPACE.ROLE_MODEL}/detail`,
                payload,
            });
        },
        axiosAdd: payload => {
            dispatch({
                type: `${NAMESPACE.ROLE_MODEL}/add`,
                payload,
            });
        },
        axiosModify: payload => {
            dispatch({
                type: `${NAMESPACE.ROLE_MODEL}/modify`,
                payload,
            });
        },
        axiosDeleteBatch: payload => {
            dispatch({
                type: `${NAMESPACE.ROLE_MODEL}/deleteBatch`,
                payload,
            });
        },
        axiosDefault: payload => {
            dispatch({
                type: `${NAMESPACE.ROLE_MODEL}/setDefault`,
                payload,
            });
        },
        axiosExportExcelMap: payload => {
            dispatch({
                type: `${NAMESPACE.DOWNLOAD_MODEL}/exportExcelMap`,
                payload,
            });
        },
        axiosCheckedRouter: payload => {
            dispatch({
                type: `${NAMESPACE.ROUTER_MODEL}/checked`,
                payload,
            });
        },
        axiosSetRouter: payload => {
            dispatch({
                type: `${NAMESPACE.ROLE_MODEL}/setRouter`,
                payload,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Role);
