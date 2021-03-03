import request from "..";
import { loginBySms } from "../../../util/config";

const stateName = "免密登录";

/**
 * 免密登录
 * @param {Object} option                           接收的数据对象
 * @param {Object} option.data                      接收的数据
 * @param {string} option.data.phoneNum             验证手机号
 * @param {string} option.data.code                 验证码
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
	const { data } = option
	request({
		url: loginBySms,
		method: "POST",
		data: {
			phoneNum: data.phoneNum,
			code: data.code,
			codeSerial: data.clientType,
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
			console.error("请求失败：" + e);
			uni.showToast({
				title: "服务器忙，请稍后再试！！",
				icon: "none",
			});
			option.fail(`${stateName}--fail: ${msg}`);
		},
		complete(msg) {
			option.complete && option.complete(`${stateName}--complete: ${msg}`);
		}
	});
}

/**
 * @callback success 与服务器交互成功返回的方法
 * @param {{account: string; age: string; businessID: string; clientType: number; date: string; imei: string; password: string; phoneNum: string; random: string; serial: string; sex: string; time: string; userId: string; username: string;}} data
 * @returns {void}
 */