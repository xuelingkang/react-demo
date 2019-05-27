import React from 'react';
import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import Button from 'components/Button';
import moment from 'moment';
import CheckResource from '@/utils/checkResource';

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
                ]
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
        tableItem: {},
        searchItem: {},
    },
    {
        title: '上次时间',
        name: 'prevTime',
        tableItem: {
            render: text => text? moment(text).format('YYYY-MM-DD HH:mm'): null
        }
    },
    {
        title: '下次时间',
        name: 'nextTime',
        tableItem: {
            render: text => text? moment(text).format('YYYY-MM-DD HH:mm'): null
        }
    },
    {
        title: '操作',
        tableItem: {
            width: 180,
            render: (text, record) => (
                <DataTable.Oper>
                    <CheckResource
                        resource='http./job.PUT'
                        component={
                            <Button tooltip='修改'
                                    onClick={e => self.openModal('update', '更新任务', record, self.requestDetail)}>
                                <Icon type="edit" />
                            </Button>
                        }
                    />
                    <CheckResource
                        resource='http./job/*.DELETE'
                        component={
                            <Button tooltip='删除' onClick={e => self.delete(record)}>
                                <Icon type="trash" />
                            </Button>
                        }
                    />
                </DataTable.Oper>
            )
        }
    }
];
