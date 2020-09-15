<template>
  <view class="login">
    <view class="bg">
      <view class>
        <image src="/static/login/user.png" class="icon left" />
        <input class="input left" type="text" placeholder="请输入用户名" value v-model="userId" />
        <view style="clear:both"></view>
      </view>
      <view class="input left" style>
        <image src="/static/login/password.png" class="icon left" />
        <input class="input left" v-model="pass" placeholder="请输入密码" type="text" v-show="seen" />
        <input class="input left" v-model="pass" placeholder="请输入密码" type="password" v-show="!seen" />
        <view v-show="seen" @click="changeeyes" class="right">
          <img src="/static/login/open_eye.png" class="icon" />
        </view>
        <view v-show="!seen" @click="changeeyes" class="right">
          <img src="/static/login/close_eye.png" class="icon" />
        </view>
        <view style="clear:both"></view>
      </view>
    </view>
    <button
      class="btn"
      @click="onLogin"
    >立即登录</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      seen: false,
    };
  },
  methods: {
    changeeyes() {
      this.seen = !this.seen;
    },
  },
  onLoad() {

  },
};
</script>

<style scoped>
.bg {
  box-shadow: 5px 2px 6px #000 inset;
  height: 320upx;
  border: 1upx solid #000;
  border-radius: 50upx;
}
.right {
  float: right;
}
.left {
  float: left;
}
.login {
  width: 500upx;
  margin: 0 auto;
  margin-top: 100upx;
}
.icon {
  width: 50upx;
  height: 50upx;
}
.input {
  border: 0 solid #000;
  border-radius: 5upx;
}
.btn {
  width: 350upx;
  border-radius: 50upx;
  border: none !important;
  margin-top: -40upx;
  height: 90upx;
}
</style>