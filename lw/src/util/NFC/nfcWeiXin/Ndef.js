const TNF_WELL_KNOWN = 1;
const RTD_TEXT = 0x54;

export default class {
	/**
	 * 
	 * @param {WechatMiniprogram.Ndef} nfcAdapter 
	 */
	constructor(nfcAdapter) { // 构造器
		this.ndefCard = nfcAdapter;
	}

	getAdapter() {
		return this.ndefCard;
	}
	/**
	 * 
	 * @param {ArrayBuffer} payload 
	 */
	recordTextParse(payload) {

		let uint8 = new Uint8Array(payload);
		let textEncoding = (uint8[0] & 0x80) == 0 ? "UTF-8" : "UTF-16";
		let codeLength = uint8[0] & 0x3f;

		let strLanguage = "";
		for (let i = 0; i < codeLength; i++) {
			strLanguage += String.fromCharCode(uint8[i + 1]);
		}
		console.log("strLanguage--", strLanguage);
		let strText = "";
		for (let i = codeLength + 1; i < uint8.length; i++) {
			strText += String.fromCharCode(uint8[i]);
		}
		console.log("strText--", strText);
		return strText;
	}
	/**
	 * 
	 * @param {{tnf: number; type: ArrayBuffer; id: {}; payload: ArrayBuffer;}} record 
	 */
	recordParse(record) {
		console.log("record.tnf--", record.tnf);
		if (record.tnf == TNF_WELL_KNOWN) {
			let uint8Type = new Uint8Array(record.type);
			console.log("uint8Type--", uint8Type);
			if (uint8Type[0] == RTD_TEXT) {
				return this.recordTextParse(record.payload);
			}
		}
	}

	/**
	 * 
	 * @param {Object} option
	 * @param {{id: ArrayBuffer, type: ArrayBuffer, payload: ArrayBuffer}} option.msg 
	 * @param {success} [option.success=() => { }] 
	 * @param {fail} [option.fail=() => { }] 
	 * 
	 * @callback success
	 * @param {{CardData: string; CardInfo: string;}} res
	 * @returns {void}
	 * @callback fail
	 * @param {{resCode:number;ERROR:string}}
	 * @returns {void}
	 */
	readData(option) {
		option.success = option.success || (() => { });
		option.fail = option.fail || (() => { });

		console.log("ndef messages", option.msg.messages);

		/* CardData解析 */
		let strData = "";
		let { messages } = option.msg;
		for (let i in messages) {
			let arrRecords = messages[i].records;
			for (let i in arrRecords) {
				strData += this.recordParse(arrRecords[i]);
			}
		}

		/* CardInfo解析（未完成）--自己写的还没搞懂 */
		let strInfo = "";
		let uint8Info = new Uint8Array(option.msg.id);
		console.log("uint8Info--", uint8Info);
		let codeLength = uint8Info[0] & 0x3f;
		for (let i = codeLength + 1; i < uint8Info.length; i++)
			strInfo += String.fromCharCode(uint8Info[i]);
		console.log("strInfo--", strInfo);

		if (strData != null && strData.length > 0) {
			option.success({
				CardData: strData,
				CardInfo: option.msg.id
			});
			return;
		}

		option.fail({ resCode: 1013, ERROR: "读数据失败" });
	}
	/**
	 * 
	 * @param {Object} option
	 * @param {string} option.data 
	 * @param {success} [option.success=() => { }] 
	 * @param {fail} [option.fail=() => { }] 
	 */
	writeData({ data, success, fail }) {
		success = success || (() => { });
		fail = fail || (() => { });

		this.ndefCard.connect({
			success: () => {

			},
			fail: () => {
				this.ndefCard.close();
				console.log("连接失败");
				fail({ resCode: -1011, ERROR: "连接失败" });
			}
		});
	}
}
