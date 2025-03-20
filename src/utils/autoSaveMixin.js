import { pull } from "@/service/publish/cms";
import { webDuration, localDuration } from "@/pages/publish/setting.json";
import { addRevision, getRevision } from "@/service/publish/revision";
import { getCommitById } from "@/service/publish/version";
import hash from "object-hash";
import { cloneDeep } from "lodash";

export const AutoSaveMixin = {
    data() {
        return {
            // 定时器
            localTimer: "",
            webTimer: "",
        };
    },
    beforeDestroy: function () {
        // 清空引用，释放内存
        clearInterval(this.localTimer);
        this.localTimer = null;

        clearInterval(this.webTimer);
        this.webTimer = null;
    },
    computed: {
        // IndexDB对象
        db() {
            return this.$store.state.db;
        },
        // 草稿模式
        isDraft() {
            return this.$route.query?.mode === "draft";
        },
        // 历史版本模式
        isRevision() {
            return this.$route.query?.mode === "revision";
        },
        // 新作品（没有ID）
        isNewPost() {
            return !this.id;
        },
    },
    methods: {
        // 加载
        // ==============================
        // 初始化加载
        loadData: function () {
            this.loading = true;

            // 1.当 mode = draft 时，加载本地 IndexedDB 内容
            if (this.isDraft) {
                const key = this.$route?.query?.key;
                return this.db
                    .getItem(key)
                    .then((res) => {
                        this.post = res;
                    })
                    .finally(() => {
                        this.loading = false;
                    });

                // 2.当 mode = revision 时，加载对应历史版本内容
            } else if (this.isRevision) {
                const content_meta_id = this.$route.query.content_meta_id;
                const version_id = this.$route.query.version_id;
                if (version_id && content_meta_id) {
                    return getCommitById(content_meta_id, version_id)
                        .then((res) => {
                            this.post = {
                                post_content: res.data?.data?.content || "",
                                prev_post: "",
                                next_post: "",
                            };
                        })
                        .finally(() => {
                            this.loading = false;
                        });
                } else {
                    return new Promise((resolve, reject) => {
                        resolve();
                    }).finally(() => {
                        this.loading = false;
                    });
                }

                // let post_id = this.$route.params.id;
                // let revision_id = this.$route.query.id;
                // return getRevision(post_id, revision_id)
                //     .then((res) => {
                //         this.post = {
                //             ...res.data.data,
                //             prev_post: res.data.data.prev_post || '',
                //             next_post: res.data.data.next_post || '',
                //         };
                //     })
                //     .finally(() => {
                //         this.loading = false;
                //     });

                // 3.正常加载文章
            } else {
                let post_id = this.$route.params.id;
                if (post_id) {
                    return pull(this.$route.params.id)
                        .then((res) => {
                            this.post = {
                                ...res.data.data,
                                prev_post: res.data.data.prev_post || "",
                                next_post: res.data.data.next_post || "",
                            };
                        })
                        .finally(() => {
                            this.loading = false;
                        });
                } else {
                    return new Promise((resolve, reject) => {
                        resolve();
                    }).finally(() => {
                        this.loading = false;
                    });
                }
            }
        },

        // 自动保存
        // 间隔设置见setting.json
        // ==============================
        autoSave: function () {
            // 首次初始化时，为内容创建镜像缓存（以做后续对比功能或其他应用读取原始状态）
            if (this.id) {
                sessionStorage.setItem(this.post.post_type + "_" + this.id, JSON.stringify(this.post));
            }

            // 非草稿或历史版本，执行自动保存逻辑
            if (!this.isDraft && !this.isRevision) {
                // 本地草稿
                this.localTimer = setInterval(() => {
                    this.createLocalDraft();
                }, localDuration);

                // 云端备份
                // if (this.id) {
                //     this.webTimer = setInterval(() => {
                //         this.createCloudRevision();
                //     }, webDuration);
                // }
            }
        },

        // 自动保存：生成本地草稿
        createLocalDraft() {
            let key = "";
            // try {
            //     // 如果是全新作品，自动为其发布为草稿状态以获取唯一标识
            //     if (this.isNewPost) {
            //         await this.publish("draft", false).then((res) => {
            //             key = this.post.post_type + "_" + this.post.ID;
            //         });
            //     }
            // } catch (err) {
            //     // 如果尝试失败，为其创建匿名本地缓存（处理网站接口异常，断网等情况）
            //     key = this.post.post_type + "_" + (this.post.post_title || ('无标题-' + new Date().getTime()))
            // } finally {

            //     let post_cache = cloneDeep(this.post)
            //     post_cache.cache_time = new Date().getTime()

            //     this.db.setItem(key, post_cache).then(() => {
            //         // this.$notify({
            //         //     title: "本地草稿缓存成功",
            //         //     message: "本地草稿保存成功",
            //         //     type: "success",
            //         // });
            //         console.log('本地草稿备份完成',new Date().getTime())
            //     });
            // }

            // 如果是全新作品且有内容，为其创建匿名本地缓存（处理网站接口异常，断网等情况）
            if (this.isNewPost && this.post.post_content) {
                let anonymous = "无标题-" + new Date().getTime();
                key = this.post.post_type + "_" + (this.post.post_title || anonymous);
            }
            // 如果是发布过的作品，不检测有没有内容
            if (this.id) {
                key = this.post.post_type + "_" + this.id;
            }

            // 缓存内容
            let post_cache = cloneDeep(this.post);
            post_cache.cache_time = new Date().getTime();

            if (key) {
                this.db.setItem(key, post_cache).then(() => {
                    console.log("本地草稿备份完成", key, new Date().getTime());
                });
            }
        },

        // 自动保存：生成云端备份
        // createCloudRevision() {
        //     const isSame =
        //         hash.MD5(sessionStorage.getItem(`${this.post.post_type}_${this.post.ID}`)) ===
        //         hash.MD5(JSON.stringify(this.post));
        //     if (isSame) return;
        //     addRevision(this.post.ID, this.post).then(() => {
        //         this.$notify({
        //             title: "提醒",
        //             type: "success",
        //             message: "历史版本生成成功",
        //         });
        //         // 更新md5
        //         sessionStorage.setItem(`${this.post.post_type}_${this.post.ID}`, JSON.stringify(this.post));
        //     });
        // },

        // 使用按钮
        // ==============================
        useDraft() {
            this.$alert("是否使用该版本发布？", "确认信息", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action === "confirm") {
                        this.publish("publish", true);
                    }
                },
            });
        },
    },
};
