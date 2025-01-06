<template>
  <view class="in-store-service">
    <!-- 顶部导航栏 -->
    <NavBar
      ref="navBarRef"
      :nav-color="isNavBarFixed ? '#ffd4d3' : '#fff'"
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
              <text
                v-else-if="permission === LocationPermissionStatus.GRANTED"
                class="location-name"
                @click="goToSelectPositionCityPage"
              >
                {{
                  isFromSelectPositionCityPage
                    ? locationInfo.cityName
                    : locationInfo.address
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
          <view
            class="in-store-service__search-bar-back"
            @click="goToSearchPage"
          >
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

    <!-- <view
      v-if="locationPermissionStatus.denied"
      class="location-fail"
    >
      <view class="location-desc">
        打开位置权限，查看附近的内容
      </view>
      <view
        class="location-button"
        @click="goToLocationPermissionSet"
      >
        开启
      </view>
    </view> -->

    <!-- 搜索框，滚动时隐藏 -->
    <view v-show="!isNavBarFixed" class="in-store-service__search-box">
      <SearchBar />
    </view>

    <!-- 网络异常 -->
    <!-- <NoData
      v-if="isOffline"
      :style="{ height: `calc(100vh - ${navHeight})` }"
      no-data-text="网络不给力"
      :is-show-more="false"
      img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
    /> -->

    <view v-if="permission === LocationPermissionStatus.FETCHING">
      获取权限中....
    </view>

    <MyNoData
      v-if="permission === LocationPermissionStatus.DENIED"
      :style="{ height: `calc(100vh - ${navHeight})` }"
      no-data-text="未开启定位，无法为您解锁宠胖胖门店服务"
      img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
    >
      <template #button>
        <button @click="goToLocationPermissionSet">立即开启</button>
      </template>
    </MyNoData>

    <!-- 内容区 -->
    <view v-else-if="permission === LocationPermissionStatus.GRANTED">
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
        <NavigationArea v-if="navigationList.length" :list="navigationList" />
        <!-- 券码区，展示优惠券 -->
        <CouponArea v-if="couponList.length" :list="couponList" />
        <!-- 组件区，展示组件 -->
        <ComponentArea v-if="componentList.length" :list="componentList" />
        <!-- 资源区，展示资源 -->
        <ResourceList
          v-if="resourceList.length"
          :list="resourceList"
          :location="locationInfo"
        />
        <!-- Feeds 组件 -->
        <ProductFeeds ref="productFeedsRef" :location-info="locationInfo" />

        <!-- 回到顶部按钮，滚动到一定位置时显示 -->
        <BackToTop v-show="showBackToTop" ref="backToTop" @click="scrollToTop">
          <template #icon>
            <!-- <u-icon name="arrow-upward" /> -->
            <view class="icon iconfont icon-BackTop" />
          </template>
        </BackToTop>
      </scroll-view>

      <MyNoData
        v-else-if="shopByCityList.fetched && shopByCityList.data.length === 0"
        :style="{ height: `calc(100vh - ${navHeight})` }"
        no-data-text="当前城市未开启服务"
        img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
      >
        <template #button>
          <button @click="handleShowPopup">选择其他城市</button>
        </template>
      </MyNoData>

      <u-popup
        :show="isShowPopup"
        mode="bottom"
        :round="20"
        closeable
        @close="handleClosePopup"
        @touchmove.stop.prevent
      >
        <view class="popup-box">
          <view class="popup-title"> 选择城市 </view>
          <view class="popup-info">
            <text>当前所在城市暂未开设宠胖胖门店，已自动为您匹配最近城市</text>
            <view class="iconfont icon-a-iconlineCity" />
            <text v-if="cityList.length > 0" class="city-name">
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
import NoData from '@/components/noData/index.vue'
import ProductFeeds from './ProductFeeds.vue'
import MyNoData from './NoData.vue'

// 引入 API 接口
import {
  fetchResourceAPI,
  fetchCouponListAPI,
  fetchComponentListAPI,
  fetchNavigationAPI,
  fetchShopByCityAPI,
  fetchHasShopCityListAPI,
} from './api/mockAPI'

// 引入 MOCK APP 接口
import mockAPP from './api/mockAPP'

// 引入 API 接口
// import {
//   fetchResourceAPI,
//   fetchCouponListAPI,
//   fetchComponentListAPI,
//   fetchNavigationAPI,
//   fetchShopByCityAPI,
// } from './api/inStoreService'

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
    NoData,
    ProductFeeds,
    MyNoData,
  },

  data() {
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
      permission: LocationPermissionStatus.UNDETERMINED,
      // 定位信息
      locationInfo: {
        address: '',
        cityCode: '',
        cityName: '',
        lon: '0.0',
        lat: '0.0',
        province: '',
        provinceCode: '',
        country: '',
        countryCode: '',
      },
      isFromSelectPositionCityPage: false,
      isTriggered: false,
      isShowPopup: false,
      cityList: [],
    }
  },

  async onLoad(options) {
    // // 获取网络状态
    // this.checkNetworkStatus()
    // // 如果网络状态是离线，直接返回
    // if (this.isOffline) return

    this.$dsBridge = mockAPP

    // MOCK 选择城市
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

    // 如果页面是选择城市跳转逻辑
    if (options.params) {
      this.isFromSelectPositionCityPage = true
      // 不需要获取定位状态，状态由选择城市页面提供，已定位
      this.permission = LocationPermissionStatus.GRANTED
      try {
        const locationInfo = JSON.parse(options.params)
        this.locationInfo = { ...this.locationInfo, ...locationInfo }
      } catch (error) {
        console.log('🚀 ~ onLoad ~ error:', error)
      }
      // 写死经纬度，获取门店信息
      this.locationInfo.lat = '30.25'
      this.locationInfo.lon = '120.21'
      // 获取当前城市门店信息
      this.fetchShopByCityData()
      return
    }

    // 从首页进入逻辑
    // 获取定位权限
    this.checkLocationPermission()
  },

  onShow() {
    // 获取购物车数量
    this.$refs?.cartButtonRef?.getCartNum()
  },

  mounted() {
    // 获取导航栏高度
    this.navHeight = this.$refs?.navBarRef?.navHeight
  },

  methods: {
    handleClosePopup() {
      this.isShowPopup = false
    },
    handleChangeCity(city) {
      console.log('🚀 ~ handleChangeCity ~ city:', city)
      this.locationInfo.cityCode = city.cityCode
      this.locationInfo.cityName = city.cityName
      // 回显城市
      this.isFromSelectPositionCityPage = true
      // 不需要获取定位状态，状态由选择城市页面提供，已定位
      this.permission = LocationPermissionStatus.GRANTED
      // 写死经纬度，获取门店信息
      this.locationInfo.lat = '30.25'
      this.locationInfo.lon = '120.21'
      this.isShowPopup = false
      // 获取当前城市门店信息
      this.fetchShopByCityData()
    },
    handleShowPopup() {
      this.isShowPopup = true
    },
    async handleRefresherrefresh() {
      this.isTriggered = true
      this.$refs.productFeedsRef.reset()
      await Promise.all([
        this.fetchNavigationData(),
        this.fetchCouponListData(),
        this.fetchComponentListData(),
        this.fetchResourceData(),
        // TODO: 获取商品列表数据
        this.$refs.productFeedsRef.fetchProductListData(),
      ])
      this.isTriggered = false
    },
    handleScrollToLower() {
      this.$refs.productFeedsRef.fetchProductListData()
    },
    // 返回上一页
    goToPreviousPage() {
      this.$dsBridge.call('closeCurrentWebview', {}) // 关闭 webview
    },
    goToSearchPage() {
      this.$dsBridge.call('gotoPageThroughRoute', {
        page: '/home/search?scene=5&keyword=',
      })
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
    // 检查定位权限
    checkLocationPermission() {
      // 正在获取定位权限状态
      this.permission = LocationPermissionStatus.FETCHING
      // 获取定位权限状态 异步 返回！
      this.$dsBridge.call(
        'checkLocationPermission',
        'checkLocationPermission',
        (data) => {
          // 获取定位权限状态成功
          try {
            const hasLocationPermission = JSON.parse(data)
            if (hasLocationPermission) {
              // 已授权
              this.permission = LocationPermissionStatus.GRANTED
              // 定位操作往往需要一定的时间
              // H5 通知 App 开始定位，App 在后台进行定位操作。
              this.$dsBridge.call('startOnceLocation', 'startOnceLocation')
              // 定位完成后，App 会通过回调将结果返回 H5。
              this.$dsBridge.register('locationCallback', this.getLocationInfo)
            } else {
              // 没权限，直接展示开启定位页面
              this.permission = LocationPermissionStatus.DENIED
            }
          } catch (error) {
            console.log('🚀 ~ checkLocationPermission ~ error:', error)
          }
        }
      )
    },
    // 跳转定位APP权限设置逻辑
    goToLocationPermissionSet() {
      this.$dsBridge.call(
        'gotoLocationPermissionSet',
        'gotoLocationPermissionSet'
      )
      // 设置完怎么做？
      this.afterLocationPermissionSet()
      // this.$dsBridge.register('locationCallback', this.afterLocationPermissionSet)
    },
    afterLocationPermissionSet() {
      // 再次发起定位
      this.checkLocationPermission()
      // 处理用户拒绝授权的情况
      // if (data) {
      //   // 用户已经授权
      //   this.permission = LocationPermissionStatus.GRANTED
      //   this.getLocationInfo(data)
      // } else {
      //   // 用户拒绝授权
      //   this.permission = LocationPermissionStatus.DENIED
      //   // TODO
      // }
    },
    goToSelectPositionCityPage() {
      uni.navigateTo({
        url: '/pagesD/selectPositionCity/index?urlType=1',
      })
    },
    getLocationInfo(data) {
      console.log('🚀 ~ getLocationInfo ~ data:', data)
      try {
        if (!data) {
          // TODO: 这里需要处理下，如果获取不到定位信息，需要提示用户
          console.error(
            'Error: Data is empty or undefined. Please check network connectivity.'
          )
          return
        }
        this.locationInfo = data
        // 获取当前城市门店信息
        this.fetchShopByCityData()
      } catch (error) {
        console.log('🚀 ~ getLocationInfo ~ error:', error)
      }
    },
    async fetchHasShopCityListData() {
      const { lon: lng, lat } = this.locationInfo
      const resp = await fetchHasShopCityListAPI({
        bizType: 3,
        lng,
        lat,
      })
      this.cityList = resp.data.data || []
    },
    // 获取资源区数据
    // TODO: 这块请求需要和后端沟通处理下
    async fetchResourceData() {
      const { cityCode, lon: lng, lat } = this.locationInfo
      const resp = await fetchResourceAPI({
        cityCode,
        lng,
        lat,
        fromChannel: 'APP',
      })
      this.resourceList = resp.data.data.resourceList || []
    },
    // 获取优惠券数据
    async fetchCouponListData() {
      // TODO: 去除测试用户 ID
      const userId =
        this.$dsBridge.call('getUserId', 'getUserId') || '401211901598814208'
      const resp = await fetchCouponListAPI({
        userId,
        status: 5,
      })
      this.couponList = resp.data.data || []
    },
    // 获取组件区数据
    async fetchComponentListData() {
      const resp = await fetchComponentListAPI()
      this.componentList = resp.data.data || []
    },
    // 获取金刚区数据
    async fetchNavigationData() {
      const resp = await fetchNavigationAPI()
      this.navigationList = resp.data.data || []
    },
    // 获取城市门店数据
    async fetchShopByCityData() {
      this.shopByCityList.fetched = false
      const { cityCode } = this.locationInfo
      const resp = await fetchShopByCityAPI({
        cityCode: cityCode.slice(0, 4),
        bizType: 3,
      })
      this.shopByCityList.fetched = true
      // this.shopByCityList.data = resp.data.data || []
      // TODO: 修改
      this.shopByCityList.data = []
      // 根据返回值处理门店信息
      if (this.shopByCityList.data.length === 0) {
        // 如果门店信息为空，展示无门店逻辑
        if (!this.cityList.length) this.fetchHasShopCityListData()
        return
      }
      // 如果门店信息不为空，开始处理页面其他逻辑
      await Promise.allSettled([
        this.fetchNavigationData(),
        this.fetchCouponListData(),
        this.fetchComponentListData(),
        this.fetchResourceData(),
      ])
    },

    // 滚动事件处理
    onScroll(event) {
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
    scrollToTop() {
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
  position: relative;
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
