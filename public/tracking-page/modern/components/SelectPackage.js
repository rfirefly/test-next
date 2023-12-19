const trackSelectPackage = {
    props: ['config', 'orderDetail'],
	template: `
        <div class="track123_select_package_wrapper">
           <div class="track123_select_package_title" @click="goSearch">
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.603823 6.31975C0.268215 6.76071 0.301777 7.39281 0.704506 7.79554L6.00781 13.0988L6.12301 13.1995C6.56397 13.5351 7.19607 13.5016 7.5988 13.0988L7.69948 12.9836C8.03508 12.5427 8.00152 11.9106 7.5988 11.5078L4.21599 8.12504L16.5 8.12504L16.6527 8.11477C17.2018 8.04028 17.625 7.56959 17.625 7.00004C17.625 6.37872 17.1213 5.87504 16.5 5.87504L4.21673 5.87504L7.5988 2.49224L7.69948 2.37703C8.03508 1.93608 8.00152 1.30398 7.5988 0.901249C7.15946 0.461908 6.44715 0.461908 6.00781 0.901249L0.704506 6.20455L0.603823 6.31975Z" fill="#0B1019"/>
                </svg>
                <span class="ml-12">{{ translation.order_lookup_section.select_tracking_number }}</span>
            </div>
            <div class="track123_select_package_content">
                <div v-if="orderDetail.order_packages" class="track123_select_package_sub_title">{{ the_number_of_packages }}</div>
                <div v-for="(item, index) in orderDetail.order_packages" :key="item.order_package_id"
                    class="track123_select_package_item_container"
                    @click="goOrderDetail(index)">
                    <div class="track123_select_package_item_content">
                        <div class="courier_logo_img" v-if="item.courier && config.configure_options.carrier_details">
                            <img :src="item.courier.courier_logo" />
                        </div>
                        <div v-else class="default_icon">
                            <img :src="transitionImg" />
                        </div>
                        <div>
                            <div class="tracking_number">{{ item.tracking_number }}</div>
                            <div :style="{color: orderDetail.status == 'cancelled' ? '#020f4066' : statusColorMatch[item.transit_display_status] || '#28A864', fontWeight: '600' }">
                                {{ orderDetail.status == 'cancelled' ? translation.shipping_status.canceled : translation.shipping_status[item.transit_display_status] }}
                            </div>
                        </div>
                    </div>
                    <div>
                        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.954505 11.2955C0.515165 10.8562 0.515165 10.1438 0.954505 9.7045L4.65901 6L0.954505 2.2955C0.515165 1.85616 0.515165 1.14384 0.954505 0.704505C1.39384 0.265165 2.10616 0.265165 2.5455 0.704505L7.0455 5.2045C7.48484 5.64384 7.48484 6.35616 7.0455 6.7955L2.5455 11.2955C2.10616 11.7348 1.39384 11.7348 0.954505 11.2955Z" fill="#0B1019" fill-opacity="0.25"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
	`,
    data() {
        return {
            translation: null,
            statusColorMatch: {
                'ordered': '#28A864',
                'order_ready': '#28A864',
                'in_transit': '#065FF5',
                'out_for_delivery': '#065FF5',
                'delivered': '#28A864',
                'exception': '#E70D0D',
                'failed_attempt': '#E70D0D',
                'expired': '#E70D0D',
                'info_received': '#065FF5',
            }
        }
    },
    computed: {
        the_number_of_packages() {
            let the_number_of_packages = ''
            if (this.translation.order_lookup_section.the_number_of_packages.includes('{{count}}')) {
                the_number_of_packages = this.translation.order_lookup_section.the_number_of_packages.replace(/{{count}}/g, this.orderDetail.order_packages.length)
            } else if (this.translation.order_lookup_section.the_number_of_packages.includes('{{ count }}')) {
                the_number_of_packages = this.translation.order_lookup_section.the_number_of_packages.replace(/{{ count }}/g, this.orderDetail.order_packages.length)
            }
            return (this.translation && 
                this.translation.the_number_of_packages && 
                this.orderDetail &&
                this.orderDetail.order_packages &&
                this.orderDetail.order_packages.length ? the_number_of_packages : '')
        },
        transitionImg() {
            const baseUrl = TRACK_BASE_URL || window.TRACK_BASE_URL || '';
            return `${baseUrl}/tracking-page/modern/img/transition.png`
        },
    },
    created () {
        this.translation = this.getTranslation();
    },
    methods: {
        goSearch() {
            this.$emit('goSearch')
        },
        goOrderDetail(currentIndex) {
            this.$emit('goOrderDetail', currentIndex)
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
			const defaultTranslation = this.config.translation_configs &&
                                    this.config.translation_configs.translation_configs &&
                                    this.config.translation_configs.translation_configs.length ? this.config.translation_configs.translation_configs[0].translation : {}
			this.config.translation_configs.translation_configs.forEach(item => {
                const modernCode = item.code.split('-')[0]
                if (this.config.style && this.config.style.theme == "default") {
                    try {
                        if (item.code == Shopify.locale) translation = item.translation
                    } catch (error) {
                        console.log('Shopify undefine')
                    }
                } else if (modernMultiLanguage && modernCode == modernMultiLanguage) {
					translation = item.translation
				}
			})
			return translation || defaultTranslation
		}
    },
}

window.trackModernSelectPackage = trackSelectPackage
