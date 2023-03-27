import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import path from 'path'


import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import viteSvgIcons from 'vite-plugin-svg-icons'
import {resolve} from 'path'
// https://vitejs.dev/config/
export default ({mode}) => {
    return defineConfig({
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "@/utils/common/element-variables.scss" as *;`,
                },
            },
        },
        // 插件
        plugins: [
            vue(),
            // element 按需引入解析器
            Components({
                resolvers: [ElementPlusResolver({
                    importStyle: "sass"
                })],
            }),
            // svg图标加载
            viteSvgIcons({
                iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
                // 指定symbolId格式
                symbolId: 'icon-[dir]-[name]',
            })],
        // 解析
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src') // 设置 `@` 指向 `src` 目录
            }
        },
        // 代理配置
        server: {
            proxy: {
                '/service': {
                    target: loadEnv(mode, process.cwd()).VITE_SERVER_HOST_URL,
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/service/, ''),
                }
            },
            port: 4000
        },
        build: {},
        base: "/admin/client/"


    })
}
