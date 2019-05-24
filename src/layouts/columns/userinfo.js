import {message} from 'antd';

export default (self) => [
    {
        title: '原密码',
        name: 'password',
        formItem: {
            modpwd: {
                type: 'password',
            }
        }
    },
    {
        title: '新密码',
        name: 'newpassword',
        formItem: {
            modpwd: {
                type: 'password',
                repeat: true,
            }
        }
    },
    {
        title: '用户名',
        name: 'username',
        formItem: {
            userinfo: {
                preview: true,
            }
        }
    },
    {
        title: '邮箱',
        name: 'email',
        formItem: {
            userinfo: {
                col: { span: 12 },
                formItemLayout: {
                    labelCol: { span: 8 },
                    wrapperCol: { span: 13 }
                },
                rules: [
                    {
                        required: true,
                        message: '请输入邮箱'
                    },
                    {
                        type: 'email',
                        message: '邮箱地址格式错误'
                    }
                ]
            }
        }
    },
    {
        title: '昵称',
        name: 'nickname',
        formItem: {
            userinfo: {
                col: { span: 12 },
                formItemLayout: {
                    labelCol: { span: 4 },
                    wrapperCol: { span: 14 }
                },
                rules: [
                    {
                        required: true,
                        message: '请输入昵称'
                    }
                ]
            }
        }
    },
    {
        title: '性别',
        name: 'sex',
        dict: [
            {code: 1, codeName: '男'},
            {code: 0, codeName: '女'},
        ],
        formItem: {
            userinfo: {
                type: 'radio',
                initialValue: 1,
                col: { span: 12 },
                formItemLayout: {
                    labelCol: { span: 8 },
                    wrapperCol: { span: 13 }
                },
                rules: [
                    {
                        required: true,
                        message: '请选择性别'
                    }
                ]
            }
        }
    },
    {
        title: '生日',
        name: 'birth',
        formItem: {
            userinfo: {
                type: 'date',
                col: { span: 12 },
                formItemLayout: {
                    labelCol: { span: 4 },
                    wrapperCol: { span: 14 }
                },
                rules: [
                    {
                        required: true,
                        message: '请输入生日'
                    }
                ]
            }
        }
    },
    {
        title: '头像',
        name: 'headImg',
        formItem: {
            userinfo: {
                type: 'upload/avatar',
                normalize: value => ({
                    ...value,
                    uid: `fs_${value.id}`,
                    thumbUrl: value.attachmentAddress
                }),
                rules: [
                    {
                        required: true,
                        message: '请上传头像'
                    }
                ],
                action: '/file/head/1',
                fileName: 'file',
                onChange: (form, info) => {
                    if (info.file.status === 'uploading') {
                        self.setState({modalLoading: true});
                    } else if (info.file.status === 'done') {
                        self.setState({modalLoading: false});
                    }
                },
                getValueFromEvent: info => {
                    if (info.file.status === 'done') {
                        const {code, data} = info.file.response;
                        if (code===200) {
                            return {...data, uid: `fs_${data.id}`, thumbUrl: data.attachmentAddress};
                        }
                    }
                    return {};
                },
                beforeUpload: file => {
                    const validType = file.type === 'image/jpeg' || file.type === 'image/png';
                    if (!validType) {
                        message.error('请上传JPG、PNG图片');
                    }
                    const isLt10M = file.size / 1024 / 1024 < 10;
                    if (!isLt10M) {
                        message.error('图片必须小于10M');
                    }
                    return validType && isLt10M;
                }
            }
        }
    },
];
