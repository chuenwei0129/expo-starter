<template>
  <view class="noData-box">
    <image class="noData-img" :src="img" />
    <!-- https://frontend-cdn.chongpangpang.com/image/qykimg2/default.png -->
    <!-- <text v-if="isShowBtnBox">{{ noDataText }}</text> -->
    <view class="noData-text">
      <view>{{ noDataText }}</view>
      <br />
      <view>{{ noDataText2 }}</view>
    </view>
    <view v-if="isShowMore">
      <view class="noData-buttonBox" v-if="isShowBtnBox">
        <view class="btnBox">
          <view class="btn" @click="shopService('call')">联系客服</view>
          <view class="btn" @click="shopService('more')">查看更多</view>
        </view>
        <view class="shopList">
          <goods-list :goods="goodsData"></goods-list>
        </view>
      </view>
      <view class="noData-buttonBox" v-else>
        <view class="btnBox">
          <!-- <view class="btn" @click="shopService('call')">联系客服</view> -->
          <view class="btn" @click="shopService('more')">查看更多</view>
        </view>
        <view class="shopList">
          <goods-list :goods="goodsData"></goods-list>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'noData',
  props: {
    noDataText: {
      type: String,
      default: '暂无数据',
    },
    noDataText2: {
      type: String,
      default: '',
    },
    img: {
      type: String,
    },
    isShowBtnBox: {
      type: Boolean,
      default: false,
    },
    goodsData: {
      type: Array,
    },
    isShowMore: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {}
  },
  methods: {
    shopService(type) {
      if (type === 'call') {
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: 'plugin://myPlugin/chat',
        })
        // #endif
        // #ifdef H5
        this.$dsBridge.call('gotoPageThroughRoute', {
          page: `/user/custom/service`,
        })
        // #endif
      } else if (type === 'more') {
        // #ifdef MP-WEIXIN
        console.log('23456')
        uni.switchTab({ url: '/pages/mall/index' })
        // #endif
        // #ifdef H5
        this.$dsBridge.call('gotoPageThroughRoute', {
          page: `/app/main?locate_main_fragment=1`,
        })
        // #endif
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
