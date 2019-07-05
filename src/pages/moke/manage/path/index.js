import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Icon, Modal, Button, Tag, message } from 'antd';
import styles from './index.css';
import AddModal from './components/AddModal';
import ModifyModal from './components/ModifyModal';
import WhereForm from './components/WhereForm';
import { NAMESPACE } from '@/constant/other';
import { wrapAuth } from '@/utils/wrapAuth';
import util from '@/utils/util';

const AuthIcon = wrapAuth(Icon);
const AuthButton = wrapAuth(Button);

class User extends Component {

    state = {
        addModalVisible: false,
        modifyModalVisible: false,
        imgModalVisible: false,
        selectedRowKeys: [],
        selectedRows: [],
        detail: {},
    };

    columns = [
        {
            title: '接口名',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            width: 150,
            fixed: 'left',
            sorter: true,
        }, {
            title: '路径（ant格式）',
            dataIndex: 'antUri',
            key: 'antUri',
            align: 'center',
            width: 150,
            sorter: true,
        }, {
            title: '请求方式',
            dataIndex: 'method',
            key: 'method',
            align: 'center',
            width: 150,
            render: record =>  {
                if(!record) return;
                let color;
                if(record.toUpperCase() == 'GET'){
                    color = 'cyan';
                }else if(record.toUpperCase() == 'POST'){
                    color = 'volcano';
                }else if(record.toUpperCase() == 'PUT'){
                    color = 'lime';
                }else if(record.toUpperCase() == 'DELETE'){
                    color = 'purple';
                }
                return <Tag color={color} key={record}>{util.dict.findByTypeAndName('method', record)}</Tag>
            },
        }, {
            title: '权限',
            dataIndex: 'permission',
            key: 'permission',
            align: 'center',
            width: 150,
            render: record => !record || !record.description ? undefined : <Tag color='blue' key={record.name}>{record.description}</Tag>,
        }, {
            title: '状态',
            dataIndex: 'isActive',
            key: 'isActive',
            align: 'center',
            width: 100,
            render: record => {
                let color = record === true ? 'green' : 'volcano';
                let text = record === true ? '启用' : '禁用';
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
                    permission='P_PATH_MODIFY'/>
                <AuthIcon
                    title='删除'
                    style={{ marginLeft: 13 }}
                    type='delete'
                    onClick={e => this.handleOperate(e, 'delete', record)}
                    permission='P_PATH_DELETE'/>
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
        this.props.axiosAllPermission();
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
            message.warn('未选中任何记录');
            return;
        }
        const rows = selectedRows.map((item) => {
            let row = {};
            headers.forEach((header) => {
                if (header.dataIndex in item) {
                    if (header.dataIndex === 'method') {
                        const method = util.dict.findByTypeAndName('method', item[header.dataIndex]);
                        row[header.dataIndex] = method ? method : null;
                        return;
                    }
                    if (header.dataIndex === 'permission') {
                        row[header.dataIndex] = item[header.dataIndex] ? item[header.dataIndex].name : null;
                        return;
                    }
                    if (header.dataIndex === 'isActive') {
                        row[header.dataIndex] = item[header.dataIndex] ? '启用' : '禁用';
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

    render() {
        const { addModalVisible, modifyModalVisible, selectedRowKeys, detail } = this.state;
        let { list, pagination, allPermission, addLoading, deleteLoading, modifyLoading, listLoading, exportExcelLoading, allPermissionLoading } = this.props;
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
                    <AuthButton icon='plus' type='primary' onClick={this.handleShowAddModal} permission='P_PATH_ADD'>
                        新建
                    </AuthButton>
                    <AuthButton loading={deleteLoading} icon='delete' type='danger' onClick={this.handleDeleteBatch} permission='P_PATH_DELETE'>
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
                        scroll={{ x: 1650 }}
                        rowKey={record => record.id}
                        onChange={this.handleTableChange}
                        loading={listLoading}/>
                </Card>
                <AddModal
                    loading={addLoading}
                    permissionLoading={allPermissionLoading}
                    visible={addModalVisible}
                    onOk={this.handleAddOk}
                    onCancel={this.handleAddCancel}
                    permissionData={allPermission}/>
                <ModifyModal
                    loading={modifyLoading}
                    permissionLoading={allPermissionLoading}
                    visible={modifyModalVisible}
                    onOk={this.handleModifyOk}
                    onCancel={this.handleModifyCancel}
                    initialData={detail}
                    permissionData={allPermission}/>
            </div>
        );
    }
}

const mapStateToProps = ({ path, loading, permission }) => {
    return {
        list: path.list,
        where: path.where,
        pagination: path.pagination,
        allPermission: permission.all,
        addLoading: loading.effects[`${NAMESPACE.PATH_MODEL}/add`],
        deleteLoading: loading.effects[`${NAMESPACE.PATH_MODEL}/deleteBatch`],
        modifyLoading: loading.effects[`${NAMESPACE.PATH_MODEL}/modify`],
        listLoading: loading.effects[`${NAMESPACE.PATH_MODEL}/list`],
        exportExcelLoading: loading.effects[`${NAMESPACE.DOWNLOAD_MODEL}/exportExcelMap`],
        allPermissionLoading: loading.effects[`${NAMESPACE.PERMISSION_MODEL}/all`],
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        axiosList: payload => {
            dispatch({
                type: `${NAMESPACE.PATH_MODEL}/list`,
                payload,
            });
        },
        axiosDetail: payload => {
            dispatch({
                type: `${NAMESPACE.PATH_MODEL}/detail`,
                payload,
            });
        },
        axiosAdd: payload => {
            dispatch({
                type: `${NAMESPACE.PATH_MODEL}/add`,
                payload,
            });
        },
        axiosModify: payload => {
            dispatch({
                type: `${NAMESPACE.PATH_MODEL}/modify`,
                payload,
            });
        },
        axiosDeleteBatch: payload => {
            dispatch({
                type: `${NAMESPACE.PATH_MODEL}/deleteBatch`,
                payload,
            });
        },
        axiosExportExcelMap: payload => {
            dispatch({
                type: `${NAMESPACE.DOWNLOAD_MODEL}/exportExcelMap`,
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

export default connect(mapStateToProps, mapDispatchToProps)(User);
