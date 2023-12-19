const track123 = {
	props: ['config', 'trackDomain', 'trackBaseUrl', 'trackNodeEnv'],
	template: `
        <div class="track123_track_wrapper">
            <track-header 
                v-show="showHeader"
                :showTrackFrom="showTrackFrom"
                :config="config">
            </track-header>
            
            <iframe 
                id="googleIframe" 
                :src="mapUrl" 
                class="track123_map_iframe"
                frameBorder="0">
            </iframe>

            <track-form
                v-show="showTrackFrom"
                :config="config"
                :isGoSearch="isGoSearch"
                @getOrderDetail="getOrderDetail"
                @getProductRecommendations="getProductRecommendations" />
           
            <track-select-package 
                v-if="showTrackSelectPackage"
                :config="config"
                :orderDetail="orderDetail"
                @goSearch="goSearch"
                @goOrderDetail="goOrderDetail" />
            
            <track-order-detail
                v-if="showTrackOrderDetail"
                :config="config"
                :currentIndex="currentIndex"
                :orderDetail="orderDetail"
                :productRecommendations="productRecommendationList"
                @closeOrderDetail="closeOrderDetail"
                @toggleHeader="toggleHeader" />
           
            <track-product-recommendation
                v-show="!showTrackFrom"
                :orderDetail="orderDetail"
                :config="config"
                :productRecommendations="productRecommendationList" />
   
        </div>
	`,
    data() {
		return {
            showHeader: true,
            showDetail: false,                 // 展示订单详情
            showSearch: true,
            showSelectPackage: true, 
            isGoSearch: false,                 // 用于modern模式返回到搜索页，返回搜索的情况不自动触发搜索 
            currentIndex: null,
            defaultMapInfo: null,
            orderDetail: null,                 // 订单详情
            productRecommendationList: null,   // 产品推荐详情
        }
    },
    computed: {
        showTrackFrom() {
            return (!this.orderDetail && this.showSearch) || this.isGoSearch;
        },
        showTrackSelectPackage() {
            return ((this.orderDetail && 
                this.orderDetail.order_packages && 
                this.orderDetail.order_packages.length && 
                this.orderDetail.order_packages.length > 1) && 
                this.showSelectPackage);
        },
        showTrackOrderDetail() {
            return (this.currentIndex || this.currentIndex == 0)  && this.showDetail;
        },
        // 地图信息
		mapLocation() {
            if (this.orderDetail && (this.currentIndex || this.currentIndex == 0)) {
                const currentPackage = this.orderDetail.order_packages[this.currentIndex]
                const currentLocation = currentPackage && currentPackage.tracking_details && currentPackage.tracking_details.length ? currentPackage.tracking_details[0].event_location : '';
                const destinationLocation = this.orderDetail.combined_address ? this.orderDetail.combined_address : currentPackage.ship_to ? currentPackage.ship_to : '';
                const isMapCurrent = this.config.configure_options.map_coordinates === 'configure_options.map_coordinates.current_package_location'
                return isMapCurrent ? currentLocation : destinationLocation;
            }
            return null;
		},
        mapUrl() {
            // 存在经纬度，优先使用经纬度
            // google map api: https://developers.google.com/maps/documentation/embed/embedding-map?hl=en#choosing_map_modes
            if (this.orderDetail && this.orderDetail.latitude && this.orderDetail.longitude) {
                return `https://www.google.com/maps/embed/v1/view?key=AIzaSyDf5VCcikU0XbIhQtJ2mOpz6JHHND2Yggk&zoom=16&center=${this.orderDetail.latitude},${this.orderDetail.longitude}`
            } else if (this.mapLocation) {
                return `https://www.google.com/maps/embed/v1/place?key=AIzaSyDf5VCcikU0XbIhQtJ2mOpz6JHHND2Yggk&q=${this.mapLocation}`
            }
            return `https://www.google.com/maps/embed/v1/view?key=AIzaSyDf5VCcikU0XbIhQtJ2mOpz6JHHND2Yggk&zoom=2&center=37.4218,-122.0840`
        },
    },
    created () {
        window.TRACK_DOMAIN = this.trackDomain || '';
        window.TRACK_BASE_URL = this.trackBaseUrl || '';
        window.TRACK_NODE_ENV = this.trackNodeEnv || '';
        if (window && !window.hasOwnProperty('showAdditionalText')) {
            window.showAdditionalText = true;
        };
    },
    methods: {
        getOrderDetail(data) {
            this.orderDetail = data
            if (this.orderDetail &&
                this.orderDetail.order_packages &&
                this.orderDetail.order_packages.length) {
                this.showSearch = false;
                this.isGoSearch = false;
                if (this.orderDetail.order_packages.length == 1) {
                    this.showDetail = true;
                    this.currentIndex = 0;
                };
                if (this.orderDetail.order_packages.length > 1) this.showSelectPackage = true;
            }
        }, 
        getProductRecommendations(data) {
            this.productRecommendationList = data
        },
        goSearch() {
            this.showSearch = true;
            this.isGoSearch = true
            this.showSelectPackage = false;
            this.orderDetail = null;
        },
        goOrderDetail(data) {
            this.showSelectPackage = false;
            this.showDetail = true;
            this.currentIndex = data;
        },
        closeOrderDetail() {
            this.showDetail = false;
            if (this.orderDetail.order_packages.length > 1) {
                this.showSelectPackage = true;
            } else {
                this.goSearch()
            }
        },
        // 移动端，距离顶部小于40，隐藏头部栏，否则显示
        toggleHeader(data) {
            this.showHeader = data;
        },
    },
}

window.trackModernMain = track123
