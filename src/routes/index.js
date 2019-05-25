import {createRoutes} from '@/utils/core';
import BasicLayout from '@/layouts/BasicLayout';
import UserLayout from '@/layouts/UserLayout';
import Page403 from './Pages/403';
import NotFound from './Pages/404';
import Page500 from './Pages/500';
import ScreenLock from './Widgets/ScreenLock';
import Coming from './Widgets/Coming';
import Gallery from './Widgets/Gallery';
import Result from './Widgets/Result';
import LevelRoute from './Widgets/LevelRoute';

// 登录
import Login from './Sign/Login';
// 注册
import Register from './Sign/Register';
// 找回密码
import RetrievePassword from './Sign/RetrievePassword';

// 部门管理
import Dept from './Crud/Dept';
// 用户管理
import User from './Crud/User';
// 角色管理
import Role from './Crud/Role';
// 权限（资源）管理
import Resource from './Crud/Resource';
// 附件管理
import Attachment from './Crud/Attachment';
// 邮件管理
import Mail from './Crud/Mail';

import Dashboard from './Dashboard';
import Blank from './Blank';
import Toolbar from './Widgets/Toolbar';
import BaseComponent from './Widgets/BaseComponent';
import Column from './Widgets/Column';
import TransferTree from './Widgets/TransferTree';
import SearchBar from './Widgets/SearchBar';
import DataTable from './Widgets/DataTable';
import Form from './Widgets/Form';
import EC from './Widgets/Charts/EC';
import G2 from './Widgets/Charts/G2';
import Print from './Widgets/Print';
import Banner from './Widgets/Banner';
import Icon from './UI/Icon';
import Mask from './UI/Mask';
import Editor from './UI/Editor';
import CSSAnimate from './UI/CSSAnimate';
import Alerts from './UI/Alerts';
import Button from './UI/Button';

/**
 * 主路由配置
 *
 * path 路由地址
 * component 组件
 * indexRoute 默认显示路由
 * childRoutes 所有子路由
 * NotFound 路由要放到最下面，当所有路由当没匹配到时会进入这个页面
 */
const routesConfig = app => [
    {
        path: '/sign',
        title: '登录',
        indexRoute: '/sign/login',
        component: UserLayout,
        childRoutes: [
            Login(app),
            Register(app),
            RetrievePassword(app),
            NotFound()
        ]
    },
    {
        path: '/',
        title: '系统中心',
        component: BasicLayout,
        indexRoute: '/dashboard',
        childRoutes: [
            Dashboard(app),

            Dept(app),
            User(app),
            Role(app),
            Resource(app),
            Attachment(app),
            Mail(app),

            Blank(app),
            Toolbar(app),
            Column(),
            SearchBar(),
            EC(app),
            G2(app),
            Icon(),
            Mask(),
            Editor(),
            CSSAnimate(),
            Alerts(),
            Button(),
            DataTable(app),
            Form(app),
            TransferTree(app),
            BaseComponent(),
            Coming(),
            ScreenLock(),
            Gallery(),
            Result(),
            Page403(),
            Page500(),
            Print(),
            Banner(app),
            LevelRoute(app),
            NotFound()
        ]
    }
];

export default app => createRoutes(app, routesConfig);
