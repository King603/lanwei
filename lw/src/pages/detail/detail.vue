<template>
  <view class="bg">
    <view class="Info">
      <view class="commodity" :style="background"></view>
      <view class="introduce">
        <p>商品名称：{{commodityName}}</p>
        <p>主要规格：{{Specifications}}</p>
        <p>规格数量：{{specificationsNum}}</p>
        <p>产品编号：{{commodityID}}</p>
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
      LogisticsList: {},
    };
  },
  computed: {
    background() {
      let imgsrc = "../../static/img/image.png";
      console.log(imgsrc);
      return {
        backgroundImage: "url(" + imgsrc + ")",
        "background-position": "center center",
        "background-size": "contain",
        "background-repeat": "no-repeat",
      };
    },
  },
};
</script>

<style>
.bg {
  width: 100%;
  background: #ccc;
}
.Info {
  display: flex;
  background: #fff;
}
.commodity {
  width: 33.333%;
}
.introduce {
  padding-left: 5px;
  font-size: 12px;
  color: #8f8f94;
}
.introduce > p + p {
  margin-top: 25upx;
}
</style>