<template>
  <view class="bg">
		<titleModule :titleText="titleText" :showNum="true" />
    <!-- 扫码 -->
    <m-scan @my-scan="getData"></m-scan>
    <view v-if="isScan" class="info">
      <view class="Info">
        <view
          class="commodity"
          :style="{
            backgroundImage:
              'url(' +
              result.ImageURL +
              ');background-position: center center;background-size: contain;background-repeat: no-repeat;',
          }"
        ></view>
        <view class="introduce">
          <p class="title">商品名称：{{ result.commodityName }}</p>
          <p>规格数量：{{ result.specificationsNum }}</p>
          <p v-if="isScan">产品编号：{{ getID(result.commodityID) }}</p>
          <!-- <view class="showmore" @click="searchSpecifications">查看详情</view> -->
        </view>
        <view class="last"
          ><span :class="!result.state ? 'state' : ''">{{
            (!result.state ? "未" : "已") + "入库"
          }}</span></view
        >
      </view>
      <view
        v-for="(Logistics, index) in result.LogisticsList"
        :key="index"
        class="list"
        @click="to(Logistics.nodeId)"
      >
        <view class="one">
          <view
            class="iconfont nodeName"
            :class="
              Logistics.nodeName == '生产'
                ? 'icon-shengchan-'
                : Logistics.nodeName == '物流'
                ? 'icon-wuliu'
                : Logistics.nodeName == '仓储'
                ? 'icon-cangchu'
                : Logistics.nodeName == '零售'
                ? 'icon-lingshou'
                : ''
            "
          >
            {{ Logistics.nodeName }}
          </view>
          <view class="address">
            <ul>
              <li v-for="node of Logistics.nodeArr" :key="node">
                <text class="node">{{ node }}</text>
              </li>
            </ul>
          </view>
          <view class="right">{{ ">" }}</view>
        </view>
      </view>
    </view>
    <view class="ruku">入库</view>
  </view>
</template>

<script>
import * as config from "../../util/config.js";
import titleModule from "../../components/titleModule.vue";

export default {
  data() {
    return {
      /**
       * @type {{
          commodityName: string;
          commodityID: string;
          ImageURL: string;
          Specifications: string;
          specificationsNum: string;
          LogisticsList: {
            nodeId: string;
            nodeName: string;
            nodeArr: string[];
					}[];
					state: boolean;
        }}
       */
      result: {},
      className: "",
      isScan: false,
      ImageURL: "",
			getImg: Function,
			titleText: "物流/仓储",
    };
  },
  components: {
		mScan: () => import("../../components/main/m-scan/m-scan.vue"),
		titleModule,
  },
  methods: {
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
    getData(data) {
      console.log(data);
      let str = data;
      try {
        this.result = str;
      } catch (e) {
        console.log(e);
      }

      console.log(this.result, typeof this.result);
      this.isScan = true;
    },
  },
  watch: {
    getImg() {
      this.result.ImageURL = "../../static/img/beibao.jpg";
    },
  },
};
</script>

<style>
@import url(~@/static/fonts/iconfont.css);

ul {
  margin: 0;
  padding: 0;
}

ul > li {
  list-style-type: none;
}

.bg {
  width: 100%;
}

.Info {
  display: flex;
}

.last {
  padding-top: 10upx;
}

.commodity {
  width: 33.333%;
  background-position: center center;
  background-size: contain;
  background-repeat: no-repeat;
}

.introduce {
  font-size: 30upx;
  color: #8f8f94;
  padding-top: 15upx;
  margin-left: 25upx;
  font-weight: bold;
  position: relative;
}

.introduce > p + p {
  margin-top: 25upx;
  color: #a6a6a6;
}

.title {
  color: #6f6f6f !important;
}

.list {
  width: 100%;
}

.list > .one {
  color: #8f8f94;
  border-top: 5upx solid #ccc;
  border-bottom: 5upx solid #ccc;
  display: flex;
  padding: 12upx 0;
}

.list > .one > view {
  box-sizing: border-box;
}

.nodeName {
  width: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44upx;
  font-weight: bold;
  color: #11bf78;
}

.address {
  width: 60%;
  color: #555;
  border-left: 0.5px dashed #afafaf;
}

.address > ul {
  margin-left: 30upx;
}

.address text {
  line-height: 50upx;
}

.state {
  align-items: center;
  justify-content: center;
  font-size: large;
  font-weight: bold;
  color: #fbfbfb;
  background-color: #ea7f7f;
}

.right {
  width: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: large;
  font-weight: bold;
  color: slategray;
}

.img {
  width: 100%;
  height: 100%;
}

.showmore {
  position: absolute;
  right: 0upx;
  top: 50upx;
  color: royalblue;
}

.node {
  font-size: 30upx;
}

.ruku {
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: white;
  background: #11bf78;
  font-weight: 900;
  height: 80upx;
  line-height: 80upx;
  font-size: larger;
}

.info {
  margin-bottom: 100upx;
}
</style>