
import bytesAndStr from "../BytesAndString.js";
import MifareClassic from "./MifareClassic.js";
import Ndef from "./Ndef.js";
//import wxtest from "./test.js";


const aid_list = [
	"F0000000030001",
];

/**
 * 
 * @param {number} nStatusCode 
 */
function nfcStatus(nStatusCode) {
	switch (nStatusCode) {
		case 0: return {
			ERROR: "OK",
			resCode: 0
		};
		case 13000: return {
			ERROR: "当前设备不支持NFC",
			resCode: -1001
		};
		case 13001: return {
			ERROR: "当前设备支持NFC，但系统NFC开关未开启",
			resCode: -1002
		};
		case 13002: return {
			ERROR: "当前设备支持NFC，但不支持HCE",
			resCode: -1001
		};
		case 13003: return {
			ERROR: "AID列表参数格式错误",
			resCode: -1001
		};
		case 13004: return {
			ERROR: "未设置微信为默认NFC支付应用",
			resCode: -1004
		};
		case 13005: return {
			ERROR: "未知错误",
			resCode: -1111
		};
		case 13006: return {
			ERROR: "注册AID失败",
			resCode: -1111
		};
		default: return {
			ERROR: "未知错误",
			resCode: -1111
		};
	}
}

/**
 * 
 * @param {WechatMiniprogram.NFCAdapter} nfcAdapter 
 * @param {string[]} techs 
 */
function getNFCCard(nfcAdapter, techs) {
	console.log("getNFCAdapter", techs);
	switch (true) {
		case techs.includes("NDEF"):
			console.log("getNFCCard:", 1);
			return new Ndef(nfcAdapter.getNdef());
		case techs.includes("NFC-A"):
		case techs.includes("MIFARE Classic"):
			console.log("getNFCCard:", 2);
			// return new mifareClassic(nfcAdapter.getMifareClassic());
			return new MifareClassic(nfcAdapter.getNfcA());
		case techs.includes("NFC-B"):
		case techs.includes("NFC-F"):
		case techs.includes("NFC-V"):
			console.log("getNFCCard:", 3);
			uni.showToast({
				title: "暂无此类型卡的读写功能",
				icon: "none",
			});
			return null;
		default: console.log("getNFCCard:", 4);
	}
}

export default {
	/**
	 * 读NFC
	 * @param {Object} option
	 * @param {success} option.success 成功回调
	 * @param {fail} option.fail 失败回调
	 */
	readDataAsyn(option) {
		console.log("readDataAsyn");
		this.listen({
			success: (nfcAdapter, res) => {
				var nfcCard = getNFCCard(nfcAdapter, res.techs);
				nfcCard.readData({ msg: res, success: option.success, fail: option.fail });
			},
			fail: option.fail
		});
	},

	/**
	 * 写NFC
	 * @param {Object} option
	 * @param {success} option.success 成功回调
	 * @param {fail} option.fail 失败回调
	 */
	writeDataAsyn(option) {
		this.listen({
			success: (nfcAdapter, res) => {
				/**@type {MifareClassic} */
				var nfcCard = getNFCCard(nfcAdapter, res.techs);
				nfcCard.writeData({ data: res.messages, success: option.success, fail: option.fail });
			},
			fail: option.fail
		});
	},

	/**
	 * 监听
	 * @param {Object} option
	 * @param {success} option.success 成功回调
	 * @param {fail} option.fail 失败回调
	 * @callback success
	 * @param {{CardData: string, CardInfo: string}} nfcAdapter
	 * @param {WechatMiniprogram.OnDiscoveredCallbackResult} res
	 * @returns {void}
	 * @callback fail
	 * @param {{resCode: number; ERROR: string;}} res
	 * @param {string} errMsg
	 * @returns {void}
	 */
	listen(option) {
		/**@type {WechatMiniprogram.NFCAdapter} */
		var nfcAdapter;
		function startDiscovery() {
			nfcAdapter.startDiscovery({
				success: (res) => {
					console.log('开始监听贴卡', res);
				},
				fail(res) {
					console.log("监听有误", res.errMsg);
					option.fail && option.fail({ resCode: -1111 }, res.errMsg);
				}
			})
		}

		//wx = new wxtest();
		function onDiscovered() {
			nfcAdapter = wx.getNFCAdapter();
			nfcAdapter.onDiscovered((res) => {
				console.log("onDiscovered", JSON.stringify(res.techs));
				console.log("onDiscovered", JSON.stringify(res));
				option.success && option.success(nfcAdapter, res);
			});
		}

		wx.startHCE({
			aid_list,
			success(res) {

				let nStatus = nfcStatus(res.errCode);
				if (nStatus.resCode == 0) {
					onDiscovered();

					startDiscovery();
				} else {
					option.fail && option.fail(nStatus);
				}
			},
			fail(res) {
				option.fail && option.fail({ resCode: -1001, ERROR: res.errMsg });
			}
		})

	}
}