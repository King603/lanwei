const SSDKTypeKey = "type";
const SSDKTextKey = "text";
const SSDKTitleKey = "title";
const SSDKUrlKey = "url";
const SSDKURLName = "urlname";
const SSDKShareLinkParameter = "sharelinkparam";
const SSDKImagesKey = "image";
const SSDKImageUrl = "imageUrl";
const SSDKThumbImageKey = "thumbimage";
const SSDKWXThumbImageKey = "wxmp_hdthumbimage";
const SSDKAudioUrlKey = "audio";
const SSDKVideoUrlKey = "video";
const SSDKExtensionKey = "extensionInfo";
const SSDKFileKey = "fileData";
const SSDKFileExtensionKey = "fileextension";
const SSDKEmoticonKey = "emoticon";
const SSDKMiniAppIDKey = "miniappid";
const SSDKMiniPathKey = "minipath";
const SSDKMiniWebpageUrlKey = "miniwebpageurl";
const SSDKMiniProgramTypeKey = "miniprogramtype";
const SSDKLatKey = "latitude";
const SSDKLongKey = "longitude";
const SSDKWeiboObjectIdKey = "weiboobjectid";
const SSDKWeiboIsStoryKey = "weiboisStory";
const SSDKWeiboCardSummary = "cardsummart";
const SSDKWeiboCardTitle = "cardtitle";
const SSDKAttachmentsKey = "attachments";
const SSDKHashtagKey = "hashtag";
const SSDKQuoteKey = "quote";
const SSDKVideoAssetURL = "asseturl";
const SSDKAudioFlashURL = "audioflash";
const SSDKVideoFlashURL = "videoflash";
const SSDKWXMPWithTicket = "wxticket";
const SSDKWXMPType = "wxmptype";
const SSDKWXMPPath = "wxmppath";
const SSDKWXMPUserName = "wxmpusername";
const SSDKFacebookShareTypeKey = "facebooksharetype";
const SSDKVideoKey = "videokey";
export const SSDKContentType = {
	Auto: 0,
	Text: 1,
	Image: 2,
	//3，被吃了
	WebPage: 4,
	Music: 5,
	Video: 6,
	App: 7,
	File: 8,
	Emoji: 9,
	MiniProgram: 10
};
export const SSDKPlatformID = {
	Unknown: 0,
	SinaWeibo: 1, //Sina Weibo
	TencentWeibo: 2, //Tencent Weibo
	DouBan: 5, //Dou Ban
	QZone: 6, //QZone
	Renren: 7, //Ren Ren
	Kaixin: 8, //Kai Xin
	Pengyou: 9, //Friends
	Facebook: 10, //Facebook
	Twitter: 11, //Twitter
	Evernote: 12, //Evernote
	Foursquare: 13, //Foursquare
	GooglePlus: 14, //Google+
	Instagram: 15, //Instagram
	LinkedIn: 16, //LinkedIn
	Tumblr: 17, //Tumblr
	Mail: 18, //Mail
	SMS: 19, //SMS
	Print: 20, //Print
	Copy: 21, //Copy
	WeChat: 22, //WeChat Friends
	WeChatMoments: 23, //WeChat Timeline
	QQ: 24, //QQ
	Instapaper: 25, //Instapaper
	Pocket: 26, //Pocket
	YouDaoNote: 27, //You Dao Note
	Pinterest: 30, //Pinterest
	Flickr: 34, //Flickr
	Dropbox: 35, //Dropbox
	VKontakte: 36, //VKontakte
	WeChatFavorites: 37, //WeChat Favorited
	YiXinSession: 38, //YiXin Session
	YiXinTimeline: 39, //YiXin Timeline
	YiXinFav: 40, //YiXin Favorited
	MingDao: 41, //明道
	Line: 42, //Line
	WhatsApp: 43, //Whats App
	KakaoTalk: 44, //KakaoTalk
	KakaoStory: 45, //KakaoStory
	FacebookMessenger: 46, //FacebookMessenger
	Bluetooth: 48, //Bluetooth
	Alipay: 50, //Alipay
	AliPaySocialTimeline: 51, //AliPaySocial Timeline
	DingTalk: 52, //DingTalk
	YouTube: 53, //youtube
	MeiPai: 54, //美拍
	Cmcc: 55, //中国移动
	Reddit: 56, //Reddit
	ESurfing: 57, //天翼
	FacebookAccount: 58, //FacebookAccount
	Douyin: 59, //抖音
	Apple: 61, //苹果
	Oasis: 64,
	snapchat: 66,
	KakaoPlatform: 995, //Kakao Series
	EvernotePlatform: 996, //Evernote Series
	WechatPlatform: 997, //Wechat Series
	QQPlatform: 998, //QQ Series
	Any: 999 //Any Platform
};

export function SSDKShareParams() {
	var obj = {};
	obj.paramters = {};
	/**
	 * 设置分享参数
	 *
	 * @param {string} text			文本
	 * @param {string} images		图片集合,传入参数可以为单张图片信息，也可以为一个数组，String（图片路径）。如: "http://www.mob.com/images/logo_black.png" 或 ["http://www.mob.com/images/logo_black.png"]
	 * @param {string} url			网页路径/应用路径
	 * @param {string} title		标题
	 * @param {string} type			分享类型
	 */
	obj.general = function (text, images, url, title) {
		obj.paramters = {
			[SSDKTextKey]: text,
			[SSDKImagesKey]: images,
			[SSDKUrlKey]: url,
			[SSDKTitleKey]: title,
		}
		return obj;
	};
	/**
	 * 设置微信分享参数
	 *
	 * @param {string} text									文本
	 * @param {string} title								标题
	 * @param {string} url									分享链接
	 * @param {string} thumbImage						缩略图，可以为String（图片路径）
	 * @param {string} image								图片，可以为String（图片路径）
	 * @param {string} musicFileURL					音乐文件链接地址
	 * @param {string} extInfo							扩展信息
	 * @param {string} fileData							文件数据，可以为本地路径
	 * @param {string} emoticonData					表情数据，可以为本地路径
	 * @param {string} fileExtension				源文件后缀名
	 * @param {string} sourceFileData				源文件数据，可以为String本地路径
	 * @param {string} type									分享类型，支持SSDKContentTypeText、SSDKContentTypeImage、SSDKContentTypeWebPage、SSDKContentTypeApp、SSDKContentTypeAudio和SSDKContentTypeVideo
	 * @param {string} platformSubType			平台子类型，只能传入其中一个
	 *
	 * 分享文本时：
	 * 设置type为SSDKContentTypeText, 并填入text参数
	 *
	 * 分享图片时：
	 * 设置type为SSDKContentTypeImage, 非gif图片时：填入title和image参数，如果为gif图片则需要填写title和emoticonData参数
	 *
	 * 分享网页时：
	 * 设置type为SSDKContentTypeWebPage, 并设置text、title、url以及thumbImage参数，如果尚未设置thumbImage则会从image参数中读取图片并对图片进行缩放操作。
	 *
	 * 分享应用时：
	 * 设置type为SSDKContentTypeApp，并设置text、title、extInfo（可选）以及fileData（可选）参数。
	 *
	 * 分享音乐时：
	 * 设置type为SSDKContentTypeAudio，并设置text、title、url以及musicFileURL（可选）参数。
	 *
	 * 分享视频时：
	 * 设置type为SSDKContentTypeVideo，并设置text、title、url参数
	 *
	 * 分享文件时：
	 * 设置type为SSDKContentTypeFile（例如.mp3、.mp4、.pdf、.docx的分享），设置title、sourceFileExtension、sourceFileData，以及thumbImage参数，如果尚未设置thumbImage则会从image参数中读取图片并对图片进行缩放操作参数
	 */
	obj.wechat = function (text, title, url, thumbImage, image, musicFileURL, extInfo, filePath, emoticonPath, fileExtension) {
		obj.paramters["@platform(wechat)"] = {
			[SSDKTextKey]: text,
			[SSDKTitleKey]: title,
			[SSDKUrlKey]: url,
			[SSDKThumbImageKey]: thumbImage,
			[SSDKImagesKey]: image,
			[SSDKAudioUrlKey]: musicFileURL,
			[SSDKFileExtensionKey]: fileExtension,
			[SSDKFileKey]: filePath,
			[SSDKEmoticonKey]: emoticonPath,
			[SSDKExtensionKey]: extInfo,
		};
		return obj;
	};
	/**
	 * @version 4.1.2										为微信小程序分享增加
	 * @param {string} text							标题
	 * @param {string} description			详细说明
	 * @param {string} webpageUrl				网址（6.5.6以下版本微信会自动转化为分享链接 必填）
	 * @param {string} path							跳转到页面路径
	 * @param {string} thumbImage				缩略图 , 旧版微信客户端（6.5.8及以下版本）小程序类型消息卡片使用小图卡片样式 要求图片数据小于32k
	 * @param {string} hdThumbImage			高清缩略图，建议长宽比是 5:4 ,6.5.9及以上版本微信客户端小程序类型分享使用 要求图片数据小于128k
	 * @param {string} userName					小程序的userName （必填）
	 * @param {string} withShareTicket	是否使用带 shareTicket 的转发
	 * @param {number} type							分享小程序的版本（0-正式，1-开发，2-体验）
	 * @param {string} platformSubType	分享自平台 微信小程序暂只支持 SSDKPlatformSubTypeWechatSession（微信好友分享)
	 */
	obj.wechatMiniProgram = function (text, description, webpageUrl, path, thumbImage, hdThumbImage, userName, withShareTicket, type, platformSubType) {
		obj.paramters["@platform(wechatmini)"] = {
			[SSDKTypeKey]: SSDKContentType.MiniProgram,
			[SSDKTextKey]: text,
			[SSDKTitleKey]: title,
			[SSDKUrlKey]: webpageUrl,
			[SSDKThumbImageKey]: thumbImage,
			[SSDKWXMPPath]: path,
			[SSDKWXThumbImageKey]: hdThumbImage,
			[SSDKWXMPType]: type,
			[SSDKWXMPWithTicket]: withShareTicket,
			[SSDKWXMPUserName]: userName,
		}
		return obj;
	};
	/**
	 *  设置QQ分享参数
	 *  @param {string} text							分享内容
	 *  @param {string} title							分享标题
	 *  @param {string} url								分享链接(如果分享类型为音频/视频时,应该传入音频/视频的网络URL地址) [特别说明:分享视频到QZone时,视频为网络视频,请传入视频网络URL地址;视频为本地视频的,请传入来源于手机系统相册的相关的Asset URL地址]
	 *  @param {string} audioFlashURL			分享音频时缩略图播放源,仅平台子类型为SSDKPlatformSubTypeQQFriend,且分享类型为Audio时生效
	 *  @param {string} videoFlashURL			分享视频时缩略图播放源,仅平台子类型为SSDKPlatformSubTypeQQFriend,且分享类型为Video时生效
	 *  @param {string} thumbImage				缩略图，可以为String（图片路径）
	 *  @param {string[]} images					图片集合,传入参数可以为单张图片信息，也可以为一个Array，数组元素可以为String（图片路径） QQ会采用首张图片，QZone则支持图片数组
	 *  @param {string} type							分享类型, 仅支持Text、Image、WebPage、Audio、Video类型
	 *  @param {string} platformSubType		平台子类型，只能传入SSDKPlatformSubTypeQZone或者SSDKPlatformSubTypeQQFriend其中一个
	 */
	obj.qq = function (text, title, url, thumbImage, images, audioFlashURL, videoFlashURL) {
		obj.paramters["@platform(qq)"] = {
			[SSDKTextKey]: text,
			[SSDKTitleKey]: title,
			[SSDKUrlKey]: url,
			[SSDKThumbImageKey]: thumbImage,
			[SSDKImagesKey]: images,
			[SSDKAudioFlashURL]: audioFlashURL,
			[SSDKVideoFlashURL]: videoFlashURL,
		}
		return obj;
	};
	/**
	 * @version 4.3.0 													为QQ平台支持小程序分享增加，使用小程序分享 请在白名单中(LSApplicationQueriesSchemes)添加mqqopensdkminiapp
	 * @param {string} title										标题
	 * @param {string} description							详细说明
	 * @param {string} webpageUrl								网址
	 * @param {string} hdThumbImage							高清缩略图
	 * @param {string} miniAppID								必填，小程序的AppId（注：必须在QQ互联平台中，将该小程序与分享的App绑定）
	 * @param {string} miniPath									必填，小程序的展示路径
	 * @param {string} miniWebpageUrl						必填，兼容低版本的网页链接
	 * @param {string} miniProgramType					非必填，小程序的类型，默认正式版(3)，可选测试版(1)、预览版(4)
	 * @param {string} platformSubType					分享自平台 小程序暂只支持 SSDKPlatformSubTypeQQFriend（QQ好友分享)
	 */
	obj.qqMiniProgram = function (title, description, webpageUrl, hdThumbImage, miniAppID, miniPath, miniWebpageUrl, miniProgramType, platformSubType) {
		var param = {};
		obj.paramters["@platform(qqmini)"] = {
			[SSDKTypeKey]: SSDKContentType.MiniProgram,
			[SSDKTextKey]: description,
			[SSDKTitleKey]: title,
			[SSDKUrlKey]: webpageUrl,
			[SSDKThumbImageKey]: hdThumbImage,
			[SSDKMiniAppIDKey]: miniAppID,
			[SSDKMiniPathKey]: miniPath,
			[SSDKMiniWebpageUrlKey]: miniWebpageUrl,
			[SSDKMiniProgramTypeKey]: miniProgramType,
		}
		return obj;
	};
	/**
	 * 设置新浪微博分享参数， linkCard分享模式必要参数为 text,title,image,url,type，其中image仅支持网络连接，type为webpage
	 * @param {string} text								文本
	 * @param {string} title							标题
	 * @param {string} images							图片集合,传入参数可以为单张图片信息，也可以为一个数组，数组元素可以为string（图片路径）。如: "http://www.mob.com/images/logo_black.png" 或 ["http://www.mob.com/images/logo_black.png"]
	 * @param {string} video							分享视频, 本地路径。
	 * @param {string} url								分享链接
	 * @param {number} latitude						纬度
	 * @param {number} longitude					经度
	 * @param {string} objectID						对象ID，标识系统内内容唯一性，应传入系统中分享内容的唯一标识，没有时可以传入nil
	 * @param {boolean} isShareToStory		是否分享到故事
	 * @param {string} type								分享类型，仅支持Text、Image、WebPage 类型 设置 SSDKEnableSinaWeiboAPIShare 使用API进行分享 但text中需要附 安全域 安全域在新浪微博开放平台设置
	 * @param {string} dataDictionary			数据存储字典 如果传入nil将新建
	 */
	obj.sina = function (text, title, images, video, url, latitude, longitude, objectID, isShareToStory, type, dataDictionary) {
		obj.paramters[`@platform(${SSDKPlatformID.SinaWeibo})`] = {
			[SSDKTextKey]: text,
			[SSDKTitleKey]: title,
			[SSDKImagesKey]: images,
			[SSDKVideoKey]: video,
			[SSDKUrlKey]: url,
			[SSDKLatKey]: latitude,
			[SSDKLongKey]: longitude,
			[SSDKWeiboObjectIdKey]: objectID,
			[SSDKWeiboIsStoryKey]: isShareToStory,
		}
		return obj;
	};
	/**
	 * 设置Line分享参数
	 * @param {string} text		分享文本
	 * @param {string} image	分享图片，可以为string（图片路径）。
	 * @param {string} type		分享类型，仅支持Text、Image
	 */
	obj.line = function (text, image, type) {
		obj.paramters[`@platform(${SSDKPlatformID.Line})`] = {
			[SSDKTextKey]: text,
			[SSDKImagesKey]: image,
		}
		return obj;
	};
	/**
	 *  设置Facebook分享参数
	 *
	 * @param {string} text								分享内容
	 * 																		分享类型为Text类型时,作为文字主体内容
	 * 																		分享类型为WebPage类型时,作为连接描述
	 * @param {string} image							图片，可以为string（图片路径）
	 * 																		分享类型为Image类型时,若使用客户端分享,可传入 单张/多张 的 本地/网络 图片;如果不使用客户端分享,仅支持单张的本地/网络图片
	 * 																		分享类型为App（应用邀请）时 只支持网络图片链接
	 * 																		【Facebook通过客户端分享图片,可不需依赖任何权限;否则需要申请publish_actions权限】
	 * 																		分享类型为WebPage类型时,无论是否使用客户端,仅支持单张的网络图片
	 * @param {string} url								链接
	 * 																		分享类型为WebPage类型时,为链接地址
	 * 																		[如果分享的连接是AppStore/GooglePlay/Facebook个人/公共主页,所对应的图片,标题,描述等参数可能不会生效,而实际生效的是FB通过爬虫网络根据连接搜刮而来的信息]
	 * 																		分享类型为Video类型时,需传入视频地址且但必须是相册地址
	 * @param {string} title							链接标题
	 * 																		分享类型为WebPage类型时,为链接标题
	 * @param {string} urlName						连接名称
	 * 																		分享类型为WebPage类型时,为链接名称,仅在非客户端分享时生效
	 * @param {string} attachementUrl			附件链接(附加的媒体文件（SWF 或 MP3）的网址。如果是 SWF，还必须指定image以提供视频的缩略图)
	 * 																		分享类型为WebPage类型时,为链,仅在非客户端分享时生效
	 * @param {string} hashtag						话题标签
	 * 																		开发者指定的话题标签，将添加至分享内容中。用户可决定是否在分享对话框中移除这种话题标签。话题标签应包含#符号，例如#facebook，不能是纯数字
	 * @param {string} quote							话题标签
	 * 																		随分享的链接一同显示的引文由用户自行高亮选择，也可由开发者预先定义(例如文章的醒目引文) 此参数只适用于链接分享类型
	 * @param {string} shareType					包含facebooksdk
	 * @param {string} type								分享类型
	 * 																		当使用客户端分享时,支持Image、WebPage,Video类型
	 * 																		当不适用客户端分享是,支持Text、Image、WebPage、App(应用邀请)类型
	 */
	obj.facebook = function (text, image, url, title, urlName, attachementUrl, hashtag, quote, shareType) {
		obj.paramters[`@platform(${SSDKPlatformID.Facebook})`] = {
			[SSDKTextKey]: text,
			[SSDKTitleKey]: title,
			[SSDKImagesKey]: image,
			[SSDKURLName]: urlName,
			[SSDKUrlKey]: url,
			[SSDKFacebookShareTypeKey]: shareType,
			[SSDKAttachmentsKey]: attachementUrl,
			[SSDKHashtagKey]: hashtag,
			[SSDKQuoteKey]: quote,
		}
		return obj;
	};
	/**
	 * 设置Twitter分享参数
	 * @param {string} text 				分享内容
	 * @param {string} images 			分享图片列表,传入参数可以为单张图片信息，也可以为一个Array，数组元素可以为string（图片路径)。如: "http://www.mob.com/images/logo_black.png" 或 ["http://www.mob.com/images/logo_black.png"]
	 * @param {string} video 			本地文件地址
	 * @param {number} latitude 		地理位置，纬度
	 * @param {number} longitude 	地理位置，经度
	 * @param {string} type 				分享类型，仅支持Text、Image、Video类型
	 */
	obj.twitter = function (text, images, video, latitude, longitude) {
		obj.paramters[`@platform(${SSDKPlatformID.Twitter})`] = {
			[SSDKTextKey]: text,
			[SSDKTypeKey]: type,
			[SSDKImagesKey]: images,
			[SSDKLatKey]: latitude,
			[SSDKLongKey]: longitude,
			[SSDKVideoKey]: video,
		};
		return obj;
	};


	/**
	 *  设置分享参数
	 *
	 * @param {*} text 							文本
	 * @param {*} images 						图片集合,传入参数可以为单张图片信息，也可以为一个Array，数组元素可以为String（图片路径)。如: "http://www.mob.com/images/logo_black.png" 或 ["http://www.mob.com/images/logo_black.png"]
	 * @param {*} url 							网页路径/应用路径
	 * @param {*} title 						标题
	 * @param {*} linkParameter 		场景的自定义参数
	 */
	obj.shareLink = function (text, title, images, url, linkParameter) {
		var params = {};
		obj.paramters["@platform(shareLink)"] = params;
		params[SSDKTypeKey] = SSDKContentTypeWebPage;
		params[SSDKTextKey] = text;
		params[SSDKImagesKey] = images;
		params[SSDKUrlKey] = url;
		params[SSDKTitleKey] = title;
		if (linkParameter != null) {
			params[SSDKShareLinkParameter] = linkParameter;
		}
		return obj;
	};
	return obj;
}

