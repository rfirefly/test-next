const trackOrderDetail = {
	mixins: [window.trackOrderDetailMixin],
	template: `
        <div class="track123_order_wrapper track123_track_data">
			<div id="track123_order_header" class="track123_order_header">
				<h1 class="track123_result_title track123_title">
					{{ translation.shipping_status.order }}: {{ orderPackageName }}
				</h1>
				<div v-if="orderDetail && orderDetail.order_packages && orderDetail.order_packages.length && orderDetail.order_packages.length > 1" 
					class="track123_order_tab"
					@click="toggleOrderSelector">
					<span class="track123_caption">+{{ orderDetail.order_packages.length }} {{ translation.shipping_status.orders }}</span>
					<div :class="['track123_arrow', {'track123_up_arrow': showOrderSelector}]"></div>
					<div v-show="showOrderSelector" 
						:class="['track123_order_tab_select_container', showOrderSelector ? 'track123_order_tab_select_container_show' : 'track123_order_tab_select_container_hide']">
						<div :class="['track123_order_select_item', 'track123_body', {'track123_order_select_active_item': index == currentPackageIndex}]" 
							v-for="(item, index) in orderDetail.order_packages" :key="index"
							@click="selectOrderPackage(index)">
							{{ orderDetail.order_name }}_F{{ index +1 }}
							<svg :style="{display: index == currentPackageIndex ? 'block' : 'none' }" width="15" height="15" t="1651742808831" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14910" width="15" height="20" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css">@font-face { font-family: feedback-iconfont; src: url("//at.alicdn.com/t/font_1031158_u69w8yhxdu.woff2?t=1630033759944") format("woff2"), url("//at.alicdn.com/t/font_1031158_u69w8yhxdu.woff?t=1630033759944") format("woff"), url("//at.alicdn.com/t/font_1031158_u69w8yhxdu.ttf?t=1630033759944") format("truetype"); }</style></defs><path d="M414.341786 967.098567c-8.580375 0-17.386549-3.38699-23.93473-9.935171l-293.53914-293.53914a33.644101 33.644101 0 0 1 0-47.86946 33.644101 33.644101 0 0 1 47.86946 0l269.60441 269.60441L951.970011 347.730981a33.644101 33.644101 0 0 1 47.86946 0c13.322161 13.322161 13.322161 34.773098 0 47.86946L438.276516 957.163396c-6.548181 6.77398-15.354355 9.935171-23.93473 9.935171z" p-id="14911" fill="#000000"></path></svg>
						</div>
					</div>
				</div>
			</div>
			<div v-if="productRecommendations && productRecommendations.length && configure_options.product_recommendations && configure_options.product_recommendations_position === 'aboveTrackingDetails'" 
				class="track123_product_recommendation_container">
				<h2 class="track123_product_recommendation_title">{{ translation.product_recommendation.may_like }}</h2>
				<div class="track123_product_recommendation_content">
					<track-product-recommendation :productRecommendations="productRecommendations" :orderDetail="orderDetail" :config="config"></track-product-recommendation>
				</div>
			</div>
			<h1 class="track123_order_status track123_last_track_info track123_title">{{ translation.shipping_status.status }}: {{ statusMsg }}</h1>
			<div class="track123_order_progress_container">
				<div v-if="expectedDeliveryTime" class="track123_order_arrive_time">
					{{ translation.shipping_status.expected_to_arrive_on }} <span :style="{ color: activeProcessBarColor }">{{ expectedDeliveryTime }}</span>
				</div>
				<div class="track123_order_step_line_wrapper">
					<track-status-step-line 
						:statusList="currentPackage.tracking_status_list"
						:currentStatus="currentPackage.transit_display_status"
						:config="config">
					</track-status-step-line>
				</div>
			</div>
			<div class="track123_order_detail_container track123_data_show_card">
				<div v-if="configure_options.tracking_info" class="track123_order_desc_container">
					<h2 id="track123_order_detail_title" class="track123_order_detail_title">{{ translation.shipping_details.shipping_details }}</h2>
					<div v-if="orderDetail.status != 'cancelled' && currentPackage.transit_display_status === 'ordered'" class="track123_order_last_tracking_detail track123_track_text track123_body">
						{{ translation.shipping_details.unready_text }}
					</div>
					<div v-if="orderDetail.status != 'cancelled' && currentPackage.transit_display_status === 'order_ready'" class="track123_order_last_tracking_detail track123_track_text track123_body">
						{{ translation.shipping_details.ready_text }}
					</div>
					<div v-if="orderDetail.status == 'cancelled'" class="track123_order_last_tracking_detail track123_track_text track123_body">
						{{ translation.shipping_details.canceled_text }}
					</div>

					<div class="track123_order_tracking_details_container">
						<div v-for="(groupItem, groupIndex) in trackingShowDetails[currentPackageIndex]" :key="groupItem.time">
							<div class="track123_track_date track123_sub_title">{{ !groupIndex ? translation.shipping_details.latest_update + ' ' : '' }}{{ groupItem.time }}</div>
							<div class="track123_track_ul">
								<div class="track123_track_li" v-for="(item, index) in groupItem.child" :key="item.event_detail">
									<div class="track123_caption track123_track_time">{{ item.event_time }}</div>
									<div :class="[groupIndex == 0 && index == 0 ? 'track123_track_desc track123_body_medium track123_order_tracking_details_first_msg' : 'track123_track_desc track123_body']">
										{{ item.event_location ? item.event_location + ',' : '' }} {{ item.event_detail }}
										<span v-if="item.courier_name && configure_options.carrier_details" class="track123_track_desc_courier">{{ item.courier_name }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div v-if="!config.configure_options.tracking_detail_show_all" class="track123_view_more_btn" @click="viewMoreToggle">
						<a>{{ translation.shipping_details.view_more }}</a>
					</div>
				</div>
				<div class="track123_order_map_location_container">
					<h2 class="track123_order_package_title track123_map_title">{{ translation.package_info.package_info }}</h2>
					<div class="package-info" :class="configure_options.tracking_info ? 'flex-column' : 'flex-row'">
						<div v-if="mapUrl && !notShowMap" :class="configure_options.tracking_info ? 'column-width' : 'row-width'">
							<div class="track123_order_detail_sub_title track123_map_location_card_info track123_sub_title">
								{{ 
									isMapCurrent ? translation.package_info.current_location : translation.package_info.destination 
								}}
							</div>
							<div class="track123_order_map">
								<iframe :src="mapUrl" width="100%" height="320" frameBorder="0" style="border:0" allowFullScreen></iframe>
							</div>
						</div>
						<div :class="configure_options.tracking_info ? 'column-width' : 'row-width'">
							<div v-if="configure_options.package_contents_details">
								<div class="track123_order_detail_sub_title track123_sub_title track123_package_content_title">{{ translation.package_info.package_content }}</div>
								<div class="track123_order_info_wrapper">
									<div class="track123_order_info_content" v-for="(item, index) in currentPackage.order_items" :key="item.id">
										<div class="track123_order_img_box">
											<img v-if="item.product_image" :src="item.product_image" :alt="item.title" loading="lazy" />
											<svg v-else viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M2.5 1a1.5 1.5 0 0 0-1.5 1.5v15a1.5 1.5 0 0 0 1.5 1.5h15a1.5 1.5 0 0 0 1.5-1.5v-15a1.5 1.5 0 0 0-1.5-1.5h-15zm5 3.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8.999 12.5h-13.002c-.41 0-.64-.46-.4-.79l3.553-4.051c.19-.21.52-.21.72-.01l1.63 1.851 3.06-4.781a.5.5 0 0 1 .84.02l4.039 7.011c.18.34-.06.75-.44.75z"></path></svg>
										</div>
										<div :class="['track123_order_info_detail', {'track123_flex_space_between': item.product_url || currentPackage.display_review || orderDetail.preview}]">
											<div class="track123_order_info_detail_title">x{{ item.quantity }} {{ item.title }}</div>
											<div class="track123_order_info_btn_box">
												<div v-if="item.product_url || orderDetail.preview" class="track123_order_info_btn_item track123_order_info_btn_reorder" @click="goProductDetail(item, 'reorder', index)">
													<svg v-if="(addCartLoadingIndex || addCartLoadingIndex == 0) && addCartLoadingIndex == index" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1" stroke-opacity="0.95" stroke-width="1.5" stroke-linecap="round"/>
													</svg>
													{{ translation.package_info.reorder }}
												</div>
												<div v-if="currentPackage.display_review" class="track123_order_info_btn_item track123_order_info_btn_review" @click="goProductDetail(item, 'review', index)">{{ translation.package_info.review }}</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div v-if="currentPackage.courier">
								<div v-if="configure_options.carrier_details">
									<div class="track123_order_detail_sub_title track123_sub_title track123_carrier_title">{{ translation.shipping_details.carrier }}</div>
									<div class="track123_order_info_wrapper">
										<div class="track123_order_courier_info_content">
											<div v-if="currentPackage.courier.courier_logo" class="track123_order_courier_img_box">
												<img :src="currentPackage.courier.courier_logo" :alt="currentPackage.courier.courier_code" loading="lazy" />
											</div>
											<div :class="['track123_order_info_detail', 'track123_carrier_info_content', {'track123_carrier_info_with_nums': configure_options.tracking_number}]">
												<div class="track123_order_info_detail_title track123_carrier_info_name">{{ currentPackage.courier.courier_name_e_n }}</div>
												<div v-if="configure_options.tracking_number">
													<a v-if="configure_options.link_to_carrier" :href="currentCourierLink" target="_blank" class="track123_order_tracing_no track123_track_no_info track123_track_no_underline track123_with_underline"> 
														{{ currentPackage.tracking_number }}
													</a>
													<div v-else class="track123_order_tracing_no track123_track_no_info">{{ currentPackage.tracking_number }}</div>
												</div>
											</div>
										</div>
										<div v-if="currentPackage.last_mile_info && currentPackage.last_mile_info.lm_track_no_provider_name && currentPackage.courier && currentPackage.last_mile_info.lm_track_no_provider_name != currentPackage.courier.courier_name_e_n" 
											class="track123_order_courier_info_content">
											<div v-if="currentPackage.last_mile_info.courier_logo" class="track123_order_courier_img_box">
												<img :src="currentPackage.last_mile_info.courier_logo" :alt="currentPackage.courier.courier_code" loading="lazy" />
											</div>
											<div :class="['track123_order_info_detail', 'track123_carrier_info_content', {'track123_carrier_info_with_nums': configure_options.tracking_number}]">
												<div class="track123_order_info_detail_title track123_carrier_info_name">{{ currentPackage.last_mile_info.lm_track_no_provider_name }}</div>
												<div v-if="configure_options.tracking_number">
													<a v-if="configure_options.link_to_carrier" :href="currentLastCourierLink" target="_blank" class="track123_order_tracing_no track123_track_no_info track123_track_no_underline track123_with_underline"> 
														{{ currentPackage.last_mile_info.lm_track_no }}
													</a>
													<div v-else class="track123_order_tracing_no track123_track_no_info">{{ currentPackage.last_mile_info.lm_track_no }}</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div v-if="configure_options.tracking_number && !configure_options.carrier_details">
									<div class="track123_order_detail_sub_title track123_sub_title track123_track_no_title">{{ translation.order_lookup_section.tracking_number }}</div>
									<div>
										<a v-if="configure_options.link_to_carrier" :href="currentCourierLink" target="_blank" class="track123_order_tracing_no track123_track_no_info track123_track_no_underline track123_with_underline"> 
											{{ currentPackage.tracking_number }}
										</a>
										<div v-else class="track123_order_tracing_no track123_track_no_info">{{ currentPackage.tracking_number }}</div>
									</div>
									<div v-if="currentPackage.last_mile_info">
										<a v-if="configure_options.link_to_carrier" :href="currentLastCourierLink" target="_blank" class="track123_order_tracing_no track123_track_no_info track123_track_no_underline track123_with_underline"> 
											{{ currentPackage.last_mile_info.lm_track_no }}
										</a>
										<div v-else class="track123_order_tracing_no track123_track_no_info">{{ currentPackage.last_mile_info.lm_track_no }}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-if="productRecommendations && productRecommendations.length && configure_options.product_recommendations && configure_options.product_recommendations_position === 'belowTrackingDetails'" 
				class="track123_product_recommendation_container">
				<h2 class="track123_product_recommendation_title">{{ translation.product_recommendation.may_like }}</h2>
				<div class="track123_product_recommendation_content">
					<track-product-recommendation :productRecommendations="productRecommendations" :orderDetail="orderDetail" :config="config"></track-product-recommendation>
				</div>
			</div>
        </div>
	`,
}

window.trackOrderDetail = trackOrderDetail
