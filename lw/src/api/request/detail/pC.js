import request from "..";
import { purchaseCommodity } from "../../../util/config";

const stateName = "商品购买";

/**
 * 商品购买
 * @param {Object} option                           接收的数据对象 
 * @param {Object} option.data                      传输的数据
 * @param {string} option.data.commodityID          商品ID 
 * @param {string} option.data.manufacturerID       厂商ID
 * @param {string} option.data.tagID                标签ID
 * @param {string} option.data.tagData              标签数据
 * @param {string} option.data.businessID           购买者商家ID
 * @param {string} option.data.account              账号
 * @param {success} option.success                  接收数据函数
 * @param {import("..").fail} option.fail           交互失败函数
 * @param {import("..").complete} option.complete   与服务器交互返回的方法
 */
export default function (option) {
	const { data } = option;
	request({
		url: purchaseCommodity,
		method: "POST",
		data: {
			commodityID: data.commodityID,
			manufacturerID: data.manufacturerID,
			tagID: data.tagID,
			tagData: data.tagData,
			businessID: data.businessID,
			account: data.account,
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
 * @param {null} data
 * @returns {void}
 */