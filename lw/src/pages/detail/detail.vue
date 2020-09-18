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
				<hr>
        <view v-for="node in Logistics.nodeArr" :key="node">
          <p style="display: block;">{{node}}</p>
        </view>
				<hr>
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
@font-face {
  font-family: texticons;
  font-weight: normal;
  font-style: normal;
  src: url("https://at.alicdn.com/t/font_984210_5cs13ndgqsn.ttf")
    format("truetype");
}

.bg {
  width: 100%;
}

.Info {
  display: flex;
}

.commodity {
  width: 33.333%;
  background-position: center center;
  background-size: contain;
  background-repeat: no-repeat;
}

.introduce {
  padding-left: 5px;
  font-size: 12px;
  color: #8f8f94;
}

.introduce > p + p {
  margin-top: 25upx;
}
.navigat-arrow {
  height: 90rpx;
  width: 40rpx;
  line-height: 90rpx;
  color: #555;
  text-align: right;
  font-family: texticons;
}
.list {
  width: 100%;
}
.list > .one {
  color: #8f8f94;
	border-top:5upx solid #ccc;
	border-bottom:5upx solid #ccc;
}
.one p + p {
  margin-top: 25upx;
}
</style>