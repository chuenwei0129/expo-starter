<template>
  <view class="search-bar" @click="$u.debounce(navigateToSearch, 500)">
    <view class="search-bar__input">
      <view class="search-bar__placeholder">
        <!-- <scan-code
          color="red"
          @click="gotoScan"
        /> -->
        <view class="search-bar__divider" />
        <text class="search-bar__text"> 搜你想要的宠物商品 </text>
      </view>
      <view class="search-bar__button">
        <image
          class="search-bar__icon"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/header-search.png"
          alt="Search Icon"
        />
      </view>
    </view>
  </view>
</template>

<script>
// import ScanCode from '@/components/scanCode/index.vue'

export default {
  name: 'SearchBar',
  // components: { ScanCode },
  methods: {
    navigateToSearch() {
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: '/pagesC/searchGoods/index',
      })
      // #endif
      // #ifdef H5
      this.$dsBridge.call('gotoPageThroughRoute', {
        // TODO: 热词搜索
        page: '/home/search?scene=5&keyword=',
      })
      // #endif
    },
  },
}
</script>

<style lang="scss">
.search-bar {
  width: 100%;
  border-radius: 18px;
  border: 3rpx solid #fe2442;

  &__input {
    width: 100%;
    height: 63rpx;
    border-radius: 35rpx;
    background: white;
    display: flex;
    align-items: center;
    padding: 3rpx;
  }

  &__placeholder {
    color: #1f1f1f;
    font-size: 27rpx;
    margin-left: 20rpx;
    display: flex;
    align-items: center;
    font-weight: 300;
  }

  &__divider {
    width: 2rpx;
    height: 35rpx;
    background-color: #dddddd;
    margin: 0 20rpx;
  }

  &__text {
    font-size: inherit;
    color: inherit;
  }

  &__button {
    background-color: #fe2442;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 88rpx;
    height: 54rpx;
    border-radius: 27rpx;
    margin-left: auto;
    margin-right: 5rpx;
  }

  &__icon {
    width: 20px;
    height: 20px;
  }
}
</style>
