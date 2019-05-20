import React from 'react';
import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import Button from 'components/Button';
import CheckResource from '@/utils/checkResource';

export default (self, allResources) => [
    {
        title: '角色名称',
        name: 'roleName',
        tableItem: {},
        formItem: {
            default: {
                rules: [
                    {
                        required: true,
                        message: '请输入角色名称'
                    }
                ]
            },
            save: {},
            update: {}
        },
        searchItem: {
            group: 'close'
        },
    },
    {
        title: '角色描述',
        name: 'roleDesc',
        tableItem: {},
        formItem: {
            default: {
                rules: [
                    {
                        required: true,
                        message: '请输入角色描述'
                    }
                ]
            },
            save: {},
            update: {},
        },
        searchItem: {}
    },
    {
        title: '角色顺序',
        name: 'roleSeq',
        tableItem: {},
        formItem: {
            default: {
                type: 'number',
                rules: [
                    {
                        required: true,
                        message: '请输入角色顺序'
                    },
                    {
                        pattern: /^[1-9]\d{0,4}$/g,
                        message: '角色顺序最小为1最大为99999'
                    }
                ],
                step: 100
            },
            save: {},
            update: {},
        }
    },
    {
        title: '权限pattern',
        name: 'resourcesInfo',
        searchItem: {}
    },
    {
        title: '权限',
        name: 'resources',
        formItem: {
            default: {
                type: 'transfer',
                showSearch: true,
                dataSource: allResources.map(resource => {
                    const {id, resourceDesc, resourceType, resourcePattern, resourceMethod} = resource;
                    return {
                        key: id,
                        title: `${resourceDesc}: ${resourceType}.${resourcePattern}.${resourceMethod}`
                    }
                }),
                rules: [
                    {
                        required: true,
                        message: '请选择权限'
                    }
                ],
            },
            save: {},
            update: {
                normalize: (value) => value.map(item => item.id)
            }
        }
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
                                    onClick={e => self.openModal('update', '更新角色', record)}>
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
