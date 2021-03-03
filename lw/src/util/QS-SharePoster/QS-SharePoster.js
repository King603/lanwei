import _app from "./app.js";
import QRCodeAlg from "./QRCodeAlg.js";
const ShreUserPosterBackgroundKey = "ShrePosterBackground_"; // 背景图片缓存名称前缀


export function getSharePoster(obj) {
	return new Promise(async (resolve, reject) => {
		try {
			resolve(await returnPromise(obj));
		} catch (e) {
			// 处理异常
			removePosterStorage(obj.type);
			try {
				console.log("------------清除缓存后, 开始第二次尝试------------");
				resolve(await returnPromise(obj));
			} catch (e) {
				// 处理异常
				reject(e);
			}
		}
	});
}

function returnPromise({ type, background, posterCanvasId, backgroundImage, reserve, textArray, drawArray, qrCodeArray, imagesArray, setCanvasWH, setCanvasToTempFilePath, setDraw, bgScale = .75, Context, _this, delayTimeScale, drawDelayTime }) {
	return new Promise(async (resolve, reject) => {
		try {
			_app.showLoading("正在准备海报数据");
			if (!Context) {
				console.log("没有画布对象,创建画布对象");
				Context = uni.createCanvasContext(posterCanvasId, (_this || null));
			}
			let bgObj;
			if (background && background.width && background.height) {
				bgObj = background;
			} else {
				bgObj = await getShreUserPosterBackground({
					backgroundImage,
					type
				});
			}
			// 为了ios 缩放一些
			bgObj.width *= bgScale;
			bgObj.height *= bgScale;

			console.log("获取背景图信息对象成功:" + JSON.stringify(bgObj));
			const params = { bgObj, type, bgScale };
			if (setCanvasWH && typeof (setCanvasWH) == "function") setCanvasWH(params);
			if (imagesArray) {
				if (typeof (imagesArray) == "function")
					imagesArray = imagesArray(params);
				_app.showLoading("正在生成需绘制图片的临时路径");
				console.log("准备设置图片");
				imagesArray = await setImage(imagesArray);
				_app.hideLoading();
			}
			if (textArray) {
				if (typeof (textArray) == "function")
					textArray = textArray(params);
				textArray = setText(Context, textArray);

			}
			if (qrCodeArray) {
				if (typeof (qrCodeArray) == "function")
					qrCodeArray = qrCodeArray(params);
				_app.showLoading("正在生成需绘制图片的临时路径");
				for (let i = 0; i < qrCodeArray.length; i++) {
					console.log(i);
					if (qrCodeArray[i].image)
						qrCodeArray[i].image = await _app.downloadFile_PromiseFc(qrCodeArray[i].image);
				}
				_app.hideLoading();
			}
			if (drawArray) {
				if (typeof (drawArray) == "function")
					drawArray = drawArray(params);
				if (_app.isPromise(drawArray))
					drawArray = await drawArray;

				for (let i = 0; i < drawArray.length; i++) {
					const drawArrayItem = drawArray[i];
					switch (drawArrayItem.type) {
						case "image":
							drawArrayItem = await setImage(drawArrayItem);
							break;
						case "text":
							drawArrayItem = setText(Context, drawArrayItem);
							break;
						case "qrcode":
							if (drawArrayItem.image)
								drawArrayItem.image = await _app.downloadFile_PromiseFc(drawArrayItem.image);
							break;
						case "custom":
							break;
						default:
							console.log("未识别的类型");
							break;
					}
					drawArray[i] = drawArrayItem;
				}
			}
			const poster = await drawShareImage({
				Context,
				type,
				posterCanvasId,
				reserve,
				drawArray,
				textArray,
				imagesArray,
				bgObj,
				qrCodeArray,
				setCanvasToTempFilePath,
				setDraw,
				bgScale,
				_this,
				delayTimeScale,
				drawDelayTime
			});
			_app.hideLoading();
			resolve({
				bgObj,
				poster,
				type
			});
		} catch (e) {
			// 处理异常
			reject(e);
		}
	});
}

function drawShareImage({ Context, type, posterCanvasId, reserve, bgObj, drawArray, textArray, qrCodeArray, imagesArray, setCanvasToTempFilePath, setDraw, bgScale, _this, delayTimeScale, drawDelayTime }) { //绘制海报方法
	const params = {
		Context,
		bgObj,
		type,
		bgScale
	};
	delayTimeScale = delayTimeScale !== undefined ? delayTimeScale : 15;
	drawDelayTime = drawDelayTime !== undefined ? drawDelayTime : 100;
	return new Promise((rs, rj) => {
		try {
			_app.showLoading("正在绘制海报");
			console.log("背景对象:" + JSON.stringify(bgObj));
			if (bgObj && bgObj.path) {
				console.log("背景有图片路径");
				Context.drawImage(bgObj.path, 0, 0, bgObj.width, bgObj.height);
			} else {
				console.log("背景没有图片路径");
				if (bgObj.backgroundColor) {
					console.log("背景有背景颜色:" + bgObj.backgroundColor);
					Context.setFillStyle(bgObj.backgroundColor);
					Context.fillRect(0, 0, bgObj.width, bgObj.height);
				} else {
					console.log("背景没有背景颜色");
				}
			}

			_app.showLoading("绘制图片");
			if (imagesArray && imagesArray.length > 0)
				drawImage(Context, imagesArray);

			_app.showLoading("绘制自定义内容");
			if (setDraw && typeof (setDraw) == "function") setDraw(params);

			_app.showLoading("绘制文本");
			if (textArray && textArray.length > 0)
				drawText(Context, textArray, bgObj);

			_app.showLoading("绘制二维码");
			if (qrCodeArray && qrCodeArray.length > 0) {
				for (let i = 0; i < qrCodeArray.length; i++) {
					drawQrCode(Context, qrCodeArray[i]);
				}
			}

			_app.showLoading("绘制可控层级序列");
			if (drawArray && drawArray.length > 0) {
				for (let i = 0; i < drawArray.length; i++) {
					const drawArrayItem = drawArray[i];
					console.log("绘制可控层级序列, drawArrayItem:" + JSON.stringify(drawArrayItem));
					switch (drawArrayItem.type) {
						case "image":
							console.log("绘制可控层级序列, 绘制图片");
							drawImage(Context, drawArrayItem);
							break;
						case "text":
							console.log("绘制可控层级序列, 绘制文本");
							drawText(Context, drawArrayItem, bgObj);
							break;
						case "qrcode":
							console.log("绘制可控层级序列, 绘制二维码");
							drawQrCode(Context, drawArrayItem);
							break;
						case "custom":
							console.log("绘制可控层级序列, 绘制自定义内容");
							if (drawArrayItem.setDraw && typeof drawArrayItem.setDraw === "function")
								drawArrayItem.setDraw(Context);
							break;
						default:
							console.log("未识别的类型");
							break;
					}
				}
			}
			_app.showLoading("绘制中")
			setTimeout(() => {
				Context.draw((typeof (reserve) == "boolean" ? reserve : false), () => {
					_app.showLoading("正在输出图片");
					let setObj = {};
					if (setCanvasToTempFilePath && typeof (setCanvasToTempFilePath) == "function")
						setObj = setCanvasToTempFilePath(bgObj, type);
					let canvasToTempFilePathFn;
					// #ifdef H5
					canvasToTempFilePathFn = function () {
						_app.hideLoading();
						rs({
							tempFilePath: document.querySelector(`uni-canvas[canvas-id=${posterCanvasId}]>canvas`).toDataURL(
								"image/jpeg", setObj.quality || .8)
						});
					}
					// #endif
					// #ifndef H5
					const data = {
						x: 0,
						y: 0,
						width: bgObj.width,
						height: bgObj.height,
						destWidth: bgObj.width * 2, // 若H5使用这里请不要乘以二
						destHeight: bgObj.height * 2, // 若H5使用这里请不要乘以二
						quality: .8,
						...setObj
					};
					console.log("canvasToTempFilePath的data对象:" + JSON.stringify(data));
					canvasToTempFilePathFn = function () {
						uni.canvasToTempFilePath({ //输出为图片
							...data,
							canvasId: posterCanvasId,
							success(res) {
								_app.hideLoading();
								rs(res);
							},
							fail(err) {
								_app.hideLoading();
								console.log("输出图片失败:" + JSON.stringify(err));
								rj("输出图片失败:" + JSON.stringify(err))
							}
						}, _this || null)
					}
					// #endif
					let delayTime = 0;
					if (qrCodeArray) {
						qrCodeArray.forEach(item => {
							if (item.text) {
								delayTime += Number(item.text.length);
							}
						})
					}
					if (imagesArray) {
						imagesArray.forEach(() => {
							delayTime += delayTimeScale;
						})
					}
					if (textArray) {
						textArray.forEach(() => {
							delayTime += delayTimeScale;
						})
					}
					if (drawArray) {
						drawArray.forEach(item => {
							switch (item.type) {
								case "text":
									if (item.text) {
										delayTime += item.text.length;
									}
									break;
								default:
									delayTime += delayTimeScale;
									break;
							}
						})
					}
					console.log("延时系数:" + delayTimeScale);
					console.log("总计延时:" + delayTime);
					setTimeout(canvasToTempFilePathFn, delayTime);
				});
			}, drawDelayTime);
		} catch (e) {
			// 处理异常
			_app.hideLoading();
			rj(e);
		}
	});
}

export function setText(Context, texts) { // 设置文本数据
	console.log("进入设置文字方法, texts:" + JSON.stringify(texts));
	if (texts && _app.isArray(texts)) {
		console.log("texts是数组");
		if (texts.length > 0) {
			for (let i = 0; i < texts.length; i++) {
				console.log("字符串信息-初始化之前:" + JSON.stringify(texts[i]));
				texts[i] = setTextFn(Context, texts[i]);
			}
		}
	} else {
		console.log("texts是对象");
		texts = setTextFn(Context, texts);
	}
	console.log("返回texts:" + JSON.stringify(texts));
	return texts;
}

function setTextFn(Context, textItem) {
	console.log("进入设置文字方法, textItem:" + JSON.stringify(textItem));
	if (textItem.text && typeof (textItem.text) == "string" && textItem.text.length > 0) {
		textItem.alpha = textItem.alpha !== undefined ? textItem.alpha : 1;
		textItem.color = textItem.color || "black";
		textItem.size = textItem.size !== undefined ? textItem.size : 10;
		textItem.textAlign = textItem.textAlign || "left";
		textItem.textBaseline = textItem.textBaseline || "middle";
		textItem.dx = textItem.dx || 0;
		textItem.dy = textItem.dy || 0;
		textItem.size = Math.ceil(Number(textItem.size));
		console.log("字符串信息-初始化默认值后:" + JSON.stringify(textItem));
		const textLength = countTextLength(Context, {
			text: textItem.text,
			size: textItem.size
		});
		console.log("字符串信息-初始化时的文本长度:" + textLength);
		let infoCallBackObj = {};
		if (textItem.infoCallBack && typeof (textItem.infoCallBack) === "function")
			infoCallBackObj = textItem.infoCallBack(textLength);
		textItem = {
			...textItem,
			textLength,
			...infoCallBackObj
		}
		console.log("字符串信息-infoCallBack后:" + JSON.stringify(textItem));
	}
	return textItem;
}

function countTextLength(Context, obj) {
	console.log("计算文字长度, obj:" + JSON.stringify(obj));
	const {
		text,
		size
	} = obj;
	Context.setFontSize(size);
	let textLength;
	try {
		textLength = Context.measureText(text); // 官方文档说 App端自定义组件编译模式暂时不可用measureText方法
	} catch (e) {
		// 处理异常
		textLength = {};
	}
	console.log("measureText计算文字长度, textLength:" + JSON.stringify(textLength));
	textLength = textLength && textLength.width ? textLength.width : 0;
	if (!textLength) {
		let l = 0;
		/* text.forEach(function(item) {
						if (/[a-zA-Z]/.test(item)) {
							l += .7;
						} else if (/[0-9]/.test(item)) {
							l += .55;
						} else if (/\./.test(item)) {
							l += .27;
						} else if (/-/.test(item)) {
							l += .325;
						} else if (/[\u4e00-\u9fa5]/.test(item)) { //中文匹配
							l += 1;
						} else if (/\(|\)/.test(item)) {
							l += .373;
						} else if (/\s/.test(item)) {
							l += .25;
						} else if (/%/.test(item)) {
							l += .8;
						} else {
							l += 1;
						}
					}); */
		for (let j = 0; j < text.length; j++) {
			let t = text.substr(j, 1);
			if (/[a-zA-Z]/.test(t)) {
				l += .7;
			} else if (/[0-9]/.test(t)) {
				l += .55;
			} else if (/\./.test(t)) {
				l += .27;
			} else if (/-/.test(t)) {
				l += .325;
			} else if (/[\u4e00-\u9fa5]/.test(t)) { //中文匹配
				l += 1;
			} else if (/\(|\)/.test(t)) {
				l += .373;
			} else if (/\s/.test(t)) {
				l += .25;
			} else if (/%/.test(t)) {
				l += .8;
			} else {
				l += 1;
			}
		}
		/* for (let j = 0; j < text.length; j++) {
			let t = text.substr(j, 1);
			if (/[\u4e00-\u9fa5]/.test(t)) {
				l += 1;
			} else {
				if (/[A-Za-z0-9]/.test(t)) {
					l += 0.75;
				} else {
					let c = text.charAt(j);
					if (/^[\u0000-\u00ff]$/.test(c)) //匹配双字节
					{
						l += 0.2;
					} else {
						l += 1;
					}
				}
			}
		} */
		textLength = l * size;
	}
	return textLength;
}

export function setImage(images) { // 设置图片数据
	console.log("进入设置图片数据方法");
	return new Promise(async (resolve, rejcet) => {
		try {
			if (images && _app.isArray(images)) {
				console.log("images是一个数组");
				for (let i = 0; i < images.length; i++) {
					console.log("设置图片数据循环中:" + i);
					images[i] = await setImageFn(images[i]);
				}
			} else {
				console.log("images是一个对象");
				images = await setImageFn(images);
			}
			resolve(images);
		} catch (e) {
			// 处理异常
			rejcet(e);
		}
	})
}

function setImageFn(image) {
	return new Promise(async (resolve, reject) => {
		if (image.url) {
			let imgUrl = image.url;
			imgUrl = await _app.downloadFile_PromiseFc(imgUrl);
			image.url = imgUrl;
			const hasinfoCallBack = image.infoCallBack && typeof (image.infoCallBack) === "function";
			let imageInfo = {};
			imageInfo = await _app.getImageInfo_PromiseFc(imgUrl);
			if (hasinfoCallBack) {
				image = {
					...image,
					...image.infoCallBack(imageInfo)
				};
			}
			image.dx = image.dx || 0;
			image.dy = image.dy || 0;
			image.dWidth = image.dWidth || imageInfo.width;
			image.dHeight = image.dHeight || imageInfo.height;
			image = {
				...image,
				imageInfo
			}
		}
		resolve(image);
	})
}

export function drawText(Context, textArray, bgObj) { // 先遍历换行再绘制
	if (!_app.isArray(textArray)) {
		console.log("遍历文本方法, 不是数组");
		textArray = [textArray];
	} else {
		console.log("遍历文本方法, 是数组");
	}
	console.log("遍历文本方法, textArray:" + JSON.stringify(textArray));
	const newArr = [];
	if (textArray && textArray.length > 0) {
		for (let j = 0; j < textArray.length; j++) {
			const textItem = textArray[j];
			if (textItem.text && textItem.lineFeed) {
				let lineNum = -1,
					maxWidth = bgObj.width,
					lineHeight = textItem.size,
					dx = textItem.dx;
				if (textItem.lineFeed instanceof Object) {
					const lineFeed = textItem.lineFeed;
					lineNum = (lineFeed.lineNum !== undefined && typeof (lineFeed.lineNum) === "number") && lineFeed.lineNum >= 0 ?
						lineFeed.lineNum : lineNum;
					maxWidth = (lineFeed.maxWidth !== undefined && typeof (lineFeed.maxWidth) === "number") ? lineFeed.maxWidth :
						maxWidth;
					lineHeight = (lineFeed.lineHeight !== undefined && typeof (lineFeed.lineHeight) === "number") ? lineFeed.lineHeight :
						lineHeight;
					dx = (lineFeed.dx !== undefined && typeof (lineFeed.dx) === "number") ? lineFeed.dx : dx;
				}
				const chr = (textItem.text).split("");
				let temp = "";
				const row = [];
				//循环出几行文字组成数组
				for (let a = 0, len = chr.length; a < len; a++) {
					if (countTextLength(Context, {
						text: temp,
						size: textItem.size
					}) <= maxWidth && countTextLength(Context, {
						text: (temp + chr[a]),
						size: textItem.size
					}) <= maxWidth) {
						temp += chr[a];
						if (a == (chr.length - 1)) {
							row.push(temp);
						}
					} else {
						row.push(temp);
						temp = chr[a];
					}
				}
				console.log("循环出的文本数组:" + JSON.stringify(row));
				//只显示几行 变量间距lineHeight  变量行数lineNum
				let allNum = (lineNum >= 0 && lineNum < row.length) ? lineNum : row.length;

				for (let i = 0; i < allNum; i++) {
					let str = row[i];
					if (i == (allNum - 1) && allNum < row.length) {
						str = str.substring(0, str.length - 1) + "...";
					}
					const obj = {
						...textItem,
						text: str,
						dx: i === 0 ? textItem.dx : (dx >= 0 ? dx : textItem.dx),
						dy: textItem.dy + (i * lineHeight),
						textLength: countTextLength(Context, {
							text: str,
							size: textItem.size
						})
					};
					console.log("重新组成的文本对象:" + JSON.stringify(obj));
					newArr.push(obj);
				}
			} else {
				newArr.push(textItem);
			}
		}
	}
	console.log("绘制文本新数组:" + JSON.stringify(newArr));
	drawTexts(Context, newArr);
}

function setFont(textItem = {}) {
	if (textItem.font && typeof (textItem.font) === "string") {
		console.log(textItem.font)
		return textItem.font;
	} else {
		let fontStyle = "normal";
		let fontVariant = "normal";
		let fontWeight = "normal";
		let fontSize = textItem.size || 10;
		let fontFamily = "sans-serif";
		fontSize = Math.ceil(Number(fontSize));
		if (textItem.fontStyle && typeof (textItem.fontStyle) === "string")
			fontStyle = textItem.fontStyle.trim();
		if (textItem.fontVariant && typeof (textItem.fontVariant) === "string")
			fontVariant = textItem.fontVariant.trim();
		if (textItem.fontWeight && (typeof (textItem.fontWeight) === "string" || typeof (textItem.fontWeight) === "number"))
			fontWeight = textItem.fontWeight.trim();
		if (textItem.fontFamily && typeof (textItem.fontFamily) === "string")
			fontFamily = textItem.fontFamily.trim();
		return fontStyle + " " +
			fontVariant + " " +
			fontWeight + " " +
			fontSize + "px" + " " +
			fontFamily;
	}
}

function drawTexts(Context, texts) { // 绘制文本
	console.log("准备绘制文本方法, texts:" + JSON.stringify(texts));
	if (texts && _app.isArray(texts)) {
		console.log("准备绘制文本方法, 是数组");
		if (texts.length > 0) {
			for (let i = 0; i < texts.length; i++) {
				drawTextFn(Context, texts[i]);
			}
		}
	} else {
		console.log("准备绘制文本方法, 不是数组");
		drawTextFn(Context, texts);
	}
}

function drawTextFn(Context, textItem) {
	console.log("进入绘制文本方法, textItem:" + JSON.stringify(textItem));
	if (textItem && _app.isObject(textItem) && textItem.text) {
		Context.font = setFont(textItem);
		Context.setFillStyle(textItem.color);
		Context.setGlobalAlpha(textItem.alpha);
		Context.setTextAlign(textItem.textAlign);
		Context.setTextBaseline(textItem.textBaseline);
		Context.fillText(textItem.text, textItem.dx, textItem.dy);
		if (textItem.lineThrough && textItem.lineThrough instanceof Object) {
			console.log("有删除线");
			let lineThrough = textItem.lineThrough;
			lineThrough.alpha = lineThrough.alpha !== undefined ? lineThrough.alpha : textItem.alpha;
			lineThrough.style = lineThrough.style || textItem.color;
			lineThrough.width = lineThrough.width !== undefined ? lineThrough.width : textItem.size / 10;
			lineThrough.cap = lineThrough.cap !== undefined ? lineThrough.cap : "butt";
			console.log("删除线对象:" + JSON.stringify(lineThrough));
			Context.setGlobalAlpha(lineThrough.alpha);
			Context.setStrokeStyle(lineThrough.style);
			Context.setLineWidth(lineThrough.width);
			Context.setLineCap(lineThrough.cap);
			let mx, my;
			switch (textItem.textAlign) {
				case "left":
					mx = textItem.dx;
					break;
				case "center":
					mx = textItem.dx - (textItem.textLength) / 2;
					break;
				default:
					mx = textItem.dx - (textItem.textLength);
					break;
			}
			switch (textItem.textBaseline) {
				case "top":
					my = textItem.dy + (textItem.size * .5);
					break;
				case "middle":
					my = textItem.dy;
					break;
				default:
					my = textItem.dy - (textItem.size * .5);
					break;
			}
			Context.beginPath();
			Context.moveTo(mx, my);
			Context.lineTo(mx + textItem.textLength, my);
			Context.stroke();
			Context.closePath();
			console.log("删除线完毕");
		}
		Context.setGlobalAlpha(1);
		Context.font = "10px sans-serif";
	}
}

export function drawImage(Context, images) { // 绘制图片
	console.log("进入图片绘制准备阶段:" + JSON.stringify(images))
	if (images && _app.isArray(images)) {
		if (images.length > 0) {
			for (let i = 0; i < images.length; i++) {
				readyDrawImageFn(Context, images[i]);
			}
		}
	} else {
		readyDrawImageFn(Context, images);
	}

}

function readyDrawImageFn(Context, img) {
	console.log("进入绘制图片方法, img:" + JSON.stringify(img));
	if (img.url) {
		if (img.circleSet) {
			drawCircleImage(Context, img);
		} else if (img.roundRectSet) {
			drawRoundRectImage(Context, img);
		} else {
			drawImageFn(Context, img);
		}
	}
}

function drawImageFn(Context, img) {
	console.log("进入绘制默认图片方法, img:" + JSON.stringify(img));
	if (img.url) {
		console.log("进入绘制默认图片方法, 有url");
		if (img.dWidth && img.dHeight && img.sx && img.sy && img.sWidth && img.sHeight) {
			console.log("进入绘制默认图片方法, 绘制第一种方案");
			Context.drawImage(img.url, img.dx || 0, img.dy || 0,
				img.dWidth || false, img.dHeight || false,
				img.sx || false, img.sy || false,
				img.sWidth || false, img.sHeight || false);
		} else if (img.dWidth && img.dHeight) {
			console.log("进入绘制默认图片方法, 绘制第二种方案");
			Context.drawImage(img.url, img.dx || 0, img.dy || 0,
				img.dWidth || false, img.dHeight || false);
		} else {
			console.log("进入绘制默认图片方法, 绘制第三种方案");
			Context.drawImage(img.url, img.dx || 0, img.dy || 0);
		}
	}
	console.log("进入绘制默认图片方法, 绘制完毕");
	/* if (img.circleSet || img.roundRectSet) {
		Context.restore();
	} */
}

function drawCircleImage(Context, obj) {
	console.log("进入绘制圆形图片方法, obj:" + JSON.stringify(obj));
	Context.save();
	let {
		dx,
		dy,
		dWidth,
		dHeight,
		circleSet,
		imageInfo
	} = obj;
	let x, y, r;
	if (typeof circleSet === "object") {
		x = circleSet.x;
		y = circleSet.y;
		r = circleSet.r;
	}
	if (!r) {
		let d;
		d = dWidth > dHeight ? dHeight : dWidth;
		r = d / 2;
	}

	x = x ? dx + x : (dx || 0) + r;
	y = y ? dy + y : (dy || 0) + r;
	Context.beginPath();
	Context.arc(x, y, r, 0, 2 * Math.PI, false);
	Context.closePath();
	Context.fillStyle = "#FFFFFF";
	Context.fill();
	Context.clip();
	drawImageFn(Context, obj);
	console.log("默认图片绘制完毕");
	Context.restore();
}

function drawRoundRectImage(Context, obj) { // 绘制矩形
	console.log("进入绘制矩形图片方法, obj:" + JSON.stringify(obj));
	Context.save();
	let {
		dx,
		dy,
		dWidth,
		dHeight,
		roundRectSet,
		imageInfo
	} = obj;
	let r;
	if (typeof roundRectSet === "object") {
		r = roundRectSet.r;
	}
	r = r || dWidth * .1;

	if (dWidth < 2 * r) {
		r = dWidth / 2;
	}
	if (dHeight < 2 * r) {
		r = dHeight / 2;
	}
	Context.beginPath();
	Context.moveTo(dx + r, dy);
	Context.arcTo(dx + dWidth, dy, dx + dWidth, dy + dHeight, r);
	Context.arcTo(dx + dWidth, dy + dHeight, dx, dy + dHeight, r);
	Context.arcTo(dx, dy + dHeight, dx, dy, r);
	Context.arcTo(dx, dy, dx + dWidth, dy, r);
	Context.closePath();
	Context.fillStyle = "#FFFFFF";
	Context.fill();
	Context.clip();
	drawImageFn(Context, obj);
	Context.restore();
	console.log("进入绘制矩形图片方法, 绘制完毕");
}

export function drawQrCode(Context, qrCodeObj) { //生成二维码方法， 参考了 诗小柒 的二维码生成器代码
	_app.showLoading("正在生成二维码");
	let qrcodeAlgObjCache = [];
	let options = {
		text: qrCodeObj.text || "", // 生成内容
		size: qrCodeObj.size || 200, // 二维码大小
		background: qrCodeObj.background || "#ffffff", // 背景色
		foreground: qrCodeObj.foreground || "#000000", // 前景色
		pdground: qrCodeObj.pdground || "#000000", // 定位角点颜色
		correctLevel: qrCodeObj.correctLevel || 3, // 容错级别
		image: qrCodeObj.image || "", // 二维码图标
		imageSize: qrCodeObj.imageSize || 40, // 二维码图标大小
		dx: qrCodeObj.dx || 0, // x轴距离
		dy: qrCodeObj.dy || 0 // y轴距离
	}
	let qrCodeAlg = null;
	let d = 0;
	for (var i = 0, l = qrcodeAlgObjCache.length; i < l; i++) {
		d = i;
		if (qrcodeAlgObjCache[i].text == options.text && qrcodeAlgObjCache[i].text.correctLevel == options.correctLevel) {
			qrCodeAlg = qrcodeAlgObjCache[i].obj;
			break;
		}
	}
	if (d == l) {
		qrCodeAlg = new QRCodeAlg(options.text, options.correctLevel);
		qrcodeAlgObjCache.push({
			text: options.text,
			correctLevel: options.correctLevel,
			obj: qrCodeAlg
		});
	}
	let getForeGround = function (config) {
		let options = config.options;
		if (options.pdground && (
			(config.row > 1 && config.row < 5 && config.col > 1 && config.col < 5) ||
			(config.row > (config.count - 6) && config.row < (config.count - 2) && config.col > 1 && config.col < 5) ||
			(config.row > 1 && config.row < 5 && config.col > (config.count - 6) && config.col < (config.count - 2))
		)) {
			return options.pdground;
		}
		return options.foreground;
	}
	let count = qrCodeAlg.getModuleCount();
	let ratioSize = options.size;
	let ratioImgSize = options.imageSize;
	//计算每个点的长宽
	let tileW = (ratioSize / count).toPrecision(4);
	let tileH = (ratioSize / count).toPrecision(4);
	//绘制
	for (let row = 0; row < count; row++) {
		for (let col = 0; col < count; col++) {
			let w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
			let h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
			let foreground = getForeGround({
				row: row,
				col: col,
				count: count,
				options: options
			});
			Context.setFillStyle(qrCodeAlg.modules[row][col] ? foreground : options.background);
			Context.fillRect(options.dx + Math.round(col * tileW), options.dy + Math.round(row * tileH), w, h);
		}
	}
	if (options.image) {
		let x = options.dx + Number(((ratioSize - ratioImgSize) / 2).toFixed(2));
		let y = options.dy + Number(((ratioSize - ratioImgSize) / 2).toFixed(2));
		drawRoundedRect(Context, x, y, ratioImgSize, ratioImgSize, 2, 6, true, true)
		Context.drawImage(options.image, x, y, ratioImgSize, ratioImgSize);
		// 画圆角矩形
		function drawRoundedRect(ctxi, x, y, width, height, r, lineWidth, fill, stroke) {
			ctxi.setLineWidth(lineWidth);
			ctxi.setFillStyle(options.background);
			ctxi.setStrokeStyle(options.background);
			ctxi.beginPath(); // draw top and top right corner 
			ctxi.moveTo(x + r, y);
			ctxi.arcTo(x + width, y, x + width, y + r, r); // draw right side and bottom right corner 
			ctxi.arcTo(x + width, y + height, x + width - r, y + height, r); // draw bottom and bottom left corner 
			ctxi.arcTo(x, y + height, x, y + height - r, r); // draw left and top left corner 
			ctxi.arcTo(x, y, x + r, y, r);
			ctxi.closePath();
			if (fill) {
				ctxi.fill();
			}
			if (stroke) {
				ctxi.stroke();
			}
		}
	}
	_app.hideLoading();
}

function getShreUserPosterBackground(objs) { //检查背景图是否存在于本地， 若存在直接返回， 否则调用getShreUserPosterBackgroundFc方法
	let {
		backgroundImage,
		type
	} = objs;
	return new Promise(async (resolve, reject) => {
		try {
			_app.showLoading("正在获取海报背景图");
			// #ifndef H5
			let pbg = getPosterStorage(type);
			// #endif
			// #ifdef H5
			let pbg = false;
			// #endif
			console.log("获取的缓存:" + JSON.stringify(pbg));
			if (pbg && pbg.path && pbg.name) {
				console.log("海报有缓存, 准备获取后端背景图进行对比");
				const image = await _app.getPosterUrl(objs);
				console.log("准备对比name是否相同");
				if (pbg.name === _app.fileNameInPath(image)) {
					console.log("name相同, 判断该背景图是否存在于本地")
					const index = await _app.checkFile_PromiseFc(pbg.path)
					if (index >= 0) {
						console.log("海报save路径存在, 对比宽高信息, 存储并输出");
						const imageObj = await _app.getImageInfo_PromiseFc(pbg.path);
						let obj = {
							...pbg
						};
						if (!pbg.width || !pbg.height || pbg.width !== imageObj.width || pbg.height !== imageObj.height) {
							console.log("宽高对比不通过， 重新获取");
							const savedFilePath = await getShreUserPosterBackgroundFc(objs, image)
							_app.hideLoading();
							resolve(savedFilePath);
						} else {
							console.log("宽高对比通过, 再次存储, 并返回路径");
							obj = {
								...pbg,
								width: imageObj.width,
								height: imageObj.height
							};
							// #ifndef H5
							setPosterStorage(type, {
								...obj
							});
							// #endif
							_app.hideLoading();
							resolve(obj);
						}
					} else {
						console.log("海报save路径不存在, 重新获取海报");
						const savedFilePath = await getShreUserPosterBackgroundFc(objs, image)
						_app.hideLoading();
						resolve(savedFilePath);
					}
				} else {
					console.log("name不相同, 重新获取海报");
					const savedFilePath = await getShreUserPosterBackgroundFc(objs, image)
					_app.hideLoading();
					resolve(savedFilePath);
				}
			} else {
				console.log("海报背景图没有缓存, 准备获取海报背景图");
				const savedFilePath = await getShreUserPosterBackgroundFc(objs)
				_app.hideLoading();
				resolve(savedFilePath);
			}
		} catch (e) {
			_app.hideLoading();
			_app.showToast("获取分享用户背景图失败:" + JSON.stringify(e));
			console.log(JSON.stringify(e));
			reject(e);
		}
	})
}

function getPosterStorage(type) {
	return _app.getStorageSync(getStorageKey(type));
}

function removePosterStorage(type) {
	const ShreUserPosterBackgroundKey = getStorageKey(type);
	const pbg = _app.getStorageSync(ShreUserPosterBackgroundKey);
	if (pbg && pbg.path) {
		_app.removeSavedFile(pbg.path);
		_app.removeStorageSync(ShreUserPosterBackgroundKey);
	}
}

function setPosterStorage(type, data) {
	_app.setStorage(getStorageKey(type), data);
}

function getStorageKey(type) {
	return ShreUserPosterBackgroundKey + (type || "default");
}

function getShreUserPosterBackgroundFc(objs, upimage) { //下载并保存背景图方法
	let {
		backgroundImage,
		type
	} = objs;
	console.log("获取分享背景图, 尝试清空本地数据");
	removePosterStorage(type);
	return new Promise(async (resolve, reject) => {
		try {
			_app.showLoading("正在下载海报背景图");
			if (upimage) {
				console.log("有从后端获取的背景图片路径");
				console.log("尝试下载并保存背景图");
				const name = _app.fileNameInPath(upimage);
				const savedFilePath = await _app.downLoadAndSaveFile_PromiseFc(upimage);
				if (savedFilePath) {
					console.log("下载并保存背景图成功:" + savedFilePath);
					const imageObj = await _app.getImageInfo_PromiseFc(savedFilePath);
					const returnObj = {
						path: savedFilePath,
						width: imageObj.width,
						height: imageObj.height,
						name
					}
					// #ifndef H5
					setPosterStorage(type, {
						...returnObj
					});
					// #endif
					_app.hideLoading();
					resolve(returnObj);
				} else {
					_app.hideLoading();
					reject("not find savedFilePath");
				}
			} else {
				console.log("没有从后端获取的背景图片路径, 尝试从后端获取背景图片路径");
				const image = await _app.getPosterUrl(objs);
				console.log("尝试下载并保存背景图:" + image);
				const savedFilePath = await _app.downLoadAndSaveFile_PromiseFc(image);
				if (savedFilePath) {
					console.log("下载并保存背景图成功:" + savedFilePath);
					const imageObj = await _app.getImageInfo_PromiseFc(savedFilePath);
					console.log("获取图片信息成功");
					const returnObj = {
						path: savedFilePath,
						width: imageObj.width,
						height: imageObj.height,
						name: _app.fileNameInPath(image)
					}
					console.log("拼接背景图信息对象成功:" + JSON.stringify(returnObj));

					// #ifndef H5
					setPosterStorage(type, {
						...returnObj
					});
					// #endif

					_app.hideLoading();
					console.log("返回背景图信息对象");
					resolve({
						...returnObj
					});
				} else {
					_app.hideLoading();
					reject("not find savedFilePath");
				}
			}
		} catch (e) {
			// 处理异常
			reject(e);
		}
	});
}
