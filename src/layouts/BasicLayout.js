import React from 'react';
import {connect} from 'dva';
import {Button, Layout} from 'antd';
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
import broadcastColumns from './columns/broadcast';
import Socket from '@/utils/socket';
import {axiosGet, axiosPost} from '@/utils/axios';
import unique from '@/utils/unique';
import compare from '@/utils/compare';

const {Content, Header} = Layout;
const {notice, websocket} = config;
const {endpoint, broadcast_topic, chat_topic} = websocket;

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
            chatData: [],
            chatDataNoMore: false,
            chatDataLoading: false,
            broadcast: null,
            broadcastModalVisible: false,
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
            dispatch({
                type: 'global/findUnreadBroadcasts'
            });
            dispatch({
                type: 'global/findUnreadChats'
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
        // 连接websocket
        const {token, user} = getAuth();
        if (!token || !user) {
            return;
        }
        const {dispatch} = this.props;
        const socket = new Socket({
            url: `${endpoint}?token=${token}`,
            interval: 5000,
            callback: ({client}) => {
                client.subscribe(broadcast_topic, ({body}) => {
                    const data = JSON.parse(body);
                    dispatch({
                        type: 'global/addBroadcasts',
                        payload: {
                            data: [data]
                        }
                    });
                });
                client.subscribe(chat_topic, ({body}) => {
                    const data = JSON.parse(body);
                    if (data.sendUserId!==user.id) {
                        dispatch({
                            type: 'global/addChats',
                            payload: {
                                data: [data]
                            }
                        });
                    }
                    const {sendUserId, toUserId} = data;
                    const {chatTarget, chatData} = this.state;
                    if ((chatTarget && chatTarget.id===sendUserId && user.id===toUserId) ||
                        (chatTarget && chatTarget.id===toUserId && user.id===sendUserId)) {
                        this.setState({
                            chatData: chatData.concat(data)
                        });
                    }
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
        // 监听离开页面事件
        window.addEventListener('beforeunload', this.beforeunload);
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
        // 取消监听离开页面事件
        window.removeEventListener('beforeunload', this.beforeunload);
    }

    getCurrentMenu(props) {
        const {
            location: {pathname},
            global
        } = props || this.props;
        return this.getMeunMatchKeys(global.flatMenu, pathname)[0];
    }

    beforeunload = () => {
        // 关闭websocket
        Socket.disconnect();
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

    openChat = async (target) => {
        const {global} = this.props;
        const {userinfo, chats} = global;
        let selfId = null;
        if (userinfo) {
            selfId = userinfo.id;
        }
        const {id: targetId} = target;
        if (targetId===selfId) {
            return;
        }
        let messages = [];
        let chat = chats.find(({sendUserId}) => sendUserId===targetId);
        if (chat) {
            messages = chat.messages;
        }
        this.setState({
            chatVisible: true,
            chatTarget: target
        });
        const params = {chatTargetId: targetId};
        if (messages && messages.length) {
            params.size = messages.length>10? messages.length: 10;
        }
        await this.getHistoryChatData(params);
    }

    sendChat = async (params, success) => {
        const {code} = await axiosPost('/chat', params);
        if (code===200) {
            success && success();
        }
    }

    closeChat = () => {
        this.setState({
            chatVisible: false,
            chatTarget: null,
            chatData: [],
            chatDataNoMore: false
        });
    }

    openBroadcast = broadcast => {
        this.setState({
            broadcastModalVisible: true,
            broadcast
        });
    }

    closeBroadcastModal = () => {
        this.setState({
            broadcastModalVisible: false,
            broadcast: null
        });
    }

    updateBroadcastReadStatus = records => {
        const {dispatch} = this.props;
        const unReads = records.filter(({readStatus}) => !readStatus);
        if (unReads && unReads.length) {
            const ids = unReads.map(({id}) => id).join();
            dispatch({
                type: 'global/updateBroadcastReadStatus',
                payload: {
                    ids,
                    success: () => this.updateBroadcastReadStatusSuccess(records)
                }
            });
        } else {
            this.updateBroadcastReadStatusSuccess(records);
        }
    }

    updateBroadcastReadStatusSuccess = records => {
        this.closeBroadcastModal();
        const {dispatch} = this.props;
        dispatch({
            type: 'global/delBroadcasts',
            payload: {
                ids: records.map(({id}) => id)
            }
        });
        if (this.props.history.location.pathname==='/broadcastSelf') {
            dispatch({
                type: 'broadcastself/search'
            });
        }
    }

    updateChatReadStatus = records => {
        const {dispatch} = this.props;
        const unReads = records.filter(({readStatus}) => !readStatus);
        if (unReads && unReads.length) {
            const ids = unReads.map(({id}) => id).join();
            dispatch({
                type: 'global/updateChatReadStatus',
                payload: {
                    ids,
                    success: () => this.updateChatReadStatusSuccess(records)
                }
            });
        } else {
            this.updateChatReadStatusSuccess(records);
        }
    }

    updateChatReadStatusSuccess = records => {
        const {dispatch} = this.props;
        dispatch({
            type: 'global/delChats',
            payload: {
                ids: records.map(({id}) => id)
            }
        });
        const {chatData} = this.state;
        const newChatData = chatData.map(data => {
            const {id: id_} = data;
            if (records.some(({id}) => id===id_)) {
                return {
                    ...data,
                    readStatus: 1
                }
            }
            return data;
        });
        this.setState({
            chatData: newChatData
        });
    }

    /**
     * 查询历史聊天消息
     * @param {number|string} chatTargetId 目标用户id
     * @param {number|string} [startId] 起始消息id
     * @param {number|string} [size=10] 查询条数
     * @param {function} success 成功回调
     */
    getHistoryChatData = async ({chatTargetId, startId, size=10, success}) => {
        let url = '/chat/{userId}/{current}/{size}';
        let params = {size, current: 1, userId: chatTargetId};
        if (startId) {
            url = '/chat/{userId}/{startId}/{current}/{size}';
            params = {...params, startId};
        }
        this.setState({
            chatDataLoading: true
        });
        const {code, data} = await axiosGet(url, params);
        if (code===200) {
            const {records} = data;
            if (records && records.length) {
                const {chatVisible, chatTarget, chatData} = this.state;
                const newData = unique(chatData.concat(records), 'id').sort(compare('sendTime', 'asc'));
                if (chatVisible && chatTarget && chatTarget.id===chatTargetId) {
                    this.setState({
                        chatData: newData
                    });
                }
            } else {
                if (!records || !records.length) {
                    this.setState({
                        chatDataNoMore: true
                    });
                }
            }
            this.setState({
                chatDataLoading: false
            });
            success && success();
        }
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
            chatData,
            chatDataNoMore,
            chatDataLoading,
            broadcast,
            broadcastModalVisible
        } = this.state;
        const {routerData, location, global} = this.props;
        const {userinfo={}, structure=[], broadcasts, chats} = global;
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
            onClose: this.closeChat,
            getHistoryChatData: this.getHistoryChatData,
            updateChatReadStatus: this.updateChatReadStatus,
            loading: chatDataLoading,
            chatData,
            chatDataNoMore,
        };

        let broadcast_ = {
            ...broadcast,
        };
        if (broadcast) {
            broadcast_.sendUserNickname = broadcast.sendUser.nickname
        }
        const modalBroadcastProps = {
            title: '查看广播',
            modalType: 'broadcast',
            record: broadcast_,
            visible: broadcastModalVisible,
            columns: broadcastColumns(),
            modalOpts: {
                width: 700,
                footer: [
                    <Button key="back" onClick={this.closeBroadcastModal}>
                        关闭
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => this.updateBroadcastReadStatus([broadcast_])}>
                        已读
                    </Button>
                ]
            },
            handlers: {
                onCancel: {
                    default: this.closeBroadcastModal
                }
            }
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
                        broadcasts={broadcasts}
                        chats={chats}
                        openBroadcast={this.openBroadcast}
                        openChat={this.openChat}
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
                <ModalForm {...modalBroadcastProps} />
            </Layout>
        );
    }
}
