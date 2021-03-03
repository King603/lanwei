import request from "..";
import { getCommodityID } from "../../../util/config";

const stateName = "获取商品ID";

/**
 * 获取商品ID
 * @param {Object} option                           接收的数据对象
 * @param {Object} option.data                      传输的数据
 * @param {string} option.data.tagCardID            标签芯片ID
 * @param {string} option.data.codeEANUPC           EAN/UPC码,国家商品标准条码
 * @param {string} option.data.commodityName        商品名称
 * @param {string} option.data.account              账号
 * @param {success} option.success                  接收数据函数
 * @param {import("..").fail} option.fail           交互失败函数
 * @param {import("..").complete} option.complete   与服务器交互返回的方法
 */
export default function (option) {
	const { data } = option;
	request({
		url: getCommodityID,
		method: "POST",
		// data: option.data,
		data: {
			tagCardID: data.tagCardID,
			codeEANUPC: data.codeEANUPC,
			commodityName: data.commodityName,
			account: data.account
		},
		success(res) {
			if (res.code == 1) option.success(res.commodityID);
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
 * @param {string} commodityID：商品ID，String，25位 codeEANUPC前12位 + 4商品编号 + 8位0 + 1位奇偶校验位
 * @returns {void}
 */