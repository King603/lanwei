<template>
  <view class="main">
    <titleModule :titleText="titleText" :showNum="true" />
    <view class="content">
      <table class="Info">
        <tr>
          <td>商品名称</td>
          <td class="center">{{ result.commodityInfo.commodityName }}</td>
        </tr>
        <tr>
          <td>产品编号</td>
          <td class="center" v-for="(cs, i) of result.commoditySingle" :key="i">
            {{ getID(cs.commodityID) }}
          </td>
        </tr>
        <tr>
          <td>规格数量</td>
          <td class="center">{{ result.commodityInfo.specificationsNum }}</td>
        </tr>
      </table>
      <view
        v-for="(sp, i) of result.commodityInfo.specifications"
        :key="i"
        class="radio"
      >
        <p>{{ sp.name }}</p>
        <p>{{ sp.value }}</p>
      </view>
      <button @click="buy" class="button">我要购买</button>
    </view>
  </view>
</template>

<script>
import * as config from "../../util/config";
import { getSign } from "../../util/sign";
import app from "../../util/NFC/nfcAndroid/Nfc";
import CardDataPares from "../../util/NFC/CardDataParse";
import pC from "../../api/request/detail/pC";
import titleModule from "../../components/titleModule.vue";

export default {
  onLoad(data) {
    this.result = JSON.parse(data.result);
  },
  components: {
    titleModule,
  },
  data() {
    return {
      n: 0,
      frist: true,
      num: [],
      clientType: 0,
      /**@type {{
        commodityInfo: {
          commodityName: string;
          codeEANUPC: string;
          manufacturerID: string;
          imageURL: string;
          specificationsMain: string;
          specificationsNum: string;
          specifications: {
            name: string;
            value: string;
          }[];
        }
        commoditySingle: {
          commodityID: string;
          tagID: string;
          tagCardID: string;
          tagData: string;
          codeEANUPC: string;
          businessID: string;
          state: number;
          batch_id: string;
          account: string;
          businessNode: {
            nodeID: string;
            nodeType: string;
            nodeTypeName: string;
            businessName: string;
            address: string;
            state: string;
            stateName: string;
            businessID: string;
          }[];
        }[];
      }} */
      result: {},
      clientHeight: 0,
      cartHeight: 0,
      isShow: false,
      /**
       * @type {{
          commodityName: string;
          commodityID: string;
          specificationsNum: string;
          specifications: {
            name: string;
            value: string;
          }[];
        }[]}
       */
      carts: [],
      move: 0,
      total: 0,
      num: 4,
      size: 5,
      list: [],
      IMEI: "",
      clientType: "",
      titleText: "商品信息",
    };
  },
  // 下拉刷新
  onPullDownRefresh() {},
  // 上拉加载
  onReachBottom() {},
  methods: {
    /** @param {string} id */
    getID(id) {
      let arr = id.split("");
      let str = "";
      for (let i = 0, j = 1; i < arr.length; i++) {
        str = str.padStart(j++, arr[arr.length - 1 - i]);
        if (i % 6 == 5) str = str.padStart(j++, " ");
      }
      return str;
    },
    buy() {
      uni.showModal({
        content: "您确定购买此商品吗？",
        success: (res) => {
          if (res.confirm) {
            const {
              commodityInfo: { manufacturerID },
              commoditySingle,
            } = this.result;
            const { commodityID, tagID } = commoditySingle[0];
            let ss = uni.getStorageSync("cardData");
            let strData = CardDataPares.constructorRandom(
              ss.tagID,
              ss.commodityID,
              ss.manufacturerID,
              parseInt(Math.random() * 10000)
            );
            app.writeDataAsyn(strData);
            let isWrite = uni.getStorageSync("isWrite");
            uni.removeStorageSync("isWrite");
            if (isWrite == true) {
              uni.showModal({
                content: "写卡失败请重新写卡",
                showCancel: false,
              });
              return;
            }
            pC({
              data: {
                commodityID,
                manufacturerID,
                tagID,
                tagData: commodityID + manufacturerID + tagID,
                businessID: uni.getStorageSync("userInfo").businessID,
                account: uni.getStorageSync("account"),
              },
              success: (data) => {
                uni.setStorageSync(
                  "respond",
                  JSON.stringify({ tagID, commodityID, manufacturerID })
                );
                uni.setStorageSync("show", true);
                uni.showToast({
                  title: "购买成功",
                  icon: "none",
                  success() {
                    setTimeout(
                      () => uni.switchTab({ url: "../detail/detail" }),
                      1000
                    );
                  },
                });
              },
              fail(msg) {
                uni.showToast({
                  title: "购买失败",
                  icon: "none",
                });
                console.error(msg);
              },
            });
          }
        },
      });
    },
  },
};
</script>

<style scoped>
.main {
  width: 100%;
  padding: 10upx 10upx 0 10upx;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f0f0f0;
}
.Info {
  width: 100%;
}
.Info tr {
  display: flex;
}
.Info tr > td {
  width: 25%;
  padding: 5upx 10upx;
  border-bottom: 0.5px solid #a5a5a5;
}
.Info tr > td:last-child {
  width: 75%;
}

.center {
  text-align: center;
}

.radio {
  display: flex;
  background-color: #fff;
}
.radio > p {
  display: inline-block;
  width: 50%;
}
.radio.active {
  border: 1px solid #000;
}

.button {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  color: #fff;
  background-color: #11bf78;
}
</style>