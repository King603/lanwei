<template name="titleModule">
  <view>
    <view class="title-padding"></view>
    <!-- 没有返回的 -->
    <view class="middle-title" v-if="!showNum">
      <view class="middle-title-text">
        {{ titleText }}
      </view>
    </view>
    <!-- 有返回的 -->
    <view class="middle-title" v-else>
      <view class="back-title-lock">
        <text @click="back">{{ backText }}</text>
        <view class="back-title-text">{{ titleText }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "titleModule",
  data() {
    return {
      backText: "返回",
    };
  },
  props: {
    titleText: String,
    showNum: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    back() {
      uni.navigateBack({ delta: 1 });
    },
  },
};
</script>

<style>
.title-padding {
  height: var(--status-bar-height);
  background: #11bf78 100%;
}
.middle-title {
  background: #11bf78 100%;
	height: 88rpx;
	color: #ffffff;
}
.middle-title-text {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 32rpx;
  height: 88rpx;
}
.back-title-lock {
  display: flex;
  flex-direction: row;
  align-items: center;
  line-height: 88rpx;
	padding-left: 40rpx;
}
.back-title-text {
  margin-left: 40rpx;
  overflow: hidden;
  width: 500rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
}
</style>