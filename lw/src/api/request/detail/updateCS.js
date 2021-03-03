import request from "..";
import { updateCommoditySingle } from "../../../util/config";

const stateName = "商品更新";

/**
 * 单品更新
 * @param {Object} option                           接收的数据对象
 * @param {Object} option.data                      传输的数据
 * @param {string} option.data.commodityID          商品ID
 * @param {string} option.data.manufacturerID       厂家ID
 * @param {string} option.data.tagID                标签ID
 * @param {string} option.data.tagCardID            标签芯片ID
 * @param {string} option.data.tagData              标签数据
 * @param {string} option.data.codeEANUPC           EAN/UPC码
 * @param {string} option.data.state                商品状态
 * @param {string} option.data.businessID           账号商家ID
 * @param {string} option.data.account              账号
 * @param {string} option.data.batch_id             批次ID
 * @param {success} option.success                  接收数据函数
 * @param {import("..").fail} option.fail           交互失败函数
 * @param {import("..").complete} option.complete   与服务器交互返回的方法
 */
export default function (option) {
	const { data } = option;
	request({
		url: updateCommoditySingle,
		method: "POST",
		data: {
			commodityID: data.commodityID,
			manufacturerID: data.manufacturerID,
			tagID: data.tagID,
			tagCardID: data.tagCardID,
			tagData: data.tagData,
			codeEANUPC: data.codeEANUPC,
			state: data.state,
			businessID: data.businessID,
			account: data.account,
			batch_id: data.batch_id,
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