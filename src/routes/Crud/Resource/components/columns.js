import React from 'react';
import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import Button from 'components/Button';
import CheckResource from '@/utils/checkResource';

export default (self, allCategorys) => [
    {
        title: '协议类型',
        name: 'resourceType',
        dict: [
            {code: 'http', codeName: 'http'},
            {code: 'websocket', codeName: 'websocket'},
        ],
        tableItem: {},
        formItem: {
            default: {
                type: 'select',
                rules: [
                    {
                        required: true,
                        message: '请选择协议类型'
                    }
                ],
            },
            save: {},
            update: {}
        },
        searchItem: {
            type: 'select'
        },
    },
    {
        title: '权限类别',
        name: 'resourceCategory',
        dict: allCategorys.map(category => ({code: category, codeName: category})),
        tableItem: {},
        formItem: {
            default: {
                rules: [
                    {
                        required: true,
                        message: '请输入权限类别'
                    }
                ]
            },
            save: {},
            update: {},
        },
        searchItem: {
            type: 'select'
        }
    },
    {
        title: '权限pattern',
        name: 'resourcePattern',
        tableItem: {},
        formItem: {
            default: {
                rules: [
                    {
                        required: true,
                        message: '请输入权限pattern'
                    }
                ]
            },
            save: {},
            update: {},
        },
        searchItem: {
            group: 'close'
        }
    },
    {
        title: '请求方法',
        name: 'resourceMethod',
        dict: [
            {code: 'GET', codeName: 'GET'},
            {code: 'DELETE', codeName: 'DELETE'},
            {code: 'HEAD', codeName: 'HEAD'},
            {code: 'POST', codeName: 'POST'},
            {code: 'PUT', codeName: 'PUT'},
            {code: 'PATCH', codeName: 'PATCH'},
            {code: 'SUBSCRIBE', codeName: 'SUBSCRIBE'},
        ],
        tableItem: {},
        formItem: {
            default: {
                type: 'select'
            },
            save: {},
            update: {},
        },
        searchItem: {
            type: 'select'
        }
    },
    {
        title: '权限顺序',
        name: 'resourceSeq',
        tableItem: {},
        formItem: {
            default: {
                type: 'number',
                rules: [
                    {
                        required: true,
                        message: '请输入权限顺序'
                    },
                    {
                        pattern: /^[1-9]\d{0,4}$/g,
                        message: '权限顺序最小为1最大为99999'
                    }
                ],
                step: 100
            },
            save: {},
            update: {},
        }
    },
    {
        title: '权限描述',
        name: 'resourceDesc',
        tableItem: {},
        formItem: {
            default: {
                rules: [
                    {
                        required: true,
                        message: '请输入权限描述'
                    }
                ]
            },
            save: {},
            update: {},
        },
        searchItem: {}
    },
    {
        title: '操作',
        tableItem: {
            width: 180,
            render: (text, record) => (
                <DataTable.Oper>
                    <CheckResource
                        resource='http./resource.PUT'
                        component={
                            <Button tooltip='修改'
                                    onClick={e => self.openModal('update', '更新权限', record)}>
                                <Icon type="edit" />
                            </Button>
                        }
                    />
                    <CheckResource
                        resource='http./resource/*.DELETE'
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
