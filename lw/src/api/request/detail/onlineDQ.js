import request from "..";
import { queryPageShowInfo } from "../../../util/config";

const stateName = "在线展示查询";

/**
 * 在线展示查询
 * @param {Object} option                           接收的数据对象 
 * @param {Object} option.data                      传输的数据
 * @param {number} option.data.page                 显示的页面：0--主页
 * @param {success} option.success                  接收数据函数
 * @param {import("..").fail} option.fail           交互失败函数
 * @param {import("..").complete} option.complete   与服务器交互返回的方法
 */
export default function (option) {
	const { data } = option;
	request({
		url: queryPageShowInfo,
		data: { page: data.page },
		method: "POST",
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
 * @param {({ title: string; temp: { img: string; text: string; src: string; param: string;}[]; content?: undefined;} | { title: string; content: { img: string; text: string; src: string; param: string;}[]; temp?: undefined;})[]} data
 * @returns {void}
 */