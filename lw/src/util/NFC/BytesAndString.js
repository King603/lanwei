/**
 * 字节流与字符串相互转换
 */
export default {
	/**
	 * 16进制字符串转字节流
	 * @param {string} strHex : 16进制字符串
	 * @return {ArrayBuffer} : 字节流
	 */
	HexStrToBytes(strHex) {
		var len = strHex.length;
		if (len % 2 != 0) {
			return null;
		}

		var byteBuf = new ArrayBuffer(len / 2);
		var uint8 = new Uint8Array(byteBuf);
		for (let i = 0; i < len; i++) {
			let str = strHex.substr(i * 2, 2);
			let byte = parseInt(str, 16);

			uint8[i] = byte;
		}
		return uint8;
	},

	/**
	 * 字节流转16进制字符串
	 * @param {ArrayBuffer} arrBuffer: 字节流
	 * @return {string} : 16进制字符串
	 */
	BytesTosHexStr(arrBuffer) {
		var uint8 = new Uint8Array(arrBuffer);
		var strHexData = "";
		var strHexByte;

		for (let i = 0; i < uint8.length; i++) {
			let strByte = uint8[i].toString(16);
			strByte = strByte.padStart(2, "0");
			strHexData += strByte;
		}

		return strHexData;
	}
}

