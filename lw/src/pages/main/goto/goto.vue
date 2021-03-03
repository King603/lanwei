<template>
  <view class="main">
		<titleModule :titleText="titleText" />
    <view class="main">页面加载中，请稍后</view>
    <web-view :src="src"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
			src: "",
			titleText: "页面加载中，请稍后",
    };
  },
  onLoad(data) {
    this.src = data.src;
  },
};
</script>

<style scoped>
.main{
  width: 100%;
}
.main > view{
  text-align: center;
}
</style>