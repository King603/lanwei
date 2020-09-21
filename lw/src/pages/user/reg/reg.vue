<template>
  <view class="content">
    <view class="input-group">
      <view class="input-row border">
        <text class="title">账号：</text>
        <m-input type="text" focus clearable v-model="username" placeholder="请输入账号"></m-input>
      </view>
      <view class="input-row border">
        <text class="title">密码：</text>
        <m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
      </view>
      <view class="input-row">
        <text class="title">确认密码：</text>
        <m-input type="password" displayable v-model="confirmPassword" placeholder="请确认密码"></m-input>
      </view>
    </view>
    <view class="btn-row">
      <button type="primary" class="primary" @click="register">注册</button>
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
