<template>
  <view style="width: 100%">
		<titleModule :titleText="titleText" :showNum="true" />
    <table class="main">
      <tr>
        <td style="width: 100%">
          <img :src="nodeInfo.imageURL" alt="图片URL" style="width: 100%" />
        </td>
      </tr>
      <tr>
        <td class="border">节点名称</td>
        <td class="border">{{ nodeInfo.nodeName }}</td>
      </tr>
      <tr>
        <td class="border">成立时间</td>
        <td class="border">{{ nodeInfo.establishTime }}</td>
      </tr>
      <tr>
        <td class="border">节点地址</td>
        <td class="border">
          <table class="address">
            <tr v-for="node of nodeInfo.nodeArr" :key="node">
              <td>{{ node }}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td class="border">证书数量</td>
        <td class="border">{{ nodeInfo.certificateNum }}</td>
      </tr>
      <tr>
        <td style="margin: 0 auto">
          <m-slideshow
            :list="nodeInfo.certificate"
            :interval="interval"
            :duration="duration"
            :circular="circular"
            :active="active"
          ></m-slideshow>
        </td>
      </tr>
    </table>
  </view>
</template>

<script>
import * as config from "../../../util/config";
import mSlideshow from "../../../components/main/m-slideshow/m-slideshow.vue";
import nodeReq from "../../../api/request/detail/nodeReq";
import titleModule from "../../../components/titleModule.vue";

export default {
  data() {
    return {
      id: "",
      account: "",
      /**
       * @type {{
          nodeId: string;
          nodeName: string;
          nodeArr: string[];
          establishTime: string;
          imageURL: string;
          certificateNum: string;
          certificate: {
            name: string;
            imageURL: string;
          }[];
        }}
       */
      nodeInfo: null,
      certificateIndex: 0,
      /**自动切换时间间隔 */
      interval: 5000,
      /**轮播间隔长度 */
      duration: 1000,
      /**是否采用衔接滑动 */
      circular: true,
      active: "blue",
      titleText: "节点查询",
    };
  },
  onLoad(data) {
    let account = uni.getStorageSync("account");
    console.log(account);
    if (account == undefined) this.guideToLogin();
    else {
      this.account = account;
      this.id = data.id;
      this.show();
    }
  },
  methods: {
    /** 登录设置 */
    guideToLogin() {
      uni.showToast({
        title: "您未登录，需要登录后才能继续",
        icon: "none",
        duration: 10000,
      });
      setTimeout(() => {
        uni.navigateTo({
          url: "../../user/login/login",
        });
      }, 2000);
    },
    /**显示节点信息 */
    show() {
      uni.showNavigationBarLoading();
      nodeReq({
        data: {
          account: this.account,
          nodeID: this.id,
        },
        success: (nodeInfo) => {
          uni.showModal({
            content: JSON.stringify(nodeInfo),
          });
          this.nodeInfo = nodeInfo;
        },
        fail(msg) {
          uni.showToast({ title: msg, icon: "none" });
        },
        complete() {
          uni.hideNavigationBarLoading();
        },
      });
    },
  },
  components: {
		mSlideshow,
		titleModule,
  },
};
</script>

<style scoped>
.main {
  width: 100%;
}
.main tr {
  display: flex;
}
td {
  width: 50%;
}
td:last-child {
  width: 100%;
}
.address tr > td {
  width: 100%;
}
.slideshow {
  margin-top: 10px;
}
/* .border {
  border: 1px solid #aaa;
} */
tr > .border {
  padding-left: 10rpx;
}
</style>