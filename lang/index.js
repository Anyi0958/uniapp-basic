import Vue from 'vue';
import VueI18n  from "vue-i18n";
import utils from "../common/utils.js"

// 引入语言包，注意路径
import Chinese from './locales/zh.js';
import English from './locales/en.js';

Vue.use(VueI18n)

const i18n = new VueI18n({
	silentTranslationWarn: false, // 是否取消本地化失败时输出的警告
	locale: 'zh', // 语言环境
	fallbackLocale: 'zh', // 预设的语言环境
	messages: {
		'zh': Chinese,
		'en': English,
	}
});


export default i18n;