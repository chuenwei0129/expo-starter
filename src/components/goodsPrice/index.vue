<template>
  <view
    class="goods-price-content-warp"
    :style="{
      justifyContent: alignWayWarp === 'right' ? 'flex-end' : '',
    }"
  >
    <view
      class="goods-price-content"
      :style="{
        justifyContent: alignWay === 'right' ? 'flex-end' : 'flex-start',
        fontSize: saleSignFontSize + 'rpx',
        fontWeight: saleFontWeight > 400 ? 'bold' : 'normal',
        color: saleColor,
        minWidth: saleSignWidth + 'rpx',
      }"
    >
      <text
        :style="{
          fontSize: saleSignFontSize + 'rpx',
          fontWeight: saleFontWeight > 400 ? 'bold' : 'normal',
          color: saleColor,
          marginRight: '6rpx',
        }"
        >{{ left ? left + '￥' : '¥' }}</text
      >
      <text
        :style="{
          fontSize: salePriceIntegerFontSize + 'rpx',
          fontWeight: saleFontWeight > 400 ? 'bold' : 'normal',
          color: saleColor,
        }"
        class="font-din"
        >{{ salePriceInteger }}</text
      >

      <text
        v-if="salePriceDecimal.length > 0"
        class="font-din"
        :style="{
          fontSize: salePriceDecimalFontSize + 'rpx',
          fontWeight: saleFontWeight > 400 ? 'bold' : 'normal',
          color: saleColor,
        }"
        >{{ '.' + salePriceDecimal }}</text
      >
      <text v-if="showDiscounts && isShowOrigin" class="discounts">{{
        originPricePrefix
      }}</text>
      <view v-if="isShowSpecialPrice" class="special" :style="specialStyle">
        {{ originPricePrefix }}￥
        <span class="price">{{ specialPrice }}</span>
      </view>
      <!-- <text
        v-if="isShowOrigin"
        :style="{
          fontSize: originFontSize + 'rpx',
          fontWeight: originFontWeight > 400 ? 'bold' : 'normal',
          color: originColor,
          marginLeft: '8rpx',
          marginRight: '4rpx',
        }"
        >{{ " ¥" }}</text
      >
      <text
        v-if="isShowOrigin"
        class="font-din"
        :style="{
          fontSize: originFontSize + 'rpx',
          fontWeight: originFontWeight > 400 ? 'bold' : 'normal',
          color: originColor,
        }"
        >{{ originPriceText }}</text
      > -->
    </view>
    <!-- 商品列表二级页 - 加入购物车【前提 - 过滤掉无库存商品】 -->
    <view
      v-if="shopLogo"
      @click.stop="handleAddCart"
      class="shop-cart-logo-active"
    >
      <i class="iconfont icon-a-ShoppingCart"></i
    ></view>
  </view>
</template>

<script>
// import { action_report, display_report } from "@/utils/track";
// import { formatFloat } from "@/utils";
export default {
  name: 'goodsPrice',
  props: {
    left: {
      type: String,
      default: '',
    },
    // 对齐方式
    alignWay: {
      type: String,
      default: 'left',
    },
    alignWayWarp: {
      type: String,
      // default: "left",
    },
    saleSignWidth: {
      type: Number,
      default: 22,
    },
    // 金额符号字号
    saleSignFontSize: {
      type: Number,
      default: 23,
    },
    // 售价字重
    saleFontWeight: {
      type: Number,
      default: 600,
    },
    // 售价颜色
    saleColor: {
      type: String,
      default: '#FE2442',
    },
    // 售价
    salePrice: {
      type: String | null,
      default: '0',
    },
    // 售价整数部分字号
    salePriceIntegerFontSize: {
      type: Number,
      default: 31,
    },
    // 售价小数部分字号
    salePriceDecimalFontSize: {
      type: Number,
      default: 25,
    },
    specialPrice: {
      type: String | null,
      default: '-1',
    },
    // 原价，遵循原价展示规则：为0为空不展示，低于售价不展示
    originPricePrefix: {
      type: String,
      default: '折后价',
    },
    originPrice: {
      type: String | null,
      default: '0',
    },
    // 原价颜色
    originColor: {
      type: String,
      default: '#999',
    },
    // 原价字号
    originFontSize: {
      type: Number,
      default: 22,
    },
    // 原价字重
    originFontWeight: {
      type: Number,
      default: 400,
    },
    //折后价
    showDiscounts: {
      type: Boolean,
      default: false,
    },
    //购物车logo
    shopLogo: {
      type: Boolean,
      default: false,
    },
    //所有数据
    itemData: {
      type: Object,
    },
    // 父级来源
    origin: {
      type: String,
      default: '',
    },
    specialStyle: {
      type: String,
      default: '',
    },
  },
  computed: {
    salePriceInteger() {
      const salePriceNum = Number.parseFloat(this.salePrice)
      if (salePriceNum !== salePriceNum) {
        return '0'
      }
      const num = salePriceNum.toFixed(2)
      return `${num}`.split('.')[0]
    },
    salePriceDecimal() {
      const salePriceNum = Number.parseFloat(this.salePrice)
      if (salePriceNum !== salePriceNum) {
        return ''
      }
      const num = salePriceNum.toFixed(2)
      const res = `${num}`.split('.')[1]
      if (res === '00') {
        return ''
      }
      if (res.substring(1, 2) === '0') {
        return res.substring(0, 1)
      }
      return res
    },
    isShowSpecialPrice() {
      // console.log('isShowSpecialPrice 0')
      const info = uni.getStorageSync('storage_info') || {}
      if (!info.token) {
        return false
      }
      if (this.specialPrice == '-1') {
        return false
      }
      // console.log('isShowSpecialPrice 2')
      const salePriceNum = Number.parseFloat(this.salePrice)
      const specialPriceNum = Number.parseFloat(this.specialPrice)
      if (salePriceNum < specialPriceNum) {
        return false
      }

      return true
    },
    isShowOrigin() {
      if (!this.originPrice) {
        return false
      }
      const salePriceNum = Number.parseFloat(this.salePrice)
      const originPriceNum = Number.parseFloat(this.originPrice)
      if (originPriceNum !== originPriceNum) {
        return false
      }
      if (salePriceNum >= originPriceNum) {
        return false
      }
      if (originPriceNum.toFixed(2) === '0.00') {
        return false
      }
      return true
    },
    originPriceText() {
      if (!this.originPrice) {
        return ''
      }
      let res = Number.parseFloat(this.originPrice).toFixed(2)
      if (res.substring(res.length - 1, res.length) !== '0') {
        return res
      }
      res = Number.parseFloat(this.originPrice).toFixed(1)
      if (res.substring(res.length - 1, res.length) !== '0') {
        return res
      }
      return Number.parseFloat(this.originPrice).toFixed(0)
    },
  },
  created() {
    //加载字体文件
    uni.loadFontFace({
      family: 'D-DIN-Bold',
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/order/d_din_bold.ttf")',
      success() {
        console.log('success load ttf')
      },
      fail() {
        console.log('fail load ttf')
      },
    })
  },
  methods: {
    // formatFloat,
    handleAddCart() {
      console.log('this.origin====>', this.origin)
      if (this.origin == 'filterGoodsService') {
        action_report({
          action_name: 'class2_cartbutton_click',
          module_name: 'shop',
          extend: {
            commodity_name: this.itemData.itemName,
            commodity_id: this.itemData.itemId,
          },
        })
      } else if (this.origin == 'goodsResult') {
        action_report({
          display_name: 'result_cartbutton_click',
          module_name: 'shop',
          extend: {
            commodity_name: this.itemData.itemName,
            commodity_id: this.itemData.itemId,
          },
        })
      }

      uni.$u.debounce(() => {
        console.log('加入购物车', this.itemData)
        uni.$emit('addCardNum', this.itemData)
      }, 500)
    },
  },
}
</script>

<style scoped lang="scss">
.goods-price-content {
  display: flex;
  align-items: first baseline;
  font-family: D-DIN-Bold, D-DIN;
}
.goods-price-content-warp {
  display: flex;
  justify-content: space-between;
  // align-items: first start;
  align-items: flex-end;
}
.shop-cart-logo-active {
  // width: 40rpx;
  // height: 40rpx;
  margin-right: 8rpx;
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
.discounts {
  font-size: 23rpx;
  font-weight: normal;
  color: #666;
  margin-right: 13rpx;
  margin-left: 8rpx;
  word-break: break-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.font-din {
  font-family: D-DIN-Bold;
}
.special {
  background: #fe2442;
  border-radius: 42rpx;
  padding: 10rpx 25rpx 10rpx 18rpx;
  font-size: 23rpx;
  font-family: PingFangSC, PingFang SC;
  font-weight: normal;
  color: #ffffff;
  margin-left: 23rpx;
  .price {
    font-size: 22px;
    font-family: D-DIN-Bold;
    font-weight: normal;
    line-height: 45rpx;
  }
}
</style>
