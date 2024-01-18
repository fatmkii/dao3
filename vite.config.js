import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';


export default defineConfig(({ command, mode, ssrBuild }) => {

    //根据环境加载不同版本的vue
    if (mode == 'development') { var vue_alias = 'vue/dist/vue.esm-browser.js' }
    else { var vue_alias = 'vue/dist/vue.esm-browser.prod.js' }

    return {
        css: ['resources/css/app.scss'],
        plugins: [
            laravel({
                input: ['resources/js/app.js'],
                refresh: true,
            }),
            vue({
                template: {
                    transformAssetUrls: {
                        // Vue 插件会重新编写资产 URL，以便在单文件组件中引用时，指向 Laravel web 服务器。
                        // 将其设置为 `null`，则 Laravel 插件会将资产 URL 重新编写为指向 Vite 服务器。
                        base: null,

                        // Vue 插件将解析绝对 URL 并将其视为磁盘上文件的绝对路径。
                        // 将其设置为 `false`，将保留绝对 URL 不变，以便可以像预期那样引用公共目录中的资源。
                        includeAbsolute: false,
                    },
                },
            }),

        ],
        resolve: {
            alias: {
                '@': '/resources',
                'vue': vue_alias,
            },
        },
    }
}
);