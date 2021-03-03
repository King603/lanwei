import * as config from "../util/config";

const key = "images"
/**
 * 改变图片初始地址为当前服务器地址
 * @param {string} url 图片原始地址
 * @returns {string}   当前服务器地址
 */
export default function (url) {
	if (url == "" || url.indexOf(key) == -1) return;
	let index = url.indexOf(key);
	let path = config.apiHost + config.mainPort + url.substring(index);
	return path;
}