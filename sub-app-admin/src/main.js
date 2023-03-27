import {createApp} from 'vue'
import App from './App.vue'
//vue router
import router from "./router";

/**
 * 由于使用了自定义样式和按需导入 vite不自动导入这俩玩意 自己手动导入一下
 * 似乎服务调用方式都不会自动导入
 */
import "element-plus/theme-chalk/el-loading.css"
import "element-plus/theme-chalk/el-message.css"

// tailwind
import "./utils/common/tailwind.css"
// svg manager
import 'virtual:svg-icons-register';

if (window.__POWERED_BY_WUJIE__) {
    let app;
    window.__WUJIE_MOUNT = () => {
        app = createApp(App);
        app.use(router)
        app.mount('#app');
    };
    window.__WUJIE_UNMOUNT = () => {
        app.unmount();
    };
    window.__WUJIE.mount();
} else {
    const app = createApp(App);
    app.use(router)
    app.mount('#app');
}
