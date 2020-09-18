<template>
  <view class="content">
    <view class="hello">
      <view v-show="!hasLogin" class="title">您好 游客。</view>
      <view v-show="hasLogin" class="title">您好 {{userName}}，您已成功登录。</view>
      <view class="ul">
        <input type="text" v-model="search" />
        <button @click="Search()">搜索</button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      search: "",
    };
  },
  computed: mapState(["forcedLogin", "hasLogin", "userName"]),
  onLoad() {
    const loginType = uni.getStorageSync("login_type");
    if (loginType === "local") {
      this.login(uni.getStorageSync("username"));
      return;
    }
    let uniIdToken = uni.getStorageSync("uniIdToken");
    if (uniIdToken) {
      this.login(uni.getStorageSync("username"));
      uniCloud.callFunction({
        name: "user-center",
        data: {
          action: "checkToken",
        },
        success: (e) => {
          console.log("checkToken success", e);

          if (e.result.code > 0) {
            // token过期或token不合法，重新登录
            if (this.forcedLogin) {
              uni.reLaunch({
                url: "../login/login",
              });
            } else {
              uni.navigateTo({
                url: "../login/login",
              });
            }
          }
        },
        fail(e) {
          uni.showModal({
            content: JSON.stringify(e),
            showCancel: false,
          });
        },
      });
    } else {
      this.guideToLogin();
    }
  },

  methods: {
    ...mapMutations(["login"]),

    /** 登录设置 */
    guideToLogin() {
      uni.showModal({
        title: "未登录",
        content: "您未登录，需要登录后才能继续",
        /**
         * 如果需要强制登录，不显示取消按钮
         */
        showCancel: !this.forcedLogin,
        success: (res) => {
          if (res.confirm) {
            /**
             * 如果需要强制登录，使用reLaunch方式
             */
            if (this.forcedLogin) {
              uni.reLaunch({
                url: "../login/login",
              });
            } else {
              uni.navigateTo({
                url: "../login/login",
              });
            }
          }
        },
      });
    },

    /** 搜索查询 */
    Search() {
      console.log(121212);
      uni.navigateTo({
        url: "../mySearch/mySearch?search=" + this.search,
      });
    },
  },
};
</script>

<style>
.hello {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.title {
  color: #8f8f94;
  margin-top: 25px;
}

.ul {
  font-size: 15px;
  color: #8f8f94;
  margin-top: 25px;
}

.ul > view {
  display: inline-block;
}

.ul input {
  border: 1px solid #000;
  line-height: 15px;
  width: 80%;
}
.ul img {
  width: 20%;
}
</style>
