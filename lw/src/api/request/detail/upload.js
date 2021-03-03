import { apiHost, port } from "../../../util/config";

const stateName = "上传文件";

/**
 * 上传文件
 * @param {string} filePath                         文件路径
 * @param {Object} option                           接收的数据对象
 * @param {string} option.url                       上传接口
 * @param {success} option.success                  接收数据函数
 * @param {import("..").fail} option.fail           交互失败函数
 * @param {import("..").complete} option.complete   与服务器交互返回的方法
 */
export default function (filePath, option) {
	uni.uploadFile({
		url: apiHost + port + option.url,
		filePath,
		name: "file",
		header: { "content-type": "multipart/form-data" },
		formData: { user: "test" },
		success: (uploadFileRes) => {
			/**@type {{msg:string; code:number; isSuc:boolean; data:string;}} */
			let result = JSON.parse(uploadFileRes.data);
			if (result.code == 1) option.success(result.data);
			else option.fail(`${stateName}--success: ${result.msg}`);
		},
		fail(res) {
			option.fail(`${stateName}--fail: ${res.errMsg}`);
			console.error(res.errMsg);
		},
	});
}

/**
 * @callback success 与服务器交互成功返回的方法
 * @param {string} data 文件路径
 * @returns {void}
 */
