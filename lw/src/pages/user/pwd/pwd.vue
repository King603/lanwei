<template>
  <view class="content">
    <view class="input-group">
      <view class="input-row">
        <text class="title">邮箱：</text>
        <m-input type="text" focus clearable v-model="email" placeholder="请输入邮箱"></m-input>
      </view>
    </view>

    <view class="btn-row">
      <button type="primary" class="primary" @click="findPassword">提交</button>
    </view>
  </view>
</template>

<script>
import vue from "./pwd.js";
export default vue;
</script>

<style>
@import "./pwd.css";
</style>
