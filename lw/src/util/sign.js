/**
 * 生成sign规则
 * @param {string} IMEI 			国际移动设备识别码
 * @param {string} deviceType 设备类型
 */
export function getSign(IMEI, deviceType) {
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
	return {
		/**流水号 */
		serial: `${IMEI}${deviceType}${(parseInt(Math.random() * 10000)).toString().padStart(4, "0")}`,
		/**生成日期 */
		date: `${year}-${month}-${date}`,
		/**生成时间 */
		time: `${hours}:${minutes}:${seconds}`,
	}
}