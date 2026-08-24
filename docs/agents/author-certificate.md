# 作者证书页维护说明

证书详情路由为 `/author/:uid/certificate/:id`。页面通过记录 `id` 获取证书数据，校验记录归属后，根据 `team_certificate.rank_id` 选择模板并在 Canvas 中生成最终图片。

App 通过 WebView 打开时在 URL 增加 `?__env=app`。UC 的 `AppLayout` 会隐藏公共头，证书页会移除头部占位并使用系统安全区；不带该参数时保持普通网页布局。

## 新增证书模板

1. 在 `src/assets/data/author/certificate.json` 中增加以 `rank_id` 为键的模板。
2. 配置模板的 `key`。默认背景地址为 `design/certification/CertBG_jdt{key}.png`。
3. 如果排名使用图片，在 `src/assets/img/author/cert/{key}/rank/` 放置排名素材；二维码默认读取 `src/assets/img/author/cert/{rank_id}/qr.png`。
4. 只有默认规则不适用时，才在模板根节点增加素材覆盖配置：

```json
{
    "key": 24,
    "canvas": { "width": 1280, "pixelRatio": 2 },
    "assets": {
        "background": "完整背景图片地址",
        "rank": 21,
        "qr": "完整二维码图片地址"
    }
}
```

`canvas.height` 可省略，渲染器会根据背景比例计算高度。`canvas.pixelRatio` 默认为 `2`，模板坐标无需乘倍数；只有需要降低内存占用时才建议覆盖为 `1`。

## 元素和数据绑定

支持的元素类型：

- `text`：普通文字，支持 `style.fontName` 自定义字体。
- `members`：成员列表，按 `style.width` 自动换行。
- `rank`：排名；配置 `style.fontName` 时绘制文字，否则组合排名图片。
- `qr`：二维码；可通过 `style.left/top/width/height` 调整位置。

新模板建议使用 `binding` 显式绑定接口字段：

```json
{
    "type": "text",
    "binding": { "source": "team_name" },
    "style": {
        "left": 640,
        "top": 500,
        "fontSize": 36,
        "textAlign": "center",
        "color": "#ffffff"
    }
}
```

`binding` 也可直接写字段名，例如 `"binding": "team_name"`。当前支持以下格式化器：

- `topRanking`、`dungeonRanking`
- `clearTime`、`duration`、`issueDate`
- `leader`、`dungeonName`
- `template`：替换元素 `content` 中的 `{{字段名}}`

现有模板没有 `binding` 时仍按元素名兼容绑定：`name`、`rank`、`team`、`server`、`mapTime`、`time`、`colonel`、`signTime`、`mapName`、`qrSubTitle`、`topTitle`、`qrTitle`、`subRank`。

## 渲染约束

- 所有背景、排名图、二维码和字体加载完成后才会导出一次，任一素材失败都会显示可重试的错误状态。
- 模板数据会先深拷贝，渲染时不会污染全局配置。
- 页面切换证书、作者或语言时，旧请求的结果会被丢弃，避免串图。
- 接口返回 `user_id`、`uid` 或 `user.id` 时，必须与路由中的 `uid` 一致。
