import React from 'react';
import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import Button from 'components/Button';
import moment from 'moment';
import CheckResource from '@/utils/checkResource';
import Condition from '@/utils/condition';
import config from '@/config';

const {proxy, notice, baseURL, attachmentSizeLimit: {mail}} = config;

export default (self, allUsers) => [
    {
        title: '标题',
        name: 'mailSubject',
        tableItem: {},
        searchItem: {
            group: 'close'
        },
        formItem: {
            default: {
                rules: [
                    {
                        required: true,
                        message: '请输入邮件标题'
                    }
                ]
            },
            save: {},
            update: {},
            detail: {
                preview: true
            }
        }
    },
    {
        title: '类型',
        name: 'mailType',
        dict: [
            {code: 'warn', codeName: '警告'},
            {code: 'info', codeName: '提示'},
        ],
        tableItem: {},
        searchItem: {
            type: 'select'
        },
        formItem: {
            default: {
                type: 'radio',
                rules: [
                    {
                        required: true,
                        message: '请选择邮件类型'
                    }
                ]
            },
            save: {},
            update: {},
            detail: {
                preview: true
            }
        }
    },
    {
        title: '状态',
        name: 'mailStatus',
        dict: [
            {code: 'draft', codeName: '草稿'},
            {code: 'sending', codeName: '发送中'},
            {code: 'sent', codeName: '已发送'},
            {code: 'fail', codeName: '发送失败'},
        ],
        tableItem: {},
        searchItem: {
            type: 'select'
        }
    },
    {
        title: '接收用户',
        name: 'toUsersInfo',
        tableItem: {},
        searchItem: {},
        formItem: {
            detail: {
                preview: true
            }
        }
    },
    {
        title: '接收用户',
        name: 'toUsers',
        formItem: {
            default: {
                type: 'transfer',
                showSearch: true,
                dataSource: allUsers.map(user => {
                    const {id, nickname, username} = user;
                    return {
                        key: id,
                        title: `${nickname}(${username})`
                    }
                }),
                rules: [
                    {
                        required: true,
                        message: '请选择接收用户'
                    }
                ],
                modal: true
            },
            save: {},
            update: {
                normalize: (value) => value.map(item => item.id)
            },
        }
    },
    {
        title: '正文',
        name: 'mailContent',
        formItem: {
            default: {
                type: 'editor',
                rules: [
                    {
                        required: true,
                        message: '请输入正文'
                    }
                ]
            },
            save: {},
            update: {
                normalize: ({content}) => content
            },
            detail: {
                preview: true,
                normalize: ({content}) => content
            }
        }
    },
    {
        title: '附件',
        name: 'attachments',
        formItem: {
            default: {
                type: 'upload',
                action: `${baseURL}/file/mail/1`,
                fileName: 'file',
                max: 3,
                onChange: (form, info) => {
                    if (info.file.status === 'uploading') {
                        self.setState({modalLoading: true});
                    } else if (info.file.status === 'done') {
                        self.setState({modalLoading: false});
                    }
                },
                beforeUpload: file => {
                    const validSize = file.size / 1024 / 1024 < mail;
                    if (!validSize) {
                        notice.error(`单个附件必须小于${mail}M`);
                    }
                    return validSize;
                },
                getValueFromEvent: info => {
                    const {fileList} = info;
                    return fileList.map(file => {
                        const {response} = file;
                        if (response) {
                            const {code, data, message} = response;
                            if (code) {
                                if (code===200) {
                                    const {id, attachmentAddress} = data;
                                    return {
                                        ...file,
                                        id,
                                        url: proxy+attachmentAddress
                                    };
                                } else {
                                    return {
                                        ...file,
                                        response: message
                                    };
                                }
                            }
                        }
                        return file;
                    });
                }
            },
            save: {},
            update: {
                normalize: values => values.map(({id, attachmentName, attachmentAddress}) => ({
                    id,
                    uid: `fs_${id}`,
                    name: attachmentName,
                    status: 'done',
                    url: proxy+attachmentAddress
                }))
            },
            detail: {
                normalize: values => values.map(({id, attachmentName, attachmentAddress}) => ({
                    id,
                    uid: `fs_${id}`,
                    name: attachmentName,
                    status: 'done',
                    url: proxy+attachmentAddress
                })),
                preview: true
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
        title: '发送用户',
        name: 'sendUserId',
        dict: allUsers.map(({id, nickname}) => ({code: id, codeName: nickname})),
        tableItem: {},
        searchItem: {
            type: 'select'
        }
    },
    {
        title: '发送时间',
        name: 'sendTime',
        tableItem: {
            render: text => text? moment(text).format('YYYY-MM-DD HH:mm'): null
        }
    },
    {
        title: '操作',
        tableItem: {
            width: 180,
            render: (text, record) => {
                const {mailStatus} = record;
                return (
                    <DataTable.Oper>
                        <Condition
                            condition={mailStatus==='draft'||mailStatus==='fail'}
                            component={
                                <CheckResource
                                    resource='http./mail/*.PATCH'
                                    component={
                                        <Button tooltip='发送'
                                                onClick={e => self.send(record)}>
                                            <Icon type="twitter" antd />
                                        </Button>
                                    }
                                />
                            }
                        />
                        <Condition
                            condition={mailStatus==='draft'||mailStatus==='fail'}
                            component={
                                <CheckResource
                                    resource='http./mail.PUT'
                                    component={
                                        <Button tooltip='修改'
                                                onClick={e => self.openModal('update', '更新邮件', record, self.requestDetail)}>
                                            <Icon type="edit" />
                                        </Button>
                                    }
                                />
                            }
                        />
                        <Condition
                            condition={mailStatus!=='draft'&&mailStatus!=='fail'}
                            component={
                                <CheckResource
                                    resource='http./mail/*.GET'
                                    component={
                                        <Button tooltip='查看'
                                                onClick={e => self.openModal('detail', '查看邮件', record, self.requestDetail)}>
                                            <Icon type="search" font='iconfont' />
                                        </Button>
                                    }
                                />
                            }
                        />
                        <CheckResource
                            resource='http./mail/*.DELETE'
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
