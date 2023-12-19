const Loading = {
	props: ['showLoading'],
    template: `<div v-if='showLoading' class="track123_page_loading">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>`,
}

window.trackLoading = Loading
