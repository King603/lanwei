# lw

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



## 条件编译
条件编译是用特殊的注释作为标记，在编译时根据这些特殊的注释，将注释里面的代码编译到不同平台。

### 写法：以 #ifdef 或 #ifndef 加 %PLATFORM% 开头，以 #endif 结尾。

#ifdef：if defined 仅在某平台存在
#ifndef：if not defined 除了某平台均存在
%PLATFORM%：平台名称



条件编译写法				说明
#ifdef APP-PLUS
需条件编译的代码		仅出现在 App 平台下的代码
#endif
```
#ifndef H5
需条件编译的代码
#endif
除了 H5 平台，其它平台均存在的代码
#ifdef H5 || MP-WEIXIN
需条件编译的代码
#endif
```
在 H5 平台或微信小程序平台存在的代码（这里只有||，不可能出现&&，因为没有交集）
%PLATFORM% 可取值如下：

|值|平台|
|---|:---|
|APP-PLUS|App|
|APP-PLUS-NVUEApp nvue|
|H5|H5|
|MP-WEIXIN|微信小程序|
|MP-ALIPAY|支付宝小程序|
|MP-BAIDU|百度小程序|
|MP-TOUTIAO|字节跳动小程序|
|MP-QQ|QQ小程序|
|MP-360|360小程序|
|MP|微信小程序/支付宝小程序/百度小程序/字节跳动小程序/QQ小程序/360小程序|
|quickapp-webview|快应用通用(包含联盟、华为)|
|quickapp-webview-union|快应用联盟|
|quickapp-webview-huawei|快应用华为|

### 支持的文件

.vue
.js
.css
pages.json
各预编译语言文件，如：.scss、.less、.stylus、.ts、.pug
### 注意： 条件编译是利用注释实现的，在不同语法里注释写法不一样，js使用 // 注释、css 使用 /* 注释 */、vue/nvue 模板里使用 <!-- 注释 -->；