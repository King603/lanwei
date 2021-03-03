<template>
  <view class="bg">
    <titleModule :titleText="titleText" />
    <view>
      <view class="center">
        <view
          class="logo"
          @click="bindLogin"
          :hover-class="!hasLogin ? 'logo-hover' : ''"
        >
          <image class="logo-img" :src="avatarUrl" />
          <view class="logo-title">
            <text class="user-name"
              >Hi，{{ hasLogin ? userName : "您未登录" }}</text
            >
            <text class="go-login navigat-arrow" v-if="!hasLogin"
              >&#xe65e;</text
            >
          </view>
        </view>
        <view class="center-list">
          <view
            class="center-list-item border-bottom"
            @click="navigateTo('./management')"
          >
            <text class="list-icon">&#xe60f;</text>
            <text class="list-text">帐号管理</text>
            <text class="navigat-arrow">&#xe65e;</text>
          </view>
          <view
            class="center-list-item border-bottom"
            @click="navigateTo('./goods')"
          >
            <text class="list-icon">&#xe609;</text>
            <text class="list-text">查看我的商品</text>
            <text class="navigat-arrow">&#xe65e;</text>
          </view>
          <view class="center-list-item" @click="navigateTo()">
            <text class="list-icon">&#xe639;</text>
            <text class="list-text">新消息通知</text>
            <text class="navigat-arrow">&#xe65e;</text>
          </view>
        </view>
        <view class="center-list">
          <view class="center-list-item border-bottom" @click="navigateTo()">
            <text class="list-icon">&#xe60b;</text>
            <text class="list-text">帮助与反馈</text>
            <text class="navigat-arrow">&#xe65e;</text>
          </view>
          <view class="center-list-item" @click="navigateTo()">
            <text class="list-icon">&#xe65f;</text>
            <text class="list-text">服务条款及隐私</text>
            <text class="navigat-arrow">&#xe65e;</text>
          </view>
        </view>
        <view class="center-list">
          <view class="center-list-item" @click="navigateTo()">
            <text class="list-icon">&#xe614;</text>
            <text class="list-text">关于应用</text>
            <text class="navigat-arrow">&#xe65e;</text>
          </view>
        </view>
        <view class="btn-row">
          <button
            v-if="hasLogin"
            class="primary"
            type="primary"
            @click="bindLogout"
          >
            退出登录
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import getNetworkType from "../../api/getNetworkType";
import net_off from "../../api/net_off";
import titleModule from "../../components/titleModule.vue";

export default {
  data() {
    return {
      avatarUrl: "../../static/img/logo.png",
      titleText: "个人中心",
    };
  },
  computed: {
    ...mapState(["hasLogin", "forcedLogin", "userName"]),
  },
  components: {
    titleModule,
  },
  methods: {
    ...mapMutations(["logout"]),
    bindLogin() {
      if (!this.hasLogin) {
        uni.navigateTo({
          url: "./login/login",
        });
      }
    },
    bindLogout() {
      if (this.hasLogin) {
        this.logout();
        if (this.forcedLogin) {
          uni.reLaunch({
            url: "./login/login",
          });
        }
        uni.clearStorageSync();
        return;
      }
    },
    toInvite() {
      uni.navigateTo({
        url: "/pages/user/invite/invite",
      });
    },
    /**
     * @param {string} url 跳转路径
     */
    navigateTo(url) {
      let tag = false;
      getNetworkType({
        success(type) {
          if (type == "none") {
            net_off("用户界面");
            tag = true;
          }
        },
      }).then(() => {
        if (tag) return;
        if (!this.hasLogin) {
          uni.showToast({
            title: "您未登录，请先登录！",
            icon: "none",
          });
          setTimeout(this.bindLogin, 1000);
          return;
        }
        uni.navigateTo({
          url,
          fail(res) {
            uni.showToast({
              content: "啥情况：" + JSON.stringify(res),
            });
          },
        });
      });
    },
  },
};
</script>

<style scoped>
@import url("./user.css");
</style>
