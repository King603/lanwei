/**
 * @param {Object} option           接收的数据对象 
 * @param {success} option.success  接口调用成功，返回网络类型 networkType
 * @param {other} option.fail       接口调用失败的回调函数
 * @param {other} option.complete   接口调用结束的回调函数（调用成功、失败都会执行）
 * @callback success
 * @param {string} type
 * @callback other
 * @param {} res
 */
export default (option) => {
	return new Promise((resolve, reject) => {
		uni.getNetworkType({
			success(res) {
				option.success && option.success(res.networkType);
				resolve();
			},
			fail(res) {
				option.fail && option.fail(res);
				reject();
			},
			complete(res) {
				option.complete && option.complete(res);
				resolve();
			}
		});
	});
}
