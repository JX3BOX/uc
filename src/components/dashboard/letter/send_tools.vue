<template>
    <div class="m-send-tools">
        <div class="m-upload">
            <i class="el-icon-picture-outline u-upload-icon" @click="select"></i>
            <input
                class="u-upload-file"
                type="file"
                @change="upload"
                ref="uploadInput"
                accept=".jpg, .jpeg, .png, .gif, .bmp,.webp"
            />
        </div>
        <Emotion type="pop" @selected="emotionSelect" :max="6" />
    </div>
</template>

<script>
import { upload } from "@/service/dashboard/index.js";
import Emotion from "@jx3box/jx3box-emotion/src/Emotion.vue";
export default {
    name: "sendTools",
    components: {
        Emotion,
    },
    emits: ["update:image", "update:text"],
    data() {
        return {
            data: "",

            maxSize: 10
        }
    },
    computed: {
        fileInput: function () {
            return this.$refs.uploadInput;
        },
    },
    methods: {
        select() {
            this.fileInput.dispatchEvent(
                new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                })
            );
        },
        upload() {
            const file = this.fileInput.files[0];
            if (!file) return;
            if (file.size > this.maxSize * 1024 * 1024) {
                this.$message.error("图片大小不能超过" + this.maxSize + "M");
                return;
            }
            const formData = new FormData();
            formData.append("file", file);
            upload(formData).then((res) => {
                this.data = res.data.data[0];
                this.$emit("update:image", this.data);
            });
        },
        emotionSelect(data) {
            this.$emit("update:text", data.key);
        },
    }
}
</script>
