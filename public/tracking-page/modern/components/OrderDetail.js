const trackOrderDetail = {
    props: {
        currentIndex: {
            type: Number,
            default: 0
        },
    },
    mixins: [window.trackOrderDetailMixin],
	template: `
        <div>
            <div :class="['track123-mask', {'track123-top-mask': scrollToTop}]"></div>
            <div id="orderWrapper" 
                class="track123_order_wrapper">
                <div class="track123_draggable_flag"></div>
                <div id="orderHeader" :class="['track123_order_header_container', {'track123_order_header_ios_bottom_container': isBottom}]">
                    <div class="track123_order_header_item">
                        <div class="track123_order_header_content">
                            <div v-if="!currentPackage.last_mile_info" class="track123_order_carrier_logo">
                                <a v-if="config.configure_options.link_to_carrier_for_modern" target="_blank" :href="currentCourierLink">
                                    <img v-if="currentPackage.courier && currentPackage.courier.courier_logo && configure_options.carrier_details" 
                                        class="carrier_logo"
                                        :src="currentPackage.courier.courier_logo" 
                                        :alt="currentPackage.courier.courier_code" />
                                    <img v-else class="default_icon" :src="transitionImg" />
                                </a>
                                <div v-else>
                                    <img v-if="currentPackage.courier && currentPackage.courier.courier_logo && configure_options.carrier_details" 
                                        class="carrier_logo"
                                        :src="currentPackage.courier.courier_logo" 
                                        :alt="currentPackage.courier.courier_code" />
                                    <img v-else class="default_icon" :src="transitionImg" />
                                </div>
                            </div>
                            <div class="track123_order_header_info" v-if="!currentPackage.last_mile_info">
                                <div v-if="config.configure_options.link_to_carrier_for_modern">
                                    <a v-if="currentPackage.tracking_number" class="track123_order_header_title" target="_blank" :href="currentCourierLink">{{ currentPackage.tracking_number }}</a>
                                    <div v-else class="track123_order_header_title">{{ orderDetail.order_name }}</div>
                                </div>
                                <div v-else class="track123_order_header_title">{{ currentPackage.tracking_number || orderDetail.order_name }}</div>
                                
                                <div v-if="currentPackage.tracking_number && !currentPackage.last_mile_info" class="track123_order_header_sub_title">{{ orderDetail.order_name }}</div>
                                <div v-if="orderDetail.status != 'cancelled' && currentPackage.transit_display_status === 'order_ready'" class="track123_order_header_sub_title">{{ translation.shipping_details.ready_text }}</div>
                                <div v-if="orderDetail.status != 'cancelled' && currentPackage.transit_display_status === 'ordered'" class="track123_order_header_sub_title">{{ translation.shipping_details.unready_text }}</div>
                                <div v-if="orderDetail.status == 'cancelled'" class="track123_order_header_sub_title">{{ translation.shipping_details.canceled_text }}</div>
                            </div>
                            <div class="track123_order_header_info" v-else>
                                <div class="track123_order_header_title">{{ orderDetail.order_name }}</div>
                            </div>
                        </div>
                        <div class="track123_order_carrier_close_icon"
                            @click="closeOrderDetail">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.83068 0.595578C10.2711 0.268796 10.8961 0.305105 11.2955 0.704505C11.6949 1.1039 11.7312 1.7289 11.4044 2.16932L11.2955 2.2955L7.5915 6L11.2955 9.7045C11.7348 10.1438 11.7348 10.8562 11.2955 11.2955C10.8961 11.6949 10.2711 11.7312 9.83068 11.4044L9.7045 11.2955L6 7.5915L2.2955 11.2955L2.16932 11.4044C1.7289 11.7312 1.1039 11.6949 0.704505 11.2955C0.305105 10.8961 0.268796 10.2711 0.595578 9.83068L0.704505 9.7045L4.4085 6L0.704505 2.2955C0.265165 1.85616 0.265165 1.14384 0.704505 0.704505C1.1039 0.305105 1.7289 0.268796 2.16932 0.595578L2.2955 0.704505L6 4.4085L9.7045 0.704505L9.83068 0.595578Z" fill="#0B1019" fill-opacity="0.25"/>
                            </svg>
                        </div>
                    </div>
                    <div class="track123_order_header_info" v-if="currentPackage.last_mile_info">
                        <div v-if="orderDetail.status != 'cancelled' && currentPackage.transit_display_status === 'order_ready'" class="track123_order_header_sub_title">{{ translation.shipping_details.ready_text }}</div>
                        <div v-if="orderDetail.status != 'cancelled' && currentPackage.transit_display_status === 'ordered'" class="track123_order_header_sub_title">{{ translation.shipping_details.unready_text }}</div>
                        <div v-if="orderDetail.status == 'cancelled'" class="track123_order_header_sub_title">{{ translation.shipping_details.canceled_text }}</div>
                    </div>
                    <div v-if="currentPackage.last_mile_info" class="track123_order_header_item">
                        <div v-if="config.configure_options.carrier_details" class="track123_order_header_content track123_order_header_center_content">
                            <div class="track123_order_carrier_logo">
                                <a v-if="config.configure_options.link_to_carrier_for_modern" target="_blank" :href="currentCourierLink">
                                    <img v-if="currentPackage.courier && currentPackage.courier.courier_logo" 
                                        class="carrier_logo"
                                        :src="currentPackage.courier.courier_logo" 
                                        :alt="currentPackage.courier.courier_code" />
                                    <img v-else class="default_icon" :src="transitionImg" />
                                </a>
                                <div v-else>
                                    <img v-if="currentPackage.courier && currentPackage.courier.courier_logo" 
                                        class="carrier_logo"
                                        :src="currentPackage.courier.courier_logo" 
                                        :alt="currentPackage.courier.courier_code" />
                                    <img v-else class="default_icon" :src="transitionImg" />
                                </div>
                            </div>
                            <div class="courier_name">
                                {{ currentPackage.courier.courier_name_e_n }}
                            </div>
                        </div>

                        <a v-if="config.configure_options.link_to_carrier_for_modern && currentPackage.tracking_number" class="track_no" target="_blank" :href="currentCourierLink">
                            {{ currentPackage.tracking_number }}
                        </a>
                        <div v-else class="track_no">{{ currentPackage.tracking_number }}</div>
                    </div>
                    <div v-if="currentPackage.last_mile_info" class="track123_order_header_item">
                        <div v-if="config.configure_options.carrier_details" class="track123_order_header_content track123_order_header_center_content">
                            <div class="track123_order_carrier_logo">
                                <a v-if="config.configure_options.link_to_carrier_for_modern" target="_blank" :href="currentLastCourierLink">
                                    <img v-if="currentPackage.last_mile_info.courier_logo"  
                                        class="carrier_logo"
                                        :src="currentPackage.last_mile_info.courier_logo" 
                                        :alt="currentPackage.last_mile_info.lm_track_no_provider_name" />
                                    <img v-else class="default_icon" :src="transitionImg" />
                                </a>
                                <div v-else>
                                    <img v-if="currentPackage.last_mile_info.courier_logo" 
                                        class="carrier_logo"
                                        :src="currentPackage.last_mile_info.courier_logo" 
                                        :alt="currentPackage.last_mile_info.lm_track_no_provider_name" />
                                    <img v-else class="default_icon" :src="transitionImg" />
                                </div>
                            </div>
                            <div class="courier_name">
                                {{ currentPackage.last_mile_info.lm_track_no_provider_name }}
                            </div>
                        </div>
                        <a v-if="config.configure_options.link_to_carrier_for_modern" class="track_no" target="_blank" :href="currentLastCourierLink">
                            {{ currentPackage.last_mile_info.lm_track_no }}
                        </a>
                        <div v-else class="track_no">{{ currentPackage.last_mile_info.lm_track_no }}</div>
                    </div>
                </div>
                
                <div v-if="currentPackage.order_items && configure_options.package_contents_details" 
                    class="track123_order_package_container" 
                    @click="openPackageDetail">
                    <div class="track123_order_package_img_content">
                        <div class="track123_order_package_img_box" v-for="(item, index) in currentPackage.order_items" :key="item.id" v-if="index < 3">
                            <img 
                                v-if="item.product_image"
                                :src="item.product_image" 
                                :alt="item.title" />
                            <div v-else class="product_img_unload_title">{{ item.title }}</div>
                        </div>

                    </div>
                    <div class="track123_order_package_num_content">
                        <div class="mr-8">x {{ currentPackage.order_items.length }} {{ translation.package_info.items }}</div>
                        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.954505 11.2955C0.515165 10.8562 0.515165 10.1438 0.954505 9.7045L4.65901 6L0.954505 2.2955C0.515165 1.85616 0.515165 1.14384 0.954505 0.704505C1.39384 0.265165 2.10616 0.265165 2.5455 0.704505L7.0455 5.2045C7.48484 5.64384 7.48484 6.35616 7.0455 6.7955L2.5455 11.2955C2.10616 11.7348 1.39384 11.7348 0.954505 11.2955Z" fill="#0B1019" fill-opacity="0.25"/>
                        </svg>
                    </div>
                </div>

                <div id="orderDetail" class="track123_order_tracking_details_container">
                    <div class="track123_order_tracking_details_status_content">
                        <div class="status_icon_box" :style="{ borderColor: statusColor }">
                            <div class="status_icon" :style="{ background: statusColor }">
                                <svg v-if="orderDetail.status != 'cancelled' && currentPackage.transit_display_status == 'ordered'" t="1663050600897" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3606" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path d="M102.4 102.4a51.2 51.2 0 0 1 51.2-51.2h716.8a51.2 51.2 0 0 1 51.2 51.2v460.8a51.2 51.2 0 1 1-102.4 0V153.6H204.8v665.6h256a51.2 51.2 0 1 1 0 102.4H153.6a51.2 51.2 0 0 1-51.2-51.2V102.4z m204.8 204.8a51.2 51.2 0 0 1 51.2-51.2h307.2a51.2 51.2 0 1 1 0 102.4H358.4a51.2 51.2 0 0 1-51.2-51.2z m0 179.2a51.2 51.2 0 0 1 51.2-51.2h307.2a51.2 51.2 0 1 1 0 102.4H358.4a51.2 51.2 0 0 1-51.2-51.2zM307.2 665.6a51.2 51.2 0 0 1 51.2-51.2h153.6a51.2 51.2 0 1 1 0 102.4H358.4a51.2 51.2 0 0 1-51.2-51.2z m650.5984 87.3984l-204.8 204.8a51.2 51.2 0 0 1-72.3968 0l-102.4-102.4a51.2 51.2 0 0 1 72.3968-72.3968L716.8 849.2032l168.6016-168.6016a51.2 51.2 0 0 1 72.3968 72.3968z" p-id="3607" fill="#ffffff"></path></svg>
                                <svg v-else-if="orderDetail.status != 'cancelled' && currentPackage.transit_display_status == 'order_ready'" t="1663050591606" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3410" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path d="M486.912 32.1536a51.2 51.2 0 0 1 50.176 0l409.6 230.4A51.2 51.2 0 0 1 972.8 307.2v409.6a51.2 51.2 0 0 1-26.112 44.6464l-409.6 230.4a51.2 51.2 0 0 1-50.176 0l-409.6-230.4A51.2 51.2 0 0 1 51.2 716.8V307.2a51.2 51.2 0 0 1 26.112-44.6464l409.6-230.4zM153.6 399.5648v287.2832l307.2 172.8v-268.0832l-102.4-64V563.2a51.2 51.2 0 1 1-102.4 0V463.5648l-102.4-64z m251.648 36.5056L512 502.8352l309.248-193.3312-105.8304-59.5456-310.1696 186.112zM563.2 591.5648v268.0832l307.2-172.8v-287.232l-307.2 192z m49.5104-399.36L512 135.5264 202.752 309.504l104.96 65.6384 304.9984-182.9376z" p-id="3411" fill="#ffffff"></path></svg>
                                <svg v-else-if="orderDetail.status != 'cancelled' && currentPackage.transit_display_status == 'in_transit'" t="1663050265527" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3018" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path d="M0 204.8a51.2 51.2 0 0 1 51.2-51.2h665.6a51.2 51.2 0 0 1 51.2 51.2v128h76.8a51.2 51.2 0 0 1 41.6768 21.4528l128 179.2A51.2 51.2 0 0 1 1024 563.2v204.8a51.2 51.2 0 0 1-51.2 51.2h-85.504a153.6512 153.6512 0 0 1-289.792 0H400.896a153.6512 153.6512 0 0 1-289.792 0H51.2a51.2 51.2 0 0 1-51.2-51.2V204.8z m111.104 512a153.6512 153.6512 0 0 1 289.792 0h196.608A154.112 154.112 0 0 1 665.6 634.9312V256H102.4v460.8h8.704zM768 616.4992A153.8048 153.8048 0 0 1 887.296 716.8H921.6v-137.216L818.432 435.2H768v181.2992zM256 716.8a51.2 51.2 0 1 0 0 102.4 51.2 51.2 0 0 0 0-102.4z m486.4 0a51.2 51.2 0 1 0 0 102.4 51.2 51.2 0 0 0 0-102.4z" p-id="3019" fill="#ffffff"></path></svg>
                                <svg v-else-if="orderDetail.status != 'cancelled' && currentPackage.transit_display_status == 'out_for_delivery'" t="1663050625113" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3998" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path d="M332.8 51.2a51.2 51.2 0 0 1 51.2-51.2h256a51.2 51.2 0 1 1 0 102.4H563.2v54.1696A435.2512 435.2512 0 0 1 512 1024 435.2 435.2 0 0 1 460.8 156.5696V102.4H384a51.2 51.2 0 0 1-51.2-51.2zM512 256a332.8 332.8 0 1 0 0 665.6 332.8 332.8 0 0 0 0-665.6z m0 102.4a51.2 51.2 0 0 1 51.2 51.2v154.624l108.8 87.04a51.2 51.2 0 1 1-64 79.872l-128-102.4A51.2 51.2 0 0 1 460.8 588.8V409.6a51.2 51.2 0 0 1 51.2-51.2z" p-id="3999" fill="#ffffff"></path></svg>
                                <svg v-else-if="orderDetail.status != 'cancelled' && currentPackage.transit_display_status == 'delivered'" t="1663050427310" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3214" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path d="M477.2864 38.5536a61.44 61.44 0 0 1 69.4272 0l97.4336 66.7136 118.0672 3.2768a61.44 61.44 0 0 1 56.1664 40.8064l39.5776 111.2576 93.5936 72.0384a61.44 61.44 0 0 1 21.504 66.048L939.6224 512l33.3312 113.3056a61.44 61.44 0 0 1-21.4528 66.048l-93.5936 71.9872-39.5776 111.3088a61.44 61.44 0 0 1-56.1664 40.8064l-118.0672 3.2768-97.4336 66.7136a61.44 61.44 0 0 1-69.4272 0l-97.4336-66.7136-118.0672-3.2768a61.44 61.44 0 0 1-56.1664-40.8064l-39.5776-111.2576-93.5936-72.0384a61.44 61.44 0 0 1-21.504-66.048L84.3776 512 50.9952 398.6944a61.44 61.44 0 0 1 21.4528-66.048L166.0416 260.608l39.5776-111.2576a61.44 61.44 0 0 1 56.1664-40.8064l118.0672-3.2768L477.2864 38.5536zM512 138.9056L427.776 196.5056a61.44 61.44 0 0 1-33.024 10.752l-102.0928 2.816-34.2016 96.2048a61.44 61.44 0 0 1-20.4288 28.1088L157.184 396.6976l28.8768 97.9456a61.44 61.44 0 0 1 0 34.7136l-28.8768 97.9456 80.896 62.2592a61.44 61.44 0 0 1 20.4288 28.16l34.2016 96.1536 102.0928 2.816c11.776 0.3072 23.296 4.096 33.024 10.752L512 885.1456l84.224-57.7024c9.728-6.656 21.248-10.4448 33.024-10.752l102.0928-2.816 34.2016-96.2048a61.44 61.44 0 0 1 20.4288-28.1088l80.896-62.2592-28.8768-97.9456a61.44 61.44 0 0 1 0-34.7136l28.8768-97.9456-80.896-62.2592a61.44 61.44 0 0 1-20.4288-28.16l-34.2016-96.1536-102.0928-2.816a61.44 61.44 0 0 1-33.024-10.752L512 138.8544z m189.7984 234.496a51.2 51.2 0 0 1 0 72.3968L504.32 643.3792a61.44 61.44 0 0 1-86.9376 0l-95.1296-95.1808a51.2 51.2 0 0 1 72.3968-72.3968L460.8 542.0032l168.6016-168.6016a51.2 51.2 0 0 1 72.3968 0z" p-id="3215" fill="#ffffff"></path></svg>
                                <svg v-else-if="orderDetail.status == 'cancelled'" t="1663050265527" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3018" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path d="M0 204.8a51.2 51.2 0 0 1 51.2-51.2h665.6a51.2 51.2 0 0 1 51.2 51.2v128h76.8a51.2 51.2 0 0 1 41.6768 21.4528l128 179.2A51.2 51.2 0 0 1 1024 563.2v204.8a51.2 51.2 0 0 1-51.2 51.2h-85.504a153.6512 153.6512 0 0 1-289.792 0H400.896a153.6512 153.6512 0 0 1-289.792 0H51.2a51.2 51.2 0 0 1-51.2-51.2V204.8z m111.104 512a153.6512 153.6512 0 0 1 289.792 0h196.608A154.112 154.112 0 0 1 665.6 634.9312V256H102.4v460.8h8.704zM768 616.4992A153.8048 153.8048 0 0 1 887.296 716.8H921.6v-137.216L818.432 435.2H768v181.2992zM256 716.8a51.2 51.2 0 1 0 0 102.4 51.2 51.2 0 0 0 0-102.4z m486.4 0a51.2 51.2 0 1 0 0 102.4 51.2 51.2 0 0 0 0-102.4z" p-id="3019" fill="#ffffff"></path></svg>
                                <svg v-else t="1663050265527" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3018" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path d="M0 204.8a51.2 51.2 0 0 1 51.2-51.2h665.6a51.2 51.2 0 0 1 51.2 51.2v128h76.8a51.2 51.2 0 0 1 41.6768 21.4528l128 179.2A51.2 51.2 0 0 1 1024 563.2v204.8a51.2 51.2 0 0 1-51.2 51.2h-85.504a153.6512 153.6512 0 0 1-289.792 0H400.896a153.6512 153.6512 0 0 1-289.792 0H51.2a51.2 51.2 0 0 1-51.2-51.2V204.8z m111.104 512a153.6512 153.6512 0 0 1 289.792 0h196.608A154.112 154.112 0 0 1 665.6 634.9312V256H102.4v460.8h8.704zM768 616.4992A153.8048 153.8048 0 0 1 887.296 716.8H921.6v-137.216L818.432 435.2H768v181.2992zM256 716.8a51.2 51.2 0 1 0 0 102.4 51.2 51.2 0 0 0 0-102.4z m486.4 0a51.2 51.2 0 1 0 0 102.4 51.2 51.2 0 0 0 0-102.4z" p-id="3019" fill="#ffffff"></path></svg>
                            </div>
                        </div>
                        <div class="title">{{ statusMsg }}</div>
                    </div>
                    <div class="track123_order_tracking_details_content">
                        <div v-if="expectedDeliveryTime" class="track123_order_arrive_time">
                            <div class="time_icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7V13C11 13.5523 11.4477 14 12 14H15C15.5523 14 16 13.5523 16 13C16 12.4477 15.5523 12 15 12H13V7Z" fill="#0B1019" fill-opacity="0.45"/>
                                </svg>
                            </div>
                            <div class="time_info">
                                <div class="title">{{ translation.shipping_status.expected_to_arrive_on }}</div>
                                <div class="arrive_time">{{ expectedDeliveryTime }}</div>
                            </div>
                        </div>
                        <div class="track123_order_desc_wrapper" v-for="(groupItem, groupIndex) in trackingDetails[currentPackageIndex]">
                            <div class="track123_order_desc_left_content">
                                <div v-if="groupItem.time" :class="['track123_track_date_icon_box', {'track123_track_date_first_icon_box': groupIndex == 0 }]">
                                    <div>{{ groupItem.time.split(' ')[0] }}</div>
                                    <div>{{ groupItem.time.split(' ')[1] }}</div>
                                </div>
                                <div :class="['track123_date_line', {'track123_date_last_line': groupIndex == trackingDetails[currentPackageIndex].length-1}]"></div>
                            </div>
                            <div class="track123_order_desc_container" v-for="(item, index) in groupItem.child" :key="item.event_detail">
                                <div class="track123_order_desc_right_content">
                                    <div class="track123_event_time">{{ item.event_time }}</div>
                                    <div :class="['track123_event_detail', {'track123_event_first_detail': groupIndex == 0 && index == 0}]">
                                        {{ item.event_location ? item.event_location + ',' : '' }} {{ item.event_detail }}
                                    </div>
                                    <div v-if="item.courier_name && configure_options.carrier_details" class="track123_track_desc_courier">{{ item.courier_name }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="isPhone" class="track123_order_package_detail_container">
                        <div class="track123_order_package_detail_header_content">
                            <div class="title">{{ translation.package_info.package_content }}</div>
                        </div>
                        <div v-if="currentPackage.order_items" class="track123_order_package_detail_box">
                            <div class="track123_order_package_detail_content" v-for="(item, index) in currentPackage.order_items" :key="item.id"">
                                <div class="track123_product_image_box">
                                    <img 
                                        v-if="item.product_image"
                                        :src="item.product_image" 
                                        :alt="item.title" />
                                    <div v-else class="product_img_unload_title">{{ item.title }}</div>
                                </div>
                                <div class="detail_info_content">
                                    <div class="title">x{{ item.quantity }} {{ item.title }}</div>
                                    <div class="btn_box">
                                        <button v-if="item.product_url || orderDetail.preview" class="btn_item track123_order_info_btn_reorder" @click="goProductDetail(item, 'reorder', index)">
                                            <svg v-if="(addCartLoadingIndex || addCartLoadingIndex == 0) && addCartLoadingIndex == index" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1" stroke-opacity="0.95" stroke-width="1.5" stroke-linecap="round"/>
                                            </svg>
                                            {{ translation.package_info.reorder }}
                                        </button>
                                        <button v-if="currentPackage.display_review" class="btn_item track123_order_info_btn_review" @click="goProductDetail(item, 'review', index)">{{ translation.package_info.review }}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="productRecommendations && productRecommendations.length && configure_options.product_recommendations" class="track123_product_recommendations_container">
                        <div class="title">{{ translation.product_recommendation.may_like }}</div>
                        <div class="track123_product_recommendations_box">
                            <div v-for="(item, index) in productRecommendations" :key="index">
                                <a :class="['track123_product_recommendations_item', {'ml-12': index == 3}]" v-show="index < 4"
                                    :href="item.url" rel="noreferrer" target="_blank" :data-price="item.price">
                                    <div class="img_box">
                                        <img
                                            v-if="item.imageUrl"
                                            :src="item.imageUrl" 
                                            :alt="item.title" 
                                            loading="lazy" /> 
                                    </div>
                                    <div class="title">{{ item.title }}</div>
                                    <div class="track123_product_price_container">
                                        <s v-if="item.compare_at_price" v-html="item.compare_at_price" class="track123_product_compare_price">{{ item.compare_at_price }}</s>
                                        <div class="price" v-html="item.price">{{ item.price }}</div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-show="showPackageDetail && !isPhone" class="track123_order_package_detail_container">
                <div class="track123_order_package_detail_header_content">
                    <div class="title">{{ translation.package_info.package_content }}</div>
                    <svg @click="closePackageDetail" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.83068 0.595578C10.2711 0.268796 10.8961 0.305105 11.2955 0.704505C11.6949 1.1039 11.7312 1.7289 11.4044 2.16932L11.2955 2.2955L7.5915 6L11.2955 9.7045C11.7348 10.1438 11.7348 10.8562 11.2955 11.2955C10.8961 11.6949 10.2711 11.7312 9.83068 11.4044L9.7045 11.2955L6 7.5915L2.2955 11.2955L2.16932 11.4044C1.7289 11.7312 1.1039 11.6949 0.704505 11.2955C0.305105 10.8961 0.268796 10.2711 0.595578 9.83068L0.704505 9.7045L4.4085 6L0.704505 2.2955C0.265165 1.85616 0.265165 1.14384 0.704505 0.704505C1.1039 0.305105 1.7289 0.268796 2.16932 0.595578L2.2955 0.704505L6 4.4085L9.7045 0.704505L9.83068 0.595578Z" fill="#0B1019" fill-opacity="0.25"/>
                    </svg>
                </div>
                <div v-if="currentPackage.order_items" class="track123_order_package_detail_box">
                    <div class="track123_order_package_detail_content" v-for="(item, index) in currentPackage.order_items" :key="item.id"">
                        <div class="track123_product_image_box">
                            <img 
                                v-if="item.product_image"
                                :src="item.product_image" 
                                :alt="item.title" />
                            <div v-else class="product_img_unload_title">{{ item.title }}</div>
                        </div>
                        <div class="detail_info_content">
                            <div class="title">x{{ item.quantity }} {{ item.title }}</div>
                            <div class="btn_box">
                                <button v-if="item.product_url || orderDetail.preview" class="btn_item track123_order_info_btn_reorder" @click="goProductDetail(item, 'reorder', index)">
                                    <svg v-if="(addCartLoadingIndex || addCartLoadingIndex == 0) && addCartLoadingIndex == index" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1" stroke-opacity="0.95" stroke-width="1.5" stroke-linecap="round"/>
                                    </svg>
                                    {{ translation.package_info.reorder }}
                                </button>
                                <button v-if="currentPackage.display_review" class="btn_item track123_order_info_btn_review" @click="goProductDetail(item, 'review', index)">{{ translation.package_info.review }}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
	`,
    data() {
        return {
            showPackageDetail: false,
            scrollToTop: false,
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
            },
            isBottom: false,
            orderDetailDom: null
        }
    },
    computed: {
        isPhone() {
            return  navigator.userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
            )
        },
        isIOS() {
            return  navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i)
        },
        transitionImg() {
            return `${this.baseUrl}/tracking-page/modern/img/transition.png`
        },
        statusColor() {
            return this.orderDetail.status == 'cancelled' ? '#020f4066' : this.statusColorMatch[this.currentPackage.transit_display_status] || '#28A864'
        }
    },
    created () {
        this.currentPackageIndex = this.currentIndex;
    },
    mounted () {
       this.initHammer()
       this.orderDetailDom = document.getElementById('orderDetail')
    //    this.orderDetailDom.addEventListener('scroll', this.handlDetailScroll)
    },
    watch: {
        currentIndex(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.currentPackageIndex = currentIndex;
            }
        }
    },
    methods: {
        openPackageDetail() {
            this.showPackageDetail = true;
        },
        closePackageDetail() {
            this.showPackageDetail = false;
        },
        closeOrderDetail() {
            this.$emit('closeOrderDetail')
        },
        // handlDetailScroll() {
        //     if (this.orderDetailDom.scrollTop == 0) this.orderDetailDom.style.overflowY = 'hidden'
        // },
        // hammer.js 参考文档：http://hammerjs.github.io/getting-started/
        initHammer() {
            const _this = this;
            const clientHeight = document.body.clientHeight
            const minHeight = clientHeight - 90;
            const orderWrapperDom = document.getElementById('orderWrapper');
            const orderHeaderDom = document.getElementById('orderHeader')
            const orderDetailDom = document.getElementById('orderDetail')
            const googleTranslateDom = document.getElementById('google_translate_element');
            const manager = new Hammer.Manager(orderWrapperDom);
            const Pan = new Hammer.Pan({
                direction:Hammer.DIRECTION_VERTICAL
            });
            manager.add(Pan);

            let offsetTop = 0;
            let dragFlag = false;
            manager.on('panstart', function(e) {
                if (!_this.isPhone) return;
                dragFlag = true;
                offsetTop = orderWrapperDom.offsetTop
                manager.on('pandown', function (e) {
                    if (_this.scrollToTop && _this.orderDetailDom.scrollTop >= 50) return;
                    let y = offsetTop + e.deltaY
                    _this.isBottom = false
                    console.log('pandown', y, offsetTop, e.deltaY, orderDetailDom.scrollTop)
                    if (offsetTop == 40 && _this.orderDetailDom.scrollTop < 50) {
                        _this.orderDetailDom.style.overflowY = 'hidden'
                        console.log('暂停滚动')
                    }
                    if (y > minHeight) {
                        y = minHeight;
                    }
                    if (y <= 80) {
                        y = 40;
                    }
                    if (e.deltaY < 0) {
                        y = 'calc(50vh - 19px)'
                        orderWrapperDom.style.top = y;
                        _this.scrollToTop = false;
                        _this.$emit('toggleHeader', true)
                        if (googleTranslateDom) googleTranslateDom.style.display = 'block';
                        return;
                    }
                    orderWrapperDom.style.top = `${y}px`;
                })
                manager.on('panup', function (e) {
                    if (_this.scrollToTop && e.deltaY < 0) return;
                    let y = offsetTop + e.deltaY
                    console.log('panup', y, offsetTop, e.deltaY)
                    _this.isBottom = false
                    if (y <= 80) {
                        _this.orderDetailDom.style.overflowY = 'auto'
                        _this.scrollToTop = true
                        _this.$emit('toggleHeader', false)
                        if (googleTranslateDom) googleTranslateDom.style.display = 'hidden';
                        y = 40;
                        console.log('panup hide')
                    }
                    orderWrapperDom.style.top = `${y}px`;
                })
            })
           
            manager.on('panend', function(e) {
                if (!_this.isPhone) return;
                let y = offsetTop + e.deltaY
                dragFlag = false;
                _this.scrollToTop = false;
                const sixtyPercentHeight = clientHeight * 0.6
                const thirtyPercentHeight = clientHeight * 0.3
                _this.orderDetailDom.scrollTop = 0
                console.log('panend', y, offsetTop, thirtyPercentHeight, sixtyPercentHeight)
                _this.isBottom = false
                if (y <= thirtyPercentHeight) {
                    y = '40px'
                    _this.orderDetailDom.style.overflowY = 'auto'
                    _this.scrollToTop = true
                    _this.$emit('toggleHeader', false)
                    if (googleTranslateDom) googleTranslateDom.style.display = 'none';
                    console.log('panend hide')
                } else if (y > thirtyPercentHeight && y < sixtyPercentHeight) {
                    y = 'calc(50vh - 19px)'
                    _this.$emit('toggleHeader', true)
                    if (googleTranslateDom) googleTranslateDom.style.display = 'block';
                } else if (y >= sixtyPercentHeight) {
                    let orderHeaderHeight = orderHeaderDom.clientHeight + 48
                    orderHeaderHeight += 75
                    _this.isBottom = true
                    y = `calc(100vh - ${orderHeaderHeight}px)`
                    _this.$emit('toggleHeader', true)
                    if (googleTranslateDom) googleTranslateDom.style.display = 'block';
                }
                orderWrapperDom.style.top = y;
            })
        }
    },
}

window.trackModernOrderDetail = trackOrderDetail
