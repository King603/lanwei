import { apiHost } from './config.js';

export function userLogin() {
	return new Promise((resolve, reject) => {
		uni.login({
			success(res) {
				var code = res["code"];
				//2.小程序调用uni.getUserInfo得到rawData, signatrue, encryptData.
				uni.getUserInfo({
					provider: 'weixin',
					success(info) {
						let { rawData, signature, encryptedData, iv } = info; // 注意是encryptedData不是encryptData...坑啊
						// 小程序调用server获取token接口, 传入code, rawData, signature, encryptData.
						uni.request({
							url: apiHost + "",// 接口路劲
							data: {
								"jsCode": code,
							},
							dataType: 'JSON',
							method: "POST",
							success: (res) => {
								console.log(res);
								var resUserInfo = JSON.parse(res.data).data;
								console.log(resUserInfo);
								// if (JSON.parse(res.data).code === "10019999") {
								// 	uni.showToast({
								// 		title: "服务器未启动或其他原因",
								// 		icon: "none"
								// 	});
								// } else {
								// 	resolve(res);
								// 	console.log(4444);
								// 	console.log(resUserInfo);
								// 	uni.setStorageSync('openId', resUserInfo.openId);
								// 	uni.setStorageSync('openIdBindByProxy', resUserInfo.loggedProxy);
								// 	uni.setStorageSync('sessionKey', resUserInfo.sessionKey);
								// 	uni.setStorageSync('openIdBindByBusiness', resUserInfo.loggedBusiness);
								// }
							}
						});
					},
					fail(err) {
						console.log('授权失败的原因', err)
					}
				})
			},
			fail(err) {
				reject(err)
				console.log(err)
				uni.showModal({
					title: '提示',
					content: '授权失败，将无法进入小程序',
					confirmText: '朕知道了',
					showCancel: false,
					success(res) {
						// 点击一键登录，去授权页面
					}
				})
			}
		})
	});
};
