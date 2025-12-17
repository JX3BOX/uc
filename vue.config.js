const path = require("path");
const pkg = require("./package.json");
const { JX3BOX, SEO } = require("@jx3box/jx3box-common");
const VueProxyPlugin = require("@jx3box/jx3box-fe-proxy");

module.exports = {
    // map
    productionSourceMap: false,
    //❤️ Multiple pages ~
    pages: {
        dashboard: {
            title: "个人中心 - JX3BOX",
            entry: "src/pages/dashboard/index.js",
            template: "public/index.html",
            filename: "dashboard/index.html",
        },
        publish: {
            title: "发布中心 - JX3BOX",
            entry: "src/pages/publish/index.js",
            template: "public/index.html",
            filename: "publish/index.html",
        },
        author: {
            title: "作者 - JX3BOX",
            entry: "src/pages/author/index.js",
            template: "public/index.html",
            filename: "author/index.html",
        },
        vip: {
            title: "会员中心 - JX3BOX",
            entry: "src/pages/vip/index.js",
            template: "public/index.html",
            filename: "vip/index.html",
        },

        // account
        login : {
            title : '登录 - JX3BOX',
            entry:'src/pages/account/login/login.js',
            template : 'public/app.html',
            filename:'login/index.html',
        },
        register : {
            title : '注册 - JX3BOX',
            entry:'src/pages/account/register/register.js',
            template : 'public/app.html',
            filename:'register/index.html',
        },
        email_verify : {
            title : '邮箱验证 - JX3BOX',
            entry:'src/pages/account/email_verify/email_verify.js',
            template : 'public/app.html',
            filename:'email_verify/index.html',
        },
        password_reset : {
            title : '密码重设 - JX3BOX',
            entry:'src/pages/account/password_reset/password_reset.js',
            template : 'public/app.html',
            filename:'password_reset/index.html',
        },
        login_callback : {
            title : '登录成功 - JX3BOX',
            entry:'src/pages/account/login_callback/login_callback.js',
            template : 'public/app.html',
            filename:'login_callback/index.html',
        },
        login_callback_wesite : {
            title : '登录成功 - JX3BOX',
            entry:'src/pages/account/login_callback_wesite/login_callback.js',
            template : 'public/app.html',
            filename:'login_callback_wesite/index.html',
        },
        register_callback : {
            title : '注册成功 - JX3BOX',
            entry:'src/pages/account/register_callback/register_callback.js',
            template : 'public/app.html',
            filename:'register_callback/index.html',
        },
        card: {
            title: "贺卡 - JX3BOX",
            entry: "src/pages/card/index.js",
            template: "public/app.html",
            filename: "card/index.html",
        }
    },
    //❤️ Proxy ~
    devServer: {
       disableHostCheck: true, // 允许访问本地 IP
       port: process.env["DEV_PORT"] || 12028, // 默认端口
       proxy: {
         ...VueProxyPlugin.generateBuiltinProxy(),
            // 专门为直接的 /api/next2/ 路径配置代理到 dev.next2.jx3box.com
            '/api/next2': {
                target: 'https://dev.next2.jx3box.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/api/next2': '/api/next2'
                },
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            '/api/summary-any': {
                target: 'https://dev.next2.jx3box.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/api/next2': '/api/next2'
                },
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            }
        }
    },

    outputDir: process.env["BUILD_MODE"] == "preview" ? path.resolve(__dirname, pkg.name) : "dist", // 指定构建输出的目录

    //❤️ define path for static files ~
    publicPath:
        //FOR Localhost => development
        (process.env.NODE_ENV === "development" && "/") ||
        //BY relative path
        (process.env.BUILD_MODE === "preview" && `/${pkg.name}/`) ||
        //BY origin
        (process.env.STATIC_PATH === "origin" && `${JX3BOX.__staticPath["origin"]}${pkg.name}/`) ||
        //BY github
        (process.env.STATIC_PATH === "github" && `${JX3BOX.__staticPath["github"]}${pkg.name}/`) ||
        //BY jsdelivr
        (process.env.STATIC_PATH === "jsdelivr" && `${JX3BOX.__staticPath["jsdelivr"]}${pkg.name}@gh-pages/`) ||
        //BY OSS=>CDN
        (process.env.STATIC_PATH === "mirror" && `${JX3BOX.__staticPath["mirror"]}${pkg.name}/`) ||
        //BY relative path
        (process.env.STATIC_PATH === "repo" && `/${pkg.name}/`) ||
        //BY root path or bind a domain
        (process.env.STATIC_PATH == "root" && "/") ||
        //for lost
        "/",

    configureWebpack: {
        module: {
            exprContextCritical: false,
        }
    },

    chainWebpack: (config) => {
        //💘 html-webpack-plugin ~
        // Multiple pages disable the block below
        // config.plugin("html").tap((args) => {
        //     args[0].meta = {
        //         //------设置SEO信息
        //         Keywords: Setting.keys,
        //         Description: Setting.desc,
        //     };
        //     args[0].title = Setting.title + SEO.title; //------自动添加标题后缀
        //     return args;
        // });

        //💝 in-line small imgs ~
        config.module
            .rule("images")
            .use("url-loader")
            .loader("url-loader")
            .tap((options) => Object.assign(options, { limit: 10240, esModule: false }));

        //💝 in-line svg imgs ~
        config.module.rule("vue").use("vue-svg-inline-loader").loader("vue-svg-inline-loader");

        // web worker
        config.module
            .rule("worker")
            .test(/\.worker\.js$/)
            .use("worker-loader")
            .loader("worker-loader")
            .options({
                inline: "no-fallback",
            });

        //💖 import common less var * mixin ~
        const types = ["vue-modules", "vue", "normal-modules", "normal"];
        var preload_styles = [];
        preload_styles.push(
            path.resolve(__dirname, "./node_modules/csslab/base.less"),
            path.resolve(__dirname, "./node_modules/@jx3box/jx3box-common/css/var.less"),
            path.resolve(__dirname, "./src/assets/css/var.less")
        );
        function addStyleResource(rule) {
            rule.use("style-resource").loader("style-resources-loader").options({
                patterns: preload_styles,
            });
        }
        types.forEach((type) => addStyleResource(config.module.rule("less").oneOf(type)));
    },
};
