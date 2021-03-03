import request from "..";
import { commodityByEANUPC } from "../../../util/config";

const stateName = "在线商品信息查询";

/**
 * 在线商品信息查询
 * @param {Object} option                           接收的数据对象 
 * @param {Object} option.data                      接收的数据
 * @param {string} option.data.codeEANUPC           EAN/UPC码 13位
 * @param {success} option.success                  接收数据函数
 * @param {import("..").fail} option.fail           交互失败函数
 * @param {import("..").complete} option.complete   与服务器交互返回的方法
 */
export default function (option) {
	const { data } = option;
	request({
		url: commodityByEANUPC,
		data: { codeEANUPC: data.codeEANUPC },
		method: "POST",
		success(res) {
			console.log(`${stateName}: `, res);
			if (res.code == 1) option.success(res.data);
			else option.fail(`${stateName}--success: ${res.msg || "查无此商品"}`);
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
 * @param {{commodityName: string; commodityID: string; imageURL: string; specificationsMain: string; specificationsNum: string; specifications: {name: string; value: string;}[];}} data
 * @returns {void}
 */