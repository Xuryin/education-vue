<template>
    <div class="footer_bar">
        <span>@copyright广雅传媒</span>
    </div>
</template>

<script>
    export default {
    }
</script>

<style scoped lang="less">
    @import "~static/less/header.less";
    @import "~static/less/reset.less";
    .footer_bar {
        width: 100%;
        min-width: 1280px;
        background-color: rgb(27, 183, 249);
        color: @fff;
        height: 2.8rem;
        position: absolute;
        bottom: 0;
        span {
            display: inline-block;
            width: 100%;
            text-align: center;
            line-height: 2.8rem;
        }
    }
</style>
