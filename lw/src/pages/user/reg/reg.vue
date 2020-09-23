<template>
  <view class="content">
    <text class="prompt">*号为设置后不可更改项</text>
    <view class="input-group">
      <view class="input-row border">
        <text class="title red">账号：</text>
        <m-input type="text" focus clearable v-model="username" placeholder="请输入账号"></m-input>
      </view>
      <view class="input-row border">
        <text class="title">密码：</text>
        <m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
      </view>
      <view class="input-row border">
        <text class="title">确认密码：</text>
        <m-input type="password" displayable v-model="confirmPassword" placeholder="请确认密码"></m-input>
      </view>
      <view class="input-row border">
        <text class="title red">绑定电话：</text>
        <m-input type="phone" displayable v-model="phoneNum" placeholder="请输入手机号码"></m-input>
      </view>
    </view>
    <view class="btn-row">
      <button type="primary" class="primary" @click="register">注册</button>
    </view>
  </view>
</template>

<script>
import mInput from "../../../components/m-input.vue";
import { config } from "../../../util/config";

export default {
  components: {
    mInput,
  },
  data() {
    return {
      username: "",
      password: "",
      confirmPassword: "",
      phoneNum: "",
    };
  },
  methods: {
    register() {
      /**
       * 客户端对账号信息进行一些必要的校验。
       * 实际开发中，根据业务需要进行处理，这里仅做示例。
       */
      if (this.username.length < 3) {
        uni.showToast({
          icon: "none",
          title: "账号最短为 3 个字符",
        });
        return;
      }
      if (this.password.length < 6 || this.password.length > 18) {
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
      if (!config.phoneRegex.test(this.phoneNum)) {
        uni.showToast({
          icon: "none",
          title: "电话号码输入错误",
        });
        return;
      }

      const params = {
        userName: this.username,
        passWord: this.password,
        phoneNum: this.phoneNum,
      };
      console.log(params);
      this.request({
        data: params,
        method: "POST",
        success: (e) => {
          console.log("login success", e);
        },
        url: "/111",
      });
      // uniCloud.callFunction({
      //   name: "user-center",
      //   data: {
      //     action: "register",
      //     params: params,
      //   },
      //   success(e) {
      //     console.log("注册成功", e);

      //     if (e.result.code === 0) {
      //       uni.showToast({
      //         title: "注册成功",
      //       });
      //       uni.setStorageSync("uniIdToken", e.result.token);
      //       uni.setStorageSync("username", e.result.username);
      //       uni.reLaunch({
      //         url: "../main/main",
      //       });
      //     } else {
      //       uni.showModal({
      //         content: JSON.stringify(e.result),
      //         showCancel: false,
      //       });
      //     }
      //   },
      //   fail(e) {
      //     uni.showModal({
      //       content: JSON.stringify(e),
      //       showCancel: false,
      //     });
      //   },
      // });
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

      let sessionKey = uni.getStorageSync("sessionKey");
      console.log("session key: ", sessionKey);

      // 数据交互
      uni.request({
        url: config.apiHost + url,
        data,
        // header: {
        //   // 微信头标签数据，必填
        //   "content-type": "application/json;charset=UTF-8",
        //   "X-HXCharge-Authentication": uni
        //     .getStorageSync("sessionKey")
        //     .toString(),
        // },
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
