import React from 'react';
import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import Button from 'components/Button';
import moment from 'moment';
import CheckResource from '@/utils/checkResource';

// import config from '@/config';
// const {notice, baseURL, attachmentSizeLimit: {mail}} = config;

export default (self, allUsers) => [
    {
        title: '名称',
        name: 'sourceName',
        tableItem: {},
        searchItem: {
            group: 'close'
        },
        formItem: {
            default: {
                col: { span: 8 },
                formItemLayout: {
                    labelCol: { span: 6 },
                    wrapperCol: { span: 18 }
                },
                rules: [
                    {
                        required: true,
                        message: '请输入组件名称'
                    }
                ]
            },
            save: {},
            update: {}
        }
    },
    {
        title: '描述',
        name: 'sourceDesc',
        tableItem: {},
        searchItem: {},
        formItem: {
            default: {
                col: { span: 16 },
                formItemLayout: {
                    labelCol: { span: 4 },
                    wrapperCol: { span: 18 }
                },
                rules: [
                    {
                        required: true,
                        message: '请输入组件描述'
                    }
                ]
            },
            save: {},
            update: {}
        }
    },
    {
        title: 'gitee地址',
        name: 'giteeUrl',
        tableItem: {},
        searchItem: {},
        formItem: {
            default: {
                col: { span: 8 },
                formItemLayout: {
                    labelCol: { span: 6 },
                    wrapperCol: { span: 18 }
                },
                rules: [
                    {
                        required: true,
                        message: '请输入gitee地址'
                    }
                ]
            },
            save: {},
            update: {}
        }
    },
    {
        title: 'github地址',
        name: 'githubUrl',
        tableItem: {},
        searchItem: {},
        formItem: {
            default: {
                col: { span: 8 },
                formItemLayout: {
                    labelCol: { span: 6 },
                    wrapperCol: { span: 18 }
                },
                rules: [
                    {
                        required: true,
                        message: '请输入github地址'
                    }
                ]
            },
            save: {},
            update: {}
        }
    },
    {
        title: '录入人',
        name: 'saveUserId',
        dict: allUsers.map(({id, nickname}) => ({code: id, codeName: nickname})),
        tableItem: {
            type: 'select'
        },
        searchItem: {
            type: 'select'
        }
    },
    {
        title: '录入时间',
        name: 'saveTime',
        tableItem: {
            render: text => text? moment(text).format('YYYY-MM-DD HH:mm'): null
        }
    },
    {
        title: '最后修改人',
        name: 'updateUserId',
        dict: allUsers.map(({id, nickname}) => ({code: id, codeName: nickname})),
        tableItem: {
            type: 'select'
        },
        searchItem: {
            type: 'select'
        }
    },
    {
        title: '最后修改时间',
        name: 'updateTime',
        tableItem: {
            render: text => text? moment(text).format('YYYY-MM-DD HH:mm'): null
        }
    },
    {
        title: '顺序',
        name: 'sourceSeq',
        tableItem: {},
        formItem: {
            default: {
                col: { span: 8 },
                formItemLayout: {
                    labelCol: { span: 6 },
                    wrapperCol: { span: 14 }
                },
                type: 'number',
                rules: [
                    {
                        required: true,
                        message: '请输入组件顺序'
                    },
                    {
                        pattern: /^[1-9]\d{0,4}$/g,
                        message: '组件顺序最小为1最大为99999'
                    }
                ],
                step: 100
            },
            save: {},
            update: {}
        }
    },
    {
        title: '说明文档',
        name: 'intro.readme',
        formItem: {
            default: {
                col: { span: 24 },
                formItemLayout: {
                    labelCol: { span: 2 },
                    wrapperCol: { span: 21 }
                },
                type: 'markdown',
                rules: [
                    {
                        required: true,
                        message: '请输入说明文档'
                    }
                ],
                markdownProps: {
                    preview: true,
                    subfield: true
                }
            },
            save: {},
            update: {}
        }
    },
    {
        title: '操作',
        tableItem: {
            width: 180,
            render: (text, record) => {
                return (
                    <DataTable.Oper>
                        <CheckResource
                            resource='http./open.PUT'
                            component={
                                <Button tooltip='修改'
                                        onClick={e => self.openModal('update', '更新组件', record, self.requestDetail)}>
                                    <Icon type="edit" />
                                </Button>
                            }
                        />
                        <CheckResource
                            resource='http./open/*.GET'
                            component={
                                <Button tooltip='查看'
                                        onClick={e => self.openModal('detail', '查看组件', record, self.requestDetail)}>
                                    <Icon type="search" font='iconfont' />
                                </Button>
                            }
                        />
                        <CheckResource
                            resource='http./open/*.DELETE'
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
    }
];
