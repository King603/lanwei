<template>
  <view class="bg">
    <!-- 扫码 -->
    <m-scan @my-scan="getData"></m-scan>
    <view v-show="isScan">
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
          <p>主要规格：{{ result.Specifications }}</p>
          <p>规格数量：{{ result.specificationsNum }}</p>
          <p>产品编号：{{ isScan && getID(result.commodityID) }}</p>
        </view>
      </view>
      <view
        v-for="(Logistics, index) in result.LogisticsList"
        :key="index"
        class="list"
        @click="to(index)"
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
                <text>{{ node }}</text>
              </li>
            </ul>
          </view>
          <view class="state">{{ Logistics.state }}</view>
          <view class="right">{{ right }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import mScan from "../../components/main/m-scan/m-scan.vue";
export default {
  data() {
    return {
      result: {
        // commodityName: "1525556",
        // commodityID: "1011222233333",
        // ImageURL: "../../static/img/image.png",
        // Specifications: "8596666",
        // specificationsNum: "566",
        // LogisticsList: [
        //   {
        //     nodeId: "0001",
        //     nodeName: "生产",
        //     nodeArr: ["厦门XX服装公司", "南京XX服装公司"],
        //     state: "生产中",
        //   },
        //   {
        //     nodeId: "0002",
        //     nodeName: "物流",
        //     nodeArr: ["XX物流有限公司厦门站", "XX物流有限公司南京站"],
        //     state: "运输中",
        //   },
        //   {
        //     nodeId: "0003",
        //     nodeName: "仓储",
        //     nodeArr: ["XX物流有限公司南京仓库", "南京XX超市仓库"],
        //     state: "已进仓",
        //   },
        //   {
        //     nodeId: "0004",
        //     nodeName: "零售",
        //     nodeArr: ["XX物流有限公司上海", "上海XX超市"],
        //     state: "已上架",
        //   },
        // ],
      },
      className: "",
      right: ">",
      isScan: false,
    };
  },
  components: {
    mScan,
  },
  computed: {},
  methods: {
    to(index) {},
    // getImg() {
    //   setTimeout(
    //     () => (this.result.ImageURL = "../../static/img/beibao.jpg"),
    //     5000
    //   );
    // },
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
    getID(id) {
      let arr = id.split("");
      let str = "";
      for (let i = 0, j = 1; i < arr.length; i++) {
        str = str.padStart(j++, arr[arr.length - 1 - i]);
        if (i % 6 == 5) str = str.padStart(j++, " ");
      }
      return str;
    },
  },
  onReady() {
    // this.getImg();
  },
};
</script>

<style scoped>
@import url("./detail.css");
</style>