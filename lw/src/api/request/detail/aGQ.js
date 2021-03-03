import request from "..";
import { commodity_goods } from "../../../util/config";

const stateName = "账户关联商品查询";

/**
 * 账户关联商品查询
 * @param {Object} option                           接收的数据对象
 * @param {Object} option.data                      接收的数据
 * @param {string} option.data.businessID           商家ID
 * @param {string} option.data.account              账号
 * @param {success} option.success                  接收数据函数
 * @param {import("..").fail} option.fail           交互失败函数
 * @param {import("..").complete} option.complete   与服务器交互返回的方法
 */
export default function (option) {
	const { data } = option;
	request({
		url: commodity_goods,
		data: {
			businessID: data.businessID,
			account: data.account
		},
		method: "POST",
		success(res) {
			console.log(`${stateName}: ${res}`)
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
 * @param {{commodityID: string; tagID: string; tagCardID: string; tagData: string; codeEANUPC: string; businessID: string; state: number; batch_id: string; account: string; businessNode: {nodeID: string; nodeType: string; nodeTypeName: string; businessName: string; address: string; state: string; stateName: string; businessID: string;}[];}[]} data
 * @returns {void}
 */