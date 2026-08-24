const certificateAssets = require.context("@/assets/img/author/cert", true, /\.(png|jpe?g|webp)$/i);

const DEFAULT_BINDINGS = {
    topTitle: { formatter: "topRanking" },
    qrTitle: { formatter: "dungeonRanking" },
    mapTime: { source: "time", formatter: "clearTime" },
    name: { source: "team_name" },
    rank: { source: "sort_no" },
    team: { source: "teammate", renderer: "members" },
    subRank: { source: "sort_no", formatter: "template" },
    colonel: { source: "leader", formatter: "leader" },
    signTime: { source: "awardtime", formatter: "issueDate" },
    time: { source: "duration", formatter: "duration" },
    server: { source: "team_server" },
    qrSubTitle: { source: "rank_name" },
    mapName: { source: "rank_name", formatter: "dungeonName" },
};

const fontPromises = new Map();

function clone(value) {
    return value ? JSON.parse(JSON.stringify(value)) : null;
}

function getValue(source, path) {
    if (!path) return undefined;
    return path.split(".").reduce((value, key) => (value == null ? undefined : value[key]), source);
}

function interpolate(content, source) {
    return String(content ?? "").replace(/{{\s*([\w.]+)\s*}}/g, (match, path) => {
        const value = getValue(source, path);
        return value == null ? "" : value;
    });
}

function safeDateFormat(value, locale, options) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat(locale, options).format(date);
}

function formatDuration(value, translate) {
    const total = Math.max(0, Number(value) || 0);
    return translate("author.certificate.clearDuration", {
        hours: Math.floor(total / 3600),
        minutes: Math.floor((total % 3600) / 60),
        seconds: total % 60,
    });
}

function normalizeBinding(binding, fallback) {
    if (typeof binding === "string") return { source: binding };
    return { ...(fallback || {}), ...(binding || {}) };
}

function formatBinding({ binding, value, item, certificate, template, translate, locale, rootUrl }) {
    switch (binding.formatter) {
        case "topRanking":
            return translate("author.certificate.topRanking", { edition: certificate.rank_id });
        case "dungeonRanking":
            return translate("author.certificate.dungeonRanking");
        case "clearTime":
            return translate("author.certificate.clearTime", {
                time: safeDateFormat(value, locale, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                }),
            });
        case "leader":
            return translate("author.certificate.leader", { name: value || "" });
        case "dungeonName":
            return translate("author.certificate.dungeonName", { name: value || "" });
        case "issueDate": {
            const issueDate = translate("author.certificate.issueDate", {
                date: safeDateFormat(value, locale, { year: "numeric", month: "2-digit", day: "2-digit" }),
            });
            return item.addUrl ? `${rootUrl}${item.addUrl}  ${issueDate}` : issueDate;
        }
        case "duration":
            return formatDuration(value, translate);
        case "template":
            return interpolate(item.content, { ...certificate, value, rank: value });
        default:
            return value == null ? interpolate(item.content, certificate) : value;
    }
}

/**
 * 将接口数据绑定到证书模板。旧模板按元素 key 自动绑定，新模板可用 binding 显式配置。
 */
export function prepareCertificateTemplate({ template: sourceTemplate, certificate, translate, locale, rootUrl = "" }) {
    const template = clone(sourceTemplate);
    if (!template?.element) return null;

    Object.entries(template.element).forEach(([key, item]) => {
        const binding = normalizeBinding(item.binding, DEFAULT_BINDINGS[key]);
        const hasBinding = Boolean(item.binding || DEFAULT_BINDINGS[key]);
        if (!hasBinding) {
            item.content = interpolate(item.content, certificate);
            return;
        }

        const value = binding.source ? getValue(certificate, binding.source) : undefined;
        item.content = formatBinding({
            binding,
            value,
            item,
            certificate,
            template,
            translate,
            locale,
            rootUrl,
        });
        if (binding.renderer) item.renderer = binding.renderer;
        if (item.renderer === "members" && item.excludeLeader == null) {
            item.excludeLeader = Boolean(template.element.colonel);
        }
    });

    return template;
}

export function getCertificateOwnerId(record) {
    return record?.user_id ?? record?.uid ?? record?.user?.id ?? null;
}

function localAsset(path) {
    try {
        return certificateAssets(path);
    } catch (error) {
        throw new Error(`证书素材不存在：${path}`);
    }
}

/**
 * 模板可通过 assets.background / assets.rank / assets.qr 覆盖默认素材规则。
 */
export function createCertificateAssetResolver({ cdn, template, certificate }) {
    return (type, name) => {
        const assets = template.assets || {};
        if (type === "background") {
            if (assets.background) return assets.background;
            const key = template.key;
            const code = Number(key) < 10 ? `0${key}` : key;
            return `${cdn}design/certification/CertBG_jdt${code}.png`;
        }
        if (type === "rank") {
            const rankSet = assets.rank ?? template.key ?? certificate.rank_id;
            return localAsset(`./${rankSet}/rank/${name}.png`);
        }
        if (type === "qr") {
            if (assets.qr) return assets.qr;
            const qrSet = template.qrKey ?? certificate.rank_id;
            return localAsset(`./${qrSet}/qr.png`);
        }
        throw new Error(`不支持的证书素材类型：${type}`);
    };
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`证书图片加载失败：${url}`));
        image.src = url;
    });
}

async function loadFont(fontName, fontUrls) {
    if (!fontName) return "Arial";
    const url = fontUrls[fontName];
    if (!url) throw new Error(`证书字体未配置：${fontName}`);
    if (!fontPromises.has(fontName)) {
        fontPromises.set(
            fontName,
            new FontFace(fontName, `url(${url})`).load().then((font) => {
                document.fonts.add(font);
                return font;
            })
        );
    }
    await fontPromises.get(fontName);
    return fontName;
}

function applyTextStyle(ctx, style, fontFamily) {
    ctx.font = `${style.fontSize}px ${fontFamily || "Arial"}`;
    ctx.textAlign = style.textAlign || "left";
    ctx.fillStyle = style.color || "#000000";
}

function memberNames(value) {
    if (Array.isArray(value)) {
        return value.map((item) => (typeof item === "string" ? item : item?.name)).filter(Boolean);
    }
    return String(value || "")
        .split(";")
        .map((item) => item.split(",")[0].trim())
        .filter(Boolean);
}

function drawMembers(ctx, value, style, leader, excludeLeader) {
    const names = memberNames(value).filter((name) => !excludeLeader || name !== leader);
    const separator = style.separator ?? "，";
    const maxWidth = Number(style.width) || Infinity;
    const lineHeight = Number(style.height) || Number(style.fontSize) || 24;
    let line = "";
    let top = Number(style.top) || 0;

    names.forEach((name) => {
        const next = `${line}${name}${separator}`;
        if (line && ctx.measureText(next).width > maxWidth) {
            ctx.fillText(line, style.left, top);
            line = `${name}${separator}`;
            top += lineHeight;
        } else {
            line = next;
        }
    });
    if (line) ctx.fillText(line, style.left, top);
}

async function drawText(ctx, key, item, certificate, fontUrls) {
    const family = await loadFont(item.style.fontName, fontUrls);
    applyTextStyle(ctx, item.style, family);
    if (item.renderer === "members" || item.type === "members" || key === "team") {
        drawMembers(ctx, item.content, item.style, certificate.leader, Boolean(item.excludeLeader));
    } else {
        ctx.fillText(String(item.content ?? ""), item.style.left, item.style.top);
    }
}

async function drawFontRank(ctx, item, translate, fontUrls) {
    const rank = Number(item.content);
    const style = rank <= 3 ? item.style.topThreeStyle : item.style.otherStyle;
    if (!style) throw new Error("证书排名文字样式缺失");
    const family = await loadFont(item.style.fontName, fontUrls);
    let content = style.content;
    if (rank === 1) content = translate("author.certificate.firstPlace");
    else if (rank === 2) content = translate("author.certificate.secondPlace");
    else if (rank === 3) content = translate("author.certificate.thirdPlace");
    else if (!content) content = translate("author.certificate.place", { rank: item.content });

    applyTextStyle(ctx, style, family);
    ctx.fillText(String(content), style.left, style.top);
    if (style.subFontStyle) {
        applyTextStyle(ctx, style.subFontStyle, family);
        ctx.fillText(
            `${style.subFontStyle.content || ""}${item.content ?? ""}`,
            style.subFontStyle.left,
            style.subFontStyle.top
        );
    }
}

function drawSizedImage(ctx, image, left, top, width) {
    const height = width / (image.width / image.height);
    ctx.drawImage(image, left, top, width, height);
}

async function drawImageRank(ctx, item, resolveAsset) {
    const style = item.style;
    const rank = item.content == null ? null : Number(item.content);
    let singleAsset = "";
    let mode = 1;
    let digits = [];

    if (rank === 1) singleAsset = "first";
    else if (rank === 2) singleAsset = "second";
    else if (rank === 3) singleAsset = "third";
    else if (rank === 100) {
        mode = 3;
        digits = [1, 100];
    } else if (rank == null || Number.isNaN(rank)) singleAsset = "hundred";
    else if (rank <= 10) {
        mode = 2;
        singleAsset = rank;
    } else {
        mode = 3;
        digits = String(rank)
            .split("")
            .map((digit) => (digit === "0" ? 10 : Number(digit)));
    }

    if (mode === 1) {
        const image = await loadImage(resolveAsset("rank", singleAsset));
        const left = style.type === "center" ? style.left - style.topWidth / 2 : style.left;
        drawSizedImage(ctx, image, left, style.top, style.topWidth);
        return;
    }

    const assetNames = mode === 2 ? ["before", singleAsset, "after"] : ["before", ...digits, "after"];
    const images = await Promise.all(assetNames.map((name) => loadImage(resolveAsset("rank", name))));
    const width = style.otherWidth;
    const space = style.spaceWidth || 0;
    const count = images.length;
    const totalWidth = count * width + (count - 1) * space;
    const startLeft = style.type === "center" ? style.left - totalWidth / 2 : style.left;
    images.forEach((image, index) => {
        drawSizedImage(ctx, image, startLeft + index * (width + space), style.top, width);
    });
}

async function drawQr(ctx, item, resolveAsset) {
    const image = await loadImage(resolveAsset("qr"));
    const style = item.style || {};
    ctx.drawImage(image, style.left ?? 150, style.top ?? 1490, style.width ?? 100, style.height ?? 100);
}

/** 所有字体和图片绘制完成后只导出一次，避免生成半成品证书。 */
export async function renderCertificate({ canvas, template, certificate, resolveAsset, translate, fontUrls = {} }) {
    if (!canvas) throw new Error("证书画布不存在");
    const ctx = canvas.getContext("2d");
    const background = await loadImage(resolveAsset("background"));
    const logicalWidth = Math.floor(template.canvas?.width || 1280);
    const logicalHeight = Math.floor(template.canvas?.height || logicalWidth / (background.width / background.height));
    const configuredPixelRatio = Number(template.canvas?.pixelRatio || 2);
    const pixelRatio = Math.min(3, Math.max(1, configuredPixelRatio));

    // 模板继续使用原有逻辑坐标，实际画布按像素密度放大。
    // 证书缩放到页面宽度时，文字和线条因此拥有足够的采样像素，不会因位图缩放而明显发虚。
    canvas.width = Math.floor(logicalWidth * pixelRatio);
    canvas.height = Math.floor(logicalHeight * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.drawImage(background, 0, 0, logicalWidth, logicalHeight);

    for (const [key, item] of Object.entries(template.element || {})) {
        if (!item?.style || item.hidden) continue;
        if (item.type === "rank") {
            if (item.style.fontName) await drawFontRank(ctx, item, translate, fontUrls);
            else await drawImageRank(ctx, item, resolveAsset);
        } else if (item.type === "qr") {
            await drawQr(ctx, item, resolveAsset);
        } else if (item.type === "text" || item.type === "members") {
            await drawText(ctx, key, item, certificate, fontUrls);
        }
    }

    return canvas.toDataURL("image/png");
}
