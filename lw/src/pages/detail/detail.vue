<template>
  <view class="bg">
    <view class="Info">
      <view
        class="commodity"
        :style="{
          backgroundImage:
            'url(' +
            (this.ImageURL || '../../static/img/image.png') +
            ');background-position: center center;background-size: contain;background-repeat: no-repeat;',
        }"
      ></view>
      <view class="introduce">
        <p class="title">商品名称：{{ commodityName }}</p>
        <p>主要规格：{{ Specifications }}</p>
        <p>规格数量：{{ specificationsNum }}</p>
        <p>产品编号：{{ getID }}</p>
      </view>
    </view>
    <view
      v-for="(Logistics, index) in LogisticsList"
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
</template>

<script>
export default {
  data() {
    return {
      commodityName: "1525556",
      commodityID: "1011222233333",
      ImageURL: "../../static/img/beibao.png",
      Specifications: "8596666",
      specificationsNum: "566",
      LogisticsList: [
        {
          nodeId: "0001",
          nodeName: "生产",
          nodeArr: ["厦门XX服装公司", "南京XX服装公司"],
          state: "生产中",
        },
        {
          nodeId: "0002",
          nodeName: "物流",
          nodeArr: ["XX物流有限公司厦门站", "XX物流有限公司南京站"],
          state: "运输中",
        },
        {
          nodeId: "0003",
          nodeName: "仓储",
          nodeArr: ["XX物流有限公司南京仓库", "南京XX超市仓库"],
          state: "已进仓",
        },
        {
          nodeId: "0004",
          nodeName: "零售",
          nodeArr: ["XX物流有限公司上海", "上海XX超市"],
          state: "已上架",
        },
      ],
      className: "",
      right: ">",
    };
  },
  computed: {
    getID() {
      let arr = this.commodityID.split("");
      let str = "";
      for (let i = 0, j = 1; i < arr.length; i++) {
        str = str.padStart(j++, arr[arr.length - 1 - i]);
        if (i % 6 == 5) str = str.padStart(j++, " ");
      }
      return str;
    },
  },
  methods: {
    to(index) {},
  },
};
</script>

<style scoped>
@import url("./detail.css");
</style>