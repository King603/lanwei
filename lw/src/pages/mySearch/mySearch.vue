<template>
  <view>
    <view>{{mySearch}}</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      mySearch: "",
    };
  },
  onLoad(option) {
    console.log(option);
    this.mySearch = option.search;
  },
};
</script>

<style>
</style>