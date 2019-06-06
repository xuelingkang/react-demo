import React, {Component} from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import {Modal, Button, Avatar, Input, List} from 'antd';
import moment from 'moment';
import './style/chat.less';

class ModalChat extends Component {

    state = {
        scrollBottom: true,
        scrollHeight: null
    };

    static propTypes = {
        visible: PropTypes.bool,
        self: PropTypes.object,
        target: PropTypes.object,
        onSend: PropTypes.func,
        onClose: PropTypes.func,
        updateChatReadStatus: PropTypes.func,
        getHistoryChatData: PropTypes.func,
        chatData: PropTypes.array,
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
            } else {
                const {scrollHeight: oldScrollHeight} = this.state;
                if (oldScrollHeight) {
                    const chatBodyDom = document.querySelector('.chat-modal .ant-modal-body');
                    if (chatBodyDom) {
                        const scrollHeight = chatBodyDom.scrollHeight;
                        chatBodyDom.scrollTop = scrollHeight - oldScrollHeight;
                    }
                }
            }
        }
    }

    handleScroll = () => {
        const chatBodyDom = document.querySelector('.chat-modal .ant-modal-body');
        if (chatBodyDom) {
            const scrollTop = chatBodyDom.scrollTop;
            const scrollHeight = chatBodyDom.scrollHeight;
            const clientHeight = chatBodyDom.clientHeight;
            if (scrollTop===0) {
                const {getHistoryChatData, target, chatData, chatDataNoMore} = this.props;
                const {id: chatTargetId} = target;
                let startId;
                if (chatData && chatData.length) {
                    startId = chatData[0].id;
                }
                !chatDataNoMore && getHistoryChatData && getHistoryChatData({chatTargetId, startId});
                this.setState({
                    scrollHeight
                });
            }
            let scrollBottom = false;
            if (scrollTop+clientHeight===scrollHeight) {
                scrollBottom = true;
                this.handleReadStatus();
            }
            const {scrollBottom: scrollBottom_} = this.state;
            if (scrollBottom!==scrollBottom_) {
                this.setState({
                    scrollBottom
                });
            }
        }
    }

    handleReadStatus = () => {
        const {chatData, updateChatReadStatus} = this.props;
        if (chatData && chatData.length) {
            updateChatReadStatus && updateChatReadStatus(chatData);
        }
    }

    handleClose = () => {
        this.setState({
            scrollBottom: true
        });
        const {onClose} = this.props;
        onClose && onClose();
    }

    toBottom = () => {
        const chatBodyDom = document.querySelector('.chat-modal .ant-modal-body');
        if (chatBodyDom) {
            const scrollHeight = chatBodyDom.scrollHeight;
            const clientHeight = chatBodyDom.clientHeight;
            chatBodyDom.scrollTop = scrollHeight - clientHeight;
        }
    }

    render() {
        // TODO 加上loading
        const {visible, self, target, onSend, chatData, chatDataNoMore} = this.props;
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
            footer: <Footer onSend={onSend} onClose={this.handleClose} />,
            wrapProps: {
                onScroll: this.handleScroll
            }
        };
        return (
            <Modal {...modalProps}>
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
    const {onSend, onClose} = props;
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
        <p style={{textAlign: 'center'}}>没有了。。。</p>
    );
}

export default ModalChat;
