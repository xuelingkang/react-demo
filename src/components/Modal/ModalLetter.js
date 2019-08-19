import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Modal, Button} from 'antd';
import Editor from 'components/Markdown';
import Icon from 'components/Icon';
import moment from 'moment';
import config from '@/config';
import './style/letter.less';

const {notice} = config;

class ModalLetter extends Component {

    state = {
        expanded: false,
        replyContent: ''
    };

    static propTypes = {
        currentUser: PropTypes.object,
        title: PropTypes.string,
        loading: PropTypes.bool,
        visible: PropTypes.bool,
        letterReplyMore: PropTypes.bool,
        record: PropTypes.object,
        replys: PropTypes.array,
        width: PropTypes.any,
        onSave: PropTypes.func,
        onDelele: PropTypes.func,
        onSearch: PropTypes.func,
        onCancel: PropTypes.func
    };

    static defaultProps = {
        width: 700,
        record: {}
    };

    handleChange = replyContent => {
        this.setState({
            replyContent
        });
    }

    handleSave = () => {
        const {replyContent} = this.state;
        if (!replyContent) {
            notice.warn('回复内容不能为空！');
            return;
        }
        const {onSave} = this.props;
        onSave(replyContent);
        this.setState({
            replyContent: ''
        });
    }

    handleDelete = id => {
        const {onDelele} = this.props;
        Modal.confirm({
            title: '注意',
            content: '您是否要删除这条回复？',
            onOk: () => {
                onDelele(id);
            },
            onCancel() {
            }
        });
    }

    expand = () => {
        this.setState({
            expanded: true
        });
    }

    reset = () => {
        this.setState({
            expanded: false
        });
    }

    render() {
        const {expanded, replyContent} = this.state;
        const {title, loading, visible, letterReplyMore, record, replys, width, onSearch, onCancel, currentUser} = this.props;
        const {letterUser={}, letterTime, letterContent} = record;
        const {nickname} = letterUser;
        const bodyStyle = {
            height: expanded? document.body.offsetHeight-55: '',
            maxHeight: expanded? document.body.offsetHeight-55: 600,
            overflow: 'auto'
        };
        const modalProps = {
            visible,
            loading,
            onCancel,
            bodyStyle,
            width: expanded? '100%': width,
            title: <Title value={title} expanded={expanded} onExpand={this.expand} onReset={this.reset} onClose={onCancel} />,
            centered: true,
            maskClosable: true,
            destroyOnClose: true,
            footer: null,
            closable: false
        };
        const editorProps = {
            value: replyContent,
            height: 200,
            placeholder: '发表回复',
            onChange: this.handleChange,
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
        };
        const letterProps = {
            preview: true,
            height: 'auto',
            toolbar: {
                expand: true
            }
        };
        return (
            <Modal {...modalProps}>
                <Editor {...editorProps} />
                <Footer onClick={this.handleSave} />
                <div className='letter-preview'>
                    <Head name={nickname} time={letterTime} />
                    <Editor {...letterProps} value={letterContent} />
                </div>
                {replys.map(({id, replyContent, replyTime, replyUser: {id: userId, nickname}}) => (
                    <div key={id} className='letter-preview'>
                        <Head name={nickname} time={replyTime} remove={userId===currentUser.id} onRemove={() => this.handleDelete(id)} />
                        <Editor {...letterProps} value={replyContent} />
                    </div>
                ))}
                <More hasMore={letterReplyMore} onClick={() => onSearch(true)} />
            </Modal>
        );
    }

}

const Title = props => (
    <div className='letter-title'>
        <span className='title-span'>{props.value}</span>
        <span className='btns'>
            {
                props.expanded &&
                <Icon type='fullscreen-exit' antd className='letter-title-btn' onClick={props.onReset} /> ||
                <Icon type='fullscreen' antd className='letter-title-btn' onClick={props.onExpand} />
            }
            <Icon type='close' antd className='letter-title-btn' onClick={props.onClose} />
        </span>
    </div>
);

const Head = props => (
    <div className='letter-head'>
        {
            props.name &&
            <span className='head-name'>{props.name}</span>
        }
        {
            props.time &&
            <span className='head-time'>{moment(props.time).format('YYYY-MM-DD HH:mm')}</span>
        }
        <span className='right'>
            {
                props.remove &&
                <Icon type="trash" className='letter-remove' onClick={props.onRemove} />
            }
        </span>
    </div>
);

const Footer = props => (
    <div className='letter-footer'>
        <Button type='primary' className='reply' onClick={props.onClick}>发表回复</Button>
        <p className='clearfix' />
    </div>
);

const More = props => (
    <div className='search-more'>
        {props.hasMore? <a onClick={props.onClick}>更多回复。。。</a>: <span>没有更多了。。。</span>}
    </div>
);

export default ModalLetter;
