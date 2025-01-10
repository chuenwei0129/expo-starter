<template>
  <view
    class="cart-button"
    @click="handleClick"
  >
    <view
      v-if="cartItemCount"
      class="cart-button__badge"
    >
      <u-icon
        v-if="cartItemCount > 99"
        name="more-dot-fill"
        color="#fff"
        size="12"
      />
      <text v-else>
        {{ cartItemCount }}
      </text>
    </view>

    <i
      class="iconfont icon-a-ShoppingCart"
      style="font-size: 46rpx"
    />
  </view>
</template>

<script>
import { GET_CART_TOTAL } from '@/api/mallv2'
import { action_report } from '@/utils/track'

export default {
  name: 'CartButton',
  data () {
    return {
      cartItemCount: 0,
    }
  },
  // mounted () {
  //   this.getCartNum()
  // },

  methods: {
    handleClick () {

      action_report({
        action_name: 'service_shoppingcart_click',
        module_name: 'service',
        extend: {
            user_id:   this.$dsBridge.call('getUserId', 'getUserId'),
          },
      })

      this.$dsBridge.call('gotoPageThroughRoute', {
        page: `${window.location.origin}/crm-medical-h5/#/pagesC/shoppingCart/index`,
      })
    },
    //获取购物车数量
    async getCartNum () {
      const res = await GET_CART_TOTAL({
        checked: false,
        cartType: 1,
      })
      const { data } = res.data
      this.cartItemCount = data
    },
  },
}
</script>

<style scoped lang="scss">
.cart-button {
  position: relative;
  width: 70rpx; // 或与图标大小匹配的值
  height: 70rpx;
  display: flex;
  justify-content: center;
  align-items: center;

  .cart-button__badge {
    position: absolute;
    top: -8rpx; // 调整为适当值
    right: -8rpx;
    background: #f33a50;
    font-size: 20rpx;
    font-weight: 600;
    color: #ffffff;
    border-radius: 50%;
    width: 34rpx;
    height: 34rpx;
    /* 使用 flex 布局使内容居中 */
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
