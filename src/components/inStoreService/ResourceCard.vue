<template>
  <view
    class="product-card"
    :class="{
      'product-card--one': isOne,
      'product-card--more': isMore,
    }"
  >
    <!-- 商品图 -->
    <image
      class="product-card__image"
      mode="scaleToFill"
      :src="product.image"
    />
    <!-- 商品信息 -->
    <view class="product-card__info">
      <!-- 商品名 -->
      <view class="product-card__name">
        <text>
          {{ product.name }}
        </text>
      </view>
      <!-- 营销信息 -->
      <view
        class="product-card__promotion"
        :class="{ 'product-card__promotion--empty': !hasPromotion }"
      >
        <PromotionTag
          v-if="hasPromotion"
          :text-size="21"
          :icon-size="21"
          :is-coupon-text="true"
          :name="product.promotionTag.promotionName"
          :right-type="product.promotionTag.rightType"
          :rule="product.promotionTag.promotionRule"
          :promotion-type="product.promotionTag.promotionType"
          :is-text-overflow="true"
        />
      </view>
      <view class="product-card__price-sales">
        <!-- 商品价格 -->
        <view class="product-card__price">
          ￥{{ product.realPrice }}
        </view>
        <!-- 商品销量 -->
        <view class="product-card__sales">
          {{ !product.saledStockQty ? '' : `销量 ${product.saledStockQty}` }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import PromotionTag from './PromotionTag.vue'
export default {
  name: 'ProductCard',
  components: {
    PromotionTag,
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    isOne: {
      type: Boolean,
      default: false,
    },
    isMore: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hasPromotion () {
      return (
        this.product.promotionTag &&
        this.product.promotionTag.promotionId.length > 0
      )
    },
  },
}
</script>

<style scoped lang="scss">
@import '@/utils/fn.scss';
.product-card {
  border-radius: 23rpx;
  display: flex;
  // 默认垂直布局
  flex-direction: column;
  background-color: #fff;

  &--one {
    // 水平布局
    flex-direction: row;
    align-items: center;

    .product-card__image {
      // 图片容器占据较小空间
      width: 138rpx;
      height: 138rpx;
      margin-right: 20rpx;
      border-radius: 23rpx;
    }

    .product-card__info {
      // 信息容器占据剩余空间
      flex: 1;
    }
  }

  &--more {
    .product-card__image {
      width: 208rpx;
      height: 208rpx;
      border-radius: 23rpx;
    }

    product-card__info {
      @include ellipsis(208rpx)
    }
  }

  &__image {
    width: 100%;
    height: 352rpx;
    border-radius: 23rpx;
  }

  &__info {
    padding: 20rpx;
    @include ellipsis(352rpx)
  }

  &__name {
    font-weight: 500;
    font-size: 27rpx;
    color: #333333;
    line-height: 38rpx;
    text-align: left;
    @include ellipsis(352rpx)
  }

  &__promotion {
    font-weight: 300;
    font-size: 21rpx;
    color: #666666;
    line-height: 31rpx;
    text-align: left;
    font-style: normal;
    margin-top: 10rpx;
    // 为没有营销信息的元素添加高度，保持卡片高度一致
    &--empty {
      min-height: 31rpx; // 使用和有营销信息时相同的高度
    }
  }

  &__price-sales {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 15rpx;
    gap: 15rpx;
  }

  &__price {
    font-weight: 600;
    font-size: 23rpx;
    color: #ff4b63;
    line-height: 33rpx;
    text-align: left;
  }

  &__sales {
    font-weight: 300;
    font-size: 21rpx;
    color: #666666;
    line-height: 31rpx;
    text-align: right;
  }
}
</style>
