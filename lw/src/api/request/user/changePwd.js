import request from "..";
import { pwd } from "../../../util/config";

let stateName = "修改密码";

/**
 * 修改密码
 * @param {Object} option                           接收的数据对象
 * @param {Object} option.data                      接收的数据
 * @param {string} option.data.password             新密码
 * @param {string} option.data.account              账号
 * @param {string} option.data.phoneNum             绑定的手机号
 * @param {success} option.success                  接收数据函数
 * @param {import("..").fail} option.fail           交互失败函数
 * @param {import("..").complete} option.complete   与服务器交互返回的方法
 */
export default function (option) {
	const { data } = option;
	request({
		url: pwd,
		method: "POST",
		data: {
			password: data.password,
			account: data.account,
			phoneNum: data.phoneNum
		},
		success(res) {
			if (res.code == 1) option.success(res.data);
			else option.fail(res.msg);
		},
		fail(msg) {
			option.fail(msg);
		},
		complete(msg) {
			option.complete && option.complete(msg);
		}
	});
}

/**
 * @callback success 与服务器交互成功返回的方法
 * @param {null} data
 * @returns {void}
 */