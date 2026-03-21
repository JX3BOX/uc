const pages = {
    // root 入口：避免直接访问 `/` 时命中 public/index.html（未经过 HtmlWebpackPlugin 渲染）
    // 从而出现 `<%= BASE_URL %>` 这类占位符导致的 400 Bad Request
    index: {
        title: "个人中心 - JX3BOX",
        entry: "src/pages/index/index.js",
        template: "public/index.html",
        filename: "index.html",
    },
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
    card: {
        title: "贺卡 - JX3BOX",
        entry: "src/pages/card/index.js",
        template: "public/app.html",
        filename: "card/index.html",
    },


    vip: {
        title: "会员中心 - JX3BOX",
        entry: "src/pages/vip/index.js",
        template: "public/index.html",
        filename: "vip/index.html",
    },

    // account
    login: {
        title: "登录 - JX3BOX",
        entry: "src/pages/account/login/login.js",
        template: "public/app.html",
        filename: "login/index.html",
    },
    register: {
        title: "注册 - JX3BOX",
        entry: "src/pages/account/register/register.js",
        template: "public/app.html",
        filename: "register/index.html",
    },
    email_verify: {
        title: "邮箱验证 - JX3BOX",
        entry: "src/pages/account/email_verify/email_verify.js",
        template: "public/app.html",
        filename: "email_verify/index.html",
    },
    password_reset: {
        title: "密码重设 - JX3BOX",
        entry: "src/pages/account/password_reset/password_reset.js",
        template: "public/app.html",
        filename: "password_reset/index.html",
    },
    login_callback: {
        title: "登录成功 - JX3BOX",
        entry: "src/pages/account/login_callback/login_callback.js",
        template: "public/app.html",
        filename: "login_callback/index.html",
    },
    login_callback_wesite: {
        title: "登录成功 - JX3BOX",
        entry: "src/pages/account/login_callback_wesite/login_callback.js",
        template: "public/app.html",
        filename: "login_callback_wesite/index.html",
    },
    register_callback: {
        title: "注册成功 - JX3BOX",
        entry: "src/pages/account/register_callback/register_callback.js",
        template: "public/app.html",
        filename: "register_callback/index.html",
    },
};

const path = require("path");
const events = require("events");
const webpack = require("webpack");
const commonDomains = require("@jx3box/jx3box-common/data/jx3box.json");

// devServer proxy 会给 Server 挂多个 upgrade listener；条目多时会触发 Node 的 MaxListeners 告警
// 这里只提高开发环境的默认上限，避免误报（不影响功能）
if (String(process.env.NODE_ENV).toLowerCase() === "development") {
    events.defaultMaxListeners = Math.max(events.defaultMaxListeners || 10, 50);
}

module.exports = {
    productionSourceMap: false,
    //❤️ define path for static files ~
    publicPath:
        process.env.BUILD_PREVIEW ? "/" + process.env.APP_NAME :
        process.env.NODE_ENV === "development" ? "/" :
        process.env.STATIC_PATH + "/" + process.env.APP_NAME,

    //🌈多页面配置，详见 https://cli.vuejs.org/zh/config/#pages
    pages: pages,

    //⚛️ Proxy ~
    devServer: {
        host: "localhost",
        // 与 @jx3box/jx3box-common/js/api.js 对齐：
        // 本地开发开启 `VUE_APP_PROXY_ENABLE=1` 后，会把请求 baseURL 切到 `${VUE_APP_PROXY_PREFIX}/${serviceKey}`
        proxy: buildEnvProxy(),
        allowedHosts: "all",
        port: process.env.DEV_PORT || 12028,
    },

    // 依赖包（element-plus/theme-chalk 等）会输出大量 Sass deprecation 警告
    // 这些不是运行错误，开启 quietDeps 让它们不刷屏（只保留项目自身的警告）
    css: {
        loaderOptions: {
            sass: {
                sassOptions: {
                    quietDeps: true,
                },
            },
            scss: {
                sassOptions: {
                    quietDeps: true,
                },
            },
        },
    },

    // 过滤依赖包里的已知兼容性 warning（不影响运行，但会刷屏）
    configureWebpack: {
        stats: {
            warningsFilter: [/node_modules[\\\\/]+@jx3box[\\\\/]+jx3box-common[\\\\/]+/],
        },
    },

    //❤️ Webpack configuration
    chainWebpack: (config) => {
        //💝 in-line small imgs ~
        config.module.rule("images").set("parser", {
            dataUrlCondition: {
                maxSize: 4 * 1024, // 4KiB
            },
        });

        // 💝 quick svg ~
        config.module
            .rule("svg")
            .exclude.add(path.join(__dirname, "src/assets/img/icon")) // 排除自定义svg目录
            .end();
        config.module
            .rule("icons") // 新规则
            .test(/\.svg$/)
            .include.add(path.join(__dirname, "src/assets/img/icon")) // 新规则应用于我们存放svg的目录
            .end()
            .use("svg-sprite-loader") // 用sprite-loader接卸
            .loader("svg-sprite-loader")
            .options({
                symbolId: "icon-[name]",
            })
            .end();

        //💝 in-line svg imgs ~
        config.module.rule("vue").use("vue-svg-inline-loader").loader("vue-svg-inline-loader");

        //💖 import common less var * mixin ~
        const types = ["vue-modules", "vue", "normal-modules", "normal"];
        types.forEach((type) => addStyleResource(config.module.rule("less").oneOf(type)));

        config.externals = {
            tinyMCE: "tinyMCE",
        };
    },

    configureWebpack: {
        plugins: [
            new webpack.DefinePlugin({
                // 全局注入，用于 JS 或其他代码中
                __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
            }),
        ],
    },
};

// 注入全局样式资源（变量、mixin 等）
// 本地css/var.less、mixin.less会覆盖node_modules里的同名文件，方便定制化
// 注意此类文件都是变量和mixin函数，不要写全局样式，否则可能会被重复注入多次
function addStyleResource(rule) {
    var preload_styles = [];
    preload_styles.push(
        path.resolve(__dirname, "./node_modules/@jx3box/jx3box-common/css/var.less"),
        path.resolve(__dirname, "./node_modules/@jx3box/jx3box-common/css/mixin.less"),
        path.resolve(__dirname, "./src/assets/css/var.less"),
        path.resolve(__dirname, "./src/assets/css/mixin.less"),
        path.resolve(__dirname, "./node_modules/csslab/base.less")
    );
    rule.use("style-resource").loader("style-resources-loader").options({
        patterns: preload_styles,
    });
}

function normalizeTarget(value) {
    if (!value) return "";
    const trimmed = String(value).trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed.replace(/^\/+/, "")}`;
}

function escapeRegExp(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildEnvProxy() {
    const nodeEnv = String(process.env.NODE_ENV || "").toLowerCase();
    if (nodeEnv && nodeEnv !== "development") return {};

    // Vue CLI 加载 .env 的时机/覆盖关系可能导致这里读不到或读到意外值：
    // - 明确设置为 false 才禁用
    // - 未设置/无法读取时，仍然生成代理（仅在 devServer 生效）
    const rawEnabled = String(process.env.VUE_APP_PROXY_ENABLE || "").toLowerCase();
    const disabled = ["0", "false", "no", "off"].includes(rawEnabled);
    if (disabled) return {};

    const prefix = process.env.VUE_APP_PROXY_PREFIX || "/__proxy";
    const mk = (serviceKey, target) => {
        const normalized = normalizeTarget(target);
        if (!normalized) return {};
        const context = `${prefix}/${serviceKey}`;
        const contextRe = new RegExp(`^${escapeRegExp(context)}`);
        return {
            [context]: {
                target: normalized,
                changeOrigin: true,
                secure: false,
                cookieDomainRewrite: "",
                pathRewrite: (p) => p.replace(contextRe, ""),
            },
        };
    };

    const serviceTargets = {
        cms: process.env.VUE_APP_CMS_API || commonDomains.__cms,
        next: process.env.VUE_APP_NEXT_API || commonDomains.__next,
        team: process.env.VUE_APP_TEAM_API || commonDomains.__team,
        pay: process.env.VUE_APP_PAY_API || commonDomains.__pay,
        lua: process.env.VUE_APP_LUA_API || commonDomains.__lua,
        node: process.env.VUE_APP_NODE_API || commonDomains.__node,
        helper: process.env.VUE_APP_HELPER_API || commonDomains.__helperUrl,
    };

    return Object.keys(serviceTargets).reduce((acc, key) => Object.assign(acc, mk(key, serviceTargets[key])), {});
}
