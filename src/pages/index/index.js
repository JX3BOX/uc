// 根路径入口仅用于本地开发/直达访问 `/` 时的兜底跳转
// 业务页面实际都挂在 /dashboard /publish /author /vip /login 等路径下

/* eslint-disable no-restricted-globals */
const target = "/dashboard/";
if (location.pathname !== target) {
    location.replace(target);
}

