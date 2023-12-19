const trackProductRecommendation = {
    props: ['config', 'productRecommendations', 'orderDetail'],
	template: `
        <div v-if="config.configure_options.product_recommendations && productRecommendations && productRecommendations.length" class="track123_product_recommendations_wrapper" :style="{bottom: !showDetail ? '-32px' : '0'}">
            <div class="header" @click="toggleDetail">
                <div class="title">{{ translation.product_recommendation.may_like }}</div>
                <svg :class="{'active_svg': showDetail}" width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.2045 0.954505C1.6039 0.555105 2.2289 0.518796 2.66932 0.845578L2.7955 0.954505L6.5 4.6585L10.2045 0.954505C10.6039 0.555105 11.2289 0.518796 11.6693 0.845578L11.7955 0.954505C12.1949 1.3539 12.2312 1.9789 11.9044 2.41932L11.7955 2.5455L7.2955 7.0455C6.8961 7.4449 6.2711 7.4812 5.83068 7.15442L5.7045 7.0455L1.2045 2.5455C0.765165 2.10616 0.765165 1.39384 1.2045 0.954505Z"/>
                </svg>
            </div>
            <div :class="['track123_product_recommendations_content', {'track123_product_recommendations_content_show': showDetail}, {'track123_product_recommendations_content_hide': !showDetail}]">
                <div class="swiper">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="(item, index) in productRecommendationList" :key="index">
                            <div class="track123-swiper-slide" @click="goProductLink(item)">
                                <div 
                                    :class="['track123_product_link_container', {'track123_product_link_fill_container': config.configure_options.product_image_format == 'Fill'}]" 
                                    :style="{backgroundImage: 'url('+item.imageUrl+')'}" />
                                <div class="content">
                                    <div class="track123_product_title">{{ item.title }}</div>
                                    <div class="track123_product_price_container">
                                        <s v-if="item.compare_at_price" v-html="item.compare_at_price" class="track123_product_compare_price">{{ item.compare_at_price }}</s>
                                        <div class="track123_product_price" v-html="item.price">{{ item.price }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
	`,
    data() {
        return {
            Swiper: null,
            showDetail: true,
            preview: false,
            translation: {}
        }
    },
    watch: {
        productRecommendations(newValue) {
            // 异步获取产品推荐，需要等待获取到产品时再初始化swiper
            if (newValue && newValue.length && !this.Swiper) {
              this.initSwiper()
            }
        },
        orderDetail(newValue) {
            if (newValue) {
                this.preview = newValue.preview
                this.initSwiper()
            }
        }
    },
    computed: {
        productRecommendationList() {
            const productRecommendationList = this.productRecommendations ? [...this.productRecommendations] : []
            productRecommendationList.forEach(item => {
                if (!window.isTrack123Page) {
                    item.price = this.getLiquedMoneyFormat(item.price)
                    if (item.compare_at_price) item.compare_at_price = this.getLiquedMoneyFormat(item.compare_at_price)
                }
            });
            return productRecommendationList
        },
        baseUrl() {
			return TRACK_BASE_URL || window.TRACK_BASE_URL;
		},
    },
    created () {
        this.translation = this.getTranslation()
    },
    methods: {
        initSwiper() {
            setTimeout(() => {
                this.Swiper = new Swiper('.swiper', {
                    autoplay: true,
                    spaceBetween: 24,
                    slidesPerView: 'auto',
                    scrollbar: {
                        draggable: true
                    }
                })
            }, 1000)
        },
        // Modern无法获取当前语言，暂时先通过路由判断
		getModernMultiLanguage() {
			if (this.config.style && this.config.style.theme != "modern") return;
			let modernMultiLanguage = ''
			const urlList = window.location.href.split('/')
			// 除了这四种外，说明是多言语
			if (!['apps', 'a', 'community', 'tools'].includes(urlList[3])) {
				modernMultiLanguage = urlList[3]
                if (modernMultiLanguage) modernMultiLanguage = modernMultiLanguage.split('-')[0]
			}
			return modernMultiLanguage
		},
		getTranslation() {
			let translation = null
			const modernMultiLanguage = this.getModernMultiLanguage()
			const defaultTranslation = this.config.translation_configs && this.config.translation_configs.translation_configs && this.config.translation_configs.translation_configs.length 
				? this.config.translation_configs.translation_configs[0].translation : {}
			const whiteList = ['free', 'Growth', 'Advanced']
			const permissionName = this.config.translation_configs.func_permission || this.config.translation_configs.plan || 'free'
			this.config.translation_configs.translation_configs.forEach(item => {
                const modernCode = item.code.split('-')[0]
                if (this.config.style.theme && this.config.style.theme == "default") {
                    try {
						// 拥有翻译模版权限才能使用非默认的模版
                        // if (item.code == Shopify.locale && whiteList.includes(permissionName)) {
                        if (item.code == Shopify.locale) {
							translation = item.translation
						}
                    } catch (error) {
                        console.log('Shopify undefine')
                    }
                // } else if (modernMultiLanguage && item.code == modernMultiLanguage && whiteList.includes(permissionName)) {
                } else if (modernMultiLanguage && modernCode == modernMultiLanguage) {
					translation = item.translation
				}
			})
			return translation || defaultTranslation
		},
        toggleDetail() {
            this.showDetail = !this.showDetail;
        },
        addCart(url, variantId) {
            let formData = new FormData();
            formData.append('form_type', 'product')
            formData.append('id', variantId)
            formData.append('quantity', 1)
            // 直接只用
            try {
                fetch('/cart/add.js', {
                    method: 'POST',
                    body: formData
                }).then(res => {
                    if (res.ok) return res.json()
                    if (!res.ok) {
                        window.open(`${url}?utm_source=track123_recommendations`)
                        return false
                    };
                }).then(res => {
                    if (res) {
                        window.open(`${window.location.origin}/cart`)
                    }
                })
            } catch (error) {}
        },
        goProductLink(data) {
            if (!this.orderDetail.preview) {
                this.uploadMarketing(data)
                const variantId = data.variants[0].id
                switch (this.config.configure_options.product_action_type) {
                    case 'View Item':
                        window.open(`${data.url}?utm_source=track123_recommendations`)
                        break;
                    case 'Add to cart':
                        this.addCart(data.url, variantId)
                        break;
                    case 'Buy now':
                        window.open(`/cart/${variantId}:1?utm_source=track123_recommendations`)
                        break;
                    default:
                        window.open(`${data.url}?utm_source=track123_recommendations`)
                        break;
                }
            }
        },
        // 获取liqued的金额模板
        // 参考文档：https://shopify.dev/api/liquid/filters/money-filters
        // https://help.shopify.com/en/manual/payments/currency-formatting?shpxid=6f83eb4c-DFE1-482F-1628-84EB1CBF0983        
       getLiquedMoneyFormat(price) {
            if (typeof price === 'string') {
                price = price.replace('.', '');
            }
            let value = '';
            const placeholderRegex = /\<\<\s*(\w+)\s*\>\>/;
            const formatString = this.config.money_format;
            switch (formatString.match(placeholderRegex)[1]) {
                case 'amount':
                    value = this.formatWithDelimiters(price, 2);
                    break;
                case 'amount_no_decimals':
                    value = this.formatWithDelimiters(price, 0);
                    break;
                case 'amount_with_comma_separator':
                    value = this.formatWithDelimiters(price, 2, '.', ',');
                    break;
                case 'amount_no_decimals_with_comma_separator':
                    value = this.formatWithDelimiters(price, 0, '.', ',');
                    break;
                case 'amount_with_apostrophe_separator':
                    value = this.formatWithDelimiters(price, 2, "'", '.');
                    break;
                case 'amount_no_decimals_with_apostrophe_separator':
                    value = this.formatWithDelimiters(price, 0, "'", '.');
                    break;
            }
            return formatString.replace(placeholderRegex, value);
        },
        formatWithDelimiters(price, precision, thousands, decimal) {
            precision = (precision || precision == 0) ? precision : 2;
            thousands = thousands || ",";
            decimal = decimal || ".";
            if (isNaN(price) || price == null) {
                return 0;
            }
            price = (price / 100.0).toFixed(precision);
            const parts = price.split('.');
            const dollarsAmount = parts[0].replace(
                /(\d)(?=(\d\d\d)+(?!\d))/g,
                "$1" + thousands
            );
            const centsAmount = parts[1] ? decimal + parts[1] : '';
            return dollarsAmount + centsAmount;
        },
        // 统计
        uploadMarketing(data) {
            fetch(`${this.baseUrl}/endApi/api/upload-marketing`, {
              method: 'POST',
              body: JSON.stringify({
                click_type: 1,
                store_domain: this.config.shopify_domain || TRACK_DOMAIN || window.TRACK_DOMAIN,
                page_session_id: window.TRACK_PAGE_SESSION_ID,
                product_id: data.id,
                variant_id: data.variants && data.variants.length && data.variants[0].variant_ids && data.variants[0].variant_ids.length ? data.variants[0].variant_ids[0] : ''
              }),
              headers: {
                "Accept": "application/json, */*",
                'Content-Type': 'application/json;charset=utf8',
              }
            })
        }
    },
}

window.trackModernProductRecommendation = trackProductRecommendation
