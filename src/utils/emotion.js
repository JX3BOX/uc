import JX3_EMOTION from "@jx3box/jx3box-emotion";

async function formatContent(val) {
    const ins = new JX3_EMOTION(val);
    return await ins._renderHTML();
}

export { formatContent };
