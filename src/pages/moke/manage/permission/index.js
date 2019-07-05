import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Icon, Modal, Button, message } from 'antd';
import styles from './index.css';
import AddModal from './components/AddModal';
import ModifyModal from './components/ModifyModal';
import WhereForm from './components/WhereForm';
import { NAMESPACE } from '@/constant/other';
import { wrapAuth } from '@/utils/wrapAuth';

const AuthIcon = wrapAuth(Icon);
const AuthButton = wrapAuth(Button);

class Role extends Component {

    state = {
        addModalVisible: false,
        modifyModalVisible: false,
        selectedRowKeys: [],
        selectedRows: [],
        detail: {},
    };

    columns = [
        {
            title: '权限名',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            width: 150,
            fixed: 'left',
            sorter: true,
        }, {
            title: '权限描述',
            dataIndex: 'description',
            key: 'description',
            align: 'center',
            width: 150,
            sorter: true,
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
                    permission='P_PERMISSION_MODIFY'/>
                <AuthIcon
                    title='删除'
                    style={{ marginLeft: 13 }}
                    type='delete'
                    onClick={e => this.handleOperate(e, 'delete', record)}
                    permission='P_PERMISSION_DELETE'/>
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
            message.warn('未选中任何记录！');
            return;
        }
        const rows = selectedRows.map((item) => {
            let row = {};
            headers.forEach((header) => {
                if (header.dataIndex in item) {
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

    /**
     * 权限生效（事件处理）
     */
    handleTakeEffect = () => {
        this.props.axiosTakeEffect();
    };

    render() {
        const { addModalVisible, modifyModalVisible, selectedRowKeys, detail } = this.state;
        let { list, pagination, addLoading , deleteLoading, modifyLoading, listLoading, exportExcelLoading } = this.props;
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
                    <AuthButton icon='plus' type='primary' onClick={this.handleShowAddModal}
                                permission='P_PERMISSION_ADD'>
                        新建
                    </AuthButton>
                    <AuthButton loading={deleteLoading} icon='delete' type='danger' onClick={this.handleDeleteBatch}
                                permission='P_PERMISSION_DELETE'>
                        删除
                    </AuthButton>
                    <AuthButton loading={exportExcelLoading} icon='export' onClick={this.handleExportExcel} permission='P_DOWNLOAD_EXCEL'>
                        导出
                    </AuthButton>
                    <AuthButton icon='reload' onClick={this.handleTakeEffect} permission='P_PERMISSION_TAKE_EFFECT'>
                        权限生效
                    </AuthButton>
                </Card>
                <Card>
                    <Table
                        dataSource={list}
                        columns={this.columns}
                        pagination={pagination}
                        rowSelection={rowSelection}
                        bordered={true}
                        scroll={{ x: 1250 }}
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
            </div>
        );
    }
}

const mapStateToProps = ({ loading, permission }) => {
    return {
        list: permission.list,
        where: permission.where,
        pagination: permission.pagination,
        listLoading: loading.effects[`${NAMESPACE.PERMISSION_MODEL}/list`],
        addLoading: loading.effects[`${NAMESPACE.PERMISSION_MODEL}/add`],
        deleteLoading: loading.effects[`${NAMESPACE.PERMISSION_MODEL}/deleteBatch`],
        modifyLoading: loading.effects[`${NAMESPACE.PERMISSION_MODEL}/modify`],
        exportExcelLoading: loading.effects[`${NAMESPACE.DOWNLOAD_MODEL}/exportExcelMap`],
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        axiosList: payload => {
            dispatch({
                type: `${NAMESPACE.PERMISSION_MODEL}/list`,
                payload,
            });
        },
        axiosDetail: payload => {
            dispatch({
                type: `${NAMESPACE.PERMISSION_MODEL}/detail`,
                payload,
            });
        },
        axiosAdd: payload => {
            dispatch({
                type: `${NAMESPACE.PERMISSION_MODEL}/add`,
                payload,
            });
        },
        axiosModify: payload => {
            dispatch({
                type: `${NAMESPACE.PERMISSION_MODEL}/modify`,
                payload,
            });
        },
        axiosDeleteBatch: payload => {
            dispatch({
                type: `${NAMESPACE.PERMISSION_MODEL}/deleteBatch`,
                payload,
            });
        },
        axiosTakeEffect: () => {
            dispatch({
                type: `${NAMESPACE.PERMISSION_MODEL}/takeEffect`,
            });
        },
        axiosExportExcelMap: payload => {
            dispatch({
                type: `${NAMESPACE.DOWNLOAD_MODEL}/exportExcelMap`,
                payload,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Role);
