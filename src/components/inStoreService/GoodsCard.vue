<template>
  <view
    class="goods-card-content"
    :style="{ paddingBottom: needMargin ? '20rpx' : '0' }"
    @click="$emit('click', goods)"
  >
    <view class="image-back">
      <image
        class="goods-image"
        :style="{ backgroundColor: imageStyle.backgroundColor || 'white' }"
        :src="picture"
        mode="aspectFill"
      />
      <view
        v-if="shopName"
        class="goods-address"
      >
        {{ distance }} | {{ shopName }}
      </view>
    </view>
    <view
      :class="['goods-title']"
      :style="{
        marginLeft: needMargin ? '17rpx' : '0',
        marginRight: needMargin ? '17rpx' : '0',
      }"
    >
      <image
        v-if="skuTag === 1"
        class="goods-tips"
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/mall_xiaoshida_v1.png"
      />
      <image
        v-if="skuTag === 3"
        class="goods-tips"
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/cirida_v1.png"
      />
      <image
        v-if="newUserTag"
        class="newuser-tips"
        src="https://frontend-cdn.chongpangpang.com/image/miniapp-newuser/newusertag_v1.png"
      />
      <text class="goods-title-text">
        {{ title }}
      </text>
    </view>
    <view
      v-if="hasDeliverTag || hasPromotion"
      class="tags"
      :style="{
        paddingLeft: needMargin ? '17rpx' : '0',
        paddingRight: needMargin ? '17rpx' : '0',
      }"
    >
      <!-- <view class="tag-item-prepare" v-if="hasPrepare">养宠必备</view> -->
      <view
        v-if="hasDeliverTag"
        class="tag-item"
        style="flex-shrink: 0"
      >
        <DeliveryTag :text-size="21" />
      </view>
      <view
        v-if="hasPromotion"
        :class="[
          'tag-item',
          hasDeliverTag ? 'small-promotion-tag' : 'promotion-tag',
        ]"
      >
        <PromotionTag
          :text-size="21"
          line-h="31rpx"
          :icon-size="21"
          :is-quan-text="true"
          :name="promotion.promotionName"
          :right-type="promotion.rightType"
          :rule="promotion.promotionRule"
          :promotion-type="promotion.promotionType"
          :is-text-overflow="true"
        />
      </view>
    </view>
    <view
      class="goods-price"
      :style="{
        marginLeft: needMargin ? '19rpx' : '0',
        marginRight: needMargin ? '17rpx' : '0',
      }"
    >
      <GoodsPrice
        :class="[canAddCart ? 'small-goods-price' : 'big-goods-price']"
        :sale-price="salePrice"
        :origin-price="originPrice"
        :sale-font-weight="400"
        :sale-price-integer-font-size="38"
        show-discounts
      />
      <!-- <image
        v-if="canAddCart"
        class="add-cart-icon"
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/goods/shop-cart-logo-active1.png"
        @click.stop="handleAddCart"
      /> -->
      <view
        v-if="canAddCart"
        class="add-cart-icon"
        @click.stop="handleAddCart"
      >
        <i class="iconfont icon-a-ShoppingCart" />
      </view>
      <view
        v-else
        class="sold-stock"
      >
        {{ soldStockTag ? `销量${soldStockTag}` : "" }}
      </view>
    </view>
  </view>
</template>

<script>
import GoodsPrice from '@/components/goodsPrice/index.vue'
import { display_report } from '@/utils/track'
import DeliveryTag from '@/components/goodsCard/components/deliveryTag.vue'
import { addCart } from '@/api/cart'
import PromotionTag from '@/components/goodsCard/components/promotionTag.vue'
export default {
  name: 'GoodsCard',
  components: {
    PromotionTag,
    DeliveryTag,
    GoodsPrice,
  },
  props: {
    goods: {
      type: Object,
      default: {
        picture: '',
        title: '',
        salePrice: '',
        originPrice: '',
        skuTag: 0,
        newuserTag: false,
        id: '',
        promotion: {
          promotionName: '',
          promotionId: '',
          shopId: '',
          rightType: 0,
          rule: {},
        },
      },
    },
    needMargin: {
      type: Boolean,
      default: false,
    },
    eType: {
      type: String,
      default: '',
    },
    canAddCart: {
      type: Boolean,
      default: false,
    },
    imageStyle: {
      type: Object,
      default: {
        backgroundColor: 'white',
      },
    },
  },
  data () {
    return {}
  },
  computed: {
    picture () {
      return this.goods.picture
    },
    title () {
      return this.goods.title
    },
    goodId () {
      return this.goods.id
    },
    salePrice () {
      return this.goods.salePrice
    },
    originPrice () {
      return this.goods.originPrice
    },
    skuTag () {
      return this.goods.skuTag
    },
    newUserTag () {
      return this.goods.newuserTag
    },
    promotion () {
      return this.goods.promotion
    },
    hasDeliverTag () {
      return this.skuTag === 2
    },
    hasPromotion () {
      return (
        this.goods.promotion && this.goods.promotion.promotionId.length > 0
      )
    },
    soldStockTag () {
      return this.goods.soldStockTag
    },
    distance () {
       return this.goods.distance
    },
    shopName () {
       return this.goods.shopName && this.goods.shopName.slice(0, 14)
    }
  },
  mounted () {
    if (this.eType === 'home') {
      display_report({
        display_name: 'home_feed_goods_display',
        object_type: 'home',
        extend: {
          goods_id: this.goodId,
        },
      })
    } else if (this.eType === 'filterGoodsService') {
      display_report({
        display_name: 'class2_commodity_show',
        object_type: 'class2',
        extend: {
          commodity_id: this.goodId,
        },
      })
    } else if (this.eType === 'recommend') {
      display_report({
        display_name: 'shop_selected_commodity_show',
        object_type: 'shop',
        extend: {
          commodity_name: this.title,
          commodity_id: this.goodId,
        },
      })
    }

    uni.$on('goodsChange', (data) => {
      const { goodData, isWatch } = data
      if (isWatch) {
        goodData.forEach((goodsItem) => {
          if (goodsItem.itemId === this.goodId) {
            if (this.eType === 'recommend') {
              display_report({
                display_name: 'shop_selected_commodity_show',
                object_type: 'shop',
                extend: {
                  commodity_name: this.title,
                  commodity_id: this.goodId,
                },
              })
            }
          }
        })
      }
    })
  },
  methods: {
    async handleAddCart () {
      uni.$u.debounce(async () => {
        const itemData = {
          cartType: 1,
          shopId: this.goods?.shopId ?? '',
          skuId: this.goods?.skuId ?? '',
          skuQty: 1,
        }
        const res = await addCart({
          ...itemData,
          tenantId: 'default_tenant',
        })
        if (res.data.data.isSuccess) {
          await uni.showToast({
            icon: 'none',
            title: '加购成功',
            duration: 1000,
          })
          setTimeout(() => {
            uni.$emit('addCardNumActive')
          }, 1000)
        }
      }, 500)
    },
  },
}
</script>

<style scoped lang="scss">
.goods-card-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: white;
  border-radius: 23rpx;
  overflow: hidden;

  .image-back {
    overflow: hidden;
    width: 100%;
    padding-bottom: 100%;
    height: 0;
    position: relative;

    .goods-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      // aspect-ratio: 1/1;
    }
    .goods-address {
      position: absolute;
      left: 10rpx;
      bottom: 10rpx;
      background: rgba(0, 0, 0, 0.45);
      border-radius: 17px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 19rpx;
      color: #ffffff;
      padding: 4rpx 12rpx;
    }
  }

  .info-back {
    padding: 18rpx 18rpx 20rpx 20rpx;
  }

  .goods-tips {
    width: 69rpx;
    height: 29rpx;
    position: relative;
    margin-right: 10rpx;
    left: 0;
    top: 6rpx;
  }
  .newuser-tips {
    width: 90rpx;
    height: 29rpx;
    position: relative;
    left: 0;
    top: 6rpx;
    margin-right: 10rpx;
  }
  .goods-title {
    color: #333;
    font-size: 27rpx;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
    margin-top: 17rpx;
  }
  .goods-title-text {
    line-height: 38rpx;
  }
  .goods-price {
    max-width: calc((100vw - 24px) / 2 - 19rpx - 17rpx);
    margin-top: 11rpx;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .small-goods-price {
      max-width: calc((100vw - 24px) / 2 - 19rpx - 17rpx - 38rpx);
    }
    .add-cart-icon {
      width: 46rpx;
      height: 46rpx;
      font-size: 38rpx;
      background-color: rgba(254, 36, 66, 1);
      border-radius: 50%;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-left: 4rpx;
    }
    .sold-stock {
      font-size: 23rpx;
      font-weight: normal;
      color: #666;
      margin-right: 13rpx;
      margin-left: 8rpx;
      word-break: break-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      // position: absolute;
      // right: 0;
    }
  }
  .tags {
    display: flex;
    margin-top: 6rpx;
    flex-wrap: nowrap;
    .tag-item + .tag-item {
      margin-left: 10rpx;
    }
    .tag-item {
      height: 31rpx;
      .delivery-tips {
        width: 100rpx;
        height: 100%;
        vertical-align: bottom;
      }
    }
    .promotion-tag {
      max-width: calc(((100vw - 16rpx * 3) / 2 - 19rpx - 17rpx));
    }
    .small-promotion-tag {
      max-width: calc((100vw - 16rpx * 3) / 2 - 19rpx - 17rpx - 100rpx - 10rpx);
    }
    .tag-item-prepare {
      font-size: 21rpx;
      color: #b35b05;
      line-height: 31rpx;
      min-width: 85rpx;
    }
  }
}
</style>
