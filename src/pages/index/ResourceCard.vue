<template>
  <view
    class="product-card"
    :class="{ 'product-card--horizontal': isHorizontal }"
  >
    <!-- 商品图 -->
    <view class="product-card__image-container">
      <image
        class="product-card__image"
        :src="product.image"
      />
      <!-- <view
        v-if="!isHorizontal"
        class="product-card__overlay"
      >
        100.5km | 南京栖霞宠胖胖万象汇
      </view> -->
    </view>
    <!-- 商品信息 -->
    <view class="product-card__info">
      <!-- 商品名 -->
      <view class="product-card__name">
        <text>
          {{ product.name }}
        </text>
      </view>
      <!-- 营销信息 -->
      <view class="product-card__promotion">
        <!-- <text>促销 100 减 300</text> -->
        <!-- TODO: 规则 -->
        <PromotionTag
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
          销量 {{ product.saledStockQty || 0 }}
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
    isHorizontal: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {}
  },
  methods: {},
}
</script>

<style scoped lang="scss">
.product-card {
  background: #ffffff;
  border-radius: 23rpx;
  display: flex;
  // 默认垂直布局
  flex-direction: column;

  &--horizontal {
    // 水平布局
    flex-direction: row;
    align-items: center;
    padding: 20rpx;

    .product-card__image {
      // 图片容器占据较小空间
      width: 200rpx;
      height: 200rpx;
      margin-right: 20rpx;
      border-radius: 23rpx;
    }

    .product-card__info {
      // 信息容器占据剩余空间
      flex: 1;
    }
  }

  &__image-container {
    position: relative;
  }

  &__image {
    // 图片默认样式，后续会被水平布局覆盖
    width: 100%;
    height: 400rpx;
    border-radius: 23rpx;
  }

  &__overlay {
    position: absolute;
    bottom: 0.5rem;
    left: 0.5rem;
    background-color: rgba(128, 128, 128, 0.5);
    color: #ffffff;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }

  &__info {
    padding: 20rpx;
  }

  &__name {
    font-weight: 500;
    font-size: 27rpx;
    color: #333333;
    line-height: 38rpx;
    text-align: left;
  }

  &__promotion {
    font-weight: 300;
    font-size: 21rpx;
    color: #666666;
    line-height: 31rpx;
    text-align: left;
    font-style: normal;
    margin-top: 10rpx;
  }

  &__price-sales {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 30rpx;
    margin-top: 15rpx;
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
