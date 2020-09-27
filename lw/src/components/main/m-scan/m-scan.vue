<template>
  <view>
    <button @click="scan" type="scan">扫码</button>
  </view>
</template>

<script>
import { config } from "../../../util/config";
export default {
  props: {
    result: {},
  },
  methods: {
    /**调起条码扫描 */
    scan() {
      uni.scanCode({
        scanType: "barCode",
        success: (res) => {
          this.result = res.result;
          console.log("条码类型：" + res.scanType);
          console.log("条码内容：" + res.result);
        },
      });
    },
  },
};
</script>

<style>

</style>