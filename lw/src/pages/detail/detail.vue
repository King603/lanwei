<template>
  <view class="bg">
    <view class="Info">
      <view
        class="commodity"
        :style="{backgroundImage: 'url(' + (this.ImageURL || '../../static/img/image.png') + ');background-position: center center;background-size: contain;background-repeat: no-repeat;'}"
      ></view>
      <view class="introduce">
        <p>商品名称：{{commodityName}}</p>
        <p>主要规格：{{Specifications}}</p>
        <p>规格数量：{{specificationsNum}}</p>
        <p>产品编号：{{commodityID}}</p>
      </view>
    </view>
    <view v-for="(Logistics,index) in LogisticsList" :key="index" class="list">
      <view class="one">
        <view>{{Logistics.nodeName}}</view>
        <hr />
        <view v-for="node in Logistics.nodeArr" :key="node">
          <p style="display: block;">{{node}}</p>
        </view>
        <hr />
        <view>{{Logistics.state}}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      commodityName: "",
      commodityID: "",
      ImageURL: "",
      Specifications: "",
      specificationsNum: "",
      LogisticsList: [],
    };
  },
};
</script>

<style scoped>
@import "./detail.css";
</style>