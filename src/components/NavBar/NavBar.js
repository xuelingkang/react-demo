import React, {PureComponent} from 'react';
import Icon from '../Icon';
import {Popover, Avatar, Badge} from 'antd';
import {Link} from 'dva/router';
import cx from 'classnames';
import './style/index.less';
import logoImg from 'assets/images/logo.png';
import SearchBox from './SearchBox';

/**
 * 其本本局头部区域
 */
class NavBar extends PureComponent {
    state = {
        openSearchBox: false,
        userDropDownVisible: false,
        gitDropDownVisible: false,
        noticeDropDownVisible: false,
    };

    static defaultProps = {
        fixed: true,
        theme: '' //'bg-dark',
    };

    toggleFullScreen() {
        if (
            !document.fullscreenElement &&
            !document.mozFullScreenElement &&
            !document.webkitFullscreenElement &&
            !document.msFullscreenElement
        ) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(
                    Element.ALLOW_KEYBOARD_INPUT
                );
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }

    onCloseSearchBox = () => {
        this.setState({
            openSearchBox: false
        });
    };

    onOpenSearchBox = () => {
        this.setState({
            openSearchBox: true
        });
    };

    hideUserDropDown = () => {
        this.setState({
            userDropDownVisible: false
        });
    }

    handleuserDropDownVisibleChange = visible => {
        this.setState({
            userDropDownVisible: visible
        });
    }

    hideGitDropDown = () => {
        this.setState({
            gitDropDownVisible: false
        });
    }

    handleGitDropDownVisibleChange = visible => {
        this.setState({
            gitDropDownVisible: visible
        });
    }

    hideNoticeDropDown = () => {
        this.setState({
            noticeDropDownVisible: false
        });
    }

    handleNoticeDropDownVisibleChange = visible => {
        this.setState({
            noticeDropDownVisible: visible
        });
    }

    render() {
        const {openSearchBox} = this.state;
        const {
            fixed,
            theme,
            onCollapseLeftSide,
            collapsed,
            isMobile,
            onCollapse,
            user = {},
            broadcasts,
            chats,
            openBroadcast,
            openChat
        } = this.props;

        let nickname, headImg;
        if (user) {
            nickname = user.nickname;
            headImg = user.headImg;
        }
        let attachmentAddress;
        if (headImg) {
            attachmentAddress = headImg.attachmentAddress;
        }

        const classnames = cx('navbar', {
            'navbar-fixed-top': !!fixed,
            'navbar-sm': isMobile ? true : collapsed,
            ['bg-' + theme]: !!theme
        });

        let noticeCount = 0;
        if (broadcasts && broadcasts.length) {
            noticeCount += broadcasts.length;
        }
        if (chats && chats.length) {
            chats.forEach(({messages=[]}) => noticeCount += messages.length);
        }

        return (
            <header className={classnames}>
                <div className="navbar-branding">
                    <Link className="navbar-brand" to="/">
                        <img src={logoImg} alt="logo"/>
                        <b>REACT</b>
                        中后台
                    </Link>
                    <span className="toggle_sidemenu_l" onClick={onCollapseLeftSide}>
            <Icon type="lines"/>
          </span>
                </div>
                <ul className="nav navbar-nav navbar-left clearfix">
                    {/*{isMobile ? (*/}
                    {/*    <li className="mini-search" onClick={this.onOpenSearchBox}>*/}
                    {/*        <a>*/}
                    {/*            <Icon type="search" antd/>*/}
                    {/*        </a>*/}
                    {/*    </li>*/}
                    {/*) : (*/}
                    {/*    <li onClick={this.toggleFullScreen}>*/}
                    {/*        <a className="request-fullscreen">*/}
                    {/*            <Icon type="screen-full"/>*/}
                    {/*        </a>*/}
                    {/*    </li>*/}
                    {/*)}*/}
                    {isMobile ? null: (
                        <li onClick={this.toggleFullScreen}>
                            <a className="request-fullscreen">
                                <Icon type="screen-full"/>
                            </a>
                        </li>
                    )}
                </ul>
                {/*{isMobile ? null : (*/}
                {/*    <form className="navbar-form navbar-search clearfix">*/}
                {/*        <div className="form-group">*/}
                {/*            <input*/}
                {/*                type="text"*/}
                {/*                className="form-control"*/}
                {/*                placeholder="全文检索"*/}
                {/*                onClick={this.onOpenSearchBox}*/}
                {/*            />*/}
                {/*        </div>*/}
                {/*    </form>*/}
                {/*)}*/}
                <ul className="nav navbar-nav navbar-right clearfix">
                    <li className="dropdown">
                        <Popover
                            placement="bottomRight"
                            title={'项目源码'}
                            overlayClassName={cx('navbar-popup', {[theme]: !!theme})}
                            visible={this.state.gitDropDownVisible}
                            onVisibleChange={this.handleGitDropDownVisibleChange}
                            content={<GitDropDown onClick={this.hideGitDropDown} />}
                            trigger="click"
                        >
                            <a className="dropdown-toggle">
                                <Icon type="github" antd/>
                            </a>
                        </Popover>
                    </li>
                    <li className="dropdown">
                        <Popover
                            placement="bottomRight"
                            title={'通知'}
                            overlayClassName={cx('navbar-popup', {[theme]: !!theme})}
                            visible={this.state.noticeDropDownVisible}
                            onVisibleChange={this.handleNoticeDropDownVisibleChange}
                            content={<NoticeDropDown chats={chats} broadcasts={broadcasts} openChat={openChat} openBroadcast={openBroadcast} onClick={this.hideNoticeDropDown} />}
                            trigger="click"
                        >
                            <a className="dropdown-toggle">
                                <Badge count={noticeCount} title={`${noticeCount}条未读消息`} offset={[2,0]}>
                                    <Icon type="ring" style={{fontSize: 18, lineHeight: 1}}/>
                                </Badge>
                            </a>
                        </Popover>
                    </li>
                    <li>
                        <a onClick={onCollapse}>
                            <Icon type="users" />
                        </a>
                    </li>
                    <li className="dropdown">
                        <Popover
                            placement="bottomRight"
                            title={`WELCOME ${nickname}`}
                            overlayClassName={cx('navbar-popup', {[theme]: !!theme})}
                            visible={this.state.userDropDownVisible}
                            onVisibleChange={this.handleuserDropDownVisibleChange}
                            content={<UserDropDown onClick={this.hideUserDropDown} showModal={this.props.showModal}/>}
                            trigger="click"
                        >
                            <a className="dropdown-toggle">
                                <Avatar src={attachmentAddress} alt='头像'>
                                    {nickname}
                                </Avatar>
                            </a>
                        </Popover>
                    </li>
                </ul>
                <SearchBox visible={openSearchBox} onClose={this.onCloseSearchBox}/>
            </header>
        );
    }
}

const GitDropDown = ({onClick}) => (
    <ul className="dropdown-menu list-group dropdown-persist" onClick={onClick}>
        <li className="list-group-item">
            <a className="animated animated-short fadeInUp" href='https://gitee.com/xuelingkang/react-demo' target='_blank'>
                前端项目
            </a>
        </li>
        <li className="list-group-item">
            <a className="animated animated-short fadeInUp" href='https://gitee.com/xuelingkang/spring-boot-demo' target='_blank'>
                后端项目
            </a>
        </li>
    </ul>
);

const UserDropDown = ({onClick, showModal}) => (
    <ul className="dropdown-menu list-group dropdown-persist" onClick={onClick}>
        <li className="list-group-item" onClick={() => showModal('userinfo', '帐户设置')}>
            <a className="animated animated-short fadeInUp">
                <Icon type="gear"/> 帐户设置
            </a>
        </li>
        <li className="list-group-item" onClick={() => showModal('modpwd', '修改密码')}>
            <a className="animated animated-short fadeInUp">
                <Icon type="password" font="iconfont"/> 修改密码
            </a>
        </li>
        <li className="list-group-item dropdown-footer">
            <Link to="/sign/login">
                <Icon type="poweroff"/> 退出
            </Link>
        </li>
    </ul>
);

const NoticeDropDown = ({chats=[], broadcasts=[], openChat, openBroadcast, onClick}) => (
    <ul className="dropdown-menu list-group dropdown-persist" onClick={onClick}>
        {broadcasts.map(broadcast => (
            <li key={broadcast.id} className="list-group-item" onClick={() => openBroadcast(broadcast)}>
                <a className="animated animated-short fadeInUp">
                    <NoticePreview user={broadcast.sendUser} content={`广播：${broadcast.content}`} />
                </a>
            </li>
        ))}
        {chats.map(({sendUserId, sendUser, messages}) => (
            (messages && messages.length)?
                <li key={sendUserId} className="list-group-item" onClick={() => openChat(sendUser)}>
                    <a className="animated animated-short fadeInUp">
                        <NoticePreview user={sendUser} content={`${messages.length}条未读：${messages[0].content}`} />
                    </a>
                </li>: null
        ))}
    </ul>
)

const NoticePreview = ({user, content}) => (
    <span className='notice-preview'>
        <Avatar src={user.headImg? user.headImg.attachmentAddress: null}>
            {user.nickname}
        </Avatar>&nbsp;&nbsp;{content}
    </span>
);

export default NavBar;
