import React,{ Component } from 'react';
import { Card, Table, Icon, Modal } from 'antd'
import { connect }  from 'dva'
import CommonForm from '../../../../../components/CommonForm'



class BaseInfo extends Component{
    constructor(props){
        super(props);
    }

    /**
     * 查询处理（submit）
     * @param e
     * @param form
     */
    handleQuery = ( e, form )=>{
        e.preventDefault();
        form.validateFields( (err, values) => {
            // 没异常的话
            if(!err){
                // 列表数据（后台API）等待渲染
                this.props.axiosList(values);
            }
        });
    };

    handleNew = () => {
        this.props.showNewModal();
    };

    /**
     * 操作列处理（click）
     * @param e
     * @param type
     * @param record
     */
    handleOperate = ( e, type, record ) => {
        switch (type){
            case 'edit':
                this.props.axiosQuery(record.id);
                break;
            case 'delete':
                Modal.confirm({
                    content: '确认要删除吗？',
                    onOk: ()=>this.props.axiosDelete(record.id),
                    okText: '确认',
                    cancelText: '取消'
                });
                break;
            default:
        }
    };

    /**
     * 弹框确认处理（click）
     */
    handleOk = () => {
        this.formRef.validateFields((err, values)=>{
            if(!err){
                this.props.axiosKeep(values);
            }
        });
    };

    /**
     * 弹框取消处理（click）
     */
    handleCancel = () => {
        this.props.hideModal();
    };

    /**
     * 渲染
     * @returns {*}
     */
    render(){
        const { searchStructure, columnsStructure, modalStructure, modalFormStructure }  = this.structureHome();
        const { courseList } = this.props;
        return(
            <div>
                <Card>
                    <CommonForm structure={searchStructure} />
                </Card>

                <Card>
                    <Table dataSource={courseList} columns={columnsStructure} bordered={true} scroll={{ x: 1100 }}/>
                </Card>

                <Modal {...modalStructure} >
                    <CommonForm structure={modalFormStructure} ref={ (ref) => this.formRef = ref }/>
                </Modal>
            </div>
        );
    }

    /**
     * 《组件结构构建所需的数据》的区域
     * @returns {{searchStructure: {formField: {layout: string, onSubmit: BaseInfo.handleSubmit}, formContain: *[]}, columnsStructure: *[], modalStructure: {formField: {layout: string, onSubmit: BaseInfo.handleSubmit, labelCol: {span: number, offset: number}, wrapperCol: {span: number}}, formContain: *[]}}}
     */
    structureHome = () => {
        // 各种条件
        const searchStructure = {
            formField: {
                layout:'inline',
                onSubmit: this.handleQuery,
            },
            formContain: [
                {
                    formItemField: {
                        label: '课程编号'
                    },
                    name: 'courseNumber',
                    option: {
                        rules:[
                            {
                                max: 20,
                                message: '请不要输入过长的信息'
                            }
                        ]
                    },
                    setup: {
                        placeholder: '请输入课程编号',
                        style: {
                            width: '130px'
                        }
                    }
                },{
                    formItemField: {
                        label: '课程名'
                    },
                    name: 'courseName',
                    option: {
                        rules:[
                            {
                                max: 20,
                                message: '请不要输入过长的信息'
                            }
                        ]
                    },
                    setup: {
                        placeholder: '请输入课程名',
                        style: {
                            width: '130px'
                        }
                    }
                },{
                    formItemField: {
                        label: '老师编号'
                    },
                    name: 'teacherNumber',
                    option: {
                        rules:[
                            {
                                max: 20,
                                message: '请不要输入过长的信息'
                            }
                        ]
                    },
                    setup: {
                        placeholder: '请输入老师编号',
                        style: {
                            width: '130px'
                        }
                    }
                },{
                    formItemField: {
                        label: '老师姓名'
                    },
                    name: 'teacherName',
                    option: {
                        rules:[
                            {
                                max: 20,
                                message: '请不要输入过长得信息'
                            }
                        ]
                    },
                    setup: {
                        placeholder: '请输入老师姓名',
                        style: {
                            width: '130px'
                        }
                    }
                },{
                    // 原子组件类型
                    type: 'Button',
                    // 原子组件设置（就是属性和文本）
                    setup: {
                        htmlType: 'submit',
                        text: '查询',
                        type: 'primary'
                    }
                },{
                    // 原子组件类型
                    type: 'Button',
                    // 原子组件设置（就是属性和文本）
                    setup: {
                        text: '新建',
                        type: 'primary',
                        onClick: this.handleNew
                    }
                }
            ]
        };

        // 弹框里的表单
        const modalFormStructure = {
            formField: {
                layout:'horizontal',
                onSubmit: this.handleSubmit,
                labelCol: {
                    span: 6,
                    offset: 3
                },
                wrapperCol: {
                    span: 12,
                },
            },
            formContain: [
                {
                    formItemField: {
                        style: {
                            display: 'none '
                        }
                    },
                    name: 'id',
                    option: {
                        initialValue: this.props.course.id?this.props.course.id.toString():'',
                    }
                },{
                    formItemField: {
                        label: '课程编号',
                    },
                    name: 'courseNumber',
                    option: {
                        initialValue: this.props.course.courseNumber?this.props.course.courseNumber.toString():'',
                        rules:[
                            {
                                max: 20,
                                message: '请不要输入过长的信息'
                            },{
                                required: true,
                                message: '该项不能为空'
                            }
                        ]
                    },
                    setup: {
                        placeholder: '请输入课程编号',
                        style: {
                            width: '130px'
                        }
                    }
                },{
                    formItemField: {
                        label: '课程名'
                    },
                    name: 'courseName',
                    option: {
                        initialValue: this.props.course.courseName?this.props.course.courseName:'',
                        rules:[
                            {
                                max: 20,
                                message: '请不要输入过长的信息'
                            },{
                                required: true,
                                message: '该项不能为空'
                            }
                        ]
                    },
                    setup: {
                        placeholder: '请输入课程名',
                        style: {
                            width: '130px'
                        }
                    }
                },{
                    formItemField: {
                        label: '老师编号'
                    },
                    name: 'teacherNumber',
                    option: {
                        initialValue: this.props.course.teacherNumber?this.props.course.teacherNumber.toString():'',
                        rules:[
                            {
                                max: 20,
                                message: '请不要输入过长的信息'
                            },{
                                required: true,
                                message: '该项不能为空'
                            }
                        ]
                    },
                    setup: {
                        placeholder: '请输入老师编号',
                        style: {
                            width: '130px'
                        }
                    }
                },{
                    formItemField: {
                        label: '老师姓名'
                    },
                    name: 'teacherName',
                    option: {
                        initialValue: this.props.course.teacherName?this.props.course.teacherName:'',
                        rules:[
                            {
                                max: 20,
                                message: '请不要输入过长得信息'
                            },{
                                required: true,
                                message: '该项不能为空'
                            }
                        ]
                    },
                    setup: {
                        placeholder: '请输入老师姓名',
                        style: {
                            width: '130px'
                        }
                    }
                }
            ]
        };

        // 表格的各列
        const columnsStructure = [
            {
                title: '课程编号',
                dataIndex: 'courseNumber',
                key: 'courseNumber',
            },{
                title: '课程名',
                dataIndex: 'courseName',
                key: 'courseName'
            },{
                title: '授课老师编号',
                dataIndex: 'teacherNumber',
                key: 'teacherNumber'
            },{
                title: '授课老师姓名',
                dataIndex: 'teacherName',
                key: 'teacherName'
            },{
                title: '上课时间',
                dataIndex: 'courseTime',
                key: 'courseTime'
            },{
                title: '上课地点',
                dataIndex: 'coursePlace',
                key: 'coursePlace'
            },{
                title: '类型',
                dataIndex: 'courseType',
                key: 'courseType'
            },{
                title: '学分',
                dataIndex: 'courseCredit',
                key: 'courseCredit'
            },{
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: 100,
                render: (record) => <div>
                    <Icon type={'edit'} onClick={ (e) => this.handleOperate(e, 'edit', record) } />
                    <Icon type={'delete'} onClick={ (e) => this.handleOperate(e,'delete', record) } style={{marginLeft: 13}} />
                </div>,
            }
        ];

        // 弹框
        const modalStructure = {
            title: "修改课程",
            visible: this.props.modalVisible,
            onOk: this.handleOk,
            onCancel: this.handleCancel,
            okText: '保存',
            cancelText: '取消'
        };

        return {
            searchStructure,
            columnsStructure,
            modalFormStructure,
            modalStructure
        };
    };

}

/* ====================== 导出处理 =========================== */
const mapDispatchToProps = (dispatch) => {
    const modelRoot = 'course/';
    return {
        axiosList:(params) => {
            dispatch({
                type:`${modelRoot}list`,
                payload:{
                    ...params
                }
            });
        },axiosQuery:(id) => {
            dispatch({
                type:`${modelRoot}query`,
                payload:{
                    id
                }
            });
        },axiosKeep:(payload) => {
            dispatch({
                type:`${modelRoot}keep`,
                payload:{
                    ...payload
                }
            });
        },axiosDelete:(payload) => {
            dispatch({
                type:`${modelRoot}delete`,
                payload:{
                    ...payload
                }
            });
        },showNewModal:() => {
            dispatch({
                type:`${modelRoot}save`,
                payload:{
                    course:{},
                    modalVisible: true
                }
            });
        },showEditModal:() => {
            dispatch({
                type:`${modelRoot}save`,
                payload:{
                    modalVisible: true
                }
            });
        },hideModal:() => {
            dispatch({
                type:`${modelRoot}save`,
                payload:{
                    modalVisible: false
                }
            });
        }
    }
};

const mapStateToProps = ( {course:{courseList, course, modalVisible}} ) => {
    return {
        courseList,
        course,
        modalVisible
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BaseInfo);
