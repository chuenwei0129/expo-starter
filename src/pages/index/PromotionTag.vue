<script>
export default {
  name: 'PromotionTag',
  props: {
    promotionType: {
      type: [Number, String],
      default: 1,
    },
    rightType: {
      type: [Number, String],
      default: 0,
    },
    rule: {
      type: Object,
      default: () => ({
        threshold: 0,
        discount: 0,
        amount: 0,
      }),
    },
    name: {
      type: String,
      default: '',
    },
    iconSize: {
      type: Number,
      default: 23,
    },
    textSize: {
      type: Number,
      default: 23,
    },
    isCouponText: {
      type: Boolean,
      default: false,
    },
    isTextOverflow: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    couponText() {
      switch (Number(this.rightType)) {
        case 201:
          return '商品免费券'
        case 216:
          return `满${this.rule.threshold}打${(this.rule.discount * 10).toFixed(
            1
          )}折`
        case 211:
          return `满${this.rule.threshold}减${this.rule.amount}`
        default:
          return this.name
      }
    },
    isCoupon() {
      return Number(this.promotionType) === 1
    },
  },
}
</script>

<template>
  <view
    class="promotion-tag"
    :style="{
      borderRadius: textSize > 23 ? '8rpx' : '6rpx',
      paddingRight: textSize > 23 ? '16rpx' : '6rpx',
    }"
  >
    <view class="promotion-tag__content">
      <view class="promotion-tag__type">
        <image
          v-if="!isCoupon"
          :style="{ width: `${iconSize}rpx`, height: `${iconSize}rpx` }"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/mall_coupon_tag_cu_1.png"
        />
        <image
          v-else-if="!isCouponText"
          :style="{ width: `${iconSize}rpx`, height: `${iconSize}rpx` }"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/mall_coupon_tag_quan_1.png"
        />
        <view
          v-else
          class="promotion-tag__icon"
          :style="{ fontSize: `${iconSize}rpx` }"
        >
          券
        </view>
      </view>
      <view
        class="promotion-tag__right"
        :style="{
          fontSize: `${textSize}rpx`,
          maxWidth: isTextOverflow ? '172rpx' : '',
        }"
      >
        {{ couponText }}
      </view>
    </view>
  </view>
</template>

<style scoped>
.promotion-tag {
  background: white;
  /* border: 1rpx solid #ffcfd8; */
}
.promotion-tag__content {
  display: flex;
  align-items: center;
}
.promotion-tag__type {
  padding: 0 7rpx;
  /* border-right: 1rpx solid #ffcfd8; */
  display: flex;
  align-items: center;
}
.promotion-tag__icon {
  color: #fe2442;
  margin-right: 4rpx;
}
.promotion-tag__right {
  color: #fe2442;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 7rpx;
}
</style>
