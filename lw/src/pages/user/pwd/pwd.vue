<template>
  <view>
    <titleModule :titleText="titleText" :showNum="true" />
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
        <button type="primary" class="primary" @click="findPassword">
          提交
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import mInput from "../../../components/m-input.vue";
import * as config from "../../../util/config.js";
import changePwd from "../../../api/request/user/changePwd";
import titleModule from "../../../components/titleModule.vue";

export default {
  components: {
    mInput,
    titleModule,
  },
  data() {
    return {
      account: "",
      password: "",
      confirmPassword: "",
      phone: "",
      titleText: "找回密码",
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
      uni.showLoading();
      changePwd({
        data: {
          account: this.account,
          password: this.password,
          phoneNum: this.phone,
        },
        success(res) {
          console.log(res);
        },
        fail(msg) {
          console.log(msg);
        },
        complete() {
          uni.hideLoading();
        },
      });
    },
  },
  onLoad() {
    uni.showModal({
      showCancel: false,
      title: "此功能暂为演示界面，接口未完成",
    });
  },
};
</script>

<style>
@import "./pwd.css";
</style>
