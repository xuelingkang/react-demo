import React from 'react';

export default () => [
    {
        title: '广播用户',
        name: 'sendUserNickname',
        formItem: {
            broadcast: {
                preview: true,
            }
        }
    },
    {
        title: '广播时间',
        name: 'sendTime',
        formItem: {
            broadcast: {
                type: 'datetime',
                preview: true
            }
        }
    },
    {
        title: '广播内容',
        name: 'content',
        formItem: {
            broadcast: {
                preview: true,
            }
        }
    },
]
