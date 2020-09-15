<template>
  <view class>
    <login></login>
  </view>
</template>

<script>
import login from "../components/login.vue";
export default {
  data() {
    return {
      loading: false,
      wxLogin: false,
    };
  },
  components: {
    login,
  },
  onLoad() {},
  onReady() {},
  methods: {
    onLogin(e) {
      this.loading = e;
      uni.navigateTo({
        url: "/pages/index/index",
      });
    },
  },
};
</script>

<style>
</style>
