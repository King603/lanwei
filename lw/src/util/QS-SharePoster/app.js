export default {
	// 交互控制
	/**
	 * 
	 * @param {string} msg 
	 * @param {boolean} ifmask 
	 */
	showLoading(msg, ifmask = false) {
		uni.showLoading({
			title: msg,
			mask: ifmask
		})
	},
	hideLoading() {
		uni.hideLoading();
	},
	/**
	 * 
	 * @param {string} msg 
	 * @param {string} icon 
	 */
	showToast(msg, icon = "none") {
		uni.showToast({
			title: msg,
			icon: icon
		})
	},
	/**
	 * 
	 * @param {{backgroundImage:string,type:string}}
	 */
	getPosterUrl({ backgroundImage, type }) { // 后端获取背景图的url路径方法
		return new Promise((rs, rj) => {
			let image = (() => {
				if (backgroundImage) {
					return backgroundImage;
				} else {
					switch (type) { //根据type获取背景图, 一般要改成request获取
						case 1:
							return "";
						default:
							return "https://haoxiangchong.oss-cn-shenzhen.aliyuncs.com/MrJALsBtjt_wx023ed2d5e1a87230.o6zAJs5b-NeM9YlE0KCOW3BfXCAY.Y7hV2SHHxtUn28165f59b7bc31fdcc77e65ec36d1ce6.jpg";
					}
				}
			})()

			if (image) {
				rs(image); // resolve图片的路径
			} else {
				rj("背景图片路径不存在");
			}
		})
	},
	// 下面一般不用动他
	shareTypeListSheetArray: {
		array: [0, 1, 2, 3, 4, 5]
	}, // 分享类型 0-图文链接 1-纯文字 2-纯图片 3-音乐 4-视频 5-小程序
	isArray(arg) {
		return Object.prototype.toString.call(arg) === "[object Array]";
	},
	isObject(arg) {
		return Object.prototype.toString.call(arg) === "[object Object]";
	},
	isPromise(obj) {
		return obj && (typeof obj === "object" || typeof obj === "function") && typeof obj.then === "function";
	},
	/**
	 * 
	 * @param {string} key 
	 * @param {scb} success 
	 * @param {fcb} fail 
	 * @callback scb
	 * @returns {void}
	 * @param {} result
	 * @callback fcb
	 * @returns {void}
	 */
	getStorage(key, success, fail) {
		uni.getStorage({
			key,
			success(res) {
				if (res.data && res.data != "") {
					if (success) success(res.data);
				} else {
					if (fail) fail();
				}
			},
			fail() {
				if (fail) fail();
			}
		})
	},
	/**
	 * 
	 * @param {string} key 
	 * @param {*} data 
	 */
	setStorage(key, data) {
		console.log("设置缓存")
		console.log("key：" + key)
		console.log("data：" + JSON.stringify(data));
		uni.setStorage({ key, data });
	},
	setStorageSync(key, data) {
		uni.setStorageSync(key, data);
	},
	getStorageSync(key) {
		return uni.getStorageSync(key);
	},
	clearStorageSync() {
		uni.clearStorageSync();
	},
	removeStorageSync(key) {
		uni.removeStorageSync(key);
	},
	getImageInfo(url, success, fail) {
		url = checkMPUrl(url);
		uni.getImageInfo({
			src: url,
			success(res) {
				if (success)
					if (typeof success == "function") success(res);
					else throw new Error("success is no function!");
			},
			fail(err) {
				if (fail)
					if (typeof fail == "function") fail(err);
					else throw new Error("fail is no function!");
			}
		})
	},
	downloadFile(url, cb) {
		url = checkMPUrl(url);
		uni.downloadFile({
			url,
			success(res) {
				if (cb)
					if (typeof cb == "function") cb(res);
					else throw new Error("success is no function!");
			}
		})
	},
	/**
	 * 
	 * @param {string} url 
	 */
	downloadFile_PromiseFc(url) {
		return new Promise((rs, rj) => {
			if (url.substring(0, 4) !== "http") {
				rs(url);
			} else {
				url = checkMPUrl(url);
				console.log("url:" + url);
				uni.downloadFile({
					url,
					success(res) {
						if (res && res.tempFilePath)
							rs(res.tempFilePath);
						else
							rj("not find tempFilePath");
					},
					fail(err) {
						rj(err);
					}
				})
			}
		});
	},
	/**
	 * 
	 * @param {string} url 
	 */
	saveFile(url) {
		uni.saveFile({
			tempFilePath: url,
			success(res) {
				console.log("保存成功:" + JSON.stringify(res))
			}
		})
	},
	/**
	 * 
	 * @param {string} url 
	 */
	downLoadAndSaveFile_PromiseFc(url) {
		return new Promise((resolve, reject) => {
			console.log("准备下载并保存图片:" + url);
			if (url.substring(0, 4) === "http") {
				url = checkMPUrl(url);
				uni.downloadFile({
					url,
					success(d_res) {
						console.log("下载背景图成功：" + JSON.stringify(d_res));
						if (d_res && d_res.tempFilePath) {

							// #ifdef H5
							resolve(d_res.tempFilePath);
							// #endif

							// #ifndef H5
							uni.saveFile({
								tempFilePath: d_res.tempFilePath,
								success(s_res) {
									console.log("保存背景图成功:" + JSON.stringify(s_res));
									resolve(s_res && s_res.savedFilePath ? s_res.savedFilePath : d_res.tempFilePath);
								},
								fail(err) {
									resolve(d_res.tempFilePath);
								}
							})
							// #endif

						} else {
							reject("not find tempFilePath");
						}
					},
					fail(err) {
						reject(err);
					}
				})
			} else {
				resolve(url);
			}
		})
	},
	/**
	 * 
	 * @param {string} url 
	 */
	checkFile_PromiseFc(url) {
		return new Promise((resolve, reject) => {
			uni.getSavedFileList({
				success(res) {
					let d = res.fileList;
					let index = d.findIndex(item => {
						return item.filePath === url;
					})
					resolve(index);
				},
				fail(err) {
					reject(err);
				}
			})
		});
	},
	/**
	 * 
	 * @param {string} path 
	 */
	removeSavedFile(path) {
		uni.getSavedFileList({
			success(res) {
				let d = res.fileList;
				let index = d.findIndex(item => item.filePath === path);
				if (index >= 0)
					uni.removeSavedFile({ filePath: path });
			}
		})
	},
	/**
	 * 
	 * @param {string} path 
	 */
	fileNameInPath(path) {
		let s = path.split("/");
		return s[s.length - 1];
	},
	getImageInfo_PromiseFc(imgPath) {
		return new Promise((resolve, reject) => {
			console.log("准备获取图片信息:" + imgPath);
			imgPath = checkMPUrl(imgPath);
			uni.getImageInfo({
				src: imgPath,
				success: res => {
					console.log("获取图片信息成功:" + JSON.stringify(res));
					resolve(res);
				},
				fail: err => {
					console.log("获取图片信息失败:" + JSON.stringify(err));
					reject(err);
				}
			})
		});
	},
	previewImage(urls) {
		if (typeof urls == "string")
			urls = [urls];
		uni.previewImage({ urls });
	},
	/**
	 * 
	 * @param {{array: string[];}} obj 
	 * @param {success} cb 
	 * @callback success
	 * @param {number} index
	 */
	actionSheet(obj, cb) {
		/**@type {string[]} */
		let sheetArray = [];
		obj.array.forEach((ob, i) => {
			switch (ob) {
				case "sinaweibo":
					sheetArray[i] = "新浪微博";
					break;
				case "qq":
					sheetArray[i] = "QQ";
					break;
				case "weixin":
					sheetArray[i] = "微信";
					break;
				case "WXSceneSession":
					sheetArray[i] = "微信好友";
					break;
				case "WXSenceTimeline":
					sheetArray[i] = "微信朋友圈";
					break;
				case "WXSceneFavorite":
					sheetArray[i] = "微信收藏";
					break;
				case 0:
					sheetArray[i] = "图文链接";
					break;
				case 1:
					sheetArray[i] = "纯文字";
					break;
				case 2:
					sheetArray[i] = "纯图片";
					break;
				case 3:
					sheetArray[i] = "音乐";
					break;
				case 4:
					sheetArray[i] = "视频";
					break;
				case 5:
					sheetArray[i] = "小程序";
					break;
				default:
					break;
			}
		})
		this.showActionSheet(sheetArray, cb);
	},
	/**
	 * 
	 * @param {string[]} sheetArray 
	 * @param {ActionSheet_success} success 
	 * @callback ActionSheet_success
	 * @param {number} index
	 */
	showActionSheet(sheetArray, success) {
		uni.showActionSheet({
			itemList: sheetArray,
			success: (e) => {
				if (success)
					if (typeof success == "function") success(e.tapIndex);
					else throw new Error("success is no function!");
			}
		})
	},
	/**
	 * 
	 * @param {string} type 
	 * @param {cb} cb 
	 * @param {boolean} sheet 
	 * @callback cb
	 * @returns {void}
	 * @param {string} type
	 */
	getProvider(type, cb, sheet) {
		let _this = this;
		uni.getProvider({
			service: type,
			success(res) {
				if (sheet) {
					let obj = {};
					obj.array = res.provider;
					_this.actionSheet(obj, (index) => {
						if (cb)
							if (typeof cb == "function") cb(res.provider[index]);
							else throw new Error("success is no function!");
					});
				} else {
					if (type == "payment") {
						let providers = res.provider;
						let payTypeArray = [];
						for (let i = 0; i < providers.length; i++) {
							switch (providers[i]) {
								case "wxpay": payTypeArray[i] = ({ name: "微信支付", value: providers[i], img: "/static/img/wei.png" }); break;
								case "alipay": payTypeArray[i] = ({ name: "支付宝支付", value: providers[i], img: "/static/img/ali.png" }); break;
							}
						}
						if (cb && typeof (cb) == "function") cb(payTypeArray);
					} else {
						if (cb && typeof (cb) == "function") cb(res);
					}
				}
			},
		})
	},
	// #ifdef APP-PLUS
	/**
	 * 
	 * @param {string} providerName 																					分享服务提供商（即weixin|qq|sinaweibo），通过 uni.getProvider 获取可用的分享服务商，可用是指在manifest.json的sdk配置中配的分享sdk厂商，与本机安装了什么社交App无关
	 * @param {string} WXScene 																								场景，可取值参考下面说明。
	 * @param {number} shareType 																							分享形式，如图文、纯文字、纯图片、音乐、视频、小程序等。默认图文 0。不同分享服务商支持的形式不同，具体参考下面type值说明。
	 * @param {string} title 																									分享内容的标题
	 * @param {string} summary 																								分享内容的摘要
	 * @param {string} href 																									跳转链接
	 * @param {string} imageUrl 																							图片地址。type为0时，推荐使用小于20Kb的图片
	 * @param {{path:string, type: number, webUrl:string}} miniProgramObj 		分享小程序必要参数
	 * @param {string} mediaUrl 																							音视频地址
	 * @param {scb} scb 																											接口调用成功的回调
	 * @param {fcb} fcb 																											接口调用失败的回调函数
	 */
	getShare(providerName, WXScene, shareType, title, summary, href, imageUrl, miniProgramObj, mediaUrl, scb, fcb) { //miniProgram: {path: "", type: 0, webUrl: ""}
		if (typeof shareType == "number" && !isNaN(shareType) && shareType >= 0) {
			this.readyShare(providerName, WXScene, shareType, title, summary, href, imageUrl, miniProgramObj, mediaUrl, scb, fcb);
		} else {
			this.actionSheet(this.shareTypeListSheetArray, (index) => {
				this.readyShare(providerName, WXScene, this.shareTypeListSheetArray.array[index], title, summary, href, imageUrl, miniProgramObj, mediaUrl, scb, fcb);
			});
		}
	},
	/**
	 * 
	 * @param {string} providerName 																					分享服务提供商（即weixin|qq|sinaweibo），通过 uni.getProvider 获取可用的分享服务商，可用是指在manifest.json的sdk配置中配的分享sdk厂商，与本机安装了什么社交App无关
	 * @param {string} WXScene 																								场景，可取值参考下面说明。
	 * @param {number} shareType 																							分享形式，如图文、纯文字、纯图片、音乐、视频、小程序等。默认图文 0。不同分享服务商支持的形式不同，具体参考下面type值说明。
	 * @param {string} title 																									分享内容的标题
	 * @param {string} summary 																								分享内容的摘要
	 * @param {string} href 																									跳转链接
	 * @param {string} imageUrl 																							图片地址。type为0时，推荐使用小于20Kb的图片
	 * @param {{path:string, type: number, webUrl:string}} miniProgramObj 		分享小程序必要参数
	 * @param {string} mediaUrl 																							音视频地址
	 * @param {scb} scb 																											接口调用成功的回调
	 * @param {fcb} fcb 																											接口调用失败的回调函数
	 * @callback scb
	 * @param {*} res
	 * @callback fcb
	 * @param {*} err
	 */
	readyShare(providerName, WXScene, shareType, title, summary, href, imageUrl, miniProgramObj, mediaUrl, scb, fcb) {
		let shareObjData = {};
		switch (shareType) {
			case 0: // 图文		provider 支持度：weixin、sinaweibo
				shareObjData = { href, summary, imageUrl };
				break;
			case 1: // 纯文字	provider 支持度：weixin、qq
				shareObjData = { summary, href };
				break;
			case 2: // 纯图片	provider 支持度：weixin、qq
				shareObjData = { imageUrl };
				break;
			case 3: // 音乐		provider 支持度：weixin、qq
				if (mediaUrl) { this.showToast("暂不支持此分享类型"); return; };
				shareObjData = { mediaUrl };
				break;
			case 4: // 视频		provider 支持度：weixin、sinaweibo
				if (mediaUrl) { this.showToast("暂不支持此分享类型"); return; };
				shareObjData = { mediaUrl };
				break;
			case 5: // 小程序	provider 支持度：weixin
				shareObjData = { miniProgram: { ...miniProgramObj, id: miniProgramId, type: miniProgramShareType }, imageUrl };
				providerName = "weixin";
				break;
			default:
				this.showToast("分享参数-shareType错误");
				return;
		}
		shareObjData.title = title;
		this.share(providerName, WXScene, shareType, shareObjData, function (res) {
			if (scb && typeof scb == "function") scb(res);
		}, function (err) {
			if (fcb && typeof fcb == "function") fcb(err);
		});
	},
	/**
	 * 
	 * @param {string} providerName 
	 * @param {string} WXScene 
	 * @param {number} shareType 
	 * @param {{}} data 
	 * @param {Function} scb 
	 * @param {Function} fcb 
	 */
	share(providerName, WXScene, shareType, data, scb, fcb) {
		let shareObj = {
			provider: "",
			success: Function,
			fail: Function
		};
		if (providerName && providerName != "") {
			shareObj.provider = providerName;
			if (providerName == "weixin") {
				this.readyShareWXScene(WXScene, (Scene) => {
					shareObj.scene = Scene;
					this.doingShare(shareObj, shareType, data, scb, fcb);
				});
			} else {
				this.doingShare(shareObj, shareType, data, scb, fcb);
			}
		} else {
			this.getProvider("share", (name) => {
				shareObj.provider = name;
				if (name == "weixin") {
					this.readyShareWXScene(WXScene, (Scene) => {
						shareObj.scene = Scene;
						this.doingShare(shareObj, shareType, data, scb, fcb);
					});
				} else {
					this.doingShare(shareObj, shareType, data, scb, fcb);
				}
			}, true);
		}
	},
	/**
	 * 
	 * @param {string} WXScene 
	 * @param {cb} cb 
	 */
	readyShareWXScene(WXScene, cb) {
		let _this = this;
		let WXScenetypelist = {
			array: ["WXSceneSession", "WXSenceTimeline", "WXSceneFavorite"]
		};
		if (WXScene && WXScene != "") {
			if (cb && typeof (cb) == "function") cb(WXScene);
		} else {
			_this.actionSheet(WXScenetypelist, function (index) {
				if (cb && typeof (cb) == "function") cb(WXScenetypelist.array[index]);
			});
		}
	},
	/**
	 * 
	 * @param {{}} shareObj 
	 * @param {number} shareType 
	 * @param {{}} data 
	 * @param {Function} scb 
	 * @param {Function} fcb 
	 */
	doingShare(shareObj, shareType, data, scb, fcb) {
		shareObj.type = shareType;
		if (data && data.title) shareObj.title = data.title;
		switch (shareType) {
			case 0: //图文链接
				shareObj.href = data.href;
				shareObj.summary = data.summary;
				shareObj.imageUrl = data.imageUrl;
				break;
			case 1: //纯文字
				shareObj.summary = data.summary;
				shareObj.href = data.href;
				break;
			case 2: //纯图片
				shareObj.imageUrl = data.imageUrl;
				break;
			case 3: //音乐
				if (!data.mediaUrl) {
					_this.showToast("暂不支持此分享类型");
					return;
				};
				shareObj.mediaUrl = data.mediaUrl;
				break;
			case 4: //视频
				if (!data.mediaUrl) {
					_this.showToast("暂不支持此分享类型");
					return;
				};
				shareObj.mediaUrl = data.mediaUrl;
				break;
			case 5: //小程序
				if (miniProgramId == "") {
					uni.showToast("未设置小程序ID, 请使用其他方式分享");
					return;
				}
				shareObj.miniProgram = {
					id: miniProgramId,
					...data.miniProgram
				};
				shareObj.imageUrl = data.imageUrl;
				break;
			default:
				appJS.showToast("分享参数-shareType错误");
				break;
		}
		shareObj.success = function (res) {
			if (scb && typeof (scb) == "function") scb(res);
			console.log(res)
		}
		shareObj.fail = function (err) {
			if (fcb && typeof (fcb) == "function") fcb(err);
			console.log(err)
		}
		console.log(JSON.stringify(shareObj));
		uni.share(shareObj);
	},
	// #endif
}

/**
 * 
 * @param {string} url 
 */
function checkMPUrl(url) {
	// #ifdef MP
	if (
		url.substring(0, 4) === "http" &&
		url.substring(0, 12) !== "http://store" &&
		url.substring(0, 10) !== "http://tmp" &&
		url.substring(0, 5) !== "https"
	) {
		url = "https" + url.substring(4, url.length);
	}
	// #endif
	return url;
}
/**
 * @callback scb
 * @param {*} res
 * @callback fcb
 * @param {*} err
 */