import React from 'react';
import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import Button from 'components/Button';
import moment from 'moment';
import CheckResource from '@/utils/checkResource';
import Condition from '@/utils/condition';

export default self => [
    {
        title: '访问路径',
        name: 'attachmentAddress',
        tableItem: {},
        searchItem: {
            group: 'close'
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
        title: '引用信息',
        name: 'linkInfo',
        tableItem: {},
        searchItem: {}
    },
    {
        title: '操作',
        tableItem: {
            width: 180,
            render: (text, {linkInfo, ...otherProps}) => (
                <DataTable.Oper>
                    <Button tooltip='下载' onClick={() => self.download({linkInfo, ...otherProps})}>
                        <Icon type="download" />
                    </Button>
                    <Condition
                        condition={!linkInfo}
                        component={
                            <CheckResource
                                resource='http./attachment/*.DELETE'
                                component={
                                    <Button tooltip='删除' onClick={e => self.delete({linkInfo, ...otherProps})}>
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
]
