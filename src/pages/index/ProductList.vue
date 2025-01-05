<template>
  <view class="goods-list-content">
    <view class="even-goods-list">
      <template v-if="evenGoods && evenGoods.length > 0">
        <GoodsCard
          v-for="goodsItem in evenGoods"
          :key="goodsItem.id"
          class="goods-item"
          :goods="goodsItem"
          :image-style="imageStyle"
          need-margin
          @click="handleClickGoods"
        />
      </template>

      <!-- 骨架屏  -->
      <view
        v-else-if="
          showSkeleton &&
          evenGoods.length == 0 &&
          oddGoods.length == 0 &&
          useSkeleton
        "
        class="skeleton-evengoods paddingRight test2"
      >
        <view v-for="i in 2" :key="i" class="skeleton-item">
          <image class="icon" :src="skeletonIcon" />
        </view>
      </view>
    </view>

    <!-- 偶数 -->
    <view v-if="oddGoods && oddGoods.length > 0" class="odd-goods-list">
      <GoodsCard
        v-for="goodsItem in oddGoods"
        :key="goodsItem.id"
        class="goods-item"
        :goods="goodsItem"
        :image-style="imageStyle"
        need-margin
        @click="handleClickGoods"
      />
    </view>

    <!-- 骨架屏  -->
    <view
      v-else-if="
        showSkeleton &&
        oddGoods.length == 0 &&
        evenGoods.length == 0 &&
        useSkeleton
      "
      class="skeleton-evengoods paddingLeft"
    >
      <view v-for="i in 2" :key="i" class="skeleton-item">
        <image class="icon" :src="skeletonIcon" />
      </view>
    </view>
  </view>
</template>

<script>
import GoodsCard from './GoodsCard.vue'

export default {
  name: 'InStoreServiceGoodsList',
  components: {
    GoodsCard,
  },
  props: {
    useSkeleton: {
      type: Boolean,
      default: false,
    },
    goods: {
      type: Array,
      default: () => [],
    },
    canAddCart: {
      type: Boolean,
      default: false,
    },
    imageStyle: {
      type: Object,
      default: () => ({
        backgroundColor: 'white',
      }),
    },
    adItems: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // 骨架屏icon
      skeletonIcon:
        'https://frontend-cdn.chongpangpang.com/image/medical-mp/home/skeleton_icon.png',
      showSkeleton: true, // 骨架屏 开启/关闭
    }
  },
  computed: {
    oddGoods() {
      if (this.adItems.length > 0) {
        return this.goods.filter((_, index) => index % 2 === 0)
      } else {
        return this.goods.filter((_, index) => index % 2 !== 0)
      }
    },
    evenGoods() {
      if (this.adItems.length > 0) {
        return this.goods.filter((_, index) => index % 2 !== 0)
      } else {
        return this.goods.filter((_, index) => index % 2 === 0)
      }
    },
  },
  mounted() {
    uni.$on('skeleton-refresh', (bool) => {
      setTimeout(() => {
        this.showSkeleton = bool
      }, 300)
    })
  },
  methods: {
    handleClickGoods(goods) {
      uni.$u.debounce(() => {
        uni.navigateTo({
          url: `/pagesC/goodsServiceDetail/index?itemId=${goods.id}&skuId=${
            goods.skuId || ''
          }&shopId=${goods.shopId}`,
        })
      }, 500)
    },
  },
}
</script>

<style scoped lang="scss">
.goods-list-content {
  display: flex;
  width: 96%;
  margin: 0 auto;
  justify-content: space-between;

  .even-goods-list {
    display: flex;
    flex-direction: column;
    width: calc((100vw - 46rpx) / 2);
  }

  .odd-goods-list {
    @extend .even-goods-list;
  }

  .goods-item {
    margin-bottom: 16rpx;
  }
}

.skeleton-evengoods {
  width: calc((100vw - 30rpx) / 2);
  box-sizing: border-box;
  .skeleton-item {
    width: 352rpx; // calc((100vw - 46rpx) / 2);
    height: 552rpx;
    background: #ffffff;
    border-radius: 23rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 16rpx;
    .icon {
      display: block;
      width: 165rpx;
      height: 65rpx;
    }
  }
}
.paddingRight {
  padding-right: 8rpx;
}
.paddingLeft {
  padding-left: 8rpx;
}
</style>
