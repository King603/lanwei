<template>
  <view class="bg">
    <view class="main">
      <!-- 商品信息查询 -->
      <view class="ul m-icon m-icon-search">
        <!-- 搜索框 -->
        <m-input
          type="text"
          placeholder="请输入商品信息"
          v-model="info"
        ></m-input>
      </view>
    </view>

    <view class="searchInfo" v-show="isSearch">
      <view class="m-icon m-icon-search info">
        <view @click="search(searchInfo)">查找“{{ searchInfo }}”</view>
      </view>
    </view>
    <view class="result">
      <!-- 根据后续程序进行构建 -->
    </view>
  </view>
</template>

<script>
import mInput from "../../../components/m-input.vue";
export default {
  data() {
    return {
      info: Function,
      searchInfo: "",
      isSearch: false,
      TagData: "",
    };
  },
  components: {
    mInput,
  },
  methods: {
    search(info) {
      // 搜索信息查询区域
    },
  },
  watch: {
    info(data) {
      this.isSearch = !!data;
      this.searchInfo = data;
    },
  },
};
</script>

<style scoped>
@import "./mySearch.css";
</style>