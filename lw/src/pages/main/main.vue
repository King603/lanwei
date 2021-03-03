<template>
  <view class="main">
    <view class="title">
      <view class="navigation">
        <!-- 搜索框 -->
        <view class="ul m-icon m-icon-search" @click="Search">
          <m-input type="text" placeholder="请输入搜索内容"></m-input>
        </view>
      </view>
      <view
        class="button"
        :style="{ width: 100 / buttons.length + '%' }"
        v-for="(button, index) of buttons"
        :key="index"
        @click="to(index)"
      >
        <view class="iconfont" :class="button.className"></view>
        <view>{{ button.text }}</view>
      </view>
    </view>
    <!-- #ifdef APP-PLUS -->
    <view class="iconfont more" @click="share">&#xe6cf;</view>
    <!-- #endif -->
    <view>
      <view class="gg" v-if="temps">
        <view>{{ temps.title }}</view>
        <view
          class="float-left"
          @click="showC(temp.param)"
          v-for="(temp, i) of temps.temp"
          :key="i"
        >
          <img :src="temp.img" alt="" />
          <p class="gg_title">{{ temp.text }}</p>
          <p class="gg_title">EAN/UPC码:<br />{{ temp.param }}</p>
        </view>
        <view class="clear"></view>
      </view>
      <view class="gg" v-if="contents">
        <view>{{ contents.title }}</view>
        <view
          class="float-left"
          @click="showC(content.param)"
          v-for="(content, i) of contents.content"
          :key="i"
        >
          <img :src="content.img" alt="" />
          <p class="gg_title">{{ content.text }}</p>
          <p class="gg_title">EAN/UPC码:<br />{{ content.param }}</p>
        </view>
        <view class="clear"></view>
      </view>
    </view>

    <!-- <view class="content">
      <view
        class="flex_row_c_c modalView"
        :class="qrShow ? 'show' : ''"
        @tap="hideQr()"
      >
        <view class="flex_column">
          <view class="backgroundColor-white padding1vh border_radius_10px">
            <image
              :src="poster.finalPath"
              mode="widthFix"
              class="posterImage"
            ></image>
          </view>
          <view class="my-flex-row-c marginTop2vh">
            <button
              type="primary"
              class="my-bg-white my-cl-08"
              size="default"
              @tap.prevent.stop="share()"
            >
              分享图片
            </button>
          </view>
        </view>
      </view>

      <button type="primary" @tap="shareFc()">生成海报</button>

      <view class="hideCanvasView">
        <canvas
          class="hideCanvas"
          canvas-id="default_PosterCanvasId"
          :style="{
            width: (poster.width || 0) + 'px',
            height: (poster.height || 0) + 'px',
          }"
        ></canvas>
      </view>
    </view> -->
  </view>
</template>

<script>
import * as config from "../../util/config.js";
import { mapState, mapMutations } from "vuex";
import mInput from "../../components/m-input.vue";
import mSlideshow from "../../components/main/m-slideshow/m-slideshow.vue";
import weixin from "../../util/NFC/nfcWeiXin/Nfc";
import app from "../../util/NFC/nfcAndroid/Nfc";
import {
  SSDKContentType,
  SSDKPlatformID,
  SSDKShareParams,
} from "../../util/ShareSDK";

import _app from "../../util/QS-SharePoster/app.js";
import { getSharePoster } from "../../util/QS-SharePoster/QS-SharePoster.js";
import { getSign } from "../../util/sign";
import onNetworkStatusChange from "../../api/onNetworkStatusChange";
import getNetworkType from "../../api/getNetworkType.js";
import net_off from "../../api/net_off.js";
import setPicturePath from "../../api/setPicturePath.js";
import onlineDQ from "../../api/request/detail/onlineDQ";
import onlineCIQ from "../../api/request/detail/onlineCIQ";
import update from "../../api/request/update";

let img_url = "/static/img/weixin.png";
let backgroundImage = "/static/my/1.jpg";
let tag = false;
let time = 1000;
let count = 0;

export default {
  data() {
    return {
      buttons: [
        { className: "icon-saoma", text: "扫一扫" },
        { className: "icon-nfc", text: "NFC" },
        { className: "icon-chuchang", text: "发布商品" },
      ],
      /**@type {{title: string; temp: {img: string; text: string; src: string; param: string;}[];}} */
      temps: null,
      /**@type {{title: string; content: {img: string; text: string; src: string; param: string;}[];}} */
      contents: null,
      ok: false,
      isClick: false,
      obj: {},
      /**@type {[][]} */
      tj: [],

      poster: {},
      qrShow: false,
      canvasId: "default_PosterCanvasId",
      backgroundImage,
      timer: 0,
    };
  },
  components: {
    mInput,
    mSlideshow,
  },
  computed: mapState(["forcedLogin", "hasLogin", "userName"]),
  onLoad() {
    const loginType = uni.getStorageSync("login_type");
    if (loginType === "local") {
      this.login(uni.getStorageSync("username"));
      return;
    }
    let uniIdToken = uni.getStorageSync("uniIdToken");
    uniIdToken
      ? this.login(uni.getStorageSync("username"))
      : this.guideToLogin();

    onlineDQ({
      data: { page: 0 },
      success: (data) => {
        console.log(data);
        [this.temps, this.contents] = data;
        console.log(this.temps, this.contents);
        this.temps.temp.forEach(this.setPath);
        this.contents.content.forEach(this.setPath);
        this.ok = true;
      },
      fail(err) {
        console.log(err);
      },
    });
  },
  methods: {
    ...mapMutations(["login"]),
    ...mapMutations(["logout"]),
    /**
     * @param {Object} data
     * @param {string} data.img
     * @param {string} data.text
     * @param {string} data.src
     * @param {string} data.param
     */
    setPath(data) {
      data.img = setPicturePath(data.img);
    },
    showC(param) {
      onlineCIQ({
        data: { codeEANUPC: param },
        success(res) {
          uni.setStorageSync("searchInfo", res.data);
          uni.setStorageSync("isSearch", true);
          uni.switchTab({ url: "../detail/detail" });
        },
        fail(msg) {
          uni.showToast({ title: msg, icon: "none" });
        },
      });
    },
    /**登出账号 */
    bindLogout() {
      if (this.hasLogin) this.logout();
    },
    /** 登录设置 */
    guideToLogin() {
      uni.showModal({
        title: "未登录",
        content: "您未登录，需要登录后才能继续",
        /**
         * 如果需要强制登录，不显示取消按钮
         */
        showCancel: !this.forcedLogin,
        success: (res) => {
          if (res.confirm) {
            /**
             * 如果需要强制登录，使用reLaunch方式
             */
            if (this.forcedLogin) {
              uni.reLaunch({
                url: "../user/login/login",
              });
            } else {
              uni.navigateTo({
                url: "../user/login/login",
              });
            }
          }
        },
      });
    },
    /** 搜索查询 */
    Search() {
      console.log(121212);
      uni.navigateTo({
        url: "../detail/mySearch/mySearch",
      });
    },
    to(index) {
      let tag = false;
      getNetworkType({
        success(type) {
          if (type == "none") {
            net_off(["扫一扫", "NFC扫描", "发布商品"][index]);
            tag = true;
          }
        },
      }).then(() => {
        if (tag) return;
        switch (index) {
          case 0: // 跳转到扫一扫界面
            uni.scanCode({
              scanType: ["qrCode"],
              success: (res) => {
                console.log(res);
                try {
                  let { result } = res;
                  /**查询获得第一个“{”的位置 */
                  let index = result.indexOf("{");
                  /**获取JSON字符串 */
                  let JSON_str = result.slice(index);
                  uni.setStorageSync("respond", JSON_str); // 以“respond”为名称存储一个值“value”
                  uni.switchTab({
                    url: "../detail/detail",
                  });
                } catch (e) {
                  throw e;
                }
              },
            });
            break;
          case 1: // NFC扫描
            uni.showToast({
              title: "开始感应NFC",
              icon: "none",
            });
            // #ifdef MP-WEIXIN
            weixin.readDataAsyn({
              success: (res) => {
                let { CardData: data } = res;
                let { strTagID, strSPId, strCSId } = config.getNfcId(data, 25);
                uni.setStorageSync(
                  "respond",
                  JSON.stringify({
                    tagID: strTagID,
                    commodityID: strSPId,
                    manufacturerID: strCSId,
                  })
                );
                uni.switchTab({
                  url: "../detail/detail",
                });
              },
              fail: (res) => {
                console.log("错误", res);
              },
            });
            // #endif
            // #ifdef APP-PLUS
            app.readDataAsyn();
            // #ENDIF
            break;
          case 2: // 商品发布
            // #ifdef APP-PLUS
            uni.setStorageSync("writeCard", 1);
            app.readDataAsyn();
            uni.navigateTo({ url: "../detail/Ex-Factory" });
            // #endif
            // #ifdef MP-WEIXIN
            // uni.showToast({
            //   icon: "none",
            //   title: "微信端写卡功能不全暂无此功能",
            // });
            uni.showToast({
              title: "开始感应NFC",
              icon: "none",
            });
            weixin.readDataAsyn({
              success: (res) => {
                uni.showToast({
                  title: "恭喜！获取到信息了 😘",
                  icon: "none",
                  duration: 2000,
                });
                console.log(res);
                uni.setStorageSync("WeiXinInfo", res);
                uni.navigateTo({
                  url: "../detail/Ex-Factory",
                });
              },
              fail: (res) => {
                console.log("错误", JSON.stringify(res));
                uni.showToast({
                  title: "微信NFC接口功能不完善请多试几次 😂",
                  icon: "none",
                  duration: 1000,
                });
              },
            });
            // #endif
            break;
        }
      });
    },
    goto(src) {
      uni.navigateTo({
        url: "goto/goto?src=" + src,
      });
    },
    // #ifdef APP-PLUS
    update() {
      update((res) => {
        plus.runtime.getProperty(
          plus.runtime.appid,
          (inf) => inf.version != res.versions && this.doUpDataReq()
        );
      });
    },
    doUpDataReq() {
      uni.showModal({
        title: "发现新版本",
        content: "确认下载更新",
        success: (res) => res.confirm == true && this.doUpData(), // 当用户确定更新，执行更新
      });
    },

    doUpData() {
      uni.showLoading({
        title: "更新中……",
      });
      uni.downloadFile({
        //执行下载
        url: "***", //下载地址
        success: (downloadResult) => {
          //下载成功
          uni.hideLoading();
          if (downloadResult.statusCode == 200) this.installReq(downloadResult);
        },
      });
    },
    installReq(downloadResult) {
      uni.showModal({
        title: "",
        content: "更新成功，确定现在重启吗？",
        confirmText: "重启",
        confirmColor: "#EE8F57",
        success: (res) => res.confirm == true && this.install(downloadResult),
      });
    },
    install(downloadResult) {
      plus.runtime.install(
        //安装
        downloadResult.tempFilePath,
        { force: true },
        (res) => {
          uni.showToast({ title: "更新成功，重启中" });
          plus.runtime.restart();
        }
      );
    },
    // #endif

    share() {
      // #ifdef APP-PLUS
      _app.getShare(
        false,
        false,
        2,
        "",
        "",
        "",
        this.poster.finalPath,
        false,
        false
      );
      _app.showToast("分享了");
      // #endif
    },
    hideQr() {
      this.qrShow = false;
    },
    async shareF() {
      try {
        const d = await getSharePoster({
          _this: this, //若在组件中使用 必传
          type: "testShareType",
          backgroundImage,
          posterCanvasId: this.canvasId,
          delayTimeScale: 20, //延时系数
          drawArray({ bgObj, type, bgScale }) {
            const dx = bgObj.width * 0.3;
            const fontSize = bgObj.width * 0.045;
            const font1 = bgObj.width * 0.09;
            const font2 = bgObj.width * 0.07;
            const lineHeight = bgObj.height * 0.04;
            //可直接return数组，也可以return一个promise对象, 但最终resolve一个数组, 这样就可以方便实现后台可控绘制海报
            return new Promise((rs, rj) => {
              rs([
                {
                  type: "custom",
                  setDraw(Context) {
                    Context.setFillStyle("black");
                    Context.setGlobalAlpha(0.3);
                    Context.fillRect(
                      0,
                      bgObj.height - bgObj.height * 0.2,
                      bgObj.width,
                      bgObj.height * 0.2
                    );
                    Context.setGlobalAlpha(1);
                  },
                },
                {
                  type: "image",
                  url: "/static/my/white.png",
                  dx: bgObj.width * 0.33,
                  dy: bgObj.height * 0.29,
                  infoCallBack(imageInfo) {
                    return {
                      dWidth: bgObj.width * 0.34,
                      dHeight: bgObj.width * 0.34,
                    };
                  },
                },
                {
                  type: "text",
                  fontStyle: "italic",
                  text: "扫码关注",
                  size: font1,
                  color: "white",
                  alpha: 1,
                  textAlign: "left",
                  textBaseline: "middle",
                  infoCallBack(textLength) {
                    _app.log(
                      "index页面的text的infocallback ，textlength:" + textLength
                    );
                    return {
                      dx: textLength * 0.88,
                      dy: lineHeight * 7,
                    };
                  },
                },
                {
                  type: "text",
                  fontStyle: "italic",
                  text: "“豪想充”",
                  size: font2,
                  color: "white",
                  alpha: 1,
                  textAlign: "left",
                  textBaseline: "middle",
                  infoCallBack(textLength) {
                    _app.log(
                      "index页面的text的infocallback ，textlength:" + textLength
                    );
                    return {
                      dx: textLength * 0.87,
                      dy: lineHeight * 10,
                    };
                  },
                },
                {
                  type: "text",
                  text: "推荐人：罗真雨",
                  fontStyle: "italic",
                  size: fontSize,
                  color: "white",
                  alpha: 1,
                  textAlign: "centre",
                  textBaseline: "middle",
                  infoCallBack(textLength) {
                    return {
                      dx: textLength * 1.05,
                      dy: bgObj.height - lineHeight * 2.3,
                    };
                  },
                },
                {
                  type: "text",
                  text: "豪想充信息科技",
                  size: fontSize,
                  color: "white",
                  alpha: 1,
                  textAlign: "center",
                  textBaseline: "middle",
                  infoCallBack(textLength) {
                    return {
                      dx: bgObj.width * 0.5,
                      dy: bgObj.height - lineHeight,
                    };
                  },
                },
                {
                  type: "qrcode",
                  text: "呼朋唤友，有钱有益",
                  size: bgObj.width * 0.24,
                  dx: bgObj.width * 0.375,
                  dy: bgObj.height * 0.675,
                },
                {},
              ]);
            });
          },
          imagesArray({ bgObj, type, bgScale }) {
            //接收的第一个参数为背景图片的信息, 第二个参数是自定义标识（感觉这里用不到）, 图片为示例图片
            // const dx = bgObj.width*0.3;
            return [
              {
                url:
                  "https://haoxiangchong.oss-cn-shenzhen.aliyuncs.com/NsKSWjFyEK_wx023ed2d5e1a87230.o6zAJs5b-NeM9YlE0KCOW3BfXCAY.uW1whlv6H1Mn3c896be85646579d47630995e1513e61.png",
                dx: 0,
                dy: 0,
                infoCallBack(imageInfo) {
                  // let scale = bgObj.width*0.2 / imageInfo.height;
                  return {
                    dWidth: bgObj.width,
                    dHeight: bgObj.height,
                    // roundRectSet: {	// 圆角矩形
                    // 	r: imageInfo.width*.1
                    // }
                  };
                },
              },
            ];
          },
          setCanvasWH: ({ bgObj, type, bgScale }) => {
            // 为动态设置画布宽高的方法，
            this.poster = bgObj;
          },
          setDraw({ Context, bgObj, type, bgScale }) {
            Context.setFillStyle("black");
            Context.setGlobalAlpha(0.3);
            Context.fillRect(
              0,
              bgObj.height - bgObj.height * 0.2,
              bgObj.width,
              bgObj.height * 0.2
            );
          },
        });
        console.log("海报生成成功， 临时路径: " + d.poster.tempFilePath);
        this.poster.finalPath = d.poster.tempFilePath;
        this.qrShow = true;
      } catch (e) {
        _app.hideLoading();
        _app.showToast(JSON.stringify(e));
        console.log(JSON.stringify(e));
      }
    },
    async shareFc() {
      try {
        const d = await getSharePoster({
          _this: this, //若在组件中使用 必传
          type: "testShareType",
          posterCanvasId: this.canvasId,
          delayTimeScale: 20, //延时系数
          drawArray: ({ bgObj, type, bgScale }) => {
            const dx = bgObj.width * 0.3;
            const fontSize = bgObj.width * 0.045;
            const lineHeight = bgObj.height * 0.04;
            // 可直接return数组，也可以return一个promise对象, 但最终resolve一个数组, 这样就可以方便实现后台可控绘制海报
            return new Promise((rs, rj) => {
              rs([
                {
                  type: "custom",
                  setDraw(Context) {
                    Context.setFillStyle("black");
                    Context.setGlobalAlpha(0.3);
                    Context.fillRect(
                      0,
                      bgObj.height - bgObj.height * 0.2,
                      bgObj.width,
                      bgObj.height * 0.2
                    );
                    Context.setGlobalAlpha(1);
                  },
                },
                {
                  type: "image",
                  url: img_url,
                  dx,
                  dy: bgObj.height - bgObj.width * 0.25,
                  infoCallBack(imageInfo) {
                    let scale = (bgObj.width * 0.2) / imageInfo.height;
                    return {
                      circleSet: {
                        x: (imageInfo.width * scale) / 2,
                        y: (bgObj.width * 0.2) / 2,
                        r: (bgObj.width * 0.2) / 2,
                      }, // 圆形图片 , 若circleSet与roundRectSet一同设置 优先circleSet设置
                      dWidth: imageInfo.width * scale, // 因为设置了圆形图片 所以要乘以2
                      dHeight: bgObj.width * 0.2,
                      roundRectSet: {
                        // 圆角矩形
                        r: imageInfo.width * 0.1,
                      },
                    };
                  },
                },
                {
                  type: "text",
                  fontStyle: "italic",
                  text: "呼朋唤友，有钱有益",
                  size: fontSize,
                  color: "white",
                  alpha: 1,
                  textAlign: "left",
                  textBaseline: "middle",
                  infoCallBack(textLength) {
                    _app.log(
                      "index页面的text的infocallback ，textlength:" + textLength
                    );
                    return {
                      dx: bgObj.width - textLength - fontSize,
                      dy: bgObj.height - lineHeight * 3,
                    };
                  },
                },
                {
                  type: "text",
                  text: "罗真雨",
                  fontStyle: "italic",
                  size: fontSize,
                  color: "white",
                  alpha: 1,
                  textAlign: "left",
                  textBaseline: "middle",
                  infoCallBack(textLength) {
                    return {
                      dx: bgObj.width - textLength - fontSize,
                      dy: bgObj.height - lineHeight * 2,
                    };
                  },
                },
                {
                  type: "text",
                  text: "豪想充信息科技",
                  size: fontSize,
                  color: "white",
                  alpha: 1,
                  textAlign: "left",
                  textBaseline: "middle",
                  infoCallBack(textLength) {
                    return {
                      dx: bgObj.width - textLength - fontSize,
                      dy: bgObj.height - lineHeight,
                    };
                  },
                },
                {
                  type: "qrcode",
                  text: "呼朋唤友，有钱有益",
                  size: bgObj.width * 0.2,
                  dx: bgObj.width * 0.05,
                  dy: bgObj.height - bgObj.width * 0.25,
                },
              ]);
            });
          },
          qrCodeArray: ({ bgObj, type, bgScale }) => {
            return [
              {
                text: "你好，我是取舍",
                size: bgObj.width * 0.2,
                dx: bgObj.width * 0.05,
                dy: bgObj.height - bgObj.width * 0.25,
              },
            ];
          },
          imagesArray: ({ bgObj, type, bgScale }) => {
            //接收的第一个参数为背景图片的信息, 第二个参数是自定义标识（感觉这里用不到）, 图片为示例图片
            const dx = bgObj.width * 0.3;
            return [
              {
                url: img_url,
                dx,
                dy: bgObj.height - bgObj.width * 0.25,
                infoCallBack(imageInfo) {
                  let scale = (bgObj.width * 0.2) / imageInfo.height;
                  return {
                    circleSet: {
                      x: (imageInfo.width * scale) / 2,
                      y: (bgObj.width * 0.2) / 2,
                      r: (bgObj.width * 0.2) / 2,
                    }, // 圆形图片 , 若circleSet与roundRectSet一同设置 优先circleSet设置
                    dWidth: imageInfo.width * scale, // 因为设置了圆形图片 所以要乘以2
                    dHeight: bgObj.width * 0.2,
                    roundRectSet: {
                      // 圆角矩形
                      r: imageInfo.width * 0.1,
                    },
                  };
                },
              },
            ];
          },
          textArray: ({ bgObj, type, bgScale }) => {
            const fontSize = bgObj.width * 0.045;
            const lineHeight = bgObj.height * 0.04;
            return [
              {
                fontStyle: "italic",
                text: "取舍",
                size: fontSize,
                color: "white",
                alpha: 0.5,
                textAlign: "left",
                textBaseline: "middle",
                infoCallBack(textLength) {
                  _app.log(
                    "index页面的text的infocallback ，textlength:" + textLength
                  );
                  return {
                    dx: bgObj.width - textLength - fontSize,
                    dy: bgObj.height - lineHeight * 3,
                  };
                },
              },
              {
                text: "取舍",
                fontWeight: "bold",
                size: fontSize,
                color: "white",
                alpha: 0.75,
                textAlign: "left",
                textBaseline: "middle",
                infoCallBack(textLength) {
                  return {
                    dx: bgObj.width - textLength - fontSize,
                    dy: bgObj.height - lineHeight * 2,
                  };
                },
              },
              {
                text: "取舍",
                size: fontSize,
                color: "white",
                alpha: 1,
                textAlign: "left",
                textBaseline: "middle",
                infoCallBack(textLength) {
                  return {
                    dx: bgObj.width - textLength - fontSize,
                    dy: bgObj.height - lineHeight,
                  };
                },
              },
            ];
          },
          setCanvasWH: ({ bgObj, type, bgScale }) => {
            // 为动态设置画布宽高的方法，
            this.poster = bgObj;
          },
          setDraw: ({ Context, bgObj, type, bgScale }) => {
            Context.setFillStyle("black");
            Context.setGlobalAlpha(0.3);
            Context.fillRect(
              0,
              bgObj.height - bgObj.height * 0.2,
              bgObj.width,
              bgObj.height * 0.2
            );
          },
        });
        console.log("海报生成成功， 临时路径: " + d.poster.tempFilePath);
        this.poster.finalPath = d.poster.tempFilePath;
        this.qrShow = true;
      } catch (e) {
        _app.hideLoading();
        _app.showToast(JSON.stringify(e));
        console.log(JSON.stringify(e));
      }
    },
    /**
     * 清除缓存
     *
     * 保留登录信息
     */
    reset_cache() {
      /**@type {{ account: string; password: string; imei: string; clientType: number; isOK: boolean; }} */
      let login_info = uni.getStorageSync("login_info");
      uni.clearStorageSync();
      uni.setStorageSync("login_info", { ...login_info });
      this.timer = null;
    },
    /**
     * 关闭程序
     * @param {callback} callback
     * @callback callback
     * @returns {void}
     */
    closeApp(callback) {
      callback();
      this.reset_cache();
      this.bindLogout();
    },
  },
  // #ifdef APP-PLUS
  // 监听返回键
  onBackPress(tab) {
    tag = !tag;
    count++;
    uni.showToast({
      title: "再按一次退出本程序",
      icon: "none",
      position: "bottom",
      duration: time,
    });

    // 退出当前应用，改方法只在App中生效
    if (!tag && count % 2 == 0) {
      switch (uni.getSystemInfoSync().platform) {
        case "ios":
          this.closeApp(() => {
            try {
              const threadClass = plus.ios.importClass("NSThread");
              const mainThread = plus.ios.invoke(threadClass, "mainThread");
              plus.ios.invoke(mainThread, "exit");
            } catch (e) {
              plus.ios
                .import("UIApplication")
                .sharedApplication()
                .performSelector("exit");
            }
          });
          break;
        case "android":
          this.closeApp(() => plus.runtime.quit());
          break;
      }
    } else {
      this.timer = setTimeout(() => {
        tag = false;
        count = 0;
      }, time);
    }
    return true;
  },
  // #endif
};
</script>

<style scoped>
@import "./main.css";
</style>
