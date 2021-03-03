<script>
import * as config from "./util/config";
import { mapState, mapMutations } from "vuex";
import { getSign } from "./util/sign";
import onNetworkStatusChange from "./api/onNetworkStatusChange";
import net_off from "./api/net_off";
import loginByPwd from "./api/request/user/loginByPwd";

let n = 0;

export default {
  onLaunch: function () {
    // window.onerror = function (message, source, line, colum, error) {
    //   console.log(
    //     "ONE ERROR HANDLER TO RULE THEM ALL: Uncaught ReferenceError:" + message
    //   );
    // };
    this.listen();
    this.super_login();
    let uniIdToken = uni.getStorageSync("uniIdToken");
    if (uniIdToken) {
      this.login(uni.getStorageSync("username"));
    }

    console.log("App Launch");
  },
  onShow: function () {
    this.listen();
    // #ifdef APP-PLUS
    var intent = plus.android.importClass("android.content.Intent");
    var mainActivity = plus.android.runtimeMainActivity();
    intent = mainActivity.getIntent(); //获取启动intent
    var IntentCode = intent.getIntExtra("IntentCode", 0); //接收数据
    var respond = intent.getStringExtra("Respond");
    intent.removeExtra("IntentCode");
    intent.removeExtra("Respond");

    /**
     * 获取AndroidNFC消息
     * {string} IntentCode：1001：为NFC消息
     * {string} Respond：json字符串，
     * 			{num}Respond.resCode:错误码
     * 				-1001：设备不支持nfc功能
     *				-1002：请在系统设置中先启用NFC功能
     *				-1004："未设置微信为默认NFC支付应用"
     *				-1011：连接NFC失败
     *				-1012：获取标签信息失败
     *				-1013：操作失败，读或写
     *				-1111：其他错误
     *  			{string}Respond.Error:错误信息
     * 			{string}Respond.CardData：卡数据
     * 			{string}Respond.CardInfo：卡信息
     */
    if (IntentCode == 1001) {
      uni.showModal({
        content: respond,
      });
      if (uni.getStorageSync("writeCard") == 1) {
        uni.setStorageSync("writeCardInfo", { IntentCode, respond });
        respond = JSON.parse(respond);
        if (respond.res && respond.res == "写入成功")
          uni.setStorageSync("isWrite", true);
        uni.removeStorageSync("writeCard");
      } else {
        try {
          respond = JSON.parse(respond);
          /**@type {string} */
          let data = respond.CardData;
          if (data.length > 0) {
            let {
              strTagID: tagID,
              strSPId: commodityID,
              strCSId: manufacturerID,
            } = config.getNfcId(data, 25);
            if (tagID === undefined || tagID === "") showToast("无标签ID数据");
            else if (commodityID === undefined || commodityID === "")
              showToast("无商品ID数据");
            else if (manufacturerID === undefined || manufacturerID === "")
              showToast("无厂商ID数据");

            // 存入缓存
            uni.setStorageSync(
              "respond",
              JSON.stringify({
                tagID: tagID || "",
                commodityID: commodityID || "",
                manufacturerID: manufacturerID || "",
              })
            );
          } else showToast("无CardData数据");

          function showToast(title) {
            uni.showToast({ title, icon: "none" });
          }
        } catch (e) {}
        uni.switchTab({
          url: "pages/detail/detail", // 后台启动跳转
          fail(e) {
            uni.switchTab({
              url: "../detail/detail", // 标签前页跳转
              fail(e) {
                uni.switchTab({
                  url: "../../detail/detail", // 子页面跳转
                  fail(e) {
                    console.error(e);
                  },
                });
              },
            });
          },
        });
      }
    }
    // #endif
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
  computed: mapState(["forcedLogin"]),
  methods: {
    ...mapMutations(["login"]),
    /**监听网络状态变化 */
    listen() {
      onNetworkStatusChange({
        none() {
          uni.showToast({
            title: "网络异常,请检查网络设置！！",
            duration: 3000,
            icon: "none",
            position: "bottom",
          });
        },
        net() {
          uni.showToast({
            title: "当前为数据网络，请注意流量！！",
            icon: "none",
            position: "bottom",
          });
        },
        wifi() {
          uni.showToast({
            title: "当前为无线WiFi，请放心使用！！",
            icon: "none",
            position: "bottom",
          });
        },
      });
    },
    /**自动登录 */
    super_login() {
      uni.showToast({
        title: n++,
      });
      /**@type {{
          account: string;
          password: string;
          imei: string;
          clientType: number;
          isOK: boolean;
        }} */
      let login_info = uni.getStorageSync("login_info");
      if (login_info.isOK) {
        loginByPwd({
          data: {
            account: login_info.account,
            password: login_info.password,
            ...getSign(login_info.imei, login_info.clientType),
          },
          success(res) {
            let userName = res.username;
            uni.setStorageSync("userInfo", {
              ...res,
              clientType: login_info.clientType,
            });
            uni.setStorageSync("login_type", "online");
            uni.setStorageSync("username", userName);
            uni.setStorageSync("account", login_info.account);
            uni.setStorageSync("uniIdToken", true);
            uni.showToast({
              title: "您已自动登录",
              icon: "none",
              position: "top",
            });
          },
          fail(e) {
            console.error("请求失败：" + e);
            uni.showToast({
              title: "网络异常,请检查网络设置！！",
              icon: "none",
            });
            uni.clearStorageSync();
          },
        });
      }
    },
  },
  onError(error) {
    console.log(
      "ONE ERROR HANDLER TO RULE THEM ALL: Uncaught ReferenceError:" + error
    );
  },
};
</script>

<style>
/* 头条小程序需要把 iconfont 样式放到组件外 */
@import "components/m-icon/m-icon.css";

/*每个页面公共css */
page {
  min-height: 100%;
  display: flex;
  font-size: 14px;
}

input,
textarea,
button {
  font-size: 14px;
}

/* #ifdef MP-BAIDU */
page {
  width: 100%;
  height: 100%;
  display: block;
}

swan-template {
  width: 100%;
  min-height: 100%;
  display: flex;
}

/* 原生组件模式下需要注意组件外部样式 */
custom-component {
  width: 100%;
  min-height: 100%;
  display: flex;
}

/* #endif */

/* #ifdef MP-ALIPAY */
page {
  min-height: 100vh;
}

/* #endif */

/* 原生组件模式下需要注意组件外部样式 */
m-input {
  width: 100%;
  /* min-height: 100%; */
  display: flex;
  flex: 1;
}

.content {
  display: flex;
  flex: 1;
  flex-direction: column;
  background-color: #efeff4;
  padding: 10px;
}

.input-group {
  background-color: #ffffff;
  margin-top: 20px;
  position: relative;
}

.input-group::before {
  position: absolute;
  right: 0;
  top: 0;
  left: 0;
  height: 1px;
  content: "";
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background-color: #c8c7cc;
}

.input-group::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 1px;
  content: "";
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background-color: #c8c7cc;
}

.input-row {
  display: flex;
  flex-direction: row;
  position: relative;
  /* font-size: 18px; */
  line-height: 40px;
}

.input-row .title {
  width: 70px;
  padding-left: 15px;
}

.input-row.border::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 8px;
  height: 1px;
  content: "";
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background-color: #c8c7cc;
}

.btn-row {
  margin-top: 25px;
  padding: 10px;
}

button.primary {
  background-color: #0faeff;
}

.line {
  width: 100%;
  border: 0.5px solid #aaa;
  border-radius: 50%;
}

page {
	background-color: #f8f8f8;
}
</style>
