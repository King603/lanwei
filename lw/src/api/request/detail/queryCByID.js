import request from "..";
import { commodityInfo } from "../../../util/config";

const stateName = "单品信息查询";

/**
 * 单品信息查询
 * @param {Object} option                           接收的数据对象 
 * @param {Object} option.data                      传输的数据
 * @param {string} option.data.commodityID          商品ID 
 * @param {string} option.data.manufacturerID       厂商ID
 * @param {string} option.data.tagID                标签ID
 * @param {string} option.data.tagData              标签数据
 * @param {string} [option.data.account = null]     账号
 * @param {success} option.success                  接收数据函数
 * @param {import("..").fail} option.fail           交互失败函数
 * @param {import("..").complete} option.complete   与服务器交互返回的方法
 */
export default function (option) {
	const { data } = option;
	request({
		url: commodityInfo,
		method: "POST",
		data: {
			commodityID: data.commodityID,
			manufacturerID: data.manufacturerID,
			tagID: data.tagID,
			tagData: data.tagData,
			account: data.account || null,
		},
		success(res) {
			if (res.code == 1) option.success(res.data);
			else option.fail(`${stateName}--success: ${res.msg}`);
		},
		fail(msg) {
			option.fail(`${stateName}--fail: ${msg}`);
		},
		complete(msg) {
			option.complete && option.complete(`${stateName}--complete: ${msg}`);
		}
	});
}

/**
 * @callback success 与服务器交互成功返回的方法
 * @param {{commodityInfo: {info_id: string; commodityName: string; codeEANUPC: string; manufacturerID: string; imageURL: string; specificationsMain: string; specificationsNum: number; specifications: {name: string; value: string;}[];}, commoditySingle: {commodityID: string; tagID: string; tagCardID: string; tagData: string; codeEANUPC: string; businessID: string; state: string; batch_id: string; account: string; businessNode: {nodeID: string; nodeType: string; nodeTypeName: string; businessName: string; address: string; state: string; stateName: string; businessID: string;}[];}[];}} data
 * @returns {void}
 */