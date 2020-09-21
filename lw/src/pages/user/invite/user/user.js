export default {
	data() {
		return {
			invitedUser: [],
			loading: true,
			levelArr: ["一", "二", "三"],
			selectedLevel: 0,
			status: "more",
			pageSize: 40,
			current: 1,
		};
	},
	onLoad() {
		this.getList();
	},
	onReachBottom() {
		if (this.status !== "loading") {
			this.getList();
		}
	},
	methods: {
		changeLevel(index) {
			this.selectedLevel = index;
			this.getList(true);
		},
		getList(refresh) {
			this.status = "loading";
			uniCloud.callFunction({
				name: "user-center",
				data: {
					action: "getInvitedUser",
					params: {
						level: this.selectedLevel + 1,
						offset: (this.current - 1) * this.pageSize,
						limit: this.pageSize,
						needTotal: false,
					},
				},
				success: (res) => {
					console.log(res);
					if (res.result.code === 0) {
						// 这里请修改为真实的邀请页面url
						const tempList = res.result.invitedUser;
						this.invitedUser = refresh
							? tempList
							: this.invitedUser.concat(tempList);
						if (tempList.length < this.pageSize) {
							this.status = "noMore";
						} else {
							this.status = "more";
						}
					} else {
						this.status = "more";
						uni.showModal({
							content: "获取被邀请用户列表失败:" + res.result.msg,
							showCancel: false,
						});
					}
				},
				fail: (err) => {
					uni.showModal({
						content: "获取被邀请用户列表失败，请稍后再试",
						showCancel: false,
					});
				},
				complete: () => {
					this.loading = false;
				},
			});
		},
	},
};