import React from 'react';
import dva from 'dva';
import dynamic from 'dva/dynamic';
import createLoading from 'dva-loading';
import { Router } from 'dva/router';
import createHistory from 'history/createHashHistory';
import request from 'cmn-utils/lib/request';
import createRoutes from '@/routes';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

import * as serviceWorker from './serviceWorker';

import '@/utils/extends';
import './assets/styles/index.less';
import config from './config';
import { homepage } from '../package.json';

// -> 初始化
const app = dva({
  history: createHistory({
    basename: homepage
  })
});

// -> 插件
app.use(createLoading());

// -> 请求
request.config(config.request);

// 使用mock数据
// require('./__mocks__');
// -> Developer mock data
if (process.env.NODE_ENV === 'development') {
  require('./__mocks__');
}

// -> loading
dynamic.setDefaultLoadingComponent(() => config.router.loading);

// -> 注册全局模型
app.model(require('./models/global').default);

// -> 初始化路由
app.router(({ history, app }) => (
  <LocaleProvider locale={zh_CN}>
    <Router history={history}>{createRoutes(app)}</Router>
  </LocaleProvider>
));

// -> Start
app.start('#root');

// export global
export default {
  app,
  store: app._store,
  dispatch: app._store.dispatch
};

// 如果想可以离线使用，请使用register()代替unregister()。可能会带来一些问题，如缓存等
// 相关资料，可以从 https://bit.ly/CRA-PWA 了解
serviceWorker.unregister();
