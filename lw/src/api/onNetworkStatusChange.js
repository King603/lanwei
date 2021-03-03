/**
 * 检测网络状态
 * @param {Object} option        接收的数据对象
 * @param {callback} option.none 无网络状态
 * @param {callback} option.net  数据网络状态
 * @param {callback} option.wifi WiFi网络状态
 * @callback callback
 * @returns {void}
 */
export default function (option) {
	return new Promise((resolve, reject) => {
		uni.onNetworkStatusChange(({ isConnected, networkType }) => {
			console.log(isConnected); // 当前是否有网络连接
			console.log(networkType); // 网络类型
			switch (networkType) {
				case "none":
					option.none && option.none();
					resolve();
					break;
				case "2g": case "3g": case "4g": case "ethernet":
					option.net && option.net();
					resolve();
					break;
				case "wifi":
					option.wifi && option.wifi();
					resolve();
					break;
				default:
					reject();
					throw new Error("新的网络类型" + networkType);
			}
		});
	});
}