<template>
  <view class="in-store-service">
    <!-- 顶部导航栏 -->
    <NavBar
      ref="navBarRef"
      :nav-color="isNavBarFixed ? '#f7f8fc' : '#fff'"
      show-back-btn
      :white-back="false"
      customback
      @navBackClickHandle="goToPreviousPage"
    >
      <template #righticon>
        <view class="in-store-service__nav-bar-content">
          <view class="location-container">
            <view class="cur-location">
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/loaction-icon.png"
                style="width: 40rpx; height: 40rpx"
              />
              <text
                v-if="permission === LocationPermissionStatus.FETCHING"
                class="location-name"
              >
                正在获取定位
              </text>
              <!-- 手动选择城市和有定位权限并且定位完成或者从手动选择城市页面都可以回显内容 -->
              <text
                v-else-if="
                  permission === LocationPermissionStatus.GRANTED ||
                    isShowCityInNavBar
                "
                class="location-name"
                @click="goToSelectPositionCityPage"
              >
                {{
                  isShowCityInNavBar ? cityInfo.cityName : locationInfo.address
                }}
              </text>
              <text
                v-else-if="permission === LocationPermissionStatus.DENIED"
                class="location-name"
                @click="goToSelectPositionCityPage"
              >
                定位失败，可手动切换地址
              </text>
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/bottom-arrow.png"
                style="width: 20rpx; height: 20rpx"
              />
            </view>
          </view>
          <view class="in-store-service__search-bar-back">
            <!-- 根据滚动状态显示或隐藏搜索图标 -->
            <view
              v-if="isNavBarFixed || isSearchIconVisible"
              class="input-btn iconfont icon-search in-store-service__search-icon"
              name="search"
              :class="{
                'in-store-service__search-icon--visible': isNavBarFixed,
                'in-store-service__search-icon--hidden': !isNavBarFixed,
              }"
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/header-search.png"
              mode="widthFix"
              @click="goToSearchPage"
            />
            <CartButton ref="cartButtonRef" />
          </view>
        </view>
      </template>
    </NavBar>

    <!-- 搜索框，滚动时隐藏 -->
    <view
      v-show="!isNavBarFixed"
      class="in-store-service__search-box"
    >
      <SearchBar ref="searchBarRef" />
    </view>

    <!-- 网络异常 -->
    <!-- <NoData
      v-if="isOffline"
      :style="{ height: `calc(100vh - ${navHeight})` }"
      no-data-text="网络不给力"
      :is-show-more="false"
      img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
    /> -->

    <NoData
      v-if="
        permission === LocationPermissionStatus.DENIED && !isShowCityInNavBar
      "
      :style="{ height: `calc(100vh - ${navHeight})` }"
      no-data-text="未开启定位，无法为您解锁宠胖胖门店服务"
      img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
    >
      <template #button>
        <button
          class="slot-button"
          @click="goToLocationPermissionSet"
        >
          立即开启
        </button>
      </template>
    </NoData>

    <!-- 内容区 -->
    <view
      v-else-if="
        permission === LocationPermissionStatus.GRANTED || isShowCityInNavBar
      "
    >
      <scroll-view
        v-if="shopByCityList.fetched && shopByCityList.data.length"
        scroll-y
        :scroll-top="scrollTop"
        class="in-store-service__scroll-view"
        :style="{ height: `calc(100vh - ${navHeight})` }"
        refresher-enabled
        :refresher-triggered="isTriggered"
        @scroll="onScroll"
        @scrolltolower="handleScrollToLower"
        @refresherrefresh="handleRefresherrefresh"
      >
        <!-- 金刚区，展示导航项 -->
        <NavigationArea
          v-if="navigationList.length"
          :list="navigationList"
        />
        <!-- 券码区，展示优惠券 -->
        <CouponArea
          v-if="couponList.length"
          :list="couponList"
        />
        <!-- 组件区，展示组件 -->
        <ComponentArea
          v-if="componentList.length"
          :list="componentList"
        />
        <!-- 资源区，展示资源 -->
        <ResourceList
          v-if="resourceList.length"
          :list="resourceList"
          :location="isShowCityInNavBar ? cityInfo : locationInfo"
        />
        <!-- Feeds 组件 -->
        <ProductFeeds
          ref="productFeedsRef"
          :is-city="isShowCityInNavBar"
          :location="isShowCityInNavBar ? cityInfo : locationInfo"
        />

        <!-- 回到顶部按钮，滚动到一定位置时显示 -->
        <BackToTop
          v-show="showBackToTop"
          ref="backToTop"
          @click="scrollToTop"
        >
          <template #icon>
            <view class="icon iconfont icon-BackTop" />
          </template>
        </BackToTop>
      </scroll-view>

      <NoData
        v-else-if="shopByCityList.fetched && shopByCityList.data.length === 0"
        :style="{ height: `calc(100vh - ${navHeight})` }"
        no-data-text="当前城市未开启服务"
        img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
      >
        <template #button>
          <button
            class="slot-button"
            @click="handleShowPopup"
          >
            选择其他城市
          </button>
        </template>
      </NoData>

      <u-popup
        :show="isShowCityPopup"
        mode="bottom"
        :round="20"
        closeable
        @close="handleClosePopup"
        @touchmove.stop.prevent
      >
        <view class="popup-box">
          <view class="popup-title">
            选择城市
          </view>
          <view class="popup-info">
            <text>当前所在城市暂未开设宠胖胖门店，已自动为您匹配最近城市</text>
            <view class="iconfont icon-a-iconlineCity" />
            <text
              v-if="cityList.length > 0"
              class="city-name"
            >
              {{ cityList[0].cityName }}
            </text>
            <text>，您可点击“切换城市”按钮进行目标城市修改</text>
          </view>

          <view class="popup-footer">
            <view
              class="foot-btn toggle-btn"
              @click="goToSelectPositionCityPage"
            >
              切换城市
            </view>
            <view
              v-if="cityList.length > 0"
              class="foot-btn select-btn"
              @click="handleChangeCity(cityList[0])"
            >
              选择{{ cityList[0].cityName }}
            </view>
          </view>
        </view>
      </u-popup>
    </view>
  </view>
</template>

<script>
import BackToTop from './BackToTop.vue'
import ResourceList from './ResourceList.vue'
import CouponArea from './CouponArea.vue'
import ComponentArea from './ComponentArea.vue'
import NavigationArea from './NavigationArea.vue'
import CartButton from './CartButton.vue'
import SearchBar from './SearchBar.vue'
import NavBar from '@/components/navBar/index.vue'
import ProductFeeds from './ProductFeeds.vue'
import NoData from './NoData.vue'

// 引入 API 接口
// import {
//   fetchResourceAPI,
//   fetchCouponListAPI,
//   fetchComponentListAPI,
//   fetchNavigationAPI,
//   fetchShopByCityAPI,
//   fetchHasShopCityListAPI,
// } from './api/mockAPI'

// 引入 MOCK APP 接口
// #ifdef MP-WEIXIN
import mockAPP from './api/mockAPP'
// #endif

// 引入 API 接口
import {
  fetchResourceAPI,
  fetchCouponListAPI,
  fetchComponentListAPI,
  fetchNavigationAPI,
  fetchShopByCityAPI,
  fetchHasShopCityListAPI,
} from './api/inStoreService'

import { LocationPermissionStatus } from './constants/LocationPermission'

export default {
  name: 'InStoreService',
  components: {
    BackToTop,
    ResourceList,
    CouponArea,
    ComponentArea,
    NavigationArea,
    CartButton,
    SearchBar,
    NavBar,
    ProductFeeds,
    NoData,
  },

  data () {
    return {
      // 是否在线
      // isOffline: false,
      // 导航栏高度
      navHeight: 0,
      // 滚动条位置
      scrollTop: 0,
      oldScrollTop: 0,
      // 是否显示回到顶部按钮
      showBackToTop: false,
      isNavBarFixed: false,
      // 搜索图标是否可见 (默认不可见)
      isSearchIconVisible: false,
      // 资源区数据
      resourceList: [],
      // 优惠券数据
      couponList: [],
      // 组件区数据
      componentList: [],
      // 金刚区数据
      navigationList: [],
      // 门店信息
      shopByCityList: {
        fetched: false,
        data: [],
      },
      // 定位相关逻辑
      // 是否有定位权限
      LocationPermissionStatus,
      permission: LocationPermissionStatus.DENIED,
      // 是否显示城市名称
      isShowCityInNavBar: false,
      // 是否显示城市选择弹窗
      isShowCityPopup: false,
      cityList: [],
      // 定位信息
      locationInfo: {
        address: '',
        cityCode: '',
        cityName: '',
        lon: '',
        lat: '',
        province: '',
        provinceCode: '',
        county: '',
        countyCode: '',
      },
      cityInfo: {
        cityCode: '',
        cityName: '',
        address: '',
        lon: '',
        lat: '',
      },
      isTriggered: false,
      useId: '',
    }
  },

  mounted () {
    // 获取导航栏高度计算滚动高度
    this.navHeight = this.$refs?.navBarRef?.navHeight
  },

  // 注册定位回调
  onReady () {
    this.$dsBridge.register('locationCallback', this.finishLocationCallback)
  },

  async onShow () {
    console.log('🚀 ~ onShow ~ onShow:', '到店服务 onShow 触发了')

    // 如果导航栏不显示城市名称，则去检查定位权限
    !this.isShowCityInNavBar && this.goToCheckLocationPermission()
    // 获取购物车数量
    this.$refs?.cartButtonRef?.getCartNum()
  },
  async onLoad (options) {
    console.log('🚀 ~ onLoad ~ onLoad:', '到店服务 onLoad 触发了')
    // // 获取网络状态
    // this.checkNetworkStatus()
    // // 如果网络状态是离线，直接返回
    // if (this.isOffline) return

    // #ifdef MP-WEIXIN
    // 开发环境 MOCK APP 接口
    this.$dsBridge = mockAPP
    // #endif

    // MOCK 选择城市传递的数据
    // const params = JSON.stringify({
    //   province: '',
    //   cityName: '南京市',
    //   address: '',
    //   cityCode: '3302',
    //   county: '',
    //   lat: '', // 纬度
    //   lon: '', // 经度
    // })
    // options.params = params

    // 处理从选择城市页面跳转过来的逻辑
    if (options.params) {
      try {
        const params = JSON.parse(options.params)
        console.log('🚀 ~ onLoad ~ params:', params)
        // 加一层判断是否是重新定位还是选择城市
        if (params.lat) {
          // 重新定位：更新定位信息，并根据定位信息获取门店数据
          this.isShowCityInNavBar = false
          this.locationInfo = { ...this.locationInfo, ...params }
          console.log('🚀 ~ onLoad ~ this.locationInfo :', this.locationInfo)
          this.fetchShopByCityData(this.locationInfo)
          return
        }

        // 选择城市：更新城市信息，并根据城市信息获取门店数据
        this.isShowCityInNavBar = true
        this.cityInfo = { ...this.cityInfo, ...params }
        console.log('🚀 ~ onLoad ~ this.cityInfo:', this.cityInfo)
        this.fetchShopByCityData(this.cityInfo)
      } catch (error) {
        console.log('🚀 ~ onLoad ~ error:', error)
      }
    }
  },

  methods: {
    // 关闭城市选择弹窗
    handleClosePopup () {
      this.isShowCityPopup = false
    },
    // 显示城市选择弹窗
    handleShowPopup () {
      this.isShowCityPopup = true
    },
    handleChangeCity (city) {
      this.isShowCityInNavBar = true
      this.cityInfo.cityCode = city.cityCode
      this.cityInfo.cityName = city.cityName
      console.log('🚀 ~ handleChangeCity ~ cityInfo:', this.cityInfo)
      this.isShowCityPopup = false
      // 获取当前城市门店信息
      this.fetchShopByCityData(this.cityInfo)
    },
    // 校验网络状态
    // checkNetworkStatus () {
    //   uni.getNetworkType({
    //     success: (res) => {
    //       console.log(`当前网络类型: ${res.networkType}`)
    //       if (res.networkType === 'none') {
    //         uni.showToast({
    //           title: '无网络连接，请检查网络设置',
    //           icon: 'none',
    //         })
    //         this.isOffline = true
    //       }
    //     },
    //   })
    // },

    // 定位相关逻辑
    // 检查定位权限
    goToCheckLocationPermission () {
      // if (!this.$dsBridge.hasNativeMethod('checkLocationPermission')) {
      //   return
      // }
      // 正在获取定位权限状态
      this.permission = LocationPermissionStatus.FETCHING
      this.$dsBridge.call(
        'checkLocationPermission',
        'checkLocationPermission',
        this.afterCheckLocationPermission
      )
    },
    // 获取定位权限状态回调，这是个异步的回调，要注意时序问题
    afterCheckLocationPermission (data) {
      try {
        const hasLocationPermission = JSON.parse(data)
        if (hasLocationPermission) {
          // 已授权
          this.permission = LocationPermissionStatus.GRANTED
          // H5 通知 App 开始定位，App 在后台进行定位操作。
          this.$dsBridge.call('startOnceLocation', 'startOnceLocation')
          // this.$dsBridge.register('locationCallback', this.finishLocationCallback)
          // 定位操作往往需要一定的时间，定位完成后，App 会通过回调将结果返回 H5。
          // 回调已在 onReady 中注册
        } else {
          // 没权限，直接展示开启定位页面
          this.permission = LocationPermissionStatus.DENIED
        }
      } catch (error) {
        console.log('🚀 ~ checkLocationPermission ~ error:', error)
      }
    },
    // 获取定位权限状态回调
    finishLocationCallback (data) {
      console.log('🚀 ~ finishLocationCallback ~ data:', data)
      if (!data) {
        // TODO: 这里需要处理下，如果获取不到定位信息，需要提示用户
        console.error(
          'Error: Data is empty or undefined. Please check network connectivity.'
        )
        return
      }
      // 更新定位信息
      this.locationInfo = data
      this.fetchShopByCityData(this.locationInfo)
    },
    // 跳转定位 APP 权限设置逻辑
    goToLocationPermissionSet () {
      this.$dsBridge.call(
        'gotoLocationPermissionSet',
        'gotoLocationPermissionSet'
      )
    },
    // 获取城市门店数据
    async fetchShopByCityData (info) {
      this.shopByCityList.fetched = false
      // 由于获取城市门店有两种情况，一种已定位，一种选择城市
      const { cityCode } = info
      const resp = await fetchShopByCityAPI({
        // 根据城市代码获取门店列表，cityCode 需要截取前四位
        cityCode: cityCode.slice(0, 4),
        bizType: 3,
      })
      this.shopByCityList.fetched = true
      this.shopByCityList.data = resp.data.data || []

      // 根据门店数据处理页面逻辑
      if (this.shopByCityList.data.length === 0) {
        // 无门店：展示无门店页面，并弹出选择城市弹窗
        // 同时获取有门店的城市列表
        this.fetchHasShopCityListData()
        return
      }

      // 有门店：并行获取页面其他数据
      await Promise.allSettled([
        this.fetchNavigationData(),
        this.fetchCouponListData(),
        this.fetchComponentListData(),
        this.fetchResourceData(info),
      ])
    },
    // 获取资源区数据
    async fetchResourceData (info) {
      const { cityCode, lon: lng, lat } = info
      const resp = await fetchResourceAPI({
        cityCode,
        lng: lng ? lng : undefined,
        lat: lat ? lat : undefined,
        fromChannel: 'APP',
      })
      this.resourceList = resp.data.data.resourceList || []
    },
    // 获取优惠券数据
    async fetchCouponListData () {
      // 获取用户 ID，如果没有则使用默认测试 ID
      const userId =
        this.$dsBridge.call('getUserId', 'getUserId') || '401211901598814208'
      const resp = await fetchCouponListAPI({
        userId,
        status: 5,
      })
      this.couponList = resp.data.data || []
    },
    // 获取组件区数据
    async fetchComponentListData () {
      const resp = await fetchComponentListAPI()
      this.componentList = resp.data.data || []
    },
    // 获取金刚区数据
    async fetchNavigationData () {
      const resp = await fetchNavigationAPI()
      this.navigationList = resp.data.data || []
    },
    // 获取城市列表数据
    async fetchHasShopCityListData () {
      const { lon: lng, lat } = this.locationInfo
      const resp = await fetchHasShopCityListAPI({
        bizType: 3,
        lng,
        lat,
      })
      // 根据距离排序
      const cityList = resp.data.data || []
      this.cityList = cityList.sort((a, b) => a.distance - b.distance)
    },
    // 页面跳转相关方法
    // 跳转到选择城市页面
    goToSelectPositionCityPage () {
      // 根据是否在导航栏显示城市名称，传递不同的参数
      const params = this.isShowCityInNavBar ? this.cityInfo : this.locationInfo
      uni.reLaunch({
        url: `/pagesD/selectPositionCity/index?params=${JSON.stringify(
          params
        )}`,
      })
    },
    // 返回上一页
    goToPreviousPage () {
      this.$dsBridge.call('closeCurrentWebview', {}) // 关闭 webview
    },
    // 搜索页
    goToSearchPage () {
      this.$refs.searchBarRef.goToSearchPage()
    },
    // 滚动相关
    // 下拉刷新，滚动加载
    async handleRefresherrefresh () {
      this.isTriggered = true
      const info = this.isShowCityInNavBar ? this.cityInfo : this.locationInfo
      this.fetchShopByCityData(info)
      this.isTriggered = false
    },
    handleScrollToLower () {
      this.$refs.productFeedsRef.fetchProductListData()
    },
    // 搜索框隐藏与显示
    onScroll (event) {
      const { scrollTop } = event.detail

      // 判断是否显示回到顶部按钮
      this.showBackToTop = scrollTop > 750
      this.showBackToTop && this.$refs?.backToTop?.isScroll()
      // 记录滚动条位置
      this.oldScrollTop = scrollTop

      // 判断页面是否已经滚动到一定位置，从而控制导航栏的样式和搜索图标的显示。
      if (scrollTop > 70) {
        this.isNavBarFixed = true
        this.isSearchIconVisible = true
      } else {
        this.isNavBarFixed = false
        // 滚动条向上滚动时延迟显示搜索图标
        setTimeout(() => {
          if (!this.isNavBarFixed) {
            this.isSearchIconVisible = false
          }
        }, 300)
      }
    },
    // 回到顶部
    scrollToTop () {
      // 视图会发生重新渲染
      this.scrollTop = this.oldScrollTop
      // 当视图渲染结束 重新设置为 0
      this.$nextTick(() => {
        this.scrollTop = 0
      })
    },
  },
}
</script>

<style scoped lang="scss">
.in-store-service {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(to bottom, white, #f7f8fb);

  &__nav-bar-content {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 20rpx;
  }

  &__search-bar-back {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-end;
  }

  &__search-icon {
    width: 46rpx;
    height: 46rpx;
    font-size: 46rpx;
    opacity: 0;
    transition: opacity 0.3s, transform 0.3s;
    transform: scale(0.8);

    &--visible {
      opacity: 1;
      transform: scale(1);
    }

    &--hidden {
      opacity: 0;
      transform: scale(0.8);
    }
  }

  &__search-box {
    width: 96%;
    margin: 0 auto;
    padding: 20rpx 0;
  }
}

.location-container {
  // position: relative;
  display: flex;

  .cur-location {
    margin-left: 50rpx;
    margin-right: 10rpx;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;

    .location-name {
      max-width: 380rpx;
      height: 40rpx;
      font-size: 31rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #1f1f1f;
      text-indent: 10rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 38rpx;
    }
  }
}

.location-fail {
  position: relative;
  z-index: 1;
  height: 77rpx;
  font-size: 27rpx;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16rpx;
  padding-right: 25rpx;
  // margin-bottom: 20rpx;
  background-color: rgba(254, 36, 66, 1);

  .location-desc {
    color: #fff;
    display: flex;
    align-items: center;

    image {
      width: 43rpx;
      height: 43rpx;
      margin-right: 16rpx;
    }
  }

  .location-button {
    font-weight: 500;
    color: rgba(254, 36, 66, 1);
    width: 100rpx;
    height: 50rpx;
    line-height: 50rpx;
    background: #fff;
    border-radius: 25rpx;
    text-align: center;
  }
}

.slot-button {
  width: 250rpx;
  height: 85rpx;
  background: #fee900;
  border-radius: 42rpx;
  font-weight: 500;
  font-size: 31rpx;
  color: #1f1f1f;
  line-height: 85rpx;
  text-align: center;
}

.popup-box {
  height: 460rpx;

  .popup-title {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 115rpx;
    font-size: 35rpx;
    color: #1f1f1f;
  }

  .popup-info {
    margin-top: 32rpx;
    padding: 0 38rpx;
    font-size: 27rpx;
    color: #1f1f1f;

    .icon-a-iconlineCity {
      display: inline-block;
    }

    .city-name {
      font-weight: 560;
    }
  }

  .popup-footer {
    display: flex;
    justify-content: space-between;
    padding: 48rpx 38rpx 0;

    .foot-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 31rpx;
      color: #1f1f1f;
    }

    .toggle-btn {
      width: 323rpx;
      height: 85rpx;
      border-radius: 42rpx;
      border: 2rpx solid #e6e6e6;
    }

    .select-btn {
      width: 323rpx;
      height: 85rpx;
      background: #fee900;
      border-radius: 40rpx;
    }
  }
}
</style>
