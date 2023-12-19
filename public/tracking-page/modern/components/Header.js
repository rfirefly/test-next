const trackHeader = {
    props: ['config'],
	template: `
        <div :class="['track123_header_wrapper', {'without_logo': !config.store_logo_url}]">
            <div v-if="config.store_logo_url" class="logo_box">
                <a href="/"><img class="logo_img" :src="config.store_logo_url" /></a>
            </div>
            <a v-else-if="config.store_name" class="store-name" href="/">{{ config.store_name }}</a>
        </div>
	`,
    computed: {
        text_above() {
            return this.config.additional_text.text_above
        },
    },
    methods: {
        toggleAdditionalText() {
            if (window.hasOwnProperty('showAdditionalText')) {
                window.showAdditionalText = !window.showAdditionalText;
                this.$forceUpdate()
            };
        }
    },
}

window.trackModernHeader = trackHeader
