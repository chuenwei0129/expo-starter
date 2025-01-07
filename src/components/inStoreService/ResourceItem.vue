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
        <ResourceCard
          :product="item"
          :is-one="filterList.length === 1"
          :is-more="filterList.length >= 3"
        />
      </u-col>
    </u-row>
  </view>
</template>

<script>
import ResourceCard from './ResourceCard.vue'

export default {
  name: 'ResourceItem',
  components: {
    ResourceCard,
  },
  props: {
    resource: {
      type: Object,
      required: true,
    },
    location: {
      type: Object,
      required: true,
    },
  },
  computed: {
    filterList () {
      return this.resource.resList.slice(0, 3)
    },
  },
  methods: {
    handleViewMore () {
      console.log('🚀 ~ handleViewMore ~ item:', this.resource)
      console.log(this.$props.location)
      uni.navigateTo({
        url: `/pagesB/takeBathPage/index?resource=${this.resource.id}&cityCode=${this.location.cityCode}&lng=${this.location.lon}&lat=${this.location.lat}`,
      })
    },
    handleClickProduct (item) {
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
  width: 719rpx;
  margin: 0 auto;
  margin-bottom: 25rpx;
  border-radius: 16rpx;
}

/* 标题区域样式 */
.resource-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  background-color: #fff;
  border-radius: 23rpx;
}

.resource-item__title {
  font-weight: 600;
  font-size: 31rpx;
  color: #1f1f1f;
  line-height: 42rpx;
}
</style>
