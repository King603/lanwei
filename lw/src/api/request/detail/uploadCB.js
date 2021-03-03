import request from "..";
import { commodityBatchUp } from "../../../util/config";

const stateName = "添加批次";

/**
 * 添加批次
 * @param {Object} option                           接收的数据对象
 * @param {Object} option.data                      传输的数据
 * @param {string} option.data.manufacturerID       厂家ID
 * @param {string} option.data.codeEANUPC           EAN/UPC码
 * @param {number} option.data.total                该批次单品数量
 * @param {number} option.data.info_id              信息ID
 * @param {success} option.success                  接收数据函数
 * @param {import("..").fail} option.fail           交互失败函数
 * @param {import("..").complete} option.complete   与服务器交互返回的方法
 */
export default function (option) {
	const { data } = option;
	request({
		url: commodityBatchUp,
		method: "POST",
		data: {
			manufacturerID: data.manufacturerID,
			codeEANUPC: data.codeEANUPC,
			total: data.total,
			info_id: data.info_id,
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
 * @param {string} batch_id 批次ID
 * @returns {void}
 */