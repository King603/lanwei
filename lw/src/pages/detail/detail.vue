<template>
  <view class="bg">
    <titleModule :titleText="titleText" />
    <!-- 扫码 -->
    <m-scan @my-scan="getData"></m-scan>
    <view v-if="isScan" class="isScan">
      <view class="Info">
        <view class="commodity"
          ><img :src="result.commodityInfo.imageURL" alt=""
        /></view>
        <view class="introduce">
          <p class="title">
            商品名称：{{ result.commodityInfo.commodityName }}
          </p>
          <p>规格数量：{{ result.commodityInfo.specificationsNum }}</p>

          <p>主要规格：{{ result.commodityInfo.specificationsMain }}</p>
          <p>商品单价：{{ result.price || "无" }}</p>
          <!-- <view class="showmore" @click="searchSpecifications">查看详情</view> -->
        </view>
      </view>
      <view v-for="(cs, i) of result.commoditySingle" :key="i">
        <view>产品编号：{{ getID(cs.commodityID) }}</view>
        <view
          v-for="(node, index) of cs.businessNode"
          :key="index"
          class="list"
          @click="to(node.nodeID)"
        >
          <view class="one">
            <view
              class="iconfont nodeName"
              :class="
                node.nodeType == 1001
                  ? 'icon-shengchan-'
                  : node.nodeType == 1002
                  ? 'icon-wuliu'
                  : node.nodeType == 1003
                  ? 'icon-cangchu'
                  : node.nodeType == 1004
                  ? 'icon-lingshou'
                  : ''
              "
            >
              {{ node.nodeTypeName }}
            </view>
            <view class="address">
              <p class="node">{{ node.businessName }}</p>
              <p class="node">{{ node.address }}</p>
              <p class="node">当前状态：{{ states[node.state] }}</p>
            </view>
            <view class="right">{{ ">" }}</view>
          </view>
        </view>
        <view @click="getBatch(cs.batch_id)">点击此处查询此商品的批次信息</view>
      </view>
      <view @click="buy(result)" class="buy">查看详情</view>
    </view>
  </view>
</template>

<script>
import * as config from "../../util/config.js";
import app from "../../util/NFC/nfcAndroid/Nfc.js";
import mScan from "../../components/main/m-scan/m-scan";
import setPicturePath from "../../api/setPicturePath.js";
import queryCByID from "../../api/request/detail/queryCByID";
import queryCB from "../../api/request/detail/queryCB";
import titleModule from "../../components/titleModule.vue";

export default {
  data() {
    return {
      /**@type {{
        commodityInfo: {
          info_id: number;
          commodityName: string;
          codeEANUPC: string;
          manufacturerID: string;
          imageURL: string;
          specificationsMain: string;
          specificationsNum: string;
          specifications: {
            name: string;
            value: string;
          }[];
        }
        commoditySingle: {
          commodityID: string;
          tagID: string;
          tagCardID: string;
          tagData: string;
          codeEANUPC: string;
          businessID: string;
          state: number;
          batch_id: number;
          account: string;
          businessNode: {
            nodeID: string;
            nodeType: string;
            nodeTypeName: string;
            businessName: string;
            address: string;
            state: string;
            stateName: string;
            businessID: string;
          }[];
        }[];
      }} */
      result: null,
      className: "",
      isScan: false,
      ImageURL: "",
      isAlive: true,
      states: ["正常流通", "暂停流通", "删除"],
      titleText: "发布商品",
    };
  },
  components: {
    mScan,
    titleModule,
  },
  computed: {},
  methods: {
    to(nodeID) {
      console.log(nodeID);
      uni.navigateTo({ url: "./node/node?id=" + nodeID });
    },
    getData(data) {
      console.log(data);

      let account = uni.getStorageSync("account");
      const loginType = uni.getStorageSync("login_type");
      if (loginType != "online") {
        uni.showToast({
          title: "尚未登陆，请登录！！",
          icon: "none",
          duration: 3000,
        });
        setTimeout(() => uni.navigateTo({ url: "../user/login/login" }), 3000);
        return;
      }
      let tagID = data.tagID;
      let commodityID = data.commodityID;
      let manufacturerID = data.manufacturerID;
      uni.setStorageSync("cardData", { tagID, commodityID, manufacturerID });
      try {
        queryCByID({
          data: {
            tagID,
            commodityID,
            manufacturerID,
            tagData: tagID + commodityID + manufacturerID,
            account,
          },
          success: (data) => {
            this.result = data;
            this.result.commodityInfo.imageURL = setPicturePath(
              this.result.commodityInfo.imageURL
            );
            this.isScan = true;
          },
          fail(msg) {
            console.error(msg);
          },
        });
      } catch (e) {
        console.error(e);
      }
    },
    /** @param {string} id */
    getID(id) {
      let arr = id.split("");
      let str = "";
      for (let i = 0, j = 1; i < arr.length; i++) {
        str = str.padStart(j++, arr[arr.length - 1 - i]);
        if (i % 6 == 5) str = str.padStart(j++, " ");
      }
      return str;
    },
    searchSpecifications() {
      uni.showToast({
        title: "功能暂未添加",
        icon: "none",
      });
      // uni.navigateTo({
      //   url: "./specifications/specifications?id=" + this.result.commodityID,
      // });
    },
    ready() {
      try {
        /**@type {string} */
        let data = uni.getStorageSync("respond");
        if (data == null || data.length <= 0) return;
        !!data && this.getData(JSON.parse(data));
        uni.removeStorageSync("respond");
      } catch (e) {
        throw e;
      }
    },
    reload() {
      this.isAlive = false;
      this.$nextTick(() => (this.isAlive = true));
    },
    buy() {
      uni.navigateTo({
        url: "./specifications?result=" + JSON.stringify(this.result),
      });
    },
    getBatch(batch_id) {
      queryCB({
        data: { batch_id },
        success: (data) => {
          uni.showModal({ content: JSON.stringify(data) });
        },
        fail(errMsg) {
          uni.showModal({ content: errMsg });
        },
      });
    },
  },
  onShow() {
    if (uni.getStorageSync("isSearch") == true) {
      this.result = { commodityInfo: uni.getStorageSync("searchInfo") };
      this.result.commodityInfo.imageURL = setPicturePath(
        this.result.commodityInfo.imageURL
      );
      this.isScan = true;
      uni.removeStorageSync("searchInfo");
      uni.removeStorageSync("isSearch");
    } else this.ready();
  },
  onHide() {
    console.log("detail onHide");
    if (uni.getStorageSync("show")) {
      uni.removeStorageSync("show");
    } else {
      this.result = null;
      this.isScan = false;
    }
  },
};
</script>

<style scoped>
@import url("./detail.css");
</style>