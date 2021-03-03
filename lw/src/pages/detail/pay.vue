<template>
  <view class="main">
		<titleModule :titleText="titleText" :showNum="true" />
    <view class="successful" v-show="isPay">
      <view class="iconfont icon-chenggong">支付成功</view>
      <view>地址</view>
    </view>
    <view
      v-for="good of goods"
      :key="good"
      :class="'goods' + (isPay ? ' padding' : '')"
    >
      <view>
        <img src="../../static/img/beibao.jpg" alt="" v-if="!isPay" />
        <view :style="{ width: isPay ? '100%' : '50%' }">
          <view :class="isPay ? 'Pay' : 'list'">
            <view>{{ name }}</view>
            <view>￥{{ toFix(good.value) }}</view>
            <view>{{ isPay ? "购买数量：" : "" }}{{ good.num }}</view>
          </view>
          <view class="id color" v-if="!isPay">
            商品编号&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ getID(id) }}
          </view>
          <view class="color" v-if="!isPay">{{ good.name }}</view>
          <view class="state" v-if="!isPay">未出售</view>
        </view>
      </view>
    </view>
    <view class="figure">
      合计：&nbsp;&nbsp;&nbsp;<span>￥{{ toFix(figure) }}</span>
    </view>
    <!-- 支付按钮 -->
    <view class="iconfont icon-zhifuhuodong pay" @click="pay">
      {{ !isPay ? "确认" : "完成" }}
    </view>
  </view>
</template>

<script>
import { result } from "../../util/config";
import titleModule from "../../components/titleModule.vue";

export default {
  data() {
    return {
      goods: [],
      id: "",
      name: "",
      isPay: false,
      clientHeight: 0,
      pay_height: 0,
			figure: 0,
			titleText: "支付界面",
    };
  },
  onLoad(data) {
    let obj = JSON.parse(data.goods);
    console.log(obj);
    this.goods = obj.goods;
    console.log(this.goods);
    this.id = data.id;
    this.name = obj.name;
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
    toFix(num) {
      return parseFloat(num).toFixed(2);
    },
    pay() {
      if (this.isPay) {
        uni.reLaunch({
          url: "../../main/main",
        });
      } else {
        this.isPay = true;
      }
    },
  },
  computed: {
    getFigure() {
      let sum = 0;
      for (let i = 0; i < this.goods.length; i++) {
        sum += this.goods[i].value * this.goods[i].num;
      }
      this.figure = sum;
    },
  },
};
</script>

<style scoped>
@import url(~@/static/fonts/iconfont.css);
.iconfont {
  font-size: 50upx;
}
.main {
  width: 100%;
  background: #e5e5e5;
}
.goods {
  background: #fff;
  margin-bottom: 10upx;
  font-size: 24upx;
}
.goods.padding {
  padding: 20upx;
}
.goods > view {
  display: flex;
  /* 相对定位 */
  position: relative;
}
.goods img {
  width: 30%;
  height: 150upx;
  margin: 20upx;
}
.goods > view > view > view {
  padding: 10upx 0upx;
}
.goods .state {
  /* 绝对定位 */
  position: absolute;
  background-color: #ea7f7f;
  color: #fff;
  padding: 20upx;
  right: 0;
  top: 0;
}
.goods .list {
  display: flex;
}
.goods .list > view:first-child {
  width: 50%;
  color: #505050;
}
.goods .list > view:not(:first-child) {
  width: 25%;
  color: #ff703a;
}
.goods .list > view:last-child {
  text-align: center;
}
.Pay {
  padding: 20upx;
  width: 100%;
}
.goods .Pay {
  display: flex;
}
.goods .Pay > view:first-child {
  width: 50%;
  color: #505050;
}
.goods .Pay > view:not(:first-child) {
  width: 25%;
  color: #ff703a;
}
.goods .Pay > view:last-child {
  text-align: center;
}
.id {
  border-bottom: 2upx solid #999;
}
.color {
  color: #a6a6a6;
}
.pay {
  position: fixed;
  width: 100%;
  height: 100upx;
  background-color: #43cf7c;
  color: #fff;
  font-weight: bold;
  text-align: center;
  line-height: 100upx;
  bottom: 0;
}
.figure {
  padding-left: 250upx;
  font-size: 50upx;
  color: #505050;
}
.figure > span {
  color: #ff703a;
}
.successful {
  width: 100%;
  height: 200upx;
  background-color: #fff;
  margin-bottom: 50upx;
}
.successful > view {
  width: 100%;
  text-align: center;
  font-weight: bolder;
}
.successful > view:first-child {
  padding-top: 55upx;
  color: #43cf7c;
}
.successful > view:last-child {
  color: blue;
}
</style>