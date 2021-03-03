<template>
  <view>
    <titleModule :titleText="titleText" :showNum="true" />
    <view class="content">
      <text class="prompt">*号为设置后不可更改项</text>
      <view class="input-group">
        <view class="input-row border">
          <text class="title red">账号：</text>
          <m-input
            type="text"
            focus
            clearable
            v-model="account"
            placeholder="请输入账号"
          ></m-input>
        </view>
        <view class="input-row border">
          <text class="title">昵称：</text>
          <m-input
            type="text"
            focus
            clearable
            v-model="userName"
            placeholder="请输入昵称"
          ></m-input>
        </view>
        <view class="input-row border">
          <text class="title">密码：</text>
          <m-input
            type="password"
            displayable
            v-model="password"
            placeholder="请输入6到18位的密码"
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
        <view class="input-row border">
          <text class="title red">绑定手机号：</text>
          <m-input
            type="number"
            focus
            clearable
            v-model="phoneNum"
            placeholder="请输入手机号码"
          ></m-input>
        </view>
      </view>
      <view class="btn-row">
        <button type="primary" class="primary" @click="reg">注册</button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import net_off from "../../../api/net_off";
import getNetworkType from "../../../api/getNetworkType";
import * as config from "../../../util/config";
import { getSign } from "../../../util/sign.js";
import mInput from "../../../components/m-input";
import reg from "../../../api/request/user/reg";
import titleModule from "../../../components/titleModule.vue";

export default {
  components: {
		mInput,
		titleModule,
  },
  data() {
    return {
      account: "",
      userName: "",
      password: "",
      confirmPassword: "",
      phoneNum: "",
      clientType: 0,
      IMEI: "",
      titleText: "注册界面",
    };
  },
  computed: mapState(["forcedLogin"]),
  methods: {
    ...mapMutations(["register"]),
    reg() {
      /**终止标志 */
      let tag = false;
      // 获取网络状态
      getNetworkType({
        success(type) {
          if (type == "none") {
            net_off("注册中");
            tag = true;
          }
        },
      }).then(() => {
        if (tag) return;

        if (!config.accountRegex.test(this.account)) {
          uni.showToast({
            icon: "none",
            title: "账号为 6-18 位字符",
          });
          return;
        }
        if (this.userName == "") {
          uni.showToast({
            icon: "none",
            title: "请取一个好听的昵称",
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
        if (this.password !== this.confirmPassword) {
          uni.showToast({
            icon: "none",
            title: "两次密码输入不一致",
          });
          return;
        }
        if (!config.phoneRegex.test(this.phoneNum)) {
          uni.showToast({
            icon: "none",
            title: "电话号码输入错误",
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
          console.log(this.IMEI, this.clientType);

          const params = {
            account: this.account,
            username: this.userName,
            password: this.password,
            phoneNum: this.phoneNum,
            ...getSign(this.IMEI, this.clientType),
          };

          console.log(params);
          uni.clearStorageSync();
          // 显示标题栏加载状态
          uni.showLoading();
          reg({
            data: {
              account: this.account,
              username: this.userName,
              password: this.password,
              phoneNum: this.phoneNum,
              ...getSign(this.IMEI, this.clientType),
            },
            success: (e) => {
              let userName = e.username || "新用户";
              uni.setStorageSync("username", userName);
              uni.setStorageSync("userInfo", e);
              uni.setStorageSync("login_type", "online");
              uni.setStorageSync("uniIdToken", true);
              this.toMain(userName);
            },
            complete() {
              uni.hideLoading();
            },
          });
        });
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
              for (let i = str.length; i < 15; i++)
                str += parseInt(Math.random() * 10);
              imei = str;
            }
            // 双卡双待手机更牛
            if (imei.length > 15) imei = imei.split(",")[0];
            this.IMEI = imei;
            uni.getSystemInfo({
              success: (e) => {
                console.log(e);
                this.clientType = e.platform == "Android" ? 1 : 2;
              },
            });
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
    toMain(userName) {
      this.register(userName);
      /**
       * 强制登录时使用reLaunch方式跳转过来
       * 返回首页也使用reLaunch方式
       */
      uni.reLaunch({ url: "../user" });
    },
  },
};
</script>

<style>
@import "./reg.css";
</style>
