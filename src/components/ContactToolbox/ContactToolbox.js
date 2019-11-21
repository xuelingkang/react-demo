import React, { Component } from 'react';
import { Modal } from 'antd';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { ModalForm } from 'components/Modal';
import config from '@/config';
import { save } from '@/routes/Crud/Letter/service';
import wechat from 'assets/images/wechat.png';
import './style/index.less';

const {attachmentSizeLimit: {letter}} = config;

export default class extends Component {
    state = {
        menuVisible: false,
        wechatVisible: false,
        qqIframeSrc: '',
        letterVisible: false,
        letterType: '',
        letterTitle: '',
        letterRecord: {},
        timerId: null
    };
    componentDidMount() {
        this.showLetter();
    }
    componentWillUnmount() {
        const {timerId} = this.state;
        timerId && clearTimeout(timerId);
    }
    showMenu = () => {
        this.setState({
            menuVisible: true
        });
    }
    hideMenu = () => {
        this.setState({
            menuVisible: false
        });
    }
    showWechat = () => {
        this.setState({
            wechatVisible: true
        });
    }
    hideWechat = () => {
        this.setState({
            wechatVisible: false
        });
    }
    showLetter = () => {
        this.setState({
            letterVisible: true,
            letterType: 'save',
            letterTitle: '请留下您的建议和联系方式',
            letterRecord: {}
        });
    }
    hideLetter = () => {
        this.setState({
            letterVisible: false,
            letterType: '',
            letterTitle: '',
            letterRecord: {}
        });
    }
    saveLetter = async (values, record) => {
        const {attachments} = record;
        const {code} = await save({...values, attachments});
        if (code === 200) {
            this.hideLetter();
        }
    }
    addLetterAttachment = ({id}) => {
        const {letterRecord={}} = this.state;
        const {attachments=[]} = letterRecord;
        this.setState({
            letterRecord: {
                ...letterRecord,
                attachments: attachments.concat({id})
            }
        });
    }
    letterModalHandlers = {
        onSubmit: {
            save: this.saveLetter,
        },
        onCancel: {
            default: this.hideLetter
        }
    };
    letterColumn = [
        {
            title: '留言描述',
            name: 'description',
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
            title: '联系类型',
            name: 'contactType',
            dict: [{code: '微信', codeName: '微信'}, {code: 'QQ', codeName: 'QQ'}, {code: 'email', codeName: 'email'}],
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
                        upload: {
                            action: '/file/letter/1',
                            name: 'file',
                            maxSize: letter,
                            accepts: ['image/jpeg', 'image/png'],
                            getUrl: ({attachmentAddress}) => attachmentAddress,
                            success: this.addLetterAttachment
                        },
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
        }
    ];
    render() {
        const {menuVisible, wechatVisible, qqIframeSrc, letterVisible, letterRecord, letterTitle, letterType} = this.state;
        const menuStyle = {
            display: menuVisible? '': 'none'
        };
        const minSize = Math.min(document.body.offsetWidth, document.body.offsetHeight)*0.9-48;
        const wechatImgWidth = minSize>=300? 300: minSize;
        const wechatImgStyle = {
            width: wechatImgWidth
        };
        const wechatModalProps = {
            visible: wechatVisible,
            title: '扫描二维码添加站长微信',
            width: wechatImgWidth+48,
            bodyStyle: {
                height: wechatImgWidth+48
            },
            onCancel: this.hideWechat,
            centered: true,
            maskClosable: true,
            destroyOnClose: true,
            footer: null
        };
        const letterModalProps = {
            title: letterTitle,
            modalType: letterType,
            record: letterRecord,
            visible: letterVisible,
            columns: this.letterColumn,
            modalOpts: {
                width: 700
            },
            handlers: this.letterModalHandlers
        };
        return (
            <div className='contact-container' onMouseOver={this.showMenu} onMouseOut={this.hideMenu}>
                <Button tooltip='联系站长' shape='circle' size='large' onTouchStart={this.showMenu} onClick={this.showMenu}>
                    <span className='contact-icon'>
                        <Icon type='phone' antd theme='filled' />
                    </span>
                </Button>
                <div className='contact-menu-container' style={menuStyle}>
                    <div className='contact-menu'>
                        <div>
                            <a onTouchStart={this.showWechat} onClick={this.showWechat}>
                                <Icon type='wechat' antd className='contact-menu-item-icon' />
                                <span className='contact-menu-item'>微信联系</span>
                                <span className='contact-menu-item-comment'>查看站长微信二维码</span>
                            </a>
                            <a href='http://wpa.qq.com/msgrd?v=3&uin=574290057&site=qq&menu=yes' target='_blank'>
                                <Icon type='qq' antd className='contact-menu-item-icon' />
                                <span className='contact-menu-item'>QQ联系</span>
                                <span className='contact-menu-item-comment'>打开QQ临时通讯</span>
                            </a>
                            <a onTouchStart={this.showLetter} onClick={this.showLetter}>
                                <Icon type='highlight' antd className='contact-menu-item-icon' />
                                <span className='contact-menu-item'>站内留言</span>
                                <span className='contact-menu-item-comment'>在本站添加留言</span>
                            </a>
                        </div>
                        <Icon type='close' antd className='contact-menu-close' onTouchStart={this.hideMenu} onClick={this.hideMenu} />
                    </div>
                </div>
                <Modal {...wechatModalProps}>
                    <img style={wechatImgStyle} alt='微信二维码' src={wechat} />
                </Modal>
                <iframe style={{display: 'none'}} src={qqIframeSrc} />
                <ModalForm {...letterModalProps} />
            </div>
        );
    }
}
