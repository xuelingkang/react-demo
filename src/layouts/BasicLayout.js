import React from 'react';
import {connect} from 'dva';
import {Layout} from 'antd';
import {routerRedux, Switch} from 'dva/router';
import NavBar from 'components/NavBar';
import {LeftSideBar, RightSideBar} from 'components/SideBar';
import TopBar from 'components/TopBar';
import SkinToolbox from 'components/SkinToolbox';
import pathToRegexp from 'path-to-regexp';
import {enquireIsMobile} from '@/utils/enquireScreen';
import TabsLayout from './TabsLayout';
import './styles/basic.less';
import cache from "@/utils/cache";
import {THEME} from "@/utils/cache-keys";
import cx from 'classnames';
import {getAuth} from '@/utils/authentication';
import {ModalForm, ModalChat} from "components/Modal";
import config from '@/config';
import userinfoColumns from './columns/userinfo';
import Socket from '@/utils/socket';

const {Content, Header} = Layout;

const notice = config.notice;

/**
 * 基本部局
 * 可设置多种皮肤 theme: [light, grey, primary, info, warning, danger, alert, system, success, dark]
 * 可设置多种布局 [header(固定头), sidebar(固定边栏), breadcrumb(固定面包蟹), tabLayout(标签布局)]
 * @author weiq
 */
@connect(({global}) => ({global}))
export default class BasicLayout extends React.PureComponent {
    constructor(props) {
        super(props);
        const theme = {leftSide: 'light', navbar: 'light', ...cache.get(THEME)};
        if (!theme.layout) {
            theme.layout = [
                'fixedHeader',
                'fixedSidebar',
                'fixedBreadcrumbs'
                // 'hidedBreadcrumbs',
                // 'tabLayout',
            ];
        }
        this.state = {
            collapsedLeftSide: false, // 左边栏开关控制
            leftCollapsedWidth: 60, // 左边栏宽度
            showSidebarHeader: false, // 左边栏头部开关
            collapsedRightSide: true, // 右边栏开关
            theme, // 皮肤设置
            currentMenu: {},
            isMobile: false,
            modalVisible: false,
            modalType: '',
            modalTitle: '',
            modalLoading: false,
            chatVisible: false,
            chatTarget: null,
        };

        const {dispatch} = props;
        dispatch({
            type: 'global/getMenu'
        });
        const {token, authorities} = getAuth();
        if (token && authorities) {

            dispatch({
                type: 'global/getUserinfo'
            });
            dispatch({
                type: 'global/getStructure'
            });
        }
    }

    componentDidMount() {
        this.unregisterEnquire = enquireIsMobile(ismobile => {
            const {isMobile} = this.state;
            if (isMobile !== ismobile) {
                this.setState({
                    isMobile: ismobile
                });
            }
        });
        const {token} = getAuth();
        const {dispatch} = this.props;
        const socket = new Socket({
            url: '//server01/endpoint?token='+token,
            interval: 5000,
            callback: ({client}) => {
                client.subscribe('/user/topic/broadcast', ({body}) => {
                    const data = JSON.parse(body);
                    const {global} = this.props;
                    const {broadcasts} = global;
                    dispatch({
                        type: 'global/@change',
                        payload: {
                            broadcasts: [data].concat(broadcasts)
                        }
                    });
                });
                client.subscribe('/user/topic/chat', ({body}) => {
                    const data = JSON.parse(body);
                    const {global} = this.props;
                    let {chats} = global;
                    const {sendUserId} = data;
                    let chat = chats.find(({sendUserId: sendUserId_}) => sendUserId_===sendUserId);
                    if (chat) {
                        const {messages} = chat;
                        chat = {
                            sendUserId,
                            messages: [data].concat(messages)
                        };
                        chats = chats.map(item => {
                            const {sendUserId: sendUserId_} = item;
                            if (sendUserId_===sendUserId) {
                                return chat;
                            }
                            return item;
                        });
                    } else {
                        chat = {
                            sendUserId,
                            messages: [data]
                        };
                        chats = chats.concat(chat);
                    }
                    dispatch({
                        type: 'global/@change',
                        payload: {
                            chats
                        }
                    });
                });
            }
        });
        socket.connect();
    }

    componentWillMount() {
        // 检查有户是否登录
        const {token, authorities} = getAuth();
        if (!token || !authorities) {
            this.props.dispatch(routerRedux.replace('/sign/login'));
        }
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.location.pathname !== this.props.location.pathname ||
            nextProps.global.flatMenu !== this.props.global.flatMenu
        ) {
            this.setState({
                currentMenu: this.getCurrentMenu(nextProps) || {}
            });
        }
    }

    componentWillUnmount() {
        // 清理监听
        this.unregisterEnquire();
    }

    getCurrentMenu(props) {
        const {
            location: {pathname},
            global
        } = props || this.props;
        return this.getMeunMatchKeys(global.flatMenu, pathname)[0];
    }

    getMeunMatchKeys = (flatMenu, path) => {
        return flatMenu.filter(item => {
            return pathToRegexp(item.path).test(path);
        });
    };

    /**
     * 顶部左侧菜单图标收缩控制
     */
    onCollapseLeftSide = _ => {
        const collapsedLeftSide =
            this.state.leftCollapsedWidth === 0
                ? true
                : !this.state.collapsedLeftSide;
        const collapsedRightSide =
            this.state.collapsedRightSide || !collapsedLeftSide;

        this.setState({
            collapsedLeftSide,
            collapsedRightSide,
            leftCollapsedWidth: 60
        });
    };

    /**
     * 完全关闭左边栏，即宽为0
     */
    onCollapseLeftSideAll = _ => {
        this.setState({
            collapsedLeftSide: true,
            leftCollapsedWidth: 0
        });
    };

    /**
     * 切换左边栏中头部的开合
     */
    toggleSidebarHeader = _ => {
        this.setState({
            showSidebarHeader: !this.state.showSidebarHeader
        });
    };

    /**
     * 切换右边栏
     */
    toggleRightSide = _ => {
        const {collapsedLeftSide, collapsedRightSide} = this.state;
        this.setState({
            collapsedLeftSide: collapsedRightSide ? true : collapsedLeftSide,
            collapsedRightSide: !collapsedRightSide
        });
    };

    onChangeTheme = theme => {
      cache.set(THEME, theme, -1, window.localStorage);
        this.setState({
            theme
        });
    };

    showModal = (modalType, modalTitle) => {
        this.setState({
            modalVisible: true,
            modalType,
            modalTitle
        });
    }

    hideModal = () => {
        this.setState({
            modalVisible: false,
            modalType: '',
            modalTitle: ''
        });
    }

    openChat = (node) => {
        const {global} = this.props;
        const {userinfo} = global;
        let selfId = null;
        if (userinfo) {
            selfId = userinfo.id;
        }
        const {clickable, dataRef} = node.props;
        if (clickable) {
            const {id: targetId} = dataRef;
            if (targetId===selfId) {
                return;
            }
            this.setState({
                chatVisible: true,
                chatTarget: dataRef,
            });
        }
    }

    sendChat = () => {
        console.log('发送消息');
    }

    closeChat = () => {
        this.setState({
            chatVisible: false
        });
    }

    modalHandlers = {
        onSubmit: {
            modpwd: async values => {
                const {dispatch} = this.props;
                dispatch({
                    type: 'global/modpwd',
                    payload: {
                        values,
                        success: () => {
                            this.hideModal();
                            notice.success('修改密码成功');
                        }
                    }
                });
            },
            userinfo: async values => {
                const {dispatch} = this.props;
                dispatch({
                    type: 'global/updateUserinfo',
                    payload: {
                        values,
                        success: () => {
                            this.hideModal();
                            notice.success('修改个人信息成功');
                        }
                    }
                });
            }
        },
        onCancel: {
            default: this.hideModal
        }
    };

    render() {
        const {
            collapsedLeftSide,
            leftCollapsedWidth,
            showSidebarHeader,
            collapsedRightSide,
            theme,
            currentMenu,
            isMobile,
            modalVisible,
            modalTitle,
            modalType,
            modalLoading,
            chatVisible,
            chatTarget,
        } = this.state;
        const {routerData, location, global} = this.props;
        const {userinfo={}, structure=[]} = global;
        const {menu, flatMenu} = global;
        const {childRoutes} = routerData;
        const classnames = cx('basic-layout', 'full-layout', {
            fixed: theme.layout && theme.layout.indexOf('fixedSidebar') !== -1,
            'fixed-header':
                theme.layout && theme.layout.indexOf('fixedHeader') !== -1,
            'fixed-breadcrumbs':
                theme.layout && theme.layout.indexOf('fixedBreadcrumbs') !== -1,
            'hided-breadcrumbs':
                theme.layout && theme.layout.indexOf('hidedBreadcrumbs') !== -1
        });

        const modalFormProps = {
            visible: modalVisible,
            title: modalTitle,
            modalType: modalType,
            loading: modalLoading,
            record: userinfo,
            columns: userinfoColumns(this),
            modalOpts: {
                width: 700
            },
            handlers: this.modalHandlers
        };

        const modalChatProps = {
            visible: chatVisible,
            self: userinfo,
            target: chatTarget,
            onSend: this.sendChat,
            onClose: this.closeChat
        };

        return (
            <Layout className={classnames}>
                <Header>
                    <NavBar
                        collapsed={collapsedLeftSide}
                        onCollapseLeftSide={this.onCollapseLeftSide}
                        toggleSidebarHeader={this.toggleSidebarHeader}
                        theme={theme.navbar}
                        user={userinfo}
                        isMobile={isMobile}
                        showModal={this.showModal}
                        onCollapse={this.toggleRightSide}
                    />
                </Header>
                <Layout>
                    <LeftSideBar
                        collapsed={collapsedLeftSide}
                        leftCollapsedWidth={leftCollapsedWidth}
                        showHeader={showSidebarHeader}
                        onCollapse={this.onCollapseLeftSide}
                        onCollapseAll={this.onCollapseLeftSideAll}
                        location={location}
                        theme={theme.leftSide}
                        flatMenu={flatMenu}
                        currentMenu={currentMenu}
                        menu={menu}
                        user={userinfo}
                        isMobile={isMobile}
                    />
                    <Content>
                        {theme.layout.indexOf('tabLayout') >= 0 ? (
                            <TabsLayout childRoutes={childRoutes} location={location}/>
                        ) : (
                            <Layout className="full-layout">
                                <Header>
                                    <TopBar
                                        currentMenu={currentMenu}
                                        location={location}
                                        theme={theme}
                                    />
                                </Header>
                                <Content className="router-page">
                                    <Switch>{childRoutes}</Switch>
                                </Content>
                            </Layout>
                        )}
                    </Content>
                    <RightSideBar
                        collapsed={collapsedRightSide}
                        isMobile={isMobile}
                        theme={theme.leftSide}
                        onCollapse={this.toggleRightSide}
                        structure={structure}
                        openChat={this.openChat}
                    />
                </Layout>
                <SkinToolbox onChangeTheme={this.onChangeTheme} theme={theme}/>
                <ModalForm {...modalFormProps} />
                <ModalChat {...modalChatProps} />
            </Layout>
        );
    }
}
