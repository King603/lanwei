<template>
  <view>
    <button @click="scan" type="scan">扫码</button>
  </view>
</template>

<script>
export default {
  methods: {
    /**调起条码扫描 */
    scan() {
      uni.scanCode({
        scanType: "qrCode",
        success: (res) => {
          console.log("条码类型：" + res.scanType);
          console.log("条码内容：" + res.result);

          let str = res.result.slice(1);
console.log(str)
          res.result = this.$emit("my-scan", JSON.parse(str));
        },
      });
    },
  },
};
</script>

<style>
</style>