import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.css';
import AddModal from './components/AddModal';
import ModifyModal from './components/ModifyModal';
import WhereForm from './components/WhereForm';
import ImgModal from '@/components/ImgModal';
import { NAMESPACE } from '@/constant/other';
import util from '@/utils/util';
import defaultAvatar from '@/assets/default.png'
import { wrapAuth } from '@/utils/wrapAuth';
import {
    Card,
    Table,
    Icon,
    Modal,
    Button,
    Tag,
    message,
} from 'antd';

const AuthIcon = wrapAuth(Icon);
const AuthButton = wrapAuth(Button);

class User extends Component {

    state = {
        addModalVisible: false,
        modifyModalVisible: false,
        imgModalVisible: false,
        selectedRowKeys: [],
        selectedRows: [],
        popImg: '',
        detail: {},
    };

    columns = [
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            align: 'center',
            width: 150,
            fixed: 'left',
        }, {
            title: '昵称',
            dataIndex: 'nickname',
            key: 'nickname',
            align: 'center',
            width: 150,
        }, {
            title: '角色',
            dataIndex: 'roles',
            key: 'roles',
            align: 'center',
            width: 150,
            render: record => <span>
                {
                    record && record.map((role) => {
                        return <Tag color='green' key={role.name}>{role.description}</Tag>;
                    })
                }
            </span>,
        }
        , {
            title: '头像',
            dataIndex: 'avatar',
            key: 'avatar',
            align: 'center',
            width: 60,
            render: record => {
                if (!record) {
                    record = defaultAvatar;
                }
                return <img style={{ width: 30, height: 30, cursor: 'pointer' }} src={record} alt='头像'
                            onClick={() => this.handleImgModalOpen(record)}/>;
            },
        }, {
            title: '出生日期',
            dataIndex: 'birthday',
            key: 'birthday',
            align: 'center',
            width: 150,
        }, {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
            align: 'center',
            width: 90,
            sorter: true,
        }, {
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
            align: 'center',
            width: 90,
            render: record => util.dict.findByTypeAndName('gender', record),
            sorter: true,
        }, {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
            align: 'center',
            width: 150,
        }, {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
            width: 150,
        }, {
            title: '状态',
            dataIndex: 'isLock',
            key: 'isLock',
            align: 'center',
            width: 100,
            render: record => {
                let color = record === true ? 'volcano' : 'green';
                let text = record === true ? '锁定' : '正常';
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
                    permission='P_USER_MODIFY'/>
                <AuthIcon
                    title='删除'
                    type='delete'
                    style={{ marginLeft: 13 }}
                    onClick={e => this.handleOperate(e, 'delete', record)}
                    permission='P_USER_DELETE'/>
                {record.isLock
                    ? <AuthIcon
                        title='启用用户'
                        type='check-circle'
                        style={{ marginLeft: 13 }}
                        onClick={e => this.handleOperate(e, 'enable', record)}
                        permission='P_USER_ENABLE'/>
                    : <AuthIcon
                        title='锁定用户'
                        type='close-circle'
                        style={{ marginLeft: 13 }}
                        onClick={e => this.handleOperate(e, 'disable', record)}
                        permission='P_USER_DISABLE'/>
                }
            </div>,
        },
    ];

    componentWillMount() {
        this.headers = this.columns.filter((item, index) => index !== this.columns.length - 1)
            .map(item => {
                return {
                    title: item.title,
                    dataIndex: item.dataIndex,
                };
            });
        this.props.axiosAllRole();
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
                    detail: {
                        ...record,
                        roleIds: record.roles.map(role => role.id),
                    },
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
            case 'enable':
                this.props.axiosEnable({ id: record.id });
                break;
            case 'disable':
                this.props.axiosDisable({ id: record.id });
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
        this.setState({ addModalVisible: false }, callback);
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
                    if (header.dataIndex === 'roles') {
                        row[header.dataIndex] = item[header.dataIndex].map((role) => {
                            return role.description;
                        }).join(',');
                        return;
                    }
                    if (header.dataIndex === 'gender') {
                        const gender = util.dict.findByTypeAndName('gender', item[header.dataIndex]);
                        row[header.dataIndex] = gender ? gender : null;
                        return;
                    }
                    if (header.dataIndex === 'isLock') {
                        row[header.dataIndex] = item[header.dataIndex] ? '锁定' : '正常';
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

    /**
     * “图片弹出框”打开（事件处理）
     */
    handleImgModalOpen = (popImg) => {
        this.setState({
            imgModalVisible: true,
            popImg,
        });
    };

    /**
     * “图片弹出框”关闭（事件处理）
     */
    handleImgCancel = () => {
        this.setState({ imgModalVisible: false });
    };

    /**
     * 用户名是否可用
     */
    handleCheckUsername = (value, callback) => {
        this.props.axiosCheckUsername({ value, callback });
    };

    render() {
        const { addModalVisible, modifyModalVisible, imgModalVisible, selectedRowKeys, popImg, detail } = this.state;
        let { list, pagination, allRole, addLoading, deleteLoading, modifyLoading, listLoading, exportExcelLoading, allRoleLoading } = this.props;
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
                    <AuthButton icon='plus' type='primary' onClick={this.handleShowAddModal} permission='P_USER_ADD'>
                        新建
                    </AuthButton>
                    <AuthButton loading={deleteLoading} icon='delete' type='danger' onClick={this.handleDeleteBatch} permission='P_USER_DELETE'>
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
                        scroll={{ x: 2220 }}
                        rowKey={record => record.id}
                        onChange={this.handleTableChange}
                        loading={listLoading}/>
                </Card>
                <AddModal
                    loading={addLoading}
                    roleLoading={allRoleLoading}
                    visible={addModalVisible}
                    onOk={this.handleAddOk}
                    onCancel={this.handleAddCancel}
                    roleData={allRole}
                    onCheckUsername={this.handleCheckUsername}/>
                <ModifyModal
                    loading={modifyLoading}
                    roleLoading={allRoleLoading}
                    visible={modifyModalVisible}
                    onOk={this.handleModifyOk}
                    onCancel={this.handleModifyCancel}
                    initialData={detail}
                    roleData={allRole}
                    onCheckUsername={this.handleCheckUsername}/>
                <ImgModal
                    title='头像'
                    src={popImg}
                    alt='头像'
                    visible={imgModalVisible}
                    onCancel={this.handleImgCancel}/>
            </div>
        );
    }
}

const mapStateToProps = ({ user, loading, role }) => {
    return {
        list: user.list,
        where: user.where,
        pagination: user.pagination,
        allRole: role.all,
        addLoading: loading.effects[`${NAMESPACE.USER_MODEL}/add`],
        deleteLoading: loading.effects[`${NAMESPACE.USER_MODEL}/deleteBatch`],
        modifyLoading: loading.effects[`${NAMESPACE.USER_MODEL}/modify`],
        listLoading: loading.effects[`${NAMESPACE.USER_MODEL}/list`],
        exportExcelLoading: loading.effects[`${NAMESPACE.DOWNLOAD_MODEL}/exportExcelMap`],
        allRoleLoading: loading.effects[`${NAMESPACE.ROLE_MODEL}/all`],
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        axiosList: payload => {
            dispatch({
                type: `${NAMESPACE.USER_MODEL}/list`,
                payload,
            });
        },
        axiosDetail: payload => {
            dispatch({
                type: `${NAMESPACE.USER_MODEL}/detail`,
                payload,
            });
        },
        axiosAdd: payload => {
            dispatch({
                type: `${NAMESPACE.USER_MODEL}/add`,
                payload,
            });
        },
        axiosModify: payload => {
            dispatch({
                type: `${NAMESPACE.USER_MODEL}/modify`,
                payload,
            });
        },
        axiosDeleteBatch: payload => {
            dispatch({
                type: `${NAMESPACE.USER_MODEL}/deleteBatch`,
                payload,
            });
        },
        axiosEnable: payload => {
            dispatch({
                type: `${NAMESPACE.USER_MODEL}/enable`,
                payload,
            });
        },
        axiosDisable: payload => {
            dispatch({
                type: `${NAMESPACE.USER_MODEL}/disable`,
                payload,
            });
        },
        axiosExportExcelMap: payload => {
            dispatch({
                type: `${NAMESPACE.DOWNLOAD_MODEL}/exportExcelMap`,
                payload,
            });
        },
        axiosAllRole: () => {
            dispatch({
                type: `${NAMESPACE.ROLE_MODEL}/all`,
            });
        },
        axiosCheckUsername: payload => {
            dispatch({
                type: `${NAMESPACE.AUTH_MODEL}/checkUsername`,
                payload,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
