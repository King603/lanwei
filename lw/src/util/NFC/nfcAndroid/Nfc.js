/**
 * Android NFC接口
 */
export default {
	NfcPlugin: null,
	/* 
		cbReadSuccess: null,
		cbReadFail: null,
		cbWriteSuccess: null,
		cbWriteFail: null,
	*/
	/**
	 * 解析
	 * @param {success} cbSuccess : 成功回调
	 * @param {fail} cbFail : 失败回调
	 * 
	 * 回调参数：
	 * @callback success 成功回调函数
	 * @callback fail 失败回调函数
	 */
	/* listenGlobalNfcMessage(cbSuccess, cbFail) {
		uni.showModal({
			showCancel: false,
			content: respond,
		});
		var intent = plus.android.importClass("android.content.Intent");
		var mainActivity = plus.android.runtimeMainActivity();
		intent = mainActivity.getIntent(); //获取启动intent 
		var IntentCode = intent.getIntExtra("IntentCode", 0);
		var reqCode = intent.getIntExtra("ReqCode", 0);
		var result = intent.getIntExtra("Result", -1);
		var respond = JSON.parse(intent.getStringExtra("Respond"));//接收数据
		intent.removeExtra("IntentCode");
		intent.removeExtra("ReqCode");
		intent.removeExtra("Result");
		intent.removeExtra("Respond");

		if (IntentCode == 1001) {
			uni.showModal({
				showCancel: false,
				content: respond,
			});

			if (result > 0) {
				if (reqCode == 1010 && this.cbReadSuccess != null) {
					this.cbReadSuccess = null;
					this.cbReadFail = null;
					this.cbReadSuccess(respond);
				}
				else if (reqCode == 1020 && this.cbWriteSuccess != null) {
					this.cbWriteSuccess = null;
					this.cbWriteFail = null;
					this.cbWriteSuccess(respond);
				}
				else {
					cbSuccess(respond);
				}
			}
			else {
				if (reqCode == 1010 && this.cbReadFail != null) {
					this.cbReadSuccess = null;
					this.cbReadFail = null;
					this.cbReadFail(respond);
				}
				else if (reqCode == 1020 && this.cbWriteFail != null) {
					this.cbWriteSuccess = null;
					this.cbWriteFail = null;
					this.cbWriteFail(respond);
				}
				else {
					cbFail(respond);
				}
			}
		}
	}, */

	/**
	 * 读数据
	 * @param {success} cbSuccess
	 * @param {fail} cbFail
	 */
	readDataAsyn: function (cbSuccess, cbFail) {
		let NfcPlugin = uni.requireNativePlugin("NfcCardPluginModule");

		//this.cbReadSuccess = cbSuccess;
		//this.cbReadFail = cbFail;
		NfcPlugin.ReadNfcAsync();
	},

	/**
	 * 写数据
	 * @param {string} strData
	 * @param {success} cbSuccess
	 * @param {fail} cbFail 
	 */
	writeDataAsyn: function (strData, cbSuccess, cbFail) {
		let NfcPlugin = uni.requireNativePlugin("NfcCardPluginModule");

		let json = JSON.stringify({ data: strData });
		//this.cbWriteSuccess = cbSuccess;
		//this.cbWriteFail = cbFail;

		NfcPlugin.WriteNfcAsync(json);
	}

}

