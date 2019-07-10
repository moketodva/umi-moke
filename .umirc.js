
// ref: https://umijs.org/config/
export default {
    treeShaking: true,
    // 插件
    plugins: [
        // ref: https://umijs.org/plugin/umi-plugin-react.html
        ['umi-plugin-react', {
            // 使用内置antd依赖，并开启antd的按需编译
            antd: true,
            dva: true,
            dynamicImport: { webpackChunkName: true },
            title: 'moke',
            dll: true,
            locale: {
                enable: true,
                default: 'en-US',
            },
            chunks: ['vendors', 'umi'],
            // 忽略一些路由
            routes: {
                exclude: [
                    /models\//,
                    /services\//,
                    /model\.(t|j)sx?$/,
                    /service\.(t|j)sx?$/,
                    /components\//,
                ],
            }
        }]
    ],
    theme: {
        'primary-color': '#00BFFF',
    },
    // proxy: {
    //     '/api': {
    //         target: # 地址,
    //         changeOrigin: true,
    //         pathRewrite: { '^/api' : ''}
    //     }
    // },
    routes: [
        {
            path: '/',
            component: 'index.js',
            routes:[
                { path:'/', redirect: '/auth'},
                {
                    path: '/auth',
                    exact: true,
                    component: 'auth',
                },
                {
                    path: '/auth/tos',
                    exact: true,
                    component: 'auth/tos',
                }
            ]
        },
    ],
    chainWebpack: function (config, { webpack }) {
        config.merge({
            optimization: {
                minimize: true,
                splitChunks: {
                    chunks: 'all',
                    minSize: 30000,
                    minChunks: 1,
                    maxAsyncRequests: 5,
                    maxInitialRequests: 3,
                    automaticNameDelimiter: '.',
                    cacheGroups: {
                        vendors: {
                            name: 'vendors',
                            test({ resource }) {
                                return /[\\/]node_modules[\\/]/.test(resource);
                            },
                            priority: 3,
                        },
                        default: {
                            minChunks: 2,
                            priority: -20,
                            reuseExistingChunk: true
                        },
                    },
                },
            }
        });
    },
};
