import axios from 'axios';
import qs from 'qs';

import { getAuth } from '@/utils/authentication';
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
    config.headers['token'] = getAuth().token;
    // form表单格式提交
    if (config.headers['Content-Type']===FORM_CONTENT_TYPE) {
        // 对表单格式的数据进行处理
        config.data = qs.stringify(config.data);
    }
    return config;
}, error => Promise.reject(error));

// 全局异常处理
instance.interceptors.response.use(response => {
    if (response.data.code === 200) {
        notice.success(response.data.message);
    } else {
        notice.error(response.data.message);
    }
    return response.data;
}, error => {
    const code = error.response.data.code || error.response.status;
    const message = error.response.data.message || error.response.statusText;
    notice.error('错误码：'+code+'，错误信息：'+message);
    // return Promise.reject(error);
    return {code, message};
});

async function axiosGet(url, params, config) {
    return instance.get(url, {
        params,
        ...config,
    });
}

async function axiosDelete(url, params, config) {
    return instance.delete(url, {
        params,
        ...config,
    });
}

async function axiosHead(url, params, config) {
    return instance.head(url, {
        params,
        ...config,
    });
}

async function axiosPost(url, params, config) {
    return instance.post(url, params, config);
}

async function axiosPut(url, params, config) {
    return instance.put(url, params, config);
}

async function axiosPatch(url, params, config) {
    return instance.patch(url, params, config);
}

export { axiosGet, axiosDelete, axiosHead, axiosPost, axiosPut, axiosPatch };
