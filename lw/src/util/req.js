import { config } from './config.js';

/**
 * 自制ajax请求
 * @param {{ method: string, data?: {}, url: string, success(res: any): void }} param0 
 */
export function request({ method, data = {}, url, success }) {
	uni.showNavigationBarLoading();
	// 利用ES7的try catch功能获取数据
	try {
		/** 会话密钥 */
		let sessionKey = uni.getStorageSync("sessionKey");
		console.log("session key: ", sessionKey);
		if (sessionKey) {
			// 利用uni-app的Ajax请求获取数据
			uni.request({
				url: config.apiHost + url, // 接口完整路径
				data, // 界面导入的数据
				header: { // 微信头标签数据，必填
					'content-type': 'application/json;charset=UTF-8',
					'X-HXCharge-Authentication': sessionKey.toString(),
				},
				method, // 请求类型
				success(res) {
					// 隐藏导航栏加载
					uni.hideNavigationBarLoading();
					switch (res.statusCode) {
						default: success(res); break;
						case 401:
						/******************************************************** 此处为原始数据模板 ********************************************************/
						// uni.setStorageSync("isLogin", false);
						// uni.removeStorageSync('openId');
						// uni.removeStorageSync('openIdBindByProxy');
						// uni.removeStorageSync('sessionKey');
						// uni.removeStorageSync('openIdBindByBusiness');
						// uni.showToast({ title: res.data.message.toString().indexOf('login') > 0 ? '登录超时' : res.data.message.toString(), icon: 'none' });
						// setTimeout(() => uni.reLaunch({ url: "/pages/index/login" }), 1000);
						/*********************************************************** 后期进行修改 ***********************************************************/
					}
				},
				fail: function (err) {
					// 隐藏导航栏加载
					uni.hideNavigationBarLoading()
					console.log('请求失败：' + err)
				},
			});
		}
	} catch (e) {
		throw new Error("错误信息为：" + e);
	}
}