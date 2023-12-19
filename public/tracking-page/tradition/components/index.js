const track123 = {
	props: ['config'],
	template: `
        <div id="track123_track_wrapper" class="track123_track_wrapper track123_track_content">
            <div v-html="config.css_and_html.html_top_of_page"></div>
            <track-form 
                :config="config"
                @getOrderDetail="getOrderDetail"
                @getProductRecommendations="getProductRecommendations" />
            <div v-if="orderDetail">
                <track-order-detail
                    :config="config" 
                    :orderDetail="orderDetail"
                    :productRecommendations="productRecommendationList" />
            </div>
            <div v-html="config.css_and_html.html_bottom_of_page"></div>
        </div>
	`,
    data() {
		return {
            orderDetail: null,              // 订单详情
            productRecommendationList: null,   // 产品推荐详情
        }
    },
    methods: {
        getOrderDetail(data) {
            this.orderDetail = data
        },
        getProductRecommendations(data) {
            this.productRecommendationList = data
        }
    },
}

window.trackMain = track123
