const StatusStepLine = {
	props: ['statusList', 'config', 'currentStatus'],
	template: `
        <div>
            <div class="track123_order_step_line_container">
                <div v-for="(item, index) in list" :key="index" class="track123_order_step_line_item">
                    <div class="track123_order_step_line_icon_container">
                        <div :class="['track123_order_step_line_process', { 'track123_order_step_line_not_active': index > currentIndex }]" 
                            :style="{background: activeProcessBarColor }"></div>
                        <div :class="['track123_order_step_line_icon_border', {'track123_order_step_line_icon_active_border': index === currentIndex && item.status_name !== 'delivered'},{ 'track123_order_step_line_not_active': index > currentIndex }]" 
                            :style="{ borderColor: index == currentIndex && item.status_name !== 'delivered' ? activeProcessBarColor : 'transparent' }">
                            <div :class="['track123_order_step_line_icon', { 'track123_order_step_line_active_icon': index === currentIndex && item.status_name !== 'delivered' }]"
                                :style="{ background: activeProcessBarColor }">
                                <svg v-if="index >= currentIndex && item.status_name === 'ordered'" t="1663050600897" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3606" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path d="M102.4 102.4a51.2 51.2 0 0 1 51.2-51.2h716.8a51.2 51.2 0 0 1 51.2 51.2v460.8a51.2 51.2 0 1 1-102.4 0V153.6H204.8v665.6h256a51.2 51.2 0 1 1 0 102.4H153.6a51.2 51.2 0 0 1-51.2-51.2V102.4z m204.8 204.8a51.2 51.2 0 0 1 51.2-51.2h307.2a51.2 51.2 0 1 1 0 102.4H358.4a51.2 51.2 0 0 1-51.2-51.2z m0 179.2a51.2 51.2 0 0 1 51.2-51.2h307.2a51.2 51.2 0 1 1 0 102.4H358.4a51.2 51.2 0 0 1-51.2-51.2zM307.2 665.6a51.2 51.2 0 0 1 51.2-51.2h153.6a51.2 51.2 0 1 1 0 102.4H358.4a51.2 51.2 0 0 1-51.2-51.2z m650.5984 87.3984l-204.8 204.8a51.2 51.2 0 0 1-72.3968 0l-102.4-102.4a51.2 51.2 0 0 1 72.3968-72.3968L716.8 849.2032l168.6016-168.6016a51.2 51.2 0 0 1 72.3968 72.3968z" p-id="3607" fill="#ffffff"></path></svg>
                                <svg v-if="index >= currentIndex && item.status_name === 'order_ready'" t="1663050591606" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3410" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path d="M486.912 32.1536a51.2 51.2 0 0 1 50.176 0l409.6 230.4A51.2 51.2 0 0 1 972.8 307.2v409.6a51.2 51.2 0 0 1-26.112 44.6464l-409.6 230.4a51.2 51.2 0 0 1-50.176 0l-409.6-230.4A51.2 51.2 0 0 1 51.2 716.8V307.2a51.2 51.2 0 0 1 26.112-44.6464l409.6-230.4zM153.6 399.5648v287.2832l307.2 172.8v-268.0832l-102.4-64V563.2a51.2 51.2 0 1 1-102.4 0V463.5648l-102.4-64z m251.648 36.5056L512 502.8352l309.248-193.3312-105.8304-59.5456-310.1696 186.112zM563.2 591.5648v268.0832l307.2-172.8v-287.232l-307.2 192z m49.5104-399.36L512 135.5264 202.752 309.504l104.96 65.6384 304.9984-182.9376z" p-id="3411" fill="#ffffff"></path></svg>
                                <svg v-if="index >= currentIndex && item.status_name === 'in_transit'" t="1663050265527" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3018" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path d="M0 204.8a51.2 51.2 0 0 1 51.2-51.2h665.6a51.2 51.2 0 0 1 51.2 51.2v128h76.8a51.2 51.2 0 0 1 41.6768 21.4528l128 179.2A51.2 51.2 0 0 1 1024 563.2v204.8a51.2 51.2 0 0 1-51.2 51.2h-85.504a153.6512 153.6512 0 0 1-289.792 0H400.896a153.6512 153.6512 0 0 1-289.792 0H51.2a51.2 51.2 0 0 1-51.2-51.2V204.8z m111.104 512a153.6512 153.6512 0 0 1 289.792 0h196.608A154.112 154.112 0 0 1 665.6 634.9312V256H102.4v460.8h8.704zM768 616.4992A153.8048 153.8048 0 0 1 887.296 716.8H921.6v-137.216L818.432 435.2H768v181.2992zM256 716.8a51.2 51.2 0 1 0 0 102.4 51.2 51.2 0 0 0 0-102.4z m486.4 0a51.2 51.2 0 1 0 0 102.4 51.2 51.2 0 0 0 0-102.4z" p-id="3019" fill="#ffffff"></path></svg>
                                <svg v-if="index >= currentIndex && item.status_name === 'out_for_delivery'" t="1663050625113" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3998" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path d="M332.8 51.2a51.2 51.2 0 0 1 51.2-51.2h256a51.2 51.2 0 1 1 0 102.4H563.2v54.1696A435.2512 435.2512 0 0 1 512 1024 435.2 435.2 0 0 1 460.8 156.5696V102.4H384a51.2 51.2 0 0 1-51.2-51.2zM512 256a332.8 332.8 0 1 0 0 665.6 332.8 332.8 0 0 0 0-665.6z m0 102.4a51.2 51.2 0 0 1 51.2 51.2v154.624l108.8 87.04a51.2 51.2 0 1 1-64 79.872l-128-102.4A51.2 51.2 0 0 1 460.8 588.8V409.6a51.2 51.2 0 0 1 51.2-51.2z" p-id="3999" fill="#ffffff"></path></svg>
                                <svg v-if="index > currentIndex && item.status_name === 'delivered'" t="1663050427310" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3214" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path d="M477.2864 38.5536a61.44 61.44 0 0 1 69.4272 0l97.4336 66.7136 118.0672 3.2768a61.44 61.44 0 0 1 56.1664 40.8064l39.5776 111.2576 93.5936 72.0384a61.44 61.44 0 0 1 21.504 66.048L939.6224 512l33.3312 113.3056a61.44 61.44 0 0 1-21.4528 66.048l-93.5936 71.9872-39.5776 111.3088a61.44 61.44 0 0 1-56.1664 40.8064l-118.0672 3.2768-97.4336 66.7136a61.44 61.44 0 0 1-69.4272 0l-97.4336-66.7136-118.0672-3.2768a61.44 61.44 0 0 1-56.1664-40.8064l-39.5776-111.2576-93.5936-72.0384a61.44 61.44 0 0 1-21.504-66.048L84.3776 512 50.9952 398.6944a61.44 61.44 0 0 1 21.4528-66.048L166.0416 260.608l39.5776-111.2576a61.44 61.44 0 0 1 56.1664-40.8064l118.0672-3.2768L477.2864 38.5536zM512 138.9056L427.776 196.5056a61.44 61.44 0 0 1-33.024 10.752l-102.0928 2.816-34.2016 96.2048a61.44 61.44 0 0 1-20.4288 28.1088L157.184 396.6976l28.8768 97.9456a61.44 61.44 0 0 1 0 34.7136l-28.8768 97.9456 80.896 62.2592a61.44 61.44 0 0 1 20.4288 28.16l34.2016 96.1536 102.0928 2.816c11.776 0.3072 23.296 4.096 33.024 10.752L512 885.1456l84.224-57.7024c9.728-6.656 21.248-10.4448 33.024-10.752l102.0928-2.816 34.2016-96.2048a61.44 61.44 0 0 1 20.4288-28.1088l80.896-62.2592-28.8768-97.9456a61.44 61.44 0 0 1 0-34.7136l28.8768-97.9456-80.896-62.2592a61.44 61.44 0 0 1-20.4288-28.16l-34.2016-96.1536-102.0928-2.816a61.44 61.44 0 0 1-33.024-10.752L512 138.8544z m189.7984 234.496a51.2 51.2 0 0 1 0 72.3968L504.32 643.3792a61.44 61.44 0 0 1-86.9376 0l-95.1296-95.1808a51.2 51.2 0 0 1 72.3968-72.3968L460.8 542.0032l168.6016-168.6016a51.2 51.2 0 0 1 72.3968 0z" p-id="3215" fill="#ffffff"></path></svg>
                                <svg v-if="index >= currentIndex && !statusNameList.includes(item.status_name)" t="1663050616369" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3802" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path d="M25.6 512a486.4 486.4 0 1 1 972.8 0 486.4 486.4 0 0 1-972.8 0zM512 128a384 384 0 1 0 0 768 384 384 0 0 0 0-768z m-10.5984 168.6016a51.2 51.2 0 0 1 72.3968 0l179.2 179.2a51.2 51.2 0 0 1 0 72.3968l-179.2 179.2a51.2 51.2 0 0 1-72.3968-72.3968L593.2032 563.2H332.8a51.2 51.2 0 1 1 0-102.4h260.4032L501.4016 368.9984a51.2 51.2 0 0 1 0-72.3968z" p-id="3803" fill="#ffffff"></path></svg>
                                <svg v-if="index < currentIndex || (index === currentIndex && item.status_name === 'delivered')" t="1663053509978" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1480" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path d="M358.4 921.6a51.0464 51.0464 0 0 1-36.1984-15.0016l-307.2-307.2a51.2 51.2 0 0 1 72.3968-72.3968l268.0832 268.0832 578.4576-674.816a51.2 51.2 0 0 1 77.7216 66.56l-614.4 716.8a51.2512 51.2512 0 0 1-36.9152 17.92L358.4 921.6z" p-id="1481" fill="#ffffff"></path></svg>
                            </div>
                        </div>
                        <div :class="['track123_order_step_line_process', { 'track123_order_step_line_not_active': index >= currentIndex }]" 
                            :style="{background: activeProcessBarColor }"></div>
                    </div>
                    <div :class="['track123_order_step_line_foot',{'track123_order_step_line_active_foot': index == currentIndex},{'track123_order_step_line_two_foot': item.status_name === 'delivered'}]">
                        <div class="track123_order_step_line_status_name track123_track_status track123_body">
                            {{ translation.shipping_status[item.status_name] || item.status_name }}
                        </div>
                        <div :class="['track123_order_step_line_time', 'track123_track_date_container', {'track123_caption':!isPhone}]">{{ item.event_time }}</div>
                    </div>
                </div>
            </div>
        </div>
	`,
    data() {
		return {
            currentStatusIndex: 0,
            phoneCurrentStatusIndex: 0,
            translation: {},
            activeProcessBarColor: '',
            isPhone: document.body.clientWidth <= 833,
            statusNameList: ['ordered', 'order_ready', 'in_transit', 'out_for_delivery', 'delivered'],
        }
    },
    created () {
        this.translation = this.getTranslation();
        this.activeProcessBarColor = this.config.style.process_bar_color
    },
    computed: {
        currentIndex() {
            return this.isPhone ? this.phoneCurrentStatusIndex : this.currentStatusIndex
        },
        statusShowList() {
            const list = []
            this.statusList.forEach((item, index) => {
                let data = {...item}
                if (data.event_time) {
                    this.currentStatusIndex = index
                    data.event_time = this.getTranslationTime(data.event_time, 'date')
                }
                list.push(data)
            });
            console.log(list, this.currentStatusIndex)
            return list
        },
        list() {
            if (!this.isPhone) return this.statusShowList
            const len = this.statusShowList.length
            const statusShowList = JSON.parse(JSON.stringify(this.statusShowList))
            if (this.currentStatusIndex == 0) {
                this.phoneCurrentStatusIndex = 0
                return statusShowList.slice(0, 3)
            } else if (this.currentStatusIndex == statusShowList.length-1) {
                const list = [statusShowList[0], statusShowList[statusShowList.length-1]]
                this.phoneCurrentStatusIndex = 1
                return list
            } else {
                this.phoneCurrentStatusIndex = 1
                return statusShowList.slice(this.currentStatusIndex -1, this.currentStatusIndex + 2)
            }
        },
    },
    methods: {
        // 时间日期格式替换翻译词, type只有date和time两种
		getTranslationTime(data, type) {
			if (!data) return ''
			let time = ''
			if (type == 'date') {
				// 日期格式只有月份才需要替换翻译词
				let format = this.config.style.theme !== 'modern' ? this.config.date_formatEnum.momentJsFormat : 'DD MMM'
                time = dayjs(data).format(format)
				if (format.includes('MMM')) {
					const monthString = dayjs(data).format('MMM')
                    if (this.translation.time[`month_${monthString.toLowerCase()}`]) {
                        time = time.replace(monthString, this.translation.time[`month_${monthString.toLowerCase()}`])
                    }
				} else if (format.includes('Do')) {
					// Do代表日期序号，dayjs失效，需要手动转格式
					format = format.replace('Do', `D*`)
					const dayString = dayjs(data).format('D')
					const dayMatch = {'1': 'st', '2': 'nd', '3': 'rd'}
					const dayFormat = dayMatch[dayString] || 'th'
					time = dayjs(data).format(format)
					time = time.replace('*', dayFormat)
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
        getTranslation() {
			let translation = null
            const defaultTranslation = this.config.translation_configs &&
                                    this.config.translation_configs.translation_configs &&
                                    this.config.translation_configs.translation_configs.length ? this.config.translation_configs.translation_configs[0].translation : {}
            const whiteList = ['free', 'Growth', 'Advanced']
            const permissionName = this.config.translation_configs.func_permission || this.config.translation_configs.plan || 'free'
			this.config.translation_configs.translation_configs.forEach(item => {
                if (this.config.style && this.config.style.theme == "default") {
                    try {
                        // if (item.code == Shopify.locale && whiteList.includes(permissionName)) translation = item.translation
                        if (item.code == Shopify.locale) translation = item.translation
                    } catch (error) {
                        console.log('Shopify undefine')
                    }
                }
			})
			return translation || defaultTranslation
		},
    },
}

window.trackStatusStepLine = StatusStepLine
