import { apiHost, port } from "../../util/config";

/**
 * 封装uni-app的交互方法
 * @param {Object} option                                                                                         接收的数据对象 
 * @param {AnyObject} option.data                                                                                 传输的数据
 * @param {string} option.url                                                                                     数据接口
 * @param {"POST" | "OPTIONS" | "GET" | "HEAD" | "PUT" | "DELETE" | "TRACE" | "CONNECT"} [option.method = "GET"]  默认为 GET 可以是：OPTIONS，GET，HEAD，POST，PUT，DELETE，TRACE，CONNECT
 * @param {success} option.success                                                                                接收数据函数
 * @param {fail} option.fail                                                                                      交互失败函数
 * @param {complete} option.complete                                                                              与服务器交互返回的方法
 * 
 * @example
 *  request({
 *  	url: reg,
 *  	method: "POST",
 *  	data: {
 *  		account: data.account,
 *  		username: data.username,
 *  		password: data.password,
 *  		phoneNum: data.phoneNum,
 *  		codeSerial: data.codeSerial,
 *  		imei: data.imei,
 *  		clientType: data.clientType,
 *  		random: data.random,
 *  		date: data.date,
 *  		time: data.time,
 *  	},
 *  	success(res) {
 *  		uni.showToast({ title: res.msg, icon: "none" });
 *  		if (res.code == 1) option.success(res.data[0]);
 *  		else option.fail(`${stateName}--success: ${res.msg}`);
 *  	},
 *  	fail(msg) {
 *  		option.fail(`${stateName}--fail: ${msg}`);
 *  	},
 *  	complete(msg) {
 *  		option.complete && option.complete(`${stateName}--complete: ${msg}`);
 *  	}
 * });
 */
export default function (option) {
	uni.request({
		url: apiHost + port + option.url,
		data: option.data,
		method: option.method || "GET",
		success(res) {
			console.log(res);
			if (res.statusCode == 404) return;
			let data = res.data;
			if (typeof data == ArrayBuffer)
				data = String.fromCharCode.apply(null, new Uint16Array(data));

			if (typeof data == String)
				data = JSON.parse(data);

			option.success && option.success(data);
		},
		fail(res) {
			console.log(res)
			option.fail && option.fail(res.errMsg);
			throw new Error(res.errMsg);
		},
		complete(res) { option.complete && option.complete(res.errMsg); },
	});
}

/**
 * @callback success 与服务器交互成功返回的方法
 * @param {{ msg: string; code: number; isSuc: boolean; data: AnyObject }} data 开发者服务器返回的数据
 * @returns {void}
 * @callback fail 与服务器交互失败返回的方法
 * @param {string} errMsg 错误信息
 * @returns {void}
 * @callback complete 与服务器交互返回的方法
 * @param {string} errMsg 错误信息
 * @returns {void}
 */