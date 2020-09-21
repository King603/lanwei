import { mapState } from "vuex";
export default {
	data() {
		return {
			inviteUrl: "",
			qrcodeImagePath: "",
			qrcodePath: "",
			shareType: "",
		};
	},
	onLoad() {
		uni.showLoading({
			title: "加载中...",
		});
		uniCloud.callFunction({
			name: "user-center",
			data: {
				action: "getInviteCode",
			},
			success: (res) => {
				console.log(res);
				if (res.result.code === 0) {
					// 这里请修改为真实的邀请页面url
					this.inviteUrl =
						"https://login.tpl.dcloud.net.cn/#/pages/invite-reg/invite-reg?invite_code=" +
						res.result.myInviteCode;
				} else {
					uni.showModal({
						content: "获取用户邀请码失败:" + res.result.msg,
						showCancel: false,
					});
				}
			},
			fail: (err) => {
				uni.showModal({
					content: "获取用户邀请码失败，请稍后再试",
					showCancel: false,
				});
			},
			complete() {
				uni.hideLoading();
			},
		});
	},
	methods: {
		copyInviteUrl() {
			uni.setClipboardData({
				data: this.inviteUrl,
			});
		},
		qrcodeComplete(path) {
			this.qrcodeImagePath = path;
		},
		shareLink() {
			this.shareType = "link";
			this.$refs.popupShare.open();
		},
		shareImage() {
			this.shareType = "image";
			this.$refs.popupShare.open();
		},
		select({ item }) {
			const shareTitle = "登录模板",
				shareSummary = "DCloud邀请您试用登录模板";
			let params = {};
			switch (`${this.shareType}_${item.name}`) {
				case "link_weixin":
					params = {
						type: 1,
						summary: this.inviteUrl,
						scene: "WXSceneSession",
					};
					break;
				case "link_qq":
					params = {
						type: 1,
						title: shareTitle,
						summary: shareSummary,
						href: this.inviteUrl,
					};
					break;
				case "link_more":
					uni.setClipboardData({
						data: this.inviteUrl,
					});
					return;
				case "image_weixin":
					params = {
						type: 2,
						imageUrl: this.qrcodeImagePath,
						scene: "WXSceneSession",
					};
					break;
				case "image_qq":
					params = {
						type: 2,
						imageUrl: this.qrcodeImagePath,
					};
					break;
				case "image_more":
					uni.shareWithSystem({
						type: "image",
						imageUrl: this.qrcodeImagePath,
					});
					return;
				default:
					break;
			}
			console.log(params);
			uni.share({
				provider: item.name,
				...params,
				success() {
					uni.showModal({
						content: "分享成功",
						showCancel: false,
					});
				},
				fail(err) {
					uni.showModal({
						content: "分享失败：" + err.errMsg,
						showCancel: false,
					});
				},
			});
		},
		toInvitedUser() {
			uni.navigateTo({
				url: "/pages/user/invited/user/user",
			});
		},
	},
};