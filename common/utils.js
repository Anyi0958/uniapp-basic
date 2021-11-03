/**
 * 常用方法封装 请求，文件上传等
 **/
import i18n from "@/lang";
 
const utils = {
	//接口地址
	interfaceUrl: function() {
		return 'http://192.168.1.104:8091' // 测试环境
	},
	
	showLoading: function(title, mask = true) {
		uni.showLoading({
			mask: mask,
			title: title || i18n.t('message.loading')
		})
	},
	
	/** toast
		 * @param String 	title 		提示的内容 icon 不为 none 文本最多显示 7 个汉字长度
		 * @param String 	icon 		图标 success error loading none 默认：none
		 * @param Boolean 	mask 		是否显示透明蒙层，防止触摸穿透，默认：false
		 * @param Number 	duration 	提示的延迟时间，单位毫秒，默认：1500
	 */
	toast: function(title,icon) {
		uni.showToast({
			title : title || i18n.t('toast.title'),
			icon : icon || 'none',
			duration : 1500,
			mask :  false,
		})
	},
	
	/** modal
		 * @param String 	title 		提示的标题 
		 * @param String 	content 	提示的内容
		 * 
		 * @param Boolean 	showCancel 	是否显示取消按钮，默认为 true
		 * @param String 	cancelText 	取消按钮的文字，默认为"取消"，最多 4 个字符
		 * @param String 	cancelColor	取消按钮的文字颜色，默认为"#555"
		 * 
		 * @param String 	confirmText 确定按钮的文字，默认为"确定"，最多 4 个字符
		 * @param String 	cancelColor	确定按钮的文字颜色，默认为"#5677fc"
		 * @param Function 	callback 	接口调用成功的回调函数
	 */
	modal: function(params) {
		uni.showModal({
			title: params.title || i18n.t('modeal.title'),
			content: params.content,
			showCancel: params.showCancel,
			cancelColor: params.cancelColor || "#555",
			cancelText : params.cancelText || i18n.t('modeal.cancelText'),
			confirmColor : params.confirmColor || "#5677fc",
			confirmText : params.confirmText || i18n.t('modeal.confirmText'),
			success(res) {
				if (res.confirm) {
					params.callback && params.callback(true)
				} else {
					params.callback && params.callback(false)
				}
			}
		})
	},
	
	/** request
	 * @param string 	url 		请求地址
	 * @param string	method 		请求方式  GET or POST
	 * @param {*} 		postData    请求参数
	 * @param bool 		isDelay 	是否延迟显示 loading
	 * @param bool 		isForm 		数据格式
		 *  true: 'application/x-www-form-urlencoded'
		 *  false:'application/json'
	 * @param bool 		hideLoading 是否隐藏loading true: 隐藏  false:显示
	 */
	delayed: null,
	request: async function(params) {
		// url, method, postData, isDelay, isForm, hideLoading
		//接口请求
		let loadding = false;
		utils.delayed && uni.hideLoading();
		clearTimeout(utils.delayed);
		utils.delayed = null;
		if (!params.hideLoading) {
			if (isDelay) {
				utils.delayed = setTimeout(() => {
					loadding = true
					utils.showLoading()
				}, 1000)
			} else {
				loadding = true
				utils.showLoading()
			}
		}

		return new Promise((resolve, reject) => {
			uni.request({
				url: utils.interfaceUrl() + params.url,
				data: params.postData,
				header: {
					'content-type': params.isForm ? 'application/x-www-form-urlencoded' : 'application/json',
					'token': utils.getToken()
				},
				method: params.method, //'GET','POST'
				dataType: 'json',
				success: (res) => {
					clearTimeout(utils.delayed)
					utils.delayed = null;
					if (loadding && !params.hideLoading) {
						uni.hideLoading()
					}
					resolve(res.data)
				},
				fail: (res) => {
					clearTimeout(utils.delayed)
					utils.delayed = null;
					utils.toast(i18n.t('request.error'),'error')
					reject(res)
				}
			})
		})
	},
	
	/**
	 * 上传文件
	 * @param string url 请求地址
	 * @param string src 文件路径
	 */
	uploadFile: function(url, src) {
		utils.showLoading()
		return new Promise((resolve, reject) => {
			const uploadTask = uni.uploadFile({
				url: utils.interfaceUrl() + url,
				filePath: src,
				name: 'imageFile',
				header: {
					'Authorization': utils.getToken()
				},
				formData: {
					// sizeArrayText:""
				},
				success: function(res) {
					uni.hideLoading()
					let d = JSON.parse(res.data.replace(/\ufeff/g, "") || "{}")
					if (d.code % 100 == 0) {
						//返回图片地址
						let fileObj = d.data;
						resolve(fileObj)
					} else {
						that.toast(res.msg);
					}
				},
				fail: function(res) {
					reject(res)
					that.toast(res.msg);
				}
			})
		})
	},
	
	isAndroid: function() {
		const res = uni.getSystemInfoSync();
		return res.platform.toLocaleLowerCase() == "android"
	},
	isPhoneX: function() {
		const res = uni.getSystemInfoSync();
		let iphonex = false;
		let models = ['iphonex', 'iphonexr', 'iphonexsmax', 'iphone11', 'iphone11pro', 'iphone11promax']
		const model = res.model.replace(/\s/g, "").toLowerCase()
		if (models.includes(model)) {
			iphonex = true;
		}
		return iphonex;
	},
	
	//设置lang
	setLang(lang) {
		return uni.setStorageSync('anit_lang',lang)
	},
	//获取lang
	getLang() {
		let lang =  uni.getStorageSync('anit_lang') || 'zh'
		i18n.locale = lang
		return lang
	},
	
	//设置token
	setToken(token) {
		return uni.setStorageSync('anit_token',token)
	},
	//获取token
	getToken() {
		return uni.getStorageSync('anit_token')
	},
	
	//判断是否登录
	isLogin: function() {
		return uni.getToken() ? true : false
	},
	//跳转页面，校验登录状态
	href(url, isVerify) {
		if (isVerify && !utils.isLogin()) {
			uni.navigateTo({
				url: '/pages/common/login/login'
			})
		} else {
			uni.navigateTo({
				url: url
			});
		}
	}
}

export default utils;
