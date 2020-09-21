// 为方便演示，此邀请注册页面放在项目内，实际可以单独做一个项目放置邀请注册页面

export default {
	data() {
		return {
			mobile: "",
			code: "",
			password: "",
			confirmPassword: "",
			codeDuration: 0,
			inviteCode: "",
		};
	},
	onLoad(options) {
		this.inviteCode = options.invite_code;
	},
	methods: {
		sendSmsCode() {
			if (this.codeDuration) {
				uni.showModal({
					content: `请在${this.codeDuration}秒后重试`,
					showCancel: false,
				});
			}
			if (!/^1\d{10}$/.test(this.mobile)) {
				uni.showModal({
					content: "手机号码填写错误",
					showCancel: false,
				});
				return;
			}
			uni.showLoading({
				title: "请稍等...",
				mask: true,
			});
			uniCloud.callFunction({
				name: "user-center",
				data: {
					action: "sendSmsCode",
					params: {
						mobile: this.mobile,
						type: "register",
					},
				},
				success: (e) => {
					if (e.result.code == 0) {
						uni.showModal({
							content: "验证码发送成功，请注意查收",
							showCancel: false,
						});
						this.codeDuration = 60;
						this.codeInterVal = setInterval(() => {
							this.codeDuration--;
							if (this.codeDuration === 0) {
								if (this.codeInterVal) {
									clearInterval(this.codeInterVal);
									this.codeInterVal = null;
								}
							}
						}, 1000);
					} else {
						uni.showModal({
							content: "验证码发送失败：" + e.result.msg,
							showCancel: false,
						});
					}
				},
				fail(e) {
					uni.showModal({
						content: "验证码发送失败",
						showCancel: false,
					});
				},
				complete() {
					uni.hideLoading();
				},
			});
		},
		register() {
			/**
			 * 客户端对账号信息进行一些必要的校验。
			 * 实际开发中，根据业务需要进行处理，这里仅做示例。
			 */
			if (!/^1\d{10}$/.test(this.mobile)) {
				uni.showModal({
					content: "手机号码填写错误",
					showCancel: false,
				});
				return;
			}
			if (this.password.length < 6) {
				uni.showToast({
					icon: "none",
					title: "密码最短为 6 个字符",
				});
				return;
			}
			if (this.password !== this.confirmPassword) {
				uni.showToast({
					icon: "none",
					title: "两次密码输入不一致",
				});
				return;
			}
			if (this.code === "") {
				uni.showToast({
					icon: "none",
					title: "请输入正确的验证码",
				});
				return;
			}
			uni.showLoading({
				title: "请稍后...",
			});
			uniCloud.callFunction({
				name: "user-center",
				data: {
					action: "inviteLogin",
					params: {
						mobile: this.mobile,
						code: this.code,
						inviteCode: this.inviteCode,
						password: this.password,
					},
				},
				success: (e) => {
					console.log("注册成功", e);

					if (e.result.code === 0) {
						uni.showModal({
							content: "注册成功，是否立即下载APP登录",
							success: (res) => {
								if (res.confirm) {
									this.download();
								}
							},
						});
					} else {
						uni.showModal({
							content: "注册失败：" + e.result.msg,
							showCancel: false,
						});
					}
				},
				fail(e) {
					uni.showModal({
						content: JSON.stringify(e),
						showCancel: false,
					});
				},
				complete() {
					uni.hideLoading();
				},
			});
		},
		download() {
			location.href = "../../../../static/apk/android-latest.apk";
		},
	},
};