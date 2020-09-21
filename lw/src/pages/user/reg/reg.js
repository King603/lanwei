import mInput from "../../../components/m-input.vue";

export default {
	components: {
		mInput,
	},
	data() {
		return {
			username: "",
			password: "",
			confirmPassword: "",
		};
	},
	methods: {
		register() {
			/**
			 * 客户端对账号信息进行一些必要的校验。
			 * 实际开发中，根据业务需要进行处理，这里仅做示例。
			 */
			if (this.username.length < 3) {
				uni.showToast({
					icon: "none",
					title: "账号最短为 3 个字符",
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

			const data = {
				username: this.username,
				password: this.password,
			};
			uniCloud.callFunction({
				name: "user-center",
				data: {
					action: "register",
					params: data,
				},
				success(e) {
					console.log("注册成功", e);

					if (e.result.code === 0) {
						uni.showToast({
							title: "注册成功",
						});
						uni.setStorageSync("uniIdToken", e.result.token);
						uni.setStorageSync("username", e.result.username);
						uni.reLaunch({
							url: "../main/main",
						});
					} else {
						uni.showModal({
							content: JSON.stringify(e.result),
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
			});
		},
	},
};