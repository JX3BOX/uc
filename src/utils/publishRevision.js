function parseRevisionContent(content) {
    if (typeof content !== "string") return content;

    const value = content.trim();
    if (!value || !/^[{[]/.test(value)) return content;

    try {
        return JSON.parse(value);
    } catch (error) {
        return content;
    }
}

export function applyRevisionPost(currentPost = {}, revision = {}) {
    const source = revision?.data?.data || revision?.data || revision || {};
    const content = Object.prototype.hasOwnProperty.call(source, "content") ? source.content : source.post_content;
    const parsedContent = parseRevisionContent(content);
    let snapshot;

    if (parsedContent && typeof parsedContent === "object" && !Array.isArray(parsedContent)) {
        snapshot = parsedContent;
    } else if (Object.prototype.hasOwnProperty.call(source, "post_content")) {
        snapshot = {
            ...source,
            post_content: parsedContent || "",
        };
    } else {
        snapshot = {
            post_content: parsedContent || "",
        };
    }

    return {
        ...currentPost,
        ...snapshot,
        ID: currentPost.ID,
        link_content_meta_id: currentPost.link_content_meta_id,
        prev_post: currentPost.prev_post || "",
        next_post: currentPost.next_post || "",
    };
}
