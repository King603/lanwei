import request from "..";
import { batchByAccount } from "../../../util/config";

const stateName = "已发布批次查询";

/**
 * 已发布批次查询
 * @param {Object} option                           接收的数据对象
 * @param {Object} option.data                      传输的数据
 * @param {string} option.data.businessID           商家ID
 * @param {string} option.data.account              账号
 * @param {success} option.success                  接收数据函数
 * @param {import("..").fail} option.fail           交互失败函数
 * @param {import("..").complete} option.complete   与服务器交互返回的方法
 */
export default function (option) {
	const { data } = option;
	request({
		url: batchByAccount,
		method: "POST",
		data: {
			businessID: data.businessID,
			account: data.account
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
 * @param {{batch_id: string; codeEANUPC: string; manufacturerID: string; total: string; totaled: string; info_id: string;}[]} data
 * @returns {void}
 */