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
      commodityName: "1525556",
      commodityID: "1011222233333",
      ImageURL: "../../static/img/image.png",
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
      result: null,
      isScan: true,
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