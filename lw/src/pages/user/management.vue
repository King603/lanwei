<template>
  <view>
    <titleModule :titleText="titleText" :showNum="true" />
    <view class="center">
      <view></view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  computed: {
    ...mapState(["hasLogin", "forcedLogin", "userName"]),
  },
  methods: {
    ...mapMutations(["logout"]),
  },
  data() {
    return {
      managementTypeList: ["账号信息管理"],
      titleText: "账号管理",
    };
  },
};
</script>

<style>
page,
.center,
center view {
  display: flex;
}

page {
  background-color: #f8f8f8;
}

button {
  width: 100%;
}

.center {
  flex-direction: column;
}
</style>