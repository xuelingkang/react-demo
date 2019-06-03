import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Modal, Button, Avatar, Input, List} from 'antd';
import moment from 'moment';
import './style/chat.less';

class ModalChat extends Component {

    state = {
        data: [
            {
                "content": "12121214222222222222222222222222227777777777777777777777777777777777777777777777777777777777777777777",
                "id": 15,
                "readStatus": 0,
                "sendTime": 1559529895372,
                "toUser": {
                    "birth": 650736000736,
                    "dept": null,
                    "deptId": 1,
                    "email": "",
                    "headImg": {
                        "attachmentAddress": "/demofile/head/2019/5/1558794820025.png",
                        "attachmentName": "",
                        "attachmentPath": "",
                        "createTime": null,
                        "id": 120,
                        "linkInfo": ""
                    },
                    "headImgId": 120,
                    "id": 9,
                    "logintime": 1559540934686,
                    "newpassword": "",
                    "nickname": "薛凌康",
                    "password": "",
                    "roles": [],
                    "sex": null,
                    "username": "admin"
                },
                "toUserId": 9,
                "sendUser": {
                    "birth": 689529600315,
                    "dept": null,
                    "deptId": 1,
                    "email": "952649292@qq.com",
                    "headImg": {
                        "attachmentAddress": "/demofile/head/2019/5/1558794732206.png",
                        "attachmentName": "",
                        "attachmentPath": "",
                        "createTime": null,
                        "id": 119,
                        "linkInfo": ""
                    },
                    "headImgId": null,
                    "id": 25,
                    "logintime": 1559529291545,
                    "newpassword": "",
                    "nickname": "刘世红",
                    "password": "",
                    "roles": [],
                    "sex": null,
                    "username": "liushihong"
                },
                "sendUserId": 25
            },
            {
                "content": "12121214222222222222222222222222227777777777777777777777777777777777777777777777777777777777777777777",
                "id": 14,
                "readStatus": 0,
                "sendTime": 1559529331563,
                "sendUser": {
                    "birth": 650736000736,
                    "dept": null,
                    "deptId": 1,
                    "email": "",
                    "headImg": {
                        "attachmentAddress": "/demofile/head/2019/5/1558794820025.png",
                        "attachmentName": "",
                        "attachmentPath": "",
                        "createTime": null,
                        "id": 120,
                        "linkInfo": ""
                    },
                    "headImgId": 120,
                    "id": 9,
                    "logintime": 1559540934686,
                    "newpassword": "",
                    "nickname": "薛凌康",
                    "password": "",
                    "roles": [],
                    "sex": null,
                    "username": "admin"
                },
                "sendUserId": 9,
                "toUser": {
                    "birth": 689529600315,
                    "dept": null,
                    "deptId": 1,
                    "email": "952649292@qq.com",
                    "headImg": {
                        "attachmentAddress": "/demofile/head/2019/5/1558794732206.png",
                        "attachmentName": "",
                        "attachmentPath": "",
                        "createTime": null,
                        "id": 119,
                        "linkInfo": ""
                    },
                    "headImgId": null,
                    "id": 25,
                    "logintime": 1559529291545,
                    "newpassword": "",
                    "nickname": "刘世红",
                    "password": "",
                    "roles": [],
                    "sex": null,
                    "username": "liushihong"
                },
                "toUserId": 25
            },
            {
                "content": "叽叽咕咕过过过过过过过过过过过过过过过过过过过柔柔弱弱若若若若若若若若若若若若若额定的多多多多多多多多多多多多多多多多多多",
                "id": 13,
                "readStatus": 0,
                "sendTime": 1559529314538,
                "sendUser": {
                    "birth": 650736000736,
                    "dept": null,
                    "deptId": 1,
                    "email": "",
                    "headImg": {
                        "attachmentAddress": "/demofile/head/2019/5/1558794820025.png",
                        "attachmentName": "",
                        "attachmentPath": "",
                        "createTime": null,
                        "id": 120,
                        "linkInfo": ""
                    },
                    "headImgId": 120,
                    "id": 9,
                    "logintime": 1559540934686,
                    "newpassword": "",
                    "nickname": "薛凌康",
                    "password": "",
                    "roles": [],
                    "sex": null,
                    "username": "admin"
                },
                "sendUserId": 9,
                "toUser": {
                    "birth": 650736000736,
                    "dept": null,
                    "deptId": 1,
                    "email": "xuelingkang@163.com",
                    "headImg": {
                        "attachmentAddress": "/demofile/head/2019/5/1558794820025.png",
                        "attachmentName": "",
                        "attachmentPath": "",
                        "createTime": null,
                        "id": 120,
                        "linkInfo": ""
                    },
                    "headImgId": null,
                    "id": 9,
                    "logintime": 1559540934686,
                    "newpassword": "",
                    "nickname": "薛凌康",
                    "password": "",
                    "roles": [],
                    "sex": null,
                    "username": "admin"
                },
                "toUserId": 9
            },
            {
                "content": "12121214222222222222222222222222227777777777777777777777777777777777777777777777777777777777777777777",
                "id": 15,
                "readStatus": 0,
                "sendTime": 1559529895372,
                "sendUser": {
                    "birth": 650736000736,
                    "dept": null,
                    "deptId": 1,
                    "email": "",
                    "headImg": {
                        "attachmentAddress": "/demofile/head/2019/5/1558794820025.png",
                        "attachmentName": "",
                        "attachmentPath": "",
                        "createTime": null,
                        "id": 120,
                        "linkInfo": ""
                    },
                    "headImgId": 120,
                    "id": 9,
                    "logintime": 1559540934686,
                    "newpassword": "",
                    "nickname": "薛凌康",
                    "password": "",
                    "roles": [],
                    "sex": null,
                    "username": "admin"
                },
                "sendUserId": 9,
                "toUser": {
                    "birth": 689529600315,
                    "dept": null,
                    "deptId": 1,
                    "email": "952649292@qq.com",
                    "headImg": {
                        "attachmentAddress": "/demofile/head/2019/5/1558794732206.png",
                        "attachmentName": "",
                        "attachmentPath": "",
                        "createTime": null,
                        "id": 119,
                        "linkInfo": ""
                    },
                    "headImgId": null,
                    "id": 25,
                    "logintime": 1559529291545,
                    "newpassword": "",
                    "nickname": "刘世红",
                    "password": "",
                    "roles": [],
                    "sex": null,
                    "username": "liushihong"
                },
                "toUserId": 25
            },
            {
                "content": "12121214222222222222222222222222227777777777777777777777777777777777777777777777777777777777777777777",
                "id": 14,
                "readStatus": 0,
                "sendTime": 1559529331563,
                "sendUser": {
                    "birth": 650736000736,
                    "dept": null,
                    "deptId": 1,
                    "email": "",
                    "headImg": {
                        "attachmentAddress": "/demofile/head/2019/5/1558794820025.png",
                        "attachmentName": "",
                        "attachmentPath": "",
                        "createTime": null,
                        "id": 120,
                        "linkInfo": ""
                    },
                    "headImgId": 120,
                    "id": 9,
                    "logintime": 1559540934686,
                    "newpassword": "",
                    "nickname": "薛凌康",
                    "password": "",
                    "roles": [],
                    "sex": null,
                    "username": "admin"
                },
                "sendUserId": 9,
                "toUser": {
                    "birth": 689529600315,
                    "dept": null,
                    "deptId": 1,
                    "email": "952649292@qq.com",
                    "headImg": {
                        "attachmentAddress": "/demofile/head/2019/5/1558794732206.png",
                        "attachmentName": "",
                        "attachmentPath": "",
                        "createTime": null,
                        "id": 119,
                        "linkInfo": ""
                    },
                    "headImgId": null,
                    "id": 25,
                    "logintime": 1559529291545,
                    "newpassword": "",
                    "nickname": "刘世红",
                    "password": "",
                    "roles": [],
                    "sex": null,
                    "username": "liushihong"
                },
                "toUserId": 25
            },
            {
                "content": "12121214222222222222222222222222227777777777777777777777777777777777777777777777777777777777777777777",
                "id": 13,
                "readStatus": 0,
                "sendTime": 1559529314538,
                "sendUser": {
                    "birth": 650736000736,
                    "dept": null,
                    "deptId": 1,
                    "email": "",
                    "headImg": {
                        "attachmentAddress": "/demofile/head/2019/5/1558794820025.png",
                        "attachmentName": "",
                        "attachmentPath": "",
                        "createTime": null,
                        "id": 120,
                        "linkInfo": ""
                    },
                    "headImgId": 120,
                    "id": 9,
                    "logintime": 1559540934686,
                    "newpassword": "",
                    "nickname": "薛凌康",
                    "password": "",
                    "roles": [],
                    "sex": null,
                    "username": "admin"
                },
                "sendUserId": 9,
                "toUser": {
                    "birth": 650736000736,
                    "dept": null,
                    "deptId": 1,
                    "email": "xuelingkang@163.com",
                    "headImg": {
                        "attachmentAddress": "/demofile/head/2019/5/1558794820025.png",
                        "attachmentName": "",
                        "attachmentPath": "",
                        "createTime": null,
                        "id": 120,
                        "linkInfo": ""
                    },
                    "headImgId": null,
                    "id": 9,
                    "logintime": 1559540934686,
                    "newpassword": "",
                    "nickname": "薛凌康",
                    "password": "",
                    "roles": [],
                    "sex": null,
                    "username": "admin"
                },
                "toUserId": 9
            }
        ]
    };

    static propTypes = {
        visible: PropTypes.bool,
        self: PropTypes.object,
        target: PropTypes.object,
        dataUrl: PropTypes.string,
        onSend: PropTypes.func,
        onClose: PropTypes.func
    };

    createTitle = () => {
        const {target} = this.props;
        if (target) {
            const {nickname, headImg} = target;
            let headImgAddr = null;
            if (headImg) {
                headImgAddr = headImg.attachmentAddress;
            }
            return (
                <div className='chat-title'>
                    <Avatar src={headImgAddr} alt='头像'>
                        {nickname}
                    </Avatar>
                    <span className='target-name'>{nickname}</span>
                </div>
            );
        }
    };

    createFooter = () => {
        const {onSend, onClose} = this.props;
        return (
            <div className='chat-footer'>
                <div className='editor'>
                    <Input.TextArea />
                </div>
                <div>
                    <Button onClick={onClose}>关闭</Button>
                    <Button type='primary' onClick={onSend}>发送</Button>
                </div>
            </div>
        );
    };

    bodyStyle = {
        height: document.body.clientHeight/2-200,
        overflow: 'auto'
    };

    render() {
        const {visible, self} = this.props;
        const modalProps = {
            visible,
            bodyStyle: this.bodyStyle,
            centered: true,
            maskClosable: false,
            closable: false,
            destroyOnClose: true,
            width: 600,
            title: this.createTitle(),
            footer: this.createFooter(),
        };
        return (
            <Modal {...modalProps}>
                <List
                    dataSource={this.state.data.reverse()}
                    renderItem={item => {
                        if (item.sendUserId===self.id) {
                            return (
                                <List.Item key={item.id} className='self-message'>
                                    <Content time={item.sendTime} content={item.content} />
                                    <HeadImg user={item.sendUser}/>
                                </List.Item>
                            );
                        } else {
                            return (
                                <List.Item key={item.id}  className='target-message'>
                                    <HeadImg user={item.sendUser}/>
                                    <Content time={item.sendTime} content={item.content} />
                                </List.Item>
                            );
                        }
                    }}
                >
                </List>
            </Modal>
        );
    }

}

const Content = props => {
    const {time, content} = props;
    return (
        <div className="ant-list-item-meta-content">
            <h4 className="ant-list-item-meta-title">
                <span>{moment(time).format('YYYY-MM-DD HH:mm:ss')}</span>
            </h4>
            <div className="ant-list-item-meta-description">{content}</div>
        </div>
    );
}

const HeadImg = props => {
    const {user} = props;
    return (
        <Avatar src={user.headImg? user.headImg.attachmentAddress: null}>
            {user.nickname}
        </Avatar>
    );
}

export default ModalChat;
