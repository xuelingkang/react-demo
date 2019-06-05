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
        title: '广播内容',
        name: 'content',
        tableItem: {},
        searchItem: {
            group: 'close'
        },
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
        title: '状态',
        name: 'readStatus',
        dict: [
            {code: 0, codeName: '未读'},
            {code: 1, codeName: '已读'},
        ],
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
                        resource='http./broadcast/self/*.GET'
                        component={
                            <Button tooltip='查看'
                                    onClick={e => self.openModal('detail', '查看广播', record, self.requestDetail)}>
                                <Icon type="search" font='iconfont' />
                            </Button>
                        }
                    />
                </DataTable.Oper>
            )
        }
    }
]
