<template>
  <view class="bg">
    <view class="main">
      <view class="ul m-icon m-icon-search">
        <!-- 搜索框 -->
        <m-input type="text" placeholder="请输入搜索内容"></m-input>
        <button type="primary" class="primary">搜索</button>
      </view>
      <!-- 扫码 -->
      <m-scan :result="result"></m-scan> </view
  ></view>
</template>

<script>
import mInput from "../../../components/m-input.vue";
import mScan from "../../../components/main/m-scan/m-scan.vue";
export default {
  data() {
    return {
      result: null,
    };
  },
  components: {
    mInput,
    mScan,
  },
  methods: {},
};
</script>

<style scoped>
@import "./mySearch.css";
</style>