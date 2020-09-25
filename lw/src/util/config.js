export default {
	/**接口前缀 */
	apiHost: /* 'https://api.xmlanwan.com/api/' */ "http://192.168.1.10:8081",
	/**上传主机接口 */
	uploadHost: '',
	/**原始微信APPId */
	appId: 'wxe473d1e074b41e1f',
	/**小程序秘钥 */
	appSecret: "f47f6fca20b0a755362b32e9c49ccbc7",
	/**代理上传地址 */
	proxyUploadUrl: '',
	/**
	 * 手机验证正则
	 * 
	 * 比较全面的手机验证
	 */
	phoneRegex: /^(\+86|0086)?\s*1[3-9]\d{9}$/,
	/**
	 * 邮箱验证正则
	 * 
	 * 详细的邮箱正则验证
	 * 暂无特殊限制
	 */
	emailRegex: /[^.@]+@[^.@]+\.(com|cn|net)(\.cn)?$/,
	/**
	 * 密码判定正则
	 * 
	 * 暂定6到18位除空格符以外的任意字符
	 */
	passwordRegex: /^(\d|\w){6,18}/,
	/**
	 * 账号判定正则
	 * 
	 * 暂定3位以上除空格符以外的任意字符
	 */
	accountRegex: /^(\d|\w){3,}/,
	/**注册接口 */
	reg: "/111",
	/**登录接口 */
	login(type) {
		return `/${type == 0
			? "333" // 免密接口
			: "222" // 密码接口
			}`;
	},
	/**改密接口 */
	pwd: "",
};
