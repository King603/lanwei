import request from ".";
import { appId, appS } from "../../util/config";

/**
 * 微信获取openID
 * @param {number} code                   小程序用户临时登录凭证 code值(5分钟失效)
 * @param {Object} option                 接收的数据对象
 * @param {success} option.success        接收数据函数
 * @param {import(".").fail} option.fail  交互失败函数
 */
export default function (code, option) {
	request({
		url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appS}&js_code=${code}&grant_type=authorization_code`,
		method: "GET",
		success(data) {
			option.success(data.openid);
		},
		fail(msg) {
			uni.showToast({
				title: "openid获取失败",
				icon: "none",
			});
			option.fail(msg);
		},
	});
}

/**
 * @callback success 与服务器交互成功返回的方法
 * @param {string} openid
 * @returns {void}
 */