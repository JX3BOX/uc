<template>
    <div class="m-letter-contacts" v-loading="loading">
        <div
            class="m-letter-contact"
            v-for="(item, index) in contacts"
            :key="index"
            :class="{ active: active == item.receiver_info.id }"
            @click="onContactClick(item)"
        >
            <div class="u-close" @click.stop="removeContact(item)" title="移除" v-if="item.receiver_info.id != 0 && canOp">
                <i class="el-icon-close"></i>
            </div>
            <img class="u-avatar" :src="showAvatar(item.receiver_info.avatar)" alt="" />

            <div class="m-user">
                <div class="u-user-name" :title="item.receiver_info.display_name">
                    {{ item.receiver_info.display_name }}
                </div>
                <div class="u-latest-chat" v-if="item.latest_letter">
                    {{ item.latest_letter.content_type ? `[图片]` : item.latest_letter.content }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getRecentContacts, deleteRecentContact, createRecentContact } from "@/service/dashboard/letter";
import { showAvatar } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "contacts",
    props: {
        canOp: {
            type: Boolean,
            default: false,
        }
    },
    emits: ["update:contact", "check:contacts"],
    data() {
        return {
            active: "",
            loading: false,
            isInit: true,
            contacts: [],
        };
    },
    watch: {
        active: {
            handler() {
                const item = this.contacts.find((item) => item.receiver_info.id == this.active);
                this.$emit("update:contact", item);
            },
        },
        "$route.query": {
            deep: true,
            immediate: true,
            handler(val) {
                if (val?.receiver) {
                    this.addContact(val.receiver);
                } else {
                    this.getContacts();
                }
            },
        },
    },
    methods: {
        addContact(uid) {
            if (!uid) return;
            createRecentContact(uid).then((res) => {
                this.getContacts();
            });
        },
        getContacts() {
            if (this.isInit) this.loading = true;
            return getRecentContacts()
                .then((res) => {
                    this.contacts = res?.data?.data || [];

                    this.$emit("check:contacts", !!this.contacts?.length);

                    if (!this.contacts.length) return;
                    // 如果active不在联系人列表中，就默认选中第一个

                    this.active = this.isInit ? res.data?.data[0]?.receiver_info?.id : this.active;

                    this.isInit = false;

                })
                .finally(() => {
                    this.loading = false;
                });
        },
        removeContact(item) {
            deleteRecentContact(item?.receiver_info?.id).then((res) => {
                this.contacts = this.contacts.filter((contact) => contact.receiver_info.id != item.receiver_info.id);
                if (this.active == item.receiver_info.id && this.contacts.length) {
                    this.active = this.contacts[0].receiver_info.id;
                }
                this.$emit("check:contacts", !!this.contacts?.length);
            });
        },
        onContactClick(item) {
            this.active = item.receiver_info.id;
        },
        showAvatar,
    },
};
</script>
