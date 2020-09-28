<template>
  <view class="bg">
    <view class="main">
      <view class="ul m-icon m-icon-search">
        <!-- 搜索框 -->
        <m-input type="text" placeholder="请输入搜索内容"></m-input>
      </view>
    </view>
    <view class="searchInfo"></view>
  </view>
</template>

<script>
import mInput from "../../../components/m-input.vue";
export default {
  data() {
    return {
      info: "",
    };
  },
  components: {
    mInput,
  },
  methods: {},
};
</script>

<style scoped>
@import "./mySearch.css";
</style>