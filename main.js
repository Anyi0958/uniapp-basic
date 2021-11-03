import App from './App';
import Vue from 'vue';
import store from "./store";
import i18n from "./lang";
import utils from "@/common/utils";

Vue.prototype.utils = utils

// #ifdef MP-WEIXIN
// 由于微信小程序的运行机制问题，需声明如下一行，H5和APP非必填
Vue.prototype._i18n = i18n
// #endif

import uView from "uview-ui";
Vue.use(uView);

Vue.config.productionTip = false;
App.mpType = 'app';
const app = new Vue({
	store,
	i18n,
    ...App
})
app.$mount()

