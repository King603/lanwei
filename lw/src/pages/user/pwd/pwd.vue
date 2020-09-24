<template>
  <view class="content">
    <view class="input-group">
      <view class="input-row border">
        <text class="title">账号：</text>
        <m-input
          type="text"
          focus
          clearable
          v-model="account"
          placeholder="请输入原始账号"
        ></m-input>
      </view>

      <view class="input-row border">
        <text class="title">绑定的手机号：</text>
        <m-input
          type="text"
          focus
          clearable
          v-model="phone"
          placeholder="请输入手机号"
        ></m-input>
      </view>

      <view class="input-row border">
        <text class="title">密码：</text>
        <m-input
          type="password"
          displayable
          v-model="password"
          placeholder="请输入密码"
        ></m-input>
      </view>

      <view class="input-row border">
        <text class="title">确认密码：</text>
        <m-input
          type="password"
          displayable
          v-model="confirmPassword"
          placeholder="请确认密码"
        ></m-input>
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
import config from "../../../util/config.js";

export default {
  components: {
    mInput,
  },
  data() {
    return {
      account: "",
      password: "",
      confirmPassword: "",
      phone: "",
    };
  },
  methods: {
    findPassword() {
      if (!config.accountRegex.test(this.account)) {
        uni.showToast({
          icon: "none",
          title: "账号最短为 3 个字符",
        });
        return;
      }
      if (!config.phoneRegex.test(this.phone)) {
        uni.showToast({
          icon: "none",
          title: "手机号码填写错误",
        });
        return;
      }
      if (!config.passwordRegex.text(this.password)) {
        uni.showToast({
          icon: "none",
          title: "密码长度为6-18位",
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
      uni.showNavigationBarLoading();

      uni.request({
        url: config.apiHost + config.pwd,
        data: {
          account: this.account,
          password: this.password,
          phoneNum: this.phone,
        },
        success(e) {
          console.log(e);
        },
        fail(e) {
          uni.showModal({
            content: JSON.stringify(e),
            showCancel: false,
          });
        },
        complete() {
          uni.hideNavigationBarLoading();
        },
      });
    },
  },
};
</script>

<style>
@import "./pwd.css";
</style>
