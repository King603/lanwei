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
          let { result } = res;
          /**查询获得第一个“{”的位置 */
          let index = result.indexOf("{");
          /**获取争取的JSON字符串 */
          let JSON_str = result.slice(index);
          this.$emit("my-scan", JSON.parse(JSON_str));
        },
      });
    },
  },
};
</script>

<style>
</style>