* 运行uni-app
npm run dev:%PLATFORM%
* 发布uni-app
npm run build:%PLATFORM%
* 新建框架
vue create -p dcloudio/uni-preset-vue Name 
* %PLATFORM% 可取值如下：

01. app-plus                app平台生成打包资源（支持npm run build:app-plus，可用于持续集成。不支持run，运行调试仍需在HBuilderX中操作）
02. h5                      H5
03. mp-alipay               支付宝小程序
04. mp-baidu                百度小程序
05. mp-weixin               微信小程序
06. mp-toutiao              字节跳动小程序
07. mp-qq                   qq 小程序
08. mp-360                  360 小程序
09. quickapp-webview        快应用通用
10. quickapp-webview-union  快应用联盟
11. quickapp-webview-huawei 快应用华为
