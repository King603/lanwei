# 交互接口API

[uni-app转换缩写](./api/request/index.js)

在各个子API引用 ``request``

```javascript
import requst from ".";
```

在 ``export default function(){}`` 中调用 ``requst()`` 方法

```javascript
export default function (code, option) {
	request({
		url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appS}&js_code=${code}&grant_type=authorization_code`,
		method: "GET",
		success(data) {
			option.success(data.openid);
		},
		fail(msg) {
			uni.showToast({
				title: "openid获取失败",
				icon: "none",
			});
			option.fail(msg);
		},
	});
}
```

## 商品接口
1. 账户关联查询

[账户关联商品查询](./api/request/detail/aGQ.js)

[账户已发布商品信息查询](./api/request/detail/pGIQ.js)

[账户已发布批次查询](./api/request/detail/pBQ.js)

**data参数说明：**
|参数名|必填|类型|长度|说明|
---|---|---|---|:---
businessID|Y|``String``|25位|商家ID
account|Y|||账号

2. 在线显示

[在线商品信息查询](./api/request/detail/onlineCIQ.js)

**data参数说明：**
|参数名|必填|类型|长度|说明|
---|---|---|---|:---
page|Y|``Number``||显示的页面0：主页

[在线展示查询](./api/request/detail/onlineDQ.js)

**data参数说明：**
|参数名|必填|类型|长度|说明|
---|---|---|---|:---
codeEANUPC|Y|``String``|13位|

3. 商品

[商品购买](./api/request/detail/pC.js)

**data参数说明：**
|参数名|必填|类型|长度|说明|
---|---|---|---|:---
commodityID|Y|``String``|25|商品ID
manufacturerID|Y|``String``|25|厂商ID
tagID|Y|``String``|25|标签ID
tagData |Y|``String``|变长|标签数据
businessID|Y|``String``|25|购买者商家ID
account|Y|||账号

4. 更新

[商品更新](./api/request/detail/updateCI.js)

**data参数说明：**
|参数名|必填|类型|长度|说明|
---|---|---|---|:---
commodityInfo|Y|``Object``|变长|商品信息
businessID|Y|``String``|25|账号商家ID
account|Y|||账号

**commodityInfo参数说明：**
|参数名|必填|类型|长度|说明|
---|---|---|---|:---
info_id|Y|``Number``||信息ID
commodityName|Y|``String``|1-48位|商品名称
codeEANUPC|Y|``String``|13位|EAN/UPC码，国家商品标准条码
manufacturerID|Y|``String``|25位|厂商ID
imageURL|Y|``String``||图片地址
specificationsMain|N|``String``||主要规格
specificationsNum|Y|``Number``|大于等于0|规格数量
specifications|Y|``Array<Object>``||规格种类

**specifications参数说明：**
|参数名|必填|类型|长度|说明|
---|---|---|---|:---
name|Y|``String``||规格名称
value|Y|``String``||规格值

[单品更新](./api/request/detail/updateCS.js)

**data参数说明：**
|参数名|必填|类型|长度|说明|
---|---|---|---|:---
commodityID|Y|``String``|25|商品ID
manufacturerID|Y|``String``|25|厂家ID
tagID|Y|``String``|25|标签ID
tagCardID|Y|``String``||标签芯片ID
tagData|Y|``String``||标签数据
codeEANUPC|Y|``String``||EAN/UPC码
state|Y|``String``||商品状态
businessID|Y|``String``|25|账号商家ID
account|Y|||账号

5. 上传

[文件上传](./api/request/detail/upload.js)

**参数说明：**
|参数名|必填|类型|长度|说明|
---|---|---|---|:---
name|Y|``String``||固定值：'`file`'
formData|N|||保留

**示例说明：**
```javascript
uni.uploadFile({
	url: apiHost + port + option.url,
	filePath,
	name: "file",
	header: { "content-type": "multipart/form-data" },
	formData: { user: "test" },
	success: (uploadFileRes) => {
		/**@type {{msg:string; code:number; isSuc:boolean; data:string;}} */
		let result = JSON.parse(uploadFileRes.data);
		if (result.code == 1) option.success(result.data);
		else option.fail(`${stateName}--success: ${result.msg}`);
	},
	fail(res) {
		option.fail(`${stateName}--fail: ${res.errMsg}`);
		console.error(res.errMsg);
	},
});
```

[商品信息上传](./api/request/detail/uploadCI.js)

**data参数说明：**
|参数名|必填|类型|长度|说明|
---|---|---|---|:---
commodityInfo|Y|``Object``|变长|商品信息
account|Y|||账号

**commodityInfo参数说明：**
|参数名|必填|类型|长度|说明|
---|---|---|---|:---
info_id|Y|``Number``||信息ID
commodityName|Y|``String``|1-48位|商品名称
codeEANUPC|Y|``String``|13位|EAN/UPC码，国家商品标准条码
manufacturerID|Y|``String``|25位|厂商ID
imageURL|Y|``String``||图片地址
specificationsMain|N|``String``||主要规格
specificationsNum|Y|``Number``|大于等于0|规格数量
specifications|Y|``Array<Object>``||规格种类

**specifications参数说明：**
|参数名|必填|类型|长度|说明|
---|---|---|---|:---
name|Y|``String``||规格名称
value|Y|``String``||规格值

[商品批次上传](./api/request/detail/uploadCB.js)

**data参数说明：**
|参数名|必填|类型|长度|说明|
---|---|---|---|:---
manufacturerID|Y|``String``|25|厂家ID
codeEANUPC|Y|``String``||EAN/UPC码
total|Y|``Number``||该批次单品数量
info_id|Y|||信息ID

[商品单品上传](./api/request/detail/uploadCS.js)

**data参数说明：**
|参数名|必填|类型|长度|说明|
---|---|---|---|:---
commodityID|Y|``String``|25|商品ID
manufacturerID|Y|``String``|25|厂家ID
tagID|Y|``String``|25|标签ID
tagCardID|Y|``String``||标签芯片ID
tagData|Y|``String``||标签数据
codeEANUPC|Y|``String``||EAN/UPC码
state|Y|``Number``||商品状态
account|Y|||账号

[获取商品ID](./api/request/detail/getCommodityID.js)

**data参数说明：**
|参数名|必填|类型|长度|说明|
---|---|---|---|:---
tagCardID|Y|``String``|4-6位|标签芯片ID
codeEANUPC|Y|``String``|13位|EAN/UPC码,国家商品标准条码
commodityName|Y|``String``|1-48位|商品名称
account|Y|||账号

6. 查询

[单品信息查询](./api/request/detail/queryCByID.js)

**data参数说明：**
|参数名|必填|类型|长度|说明|
---|---|---|---|:---
commodityID|Y|``String``|25|商品ID 
manufacturerID|Y|``String``|25|厂商ID
tagID|Y|``String``|25|标签ID
tagData |Y|``String``|变长|标签数据
account|N|||账号

[商品信息查询](./api/request/detail/queryCByInfoID.js)

**data参数说明：**
|参数名|必填|类型|长度|说明|
---|---|---|---|:---
info_id|Y|``Number``||商品信息ID 
account|N|||账号

[商品批次查询](./api/request/detail/queryCB.js)

**data参数说明：**
|参数名|必填|类型|长度|说明|
---|---|---|---|:---
batch_id|Y|``Number``||批次ID 
account|N|||账号

## 用户接口

1. [用户注册](./api/request/user/reg.js)

2. 登入

[密码登入](./api/request/user/loginByPwd.js)

[免密登入](./api/request/user/loginBySms.js)

3. [手机验证](./api/request/user/sendMs.js)

4. [修改密码](./api/request/user/changePwd.js)
