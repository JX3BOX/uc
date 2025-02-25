<template>
    <div v-if="contact" class="m-letter-box">
        <div class="u-chat-name" v-if="hasData">{{ contact.receiver_info.display_name }}</div>
        <div class="m-letter-list" v-loading="loading" element-loading-spinner="el-icon-loading" ref="letterList">
            <div class="u-letter-more">
                <span class="u-load-more" v-show="hasHistory" @click.stop="getHistory"
                    ><i class="el-icon-d-arrow-right u-more-icon"></i>查看历史消息</span
                >
                <span class="u-no-more" v-show="historyFetched && !hasHistory">没有更多消息了~</span>
                <span class="u-loading" v-show="historyFetching"><i class="el-icon-loading"></i></span>
                <span class="u-error" v-show="historyError">
                    消息加载失败，<span class="u-error__btn" @click.stop="getHistory">点击重新加载</span>
                </span>
            </div>
            <div class="m-letter-list-content" v-for="(item, index) in letters" :key="item.id">
                <div class="u-time" v-if="showTime(item, index)">{{ item.created_at }}</div>
                <div class="m-letter-item" :class="letterItemClass(item)">
                    <a :href="link(item)" class="u-avatar" target="_blank">
                        <img :src="letterBelong(item)" class="u-img" :alt="item.id" />
                    </a>
                    <div class="u-letter-content">
                        <div
                            class="u-letter-text"
                            v-if="item.content_type == 0"
                            v-html="lettersTrans[item.content]"
                        ></div>
                        <div class="u-letter-image" v-if="item.content_type == 1" title="点击查看大图">
                            <el-image
                                :src="resolveImagePath(item.content)"
                                :preview-src-list="[item.content]"
                            ></el-image>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="u-letter-new" v-show="newMessage">
            <div class="u-text" @click="toBottom">您有新消息</div>
        </div>
        <send-box @send="send" ref="sendBox" :disabled="!canOp" />
    </div>
</template>

<script>
// api
import { getLetterList, sendLetter, getLetterListBefore } from "@/service/dashboard/letter";
// utils
import DOMPurify from "dompurify";
import User from "@jx3box/jx3box-common/js/user";
import { formatContent } from "@/utils/emotion";
import { showAvatar, authorLink, resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import { uniqBy } from "lodash";
// components
import sendBox from "@/components/dashboard/letter/send_box.vue";
export default {
    name: "letterList",
    components: {
        sendBox,
    },
    props: {
        contact: {
            type: Object,
            default: () => ({}),
        },
        canOp: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["update:contact"],
    data() {
        return {
            lettersTrans: {},
            letters: [],
            peoples: {},
            user: User.getInfo(),
            loading: false,
            isInit: true, // 是否初始化

            firstId: 0, // 第一条数据的id
            lastId: 0, // 最后一条数据的id
            limit: 10, // 每次获取的数据条数
            timer: null, // 循环获取数据的定时器
            hasHistory: true, // 是否有历史消息
            historyFetched: false, // 是否已经获取过历史消息
            historyFetching: false, // 是否正在获取历史消息
            historyError: false, // 历史消息获取失败

            newMessage: false, // 是否有新消息
        };
    },
    computed: {
        hasData() {
            return !!this.contact?.receiver_info?.id;
        },
        letterList() {
            return this.$refs.letterList;
        },
    },
    watch: {
        contact: {
            deep: true,
            immediate: true,
            handler(val, oldVal) {
                if (val?.receiver_info?.id !== oldVal?.receiver_info?.id) {
                    this.letters = [];
                    this.peoples = {};
                    this.firstId = 0;
                    this.lastId = 0;
                    this.hasHistory = false;
                }
                this.isInit = true;
                this.loadLetter();
                clearInterval(this.timer);
                this.cycleLoad();
            },
        },
        letters: {
            deep: true,
            handler(val) {
                if (Array.isArray(val) && val.length > 0) {
                    val.filter((item) => item.content_type === 0).forEach((item) => {
                        this.formatContent(item.content);
                    });
                }
            },
        },
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        resolveImagePath,
        formatContent(content) {
            content = DOMPurify.sanitize(content);
            formatContent(this.nl2br(content)).then((res) => {
                this.$set(this.lettersTrans, content, res);
            });
        },
        nl2br(str) {
            return str.replace(/\n/g, "<br>");
        },
        toBottom() {
            this.newMessage = false;
            this.$nextTick(() => {
                const letterList = this.letterList;
                letterList && (letterList.scrollTop = letterList.scrollHeight);
            });
        },
        loadLetter(mute = true) {
            if (!this.hasData) return;
            if (this.isInit) this.loading = true;
            const params = {
                begin: this.lastId,
                limit: this.limit,
            };
            return getLetterList(this.contact.sender_info.id, this.contact.receiver_info.id, params)
                .then((res) => {
                    this.letters = uniqBy(this.letters.concat(res.data.data?.letters || []), "id");
                    this.peoples = res.data.data?.peoples || {};
                    this.lastId = this.letters[this.letters.length - 1]?.id || this.lastId;
                    this.firstId = this.letters[0]?.id || this.firstId;
                    // 如果letters的长度小于limit，说明没有更多数据了
                    this.hasHistory = !(this.letters.length < this.limit);

                    this.$nextTick(() => {
                        if (this.isInit) {
                            if (this.letterList) {
                                this.letterList.scrollTop = this.letterList.scrollHeight;
                            }
                        }
                    });
                    this.isInit = false;

                    // 如果有新消息，并且滚动条没有到底，设置newMessage为true
                    /* if (res.data.data?.letters?.length > 0 && this.lastId && mute) { // lastId为0说明是第一次加载
                    const letterList = this.letterList;
                    if (letterList && letterList.scrollTop < letterList.scrollHeight - letterList.clientHeight) {
                        this.newMessage = true;
                    }
                } */
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 循环获取最新的数据
        cycleLoad() {
            this.timer = setInterval(() => {
                this.loadLetter();
                this.$emit("update:contact");
            }, 15000);
        },
        getHistory() {
            this.historyFetching = true;
            this.hasHistory = false;
            const params = {
                begin: this.firstId,
                limit: this.limit,
            };
            getLetterListBefore(this.contact.sender_info.id, this.contact.receiver_info.id, params)
                .then((res) => {
                    this.letters = uniqBy([...(res.data.data?.letters || []), ...this.letters], "id");
                    this.hasHistory = !(res.data.data.letters?.length < this.limit);
                    this.firstId = this.letters[0]?.id || this.firstId;

                    this.historyFetched = true;
                    this.historyFetching = false;
                    this.historyError = false;
                })
                .catch((err) => {
                    this.historyFetched = true;
                    this.historyFetching = false;
                    this.historyError = true;
                });
        },
        letterItemClass(item) {
            if (item.sender == this.user.uid) {
                return "me";
            } else {
                return "not-me";
            }
        },
        letterBelong(letter) {
            const id = letter.sender == this.user.uid ? this.user.uid : letter.sender;
            return showAvatar(this.peoples[id]?.avatar);
        },
        link(letter) {
            const id = letter.sender == this.user.uid ? this.user.uid : letter.sender;
            return authorLink(this.peoples[id]?.id);
        },
        showTime(item, index) {
            if (index == 0) {
                return true;
            }
            const last = this.letters[index - 1];
            const lastTime = new Date(last.created_at).getTime();
            const thisTime = new Date(item.created_at).getTime();
            return thisTime - lastTime > 1000 * 60 * 3; // 间隔时间小于3分钟不显示时间
        },
        send(data) {
            sendLetter(this.contact.sender_info.id, this.contact.receiver_info.id, data).then((res) => {
                this.loadLetter(false).then((res) => {
                    this.$refs.sendBox?.clear();
                    this.$emit("update:contact");

                    clearInterval(this.timer);
                    this.cycleLoad();

                    this.$nextTick(() => {
                        // 新消息直接滑到底部
                        if (this.letterList) {
                            this.letterList.scrollTop = this.letterList.scrollHeight;
                        }
                    });
                });
            });
        },
    },
};
</script>
