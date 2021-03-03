/**
 * @param {string} type 区域状态
 */
export default (type) => {
	uni.showModal({
		title: type,
		content: "网络异常,请检查网络设置！！",
		showCancel: false,
	});
}