import React from 'react';

import PageLoading from 'components/Loading/PageLoading';
import {normal} from 'components/Notification';

// 系统通知, 定义使用什么风格的通知，normal或antdNotice
const notice = normal;

/**
 * 应用配置 如请求格式，反回格式，异常处理方式，分页格式等
 */
export default {
    /**
     * HTML的title模板
     */
    htmlTitle: 'REACT中后台 - {title}',

    /**
     * 系统通知
     */
    notice,

    // 路由加载效果
    router: {
        loading: <PageLoading loading/>
    },

};
