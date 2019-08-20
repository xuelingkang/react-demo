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
        dict: [{code: 't_user.head_img_id', codeName: '用户头像'},
            {code: 't_mail_attachment_link.attachment_id', codeName: '邮件附件'},
            {code: 't_open_source_attachment_link.attachment_id', codeName: '开源组件图片'},
            {code: 't_letter_attachment_link.attachment_id', codeName: '留言图片'},
            {code: 't_letter_reply_attachment_link.attachment_id', codeName: '留言回复图片'}],
        name: 'linkInfo',
        tableItem: {},
        searchItem: {
            type: 'select'
        }
    },
    {
        title: '操作',
        tableItem: {
            width: 180,
            render: (text, record) => {
                const {linkInfo} = record;
                return (
                    <DataTable.Oper>
                        <Button tooltip='下载' onClick={() => self.download(record)}>
                            <Icon type="download" />
                        </Button>
                        <Condition
                            condition={!linkInfo}
                            component={
                                <CheckResource
                                    resource='http./attachment/*.DELETE'
                                    component={
                                        <Button tooltip='删除' onClick={e => self.delete(record)}>
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
    }
]
