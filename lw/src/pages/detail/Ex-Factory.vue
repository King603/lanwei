<template>
  <view class="main">
    <titleModule titleText="发布商品" :showNum="true" />
    <view class="content">
      <view v-if="isWriteCard">
        <table border="0">
          <!-- 商品 -->
          <tr class="bg goods">
            <td class="iconfont icon-shangpin"><br />商品</td>
            <td>
              <table class="info">
                <tr>
                  <td>EAN/UPC：</td>
                  <td>
                    <input
                      type="number"
                      placeholder="请输入"
                      v-model="info.codeEANUPC"
                      :maxlength="13"
                      :disabled="off || writeCardStatus == 1"
                      @input="onInput"
                    />
                  </td>
                </tr>
                <tr>
                  <td>商品名称：</td>
                  <td>
                    <input
                      type="text"
                      placeholder="请输入"
                      v-model="info.commodityName"
                      :maxlength="commodityNameMaxLength"
                      :disabled="
                        off || writeCardStatus == 1 || writeCardStatus == 2
                      "
                    />
                  </td>
                </tr>

                <tr>
                  <td>主要规格</td>
                  <td v-if="specificationsMain">{{ specificationsMain }}</td>
                  <td v-else>点击规格标签可添加</td>
                </tr>
                <tr>
                  <td>当前状态：</td>
                  <td>
                    <!-- @change用于获取下拉框改变的值，:range用于循环遍历array数组将数组内容循环 -->
                    <picker @change="bindPickerChange" :range="states">
                      <!-- 循环array数组index为索引 -->
                      <label class="">{{ states[index] }}</label>
                    </picker>
                  </td>
                </tr>
                <tr>
                  <td>商品数量：</td>
                  <td>
                    <input
                      type="number"
                      placeholder="请输入"
                      v-model="num"
                      @input="toParseInt"
                      :disabled="off || writeCardStatus == 1"
                    />
                  </td>
                </tr>
                <tr>
                  <td>价格：</td>
                  <td>
                    <input
                      :maxlength="maxLength"
                      type="number"
                      placeholder="金额(元)"
                      v-model="info.price"
                      @input="checkPrice"
                    />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- 图片 -->
          <tr class="bg picture">
            <td class="iconfont icon-camera" @click="camera">
              点击<br />获取<br />图片
            </td>
            <td @click="imgs.length < count && camera()">
              <view>
                <img
                  v-for="(img, i) of imgs"
                  :key="i"
                  :src="img.path"
                  @click="previewImage(img.path)"
                />
              </view>
              <view @click.stop="removeImage" v-if="imgs.length != 0">✖</view>
              <view>点击图片查看原图，最多可存{{ count }}张图片</view>
            </td>
          </tr>
          <!-- 规格 -->
          <tr
            class="bg specifications"
            v-for="(sp, index) of specifications"
            :key="index"
            :class="sp.isMain ? 'red-border' : 'white-border'"
          >
            <td class="iconfont icon-guige" @click="setMain(index)">
              <br />规格<br />{{ index + 1 }}
            </td>
            <td>
              <view>规格名称：</view>
              <span class="delete" @click="remove(index)">×</span>
              <view>
                <input type="text" placeholder="请输入" v-model="sp.name" />
              </view>
              <view class="other">规格数据:</view>
              <view class="other">
                <textarea placeholder="请输入" v-model="sp.value"></textarea>
              </view>
            </td>
          </tr>
        </table>
        <view class="button add" @click="add">+添加条目</view>
        <view class="iconfont icon-chuchang button" @click="writeCard">
          发布商品
        </view>
      </view>
      <view v-else>
        <table class="commodity-list">
          <caption>
            该账户账户已发布的批次
          </caption>
          <tr v-for="(data, i) of showList" :key="i">
            <td class="commodity-info">
              <table border="1" bordercolor="5e5e5e" bgcolor="fefefe">
                <tr>
                  <td :colspan="2">批次号</td>
                  <td :colspan="2">{{ data.batch_id }}</td>
                  <td :rowspan="3">
                    <button class="batch_button" @click="setBatch(data)">
                      添加该批次的商品
                    </button>
                  </td>
                </tr>
                <tr>
                  <td :colspan="2">EAN/UPC码</td>
                  <td :colspan="2">{{ data.codeEANUPC }}</td>
                </tr>
                <tr>
                  <td>该批次的商品总数</td>
                  <td>{{ data.total }}</td>
                  <td>该批次已发布商品数量</td>
                  <td>{{ data.totaled }}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <button class="batch_button" @click="addBatch">添加新批次</button>
      </view>
    </view>
  </view>
</template>

<script>
import * as config from "../../util/config";
import CardDataParse from "../../util/NFC/CardDataParse.js";
import app from "../../util/NFC/nfcAndroid/Nfc";
import weixin from "../../util/NFC/nfcWeiXin/Nfc";
import setPicturePath from "../../api/setPicturePath";
import onlineCIQ from "../../api/request/detail/onlineCIQ";
import pBQ from "../../api/request/detail/pBQ";
import updateCS from "../../api/request/detail/updateCS";
import updateCI from "../../api/request/detail/updateCI";
import uploadCS from "../../api/request/detail/uploadCS";
import uploadCI from "../../api/request/detail/uploadCI";
import uploadCB from "../../api/request/detail/uploadCB";
import getCommodityID from "../../api/request/detail/getCommodityID";
import upload from "../../api/request/detail/upload";
import queryCB from "../../api/request/detail/queryCB";
import queryCByID from "../../api/request/detail/queryCByID";
import queryCByInfoID from "../../api/request/detail/queryCByInfoID";
import titleModule from "../../components/titleModule.vue";

export default {
  components: {
    titleModule,
  },
  data() {
    return {
      sourceType: [
        ["album"], // 相册选图
        ["camera"], // 使用相机
      ],
      /**@type {{path: string; size: number;}[]} */
      imgs: [],
      info: {
        commodityName: "",
        codeEANUPC: "",
        price: "",
      },
      specificationsMain: "",
      specifications: [{ name: "", value: "", isMain: false }],
      count: 1,
      account: "",
      tagID: "",
      commodityID: "",
      manufacturerID: "",
      tagCardID: "",
      commodityNameMaxLength: 48,
      /**暂定无穷大 */
      maxLength: 12,
      /**
       * 写卡状态
       * - 0：新增批次 （默认状态）
       * - 1：单品更新
       * - 2：批次写卡
       */
      writeCardStatus: 0,
      states: ["--请选择--", "正常流通", "暂停流通", "删除"],
      index: 0,
      state: "",
      tagData: "",
      off: false,
      /**
       * 商品数量
       * @type {number}
       */
      num: null,
      /**@type {{batch_id: number; codeEANUPC: string; manufacturerID: string; total: number; totaled: number; info_id: number;}[]} */
      list: [],
      isWriteCard: true,
      /**@type {{
        batch_id: string;
        codeEANUPC: string;
        manufacturerID: string;
        total: number;
        totaled: number;
        info_id: string;
      }[]} */
      showList: [],
      batch_id: "",
      info_id: "",
    };
  },
  methods: {
    camera() {
      if (this.imgs.length >= this.count) {
        showToast(`图片最多显示${this.count}张`);
        return;
      }
      uni.chooseImage({
        count: this.count - this.imgs.length,
        sizeType: ["compressed"],
        success: (res) =>
          this.imgs.length < this.count && this.imgs.push(...res.tempFiles),
        fail(res) {
          console.error(res);
        },
      });
    },
    removeImage() {
      this.imgs = [];
    },
    previewImage(src) {
      uni.previewImage({
        urls: [src],
      });
    },
    add() {
      if (this.decide()) return;
      this.specificationInit();
    },
    specificationInit() {
      this.specifications.push({ name: "", value: "", isMain: false });
    },
    decide() {
      if (!this.info.commodityName) {
        showToast("请输入商品名称");
        return true;
      }
      if (this.info.codeEANUPC.length !== 13) {
        showToast("EAN/UPC码输入有误，请重新输入！！");
        this.info.codeEANUPC = "";
        return true;
      }
      if (this.index == 0) {
        showToast("未选择商品当前状态，请选择！！");
        return true;
      }
      if (this.num == 0 || this.num == null) {
        showToast("请输入商品数量");
        return true;
      }
      if (this.info.price == "") {
        showToast("请输入商品价格");
        return true;
      }
      if (this.imgs.length <= 0) {
        showToast("未获取商品图片，请添加图片");
        return true;
      }
      if (!this.specifications[this.specifications.length - 1].name) {
        showToast(`请输入规格${this.specifications.length}的规格名称`);
        return true;
      }
      if (!this.specifications[this.specifications.length - 1].value) {
        showToast(`请输入规格${this.specifications.length}的规格信息`);
        return true;
      }
      return false;
    },
    /**
     * 判断写卡是否成功
     * @param {string} strData 写入数据
     */
    isWriteSuccess(strData) {
      app.writeDataAsyn(strData);
      let isWrite = uni.getStorageSync("isWrite");
      uni.removeStorageSync("isWrite");
      if (isWrite == true) {
        uni.showModal({
          content: "写卡失败请重新写卡",
          showCancel: false,
        });
        return true;
      }
      return false;
    },
    writeCard() {
      if (this.decide()) return;
      // #ifdef APP-PLUS
      switch (this.writeCardStatus) {
        // 新增批次
        case 0:
          this.addBatch_id();
          break;
        // 单品更新
        case 1:
          this.update();
          break;
        // 批次写卡
        case 2:
          this.batchWrite();
          break;
      }
      // #endif
      // #ifdef MP-WEIXIN
      showToast("微信端写卡功能不全暂无此功能");
      // #endif
    },
    /******************** 添加商品批次 ********************/
    /**添加商品批次 */
    addBatch_id() {
      uni.setStorageSync("writeCard", 1);
      app.readDataAsyn();
      let data = uni.getStorageSync("writeCardInfo");
      uni.setStorageSync("writeCardInfo", null);
      if (data.IntentCode == 1001) {
        try {
          let respond = JSON.parse(data.respond);
          /**@type {string} */
          let info = respond.CardInfo;
          if (info != "") {
            let key = "CardId:";
            if (info.indexOf(key) == -1) {
              showToast("数据有误");
              return;
            }
            /**获取CardID数值的起始位置 */
            let CardID_start = info.indexOf(key) + key.length;
            /**获取CardID数值的结束位置 */
            let CardID_end = info.indexOf(",", CardID_start);
            let strTagCardID = info.substring(CardID_start, CardID_end);
            /**标签ID */
            let strTagID = strTagCardID;
            while (strTagID.length < 25)
              strTagID += parseInt(Math.random() * 16).toString(16);
            if (this.info.codeEANUPC.length !== 13) {
              showToast("EAN/UPC码输入有误，请重新输入！！");
              this.info.codeEANUPC = "";
              return;
            }
            if (this.info.commodityName == "") {
              showToast("商品名称为空请填写");
              return;
            }

            this.getCID({
              tagCardID: strTagCardID,
              codeEANUPC: this.info.codeEANUPC,
              commodityName: this.info.commodityName,
              account: this.account,
            }).then(() => {
              /**@type {string}: 商品ID */
              let strCommodityID = this.commodityID;
              /**@type {string}: 厂商ID */
              let strManufacturerID = uni.getStorageSync("userInfo").businessID;

              let strData = CardDataParse.constructor(
                strTagID,
                strCommodityID,
                strManufacturerID
              );

              if (this.isWriteSuccess(strData)) return;

              this.uploadImage((imgUrl) =>
                this.addCI(imageURL, {
                  tagID: strTagID,
                  commodityID: strCommodityID,
                  manufacturerID: strManufacturerID,
                  tagCardID: strTagCardID,
                })
              );
            });
          } else showToast("无CardData数据");
        } catch (e) {
          console.error(e);
        }
      }
    },
    /**
     * 添加商品
     * @param {strinng} imageURL 图片地址
     * @param {Object} CardData 卡数据
     * @param {string} CardData.tagID
     * @param {string} CardData.commodityID
     * @param {string} CardData.manufacturerID
     * @param {string} CardData.tagCardID
     */
    addCI(imageURL, CardData) {
      uploadCI({
        data: {
          commodityInfo: {
            manufacturerID: CardData.manufacturerID,
            codeEANUPC: this.info.codeEANUPC,
            commodityName: this.info.commodityName,
            price: this.info.price,
            imageURL,
            specificationsMain: this.specificationsMain,
            specificationsNum: this.specifications.length,
            specifications: this.specifications,
          },
          account: this.account,
        },
        success: (info_id) => this.addCB(info_id, CardData),
      });
    },
    /**
     * 添加批次
     * @param {string} info_id 信息ID
     * @param {Object} CardData 卡数据
     * @param {string} CardData.tagID
     * @param {string} CardData.commodityID
     * @param {string} CardData.manufacturerID
     * @param {string} CardData.tagCardID
     */
    addCB(info_id, CardData) {
      uploadCB({
        data: {
          info_id,
          total: this.num,
          codeEANUPC: this.info.codeEANUPC,
          manufacturerID: CardData.manufacturerID,
        },
        success: (batch_id) => this.addCS(batch_id, CardData),
      });
    },
    /**
     * 添加商品
     * @param {string} batch_id 批次ID
     * @param {Object} CardData 卡数据
     * @param {string} CardData.tagID
     * @param {string} CardData.commodityID
     * @param {string} CardData.manufacturerID
     * @param {string} CardData.tagCardID
     */
    addCS(batch_id, { tagID, commodityID, manufacturerID, tagCardID }) {
      uploadCS({
        data: {
          tagID,
          commodityID,
          manufacturerID,
          tagCardID,
          tagData: tagID + commodityID + manufacturerID,
          batch_id,
          codeEANUPC: this.info.codeEANUPC,
          state: this.index - 1,
          account: this.account,
        },
        success() {
          uni.switchTab({ url: "../detail/detail" });
        },
        fail(msg) {
          showToast(msg);
        },
      });
    },
    /********************** end **********************/
    /******************** 更新单品 ********************/
    /**更新单品 */
    update() {
      let strData = CardDataParse.constructor(
        this.tagID,
        this.commodityID,
        this.manufacturerID
      );
      uni.setStorageSync("writeCard", 1);
      app.readDataAsyn();
      let { IntentCode, respond } = uni.getStorageSync("writeCardInfo");
      uni.setStorageSync("writeCardInfo", null);
      if (IntentCode == 1001) {
        if (this.isWriteSuccess(strData)) return;
        this.uploadImage((imgUrl) => this.updateCI(imgUrl, this.queryCB));
      }
    },
    /**
     * 商品更新
     * @param {string} imageURL 图片地址
     */
    updateCI(imageURL, success) {
      updateCI({
        data: {
          commodityInfo: {
            info_id: this.info_id,
            codeEANUPC: this.info.codeEANUPC,
            commodityName: this.info.commodityName,
            imageURL,
            specificationsMain: this.specificationsMain,
            specificationsNum: this.specifications.length,
            specifications: this.specifications,
            manufacturerID: this.manufacturerID,
          },
          account: this.account,
          businessID: uni.getStorageSync("userInfo").businessID,
        },
        success: () => success(),
      });
    },
    /**商品批次查询 */
    queryCB() {
      queryCB({
        data: {
          info_id: this.info_id,
          account: this.account,
        },
        success: (res) => this.updateCS(res.batch_id),
      });
    },
    /**
     * 单品更新
     * @param {string} batch_id 批次ID
     */
    updateCS(batch_id) {
      updateCS({
        data: {
          commodityID: this.commodityID,
          manufacturerID: this.manufacturerID,
          tagID: this.tagID,
          tagCardID: this.tagCardID,
          tagData: this.tagID + this.commodityID + this.manufacturerID,
          codeEANUPC: this.info.codeEANUPC,
          state: this.index - 1,
          account: this.account,
          batch_id,
        },
        success: () => {
          uni.switchTab({ url: "../detail/detail" });
        },
        fail(res) {
          showToast(res);
        },
      });
    },
    /********************** end **********************/
    /******************** 批次写卡 ********************/
    /**批次写卡 */
    batchWrite() {
      let strData = CardDataParse.constructor(
        this.tagID,
        this.commodityID,
        this.manufacturerID
      );
      uni.setStorageSync("writeCard", 1);
      app.readDataAsyn();
      let { IntentCode, respond } = uni.getStorageSync("writeCardInfo");
      uni.setStorageSync("writeCardInfo", null);
      if (IntentCode == 1001) {
        if (this.isWriteSuccess(strData)) return;

        respond = JSON.parse(respond);
        /**@type {string} */
        let info = respond.CardInfo;
        let key = "CardId:";
        if (info.indexOf(key) == -1) {
          showToast("数据有误");
          return;
        }
        /**获取CardID数值的起始位置 */
        let CardID_start = info.indexOf(key) + key.length;
        /**获取CardID数值的结束位置 */
        let CardID_end = info.indexOf(",", CardID_start);
        let strTagCardID = info.substring(CardID_start, CardID_end);
        this.getCID({
          tagCardID: strTagCardID,
          codeEANUPC: this.info.codeEANUPC,
          commodityName: this.info.commodityName,
          account: this.account,
        }).then(() => {
          this.uploadImage((imgUrl) =>
            this.updateCI(imgUrl, () =>
              this.addCS(this.batch_id, {
                tagID: this.tagID,
                commodityID: this.commodityID,
                manufacturerID: this.manufacturerID,
                tagCardID: this.tagCardID,
              })
            )
          );
        });
      }
    },
    /********************** end **********************/
    /**
     * 获取商品ID
     * @param {{ tagCardID:string, codeEANUPC:string, commodityName:string, account:string,}} data
     */
    getCID(data) {
      return new Promise((resolve, reject) => {
        getCommodityID({
          data,
          success: (commodityID) => {
            this.commodityID = commodityID;
            resolve();
          },
          fail(res) {
            reject();
          },
        });
      });
    },
    /**
     * @param {callback} callback
     * @callback callback
     * @param {string} imgUrl 上传后的图片地址
     * @returns {void}
     */
    uploadImage(callback) {
      upload(this.imgs[0].path, {
        url: config.uploadImage,
        success: callback,
        fail(msg) {
          showToast(msg);
        },
      });
    },
    checkPrice(e) {
      /**@type {string} */
      let price = e.target.value;
      // 正则表达式
      price = price.match(/^\d*(\.?\d{0,2})/g)[0] || null;
      // 重新赋值给input
      this.$nextTick(() => (this.info.price = price));
    },
    remove(index) {
      this.specifications[index] = null;
      let arr = [];
      for (let i = 0, j = 0; i < this.specifications.length; i++)
        this.specifications[i] !== null && (arr[j++] = this.specifications[i]);
      this.specifications = arr;
      this.specifications.length == 0 && this.specificationInit();
    },
    addAttribute() {
      this.specifications.forEach((sp) => (sp.isMain = false));
    },
    setMain(index) {
      if (this.specifications[index].name == "") {
        showToast(`规格${index + 1}的规格名称不能为空`);
        return;
      }
      if (this.specifications[index].value == "") {
        showToast(`规格${index + 1}的规格数据不能为空`);
        return;
      }
      this.specifications[index].isMain = !this.specifications[index].isMain;
      let strArr = [];
      this.specifications.forEach((sp) => sp.isMain && strArr.push(sp.name));
      console.log(strArr);
      this.specificationsMain = strArr.join(",");
    },
    /**
     * @param {Object} data
     * @param {{
        info_id: string; 
        commodityName: string; 
        codeEANUPC: string; 
        manufacturerID: string; 
        imageURL: string; 
        specificationsMain: string; 
        specificationsNum: number; 
        specifications: {name: string; value: string;}[]
      }} data.commodityInfo
     * @param {{
        commodityID: string; 
        tagID: string; 
        tagCardID: string; 
        tagData: string; 
        codeEANUPC: string; 
        businessID: string; 
        state: string; 
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
      }[]} data.commoditySingle
     */
    updateData({ commodityInfo: info, commoditySingle: single }) {
      this.info.commodityName = info.commodityName;
      this.info.codeEANUPC = info.codeEANUPC;
      this.imgs[0] = { path: info.imageURL };
      this.downloadImages(info.imageURL);
      this.specifications = info.specifications;
      this.info_id = info.info_id;
      this.addAttribute();
      this.specificationsMain = info.specificationsMain;
      let strArr = this.specificationsMain.split(",");
      this.specifications.forEach((sp) =>
        strArr.forEach((name) => sp.name == name && (sp.isMain = true))
      );
      single.forEach((single) => {
        queryCB({
          data: { batch_id: single.batch_id },
          success: ({ total }) => {
            this.num = total;
            this.index = single.state + 1;
            this.writeCardStatus = 1;
          },
          fail(msg) {
            showToast(msg);
          },
        });
      });
    },
    /**
     * 读取商品信息
     * @param {Object} res
     * @param {string} res.CardData
     * @param {string} res.CardInfo
     */
    readCommodityInfo(res) {
      let { CardData: data, CardInfo: info } = res;
      // uni.showModal({ content: JSON.stringify(res) });
      if (info != "") {
        let key = "CardId:";
        if (info.indexOf(key) == -1) {
          showToast("数据有误");
          return;
        }
        /**获取CardID数值的起始位置 */
        let CardID_start = info.indexOf(key) + key.length;
        /**获取CardID数值的结束位置 */
        let CardID_end = info.indexOf(",", CardID_start);
        this.tagCardID = info.substring(CardID_start, CardID_end);
      }
      ({
        strTagID: this.tagID,
        strSPId: this.commodityID,
        strCSId: this.manufacturerID,
      } = config.getNfcId(data, 25));
      queryCByID({
        data: {
          tagID: this.tagID,
          commodityID: this.commodityID,
          manufacturerID: this.manufacturerID,
          tagData: this.tagID + this.commodityID + this.manufacturerID,
          account: this.account,
        },
        success: (data) => {
          uni.showModal({
            title: "更新",
            content: "卡内有商品数据，是否更新？",
            cancelText: "重新制卡",
            confirmText: "立即更新",
            success: (res) => {
              if (res.confirm) {
                this.updateData(data);
              } else {
                this.isWriteCard = false;
                this.showCommodityList();
              }
            },
            fail(msg) {
              showToast(msg);
            },
          });
        },
      });
    },
    downloadImages(url) {
      uni.downloadFile({
        url: setPicturePath(url),
        success: (res) => (this.imgs[0] = { path: res.tempFilePath }),
      });
    },
    /**
     * 下拉框
     * @param {Event} e
     */
    bindPickerChange(e) {
      // 改变的事件名
      console.log("picker发送选择改变，携带值为", e.target.value); // 用于输出改变索引值
      this.index = e.target.value; // 将数组改变索引赋给定义的index变量
      this.state = this.states[this.index]; // 将states【改变索引】的值赋给定义的jg变量
      console.log(this.index, this.state);
    },
    onInput(e) {
      /**@type {string} */
      let codeEANUPC = e.detail.value;
      if (codeEANUPC.length != 13 || this.writeCardStatus == 1) return;
      this.addCommodity(codeEANUPC);
    },
    addCommodity(codeEANUPC) {
      onlineCIQ({
        data: { codeEANUPC },
        success: (info) => {
          this.info.commodityName = info.commodityName;
          this.info.codeEANUPC = codeEANUPC;
          this.imgs[0] = { path: info.imageURL };
          this.downloadImages(info.imageURL);
          this.specifications = info.specifications;
          this.addAttribute();
          this.specificationsMain = info.specificationsMain;
          let strArr = this.specificationsMain.split(",");
          this.specifications.forEach((sp) =>
            strArr.forEach((name) => sp.name == name && (sp.isMain = true))
          );
          this.off = true;
        },
      });
    },
    showToast() {
      showToast("已有此商品类型，此处规格无法更改！");
    },
    toParseInt(e) {
      /**@type {string} */
      let num = e.target.value;
      if (num.length == 0) num = "0";
      num = parseInt(num).toString();
      this.$nextTick(() => (this.n = this.num = num));
    },
    /**账户已发布批次查询 */
    showCommodityList() {
      let { businessID } = uni.getStorageSync("userInfo");
      let { account } = uni.getStorageSync("account");
      pBQ({
        data: {
          businessID,
          account,
        },
        success: (data) => {
          /**@type {{
            batch_id: string;
            codeEANUPC: string;
            manufacturerID: string;
            total: number;
            totaled: number;
            info_id: string;
          }[]} */
          let list = [];
          data.forEach((data) => data.total > data.totaled && list.push(data));
          if (list.length == 0) {
            this.isWriteCard = true;
            return;
          }
          this.showList = list;
        },
        fail(msg) {
          this.isWriteCard = true;
          showToast(msg);
        },
      });
    },
    /**
     * @param {Object} data
     * @param {string} data.batch_id
     * @param {string} data.codeEANUPC
     * @param {string} data.manufacturerID
     * @param {number} data.total
     * @param {number} data.totaled
     * @param {string} data.info_id
     */
    setBatch(data) {
      queryCByInfoID({
        data: {
          account: this.account,
          info_id: data.info_id,
        },
        success: (info) => {
          this.num = data.total;
          this.info.commodityName = info.commodityName;
          this.info.codeEANUPC = info.codeEANUPC;
          this.manufacturerID = info.manufacturerID;
          this.imgs[0] = { path: info.imageURL };
          this.downloadImages(info.imageURL);
          this.specifications = info.specifications;
          this.addAttribute();
          this.specificationsMain = info.specificationsMain;
          let strArr = this.specificationsMain.split(",");
          this.specifications.forEach((sp) =>
            strArr.forEach((name) => sp.name == name && (sp.isMain = true))
          );
          this.isWriteCard = true;
          this.batch_id = data.batch_id;
          this.writeCardStatus = 2;
        },
        fail(msg) {
          showToast(msg);
        },
      });
    },
    addBatch() {
      this.isWriteCard = true;
    },
  },
  onShow() {
    this.account = uni.getStorageSync("userInfo").account;
    if (!this.account) {
      showToast("未登入，请先登入！");
      setTimeout(() => uni.navigateTo({ url: "../user/login/login" }), 1000);
      return;
    }
    // 读取商品信息
    // #ifdef APP-PLUS
    let { IntentCode, respond } = uni.getStorageSync("writeCardInfo");
    uni.setStorageSync("writeCardInfo", null);
    if (IntentCode == 1001) this.readCommodityInfo(JSON.parse(respond));
    // #endif
    // #ifdef MP-WEIXIN
    this.readCommodityInfo(uni.getStorageSync("WeiXinInfo"));
    uni.removeStorageSync("WeiXinInfo");
    // #endif
  },
};
function showToast(title) {
  uni.showToast({
    icon: "none",
    title,
    duration: 3000,
  });
}
</script>

<style scoped>
@import url(../../static/fonts/iconfont.css);

.iconfont {
  font-size: 28upx;
  color: #12be79;
}

.main {
  background: #e5e5e5;
  width: 100%;
  font-weight: bolder;
}

.main > table {
  width: 100%;
}

.main > table > tr > td:first-child {
  width: 10%;
}

.bg {
  background-color: #fff;
  display: flex;
}

.bg > td {
  margin: 16upx 0;
  padding: 0 30upx;
  line-height: 100%;
}

.bg > td:first-child {
  display: -webkit-box; /*flex弹性布局*/
  -webkit-box-align: center;
  -webkit-box-pack: center;
}

.goods,
.picture {
  margin-top: 6upx;
}

.goods > td:first-child {
  text-align: center;
}

.info tr {
  display: flex;
}

.info td {
  line-height: 100%;
  height: 1.4rem;
}

.info > tr > td:first-child {
  width: 40%;
  font-size: 10px;
  font-weight: bold;
  line-height: 1.4rem;
}

.info input {
  /* width: 50%; */
  border-radius: 2px;
  /* background-color: #e5e5e5; */
}

.info input:last-child {
  color: green;
}

.info input {
  padding: 2upx 10upx;
}

.picture {
  height: 180upx;
  box-sizing: border-box;
}

.picture > view:first-child {
  /* width: 17%; */
  text-align: center;
}

.picture > td:last-child {
  display: flex;
  width: 90%;
  position: relative;
}

.picture > td:last-child > view:not(:last-child) {
  width: 30%;
  box-sizing: border-box;
  height: 100%;
  margin: 0 auto;
}

.picture > td:last-child > view > img {
  width: 80px;
  height: 80%;
  padding: 0 15px;
  box-sizing: border-box;
}

.picture > td:last-child > view:last-child {
  position: absolute;
  width: 100%;
  bottom: 0;
  font-size: 28upx;
  color: #666;
  text-align: center;
}

.specifications {
  margin-top: 6upx;
  height: 340upx;
}

.specifications > td:first-child {
  height: 100%;
  text-align: center;
}

.specifications > td:last-child {
  position: relative;
}

.specifications > td:last-child > view {
  width: 50%;
  height: 25%;
  float: left;
  line-height: 100%;
  display: -webkit-box;
  -webkit-box-align: center;
  -webkit-box-pack: center;
  height: 1.4rem;
}

.specifications > td:last-child > .other {
  width: 100%;
  color: crimson;
}

.specifications .other:last-child {
  height: 50%;
  box-sizing: border-box;
}

.specifications .other:last-child > textarea {
  background-color: #ccc;
  color: blue;
  width: 100%;
  height: 90%;
  padding: 20upx 0 0 10upx;
}

.button {
  position: fixed;
  bottom: 0;
  right: 0;
  background-color: #6ca56b;
  color: #fff;
  width: 100%;
  display: -webkit-box;
  -webkit-box-align: center;
  -webkit-box-pack: center;
  height: 50upx;
  z-index: 9999;
}

.add {
  bottom: 60upx;
  right: 0;
  width: 28.8%;
  border-radius: 10upx;
}

.delete {
  position: absolute;
  right: 35upx;
  top: 55upx;
  color: #fff;
  background: #555;
  border-radius: 50%;
  z-index: 1000;
}
.red-border {
  border: 1px solid red;
}
.white-border {
  border: 1px solid white;
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
  font-weight: lighter;
}
.commodity-info table {
  width: 100%;
  font-size: 12upx;
}
.commodity-info tr {
  /* #ifdef MP-WEIXIN */
  width: 100%;
  /* #endif */
}
.commodity-info tr > td {
  /* #ifdef MP-WEIXIN */
  width: 50%;
  float: left;
  /* #endif */
}
.batch_button {
  background-color: #11bf78;
  font-weight: lighter;
  color: #fff;
}

.commodity-info > table > tr:first-child > td:last-child > .batch_button {
  background-color: #fff;
  color: #000;
  padding: 0;
  border: 0;
}
</style>