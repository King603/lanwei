export default {
	data() {
		return {
			mySearch: "这是搜索界面",
		};
	},
	onLoad(option) {
		console.log(option);
		this.mySearch = option.search;
	},
};