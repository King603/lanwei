<template>
  <view>
    <button @click="scan" type="scan">扫码</button>
  </view>
</template>

<script>
import getNetworkType from "../../../api/getNetworkType";
import net_off from "../../../api/net_off";
export default {
  methods: {
    /**调起条码扫描 */
    scan() {
      let tag = false;
      getNetworkType({
        success(type) {
          if (type == "none") {
            net_off("扫描");
            tag = true;
          }
        },
      }).then(() => {
        if (tag) return;
        uni.scanCode({
          scanType: ["qrCode"],
          success: (res) => {
            let { result } = res;
            /**查询获得第一个“{”的位置 */
            let index = result.indexOf("{");
            /**获取争取的JSON字符串 */
            let JSON_str = result.slice(index);
            this.$emit("my-scan", JSON.parse(JSON_str));
          },
        });
      });
    },
  },
};
</script>

<style>
</style>