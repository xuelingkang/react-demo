import axios from 'axios';
import qs from 'qs';

import cache from '@/utils/cache';
import { TOKEN } from '@/utils/cache-keys';
import { normal } from '../components/Notification';

const FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded; charset=utf-8';
// 系统通知, 定义使用什么风格的通知，normal或antdNotice
const notice = normal;

let instance = axios.create({
    timeout: 20000,
    baseURL: '/',
    headers: {
        'Content-Type': FORM_CONTENT_TYPE,
    }
});

// 请求拦截处理
instance.interceptors.request.use((config) => {
    // 请求头增加token
    config.headers['token'] = cache.get(TOKEN);
    // form表单格式提交。
    const contentType = config.headers['Content-Type'];
    if (contentType.indexOf(FORM_CONTENT_TYPE)!==-1 || FORM_CONTENT_TYPE.indexOf(contentType)!==-1) {
        // 对表单格式的数据进行处理。
        config.data = qs.stringify(config.data);
    }
    return config;
}, error => Promise.reject(error));

// 全局异常处理
instance.interceptors.response.use(response => {
    if (response.data.code !== 200) {
        notice.error(response.data.message);
    }
    return response.data;
}, error => {
    const code = error.response.data.code || error.response.status;
    const message = error.response.data.message || error.response.statusText;
    notice.error('错误码：'+code+'，错误信息：'+message);
    return Promise.reject(error);
});

async function axiosGet(url, payload, config) {
    return instance.get(url, {
        payload,
        ...config,
    });
}

async function axiosDelete(url, payload, config) {
    return instance.delete(url, {
        payload,
        ...config,
    });
}

async function axiosHead(url, payload, config) {
    return instance.head(url, {
        payload,
        ...config,
    });
}

async function axiosPost(url, payload, config) {
    return instance.post(url, payload, config);
}

async function axiosPut(url, payload, config) {
    return instance.put(url, payload, config);
}

async function axiosPatch(url, payload, config) {
    return instance.patch(url, payload, config);
}

export { axiosGet, axiosDelete, axiosHead, axiosPost, axiosPut, axiosPatch };
