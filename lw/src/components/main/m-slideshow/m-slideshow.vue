<template>
  <view>
    <swiper
      class="swiperItem"
      :indicator-dots="dots"
      :indicator-color="other"
      :indicator-active-color="active"
      autoplay="true"
      :interval="interval"
      :duration="duration"
      :circular="circular"
    >
      <block v-for="(img, index) of list" :key="index">
        <swiper-item>
          <img class="swiperItem" :src="img.imageURL" :alt="img.name" />
        </swiper-item>
      </block>
    </swiper>
  </view>
</template>

<script>
export default {
  props: {
    /**@type {{name: string; imageURL: string;}} */
    list: Array,
    interval: Number,
    duration: Number,
    circular: Boolean,
    active: String,
    other: String,
    dots: Boolean,
  },
};
</script>

<style scoped>
.swiperItem {
  width: 100%;
  height: 500rpx;
}
</style>