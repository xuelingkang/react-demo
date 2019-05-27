import React from 'react';
import { Input, Select } from 'antd';
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
                col: { span: 12 },
                formItemLayout: {
                    labelCol: { span: 8 },
                    wrapperCol: { span: 13 }
                },
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
                col: { span: 12 },
                formItemLayout: {
                    labelCol: { span: 4 },
                    wrapperCol: { span: 14 }
                },
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
        title: '参数列表',
        name: 'parameters',
        formItem: {
            save: {
                type: 'custom',
                render: (record, form, otherProps) => {
                    console.log('record', record);
                    console.log('form', form);
                    console.log('otherProps', otherProps);
                    return (
                        <div>
                            <div className='ant-col ant-col-6 col-item'
                                 style={{paddingLeft: 4, paddingRight: 4}}>
                                <div className='ant-row ant-form-item col-item-content'>
                                    <div className='ant-form-item-control'>
                                        <span className='ant-form-item-children'>
                                            <Input placeholder='请输入参数名称' />
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='ant-col ant-col-6 col-item'
                                 style={{paddingLeft: 4, paddingRight: 4}}>
                                <div className='ant-row ant-form-item col-item-content'>
                                    <div className='ant-form-item-control'>
                                        <span className='ant-form-item-children'>
                                            <Select placeholder='请选择参数类型'>
                                                <Select.Option key='string' value='string' title='string'>
                                                    string
                                                </Select.Option>
                                                <Select.Option key='number' value='number' title='number'>
                                                    number
                                                </Select.Option>
                                            </Select>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='ant-col ant-col-6 col-item'
                                 style={{paddingLeft: 4, paddingRight: 4}}>
                                <div className='ant-row ant-form-item col-item-content'>
                                    <div className='ant-form-item-control'>
                                        <span className='ant-form-item-children'>
                                            <Input placeholder='请输入参数描述' />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
            },
            update: {
                type: 'custom',
                render: (record, form, otherProps) => {
                    console.log('record', record);
                    console.log('form', form);
                    console.log('otherProps', otherProps);
                    return null;
                }
            }
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
