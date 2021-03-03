/**接口前缀 */
export const apiHost = 'http://124.70.150.11:' /* "http://192.168.1.4:" */;
export const port = "8091/";
export const mainPort = "8080/";
const api = "api/"
/**上传主机接口 */
export const uploadHost = '';
/**原始微信APPId */
export const appId = 'wxfc13a385511fbfce';
/**小程序秘钥 */
export const appS = "7d878414361fc483cebd07255a33fad6";
/**代理上传地址 */
export const proxyUploadUrl = '';
/**
 * 手机验证正则
 * 
 * 比较全面的手机验证
 */
export const phoneRegex = /^(\+86|0086)?\s*1[3-9]\d{9}$/;
/**
 * 邮箱验证正则
 * 
 * 详细的邮箱正则验证
 * 暂无特殊限制
 */
export const emailRegex = /[^.@]+@[^.@]+\.(com|cn|net)(\.cn)?$/;
/**
 * 密码判定正则
 * 
 * 暂定6到18位除空格符以外的任意字符
 */
export const passwordRegex = /^(\d|\w){6,18}/;
/**
 * 账号判定正则
 * 
 * 暂定6-18位除空格符以外的任意字符
 */
export const accountRegex = /^(\d|\w){6,18}/;
/**注册接口 */
export const reg = "111";
/**密码接口 */
export const loginByPwd = "222";
/**免密接口 */
export const loginBySms = "777";
/**验证接口 */
export const sendMs = "666";
/**改密接口 */
export const pwd = "";
/**节点信息接口 */
export const nodeInfo = `${api}nodeInfo`;
/**规格信息接口 */
export const specifications = "specifications";
export const result = {};
/**短信验证等待时间 */
export const time = 10;
/**一次性计时器计时量，以分钟为单位 */
export const timer = 1;
/**首页加载接口 */
export const queryPageShowInfo = `${api}queryPageShowInfo`;
/**商品单品信息查询 */
export const commodityInfo = `${api}queryCommodityById`;
/**商品信息查询 */
export const commodityByInfoId = `${api}queryCommodityByInfoId`;
/**商品批次查询 */
export const commodityBatch = `${api}queryCommodityBatch`;

/**
 * 获取NFC_ID
 * @param {string} data 读取的NFC字符串数据
 * @param {number} lenght 切割长度
 */
export function getNfcId(data, lenght) {
	let strArr = [];
	let n = 32;
	for (let i = 0; i < data.length / n; i++) {
		strArr.push(data.slice(n * i, n * (i + 1)));
	}
	return {
		strTagID: strArr[0].substring(0, lenght),
		strSPId: strArr[1].substring(0, lenght),
		strCSId: strArr[2].substring(0, lenght)
	};
}
/**获取商品ID */
export const getCommodityID = `${api}getCommodityID`;
/**商品信息上传 */
export const commodityUp = `${api}commodityInfoUp`;
/**商品批次上传 */
export const commodityBatchUp = `${api}commodityBatchUp`;
/**商品单品上传 */
export const commoditySingleUp = `${api}commoditySingleUp`;
/**账户关联商品查询 */
export const commodity_goods = `${api}queryCommodityByAccount`;
/**账户已发布批次查询 */
export const batchByAccount = `${api}queryBatchByAccount`;
/**账户已发布商品信息查询 */
export const commodityInfoByAccount = `${api}queryCommodityInfoByAccount`;

export const purchaseCommodity = `${api}purchaseCommodity`;

export const uploadImage = "file/uploadImage";
/**在线商品查询 */
export const commodityByEANUPC = `${api}queryCommodityByEANUPC`;
/**商品更新 */
export const updateCommodityInfo = `${api}updateCommodityInfo`;
/**商品单品更新 */
export const updateCommoditySingle = `${api}updateCommoditySingle`;
/**更新接口 */
export const update = "update";