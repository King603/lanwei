import request from "..";
import { reg } from "../../../util/config";

const stateName = "注册";

/**
 * 注册
 * @param {Object} option                           接收的数据对象
 * @param {Object} option.data                      接收的数据
 * @param {string} option.data.account              账号
 * @param {string} option.data.username             用户名
 * @param {string} option.data.password             密码
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
		url: reg,
		method: "POST",
		data: {
			account: data.account,
			username: data.username,
			password: data.password,
			phoneNum: data.phoneNum,
			codeSerial: data.codeSerial,
			imei: data.imei,
			clientType: data.clientType,
			random: data.random,
			date: data.date,
			time: data.time,
		},
		success(res) {
			uni.showToast({ title: res.msg, icon: "none" });
			if (res.code == 1) option.success(res.data[0]);
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
 * @param {{ userId: string; account: string; password: string; phoneNum: string; username: string; age: string; sex: string; serial: string; imei: string; clientType: number; random: string; date: string; time: string; businessID: string;}} data
 * @returns {void}
 */