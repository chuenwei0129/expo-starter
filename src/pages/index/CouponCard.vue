<template>
  <view class="coupon-card">
    <view class="coupon-card__image">
      <image :src="coupon.imageUrl" />
    </view>

    <view class="coupon-card__info">
      <view class="coupon-card__title">
        {{ coupon.itemName }}
      </view>
      <view class="coupon-card__expiry-date">
        <template v-if="coupon.daysRemaining > 7">
          {{ formatDate(coupon.verifyValidEndTime) }} 到期
        </template>
        <template v-else-if="coupon.daysRemaining > 0">
          还剩 <span class="days-remaining">{{ coupon.daysRemaining }}</span> 天
        </template>
        <template v-else-if="Number(coupon.daysRemaining) === 0">
          <span class="expired">{{ coupon.verifyValidEndTime.split(' ')[1] }} 后失效</span>
        </template>
        <template v-else>
          异常情况
        </template>
      </view>
      <view class="coupon-card__location">
        <u-text
          prefix-icon="map"
          size="21rpx"
          bold
          color="#999999"
          line-height="31rpx"
          icon-style="font-size: 21rpx; color: #999999"
          :text="coupon.shopName"
        />
      </view>
    </view>

    <view
      class="coupon-card__action"
      @click="$emit('click', coupon)"
    >
      查看券码
    </view>
  </view>
</template>

<script>
export default {
  name: 'CouponCard',
  props: {
    coupon: {
      type: Object,
      required: true,
    },
  },
  emits: ['click'],
  methods: {
    formatDate (dateString) {
      const date = new Date(dateString)
      return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
    },
  },
}
</script>

<style scoped lang="scss">
// @import "@/utils/fn.scss";

/* 卡片样式 */
.coupon-card {
  margin: 0 20rpx;
  display: flex;
  align-items: center;
  background-color: #f6f8fc;
}

/* 图片样式 */
.coupon-card__image {
  width: 138rpx;
  height: 138rpx;
  margin-right: 32rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

/* 信息栏样式 */
.coupon-card__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.coupon-card__title {
  font-weight: 400;
  font-size: 29rpx;
  color: #1f1f1f;
  // @include ellipsis(256rpx);
}

.coupon-card__expiry-date {
  font-weight: 400;
  font-size: 25rpx;
  color: #666666;
  margin-top: 10rpx;
  margin-bottom: 10rpx;

  .days-remaining {
    color: red;
    font-weight: 500;
  }

  .expired {
    color: red;
  }
}

/* 按钮样式 */
.coupon-card__action {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 23rpx;
  font-weight: 500;
  width: 138rpx;
  height: 58rpx;
  background: #fe2442;
  border-radius: 29rpx;
}
</style>
