import request from ".";
import { update } from "../../util/config";

/**
 * 版本更新
 * @param {success} callback 接收数据函数
 */
export default function (callback) {
	request({
		url: update,
		method: "POST",
		success(res) {
			if (res.code == 1) callback(res.data);
		}
	});
}

/**
 * @callback success 与服务器交互成功返回的方法
 * @param {{versions: string}} data
 * @returns {void}
 */