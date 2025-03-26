<template>
    <div class="m-role-info">
        <div class="u-join-time">
            加入魔盒于 {{ data.user_registered | time }}
        </div>
        <div class="m-role-card">
            <role-card />
        </div>
    </div>
</template>

<script>
import dateFormat from "@/utils/dateFormat";
import RoleCard from "@/components/author/mobile/Pannel/RoleCard.vue";

export default {
    name: "RoleInfo",
    components: {
        RoleCard
    },
    computed:{
        data: function () {
            return this.$store.state.userdata;
        },
    },
    filters: {
        time: (val) => {
            return dateFormat(new Date(val));
        },
    },
};
</script>



<style  lang="less">
    .m-role-info{
        display: flex;
        box-sizing: border-box;
        padding: 16px 20px;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        align-self: stretch;
        width: 100%;
        .u-join-time{
            display: flex;
            padding: 8px 12px;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap:  4px;
            align-self: stretch;
            color: var(--black-40, rgba(255, 255, 255, 0.40));

            border-radius: 8px;
            background: var(--primary-brand, #282828);
        }
    }
</style>
