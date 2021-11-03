<script>
export default {
	onLaunch: function() {
		let that = this;
		
		// #ifdef APP-PLUS
		/* 5+环境锁定屏幕方向 */
		plus.screen.lockOrientation('portrait-primary'); //锁定
		
		//app检测更新 获取版本号
		plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
			return false;
			// 后台查询是否需要更新
			that.utils.request({
				url:'/config/getNewestVersion',
				method'POST',
				postData:{
					platform: plus.os.name.toLocaleLowerCase(), // 手机类型 ios android
					version: widgetInfo.version //资源版本号
				}).then((res) => {
					let params = {
						version:widgetInfo.version, // 版本
						isUpdate:false, // 是否需要升级
					}
					if (res.code === 200 && res.data && (res.data.updateUrl || res.data.partUpdateUrl)) {
						params.isUpdate = true
						let data = res.data
						that.tui.modal('检测到新版本', data.updateLog ? data.updateLog : '请您先更新再进行操作，若不及时更新可能导致部分功能无法正常使用。', false, res => {
							// 1. apk 更新
							// android 应用市场更新
							plus.runtime.openURL(data.updateUrl);
							plus.runtime.restart();
							
							// ios 跳转app store下载
							//在App Store Connect中的App Store下的app信息，可找到appleId
							let appleId= 1570364613
							plus.runtime.launchApplication({
								action: `itms-apps://itunes.apple.com/cn/app/id${appleId}?mt=8`
							}, function(e) {
								console.log('Open system default browser failed: ' + e.message);
							});
								
							plus.runtime.openURL(vm.update_info.download_url, function() { //调用外部浏览器打开更新地址
								plus.nativeUI.toast("打开错误");
								vm.showFullMask(false); //更新
							});
							
							// 2. 资源包更新  在线升级
							// 下载升级资源包
							download_wgt() {
								// plus.nativeUI.showWaiting("下载更新文件..."); //下载更新文件...
								let options = {
									method: "get"
								};
								let dtask = plus.downloader.createDownload(vm.update_info.download_url, options, function(d, status) {});
				
								dtask.addEventListener("statechanged", function(task, status) {
									if (status === null) {} else if (status == 200) {
										//在这里打印会不停的执行，请注意，正式上线切记不要在这里打印东西///////////////////////////////////////////////////
										vm.downstatus = task.state;
										switch (task.state) {
											case 3: // 已接收到数据  
												vm.downloadedSize = task.downloadedSize;
												let totalSize = 0;
												if (task.totalSize) {
													totalSize = task.totalSize //服务器须返回正确的content-length才会有长度
												}
												vm.schedule = parseInt(100 * task.downloadedSize / totalSize);
												break;
											case 4:
												 // 安装wgt包  
												plus.nativeUI.showWaiting("安装更新文件..."); //安装更新文件...
												plus.runtime.install(task.filename, {}, function() {
													plus.nativeUI.closeWaiting();
													plus.runtime.restart();
													// 应用资源下载完成！
													// plus.nativeUI.alert("应用资源下载完成！", function() {
														// plus.runtime.restart();
													// });
												}, function(e) {
													plus.nativeUI.closeWaiting();
													// 安装更新文件失败
													plus.nativeUI.alert("安装更新文件失败[" + e.code + "]：" + e.message);
													vm.showFullMask(false); //更新
												});
												break;
										}
									} else {
										// plus.nativeUI.closeWaiting();
										plus.nativeUI.toast("下载出错");
										vm.downing = false;
										vm.downstatus = 0;
										vm.showFullMask(false); //更新
									}
								});
								dtask.start();
							},
								
						});
					}
					this.$store.commit('SET_VERSION',params)
				}).catch((e) => {
					
				})
			});
		// #endif
		
		// #ifdef MP-WEIXIN
		if (wx.canIUse('getUpdateManager')) {
			const updateManager = wx.getUpdateManager();
			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				if (res.hasUpdate) {
					updateManager.onUpdateReady(function() {
						that.tui.modal('更新提示', '新版本已经上线啦~，为了获得更好的体验，建议立即更新', false, res => {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						});
					});
					updateManager.onUpdateFailed(function() {
						// 新的版本下载失败
						that.tui.modal('更新失败', '新版本更新失败，为了获得更好的体验，请您删除当前小程序，重新搜索打开', false, res => {});
					});
				}
			});
		}
		// #endif
	},
	onShow: function() {
		
	},
	onHide: function() {
		//console.log('App Hide')
	},
	onError: function(err) {
		//全局错误监听
		// #ifdef APP-PLUS
		plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
			const res = uni.getSystemInfoSync();
			let errMsg = `手机品牌：${res.brand}；手机型号：${res.model}；操作系统版本：${res.system}；客户端平台：${res.platform}；错误描述：${err}`;
			console.log('发生错误：' + errMsg);
		});
		// #endif
	}
};
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
</style>
