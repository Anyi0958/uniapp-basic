import Vue from 'vue';
import Vuex  from "vuex";
import utils from "@/common/utils.js"
import i18n from "@/lang";
Vue.use(Vuex);

let state = {
	nickName:"anit", // 用户名
	lang:utils.getLang(),  // 语言
	token:utils.getToken(),  // token
	version:"", // 版本
	isUpdate:false, // 是否需要升级
};

let getters ={
};

let mutations = {
	SET_LANG : (state,lang)=>{
		state.lang = lang
	},
	
	SET_VERSION : (state,params)=>{
		state.version = params.version
		state.isUpdate = params.isUpdate
	},

	
	SET_TOKEN : (state,token)=>{
		state.token = token
	},
};

let actions = {
	// 切换语言
	handleLang({ commit }, lang){
		i18n.locale = lang;
		commit('SET_LANG',lang);
		utils.setLang(lang);
	},
	
	// 切换语言
	handleVersion({ commit }, version){
		commit('SET_VERSION',version);
	},
	
	// 用户登录
	handleLogin({ commit, dispatch }, userInfo){
		return new Promise((resolve,reject)=>{
			setTimeout(()=>{
				commit('SET_TOKEN','');
				utils.setToken('');
				resolve()
			},1000)
		})
	},
	
	// 用户退出
	handleLogout(){
		commit('SET_TOKEN','');
		utils.setToken('');
		uni.reLaunch({
			url:'pages/login/index'
		})
	}
};


const store = new Vuex.Store({
	state,
	getters,
	mutations,
	actions
})

export default store;