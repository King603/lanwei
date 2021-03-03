<template>
  <view style="width: 100%">
    <titleModule :titleText="titleText" :showNum="true" />
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
            type="number"
            clearable
            focus
            v-model="mobile"
            placeholder="请输入手机号码"
          ></m-input>
        </view>
        <view class="input-row">
          <text class="title">验证码：</text>
          <m-input
            type="number"
            v-model="code"
            placeholder="请输入验证码"
          ></m-input>
          <view class="send-code-btn" v-if="codeDuration > 0"
            >{{ codeDuration }}s后重试</view
          >
          <view class="send-code-btn" v-else @click="sendSmsCode"
            >发送验证码</view
          >
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
        <view class="input-row border">
          <text class="title">密码：</text>
          <m-input
            type="password"
            displayable
            v-model="password"
            placeholder="请输入密码"
          ></m-input>
        </view>
        <view class="input-row" @click="setLogin">
          <view class="isOK" :class="isOK ? 'agree' : 'against'"></view>
          <text class="">记住密码</text>
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
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import getNetworkType from "../../../api/getNetworkType";
import net_off from "../../../api/net_off";
import * as config from "../../../util/config.js";
import { getSign } from "../../../util/sign";
import mInput from "../../../components/m-input.vue";
import sendMs from "../../../api/request/user/sendMs";
import loginByPwd from "../../../api/request/user/loginByPwd";
import loginBySms from "../../../api/request/user/loginBySms";
import getWeChat_openID from "../../../api/request/getWeChat_openID";
import titleModule from "../../../components/titleModule.vue";

export default {
  components: {
		mInput,
		titleModule,
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
      codeInterVal: 0,
      IMEI: "",
      clientType: 0,
      /**@type {{
  		  serial: string;
  		  imei: string;
  		  clientType: number;
  		  random: string;
  		  date: string;
  		  time: string;
			}} */
      myliu: null,
      isOK: false,
      titleText: "登录界面",
    };
  },
  computed: mapState(["forcedLogin"]),
  methods: {
    ...mapMutations(["login"]),
    sendSmsCode() {
      if (this.codeDuration) {
        uni.showToast({
          title: `请在${this.codeDuration}秒后重试`,
          icon: "none",
        });
      }
      if (!config.phoneRegex.test(this.mobile)) {
        uni.showToast({
          title: "手机号码填写错误",
          icon: "none",
        });
        return;
      }
      uni.clearStorageSync();
      (() => {
        // #ifdef APP-PLUS
        return this.app();
        // #endif
        // #ifdef MP-WEIXIN
        return this.weixin();
        // #endif
      })().then(() => {
        // 山寨机就是牛
        if (this.IMEI.length <= 0) {
          let str = this.mobile;
          for (let i = str.length; i < 15; i++) {
            str += parseInt(Math.random() * 10);
          }
          this.IMEI = str;
        }
        // 双卡双待手机更牛
        if (this.IMEI.length > 15) {
          this.IMEI = this.IMEI.substring(0, 15);
        }
        this.myliu = getSign(this.IMEI, this.clientType);
        sendMs({
          data: {
            phoneNum: this.mobile,
            codeSerial: this.myliu.serial,
            imei: this.myliu.imei,
            clientType: this.myliu.clientType,
            random: this.myliu.random,
            date: this.myliu.date,
            time: this.myliu.time,
          },
          success: () => {
            uni.showToast({
              title: "验证码发送成功，请注意查收",
              icon: "none",
            });
            this.codeDuration = config.time;
            this.codeInterVal = setInterval(() => {
              if (--this.codeDuration === 0) {
                if (this.codeInterVal) {
                  clearInterval(this.codeInterVal);
                  delete this.codeInterVal;
                }
              }
            }, 1000);
          },
          fail(msg) {
            uni.showToast({ title: msg, icon: "none" });
          },
        });
      });
    },
    /** 密码登录 */
    loginByPwd() {
      if (!config.accountRegex.test(this.account)) {
        uni.showToast({
          icon: "none",
          title: "账号最短为 6-18 个字符",
        });
        return;
      }
      if (!config.passwordRegex.test(this.password)) {
        uni.showToast({
          icon: "none",
          title: "密码长度为 6-18 位",
        });
        return;
      }
      uni.clearStorageSync();
      (() => {
        // #ifdef APP-PLUS
        return this.app();
        // #endif
        // #ifdef MP-WEIXIN
        return this.weixin();
        // #endif
      })().then(() => this.loginRequest(2));
    },
    /** 免密登录 */
    loginBySms() {
      if (!config.phoneRegex.test(this.mobile)) {
        uni.showToast({
          title: "手机号码填写错误",
          icon: "none",
        });
        return;
      }
      if (!/^\d{6}$/.test(this.code)) {
        uni.showToast({
          title: "验证码为6位纯数字",
          icon: "none",
        });
        return;
      }

      this.loginRequest(1);
    },
    /**
     * 登录请求
     *
     * 登录类型：
     * 1. 免密登录
     * 2. 密码登录
     * @param {number} loginType 登录类型
     */
    loginRequest(loginType) {
      // 显示标题栏加载状态
      uni.showLoading();
      switch (loginType) {
        case 1:
          this.BySms();
          break;
        case 2:
          this.ByPwd();
          break;
      }
    },
    ByPwd() {
      loginByPwd({
        data: {
          account: this.account,
          password: this.password,
          ...getSign(this.IMEI, this.clientType),
        },
        success: (res) => {
          this.isOK
            ? uni.setStorageSync("login_info", {
                account: this.account,
                password: this.password,
                imei: this.IMEI,
                clientType: this.clientType,
                isOK: true,
              })
            : uni.removeStorageSync("login_info");
          uni.setStorageSync("uniIdToken", true);
          // this.success(res);
          let { username } = res;
          uni.setStorageSync("userInfo", {
            ...res,
            clientType: this.clientType,
          });
          uni.setStorageSync("login_type", "online");
          uni.setStorageSync("username", username);
          uni.setStorageSync("account", this.account);
          this.toMain(username);
        },
        complete() {
          uni.hideLoading();
        },
      });
    },
    BySms() {
      loginBySms({
        data: {
          phoneNum: this.mobile,
          code: this.code,
          codeSerial: this.myliu.serial,
          imei: this.myliu.imei,
          clientType: this.myliu.clientType,
          random: this.myliu.random,
          date: this.myliu.date,
          time: this.myliu.time,
        },
        success: (res) => {
          this.toMain(res.username);
        },
        complete() {
          uni.hideLoading();
        },
      });
    },
    app() {
      return new Promise(async (resolve, reject) => {
        await plus.device.getInfo({
          success: (e) => {
            console.log("getDeviceInfo success: " + JSON.stringify(e));
            /**@type {string} */
            let imei = e.imei;
            // 山寨机就是牛
            if (imei.length <= 0) {
              let str = this.mobile;
              for (let i = str.length; i < 15; i++) {
                str += parseInt(Math.random() * 10);
              }
              imei = str;
            }
            // 双卡双待手机更牛
            if (imei.length > 15) {
              imei = imei.split(",")[0];
            }
            this.IMEI = imei;
            this.clientType = e.platform == "Android" ? 1 : 2;
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
            getWeChat_openID(res.code, {
              success: (openid) => {
                let arr = openid.split("");
                let str = "";
                for (let i = 0; i < 17; i++) str += arr[i];
                this.IMEI = str;
                this.clientType = 3;
                resolve();
              },
              fail: (err) => reject(err), // 失败
            });
          },
        });
      });
    },
    bindLogin() {
      let tag = false;
      getNetworkType({
        success(type) {
          if (type == "none") {
            net_off("登录中");
            tag = true;
          }
        },
      }).then(() => {
        if (tag) return;
        switch (this.loginType) {
          case 0:
            this.loginBySms();
            break;
          case 1:
            this.loginByPwd();
            break;
        }
      });
    },
    oauth(value) {
      uni.showToast({
        title: "尝试登陆请销后",
        icon: "none",
      });
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
    setLogin() {
      this.isOK = !this.isOK;
    },
  },
};
</script>

<style>
@import "./login.css";
</style>
