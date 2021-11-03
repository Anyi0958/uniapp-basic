<template>
<view >
	{{title}}
	<button type="default" @click="change">改改</button>
	<u-button >默认按钮</u-button>
	<u-button type="primary">主要按钮</u-button>
	<u-button type="success">成功按钮</u-button>
	<u-button type="info">信息按钮</u-button>
	<u-button type="warning">警告按钮</u-button>
	<u-button type="error">危险按钮</u-button>
	<!-- <web-view  src="https://www.iiotsaas.com/ztcenter/repository/Yilong/4934bef2f79540df8c93878e02c15be1/zutai/Page0.htm"></web-view> -->
</view>
</template>

<script>
	export default {
		data() {
			return {
				// title: 'Hello'
			}
		},
		computed:{
			title(){
				return this.$t('message.loading')
			}
		},
		onLoad() {
			// uni.setNavigationBarTitle({
			// 	title:"详情"
			// })
			// setTimeout(()=>{
			// 	uni.setNavigationBarTitle({
			// 		title:"详情"
			// 	})
			// 	var currentWebview = this.$mp.page.$getAppWebview() //获取当前页面的webview对象
			// 	var wv = currentWebview.children()[0]
			// 	wv.setStyle({
			// 		scalable:true,
			// 		background:"red"
			// 	})
			// },5000)
		},
		methods: {
			change(){
				this.$store.dispatch('handleLang',this.$i18n.locale == 'en' ?'zh':'en')
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
