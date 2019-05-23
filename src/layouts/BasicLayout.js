import React from 'react';
import {connect} from 'dva';
import {Layout} from 'antd';
import {Switch, routerRedux} from 'dva/router';
import NavBar from 'components/NavBar';
import {LeftSideBar, RightSideBar} from 'components/SideBar';
import TopBar from 'components/TopBar';
import SkinToolbox from 'components/SkinToolbox';
import pathToRegexp from 'path-to-regexp';
import {enquireIsMobile} from '@/utils/enquireScreen';
import TabsLayout from './TabsLayout';
import './styles/basic.less';
import $$ from 'cmn-utils';
import cx from 'classnames';
import {getAuth} from '@/utils/authentication';
import {ModalForm} from "components/Modal";
import config from '@/config';
import userinfoColumns from './columns/userinfo';

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
        const theme = $$.getStore('theme', {
            leftSide: 'darkgrey', // 左边
            navbar: 'light' // 顶部
        });
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
            expandTopBar: false, // 头部多功能区开合
            showSidebarHeader: false, // 左边栏头部开关
            collapsedRightSide: true, // 右边栏开关
            theme, // 皮肤设置
            currentMenu: {},
            isMobile: false,
            modalVisible: false,
            modalType: '',
            modalTitle: ''
        };

        props.dispatch({
            type: 'global/getMenu'
        });
        props.dispatch({
            type: 'global/getUserinfo'
        });
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
        const menu = this.getMeunMatchKeys(global.flatMenu, pathname)[0];
        return menu;
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
     * 展开面包屑所在条中的多功能区
     */
    onExpandTopBar = _ => {
        this.setState({
            expandTopBar: true
        });
    };

    /**
     * 与上面相反
     */
    onCollapseTopBar = _ => {
        this.setState({
            expandTopBar: false
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
        $$.setStore('theme', theme);
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
            expandTopBar,
            showSidebarHeader,
            collapsedRightSide,
            theme,
            currentMenu,
            isMobile,
            modalVisible,
            modalTitle,
            modalType
        } = this.state;
        const {routerData, location, global} = this.props;
        const {userinfo={}} = global;
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
            record: userinfo,
            columns: userinfoColumns,
            modalOpts: {
                width: 700
            },
            handlers: this.modalHandlers
        };

        return (
            <Layout className={classnames}>
                <Header>
                    <NavBar
                        collapsed={collapsedLeftSide}
                        onCollapseLeftSide={this.onCollapseLeftSide}
                        onExpandTopBar={this.onExpandTopBar}
                        toggleSidebarHeader={this.toggleSidebarHeader}
                        theme={theme.navbar}
                        user={userinfo}
                        isMobile={isMobile}
                        showModal={this.showModal}
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
                                        expand={expandTopBar}
                                        toggleRightSide={this.toggleRightSide}
                                        collapsedRightSide={collapsedRightSide}
                                        onCollapse={this.onCollapseTopBar}
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
                        onCollapse={this.toggleRightSide}
                    />
                </Layout>
                <SkinToolbox onChangeTheme={this.onChangeTheme} theme={theme}/>
                <ModalForm {...modalFormProps} />
            </Layout>
        );
    }
}
