<template>
	<view>
		<titleModule :titleText="titleText" :showNum="true" />
  <view class="center">
    <span v-if="results.length == 0">暂无商品</span>
    <view
      v-for="(data, i) of results"
      :key="i"
      class="commodity-list"
      @click="search(data)"
    >
      <view class="commodity-info">
        <table
          :border="table.border + 'px'"
          :bordercolor="table.bordercolor"
          :bgcolor="table.bgcolor"
        >
          <caption class="caption">
            {{
              data.commodityInfo.commodityName
            }}
          </caption>
          <tr>
            <td :rowspan="5" class="commodity-img">
              <img :src="data.commodityInfo.imageURL" alt="" />
            </td>
            <td>标签芯片ID</td>
            <td v-if="data.commoditySingle.length != 0">
              <p v-for="(cs, index) of data.commoditySingle" :key="index">
                {{ cs.tagCardID }}
              </p>
            </td>
            <td v-else>无</td>
          </tr>
          <tr>
            <td>EAN/UPC码</td>
            <td v-if="data.commoditySingle.length != 0">
              <p v-for="(cs, index) of data.commoditySingle" :key="index">
                {{ cs.codeEANUPC }}
              </p>
            </td>
            <td v-else>无</td>
          </tr>
          <tr>
            <td>批次号</td>
            <td v-if="data.commoditySingle.length != 0">
              <p v-for="(cs, index) of data.commoditySingle" :key="index">
                {{ cs.batch_id }}
              </p>
            </td>
            <td v-else>无</td>
          </tr>
          <tr>
            <td>主要规格</td>
            <td>{{ data.commodityInfo.specificationsMain || "无" }}</td>
          </tr>
          <tr>
            <td>规格数量</td>
            <td>{{ data.commodityInfo.specificationsNum }}</td>
          </tr>
        </table>
      </view>
    </view>
  </view>
	</view>
</template>

<script>
import * as config from "../../util/config";
import getNetworkType from "../../api/getNetworkType";
import aGQ from "../../api/request/detail/aGQ";
import pGIQ from "../../api/request/detail/pGIQ";
import queryCB from "../../api/request/detail/queryCB";
import titleModule from "../../components/titleModule.vue";

export default {
  data() {
    return {
      /**@type {{
        commodityInfo: {
          info_id: string;
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
      }[]} */
      results: [],
      userInfo: uni.getStorageSync("userInfo"),
      account: uni.getStorageSync("account"),
      table: {
        border: 1,
        bordercolor: "5e5e5e",
        bgcolor: "fefefe",
        titleArr: ["标签芯片ID", "EAN/UPC码", "主要规格", "规格数量"],
      },
      list: [],
			size: 4,
			titleText: "我的商品",
    };
	},
	components: {
    titleModule,
  },
  mounted() {
    this.infoQuery(() => {
      this.goodsQuery((batch_id, cs) =>
        this.batchQuery(batch_id, (batch) =>
          this.results.forEach(
            (data) =>
              data.commodityInfo.info_id == batch.info_id &&
              data.commoditySingle.push(cs)
          )
        )
      );
      console.log(this.results);
    });
  },
  methods: {
    /**@param {string} id */
    arrange(id) {
      let strArr = id.split("");
      let str = "";
      for (let i = 0; i < strArr.length; i++) {
        if ((strArr.length - i) % 6 == 0 && i != 0) str += " ";
        str += strArr[i];
      }
      return str;
    },
    /**
     * @param {Object} data 
     * @param {Object} data.commodityInfo
     * @param {string} data.commodityInfo.commodityName
     * @param {string} data.commodityInfo.codeEANUPC
     * @param {string} data.commodityInfo.manufacturerID
     * @param {string} data.commodityInfo.imageURL
     * @param {string} data.commodityInfo.specificationsMain
     * @param {string} data.commodityInfo.specificationsNum
     * @param {{name: string; value: string;}[]} data.commodityInfo.specifications
     * @param {{
         commodityID: string;
         tagID: string;
         tagCardID: string;
         tagData: string;
         codeEANUPC: string;
         businessID: string;
         state: number;
         batch_id: string;
         account: string;
         businessNode: {nodeID: string; nodeType: string; nodeTypeName: string; businessName: string; address: string; state: string; stateName: string; businessID: string;}[];
       }[]} data.commoditySingle
     * */
    search(data) {
      showToast(
        `这是商品信息查询功能，您将要查询的是“${data.commodityInfo.commodityName}”的相关信息`
      );
    },
    /**
     * 关联商品查询获取批次ID
     * @param {(batch_id: string; commoditySingle: {
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
      }) => void} getInfoId 获取批次ID的回调函数
     */
    goodsQuery(getInfoId) {
      aGQ({
        data: {
          businessID: this.userInfo.businessID,
          account: this.account,
        },
        success: (commoditySingle) =>
          commoditySingle.forEach((cs) => getInfoId(cs.batch_id, cs)),
        fail(msg) {
          uni.showToast({ title: msg, icon: "none" });
        },
      });
    },
    /**
     * 批次查询
     * @param {string} batch_id 商品的批次ID
     * @param {(batch: {batch_id: string; codeEANUPC: string; manufacturerID: string; total: number; totaled: number; info_id: string;}) => void} success
     */
    batchQuery(batch_id, success) {
      queryCB({
        data: { batch_id, account: this.account },
        success: (res) => success(res),
        fail(msg) {
          uni.showToast({ title: msg, icon: "none" });
        },
      });
    },
    /**
     * 已发布商品信息查询
     * @param {() => void} success
     */
    infoQuery(success) {
      pGIQ({
        data: {
          businessID: this.userInfo.businessID,
          account: this.account,
        },
        success: (data) => {
          data.forEach((commodityInfo) => {
            this.results.push({
              commodityInfo,
              commoditySingle: [],
            });
          });
          success();
        },
        fail(msg) {
          uni.showToast({ title: msg, icon: "none" });
        },
      });
    },
  },
  onLoad(options) {
    setTimeout(() => {
      console.log("start pulldown");
    }, 1000);
    //uni.startPullDownRefresh();
    uni.startPullDownRefresh({
      success(res) {
        console.log(res); //success 返回参数说明
      },
    }); //这里表示当进入页面的时候就开始执行下拉刷新动画
  },
  onPullDownRefresh() {
    //监听下拉刷新动作的执行方法，每次手动下拉刷新都会执行一次
    console.log("refresh");
    setTimeout(() => {
      uni.stopPullDownRefresh(); //停止下拉刷新动画
    }, 1000);
  },
  onReachBottom() {
    console.log("页面到底了");
  },
};

function showToast(title) {
  uni.showToast({
    title,
    icon: "none",
  });
}
</script>

<style>
page {
  display: flex;
  background-color: #e5e5e5;
}

.center {
  flex-direction: column;
  width: 100%;
  font-size: 25upx;
}

.commodity-list {
  margin: 20upx 5upx;
  border-radius: 5px;
  background: #fff;
  width: 100%;
  box-sizing: border-box;
}
.commodity-list:after {
  content: "";
  display: block;
  clear: both;
}

.commodity-list > view {
  float: left;
}

.commodity-img {
  width: 260upx;
  height: 210upx;
  padding: 0 30upx;
  box-sizing: border-box;
}
.commodity-img > img {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.commodity-info {
  width: 100%;
}
.commodity-info table {
  width: 100%;
}
.caption {
  /* #ifdef MP-WEIXIN */
  text-align: center;
  /* #endif */
}
.commodity-info tr {
  /* #ifdef MP-WEIXIN */
  width: 100%;
  /* #endif */
}
.commodity-info tr > td.commodity-img {
  /* #ifdef MP-WEIXIN */
  width: 50%;
  float: left;
  /* #endif */
}
.commodity-info tr > td {
  /* #ifdef MP-WEIXIN */
  width: 25%;
  float: left;
  /* #endif */
}
</style>