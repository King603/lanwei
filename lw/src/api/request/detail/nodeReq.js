import request from "..";
import { nodeInfo } from "../../../util/config";

const stateName = "节点信息";

/**
 * 节点信息
 * @param {Object} option                           接收的数据对象
 * @param {Object} option.data                      接收的数据
 * @param {string} option.data.nodeID               节点(商家)ID
 * @param {string} option.data.account              账号
 * @param {success} option.success                  接收数据函数
 * @param {import("..").fail} option.fail           交互失败函数
 * @param {import("..").complete} option.complete   与服务器交互返回的方法
 */
export default function (option) {
	const { data } = option;
	request({
		url: nodeInfo,
		method: "POST",
		data: {
			nodeID: data.nodeID,
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
 * @param {{nodeId: string; nodeName: string; nodeArr: string[]; establishTime: string; imageURL: string; certificateNum: number; certificate: {name: string; imageURL: string;}[];}} data
 * @returns {void}
 */