import Vue from 'vue';
import App from './App';
import * as config from "./util/config.js"

import store from './store';

Vue.config.productionTip = false;
Vue.config.devtools = false;

Vue.prototype.$store = store;

App.mpType = 'app';

Vue.config.errorHandler = function (err, vm, info) {
	// `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
	// 只在 2.2.0+ 可用
	let msg = `错误发生在：${info}中，具体信息：${err.stack}`;
	console.log(msg);
	// report(msg);
};
// function report(msg) {
// 	var reportUrl = config.apiHost + "/report";
// 	new Image().src = reportUrl + encodeURIComponent(JSON.stringify(msg));
// }

const app = new Vue({
	store,
	...App,
})
app.$mount();


// 封装一个H5+的重启APP的方法
Vue.prototype.$plusRestartApp = function () {
	// #ifdef APP-PLUS
	let login_info = uni.getStorageSync("login_info");
	uni.clearStorageSync();
	uni.setStorageSync("login_info", { ...login_info });
	plus.runtime.restart();
	// #endif
}
