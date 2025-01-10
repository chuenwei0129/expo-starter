<template>
  <view class="coupon-area">
    <!-- 标题和查看更多按钮 -->
    <view class="coupon-area__header">
      <view class="coupon-area__title">
        待使用
      </view>
      <view>
        <u-text
          v-if="list.length > 5"
          suffix-icon="play-right-fill"
          icon-style="font-size: 20rpx; color: #999999;font-weight: 400;margin-right: 18rpx;"
          color="#b2b3b5"
          size="25rpx"
          text="查看更多"
          @click="handleViewMore"
        />
      </view>
    </view>
    <!-- 轮播图区域 -->
    <swiper
      class="coupon-area__swiper"
      :indicator-dots="list.length > 1"
      :interval="3000"
      :circular="true"
      :current="current"
      @change="onSwiperChange"
    >
      <swiper-item
        v-for="(item, index) in list"
        :key="index"
      >
        <CouponCard
          :coupon="item"
          @click="handleClick"
        />
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import CouponCard from './CouponCard.vue'

export default {
  name: 'CouponArea',
  components: {
    CouponCard,
  },
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  data () {
    return {
      current: 0,
    }
  },

  methods: {
    handleClick (coupon) {
      this.$dsBridge.call('gotoPageThroughRoute', {
        page: `${window.location.origin}/crm-medical-h5/#/pagesC/orderDetail/serviceOrderDetail/index?orderId=${coupon.id}&transparentTopBar=1`,
      })
    },
    handleViewMore () {
    console.log('🚀 ~ handleViewMore ~ handleViewMore:', '触发 handleViewMore')
      this.$dsBridge.call('gotoPageThroughRoute', {
        page: `${window.location.origin}/crm-medical-h5/#/pagesC/mallOrderList/index?listIndex=4&transparentTopBar=1`,
      })
    },
    onSwiperChange (event) {
      this.current = event.detail.current
    },
  },
}
</script>

<style scoped>
.coupon-area {
  background: #f7f8fc;
  border-radius: 23rpx;
  width: 719rpx;
  height: 267rpx;
  margin: 0 auto;
  margin-bottom: 30rpx;
}

/* 标题区域样式 */
.coupon-area__header {
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.coupon-area__title {
  font-size: 31rpx;
  font-weight: 600;
  color: #1b1b1b;
}

/* 轮播容器样式 */
.coupon-area__swiper {
  height: 180rpx; /* 减少高度，让指示器更靠近卡片 */
}

/* Swiper 指示器样式 */
.coupon-area__swiper /deep/ .uni-swiper-dot {
  width: 12rpx; /* 长条宽度 */
  height: 4rpx; /* 长条高度 */
  border-radius: 4rpx; /* 圆角 */
  background-color: #1f1f1f;
  opacity: 0.25;
  margin: 0 5rpx; /* 间距 */
  transition: all 0.3s ease; /* 添加过渡效果 */
}

.coupon-area__swiper /deep/ .uni-swiper-dot-active {
  width: 15rpx; /* 激活状态加宽 */
  background-color: #1f1f1f;
  opacity: 1;
}
</style>
