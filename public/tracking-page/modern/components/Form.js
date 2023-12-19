const trackForm = {
    mixins: [window.trackFormMixin],
	template: `
        <div v-if="translation.order_lookup_section" class="track123_form_wrapper">
            <img v-if="isPhone && showPowerBy" :src="poweredByMobileImg" class="track123_poweredBy" @click="openPoweredByLink" />
            <div v-if="window.showAdditionalText && (additional_text.text_above || additional_text.text_below)" class="track123_additional_text_container">
                <div :class="['text_above', {'text_above_show_all': showTextAboveMore}]">
                    <div class="content">
                        <div id="textAbove" class="title" v-html="additional_text.text_above"></div>
                        <button class="track123_blank_btn" @click="showTextAboveMore=!showTextAboveMore">
                            <svg v-if="showPhoneMore" :class="['more_icon', {'up_more_icon': showTextAboveMore}]" width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.599971 3.79997C0.452695 3.6036 0.471705 3.33416 0.632903 3.16034L0.69997 3.09997L4.69997 0.0999708C4.85235 -0.0143147 5.05371 -0.0306416 5.22009 0.0509911L5.29997 0.0999708L9.29997 3.09997C9.52088 3.26566 9.56566 3.57906 9.39997 3.79997C9.25269 3.99634 8.98871 4.05353 8.7767 3.94745L8.69997 3.89997L4.99997 1.12597L1.29997 3.89997C1.07906 4.06566 0.765656 4.02088 0.599971 3.79997ZM0.599971 7.79997C0.452695 7.6036 0.471705 7.33416 0.632903 7.16034L0.69997 7.09997L4.69997 4.09997C4.85235 3.98569 5.05371 3.96936 5.22009 4.05099L5.29997 4.09997L9.29997 7.09997C9.52088 7.26566 9.56566 7.57906 9.39997 7.79997C9.25269 7.99634 8.98871 8.05353 8.7767 7.94745L8.69997 7.89997L4.99997 5.12497L1.29997 7.89997C1.07906 8.06566 0.765656 8.02088 0.599971 7.79997Z" fill="#005BF5"/>
                            </svg>
                        </button>
                    </div>
                    <button class="track123_blank_btn toggle_additional_text" @click="toggleAdditionalText">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L5 5M5 5L9 9M5 5L9 1M5 5L1 9" stroke="#0B1019" stroke-opacity="0.45" stroke-width="1.33333" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="track123_form_container">
                <div class="track123_form_title">{{ translation.order_lookup_section.track_your_order }}</div>
                <div v-if="isOrderNumberAndEmailAndTrackingNumber" class="track123_tab_container">
                    <button :class="['track123_tab_bar', {'track123_tab_active_bar':showTab == 1}]" @click="showTab = 1">{{ translation.order_lookup_section.order_number }}</button>
                    <button :class="['track123_tab_bar', {'track123_tab_active_bar':showTab == 2}]" @click="showTab = 2">{{ translation.order_lookup_section.tracking_number }}</button>
                </div>
                <div class="track123_input_container">
                    <div v-if="showOrderNumber" class="track123_input_content">
                        <input :class="['track123_form_field', {'track123_form_field_error': showOrderError}, {'track123_input_disable_field': showLoading}]" 
                            :placeholder="translation.order_lookup_section.order_number" 
                            v-model="formParams.order_or_number" 
                            :readonly="showLoading ? 'readonly' : false"/>
                        <div :class="['track123_form_error', {'track123_form_error_show': showOrderError}]">
                            {{ translation.order_lookup_section.order_number_error }}
                        </div>
                    </div>
                    <div v-if="showEmailOrPhone" class="track123_input_content">
                        <input :class="['track123_form_field', {'track123_form_field_error': showEmailError}, {'track123_input_disable_field': showLoading}]" 
                            :placeholder="translation.order_lookup_section.email" 
                            v-model="formParams.email" 
                            :readonly="showLoading ? 'readonly' : false"/>
                        <div :class="['track123_form_error', {'track123_form_error_show': showEmailError}]">
                            {{ translation.order_lookup_section.email_error }}
                        </div>
                    </div>
                    <div v-if="showTrackingNumber" class="track123_input_content">
                        <input :class="['track123_form_field', {'track123_form_field_error': showTrackingNoError}, {'track123_input_disable_field': showLoading}]" 
                            :placeholder="translation.order_lookup_section.tracking_number" 
                            v-model="formParams.tracking_no" 
                            :readonly="showLoading ? 'readonly' : false"/>
                        <div :class="['track123_form_error', {'track123_form_error_show': showTrackingNoError}]">
                            {{ translation.order_lookup_section.tracking_number_error }}
                        </div>
                    </div>
                    <div v-if="showTrackingNoOrOrderNumber" class="track123_input_content">
                        <input :class="['track123_form_field', {'track123_form_field_error': showTrackingNoError}, {'track123_input_disable_field': showLoading}]" 
                            :placeholder="translation.order_lookup_section.order_number_or_tracking_number" 
                            v-model="formParams.tracking_no_or_order_number" 
                            :readonly="showLoading ? 'readonly' : false"/>
                        <div :class="['track123_form_error', {'track123_form_error_show': showTrackingNoOrOrderNumberError}]">
                            {{ translation.order_lookup_section.number_error }}
                    </div>
                </div>
                </div>
                <button class="track123_form_button" :style="{ opacity: showLoading ? 0.6 : 1 }" @click="submit(submitType)">
                    <div v-if="showLoading" class="track123_form_loading">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1" stroke="white" stroke-opacity="0.95" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div>{{ translation.order_lookup_section.track }}</div>
                </button>
                <div v-if="showErrorText" class="track123_no_data_tips">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5ZM8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#DF3148"/>
                        <path d="M8 9.8C7.73 9.8 7.55 9.62 7.46 9.35L7.1 4.49C7.1 3.95 7.46 3.5 8 3.5C8.45 3.5 8.9 3.86 8.9 4.4L8.54 9.35C8.45 9.62 8.27 9.8 8 9.8ZM7.1 11.6C7.1 11.06 7.46 10.7 8 10.7C8.54 10.7 8.9 11.06 8.9 11.6C8.9 12.14 8.54 12.5 8 12.5C7.46 12.5 7.1 12.14 7.1 11.6Z" fill="#DF3148"/>
                    </svg>
                    <div class="tips">{{ translation.shipping_details.no_tracking_info_text }}</div>
                </div>
                <img v-if="!isPhone && showPowerBy" class="track123_poweredBy" :src="poweredByImg" @click="openPoweredByLink" />
            </div>
        </div>
	`,
    data() {
        return {
            showPhoneMore: false,
            showTextAboveMore: false
        }
    },
    computed: {
        submitType() {
            let type = 1;
            if ((!this.isOrderNumberAndEmailAndTrackingNumber 
                && this.configure_options.lookup_options_by_order_number_and_email 
                && this.configure_options.require_email_or_phone_number
                && !this.configure_options.lookup_options_by_tracking_number) || 
                (this.isOrderNumberAndEmailAndTrackingNumber && this.showTab == 1)) {
                type = 1
            } else if ((!this.isOrderNumberAndEmailAndTrackingNumber && 
                !this.configure_options.lookup_options_by_order_number_and_email
                && this.configure_options.lookup_options_by_tracking_number) || 
                (this.isOrderNumberAndEmailAndTrackingNumber && this.showTab == 2)) {
                type = 2
            } else if (this.configure_options.lookup_options_by_order_number_and_email 
                && !this.configure_options.require_email_or_phone_number
                && !this.configure_options.lookup_options_by_tracking_number) {
                type = 3
            } else if (this.configure_options.lookup_options_by_order_number_and_email 
                && !this.configure_options.require_email_or_phone_number
                && this.configure_options.lookup_options_by_tracking_number) {
                type = 4
            }
            return type;
        },
        showOrderNumber() {
            return (
                (!this.isOrderNumberAndEmailAndTrackingNumber && this.configure_options.lookup_options_by_order_number_and_email && !this.configure_options.lookup_options_by_tracking_number) 
                || (this.isOrderNumberAndEmailAndTrackingNumber && this.showTab == 1)
            ) 
        },
        showEmailOrPhone() {
            return (
                (!this.isOrderNumberAndEmailAndTrackingNumber && this.configure_options.lookup_options_by_order_number_and_email && this.configure_options.require_email_or_phone_number && !this.configure_options.lookup_options_by_tracking_number) 
                || (this.isOrderNumberAndEmailAndTrackingNumber && this.showTab == 1)
            )
        },
        showTrackingNumber() {
            return (
                (!this.isOrderNumberAndEmailAndTrackingNumber && this.configure_options.lookup_options_by_tracking_number && !this.configure_options.lookup_options_by_order_number_and_email) 
                || (this.isOrderNumberAndEmailAndTrackingNumber && this.showTab == 2)
            )
        },
        showTrackingNoOrOrderNumber() {
            return (!this.isOrderNumberAndEmailAndTrackingNumber && this.configure_options.lookup_options_by_tracking_number && this.configure_options.lookup_options_by_order_number_and_email && !this.configure_options.require_email_or_phone_number) 
        },
        poweredByImg() {
            return `${this.baseUrl}/tracking-page/modern/img/poweredBy.png`
        },
        poweredByMobileImg() {
            return `${this.baseUrl}/tracking-page/modern/img/poweredBy_mobile.png`
        }
    },
    methods: {
        toggleAdditionalText() {
            if (window.hasOwnProperty('showAdditionalText')) {
                window.showAdditionalText = !window.showAdditionalText;
                this.$forceUpdate()
            };
        }
    },
    mounted () {      
        const textAboveDom = document.getElementById('textAbove')
        if (this.isPhone && textAboveDom && textAboveDom.clientHeight > 64) { this.showPhoneMore = true }
    },
}

window.trackModernForm = trackForm