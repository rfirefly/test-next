// module模式，Sec-Fetch-Mode:cors，线上请求资源会出现跨域
// 方案一： 通过店铺域名找资源（废弃，通过域名代理会导致速度慢且无法使用缓存机制）
// 方案二： 放弃module模式，通过设置全局参数的方式获取组件内容

Vue.component('trackMain', window.trackMain)
Vue.component('trackForm', window.trackForm)
Vue.component('loading', window.trackLoading)
Vue.component('trackOrderDetail', window.trackOrderDetail)
Vue.component('trackStatusStepLine', window.trackStatusStepLine)
Vue.component('trackProductRecommendation', window.trackProductRecommendation)

// 时间格式化引入插件
dayjs.extend(dayjs_plugin_advancedFormat);

var app = new Vue({
    el: '#track123-app',
})





