<template>
  <view class="content">
    <view class="title">
      <view>
        <view class="button" @click="toScan">
          <view class="iconfont icon-saoyisao"></view>
          <view>扫一扫</view>
        </view>
        <view class="button" @click="toNFC">
          <view class="iconfont icon-nfc"></view>
          <view>NFC</view>
        </view>
      </view>
      <!-- 搜索框 -->
      <view class="ul m-icon m-icon-search" @click="Search">
        <m-input type="text" placeholder="请输入搜索内容"></m-input>
      </view>
    </view>
    <!-- 轮播图 -->
    <!-- <view class="slideshow">
      <m-slideshow :list="ImagesSrcArr"></m-slideshow>
    </view> -->
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import mInput from "../../components/m-input.vue";
import mSlideshow from "../../components/main/m-slideshow/m-slideshow.vue";

export default {
  data() {
    return {
      /**
       * 轮播所需图片地址
       * @type {string[]}
       */
      ImagesSrcArr: [],
      buttons: [
        { className: "icon-saoyisao", text: "扫一扫" },
        { className: "icon-nfc", text: "NFC" },
      ],
    };
  },
  components: {
    mInput,
    mSlideshow,
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
                url: "../user/login/login",
              });
            } else {
              uni.navigateTo({
                url: "../user/login/login",
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
                url: "../user/login/login",
              });
            } else {
              uni.navigateTo({
                url: "../user/login/login",
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
        url: "../detail/mySearch/mySearch",
      });
		},
		/**跳转到扫一扫界面 */
    toScan() {
      uni.switchTab({
        url: "../detail/detail",
        fail(e) {
          console.log(e);
        },
      });
		},
    toNFC() {},
  },
};
</script>

<style scoped>
@import "./main.css";
</style>
