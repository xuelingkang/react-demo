import React from 'react';
import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import Button from 'components/Button';
import CheckResource from '@/utils/checkResource';

export default (self, allDepts, allRoles) => [
    {
        title: '用户名',
        name: 'username',
        tableItem: {},
        formItem: {
            default: {
                rules: [
                    {
                        required: true,
                        message: '请输入用户名'
                    },
                    {
                        pattern: /^\w{5,20}$/,
                        message: '用户名最少5位，最多20位'
                    }
                ]
            },
            save: {},
            update: {
                preview: true
            }
        },
        searchItem: {
            group: 'close'
        },
    },
    {
        title: '部门',
        name: 'deptId',
        dict: allDepts.map(dept => ({code: dept.id, codeName: dept.fullName})),
        tableItem: {},
        formItem: {
            default: {
                type: 'select',
                rules: [
                    {
                        required: true,
                        message: '请选择部门'
                    }
                ]
            },
            save: {},
            update: {}
        },
        searchItem: {
            type: 'select'
        }
    },
    {
        title: '密码',
        name: 'password',
        formItem: {
            save: {
                rules: [
                    {
                        required: true,
                        message: '请输入密码'
                    }
                ]
            },
            update: {}
        }
    },
    {
        title: '邮箱',
        name: 'email',
        tableItem: {},
        formItem: {
            default: {
                rules: [
                    {
                        required: true,
                        message: '请输入邮箱'
                    }
                ]
            },
            save: {},
            update: {},
        },
        searchItem: {}
    },
    {
        title: '昵称',
        name: 'nickname',
        tableItem: {},
        formItem: {
            default: {
                rules: [
                    {
                        required: true,
                        message: '请输入昵称'
                    }
                ]
            },
            save: {},
            update: {},
        },
        searchItem: {}
    },
    {
        title: '性别',
        name: 'sex',
        dict: [
            {code: 1, codeName: '男'},
            {code: 0, codeName: '女'}
        ],
        tableItem: {},
        formItem: {
            default: {
                type: 'select',
                rules: [
                    {
                        required: true,
                        message: '请选择性别'
                    }
                ]
            },
            save: {},
            update: {}
        },
        searchItem: {
            type: 'select'
        }
    },
    {
        title: '生日',
        name: 'birth',
        tableItem: {},
        formItem: {
            default: {
                type: 'date',
                rules: [
                    {
                        required: true,
                        message: '请输入生日'
                    }
                ]
            },
            save: {},
            update: {}
        }
    },
    {
        title: '登录时间',
        name: 'logintime',
        tableItem: {}
    },
    {
        title: '角色',
        name: 'roles',
        formItem: {
            default: {
                type: 'transfer',
                showSearch: true,
                dataSource: allRoles.map(role => {
                    const {id, roleDesc, roleName} = role;
                    return {
                        key: id,
                        title: `${roleDesc}: ${roleName}`
                    }
                }),
                rules: [
                    {
                        required: true,
                        message: '请选择角色'
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
                        resource='http./user.PUT'
                        component={
                            <Button tooltip='修改'
                                    onClick={e => self.openModal('update', '更新用户', record)}>
                                <Icon type="edit" />
                            </Button>
                        }
                    />
                    <CheckResource
                        resource='http./user/*.DELETE'
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
