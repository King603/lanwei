<template>
  <view class="content">
    <view class="invite-wrapper" v-if="inviteUrl">
      <uni-qrcode
        class="invite-qrcode"
        ref="qrcode"
        cid="invite-qr-canvas"
        :text="inviteUrl"
        :margin="10"
        makeOnLoad
        @makeComplete="qrcodeComplete"
      />
      <view class="share-btn">
        <button type="primary" @click="shareLink">分享链接</button>
        <button type="primary" @click="shareImage">分享图片</button>
      </view>
      <view class="share-btn">
        <button type="primary" @click="toInvitedUser">我邀请的用户</button>
      </view>
      <uni-popup id="popupShare" ref="popupShare" type="share">
        <uni-popup-share title="分享到" :shareType="shareType" @select="select"></uni-popup-share>
      </uni-popup>
    </view>
  </view>
</template>

<script>
import vue from "./invite.js";
export default vue;
</script>

<style>
@import "./invite.css";
</style>
