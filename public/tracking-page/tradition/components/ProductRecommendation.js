const trackProductRecommendation = {
	props: ['productRecommendations', 'orderDetail', 'config'],
	template: `
        <div class="track123_product_recommendations_wrapper" v-if="productRecommendations">
            <div class="swiper">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" style="{minWidth: slideWidth}" v-for="(item, index) in productRecommendationList" :key="index">
                        <div class="track123-swiper-slide">
                            <div 
                                :class="['track123_product_link_container', {'track123_product_link_fill_container': config.configure_options.product_image_format == 'Fill'}]" 
                                :style="{width: slideWidth, height: slideWidth, backgroundImage: 'url('+item.imageUrl+')'}" />
                            <div class="track123_product_title">{{ item.title }}</div>
                            <div class="track123_product_price_container">
                                <s v-if="item.compare_at_price" class="track123_product_compare_price" v-html="item.compare_at_price">{{ item.compare_at_price }}</s>
                                <div class="track123_product_price" v-html="item.price">{{ item.price }}</div>
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
            clientWidth: null,
            bodyClientWidth: null,
            slideWidth: null,  // track123_track_wrapper宽度，某些主题给main容器设置了最大宽度会导致自定义最大宽度不生效，因此需要动态取
            storeDomain: ""
        }
    },
    created () {
        this.getSlideWidth()
    },
    mounted () {
        try {
			this.storeDomain = Shopify.shop || this.config.shopify_domain
		} catch (error) {
			this.storeDomain = this.config.shopify_domain || TRACK_DOMAIN || window.TRACK_DOMAIN
		}
        if (this.productRecommendations && !this.Swiper) this.initSwiper()
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
    watch: {
        productRecommendations(newValue) {
            // 异步获取产品推荐，需要等待获取到产品时再初始化swiper
            if (newValue && newValue.length && !this.Swiper) {
              this.initSwiper()
            }
        }
    },
    methods: {
        initSwiper() {
            if (!this.bodyClientWidth) this.bodyClientWidth = document.body.clientWidth
            const spaceBetween = this.bodyClientWidth <= 833 ? 12 : 24;
            const slidesPerView = this.bodyClientWidth <= 833 ? 2 : 4;
            setTimeout(() => {
                this.Swiper = new Swiper('.swiper', {
                    autoplay: true,
                    spaceBetween,
                    slidesPerView,
                    scrollbar: {
                        draggable: true
                    }
                })
            })
        },
        getSlideWidth() {
            this.bodyClientWidth = document.body.clientWidth
            this.clientWidth = document.getElementById('track123_track_wrapper').clientWidth
            const spaceBetween = this.bodyClientWidth <= 833 ? 12 : 24;
            const slidesPerView = this.bodyClientWidth <= 833 ? 2 : 4;
            const otherWidth = (slidesPerView-1)*spaceBetween
            this.slideWidth = `calc((${this.clientWidth}px - ${otherWidth}px)/${slidesPerView})`
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
                    store_domain: this.storeDomain,
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

window.trackProductRecommendation = trackProductRecommendation
