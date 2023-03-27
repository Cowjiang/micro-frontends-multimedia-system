import axios from "axios";
import {ElLoading, ElMessage} from "element-plus";
import _ from 'lodash';
import router from "@/router";
import {useRoute} from "vue-router";
import qs from "qs";

//创建axios的一个实例
let instance = axios.create({
    baseURL: import.meta.env.VITE_APP_URL, //接口统一域名
    // timeout: 6000, //设置超时
    // withCredentials: true,
    // xsrfCookieName: "XSRF-TOKEN",
    // xsrfHeaderName: "X-XSRF-TOKEN",
    // headers: {
    //     'Content-Type': 'application/json;charset=UTF-8;',
    // }
})

// instance.defaults.withCredentials = true

let loading
//正在请求的数量
let requestCount = 0

//显示loading
const showLoading = (target) => {
    if (requestCount === 0 && !loading) {
        console.log("loading");
        loading = ElLoading.service({
            lock: true,
            text: "Loading...",
            background: 'rgba(255, 255, 255, 0.5)',
            target: target || 'body'
        })
    }

    requestCount++;
}

// 防抖
let toHideLoading = _.debounce(() => {
    if (loading !== undefined && loading !== null) {
        loading.close();
        loading = null;
    }
}, 300);

//隐藏loading
const hideLoading = () => {
    requestCount--
    requestCount = Math.max(requestCount, 0); //做个保护
    if (requestCount === 0) {
        toHideLoading()
    }
}


// 前置拦截器（发起请求之前的拦截）
instance.interceptors.request.use(
    (config) => {
        if (config.showLoading !== false) {
            showLoading(config.loadingTarget);
        }
        const {method} = config;
        const headers = config.headers ?? {};
        const accessToken = sessionStorage.getItem('ACCESS_TOKEN') ?? '';
        if (accessToken) {
            headers['etoken'] = accessToken;
        }
        if (method === 'get' || method === 'delete') {
            headers['Cache-Control'] = 'no-cache';
            headers['Content-type'] = 'application/x-www-form-urlencoded';
        }
        else if (method === 'post' || method === 'put') {
            headers['Content-type'] = 'application/json';
        }
        if (typeof headers['Content-type'] === 'string' && headers['Content-type'].includes('application/x-www-form-urlencoded')) {
            config.data = qs.stringify(config.data);
        }

        return {
            ...config,
            headers
        };
    },
    (error) => {
        return Promise.reject(error)
    }
)


//响应拦截器
instance.interceptors.response.use((response) => {
    hideLoading()

    //响应成功
    if (!response.data.success) {
        ElMessage({
            showClose: true,
            message: response.data.errorCode + ":" + response.data.errorMsg,
            type: 'error',
        })
    }
    return response.data;
}, (error) => {
    hideLoading()
    //响应错误
    if (error.response && error.response.status) {
        const status = error.response.status
        // 构建消息
        let message;
        if (error.response.data.errorMsg !== undefined) {
            message = error.response.data.errorMsg
        }
        else {
            message = getMessage(status)
        }
        // 如果为2001 则重定向到登录页
        const code = error.response.data.errorCode
        switch (code) {
            case 2001:
            case 3002:
                router.push("/login").then(r => {
                    console.log(r);
                })
                break
            default:
                break
        }
        // 展示消息
        ElMessage({
            showClose: true,
            message,
            type: 'error',
        })

        return Promise.reject(error);
    }
    return Promise.reject(error);
});


const getMessage = (status) => {
    let message
    switch (status) {
        case 400:
            message = '请求错误';
            break;
        case 401:
            message = '登录过期，请重新登录';
            break;
        case 404:
            message = '请求地址出错';
            break;
        case 408:
            message = '请求超时';
            break;
        case 500:
            message = '服务器内部错误!';
            break;
        case 501:
            message = '服务未实现!';
            break;
        case 502:
            message = '网关错误!';
            break;
        case 503:
            message = '服务不可用!';
            break;
        case 504:
            message = '网关超时!';
            break;
        case 505:
            message = 'HTTP版本不受支持';
            break;
        default:
            message = '请求失败'
    }
    return message
}

const dealWithStatus = (status) => {
    switch (status) {
        case 401:
            router.push("/login").then(err => {
                console.log("跳转失败")
                console.log(err)
            })
    }

}

export default instance;
