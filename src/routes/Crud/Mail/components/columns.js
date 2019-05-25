import React from 'react';
import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import Button from 'components/Button';
import moment from 'moment';
import CheckResource from '@/utils/checkResource';
import Condition from '@/utils/condition';

export default (self, allUsers) => [
    {
        title: '标题',
        name: 'mailSubject',
        tableItem: {},
        searchItem: {
            group: 'close'
        },
        formItem: {
            default: {
                rules: [
                    {
                        required: true,
                        message: '请输入邮件标题'
                    }
                ]
            },
            save: {},
            update: {},
        }
    },
    {
        title: '类型',
        name: 'mailType',
        dict: [
            {code: 'warn', codeName: '警告'},
            {code: 'info', codeName: '提示'},
        ],
        tableItem: {},
        searchItem: {
            type: 'select'
        },
        formItem: {
            default: {
                type: 'radio',
                rules: [
                    {
                        required: true,
                        message: '请选择邮件类型'
                    }
                ]
            },
            save: {},
            update: {}
        }
    },
    {
        title: '状态',
        name: 'mailStatus',
        dict: [
            {code: 'draft', codeName: '草稿'},
            {code: 'sent', codeName: '已发送'},
        ],
        tableItem: {},
        searchItem: {
            type: 'select'
        }
    },
    {
        title: '接收用户',
        name: 'toUsersInfo',
        tableItem: {},
        searchItem: {}
    },
    {
        title: '创建时间',
        name: 'createTime',
        tableItem: {
            render: text => text? moment(text).format('YYYY-MM-DD HH:mm'): null
        }
    },
    {
        title: '发送用户',
        name: 'sendUserId',
        dict: allUsers.map(({id, nickname}) => ({code: id, codeName: nickname})),
        tableItem: {},
        searchItem: {
            type: 'select'
        }
    },
    {
        title: '发送时间',
        name: 'sendTime',
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
                    <Condition
                        condition={record.mailStatus==='draft'}
                        component={
                            <CheckResource
                                resource='http./mail.PATCH'
                                component={
                                    <Button tooltip='发送'
                                            onClick={e => self.openModal('patch', '发送邮件', record, self.requestDetail)}>
                                        <Icon type="twitter" antd />
                                    </Button>
                                }
                            />
                        }
                    />
                    <Condition
                        condition={record.mailStatus==='draft'}
                        component={
                            <CheckResource
                                resource='http./mail.PUT'
                                component={
                                    <Button tooltip='修改'
                                            onClick={e => self.openModal('update', '更新邮件', record, self.requestDetail)}>
                                        <Icon type="edit" />
                                    </Button>
                                }
                            />
                        }
                    />
                    <CheckResource
                        resource='http./mail/*.DELETE'
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
