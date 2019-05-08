import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

ReactDOM.render((
  <div>index</div>
), document.getElementById('root'));

// 如果想可以离线使用，请使用register()代替unregister()。可能会带来一些问题，如缓存等
// 相关资料，可以从 https://bit.ly/CRA-PWA 了解
serviceWorker.unregister();
