<template>
  <view class="content">
    <view class="login-type">
      <view
        v-for="(item, index) in loginTypeList"
        :key="index"
        @click="loginType = index"
        :class="{ act: loginType === index }"
        class="login-type-btn"
        >{{ item }}</view
      >
    </view>
    <view class="input-group" v-if="loginType === 0">
      <view class="input-row border">
        <text class="title">手机：</text>
        <m-input
          class="m-input"
          type="text"
          clearable
          focus
          v-model="mobile"
          placeholder="请输入手机号码"
        ></m-input>
      </view>
      <view class="input-row">
        <text class="title">验证码：</text>
        <m-input
          type="text"
          v-model="code"
          placeholder="请输入验证码"
        ></m-input>
        <view class="send-code-btn" @click="sendSmsCode">{{
          codeDuration ? codeDuration + "s" : "发送验证码"
        }}</view>
      </view>
    </view>
    <view class="input-group" v-else>
      <view class="input-row border">
        <text class="title">账号：</text>
        <m-input
          class="m-input"
          type="text"
          clearable
          focus
          v-model="account"
          placeholder="请输入账号"
        ></m-input>
      </view>
      <view class="input-row">
        <text class="title">密码：</text>
        <m-input
          type="password"
          displayable
          v-model="password"
          placeholder="请输入密码"
        ></m-input>
      </view>
    </view>
    <view class="btn-row">
      <button type="primary" class="primary" @click="bindLogin">登录</button>
    </view>
    <view class="action-row">
      <navigator url="../reg/reg">注册账号</navigator>
      <text v-show="loginType == 1">|</text>
      <navigator url="../pwd/pwd" v-show="loginType == 1">忘记密码</navigator>
    </view>
    <view
      class="oauth-row"
      v-if="hasProvider"
      v-bind:style="{ top: positionTop + 'px' }"
    >
      <view
        class="oauth-image"
        v-for="provider in providerList"
        :key="provider.value"
      >
        <image :src="provider.image" @click="oauth(provider.value)" />
        <!-- #ifdef MP-WEIXIN -->
        <button
          v-if="!isDevtools"
          open-type="getUserInfo"
          @getuserinfo="getUserInfo"
        ></button>
        <!-- #endif -->
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import mInput from "../../../components/m-input.vue";
import config from "../../../util/config.js";
import { getSign } from "../../../util/sign";

export default {
  components: {
    mInput,
  },
  data() {
    return {
      loginType: 0,
      loginTypeList: ["免密登录", "密码登录"],
      mobile: "",
      code: "",
      providerList: [],
      hasProvider: false,
      account: "",
      password: "",
      positionTop: 0,
      codeDuration: 0,
      IMEI: "",
      clientType: 0,
    };
  },
  computed: mapState(["forcedLogin"]),
  methods: {
    ...mapMutations(["login"]),
    sendSmsCode() {
      if (this.codeDuration) {
        uni.showModal({
          content: `请在${this.codeDuration}秒后重试`,
          showCancel: false,
        });
      }
      if (!config.phoneRegex.test(this.mobile)) {
        uni.showModal({
          content: "手机号码填写错误",
          showCancel: false,
        });
        return;
      }
      this.request({
        data: {
          phoneNum: this.mobile,
        },
        method: "POST",
        success: (e) => {
          if (e.data.code == 0) {
            uni.showModal({
              content: "验证码发送成功，请注意查收",
              showCancel: false,
            });
            this.codeDuration = 60;
            this.codeInterVal = setInterval(() => {
              this.codeDuration--;
              if (this.codeDuration === 0) {
                if (this.codeInterVal) {
                  clearInterval(this.codeInterVal);
                  this.codeInterVal = null;
                }
              }
            }, 1000);
          } else {
            uni.showModal({
              content: "验证码发送失败：" + e.data.msg,
              showCancel: false,
            });
          }
        },
        url: config.login(this.loginType),
      });
    },
    /** 密码登录 */
    loginByPwd() {
      if (!config.accountRegex.test(this.account)) {
        uni.showToast({
          icon: "none",
          title: "账号最短为 3 个字符",
        });
        return;
      }
      if (!config.passwordRegex.test(this.password)) {
        uni.showToast({
          icon: "none",
          title: "密码长度为6-18位",
        });
        return;
      }
      (() => {
        // #ifdef APP-PLUS
        return this.app();
        // #endif
        // #ifdef MP-WEIXIN
        return this.weixin();
        // #endif
      })().then(async () => {
        let { hash, imei, clientType, random, date, time } = getSign(
          this.IMEI,
          this.clientType
        );

        const params = {
          account: this.account,
          password: this.password,
          serial: hash,
          imei: imei,
          clientType: clientType,
          random: random,
          date: date,
          time: time,
        };
        console.log(params);
        await this.request({
          data: params,
          method: "POST",
          success: (e) => this.success(e),
          url: config.login(this.loginType),
        });
      });
    },
    /**
     * @param {UniApp.RequestSuccessCallbackResult} e
     */
    success(e) {
      console.log("login success", e);
      if (e.data.code == 1) {
        let userName = e.data.data[0].username || "新用户";
        uni.setStorageSync("username", userName);
        uni.setStorageSync("login_type", "online");
        this.toMain(userName);
      } else {
        uni.showModal({
          content: e.data.msg,
          showCancel: false,
        });
        console.log("登录失败", e);
      }
    },
    /** 免密登录 */
    loginBySms() {
      if (!config.phoneRegex.test(this.mobile)) {
        uni.showModal({
          content: "手机号码填写错误",
          showCancel: false,
        });
        return;
      }
      if (!/^\d{6}$/.test(this.code)) {
        uni.showModal({
          title: "验证码为6位纯数字",
          showCancel: false,
        });
        return;
      }

      (() => {
        // #ifdef APP-PLUS
        return this.app();
        // #endif
        // #ifdef MP-WEIXIN
        return this.weixin();
        // #endif
      })().then(() => {
        this.request({
          data: {
            mobile: this.mobile,
            code: this.code,
          },
          method: "POST",
          success: (e) => {
            this.success(e);
          },
          url: config.login(this.loginType),
        });
      });
    },
    app() {
      return new Promise(async (resolve, reject) => {
        await plus.device.getInfo({
          success: (e) => {
            console.log("getDeviceInfo success: " + JSON.stringify(e));
            this.IMEI = e.imei;
            this.clientType = e.model == "Android" ? 1 : 2;
            resolve();
          },
          fail(e) {
            console.log("getDeviceInfo failed: " + JSON.stringify(e));
            reject();
          },
        });
      });
    },
    weixin() {
      return new Promise(async (resolve, reject) => {
        await uni.login({
          success: (res) => {
            //code值(5分钟失效)
            console.info(res.code);
            //小程序secret
            let secret = "1a5567978saf65c43s8s2397er1332ce";
            //wx接口路径
            let url =
              "https://api.weixin.qq.com/sns/jscode2session?appid=" +
              config.appId +
              "&secret=" +
              config.appSecret +
              "&js_code=" +
              res.code +
              "&grant_type=authorization_code";
            uni.request({
              url: url, // 请求路径
              method: "GET", //请求方式
              success: (result) => {
                //响应成功
                //这里就获取到了openid了
                console.info(result.data.openid);
                let arr = result.data.openid.split("");
                let str = "";
                for (let i = 0; i < 17; i++) {
                  str += arr[i];
                }
                this.IMEI = str;
                this.clientType = 3;
                resolve();
              },
              fail: (err) => {
                console.log(err);
                reject();
              }, //失败
            });
          },
        });
      });
    },
    bindLogin() {
      switch (this.loginType) {
        case 0:
          this.loginBySms();
          break;
        case 1:
          this.loginByPwd();
          break;
      }
    },
    /**
     * @param {{
        url: string;
        data: {};
        method: "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT";
        success(result: UniApp.RequestSuccessCallbackResult): void;
			}}
     */
    request({ data, success, method, url }) {
      // 显示标题栏加载状态
      uni.showNavigationBarLoading();
      // 数据交互
      uni.request({
        url: config.apiHost + url,
        data,
        method, // 请求类型
        success,
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
    oauth(value) {
      uni.showModal({
        content: "尝试登陆请销后",
        showCancel: false,
      });
      console.log("三方登录只演示登录api能力，暂未关联云端数据");
      uni.login({
        provider: value,
        success: (res) => {
          uni.getUserInfo({
            provider: value,
            success: (infoRes) => {
              /**
               * 实际开发中，获取用户信息后，需要将信息上报至服务端。
               * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
               */
              this.loginLocal(infoRes.userInfo.nickName);
            },
            fail() {
              uni.showToast({
                icon: "none",
                title: "登陆失败",
              });
            },
          });
        },
        fail: (err) => {
          console.error("授权登录失败：" + JSON.stringify(err));
        },
      });
    },
    getUserInfo({ detail }) {
      console.log(detail);
      if (detail.userInfo) {
        this.loginLocal(detail.userInfo.nickName);
      } else {
        uni.showToast({
          icon: "none",
          title: "登陆失败",
        });
      }
    },
    loginLocal(nickName) {
      uni.setStorageSync("login_type", "local");
      uni.setStorageSync("username", nickName);
      this.toMain(nickName);
    },
    toMain(userName) {
      this.login(userName);
      /**
       * 强制登录时使用reLaunch方式跳转过来
       * 返回首页也使用reLaunch方式
       */
      if (this.forcedLogin) {
        uni.reLaunch({
          url: "../main/main",
        });
      } else {
        uni.navigateBack();
      }
    },
  },
};
</script>

<style>
@import "./login.css";
</style>
