const trackForm = {
	mixins: [window.trackFormMixin],
	template: `
		<div v-if="translation.order_lookup_section" class="track123_form_wrapper track_form">
			<h1 id="track123_track_title" class="track123_track_form_title track123_title">{{ translation.order_lookup_section.track_your_order }}</h1>
			<div id="track123_text_above" class="track123_tracking_above" v-html="additional_text.text_above">{{ additional_text.text_above }}</div>
			<div v-if="isOrderNumberAndEmailAndTrackingNumber" class="track123_tab">
					<div :class="['track123_tab_bar',{'track123_tab_bar_color':showTab == 1}]" @click="showTab = 1">{{ translation.order_lookup_section.order_number }}</div>
					<div :class="['track123_tab_bar',{'track123_tab_bar_color':showTab == 2}]" @click="showTab = 2">{{ translation.order_lookup_section.tracking_number }}</div>
			</div>
			<div :class="[{'track123_form_content': !isOrderNumberAndEmailAndTrackingNumber}, {'track123_two_form_wrapper': isOrderNumberAndEmailAndTrackingNumber}]">
				<div v-if="(configure_options.lookup_options_by_order_number_and_email && !configure_options.lookup_options_by_tracking_number) || isOrderNumberAndEmailAndTrackingNumber" :class="{hide_order_number: showTab === 2 && isOrderNumberAndEmailAndTrackingNumber}">
					<div class="track123_input_container">
						<div id="track123_order_number" class="track123_form_label">{{ translation.order_lookup_section.order_number }}</div>
						<input class="track123_form_input track123_form_field track123_form_input1 field__input form__input" v-model="formParams.order_or_number" />
						<div :class="['track123_form_error', 'track123_order_no_alert', {'track123_form_error_show': showOrderError}]">
							{{ translation.order_lookup_section.order_number_error }}
						</div>
					</div>
					<div class="track123_input_container" v-if="configure_options.require_email_or_phone_number">
						<div id="track123_order_email" class="track123_form_label">{{ translation.order_lookup_section.email }}</div>
						<input class="track123_form_input track123_form_field track123_form_input2 field__input form__input" v-model="formParams.email" />
						<div :class="['track123_form_error', 'track123_order_no_alert', {'track123_form_error_show': showEmailError}]">
							{{ translation.order_lookup_section.email_error }}
						</div>
					</div>
					<button type="button" 
						v-if="configure_options.require_email_or_phone_number"
						id="track123_submit_button"
						class="button-enter btn button button_primary Button Button--primary styled-submit track123_form_button track123_form_button_style" 
						@click="submit(1)">
						{{ translation.order_lookup_section.track }}
					</button>
					<button type="button" 
						v-else
						id="track123_submit_button"
						class="button-enter btn button button_primary Button Button--primary styled-submit track123_form_button track123_form_button_style" 
						@click="submit(3)">
						{{ translation.order_lookup_section.track }}
					</button>
				</div>
				
				<div v-if="isOrderNumberAndEmailAndTrackingNumber">
					<div class="track123_tracking_line_center">
						<div class="track123_tracking_line"></div>
						<div class="track123_tracking_word">{{ translation.order_lookup_section.or }}</div>
						<div class="track123_tracking_line"></div>
					</div>
				</div>

				<div v-if="(configure_options.lookup_options_by_tracking_number && !configure_options.lookup_options_by_order_number_and_email) || isOrderNumberAndEmailAndTrackingNumber" :class="{hide_tracking_number:showTab===1&&isOrderNumberAndEmailAndTrackingNumber}">
					<div class="track123_input_container">
						<div id="track123_tracking_number" class="track123_form_label">{{ translation.order_lookup_section.tracking_number }}</div>
						<input class="track123_form_input track123_form_field track123_form_input1 field__input form__input" v-model="formParams.tracking_no" />
						<div :class="['track123_form_error', {'track123_form_error_show': showTrackingNoError}]">
							{{ translation.order_lookup_section.tracking_number_error }}
						</div>
					</div>
					<button type="button" 
						id="track123_submit_button"
						class="button-enter btn button button_primary Button Button--primary styled-submit track123_form_button track123_form_button_style" 
						@click="submit(2)">
						{{ translation.order_lookup_section.track }}
					</button>
				</div>

				<div v-if="configure_options.lookup_options_by_tracking_number && configure_options.lookup_options_by_order_number_and_email && !this.configure_options.require_email_or_phone_number" 
					:class="{hide_tracking_number:showTab===1&&isOrderNumberAndEmailAndTrackingNumber}">
					<div class="track123_input_container">
						<div id="track123_tracking_number" class="track123_form_label">{{ translation.order_lookup_section.order_number_or_tracking_number }}</div>
						<input class="track123_form_input track123_form_field track123_form_input1 field__input form__input" v-model="formParams.tracking_no_or_order_number" />
						<div :class="['track123_form_error', {'track123_form_error_show': showTrackingNoOrOrderNumberError }]">
							{{ translation.order_lookup_section.number_error }}
						</div>
					</div>
					<button type="button" 
						id="track123_submit_button"
						class="button-enter btn button button_primary Button Button--primary styled-submit track123_form_button track123_form_button_style" 
						@click="submit(4)">
						{{ translation.order_lookup_section.track }}
					</button>
				</div>
			</div>
			<loading :showLoading='showLoading' />
			<div v-if="showErrorText" class="track123_result_title_card">
            	<h1 class="track123_result_title track123_title">{{translation.shipping_details.no_tracking_info_text}}</h1>
            </div>
			<div v-if="showPowerBy" 
				id="track123-powered-by" 
				@click="openPoweredByLink"
				style="display: block !important;visibility: visible !important;text-align: right;font-size: 12px!important;color: inherit !important;opacity: .4;line-height: 16px!important;padding-top: 4px; cursor: pointer;">
				{{poweredByText}} Track123
			</div>
			<div id="track123_text_below" class="track123_tracking_below" v-html="additional_text.text_below">{{ additional_text.text_below }}</div>
		</div>
	`
}
window.trackForm = trackForm