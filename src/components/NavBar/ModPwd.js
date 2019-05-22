import React, { PureComponent } from 'react';
import { ModalForm } from 'components/Modal';
import { axiosPatch } from '@/utils/axios';
import config from '@/config';

const { notice } = config;

export default class extends PureComponent {

    modalHandlers = {
        onSubmit: {
            modpwd: async values => {
                const { code } = await axiosPatch('/userinfo', values);
                if (code===200) {
                    notice.success('修改密码成功');
                    this.props.hideModpwd();
                }
            }
        },
        onCancel: {
            modpwd: this.props.hideModpwd
        }
    };

    render() {
        const {visible} = this.props;
        const modalFormProps = {
            visible,
            title: '修改密码',
            modalType: 'modpwd',
            columns: [
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
            ],
            modalOpts: {
                width: 700
            },
            handlers: this.modalHandlers
        };
        return <ModalForm {...modalFormProps} />;
    }

}
