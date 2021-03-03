import request from "..";
import { sendMs } from "../../../util/config";

const stateName = "发送验证码";

/**
 * 发送验证码
 * @param {Object} option                           接收的数据对象
 * @param {Object} option.data                      接收的数据
 * @param {string} option.data.phoneNum             手机号码
 * @param {string} option.data.codeSerial           哈希码值
 * @param {string} option.data.imei                 IMEI
 * @param {string} option.data.clientType           客户端类型
 * @param {string} option.data.random               4位随机码
 * @param {string} option.data.date                 登入日期
 * @param {string} option.data.time                 登入时间
 * @param {success} option.success                  接收数据函数
 * @param {import("..").fail} option.fail           交互失败函数
 * @param {import("..").complete} option.complete   与服务器交互返回的方法
 */
export default function (option) {
	const { data } = option;
	request({
		url: sendMs,
		method: "POST",
		data: {
			phoneNum: data.phoneNum,
			codeSerial: data.codeSerial,
			imei: data.imei,
			clientType: data.clientType,
			random: data.random,
			date: data.date,
			time: data.time,
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