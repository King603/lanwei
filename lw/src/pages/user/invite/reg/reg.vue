<template>
  <view class="content">
    <view class></view>
    <view class="form-group">
      <view class="form-row">
        <text class="form-label">手机号：</text>
        <input
          class="form-input"
          type="text"
          auto-focus="true"
          v-model="mobile"
          placeholder="请输入手机号码"
        />
      </view>
      <view class="form-row">
        <text class="form-label">验证码：</text>
        <input class="form-input" type="form-input" v-model="code" placeholder="请输入验证码" />
        <view
          class="send-code-btn"
          @click="sendSmsCode"
        >{{codeDuration ? codeDuration + 's' : '发送验证码' }}</view>
      </view>
      <view class="form-row">
        <text class="form-label">邀请码：</text>
        <input class="form-input" type="text" v-model="inviteCode" placeholder="邀请码(选填)" />
      </view>
      <view class="form-row">
        <text class="form-label">密码：</text>
        <input
          class="form-input"
          type="password"
          displayable
          v-model="password"
          placeholder="请输入密码"
        />
      </view>
      <view class="form-row">
        <text class="form-label">确认密码：</text>
        <input
          class="form-input"
          type="password"
          displayable
          v-model="confirmPassword"
          placeholder="请确认密码"
        />
      </view>
      <view class="form-submit">
        <button type="primary" class="primary" @click="register">注册</button>
      </view>
    </view>
    <view class="download-app">
      <text @click="download">已有账号下载APP登录</text>
    </view>
  </view>
</template>

<script>
import vue from "./reg.js";
export default vue;
</script>

<style>
@import "./reg.css";
</style>
