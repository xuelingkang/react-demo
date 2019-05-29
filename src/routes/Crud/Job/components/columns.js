import React from 'react';
import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import Button from 'components/Button';
import moment from 'moment';
import CheckResource from '@/utils/checkResource';
import Condition from '@/utils/condition';

export default (self, allTemplates) => [
    {
        title: '任务模板',
        name: 'jobTemplateId',
        dict: allTemplates.map(({id, jobName}) => ({code: id, codeName: jobName})),
        tableItem: {},
        searchItem: {
            type: 'select',
            group: 'close'
        },
        formItem: {
            default: {
                type: 'select',
                rules: [
                    {
                        required: true,
                        message: '请选择任务模板'
                    }
                ],
                onChange: (form, value) => self.onChangeTemp(value)
            },
            save: {},
            update: {},
        }
    },
    {
        title: '描述',
        name: 'jobDesc',
        tableItem: {},
        searchItem: {},
        formItem: {
            default: {
                rules: [
                    {
                        required: true,
                        message: '请输入任务描述'
                    }
                ]
            },
            save: {},
            update: {},
        }
    },
    {
        title: '开始时间',
        name: 'startTime',
        tableItem: {
            render: text => text? moment(text).format('YYYY-MM-DD HH:mm'): null
        },
        formItem: {
            default: {
                type: 'datetime',
                col: { span: 12 },
                formItemLayout: {
                    labelCol: { span: 8 },
                    wrapperCol: { span: 15 }
                },
                rules: [
                    {
                        required: true,
                        message: '请输入开始时间'
                    }
                ]
            },
            save: {},
            update: {}
        }
    },
    {
        title: '结束时间',
        name: 'endTime',
        tableItem: {
            render: text => text? moment(text).format('YYYY-MM-DD HH:mm'): null
        },
        formItem: {
            default: {
                type: 'datetime',
                col: { span: 12 },
                formItemLayout: {
                    labelCol: { span: 5 },
                    wrapperCol: { span: 15 }
                },
            },
            save: {},
            update: {}
        }
    },
    {
        title: 'cron表达式',
        name: 'cronExpression',
        tableItem: {},
        formItem: {
            default: {
                rules: [
                    {
                        required: true,
                        message: '请输入cron表达式'
                    }
                ]
            },
            save: {},
            update: {},
        }
    },
    {
        title: '状态',
        name: 'triggerState',
        dict: [
            {code: 'WAITING', codeName: '等待中'},
            {code: 'ACQUIRED', codeName: '准备中'},
            {code: 'EXECUTING', codeName: '正在执行'},
            {code: 'COMPLETE', codeName: '完成'},
            {code: 'BLOCKED', codeName: '阻塞'},
            {code: 'ERROR', codeName: '错误'},
            {code: 'PAUSED', codeName: '暂停'},
            {code: 'PAUSED_BLOCKED', codeName: '阻塞暂停'},
        ],
        tableItem: {},
        searchItem: {
            type: 'select'
        },
    },
    {
        title: '上次时间',
        name: 'prevTime',
        tableItem: {
            render: text => (text&&text!==-1)? moment(text).format('YYYY-MM-DD HH:mm'): null
        }
    },
    {
        title: '下次时间',
        name: 'nextTime',
        tableItem: {
            render: text => (text&&text!==-1)? moment(text).format('YYYY-MM-DD HH:mm'): null
        }
    },
    {
        title: '参数列表',
        name: 'parameters',
        formItem: {
            default: {
                type: 'group',
                groupType: 'array',
                items: [
                    {
                        name: 'id',
                        type: 'hidden'
                    },
                    {
                        title: '名称',
                        name: 'parameterName',
                        readOnly: true,
                        col: { span: 12 },
                        formItemLayout: {
                            wrapperCol: { span: 24 }
                        },
                        rules: [
                            {
                                required: true,
                                message: '请输入名称'
                            }
                        ]
                    },
                    {
                        title: '参数值',
                        name: 'parameterValue',
                        col: { span: 12 },
                        formItemLayout: {
                            wrapperCol: { span: 24 }
                        },
                        rules: [
                            {
                                required: true,
                                message: '请输入参数值'
                            }
                        ]
                    },
                ],
            },
            save: {},
            update: {}
        }
    },
    {
        title: '操作',
        tableItem: {
            width: 180,
            render: (text, record) => (
                <DataTable.Oper>
                    <Condition
                        condition={record.triggerState!=='EXECUTING' || record.triggerState!=='COMPLETE'}
                        component={
                            <CheckResource
                                resource='http./job.PUT'
                                component={
                                    <Button tooltip='修改'
                                            onClick={e => self.openModal('update', '更新任务', record, self.requestDetail)}>
                                        <Icon type="edit" />
                                    </Button>
                                }
                            />
                        }
                    />
                    <Condition
                        condition={record.triggerState==='PAUSED' || record.triggerState==='PAUSED_BLOCKED'}
                        component={
                            <CheckResource
                                resource='http./job.PUT'
                                component={
                                    <Button tooltip='开始'
                                            onClick={e => self.resume(record.id)}>
                                        <Icon type="caret-right" font='iconfont' />
                                    </Button>
                                }
                            />
                        }
                    />
                    <Condition
                        condition={record.triggerState==='WAITING' || record.triggerState==='ACQUIRED'}
                        component={
                            <CheckResource
                                resource='http./job.PUT'
                                component={
                                    <Button tooltip='暂停'
                                            onClick={e => self.pause(record.id)}>
                                        <Icon type="pause" antd />
                                    </Button>
                                }
                            />
                        }
                    />
                    <Condition
                        condition={record.triggerState!=='EXECUTING'}
                        component={
                            <CheckResource
                                resource='http./job/*.DELETE'
                                component={
                                    <Button tooltip='删除' onClick={e => self.delete(record)}>
                                        <Icon type="trash" />
                                    </Button>
                                }
                            />
                        }
                    />
                </DataTable.Oper>
            )
        }
    }
];
