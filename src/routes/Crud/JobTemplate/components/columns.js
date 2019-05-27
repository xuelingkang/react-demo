import React from 'react';
import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import Button from 'components/Button';
import moment from 'moment';
import CheckResource from '@/utils/checkResource';

export default (self) => [
    {
        title: '名称',
        name: 'jobName',
        tableItem: {},
        searchItem: {
            group: 'close'
        },
        formItem: {
            default: {
                rules: [
                    {
                        required: true,
                        message: '请输入任务名称'
                    }
                ]
            },
            save: {},
            update: {},
        }
    },
    {
        title: '类名',
        name: 'jobClassName',
        tableItem: {},
        searchItem: {},
        formItem: {
            default: {
                rules: [
                    {
                        required: true,
                        message: '请输入任务类名'
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
        title: '创建时间',
        name: 'createTime',
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
                        resource='http./jobTemplate.PUT'
                        component={
                            <Button tooltip='修改'
                                    onClick={e => self.openModal('update', '更新模板', record, self.requestDetail)}>
                                <Icon type="edit" />
                            </Button>
                        }
                    />
                    <CheckResource
                        resource='http./jobTemplate/*.DELETE'
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
