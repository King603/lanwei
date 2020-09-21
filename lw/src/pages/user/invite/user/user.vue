<template>
  <view class="content">
    <view class="invite-qrcode">
      <view class="invited-users">
        <view class="invited-users-title">我邀请的用户</view>
        <view class="level-selector">
          <text
            v-for="(item,index) in levelArr"
            :class="{act: index === selectedLevel}"
            :key="index"
            @click="changeLevel(index)"
          >{{item}}级下线</text>
        </view>
        <view class="invited-users-list">
          <view class="invited-users-item" v-for="(item,index) in invitedUser" :key="index">
            <text class="username">{{item.username || '新用户'}}</text>
            <text class="mobile">{{item.mobile}}</text>
          </view>
        </view>
        <uni-load-more :status="status"></uni-load-more>
      </view>
    </view>
  </view>
</template>

<script>
import vue from "./user.js";
export default vue;
</script>

<style>
@import url();
</style>
