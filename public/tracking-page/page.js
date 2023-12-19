
/* 
page模式
用于支持用户在shopify新增页面page
需要通过打包构建获取对应环境, 打包时生成变量DEV_ENV，如果没有该变量本地开发时先进行打包：npm run build-serve（使用打包生成的文件）

插入page模式的代码：
<div id="track123-app"></div>
<script type="text/javascript" src="https://shp-test.track123.com/tracking-page/build/page.min.js"></script>
*/
(function () {
    var baseUrlMatch = {
        'dev': 'https://shp-test.track123.com',
        'test': 'https://shp-test.track123.com',
        'prod': 'https://shp.track123.com'
    }
    
    var baseUrl = baseUrlMatch[DEV_ENV];
    var devUrl = 'http://localhost:3314'
    var TRACK_BASE_URL = baseUrl;

    // 判断是否来自page模式
    window.isTrack123Page = true
    // 根据track123_app的宽度加载css文件
    window.hasLoadTrack123PageCss = false
    window.track123BaseUrl = baseUrl

    fetch(`${baseUrl}/tracking-page/version.json`).then(res => res.json()).then(config => {
        const version = config.version
        window.track123Version = version

        // add css
        if (DEV_ENV === 'dev') {
            loadCss(`${devUrl}/tracking-page/tradition/css/index.css`)
            loadCss(`${devUrl}/tracking-page/tradition/css/media/smallScreen.css`, 'screen and (max-width: 833px)')
        } else {
            loadCss(`${baseUrl}/tracking-page/build/common-tradition.min.css?v=${version}`)
            loadCss(`${baseUrl}/tracking-page/build/smallScreen-tradition.min.css?v=${version}`, 'screen and (max-width: 833px)')
        }
       
        // add js
        if (DEV_ENV === 'dev') {
            loadJS(`${devUrl}/tracking-page/tracking-page/mixins/form.js`);
            loadJS(`${devUrl}/tracking-page/tracking-page/mixins/orderDetail.js`);

            loadJS(`${devUrl}/tracking-page/tradition/components/index.js`);
            loadJS(`${devUrl}/tracking-page/tradition/components/Form.js`);
            loadJS(`${devUrl}/tracking-page/tradition/components/Loading.js`);
            loadJS(`${devUrl}/tracking-page/tradition/components/OrderDetail.js`);
            loadJS(`${devUrl}/tracking-page/tradition/components/StatusStepLine.js`);
            loadJS(`${devUrl}/tracking-page/tradition/components/ProductRecommendation.js`);
        } else {
            loadJS(`${baseUrl}/tracking-page/build/mixins.min.js?v=${version}`);
            loadJS(`${baseUrl}/tracking-page/build/components-tradition.min.js?v=${version}`);
        }
       
        loadJS(`${baseUrl}/tracking-page/build/vendor.min.js?v=${version}`, function() {
            getConfig(version)
        })
    })
    
    function loadCss(url, media) {
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet')
        link.setAttribute('href', url)
        if (media) link.setAttribute('media', media)
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    // load js
    function loadJS(url, callback){
        const script = document.createElement('script'),fn = callback || function(){};
        script.type = 'text/javascript';
         //IE
         if (script.readyState) {
            script.onreadystatechange = function(){
                if( script.readyState == 'loaded' || script.readyState == 'complete' ){
                    script.onreadystatechange = null;
                    fn();
                }
            };
        } else {
            script.onload = function(){
                fn();
            };
        }
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    // 获取配置
    function getConfig(version) {
        const shop = Shopify && Shopify.shop ? Shopify.shop : ''
        const url = `${baseUrl}/endApi/api/store/anonymous/get-tracking-page-config?storeDomain=${shop}`
        fetch(url).then(res => res.json()).then(config => {
            fetch(`${baseUrl}/endApi/api/store/get-tracking-page-translation-config?store_domain=${shop}`).then(res => res.json()).then(data => {
                config.translation_configs = data
                window.track123Config = config
                initDom()
                initVariable()
                getCustomCss(config)
                getGoogleTranslate(config)
                setTimeout(() => {
                    loadJS(`${baseUrl}/tracking-page/build/index-tradition.min.js?v=${version}`)
                }, 500)
            })
        })
    }

    // 创建vue挂载的dom
    function initDom() {
        const appDom = document.getElementById('track123-app')
        appDom.innerHTML = '<track-main :config="window.track123Config"><div class="track123_loading"><span></span><span></span><span></span><span></span><span></span></div></track-main>'
    }

    // 初始化变量
    function initVariable() {
        const shop = Shopify && Shopify.shop ? Shopify.shop : ''
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = `
            var TRACK_DOMAIN = '${shop}';
            var TRACK_BASE_URL = '${TRACK_BASE_URL}';
            var TRACK_NODE_ENV = '${TRACK_NODE_ENV}';
        `
        document.getElementsByTagName('head')[0].appendChild(script);
    }

     // 获取自定义样式
     function getCustomCss(config) {
        const theme_container_width = (
            config && config.style && config.style.theme_container_width && config.style.theme_container_width ?
            `${config.style.theme_container_width}${config.style.theme_container_width_unit}` : 
            '1200px')
        const style = document.createElement('style');
        style.innerHTML = `
            ${config.css_and_html.customer_css}
            .track123_track_wrapper {
                max-width: ${theme_container_width};
            }
            .track123_loading{width:120px;height:50vh;margin:0auto;margin-top:0px;display:flex;justify-content:space-between;align-items:center;}.track123_loadingspan{margin:4px;width:0.5rem;height:0.5rem;background-color:#6D7175;border-radius:50%;display:inline-block;line-height:3rem;animation:loading1.25sinfiniteease;animation-play-state:paused;-webkit-animation:load1.5sinfiniteease;}@-webkit-keyframesload{0%{-webkit-transform:scale(1);}20%{-webkit-transform:scale(2.5);}40%{-webkit-transform:scale(1);}}.track123_loadingspan:nth-child(2){-webkit-animation-delay:0.3s;}.track123_loadingspan:nth-child(3){-webkit-animation-delay:0.6s;}.track123_loadingspan:nth-child(4){-webkit-animation-delay:0.9s;}.track123_loadingspan:nth-child(5){-webkit-animation-delay:1.2s;}
        `
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    // Google Translate
    function getGoogleTranslate(data) {
        // google翻译
        const googleTranslateWidget = data.configure_options.google_translate_widget;
        if (googleTranslateWidget) {
            const googleTranslateScripit = document.createElement('script');
            googleTranslateScripit.type = 'text/javascript';
            googleTranslateScripit.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            document.head.appendChild(googleTranslateScripit);

            const googleTranslateExecuteScripit = document.createElement('script');
            googleTranslateExecuteScripit.type = 'text/javascript';
            googleTranslateExecuteScripit.innerHTML = `
                function googleTranslateElementInit() {
                    new google.translate.TranslateElement({ pageLanguage:"en" }, "google_translate_element");
                }
            `
            document.head.appendChild(googleTranslateExecuteScripit);

            const googleTranslateElement = document.createElement('div');
            const googleTranslateWidgetPosition = data.configure_options.google_translate_widget_position;
            if (googleTranslateWidgetPosition == 'bottomLeft') {
                googleTranslateElement.innerHTML = '<div id="google_translate_element" style="position:fixed;bottom:10px; display: block; left: 10px; right: unset; z-index: 100000000; background-color: transparent;"><div class="skiptranslate goog-te-gadget" dir="ltr" style=""><div id=":0.targetLanguage"></div></div></div>';
            } else {
                googleTranslateElement.innerHTML = '<div id="google_translate_element" style="position:fixed;bottom:10px; display: block; left: unset; right: 10px; z-index: 100000000; background-color: transparent;"><div class="skiptranslate goog-te-gadget" dir="ltr" style=""><div id=":0.targetLanguage"></div></div></div>';
            }
            document.body.appendChild(googleTranslateElement);
        }
    }
}());