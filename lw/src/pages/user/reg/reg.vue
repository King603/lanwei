<template>
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
          type="phone"
          focus
          clearable
          v-model="phoneNum"
          placeholder="请输入手机号码"
        ></m-input>
      </view>
    </view>
    <view class="btn-row">
      <button type="primary" class="primary" @click="register">注册</button>
    </view>
  </view>
</template>

<script>
import { mapMutations } from "vuex";
import mInput from "../../../components/m-input.vue";
import config from "../../../util/config";
import { getSign } from "../../../util/sign.js";

export default {
  components: {
    mInput,
  },
  data() {
    return {
      account: "",
      userName: "",
      password: "",
      confirmPassword: "",
      phoneNum: "",
      clientType: "",
      IMEI: "",
      model: "",
    };
  },
  methods: {
    ...mapMutations(["login"]),
    register() {
      /**
       * 客户端对账号信息进行一些必要的校验。
       * 实际开发中，根据业务需要进行处理，这里仅做示例。
       */
      if (!config.accountRegex.test(this.account)) {
        uni.showToast({
          icon: "none",
          title: "账号最短为 3 个字符",
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

      this.weixin().then(() => {
        this.aaa();
      });
    },
    app() {
      return new Promise(() => {
        plus.device.getInfo({
          success: (e) => {
            console.log("getDeviceInfo success: " + JSON.stringify(e));
            this.IMEI = e.imei;
            this.model = e.model;
          },
          fail(e) {
            console.log("getDeviceInfo failed: " + JSON.stringify(e));
          },
        });
      });
    },
    weixin() {
      return new Promise((resolve, reject) => {
        uni.login({
          success: (res) => {
            //code值(5分钟失效)
            console.info(res.code);
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
                let str = "";
                for (let i = 0; i < 17; i++) {
                  str += result.data.openid[i];
                }
                this.IMEI = str;
                this.model = "WeChat applet";
                resolve();
              },
              fail: (err) => {
                reject();
              }, //失败
            });
          },
        });
      });
    },
    aaa() {
      // 获取设备信息
      let { imei, clientType, random, date, time, hash } = getSign(
        this.IMEI,
        this.model
      );

      const params = {
        account: this.account,
        username: this.userName,
        password: this.password,
        phoneNum: this.phoneNum,
        serial: hash,
        imei: imei,
        clientType: clientType,
        random: random,
        date: date,
        time: time,
      };

      console.log(params);
      this.request({
        data: params,
        method: "POST",
        success: (e) => {
          console.log("login success", e);
          switch (e.data.code) {
            case 1: // 注册成功
              uni.showModal({
                content: e.data.msg,
                showCancel: false,
              });
              console.log(e.data.data[0].username);
              uni.setStorageSync("username", e.data.data[0].username);
              uni.setStorageSync("login_type", "online");
              this.toMain(e.data.data[0].username);
              console.log(123);
              break;
            case -1: // 注册失败
              uni.showModal({
                content: e.data.msg,
                showCancel: false,
              });
              console.log(321);
              break;
          }
        },
        url: config.reg,
      });
    },
    toMain(userName) {
      this.login(userName);
      /**
       * 强制登录时使用reLaunch方式跳转过来
       * 返回首页也使用reLaunch方式
       */
      uni.reLaunch({
        url: "../user",
      });
    },
    /**
     * @param {{
				url: string;
				data: *;
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
  },
};
</script>

<style>
@import "./reg.css";
</style>
