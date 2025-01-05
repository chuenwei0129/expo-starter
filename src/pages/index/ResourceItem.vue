<template>
  <view class="resource-item">
    <!-- 标题和查看更多按钮 -->
    <view class="resource-item__header">
      <view class="resource-item__title">
        {{ resource.name }}
      </view>
      <view>
        <u-text
          v-if="resource.resList.length > 3"
          suffix-icon="play-right-fill"
          icon-style="font-size: 20rpx; color: #b2b3b5;"
          color="#b2b3b5"
          text="查看更多"
          @click="handleViewMore"
        />
      </view>
    </view>
    <!-- 卡片 -->
    <u-row gutter="20rpx">
      <u-col
        v-for="(item, index) in filterList"
        :key="index"
        :span="12 / filterList.length"
        @click="handleClickProduct(item)"
      >
        <ProductCard
          :product="item"
          :is-horizontal="filterList.length === 1"
          :is-three-columns="filterList.length === 3"
        />
      </u-col>
    </u-row>
  </view>
</template>

<script>
import ProductCard from './ResourceCard.vue'

export default {
  name: 'ResourceItem',
  components: {
    ProductCard,
  },
  props: {
    resource: {
      type: Object,
      required: true,
    },
  },
  computed: {
    filterList() {
      return this.resource.resList.slice(0, 3)
    },
  },
  methods: {
    handleViewMore() {
      console.log('🚀 ~ handleViewMore ~ item:', this.resource)
      uni.navigateTo({
        url: `/pagesB/takeBathPage/index?resource=${this.resource.id}}`,
      })
    },
    handleClickProduct(item) {
      console.log('🚀 ~ handleClickProduct ~ item:', item)
      // TODO: 跳转到商品详情页面
      uni.$u.debounce(() => {
        uni.navigateTo({
          url: `/pagesC/goodsServiceDetail/index?itemId=${
            item?.itemId || ''
          }&skuId=${item?.skuId || ''}&shopId=${item?.shopId}`,
        })
      }, 500)
    },
  },
}
</script>

<style scoped>
.resource-item {
  width: 96%;
  margin: 0 auto;
  margin-bottom: 25rpx;
  border-radius: 16rpx;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

/* 标题区域样式 */
.resource-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.resource-item__title {
  font-weight: 600;
  font-size: 31rpx;
  color: #1f1f1f;
  line-height: 42rpx;
}

/* 查看更多按钮样式 */
.u-text {
  font-size: 28rpx;
  color: #666666;
  cursor: pointer;
  transition: color 0.3s ease;
}

.u-text:hover {
  color: #007bff;
}

/* 卡片布局样式 */
.u-row {
  margin: 0 -10rpx;
}

.u-col {
  padding: 0 10rpx;
  margin-bottom: 20rpx;
}
</style>
