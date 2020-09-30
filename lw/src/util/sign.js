/**
 * 生成sign规则
 * @param {string} IMEI 			国际移动设备识别码
 * @param {number} clientType 设备类型

 */
export function getSign(IMEI, clientType) {
	let now = new Date();
	let year = now.getFullYear();
	/**
	 * 补长度
	 * @param {number} num 时间值
	 */
	function toString(num) {
		return num.toString().padStart(2, "0");
	}
	let month = toString(now.getMonth() + 1);
	let date = toString(now.getDate());
	let hours = toString(now.getHours());
	let minutes = toString(now.getMinutes());
	let seconds = toString(now.getSeconds());
	/**标志对象 */
	let sign = {
		/**IMEI */
		imei: IMEI,
		/**终端类型 */
		clientType: clientType,
		/**4位随机数 */
		random: parseInt(Math.random() * 10000).toString().padStart(4, "0"),
		/**日期 */
		date: `${year}-${month}-${date}`,
		/**时间 */
		time: `${hours}:${minutes}:${seconds}`
	}

	let hash = ((sign) => {
		let str = sign.imei + sign.clientType + sign.date + sign.time + sign.random;
		let hash = 0;
		if (str.length !== 0)
			for (let i = 0; i < str.length; i++) {
				hash = (hash << 5) - hash + str.charCodeAt(i);
				hash &= hash; // Convert to 32bit integer
			}
		return hash;
	})(sign);
	return { ...sign, hash };
}