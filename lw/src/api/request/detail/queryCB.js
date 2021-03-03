import request from "..";
import { commodityBatch } from "../../../util/config";

const stateName = "商品批次查询";

/**
 * 商品批次查询
 * @param {Object} option                           接收的数据对象 
 * @param {Object} option.data                      传输的数据
 * @param {string} option.data.batch_id             批次ID
 * @param {string} [option.data.account = null]     账号
 * @param {success} option.success                  接收数据函数
 * @param {import("..").fail} option.fail           交互失败函数
 * @param {import("..").complete} option.complete   与服务器交互返回的方法
 */
export default function (option) {
	const { data } = option;
	request({
		url: commodityBatch,
		method: "POST",
		data: {
			batch_id: data.batch_id,
			account: data.account || null
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
 * @param {{batch_id: string; codeEANUPC: string; manufacturerID: string; total: number; totaled: number; info_id: number;}} data
 * @returns {void}
 */