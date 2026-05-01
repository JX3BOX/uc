import {setCommentConfig, getCommentConfig, setCommentVisible} from "@/service/publish/next"
import User from "@jx3box/jx3box-common/js/user";
export const cmsMetaMixin = {
    data: function() {
        return {
            hasRead: 0,

            open_white_list: 0,
            visible_for_self: 0,
            from: "",

            // 是否违规
            is_illegal: false,
        };
    },
    mounted: function() {
        this.initExtend();
    },
    computed: {
        profile() {
            return this.$store.state.profile;
        },
        level() {
            return User.getLevel(this.profile?.experience)
        }
    },
    methods: {
        initExtend() {
            // 从localStorage中获取hasRead
            this.hasRead = ~~localStorage.getItem("jx3box_has_read") || 0;
        },
        setHasRead() {
            // 设置hasRead
            localStorage.setItem("jx3box_has_read", this.hasRead);
        },
        loadCommentConfig(category, id) {
            getCommentConfig(category, id).then((res) => {
                this.open_white_list = res.data.data?.open_white_list || 0;
                this.visible_for_self = res.data.data?.visible_for_self || 0;
            });
        },
        setCommentConfig(category, id) {
            setCommentConfig(category, id, this.open_white_list ? 'open': 'close');
            setCommentVisible(category, id, this.visible_for_self ? 'open': 'close');
        },
        // 去除post_content中的base64图片
        removeBase64Img(content) {
            // img左右可能是转义符 &lt;img&gt; 或者 <img>
            return content.replace(/(&lt;|<)img[^>]*?src="data:image[^>]*?(&gt;|>)/gi, "");
        },
        isExtraLink(url) {
            // 除了相对路径和*.jx3box.com都是外链
            if (!url) return false;
            if (url.startsWith("/")) return false;
            const domainPattern = /^https?:\/\/([^\/]+\.)?jx3box\.com/;
            if (domainPattern.test(url)) return false;
            return true;
        },
        checkIllegal(val) {
            if (this.level > 2) {
                this.is_illegal = false;
                return
            }
            // 统计外链数量
            let count = 0;
            const regex = /(?:https?:)?\/\/([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/[a-zA-Z0-9._~:\/?#[\]@!$&'()*+,;=-]*)?/gm;

            let links = val.match(regex);
            if (links) {
                for (let link of links) {
                    if (this.isExtraLink(link)) {
                        count++;
                    }
                }
            }

            // 如果外链数量大于5，标记为违规
            this.is_illegal = count >= 5;
        },
        onAnonymousChange: function() {
            if (this.post.anonymous) {
                this.post.visible = 0;
            }
        }
    },
    created: function() {
        // 根据访问域名设置默认客户端版本
        this.post.client = this.$store.state.client;
    },
    watch: {
        $route: {
            immediate: true,
            deep: true,
            handler() {
                const from = this.$route.query?.from;
                if (from) {
                    this.from = from;
                }
                this.init();
            },
        },
        // 当为一个新作品时，根据用户偏好修改默认编辑器
        "$store.state.user_conf.editor_mode": {
            immediate : true,
            handler : function(mode) {
                if (!this.id) {
                    this.post.post_mode = mode || "tinymce";
                }
            },
        },
        "post.post_content": {
            handler: function(val) {
                this.checkIllegal(val);
            }
        },
        "post.content": {
            handler: function(val) {
                this.checkIllegal(val);
            }
        },
    },
};
