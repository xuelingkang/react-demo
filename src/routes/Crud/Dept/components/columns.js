import React from 'react';
import { InputNumber } from "antd"
import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import Button from 'components/Button';
import createInputNumber from 'components/Form/model/number';

export default (self, allDepts) => [
    {
        title: '名称',
        name: 'deptName',
        tableItem: {},
        formItem: {
            default: {
                rules: [
                    {
                        required: true,
                        message: '请输入部门名称'
                    }
                ]
            },
            save: {},
            update: {},
        }
    },
    {
        title: '上级部门',
        name: 'pid',
        dict: allDepts.map(dept => {
            return {
                code: dept.id,
                codeName: dept.fullName
            }
        }),
        tableItem: {},
        searchItem: {
            type: 'select'
        },
        formItem: {
            default: {
                type: 'select'
            },
            save: {},
            update: {},
        }
    },
    {
        title: '全名',
        name: 'fullName',
        tableItem: {},
        searchItem: {
            group: 'close'
        }
    },
    {
        title: '级别',
        name: 'level',
        tableItem: {},
        searchItem: {}
    },
    {
        title: '顺序',
        name: 'seq',
        tableItem: {},
        formItem: {
            default: {
                type: 'number',
                rules: [
                    {
                        required: true,
                        message: '请输入部门顺序'
                    },
                    {
                        pattern: /^[1-9]\d{0,4}$/g,
                        message: '部门顺序最小为1最大为99999'
                    }
                ],
                step: 100
            },
            save: {},
            update: {},
        }
    },
    {
        title: '操作',
        tableItem: {
            width: 180,
            render: (text, record) => (
                <DataTable.Oper>
                    <Button tooltip="修改"
                            onClick={e => self.openModal('update', '更新部门', record)}>
                        <Icon type="edit" />
                    </Button>
                    <Button tooltip="删除" onClick={e => self.delete(record)}>
                        <Icon type="trash" />
                    </Button>
                </DataTable.Oper>
            )
        }
    }
];
