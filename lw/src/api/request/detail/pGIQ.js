import request from "..";
import { commodityInfoByAccount } from "../../../util/config";

const stateName = "账户已发布商品信息查询";

/**
 * 账户已发布商品信息查询
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
		url: commodityInfoByAccount,
		method: "POST",
		data: {
			businessID: data.businessID,
			account: data.account
		},
		success(res) {
			console.log(`${stateName}: ${res}`);
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
 * @param {{info_id: string; commodityName: string; codeEANUPC: string; manufacturerID: string; imageURL: string; specificationsMain: string; specificationsNum: string; specifications: {name: string; value: string;}[];}[]} data
 * @returns {void}
 */