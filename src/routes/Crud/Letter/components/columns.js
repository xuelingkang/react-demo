import React from 'react';
import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import Button from 'components/Button';
import moment from 'moment';
import CheckResource from '@/utils/checkResource';

export default (self, allUsers) => [
    {
        title: '留言描述',
        name: 'description',
        tableItem: {
            render: (text) => (
                <div style={{wordBreak:'break-all'}}>
                    {text}
                </div>
            )
        },
        searchItem: {
            group: 'close'
        },
        formItem: {
            save: {
                col: { span: 24 },
                formItemLayout: {
                    labelCol: { span: 3 },
                    wrapperCol: { span: 20 }
                },
                rules: [
                    {
                        required: true,
                        message: '请输入留言描述'
                    }
                ]
            }
        }
    },
    {
        title: '留言用户',
        name: 'letterUserId',
        dict: allUsers.map(({id, nickname}) => ({code: id, codeName: nickname})),
        tableItem: {},
        searchItem: {
            type: 'select'
        }
    },
    {
        title: '留言时间',
        name: 'letterTime',
        tableItem: {
            render: text => text? moment(text).format('YYYY-MM-DD HH:mm'): null
        }
    },
    {
        title: '联系类型',
        name: 'contactType',
        dict: [{code: '微信', codeName: '微信'}, {code: 'QQ', codeName: 'QQ'}, {code: 'email', codeName: 'email'}],
        tableItem: {},
        searchItem: {
            type: 'select'
        },
        formItem: {
            save: {
                col: { span: 12 },
                formItemLayout: {
                    labelCol: { span: 6 },
                    wrapperCol: { span: 16 }
                },
                type: 'radio'
            }
        }
    },
    {
        title: '联系方式',
        name: 'contact',
        tableItem: {},
        searchItem: {},
        formItem: {
            save: {
                col: { span: 12 },
                formItemLayout: {
                    labelCol: { span: 6 },
                    wrapperCol: { span: 16 }
                }
            }
        }
    },
    {
        title: '内容',
        name: 'letterContent',
        formItem: {
            save: {
                col: { span: 24 },
                formItemLayout: {
                    labelCol: { span: 3 },
                    wrapperCol: { span: 20 }
                },
                type: 'markdown',
                rules: [
                    {
                        required: true,
                        message: '请输入留言'
                    }
                ],
                markdownProps: {
                    height: 400,
                    toolbar: {
                        h1: true, // h1
                        h2: true, // h2
                        h3: true, // h3
                        h4: true, // h4
                        img: true, // 图片
                        link: true, // 链接
                        code: true, // 代码块
                        preview: true, // 预览
                        expand: true, // 全屏
                        undo: true, // 撤销
                        redo: true, // 重做
                        subfield: true, // 单双栏模式
                    }
                }
            }
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
                            resource='http./letter/*.GET'
                            component={
                                <CheckResource
                                    resource='http./letterReply/*/*.GET'
                                    component={
                                        <Button tooltip='查看'
                                                onClick={e => self.openLetter(record, self.requestDetail)}>
                                            <Icon type="search" font='iconfont' />
                                        </Button>
                                    }
                                />
                            }
                        />
                        <CheckResource
                            resource='http./letter/*.DELETE'
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
