import {createRoutes} from '@/utils/core';
import BasicLayout from '@/layouts/BasicLayout';
import UserLayout from '@/layouts/UserLayout';
import NotFound from './Pages/404';
import Dashboard from './Dashboard';
import Login from './Sign/Login';
import Register from './Sign/Register';
import RetrievePassword from './Sign/RetrievePassword';
import Dept from './Crud/Dept';
import User from './Crud/User';
import Role from './Crud/Role';
import Resource from './Crud/Resource';
import Attachment from './Crud/Attachment';
import Mail from './Crud/Mail';
import JobTemplate from './Crud/JobTemplate';
import Job from './Crud/Job';
import Broadcast from './Crud/Broadcast';
import BroadcastSelf from './Crud/BroadcastSelf';

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
            JobTemplate(app),
            Job(app),
            Broadcast(app),
            BroadcastSelf(app),
            NotFound()
        ]
    }
];

export default app => createRoutes(app, routesConfig);
