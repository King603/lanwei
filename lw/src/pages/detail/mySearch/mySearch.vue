<template>
  <view class="bg">
    <titleModule :titleText="titleText" :showNum="true" />
    <view class="content">
      <view class="main">
        <!-- 商品信息查询 -->
        <view class="ul m-icon m-icon-search">
          <!-- 搜索框 -->
          <m-input
            type="number"
            placeholder="请输入商品EAN/UPC码进行查询"
            v-model="info"
            :maxlength="13"
          ></m-input>
        </view>
      </view>

      <view class="searchInfo" v-show="isSearch">
        <view class="m-icon m-icon-search info" @click="search(searchInfo)">
          <view>EAN/UPC码:“{{ searchInfo }}”</view>
        </view>
      </view>
      <view class="result">
        <!-- 根据后续程序进行构建 -->
      </view>
    </view>
  </view>
</template>

<script>
import getNetworkType from "../../../api/getNetworkType";
import net_off from "../../../api/net_off";
import onlineCIQ from "../../../api/request/detail/onlineCIQ";
import mInput from "../../../components/m-input.vue";
import * as config from "../../../util/config";
import titleModule from "../../../components/titleModule.vue";

export default {
  data() {
    return {
      info: Function,
      searchInfo: "",
      isSearch: false,
      TagData: "",
      /**@type {{commodityName: string; commodityID: string; imageURL: string; specifications: string; specificationsNum: string; specifications: {name: string; value: string;}[];}} */
      result: null,
      titleText: "搜索",
    };
  },
  components: {
    mInput,
    titleModule,
  },
  methods: {
    /** @param {string} info */
    search(info) {
      if (info.length < 13) {
        uni.showToast({
          title: "EAN/UPC码有误",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      let tag = false;
      getNetworkType({
        success(type) {
          if (type == "none") {
            net_off("搜索");
            tag == true;
          }
        },
      }).then(() => {
        if (tag) return;
        uni.showLoading();
        // 搜索信息查询区域
        onlineCIQ({
          data: { codeEANUPC: info },
          success: (data) => {
            uni.setStorageSync("searchInfo", data);
            uni.setStorageSync("isSearch", true);
            uni.switchTab({ url: "../detail" });
          },
          fail(msg) {
            console.log(msg);
          },
          complete() {
            uni.hideLoading();
          },
        });
      });
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
@font-face {
  font-family: uniicons;
  font-weight: normal;
  font-style: normal;
  src: url("~@/static/fonts/uni.ttf") format("truetype");
}

.bg {
  width: 100%;
  background-color: #f0f0f0;
}

.m-icon {
  font-family: uniicons;
  font-weight: normal;
  font-style: normal;
  line-height: 1;
  display: inline-block;
  text-decoration: none;
  -webkit-font-smoothing: antialiased;
  margin: 0;
}

.m-icon-search:before {
  content: "\e466";
  line-height: 35px;
}

.ul {
  font-size: 12px;
  color: #8f8f94;
  /* margin-top: 25px; */
  margin: 20upx 10upx;
  display: flex;
  border-radius: 10px;
  padding: 5px;
  background-color: #fff;
  width: 100%;
}

.main {
  display: flex;
}

.info {
  border-bottom: 0.5rpx solid rgba(0, 0, 0, 1);
  display: flex;
  line-height: 35px;
}
</style>