import bytesAndStr from "../BytesAndString.js";

/**默认密匙 */
export const KEY_DEFAULT = 'FFFFFFFFFFFF';

export default class {
	/**
	 * 构造器
	 * @param {WechatMiniprogram.NfcA} nfcAdapter 
	 */
	constructor(nfcAdapter) {
		this.m1Card = nfcAdapter;
	}
	/**获取适配器 */
	getAdapter() {
		return this.m1Card;
	}
	/**
	 * 
	 * @param {number} nSectorNo 
	 */
	sectorToBlock(nSectorNo) {
		return nSectorNo < 32
			? nSectorNo * 4
			: 32 * 4 + (nSectorNo - 32) * 16;
	}
	/**
	 * 
	 * @param {number} cmd 
	 * @param {number} nSectorNo 
	 * @param {string} strHex 
	 */
	cmdKey(cmd, nSectorNo, strHex) {
		let bufferCmd = new ArrayBuffer(12);
		let uint8Cmd = new Uint8Array(bufferCmd);

		let byteKey = bytesAndStr.HexStrToBytes(strHex);

		uint8Cmd[0] = cmd;
		uint8Cmd[1] = this.sectorToBlock(nSectorNo);


		uint8Cmd.set(this.uint8Id, 2);
		uint8Cmd.set(byteKey, 6);

		return bufferCmd;
	}
	/**
	 * 
	 * @param {number} nSectorNo 扇区号
	 * @param {string} strKeyA A区密匙
	 */
	cmdKeyA(nSectorNo, strKeyA) {
		return this.cmdKey(0x60, nSectorNo, strKeyA);
	}
	/**
	 * 
	 * @param {number} nSectorNo 
	 * @param {string} strKeyB 
	 */
	cmdKeyB(nSectorNo, strKeyB) {
		return this.cmdKey(0x61, nSectorNo, strKeyB);
	}
	/**
	 * 
	 * @param {number} blockIndex 
	 */
	cmdReadBlock(blockIndex) {
		let bufferCmd = new ArrayBuffer(6);
		let uint8Cmd = new Uint8Array(bufferCmd);

		uint8Cmd[0] = 0x30;
		uint8Cmd[1] = blockIndex;

		uint8Cmd.set(this.uint8Id, 2);
		return bufferCmd;
	}
	/**
	 * 
	 * @param {number} blockIndex 
	 * @param {string} strData 
	 */
	cmdWriteBlock(blockIndex, strData) {
		let len = strData.length / 2;
		let bufferCmd = new ArrayBuffer(len + 2);
		let uint8Cmd = new Uint8Array(bufferCmd);

		uint8Cmd[0] = 0xA0;
		uint8Cmd[1] = blockIndex;

		uint8Cmd.set(bytesAndStr.HexStrToBytes(strData), 2);

		return bufferCmd;
	}

	/**
	 * 
	 * @param {Object} option
	 * @param {Object} option.msg 
	 * @param {ArrayBuffer} option.msg.id 
	 * @param {ArrayBuffer} option.msg.type 
	 * @param {ArrayBuffer} option.msg.payload 
	 * @param {success} [option.success = () => { }] 
	 * @param {fail} [option.fail = () => { }] 
	 * 
	 * @callback success
	 * @param {{CardData: string; CardInfo: ArrayBuffer;}} res
	 * @returns {void}
	 * @callback fail
	 * @param {{resCode: number; ERROR: string}} res
	 * @returns {void}
	 */
	readData({ msg, success, fail }) {
		success = success || (() => { });
		fail = fail || (() => { });

		this.uint8Id = new Uint8Array(msg.id);

		//指令组合
		let bufferCmd = new ArrayBuffer();

		let keyACmd = this.cmdKeyA(2, KEY_DEFAULT);

		let nBlockNo = this.sectorToBlock(2);
		let strData = "";
		let arrBufData = [];
		for (let i = 0; i < 3; i++) {
			arrBufData[i] = this.cmdReadBlock(nBlockNo + i);
			console.log("readData cmd" + i, arrBufData[i])
		}
		console.log("readData cmd", arrBufData)

		let nBlockCount = 0;

		//执行	
		this.m1Card.connect({
			success: () => {
				readData_authenticateSectorWithKeyA(this.m1Card);
			},
			fail: () => {
				this.m1Card.close();
				console.log("连接失败");
				fail({ resCode: -1011, ERROR: "连接失败" });
			}
		});
		/**
		 * 
		 * @param {WechatMiniprogram.NfcA} m1Card 
		 */
		function readData_authenticateSectorWithKeyA(m1Card) {
			console.log("keyACmd", keyACmd)
			m1Card.transceive({
				data: keyACmd,
				success() {
					readData_readBlock(m1Card);
				},
				fail() {
					m1Card.close(m1Card);
					console.log("密码A认证失败");
					fail({ resCode: -1013, ERROR: "密码A认证失败" });
				},
			});
		}
		/**
		 * 
		 * @param {WechatMiniprogram.NfcA} m1Card 
		 */
		function readData_readBlock(m1Card) {
			m1Card.transceive({
				data: arrBufData[nBlockCount],
				success(res) {
					if (res.data != null
						|| res.data != undefined
						|| res.data.length > 0) {
						strData += bytesAndStr.BytesTosHexStr(res.data);
					}
					console.log("res" + nBlockNo, strData)
					console.log("res" + nBlockNo, res.data)

					if (++nBlockCount < 3) {
						console.log("nBlockCount", nBlockCount)
						readData_readBlock(m1Card);
					} else {
						m1Card.close();
						success({
							CardData: strData,
							CardInfo: msg.id
						});
						strData = null;
					}
				},
				fail(arrBufRes) {
					m1Card.close();
					strData = null;
					console.log("rCmd", arrBufData[nBlockCount])
					console.log("res" + nBlockNo, arrBufRes)
					fail({ resCode: -1013, ERROR: `${nBlockNo}块读取失败` });
				}
			})
		}
	}

	/**
	 * 
	 * @param {Object} option
	 * @param {string} option.data 
	 * @param {success} [option.success=() => { }] 
	 * @param {fail} [option.fail=() => { }] 
	 */
	writeData(option) {
		option.success = option.success || (() => { })
		option.fail = option.fail || (() => { })
		//指令组合
		let bufferCmd = new ArrayBuffer();

		let keyACmd = this.cmdKeyA(1, KEY_DEFAULT);
		let keyBCmd = this.cmdKeyB(1, KEY_DEFAULT);

		let nBlockNo = this.sectorToBlock(1);
		let strData = "";
		let arrBufData = [];
		let strTmp = "";
		for (let i = 0; i < 3; i++) {
			strTmp = option.data.substr(i * 32, 32);
			if (strTmp == null || strTmp.length < 0) {
				option.fail({ resCode: -1013, ERROR: "数据不合法" })
			}

			arrBufData[i] = this.cmdWriteBlock(nBlockNo + i, strTmp);
			console.log("readData" + i, arrBufData[i])
		}
		console.log("readData", arrBufData)


		let nBlockCount = 0;

		//执行	
		this.m1Card.connect({
			success: () => {
				writeData_authenticateSectorWithKeyA(this.m1Card);
			},
			fail: () => {
				this.m1Card.close();
				console.log("连接失败");
				option.fail({ resCode: -1013, ERROR: "连接失败" });
			},
		});
		/**
		 * 
		 * @param {WechatMiniprogram.NfcA} m1Card 
		 */
		function writeData_authenticateSectorWithKeyA(m1Card) {
			m1Card.transceive({
				data: keyACmd,
				success() {
					writeData_authenticateSectorWithKeyB(m1Card);
				},
				fail() {
					m1Card.close();
					console.log("密码A认证失败");
					option.fail({ resCode: -1013, ERROR: "密码A认证失败" });
				}
			});
		}
		/**
		 * 
		 * @param {WechatMiniprogram.NfcA} m1Card 
		 */
		function writeData_authenticateSectorWithKeyB(m1Card) {
			m1Card.transceive({
				data: keyACmd,
				success() {
					writeData_writeBlock();
				},
				fail() {
					m1Card.close();
					console.log("密码B认证失败");
					option.fail({ resCode: -1013, ERROR: "密码B认证失败" });
				}
			});
		}
		/**
		 * 
		 * @param {WechatMiniprogram.NfcA} m1Card 
		 */
		function writeData_writeBlock(m1Card) {
			m1Card.transceive({
				data: arrBufData[nBlockCount],
				success(arrBufRes) {

					if (arrBufRes != null
						|| arrBufRes != undefined
						|| arrBufRes.length > 0) {
						strData += bytesAndStr.BytesTosHexStr(arrBufRes);
					}
					console.log("res" + nBlockNo, strData)

					if (++nBlockCount < 3) {
						console.log("nBlockCount", nBlockCount)
						writeData_writeBlock(m1Card);
					} else {
						m1Card.close();
						option.success(strData);
						strData = null;
					}
				},
				fail(arrBufRes) {
					m1Card.close();
					strData = null;
					console.log("res" + nBlockNo, arrBufRes.errMsg)
					option.fail({ resCode: -1013, ERROR: `${nBlockNo}块读取失败` });
				}
			});
		}
	}
}