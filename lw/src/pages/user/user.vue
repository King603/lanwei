<template>
  <view class>
    <view class="center">
      <view class="logo" @click="bindLogin" :hover-class="!hasLogin ? 'logo-hover' : ''">
        <image class="logo-img" :src="avatarUrl" />
        <view class="logo-title">
          <text class="uer-name">Hi，{{hasLogin ? userName : '您未登录'}}</text>
          <text class="go-login navigat-arrow" v-if="!hasLogin">&#xe65e;</text>
        </view>
      </view>
      <view class="center-list">
        <view class="center-list-item border-bottom">
          <text class="list-icon">&#xe60f;</text>
          <text class="list-text">帐号管理</text>
          <text class="navigat-arrow">&#xe65e;</text>
        </view>
        <!-- #ifdef APP-PLUS -->
        <view v-if="hasLogin" class="center-list-item border-bottom" @click="toInvite">
          <text class="list-icon">&#xe65f;</text>
          <text class="list-text">邀请好友</text>
          <text class="navigat-arrow">&#xe65e;</text>
        </view>
        <!-- #endif -->
        <view class="center-list-item">
          <text class="list-icon">&#xe639;</text>
          <text class="list-text">新消息通知</text>
          <text class="navigat-arrow">&#xe65e;</text>
        </view>
      </view>
      <view class="center-list">
        <view class="center-list-item border-bottom">
          <text class="list-icon">&#xe60b;</text>
          <text class="list-text">帮助与反馈</text>
          <text class="navigat-arrow">&#xe65e;</text>
        </view>
        <view class="center-list-item">
          <text class="list-icon">&#xe65f;</text>
          <text class="list-text">服务条款及隐私</text>
          <text class="navigat-arrow">&#xe65e;</text>
        </view>
      </view>
      <view class="center-list">
        <view class="center-list-item">
          <text class="list-icon">&#xe614;</text>
          <text class="list-text">关于应用</text>
          <text class="navigat-arrow">&#xe65e;</text>
        </view>
      </view>
      <view class="btn-row">
        <button v-if="hasLogin" class="primary" type="primary" @click="bindLogout">退出登录</button>
      </view>
    </view>
  </view>
</template>

<script>
import vue from "./user.js";
export default vue;
</script>

<style scoped>
@import "./user.css";
</style>
