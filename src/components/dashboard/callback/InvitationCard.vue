<template>
    <main class="m-invitation-callback" :class="`is-${type}`">
        <section class="m-invitation-card">
            <div class="u-card-accent"></div>
            <header class="u-header">
                <span class="u-icon"><i :class="icon"></i></span>
                <div>
                    <span class="u-eyebrow">JX3BOX · {{ $t("dashboard.invitationCallback.title") }}</span>
                    <h1>{{ title }}</h1>
                    <p>{{ description }}</p>
                </div>
            </header>

            <el-skeleton v-if="loading" class="u-skeleton" :rows="2" animated />
            <template v-else-if="valid">
                <div class="u-inviter">
                    <a :href="userLink" target="_blank" class="u-avatar">
                        <img :src="avatar" :alt="userName" />
                    </a>
                    <div class="u-inviter-info">
                        <span class="u-label">{{ $t("dashboard.invitationCallback.inviter") }}</span>
                        <a :href="userLink" target="_blank" class="u-name">{{ userName }}</a>
                    </div>
                    <span class="u-status" :class="{ 'is-finished': finished }">
                        <i :class="finished ? 'el-icon-circle-check' : 'el-icon-time'"></i>
                        {{
                            finished
                                ? $t("dashboard.invitationCallback.processed")
                                : $t("dashboard.invitationCallback.awaitingResponse")
                        }}
                    </span>
                </div>

                <a v-if="subject" :href="subjectLink" target="_blank" class="u-subject">
                    <span>{{ $t("dashboard.invitationCallback.invitedWork") }}</span>
                    <b>{{ subject }}</b>
                    <i class="el-icon-arrow-right"></i>
                </a>

                <div class="u-meta">
                    <i class="el-icon-date"></i>
                    <span>{{ $t("dashboard.invitationCallback.invitedAt") }}</span>
                    <time>{{ time }}</time>
                </div>

                <footer class="u-actions"><slot /></footer>
            </template>
            <el-empty v-else :description="$t('dashboard.invitationCallback.invalid')">
                <el-button @click="$router.push('/msg')">{{ $t("dashboard.invitationCallback.backMessages") }}</el-button>
            </el-empty>
        </section>
        <p class="u-security-tip"><i class="el-icon-lock"></i> {{ $t("dashboard.invitationCallback.securityTip") }}</p>
    </main>
</template>

<script>
export default {
    name: "InvitationCard",
    props: {
        type: { type: String, default: "kith" },
        icon: { type: String, default: "el-icon-message" },
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        avatar: { type: String, default: "" },
        userName: { type: String, default: "" },
        userLink: { type: String, default: "" },
        subject: { type: String, default: "" },
        subjectLink: { type: String, default: "" },
        time: { type: String, default: "" },
        loading: { type: Boolean, default: false },
        valid: { type: Boolean, default: true },
        finished: { type: Boolean, default: false },
    },
};
</script>

<style scoped lang="less">
.m-invitation-callback {
    min-height: calc(100vh - 168px);
    padding: 72px 24px 48px;
    box-sizing: border-box;
    background:
        radial-gradient(circle at 18% 12%, rgba(64, 158, 255, 0.1), transparent 26%),
        radial-gradient(circle at 84% 78%, rgba(103, 194, 58, 0.08), transparent 25%), #f6f8fb;
}
.m-invitation-callback.is-kith {
    background:
        radial-gradient(circle at 18% 12%, rgba(245, 108, 145, 0.12), transparent 26%),
        radial-gradient(circle at 84% 78%, rgba(255, 169, 195, 0.1), transparent 25%), #f9f7f9;
}
.m-invitation-card {
    position: relative;
    max-width: 680px;
    margin: 0 auto;
    overflow: hidden;
    border: 1px solid rgba(31, 45, 61, 0.09);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.96);
    box-shadow: 0 18px 55px rgba(31, 45, 61, 0.1);
}
.u-card-accent {
    height: 4px;
    background: linear-gradient(90deg, #f56c91, #ff9fbd);
}
.is-creators .u-card-accent {
    background: linear-gradient(90deg, #8b6ce6, #c56cf0);
}
.u-header {
    display: flex;
    gap: 18px;
    padding: 34px 38px 27px;
    border-bottom: 1px solid #eef1f5;
    .u-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 54px;
        height: 54px;
        border-radius: 14px;
        color: #fff;
        font-size: 25px;
        background: linear-gradient(145deg, #f56c91, #ff91b4);
        box-shadow: 0 8px 20px rgba(245, 108, 145, 0.24);
    }
    h1 {
        margin: 5px 0 7px;
        color: #263445;
        font-size: 25px;
        line-height: 1.35;
    }
    p {
        margin: 0;
        color: #7b8794;
        font-size: 14px;
        line-height: 1.7;
    }
}
.is-creators .u-header .u-icon {
    background: linear-gradient(145deg, #8067d8, #ad83ea);
    box-shadow: 0 8px 20px rgba(128, 103, 216, 0.24);
}
.u-eyebrow {
    color: #a2aab5;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
}
.u-skeleton {
    box-sizing: border-box;
    padding: 34px 38px 44px;
}
.u-inviter {
    display: flex;
    align-items: center;
    margin: 30px 38px 0;
    padding: 16px;
    border-radius: 12px;
    background: #f8fafc;
}
.u-avatar {
    flex: 0 0 auto;
    img {
        display: block;
        width: 50px;
        height: 50px;
        object-fit: cover;
        border: 3px solid #fff;
        border-radius: 50%;
        box-shadow: 0 3px 10px rgba(31, 45, 61, 0.12);
    }
}
.u-inviter-info {
    min-width: 0;
    flex: 1;
    padding: 0 14px;
    .u-label {
        display: block;
        margin-bottom: 4px;
        color: #98a1ad;
        font-size: 12px;
    }
    .u-name {
        display: block;
        overflow: hidden;
        color: #34495e;
        font-size: 16px;
        font-weight: 600;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:hover { color: #409eff; }
    }
}
.u-status {
    flex: 0 0 auto;
    padding: 6px 10px;
    border-radius: 20px;
    color: #d48806;
    font-size: 12px;
    background: #fff7e6;
    &.is-finished { color: #529b2e; background: #f0f9eb; }
}
.u-subject {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    margin: 14px 38px 0;
    padding: 15px 17px;
    border: 1px solid #ebeef5;
    border-radius: 10px;
    color: #8c96a3;
    font-size: 13px;
    transition: 0.2s ease;
    b {
        overflow: hidden;
        color: #34495e;
        font-size: 14px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    &:hover { border-color: #c6e2ff; background: #f5faff; }
}
.u-meta {
    display: flex;
    align-items: center;
    gap: 7px;
    margin: 18px 38px 0;
    color: #a2aab5;
    font-size: 12px;
    time { margin-left: 2px; color: #697583; }
}
.u-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 28px;
    padding: 22px 38px 28px;
    border-top: 1px solid #eef1f5;
    background: #fbfcfd;
    :deep(.el-button) { min-width: 112px; margin-left: 0; }
    :deep(.el-button > span) {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
    }
}
.u-security-tip {
    margin: 18px auto 0;
    color: #a3abb5;
    font-size: 12px;
    text-align: center;
    i { margin-right: 4px; }
}
@media screen and (max-width: 768px) {
    .m-invitation-callback { min-height: calc(100vh - 112px); padding: 28px 12px; }
    .m-invitation-card { border-radius: 12px; }
    .u-header { gap: 13px; padding: 25px 20px 22px; }
    .u-header .u-icon { flex-basis: 46px; height: 46px; font-size: 21px; }
    .u-header h1 { font-size: 21px; }
    .u-inviter { margin: 22px 18px 0; padding: 13px; }
    .u-status { padding: 5px 8px; }
    .u-subject { margin: 12px 18px 0; }
    .u-meta { margin: 16px 18px 0; }
    .u-actions { padding: 20px 18px 24px; }
    .u-actions :deep(.el-button) { flex: 1; min-width: 0; }
}
</style>
