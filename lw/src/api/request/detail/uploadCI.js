import request from "..";
import { commodityUp } from "../../../util/config";

const stateName = "添加商品";

/**
 * 添加商品
 * @param {Object} option                                                               接收的数据对象
 * @param {Object} option.data                                                          传输的数据
 * @param {Object} option.data.commodityInfo                                            商品信息
 * @param {string} option.data.commodityInfo.commodityName                              商品名称
 * @param {string} option.data.commodityInfo.codeEANUPC                                 EAN/UPC码，国家商品标准条码
 * @param {string} option.data.commodityInfo.manufacturerID                             厂商ID
 * @param {string} option.data.commodityInfo.imageURL                                   图片地址
 * @param {string} option.data.commodityInfo.specificationsMain                         主要规格
 * @param {number} option.data.commodityInfo.specificationsNum                          规格数量 大于等于0
 * @param {{name: string; value: string;}[]} option.data.commodityInfo.specifications   规格信息列表
 * @param {string} option.data.account                                                  账号
 * @param {success} option.success                                                      接收数据函数
 * @param {import("..").fail} option.fail                                               交互失败函数
 * @param {import("..").complete} option.complete                                       与服务器交互返回的方法
 */
export default function (option) {
	const { data } = option;
	const { commodityInfo: info } = data;
	request({
		url: commodityUp,
		method: "POST",
		data: {
			commodityInfo: {
				commodityName: info.commodityName,
				codeEANUPC: info.commodityName,
				manufacturerID: info.manufacturerID,
				imageURL: info.imageURL,
				specificationsMain: info.specificationsMain,
				specificationsNum: info.specificationsNum,
				specifications: info.specifications,
			},
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
 * @param {string} info_id 信息ID
 * @returns {void}
 */