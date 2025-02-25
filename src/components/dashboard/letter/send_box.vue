<template>
    <div class="m-letter-sendbox" :class="{ disabled: disabled }">
        <sendTools @update:image="sendImage" @update:text="updateText" />
        <div class="u-send-content">
            <el-input type="textarea" placeholder="按 Ctrl+Enter 可快速发送消息" v-model="content" id="letterInput" @keydown.ctrl.enter.native="send"></el-input>
        </div>
        <div class="u-send-action">
            <span class="u-text-sum">
                <span class="u-current-sum" :class="{ over: isOver }">{{ currentSum }}</span>
                <span class="u-max-sum">/{{ max }}</span>
            </span>
            <el-button size="mini" :disabled="isOver || !currentSum" @click="send">发送</el-button>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import sendTools from "./send_tools.vue";
export default {
    name: "sendBox",
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        sendTools,
    },
    emits: ["send"],
    data() {
        return {
            content: "",
            max: 500,

            user: User.getInfo(),

            isLogin: User.isLogin(),
        };
    },
    computed: {
        currentSum() {
            return this.content.length;
        },
        // 是否超过
        isOver() {
            return this.currentSum > this.max;
        },
    },
    methods: {
        // 发送
        send() {
            if (this.isOver || !this.currentSum) return;
            this.$emit("send", { content: this.content, content_type: 0 }); // 文本类型
        },
        clear() {
            this.content = "";
        },
        sendImage(image) {
            this.$emit("send", { content: image, content_type: 1 }); // 图片类型
        },
        async updateText(key) {
            const myField = document.querySelector(`#letterInput`);
            const value = key
            if (myField.selectionStart || myField.selectionStart === 0) {
                let startPos = myField.selectionStart;
                let endPos = myField.selectionEnd;

                this.content =
                    myField.value.substring(0, startPos) +
                    value +
                    myField.value.substring(endPos, myField.value.length);

                await this.$nextTick();

                myField.focus();
                myField.setSelectionRange(
                    endPos + value.length,
                    endPos + value.length
                );
            } else {
                this.content = value;
            }
        }
    },
};
</script>
