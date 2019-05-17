import React from 'react';
import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import Button from 'components/Button';

export default (self, allDepts) => [
    {
        title: '上级部门',
        name: 'pid',
        dict: allDepts.map(dept => {
            return {
                code: dept.id,
                codeName: dept.fullName
            }
        }),
        searchItem: {
            type: 'select'
        },
        formItem: {
            type: 'select'
        }
    },
    {
        title: '名称',
        name: 'deptName',
        tableItem: {},
        formItem: {}
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
        formItem: {}
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
