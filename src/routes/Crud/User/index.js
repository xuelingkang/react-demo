import {dynamicWrapper, createRoute} from '@/utils/core';

const routesConfig = (app) => ({
    path: '/user',
    title: '用户管理',
    component: dynamicWrapper(app, [import('./model')], () => import('./components'))
});

export default (app) => createRoute(app, routesConfig);
