
class m1Card {
	connect({ success, fail, complete }) {
		success();
	}
	transceive({ data, success, fail, complete }) {
		console.log("transceive cmd:" + data);
		var uint8 = new Uint8Array(data);
		console.log("transceive cmd 8:" + uint8);
		var buf = new ArrayBuffer(16);
		var uint8Cmd = new Uint8Array(buf);
		for (let i = 0; i < 16; i++) {
			uint8Cmd[i] = i;
		}
		success(buf);
	}
	close() { }
}

class ndefCard { }

class NFCAdapter {
	getMifareClassic() {
		return new m1Card();
	}
	getNfcNdef() {
		return new ndefCard();
	}
	onDiscovered(success) {
		var buf = new ArrayBuffer(1);
		var uint8Cmd = new Uint8Array(buf);
		uint8Cmd[0] = 0x54;
		var buf2 = new ArrayBuffer(7);
		var uint8Cmd2 = new Uint8Array(buf2);
		[0x02, 0x66, 0x69, 0x41, 0x41, 0x41, 0x41].forEach((int16, i) => uint8Cmd2[i] = int16);
		success({ techs: "nfc.tech.ndef", messages: [{ records: [{ tnf: 1, type: buf, id: {}, payload: buf2 }] }] });
	}
	stopASD() {

	}
	stopDiscovery() {
		return "dfdsfsd";
	}
}

export default class {
	startHCE({ aid_list, success, fail, complete }) {
		success({ errMsg: 0 });
	}
	getNFCAdapter() {
		return new NFCAdapter();
	}
}