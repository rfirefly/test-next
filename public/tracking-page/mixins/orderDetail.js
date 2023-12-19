window.trackOrderDetailMixin = {
    props: ['config', 'orderDetail', 'productRecommendations'],
    data() {
		return {
			shopifyDomain: '',
			translation: {},
			currentLocale: '',
			configure_options: {},
			currentPackageIndex: 0,			// 当前包裹index
			showAllTrackingShowDetails: true,   // 切换是否显示所有包裹物流信息
			trackingShowDetails: [],		// 用于展示的包裹物流信息，主要用于展示切换全部和最新的信息(default版)
			trackingDetails: [],			// 包裹物流信息（二维数组）
			trackingLatestDetails: [],      // 包裹物流最新一条信息（default版根据配置显示）
			isMapCurrent: false,			// 地图是否展示当前地址
			notShowMap: false,				// 地图是否展示
			showOrderSelector: false,			// 是否展示包裹选择面板 
			activeProcessBarColor: '',			// 进度条颜色
			addCartLoadingIndex: null,			// 加入购物车加载中
		}
	},
	computed: {
		isPhone() {
            return  navigator.userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
            )
        },
		baseUrl() {
			return TRACK_BASE_URL || window.TRACK_BASE_URL;
		},
		// 地图信息
		mapLocation() {
			const currentLocation = this.currentPackage && this.currentPackage.tracking_details && this.currentPackage.tracking_details.length ? this.currentPackage.tracking_details[0].event_location : '';
			const destinationLocation = this.orderDetail.combined_address ? this.orderDetail.combined_address : this.currentPackage.ship_to ? this.currentPackage.ship_to : '';
			return this.isMapCurrent ? currentLocation : destinationLocation;
		},
		mapUrl() {
			// 优先显示地名
			// google map api: https://developers.google.com/maps/documentation/embed/embedding-map?hl=en#choosing_map_modes
			const mapLocation = encodeURIComponent(this.mapLocation)
			if (this.mapLocation) {
				return `https://www.google.com/maps/embed/v1/place?key=AIzaSyDf5VCcikU0XbIhQtJ2mOpz6JHHND2Yggk&q=${mapLocation}`
			} else if (!this.isMapCurrent && this.orderDetail.latitude && this.orderDetail.longitude) {
				return `https://www.google.com/maps/embed/v1/view?key=AIzaSyDf5VCcikU0XbIhQtJ2mOpz6JHHND2Yggk&zoom=16&center=${this.orderDetail.latitude},${this.orderDetail.longitude}`
			}
			return ''
		},
		// 包裹状态：
		// 1. 订单状态为已取消时, 直接显示已取消的翻译词
		// 2. 订单状态非已取消时，取包裹状态的翻译词
		statusMsg() {
			return this.orderDetail.status == 'cancelled' ? this.translation.shipping_status.canceled : this.translation.shipping_status[this.currentPackage.transit_display_status] || this.currentPackage.transit_display_status
		},
		// 当前包裹信息
		currentPackage() {
			return this.orderDetail.order_packages[this.currentPackageIndex] || {}
		},
		// 当前订单包裹名称
		orderPackageName() {
			return this.orderDetail && this.orderDetail.order_packages && this.orderDetail.order_packages.length > 1 ? `${this.orderDetail.order_name}_F${this.currentPackageIndex +1}` : this.orderDetail.order_name;
		},
		// 获取物流商链接
		currentCourierLink() {
			if (!this.currentPackage.courier) return '';
			const courier = this.currentPackage.courier;
			return courier.query_link ? courier.query_link.replace(/#{trackingNo}/g, this.currentPackage.tracking_number) : courier.courier_home_page
		},
		// 获取尾程物流商链接
		currentLastCourierLink() {
			if (!this.currentPackage.last_mile_info) return '';
			const last_mile_info = this.currentPackage.last_mile_info;
			return last_mile_info && last_mile_info.query_link ? last_mile_info.query_link.replace(/#{trackingNo}/g, last_mile_info.lm_track_no) : last_mile_info.courier_home_page
		},
		// 预计投递时间
		expectedDeliveryTime() {
			let expectedDeliveryTime = null;
			if (this.currentPackage.expected_delivery && this.currentPackage.expected_delivery.display_flag) {
				const expected_delivery = this.currentPackage.expected_delivery
				if (expected_delivery.store_delivery_time_end && expected_delivery.store_delivery_time_start) {
					const store_delivery_time_start = this.getTranslationTime(expected_delivery.store_delivery_time_start, 'date')
					const store_delivery_time_end = this.getTranslationTime(expected_delivery.store_delivery_time_end, 'date')
					expectedDeliveryTime = `${store_delivery_time_start} - ${store_delivery_time_end}`
				} else if (expected_delivery.logistic_delivery_time) {
					expectedDeliveryTime = this.getTranslationTime(expected_delivery.logistic_delivery_time, 'date')
				}
			}
			return expectedDeliveryTime
		}
	},
	created () {
		try {
			this.shopifyDomain = Shopify.shop || this.config.shopify_domain
		} catch (error) {
			this.shopifyDomain = this.config.shopify_domain || TRACK_DOMAIN || window.TRACK_DOMAIN
		}
		const { translation, currentLocale } = this.getTranslation()
		this.translation = translation
		this.currentLocale = currentLocale
		this.configure_options = { ...this.config.configure_options };
		this.activeProcessBarColor = this.config.style.process_bar_color;
		this.isMapCurrent = this.configure_options.map_coordinates === 'configure_options.map_coordinates.current_package_location'
		this.notShowMap = this.configure_options.map_coordinates === 'configure_options.map_coordinates.do_not_show_map'

		const { trackingDetails, trackingLatestDetails } = this.getTrackingDetails();
		this.trackingDetails = trackingDetails;
		this.trackingLatestDetails = trackingLatestDetails;
		this.showAllTrackingShowDetails = this.configure_options.tracking_detail_show_all;
		this.trackingShowDetails = this.showAllTrackingShowDetails ? this.trackingDetails : this.trackingLatestDetails;
		this.translateDetail()
	},
	watch: {
		orderDetail(newValue) {
			if (newValue) {
				const { trackingDetails, trackingLatestDetails } = this.getTrackingDetails();
				this.currentPackageIndex = 0;
				this.trackingDetails = trackingDetails;
				this.trackingLatestDetails = trackingLatestDetails;
				this.showAllTrackingShowDetails = this.configure_options.tracking_detail_show_all;
				this.trackingShowDetails = this.showAllTrackingShowDetails ? this.trackingDetails : this.trackingLatestDetails;
				this.translateDetail()
			}
		}
	},
	methods: {
		toggleOrderSelector() {
			this.showOrderSelector = !this.showOrderSelector;
		},
		selectOrderPackage(index) {
			this.currentPackageIndex = index;
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
			let currentLocale = this.config.translation_configs && this.config.translation_configs.translation_configs ? this.config.translation_configs.translation_configs[0].code : ''
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
							currentLocale = Shopify.locale
						}
                    } catch (error) {
                        console.log('Shopify undefine')
                    }
                // } else if (modernMultiLanguage && item.code == modernMultiLanguage && whiteList.includes(permissionName)) {
                } else if (modernMultiLanguage && modernCode == modernMultiLanguage) {
					translation = item.translation
					currentLocale = item.code
				}
			})
			translation = translation || defaultTranslation
			return {
				translation,
				currentLocale
			}
		},
		// 统计
		uploadMarketing(data, type) {
            fetch(`${this.baseUrl}/endApi/api/upload-marketing`, {
                method: 'POST',
                body: JSON.stringify({
                    click_type: type == 'reorder' ? 2 : 3,
                    store_domain: this.shopifyDomain,
                    page_session_id: window.TRACK_PAGE_SESSION_ID,
                    product_id: data.product_id,
                    variant_id: data.variant_id || ''
                }),
                headers: {
                    "Accept": "application/json, */*",
                    'Content-Type': 'application/json;charset=utf8',
                }
            })
        },
		// 复购 || 评价，跳转到产品详情
		goProductDetail(data, type, index) {
			// 预览例子, 以及product_id为0的产品不做跳转
			if (this.orderDetail.preview || (data && (!data.product_id || data.product_id == '0'))) return;
			this.uploadMarketing(data, type)
			if (type === 'review' && data.review_url) {
				const tag = data.review_url.includes('?') ? '&' : '?'
				window.open(`${data.review_url}${tag}ref=track123&utm_source=track123&utm_medium=tracking_page`)
			} else if (type === 'reorder') {
				window.open(`/cart/${data.variant_id}:1?utm_source=track123_reorder`)
			}
		},
		// 时间日期格式替换翻译词, type只有date和time两种
		getTranslationTime(data, type) {
			if (!data) return ''
			let time = ''
			if (type == 'date') {
				// 日期格式只有月份才需要替换翻译词
				let format = this.config.style.theme !== 'modern' ? this.config.date_formatEnum.momentJsFormat : 'DD MMM'
				time = dayjs(data).format(format)
				if (format.includes('Do')) {
					// Do代表日期序号，dayjs失效，需要手动转格式
					format = format.replace('Do', `D*`)
					const dayString = dayjs(data).format('D')
					const dayMatch = {'1': 'st', '2': 'nd', '3': 'rd'}
					const dayFormat = dayMatch[dayString] || 'th'
					time = dayjs(data).format(format)
					time = time.replace('*', dayFormat)
				}
				if (format.includes('MMM')) {
					const monthString = dayjs(data).format('MMM')
                    if (this.translation.time[`month_${monthString.toLowerCase()}`]) {
                        time = time.replace(monthString, this.translation.time[`month_${monthString.toLowerCase()}`])
                    }
				} 
			} else if (type == 'time') {
				// 时间格式只有am/pm需要替换翻译词
				const format = this.config.time_formatEnum.momentJsFormat
				time = dayjs(data).format(format)
				if (format.includes('a')) {
					const timeString = dayjs(data).format('a')
                    if (this.translation.time[`time_${timeString}`]) {
                        time = time.replace(timeString, this.translation.time[`time_${timeString}`])
                    }
				}
			}
			return time
		},
		// 翻译轨迹
		translateDetail() {
			// 无权限不翻译
			if (!this.orderDetail.translate_track) return;
			const orderDetail = JSON.parse(JSON.stringify(this.orderDetail))
			const order_packages = orderDetail.order_packages.map(item => {
				let details = JSON.parse(JSON.stringify(item.tracking_details))
				if (item.last_mile_info 
					&& item.last_mile_info.lm_track_no
					&& item.last_mile_info.lm_track_no_provider_name) {
					const index = details.length - 1
					details[index].event_detail = `${details[index].event_detail}. Last mile tracking number: ${item.last_mile_info.lm_track_no} - Last mile tracking carrier: ${item.last_mile_info.lm_track_no_provider_name}`
				}
				return {
					order_package_id: item.order_package_id_str || item.order_package_id,
					tracking_details: details,
					last_mile_info_details: item.last_mile_info ? item.last_mile_info.details : null
				}
			})
			const timestamp = Date.now().toString()
			fetch(`${this.baseUrl}/endApi/api/track/translate`, {
				method: 'POST',
                body: JSON.stringify({
                    order_packages,
					to_language: this.currentLocale,
					myshopify_domain: this.shopifyDomain
                }),
                headers: {
                    "Accept": "application/json, */*",
                    'Content-Type': 'application/json;charset=utf8',
					'Timestamp': timestamp,
					'Signature': md5(`${this.orderDetail.store_id}${this.currentLocale}${timestamp}`)
                }
			})
			.then(res => res.json())
			.then(res => {
				if (res.code === '00000' && res.data && res.data.length) {
					orderDetail.order_packages.forEach((item, index) => {
						if (res.data[index].tracking_details && res.data[index].tracking_details.length) {
							item.tracking_details = res.data[index].tracking_details
						} 
						if (res.data[index].last_mile_info_details && res.data[index].last_mile_info_details.length) {
							item.last_mile_info.details = res.data[index].last_mile_info_details
						}
					})
					const { trackingDetails, trackingLatestDetails } = this.getTrackingDetails(orderDetail);
					this.trackingDetails = trackingDetails;
					this.trackingLatestDetails = trackingLatestDetails;
					this.trackingShowDetails = this.showAllTrackingShowDetails ? this.trackingDetails : this.trackingLatestDetails;
				}
			})
		},
		getTrackingDetails(data) {
			const orderDetail = JSON.parse(JSON.stringify(data || this.orderDetail))
			if (!orderDetail.order_packages && !orderDetail.order_packages.length) return {trackingDetails: [], trackingLatestDetails: []}
			let trackingDetails = []
			let trackingLatestDetails = []
			orderDetail.order_packages.forEach((parentItem) => {
				let list = []
				let listMap = {}
				let latestListMap = {}
				// 是否自动更新物流
				const isAutomaticOrderUpdate = parentItem.automatic_order_update || !parentItem.hasOwnProperty('automatic_order_update')
				parentItem.tracking_status_list.forEach(item => {
					if ((isAutomaticOrderUpdate && item.type == 1 && item.event_time) || (!isAutomaticOrderUpdate && item.event_time)) {
                        list.push({
                            sort: dayjs(item.event_time).format('YYYYMMDDHHmmss'),
                            event_time: item.event_time,
                            event_detail: item.status_desc || this.translation.shipping_status[item.status_name] || item.status_name
                        })
                    }
				})
				 // 物流信息新增物流商字段
				if (parentItem && parentItem.courier && parentItem.courier.courier_name_e_n) {
					parentItem.tracking_details.forEach(item => {
						item.sort = dayjs(item.event_time).format('YYYYMMDDHHmmss')
						item.courier_name = parentItem.courier.courier_name_e_n
					})
				}
				// 尾程信息整理
				if (!this.orderDetail.translate_track
					&& parentItem.last_mile_info
					&& parentItem.last_mile_info.lm_track_no
					&& parentItem.last_mile_info.lm_track_no_provider_name) {
					const index = parentItem.tracking_details.length - 1
					parentItem.tracking_details[index].event_detail = `${parentItem.tracking_details[index].event_detail}. Last mile tracking number: ${parentItem.last_mile_info.lm_track_no} - Last mile tracking carrier: ${parentItem.last_mile_info.lm_track_no_provider_name}`
				}
				if (parentItem && 
					parentItem.last_mile_info &&
					parentItem.last_mile_info.details &&  
					parentItem.last_mile_info.details.length && 
					parentItem.last_mile_info.lm_track_no_provider_name) {
					parentItem.last_mile_info_details = parentItem.last_mile_info.details.map(item => {
						item.sort = dayjs(item.event_time).format('YYYYMMDDHHmmss')
						item.courier_name = parentItem.last_mile_info.lm_track_no_provider_name
						return item
					})
				}
				// 状态列表先倒序，再根据时间排序
				// 非自动更新模式，物流信息取状态列表
				list = parentItem.tracking_details && isAutomaticOrderUpdate ? 
						[...parentItem.tracking_details, ...list] : 
						[...list]
				if (parentItem && parentItem.last_mile_info_details) list = [...parentItem.last_mile_info_details, ...list]
                list = list.reverse()
                list = list.sort((a, b) => b.sort - a.sort)
				// 对整体物流列表，按日期倒序排序
				list.map((item, index) => {
					let copy_time = item.event_time
					const key = dayjs(copy_time).format('YYYYMMDD')
					let time = this.getTranslationTime(copy_time, 'date')
					item.event_time = this.getTranslationTime(copy_time, 'time')
					if (!listMap[key]) {
						listMap[key] = {
							time,
							child: []
						}
					}
					listMap[key].child.push(item)
					if (index < 3) {
						if (!latestListMap[key]) {
							latestListMap[key] = {
								time,
								child: []
							}
						}
						latestListMap[key].child.push(item)
					}
					
				});
				list = Object.values(listMap).reverse()
				trackingDetails.push(list)
				const latestList = Object.values(latestListMap).reverse()
				trackingLatestDetails.push(latestList)
			})
			// trackingDetails.forEach(item => {
			// 	trackingLatestDetails.push([{
			// 		time: item[0].time,
			// 		child: item[0].child && item[0].child.length ? [item[0].child[0]] : []
			// 	}])
			// })
			return {
				trackingDetails,
				trackingLatestDetails
			}
		},
		// 展示所有
		viewMoreToggle() {
			this.showAllTrackingShowDetails = !this.showAllTrackingShowDetails;
			this.trackingShowDetails = this.showAllTrackingShowDetails ? this.trackingDetails : this.trackingLatestDetails;
			// 收起时定位到物流轨迹标题
			if (!this.showAllTrackingShowDetails) {
				const orderDetailTitleDom = document.getElementById('track123_order_detail_title')
				if(orderDetailTitleDom) orderDetailTitleDom.scrollIntoView({ behavior: "smooth" })
			}
		}
	},
}