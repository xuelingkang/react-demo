import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import {Modal, Button, Avatar, Input, List} from 'antd';
import Icon from 'components/Icon';
import moment from 'moment';
import config from '@/config';
import './style/chat.less';

const {notice} = config;

class ModalChat extends PureComponent {

    state = {
        scrollBottom: true,
        content: ''
    };

    static propTypes = {
        visible: PropTypes.bool,
        self: PropTypes.object,
        target: PropTypes.object,
        chatData: PropTypes.array,
        onSend: PropTypes.func,
        onClose: PropTypes.func,
        updateChatReadStatus: PropTypes.func,
        getHistoryChatData: PropTypes.func,
    };

    bodyStyle = {
        height: 300,
        overflow: 'auto'
    };

    static getDerivedStateFromProps(props, state) {
        return state;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!isEqual(this.props, prevProps)) {
            const {scrollBottom} = prevState;
            if (scrollBottom) {
                this.toBottom();
                this.handleReadStatus();
            }
        }
    }

    handleScroll = () => {
        const chatBodyDom = this.chatBodyDom();
        if (chatBodyDom) {
            const scrollTop = chatBodyDom.scrollTop;
            const scrollHeight = chatBodyDom.scrollHeight;
            const clientHeight = chatBodyDom.clientHeight;
            if (scrollTop===0) {
                this.getHistoryData();
            }
            let scrollBottom = false;
            if (scrollTop+clientHeight===scrollHeight) {
                scrollBottom = true;
                this.handleReadStatus();
            }
            this.setState({
                scrollBottom
            });
        }
    }

    handleReadStatus = () => {
        const {chatData, updateChatReadStatus, target} = this.props;
        if (chatData && chatData.length && target) {
            const {id} = target;
            updateChatReadStatus && updateChatReadStatus(chatData.filter(data => data.sendUserId===id));
        }
    }

    handleSend = () => {
        const {content} = this.state;
        if (!content) {
            notice.error('不能发送空消息！');
            return;
        }
        const {target, onSend} = this.props;
        onSend && onSend({
            content,
            toUserId: target.id
        }, () => {
            this.setState({
                content: ''
            });
        });
    }

    handleClose = () => {
        this.setState({
            scrollBottom: true
        });
        const {onClose} = this.props;
        onClose && onClose();
    }

    handleChangeContent = content => {
        this.setState({
            content
        });
    }

    getHistoryData = () => {
        const chatBodyDom = this.chatBodyDom();
        if (chatBodyDom) {
            const scrollHeight = chatBodyDom.scrollHeight;
            const {getHistoryChatData, target, chatData, chatDataNoMore} = this.props;
            const {id: chatTargetId} = target;
            let startId;
            if (chatData && chatData.length) {
                startId = chatData[0].id;
            }
            !chatDataNoMore &&
            getHistoryChatData &&
            getHistoryChatData({
                chatTargetId,
                startId,
                success: () => {
                    const newChatBodyDom = this.chatBodyDom();
                    const newScrollHeight = newChatBodyDom.scrollHeight;
                    newChatBodyDom.scrollTop = newScrollHeight - scrollHeight;
                }
            });
        }
    }

    toBottom = () => {
        const chatBodyDom = this.chatBodyDom();
        if (chatBodyDom) {
            const scrollHeight = chatBodyDom.scrollHeight;
            const clientHeight = chatBodyDom.clientHeight;
            chatBodyDom.scrollTop = scrollHeight - clientHeight;
        }
    }

    chatBodyDom = () => document.querySelector('.chat-modal .ant-modal-body');

    render() {
        const {visible, self, target, chatData, chatDataNoMore, loading} = this.props;
        const {content} = this.state;
        const modalProps = {
            className: 'chat-modal',
            visible,
            bodyStyle: this.bodyStyle,
            centered: true,
            maskClosable: false,
            destroyOnClose: true,
            width: 600,
            onCancel: this.handleClose,
            title: <Title target={target} />,
            footer: <Footer onSend={this.handleSend}
                            onClose={this.handleClose}
                            onChange={this.handleChangeContent}
                            content={content} />,
            wrapProps: {
                onScroll: this.handleScroll
            }
        };
        return (
            <Modal {...modalProps}>
                {loading? <Loading />: null}
                {chatDataNoMore? <NoMore />: null}
                {chatData&&chatData.length?
                    <List
                        dataSource={chatData}
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
                    </List>: null
                }
            </Modal>
        );
    }

}

const Title = props => {
    const {target} = props;
    if (target) {
        const {nickname} = target;
        return (
            <div className='chat-title'>
                <HeadImg user={target} />
                <span className='target-name'>{nickname}</span>
            </div>
        );
    }
}

const Footer = props => {
    const {onSend, onClose, onChange, content} = props;
    return (
        <div className='chat-footer'>
            <div className='editor'>
                <Input.TextArea value={content}
                                onChange={e => onChange(e.target.value)}
                                onPressEnter={(e) => {
                                    e.preventDefault();
                                    onSend();
                                }} />
            </div>
            <div>
                <Button onClick={onClose}>关闭</Button>
                <Button type='primary' onClick={onSend}>发送</Button>
            </div>
        </div>
    );
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

const NoMore = props => {
    return (
        <p style={{textAlign: 'center', color: '#bbb'}}>无更多消息</p>
    );
}

const Loading = () => (
    <p style={{textAlign: 'center'}}><Icon type="loading" antd /></p>
);

export default ModalChat;
