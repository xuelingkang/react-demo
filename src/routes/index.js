import {createRoutes} from '@/utils/core';
import BasicLayout from '@/layouts/BasicLayout';
import UserLayout from '@/layouts/UserLayout';
import NotFound from './Pages/404';
import Dashboard from './Dashboard';

import Login from './Sign/Login'; // 登录
import Register from './Sign/Register'; // 注册
import RetrievePassword from './Sign/RetrievePassword'; // 找回密码
import Dept from './Crud/Dept'; // 部门管理
import User from './Crud/User'; // 用户管理
import Role from './Crud/Role'; // 角色管理
import Resource from './Crud/Resource'; // 权限（资源）管理
import Attachment from './Crud/Attachment'; // 附件管理
import Mail from './Crud/Mail'; // 邮件管理

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
            NotFound()
        ]
    }
];

export default app => createRoutes(app, routesConfig);
