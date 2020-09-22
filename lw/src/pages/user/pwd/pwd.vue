<template>
  <view class="content">
    <view class="input-group">
      <view class="input-row border">
        <text class="title">账号：</text>
        <m-input type="text" focus clearable v-model="userName" placeholder="请输入原始账号"></m-input>
      </view>

      <view class="input-row border">
        <text class="title">绑定的手机号：</text>
        <m-input type="text" focus clearable v-model="phone" placeholder="请输入手机号"></m-input>
      </view>

      <view class="input-row border">
        <text class="title">密码：</text>
        <m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
      </view>

      <view class="input-row border">
        <text class="title">确认密码：</text>
        <m-input type="password" displayable v-model="confirmPassword" placeholder="请确认密码"></m-input>
      </view>
    </view>

    <view class="btn-row">
      <button type="primary" class="primary" @click="findPassword">提交</button>
    </view>
  </view>
</template>

<script>
// import vue from "./pwd.js";
// export default vue;

import mInput from "../../../components/m-input.vue";

export default {
  components: {
    mInput,
  },
  data() {
    return {
      userName: "",
      phone: "",
    };
  },
  methods: {
    findPassword() {
      if (this.userName.length < 3) {
        uni.showToast({
          icon: "none",
          title: "账号最短为 3 个字符",
        });
        return;
      }
      if (!/^1[3456789]\d{9}$/.test(this.phone)) {
        uni.showToast({
          icon: "none",
          title: "手机号码填写错误",
        });
        return;
      }
      if (this.password.length < 6) {
        uni.showToast({
          icon: "none",
          title: "密码最短为 6 个字符",
        });
        return;
      }
      if (this.password !== this.confirmPassword) {
        uni.showToast({
          icon: "none",
          title: "两次密码输入不一致",
        });
        return;
      }
    },
  },
};
</script>

<style>
@import "./pwd.css";
</style>
