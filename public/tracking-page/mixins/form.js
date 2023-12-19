window.trackFormMixin = {
	props: {
		config: {
			type: Number,
			require: true,
		},
		// 用于modern模式返回到搜索页，返回搜索的情况不自动触发搜索
		isGoSearch: {
			type: Boolean,
			default: false
		}
	},
    data() {
		return {
			translation: {},
			configure_options: {},
			additional_text: {},
			formParams: {
				email: '',
				order_or_number: '',
				tracking_no: '',
				tracking_no_or_order_number: '',
				select_type: ''
			},
			showOrderError: false,
			showEmailError: false,
			showTrackingNoError: false,
			showTrackingNoOrOrderNumberError: false,
			showPowerBy: false,
			poweredByText: "Powered by ",
			showTab:1,
			showLoading: false,
			showErrorText:false,
			storeDomain: ""
		}
	},
	computed: {
		isOrderNumberAndEmailAndTrackingNumber() {
			return this.configure_options.lookup_options_by_order_number_and_email && this.configure_options.require_email_or_phone_number && this.configure_options.lookup_options_by_tracking_number
		},
		baseUrl() {
			return TRACK_BASE_URL || window.TRACK_BASE_URL;
		},
		isPhone() {
            return  navigator.userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
            )
        }
	},
	created () {
		this.additional_text = { ...this.config.additional_text }
		this.configure_options = { ...this.config.configure_options }
	},
	mounted () {
		try {
			this.storeDomain = Shopify.shop || this.config.shopify_domain
		} catch (error) {
			this.storeDomain = this.config.shopify_domain || TRACK_DOMAIN || window.TRACK_DOMAIN
		}
		// 该用户使用的翻译软件weglot, 获取Shopify当前语言有延迟，暂时先对该用户延迟执行100毫秒
		if (this.storeDomain == 'my-shoot-box.myshopify.com') {
			setTimeout(() => {
				this.translation = this.getTranslation()
			}, 100)
		} else {
			this.translation = this.getTranslation()
		}
		this.getPageSessionId()
		this.init()
		this.initGoogleAlign()
		this.insertGoogleAnalyticsCode()
	},
	methods: {
		// 注入谷歌分析代码
		insertGoogleAnalyticsCode () {
			fetch(`${this.baseUrl}/endApi/api/third/apps/google-analytics?storeDomain=${this.storeDomain}`, {
				method: 'GET',
				headers: {
					"Accept": "application/json, */*",
					"Content-Type": "application/json;charset=utf8"
				}
			}).then(res => res.json())
			.then((res) => {
				const id = res.data.ga4_id
				if (id) {
					const script1 = document.createElement('script')
					script1.async = true
					script1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
					const script2 = document.createElement('script')
					script2.text = `
						window.dataLayer = window.dataLayer || [];
						function gtag() { dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', '${id}');
					`
					document.getElementsByTagName('head')[0].appendChild(script1)
					document.getElementsByTagName('head')[0].appendChild(script2)
				}
			})
		},
		// 初始化表单参数
		init() {
			const BASE64 = window.TRACK123_BASE64
			let track_number = this.getQueryVariable('nums') || '';
			const email = this.getQueryVariable('id')
			const order_number = this.getQueryVariable('order')
			// 获取路由参数
			if (track_number) {
				track_number = decodeURIComponent(track_number)
				this.showTab=2
			} else if (email || order_number) {
				if (email) this.formParams.email = BASE64.decode(decodeURIComponent(email))
				if (order_number) {
					this.formParams.order_or_number = decodeURIComponent(order_number)
					this.formParams.tracking_no_or_order_number = decodeURIComponent(order_number)
				}
				if (!this.isGoSearch) {
					if (email) {
						this.submit(1)
					} else if (order_number && 
						this.config.configure_options.lookup_options_by_order_number_and_email && 
						!this.config.configure_options.require_email_or_phone_number) {
						this.submit(3)
					}
				}
			}
			this.getParams(track_number)
		},
		// 获取统计的sessionId，且统计页面加载次数
		getPageSessionId() {
			fetch(`${this.baseUrl}/endApi/api/upload-marketing`, {
			  method: 'POST',
			  body: JSON.stringify({
			    click_type: 0,
			    store_domain: this.storeDomain
			  }),
			  headers: {
			    "Accept": "application/json, */*",
			    'Content-Type': 'application/json;charset=utf8',
			  }
			})
			.then(res => res.json())
			.then(res => {
				if (res.code == '00000' && res.data) {
					window.TRACK_PAGE_SESSION_ID = res.data
				}
			})
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
		// 获取路由参数
		getQueryVariable(variable) {
			let query = window.location.search.substring(1);
			// 防止翻译软件重复拼接参数（transcy）
			query = query.split('?')[0]
			const vars = query.split("&");
			for (let i=0;i<vars.length;i++) {
					let pair = vars[i].split("=");
					if(pair[0] == variable){return pair[1];}
			}
			return '';
		},
		// 获取表格参数
		getParams(track_number) {
			fetch(`${this.baseUrl}/endApi/api/order/anonymous/get-order-no?track_number=${encodeURIComponent(track_number)}&store_domain=${this.storeDomain}`, {
				method: 'GET',
				headers: {
					"Accept": "application/json, */*",
					"Content-Type": "application/json;charset=utf8"
				}
			}).then(res => res.json()).then(data => {
				this.showPowerBy = data.show_power_by
				setTimeout(() => {
					const powerByDom = document.getElementById('track123-powered-by')
					if (powerByDom && data.show_power_by) powerByDom.innerHTML = 'Powered by Track123'
				}, 500)
				if (track_number) {
					this.formParams.tracking_no = track_number
					this.formParams.tracking_no_or_order_number = track_number
					if(!this.isGoSearch) {
						if (this.config.configure_options.lookup_options_by_order_number_and_email &&
							this.config.configure_options.lookup_options_by_tracking_number && 
							!this.config.configure_options.require_email_or_phone_number) {
							this.submit(4)
						} else {
							this.submit(2)
						}
						
					}
				}
				if (data.order_detail_list && data.order_detail_list.length) {
					this.formParams.email = data.order_detail_list[0].email
					this.formParams.order_or_number = data.order_detail_list[0].order_name
				}
			})
		},
		// 校验查询参数
		checkData(type) {
			let checkResult = true
			if (type === 1) {
				checkResult = this.formParams.email && this.formParams.order_or_number
				this.showEmailError = !this.formParams.email
				this.showOrderError = !this.formParams.order_or_number
			} else if (type === 2) {
				checkResult = this.formParams.tracking_no
				this.showTrackingNoError = !this.formParams.tracking_no
			} else if (type === 3) {
				checkResult = this.formParams.order_or_number
				this.showOrderError = !this.formParams.order_or_number
			} else if (type === 4) {
				checkResult = this.formParams.tracking_no_or_order_number
				this.showTrackingNoOrOrderNumberError = !this.formParams.tracking_no_or_order_number
			}
			return checkResult
		},
		getFormData(type) {
			const BASE64 = window.TRACK123_BASE64
			let params = {
				// 后端会通过该类型去判断是否统计，1： tracking page查询使用（需要统计）； 2： order侧边栏查询使用（不需要统计）
				source_type: 1,
				select_type: type, 
				store_domain: this.storeDomain 
			}
			let href = window.location.href
			href = window.location.href.split('?')[0]
			if (type === 1) {
				params = { 
					...params, 
					email: this.formParams.email,
					order_or_number: this.formParams.order_or_number,
				}
				if (window.history){
					// history.replaceState(null, '', `${href}?order=${encodeURIComponent(params.order_or_number)}&id=${encodeURIComponent(params.email)}`)
					history.replaceState(null, '', `${href}?order=${encodeURIComponent(params.order_or_number)}&id=${BASE64.encode(params.email)}`)
				}
			} else if (type == 2) {
				params = {
					...params,
					tracking_no: this.formParams.tracking_no ? this.formParams.tracking_no.replace(/\s*/g,"") : ''
				}
				// 更新路由信息 
				if (window.history){
					history.replaceState(null, '', `${href}?nums=${encodeURIComponent(params.tracking_no)}`)
				}
			} else if (type == 3) {
				// 只有订单查询
				params = {
					...params,
					order_or_number: this.formParams.order_or_number,
				}
				if (window.history) {
					history.replaceState(null, '', `${href}?order=${encodeURIComponent(params.order_or_number)}`)
				}
			} else if (type == 4) {
				params = {
					...params,
					pattern_word: this.formParams.tracking_no_or_order_number
				}
				// 更新路由信息 
				if (window.history){
					history.replaceState(null, '', `${href}?nums=${encodeURIComponent(params.pattern_word)}`)
				}
			}
			return params
		},
		getPreviewProductRecommendationList(orderDetails) {
			fetch(`${this.baseUrl}/endApi/api/recommendations/products/example`, {
				method: 'GET',
				headers: {
					"Accept": "application/json, */*",
					"Content-Type": "application/json;charset=utf8"
				}
			}).then(res => {
				if (res.ok) return res.json();
				if (!res.ok) return false;
			}).then(data => {
				// modern版本拼接币种
				data.products.forEach(item => {
					item.imageUrl = item.images[0]
					item.price = item.price * 100
					if (item.compare_at_price) item.compare_at_price = item.compare_at_price * 100
				})
				this.$emit('getProductRecommendations', data.products)
			})
		},
		// 获取产品推荐
		getProductRecommendationList(orderDetails) {
			const is_preview = orderDetails.preview;  // preview为true获取例子数据
			let requestUrl = ''
			const limit = 10
			// 预览prevew且产品id为0, id为0说明店铺没有产品，所以需要用到自己造的数据
			if (is_preview && (!orderDetails.recommand_product || orderDetails.recommand_product.recommend_id == 0)) {
				this.getPreviewProductRecommendationList(orderDetails)
				return;
			}		
			if (orderDetails && orderDetails.recommand_product && 
				orderDetails.recommand_product.recommendation_type && 
				orderDetails.recommand_product.recommendation_type == 1 && 
				orderDetails.recommand_product.recommend_id !== '0') {
				if (!orderDetails.recommand_product.recommend_id) {
					this.$emit('getProductRecommendations', null)
					return;
				};
				requestUrl = `/recommendations/products.json?product_id=${orderDetails.recommand_product.recommend_id}&limit=${limit}`
			} else {
				requestUrl = `${this.baseUrl}/endApi/api/recommendProduct?storeDomain=${this.storeDomain}`
			}
			fetch(requestUrl, {
				method: 'GET',
				headers: {
					"Accept": "application/json, */*",
					"Content-Type": "application/json;charset=utf8",
				}
			}).then(res => {
				if (res.ok) return res.json();
				if (!res.ok) return false;
			}).then(data => {
				if (data) {
					let products = null;
					if (data && data.products) {
						products = data.products
						products.forEach(item => {
							item.imageUrl = item.images[0]
							item.price = item.variants && item.variants.length ? item.variants[0].price : item.price
							if (item.compare_at_price) {
								item.compare_at_price = item.variants && item.variants.length ? item.variants[0].compare_at_price : item.compare_at_price
							}
						})
					} else if (data && data.data && data.data.products) {
						products = data.data.products
						products.forEach(item => {
							item.imageUrl = item.images && item.images.length ? item.images[0].src : ''
							item.price = item.variants && item.variants.length ? item.variants[0].price : item.price
							item.price = parseFloat(item.price) * 100
							if (item.compare_at_price) {
								item.compare_at_price = item.variants && item.variants.length ? item.variants[0].compare_at_price : item.compare_at_price
								item.compare_at_price = parseFloat(item.compare_at_price) * 100
							}
						})
					}
					this.$emit('getProductRecommendations', products)
				} else if (is_preview) {
					this.getPreviewProductRecommendationList(orderDetails)
				}
			}) 
		},
		// 获取产品详情（handle && img_url）
		getProductDetail(data) {
			const orderDetail = JSON.parse(JSON.stringify(data))
			const params = []
			const variantIds = []
			const productDetails = {}
			orderDetail.order_packages.forEach(item => {
				if (item.order_items && item.order_items.length) {
					item.order_items.forEach(product => {
						if (product.product_id && product.product_id != '0') {
							// 防止重复入参
							if ((product.variant_id && !variantIds.includes(product.variant_id)) || (!product.variant_id && !variantIds.includes(product.product_id))) {
								variantIds.push(product.variant_id || product.product_id)
								params.push({
									product_id: product.product_id,
									variant_id: product.variant_id || 0
								})
							}
						}
					})
				}
			})
			fetch(`${this.baseUrl}/endApi/api/product/info`, {
				method: 'POST',
			    body: JSON.stringify({
					products: params,
					store_domain: this.storeDomain,
					domain: data.domain,
        			customer_id: data.customer_id,
					review_type: data.review_type,
				}),
				headers: {
					"Accept": "application/json, */*",
					'Content-Type': 'application/json;charset=utf8',
				}
			}).then(res => res.json()).then(res => {
				if (res.code === '00000') {
					res.data.forEach(item => {
						productDetails[item.variant_id || item.product_id] = item
					})
					orderDetail.order_packages.forEach(item => {
						if (item.order_items && item.order_items.length) {
							item.order_items.forEach(product => {
								const detailInfo = productDetails[product.variant_id || product.product_id]
								if (detailInfo) {
									product.product_image = detailInfo.img_url
									product.product_url = detailInfo.product_url
									product.review_url = detailInfo.review_url
								}
							})
						}
					})
					this.$emit('getOrderDetail', orderDetail)
				}
			})
		},
		submit(type) {
			if (!this.checkData(type)) return;
			this.showErrorText = false
			this.showLoading = true
			const params = this.getFormData(type)
			fetch(`${this.baseUrl}/endApi/api/order/anonymous-query`, {
			    method: 'POST',
			    body: JSON.stringify(params),
				headers: {
					"Accept": "application/json, */*",
					'Content-Type': 'application/json;charset=utf8'
				}
			}).then(res => {
				if (res.ok) return res.json()
				if (!res.ok) return false
			}).then(data => {
				if (data) {
					this.showErrorText = data.no_query_data
					this.loadTrackPageCss()
					if (!data.no_query_data) {
						this.$emit('getOrderDetail', data)
						if (!data.preview) this.getProductDetail(data)
						this.getProductRecommendationList(data)
						// 查询成功后页面滚动到order详情头部
						setTimeout(() => {
							const orderHeaderDom = document.getElementById('track123_order_header')
							if(orderHeaderDom) orderHeaderDom.scrollIntoView({ behavior: "smooth" })
						}, 500)
					} else {
						this.$emit('getOrderDetail', null)
					}
				} else {
					this.$emit('getOrderDetail', null)
				}
			}).finally(() => this.showLoading = false)
		},
		// powerby跳转
		openPoweredByLink() {
			window.open('https://apps.shopify.com/track123?surface_detail=Shopify_Tracking_Page')
		},
		// page模式，根据track123_app的宽度加载css文件
		loadTrackPageCss() {
			if (!window.isTrack123Page || window.hasLoadTrack123PageCss) return;
			const containerWidth = document.getElementById('track123-app').offsetWidth
			if (containerWidth < 1200) {
				window.hasLoadTrack123PageCss = true
				this.loadCss(`${window.track123BaseUrl}/tracking-page/build/middleScreen-tradition.min.css?v=${window.track123Version}`, 'screen and (min-width: 834px)')
			}
		},
		loadCss(url, media) {
			const link = document.createElement('link');
			link.setAttribute('rel', 'stylesheet')
			link.setAttribute('href', url)
			if (media) link.setAttribute('media', media)
			document.getElementsByTagName('head')[0].appendChild(link);
		},
		initGoogleAlign() {
			setTimeout(() => {
				const googleDom = document.getElementsByTagName('select')
				if (this.isPhone && googleDom && googleDom.length && !this.config.store_logo_url) googleDom[0].style.textAlign = 'left'
			}, 5000)
		}
	},
}