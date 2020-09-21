import { mapState, mapMutations } from "vuex";

export default {
	data() {
		return {
			avatarUrl: "../../static/img/logo.png",
			inviteUrl: "",
		};
	},
	computed: {
		...mapState(["hasLogin", "forcedLogin", "userName"]),
	},

	methods: {
		...mapMutations(["logout"]),
		bindLogin() {
			if (!this.hasLogin) {
				uni.navigateTo({
					url: "./login/login",
				});
			}
		},
		bindLogout() {
			const loginType = uni.getStorageSync("login_type");
			if (loginType === "local") {
				this.logout();
				if (this.forcedLogin) {
					uni.reLaunch({
						url: "./login/login",
					});
				}
				return;
			}

			uniCloud.callFunction({
				name: "user-center",
				data: {
					action: "logout",
				},
				success: (e) => {
					console.log("logout success", e);

					if (e.result.code == 0) {
						this.logout();
						uni.removeStorageSync("uniIdToken");
						uni.removeStorageSync("username");
						/** 如果需要强制登录跳转回登录页面 */
						this.inviteUrl = "";
						if (this.forcedLogin) {
							uni.reLaunch({
								url: "../login/login",
							});
						}
					} else {
						uni.showModal({
							content: e.result.msg,
							showCancel: false,
						});
						console.log("登出失败", e);
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
		toInvite() {
			uni.navigateTo({
				url: "/pages/invite/invite",
			});
		},
	},
};