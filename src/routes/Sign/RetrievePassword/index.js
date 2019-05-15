import { dynamicWrapper, createRoute } from '@/utils/core';

const routesConfig = (app) => ({
    path: '/sign/retrievePassword',
    title: '找回密码',
    component: dynamicWrapper(app, [import('./model')], () => import('./components'))
});

export default (app) => createRoute(app, routesConfig);
