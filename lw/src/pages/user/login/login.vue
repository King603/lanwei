<template>
  <view class="content">
    <view class="login-type">
      <view
        v-for="(item,index) in loginTypeList"
        :key="index"
        @click="loginType = index"
        :class="{act: loginType === index}"
        class="login-type-btn"
      >{{item}}</view>
    </view>
    <view class="input-group" v-if="loginType === 0">
      <view class="input-row border">
        <text class="title">手机：</text>
        <m-input class="m-input" type="text" clearable focus v-model="mobile" placeholder="请输入手机号码"></m-input>
      </view>
      <view class="input-row">
        <text class="title">验证码：</text>
        <m-input type="text" v-model="code" placeholder="请输入验证码"></m-input>
        <view
          class="send-code-btn"
          @click="sendSmsCode"
        >{{codeDuration ? codeDuration + 's' : '发送验证码' }}</view>
      </view>
    </view>
    <view class="input-group" v-else>
      <view class="input-row border">
        <text class="title">账号：</text>
        <m-input class="m-input" type="text" clearable focus v-model="username" placeholder="请输入账号"></m-input>
      </view>
      <view class="input-row">
        <text class="title">密码：</text>
        <m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
      </view>
    </view>
    <view class="btn-row">
      <button type="primary" class="primary" @click="bindLogin">登录</button>
    </view>
    <view class="action-row">
      <navigator url="../reg/reg">注册账号</navigator>
      <!-- <text>|</text>
      <navigator url="../pwd/pwd">忘记密码</navigator>-->
    </view>
    <view class="oauth-row" v-if="hasProvider" v-bind:style="{top: positionTop + 'px'}">
      <view class="oauth-image" v-for="provider in providerList" :key="provider.value">
        <image :src="provider.image" @click="oauth(provider.value)" />
        <!-- #ifdef MP-WEIXIN -->
        <button v-if="!isDevtools" open-type="getUserInfo" @getuserinfo="getUserInfo"></button>
        <!-- #endif -->
      </view>
    </view>
  </view>
</template>

<script>
import vue from "./login.js";
export default vue;
</script>

<style>
@import "./login.css";
</style>
