function getSourceElement(event) {
    const source = event?.currentTarget || event?.target;
    if (!source || !source.getBoundingClientRect) return null;
    return source.tagName === "IMG" && source.parentElement ? source.parentElement : source;
}

function getProductImageElement(source) {
    const container = source?.closest?.(".good-item, .good-detail");
    return container?.querySelector?.(".good-item-img, .card img");
}

function getTargetPoint(boundCart = {}) {
    const cart = document.getElementById("cartBtn");
    if (cart) {
        const rect = cart.getBoundingClientRect();
        return {
            el: cart,
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        };
    }

    if (typeof boundCart.left === "number" && typeof boundCart.top === "number") {
        return {
            el: null,
            x: boundCart.left,
            y: boundCart.top,
        };
    }

    return null;
}

function pulseTarget(target) {
    target?.animate?.(
        [
            { transform: "scale(1)" },
            { transform: "scale(1.16)", offset: 0.45 },
            { transform: "scale(1)" },
        ],
        {
            duration: 360,
            easing: "cubic-bezier(.2,.8,.2,1)",
        }
    );
}

function createFlyElement(source, image) {
    if (!image) return source.cloneNode(true);

    const fly = document.createElement("div");
    const img = document.createElement("img");
    img.src = image;
    img.alt = "";
    fly.className = "u-mall-cart-fly";
    fly.appendChild(img);
    return fly;
}

export function playAddCartFly(event, boundCart, options = {}) {
    if (typeof document === "undefined") return;

    const source = getSourceElement(event);
    const target = getTargetPoint(boundCart);
    if (!source || !target) return;

    const productImage = getProductImageElement(source);
    const origin = productImage || source;
    const rect = origin.getBoundingClientRect();
    const visualWidth = Math.max(40, rect.width * 0.5);
    const visualHeight = Math.max(40, rect.height * 0.5);
    const startLeft = rect.left + rect.width / 2 - visualWidth / 2;
    const startTop = rect.top + rect.height / 2 - visualHeight / 2;
    const dx = target.x - startLeft - visualWidth / 2;
    const dy = target.y - startTop - visualHeight / 2;
    const distance = Math.hypot(dx, dy);
    const arc = Math.min(380, Math.max(180, distance * 0.45));
    const duration = Math.min(1900, Math.max(1500, distance * 1.25));
    const clone = createFlyElement(origin, options.image || productImage?.currentSrc || productImage?.src);
    const sourceStyle = window.getComputedStyle(origin);
    const point = (progress, scale, rotate = 0, opacity = 1) => {
        const lift = arc * 4 * progress * (1 - progress);
        return {
            transform: `translate3d(${dx * progress}px, ${dy * progress - lift}px, 0) scale(${scale}) rotate(${rotate}deg)`,
            opacity,
        };
    };

    source.animate?.(
        [
            { transform: "scale(1)" },
            { transform: "scale(.92)", offset: 0.45 },
            { transform: "scale(1)" },
        ],
        {
            duration: 180,
            easing: "cubic-bezier(.2,.8,.2,1)",
        }
    );

    clone.style.cssText = `
        position: fixed;
        left: ${startLeft}px;
        top: ${startTop}px;
        width: ${visualWidth}px;
        height: ${visualHeight}px;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        pointer-events: none;
        z-index: 3000;
        transform-origin: center center;
        will-change: transform, opacity, filter;
        border-radius: ${sourceStyle.borderRadius};
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
    `;
    clone.querySelectorAll("img, svg").forEach((el) => {
        el.style.width = "100%";
        el.style.height = "100%";
        el.style.margin = "0";
        el.style.objectFit = "cover";
    });
    document.body.appendChild(clone);

    const animation = clone.animate(
        [
            {
                transform: "translate3d(0, 0, 0) scale(1)",
                opacity: 0.98,
                filter: "brightness(1.08) saturate(1.08)",
            },
            {
                ...point(0.18, 1.04, -5, 1),
                offset: 0.2,
                filter: "brightness(1.15) saturate(1.12)",
            },
            {
                ...point(0.42, 0.96, -9, 1),
                offset: 0.42,
                filter: "brightness(1.16) saturate(1.14)",
            },
            {
                ...point(0.66, 0.78, 7, 0.95),
                offset: 0.64,
                filter: "brightness(1.08) saturate(1.08)",
            },
            {
                ...point(0.86, 0.58, 3, 0.86),
                offset: 0.84,
                filter: "brightness(1.02) saturate(1.02)",
            },
            {
                transform: `translate3d(${dx}px, ${dy}px, 0) scale(.42) rotate(0deg)`,
                opacity: 0.24,
                filter: "brightness(1)",
            },
        ],
        {
            duration,
            easing: "cubic-bezier(.18,.72,.22,1)",
            fill: "forwards",
        }
    );

    animation.finished
        .catch(() => {})
        .finally(() => {
            clone.remove();
            pulseTarget(target.el);
        });
}
