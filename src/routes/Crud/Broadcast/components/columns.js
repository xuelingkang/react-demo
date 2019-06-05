import React from 'react';
import moment from 'moment';
import DataTable from "components/DataTable"
import CheckResource from "@/utils/checkResource"
import Button from "components/Button"
import Icon from "components/Icon"

export default (self, allUsers) => [
    {
        title: '广播时间',
        name: 'sendTime',
        tableItem: {
            render: text => text? moment(text).format('YYYY-MM-DD HH:mm'): null
        },
    },
    {
        title: '目标用户',
        name: 'toUsers',
        formItem: {
            default: {
                type: 'transfer',
                showSearch: true,
                dataSource: allUsers.map(user => {
                    const {id, nickname, username} = user;
                    return {
                        key: id,
                        title: `${nickname}(${username})`
                    }
                }),
                rules: [
                    {
                        required: true,
                        message: '请选择目标用户'
                    }
                ],
            },
            save: {},
        }
    },
    {
        title: '广播内容',
        name: 'content',
        tableItem: {},
        searchItem: {
            group: 'close'
        },
        formItem: {
            default: {
                type: 'textarea',
                rules: [
                    {
                        required: true,
                        message: '请输入广播内容'
                    }
                ]
            },
            save: {}
        }
    },
    {
        title: '广播用户',
        name: 'sendUserId',
        dict: allUsers.map(({id, nickname}) => ({code: id, codeName: nickname})),
        tableItem: {},
        searchItem: {
            type: 'select'
        }
    },
    {
        title: '操作',
        tableItem: {
            width: 180,
            render: (text, record) => (
                <DataTable.Oper>
                    <CheckResource
                        resource='http./broadcast/*.DELETE'
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
]
