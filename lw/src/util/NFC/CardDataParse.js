import * as config from "../config.js";
/**
 * Card数据解析，构造
 */
export default {
	/**
	 * 解析
	 * @param {string} strData : 卡数据
	 * @returns {{TagID: string;CommodityID: string;ManufacturerID: string;}}
	 * TagID						标签ID
	 * CommodityID			商品ID
	 * ManufacturerID		厂商ID
	 */
	parse: function (strData) {
		if (strData != null && strData.length >= 42) {
			let { strTagID, strSPId, strCSId } = config.getNfcId(strData, 25);
			return { TagID: strTagID, CommodityID: strSPId, ManufacturerID: strCSId };
		}
		console.log("数据有误");
		return null;
	},

	/**
	 * 构造
	 * @param {string} strTagID 标签ID
	 * @param {string} strCommodityID 商品ID
	 * @param {string} strManufacturerID 厂商ID
	 * @param {string} strRandom 设备4位随机码
	 * @return {string} : 卡数据
	 *	
	 */
	constructorRandom(strTagID, strCommodityID, strManufacturerID, strRandom) {
		const length = 32;
		let strData = "";
		if (strTagID == null || strTagID.length < 25) {
			console.log("标签ID有误");
			return null;
		}
		strData += strTagID.padEnd(length, "0");

		if (strCommodityID == null || strCommodityID.length < 25) {
			console.log("商品ID有误");
			return null;
		}
		strData += (strCommodityID + strRandom).padEnd(length, "0");

		if (strManufacturerID == null || strManufacturerID.length < 25) {
			console.log("厂商ID有误");
			return null;
		}
		strData += strManufacturerID.padEnd(length, "0");

		return strData;
	},
	/**
	 * 构造
	 * @param {string} strTagID 标签ID
	 * @param {string} strCommodityID 商品ID
	 * @param {string} strManufacturerID 厂商ID
	 * @return {string} : 卡数据
	 *	
	 */
	constructor(strTagID, strCommodityID, strManufacturerID) {
		const length = 32;
		let strData = "";
		if (strTagID == null || strTagID.length < 25) {
			console.log("标签ID有误");
			return null;
		}
		strData += strTagID.padEnd(length, "0");

		if (strCommodityID == null || strCommodityID.length < 25) {
			console.log("商品ID有误");
			return null;
		}
		strData += strCommodityID.padEnd(length, "0");

		if (strManufacturerID == null || strManufacturerID.length < 25) {
			console.log("厂商ID有误");
			return null;
		}
		strData += strManufacturerID.padEnd(length, "0");

		return strData;
	}
}