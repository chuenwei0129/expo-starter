<template>
  <view>
    <!-- 分类标签 -->
    <view v-if="categoryIds.length" class="sticky-container">
      <FilterTabs :list="tabs" @onSwitch="onSwitchTab" />
      <FilterOptions
        :is-show-distance="isShowDistance"
        @filterChange="onFilterChange"
      />
    </view>
    <view>
      <ProductList
        :goods="formattedProducts"
        :is-recommend="params.categoryId === 0"
        :imageStyle="{ backgroundColor: '#F7F8FC' }"
      >
        <template #load-more>
          <view v-if="isLoadingMore" class="loading-container">
            <image
              src="https://frontend-cdn.chongpangpang.com/image/cpp-static/prod/ui/cpp_h5_loading.png"
              mode="scaleToFill"
              class="loading-image"
            />
          </view>
        </template>
        <template #load-finished>
          <view v-if="isDataFetched && isFinished" class="last-container">
            已经到底啦喵～
          </view>
        </template>
      </ProductList>
      <!-- <NoData
        v-else-if="isDataFetched && !products.length && !isLoading"
        style="height: 100%"
        img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
      /> -->
    </view>
  </view>
</template>

<script>
import FilterTabs from './FilterTabs.vue'
import FilterOptions from './FilterOptions.vue'
import ProductList from './ProductList.vue'
import NoData from './NoData.vue'

import { fetchRecommendClassifyAPI, fetchProductListAPI } from './api/mockAPI'
// import { fetchRecommendClassifyAPI, fetchProductListAPI } from './api/inStoreService'

export default {
  name: 'ProductFeeds',
  components: {
    FilterTabs,
    FilterOptions,
    ProductList,
    NoData,
  },
  props: {
    location: {
      type: Object,
      default: () => ({}),
    },
    isShowDistance: {
      type: Boolean,
      default: false,
    },
    scrollTop: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      categoryIds: [],
      products: [],
      isDataFetched: false,
      isLoadingMore: false, // 新增：加载中状态
      params: {
        pageNum: 1,
        pageSize: 5,
        categoryId: 0,
        sortType: 1,
      },
      totalCount: 0,
      isFinished: false,
    }
  },
  computed: {
    formattedProducts() {
      return this.products.map((e) => {
        const salePrice =
          e.promotionTag !== null ? e.promotionPrice : e.realPrice
        const originPrice = e.promotionTag !== null ? e.realPrice : 0
        return {
          picture: e.image,
          title: e.itemName,
          salePrice: salePrice,
          originPrice: originPrice,
          id: e.itemId,
          skuId: e.skuId,
          skuTag: e.skuTag,
          shopId: e.shopId,
          promotion: e.promotionTag,
          soldStockTag: e.saledStockQty,
          distance: e.distance,
          shopName: e.shopName,
        }
      })
    },
    tabs() {
      return [{ id: 0, name: '推荐' }, ...this.categoryIds]
    },
  },
  async mounted() {
    await this.fetchRecommendClassifyData()
    await this.fetchProductListData()
  },
  methods: {
    async fetchRecommendClassifyData() {
      const resp = await fetchRecommendClassifyAPI()
      this.categoryIds = resp.data.data || []
    },
    async fetchProductListData(signal) {
      if (this.isFinished) return
      if (this.params.pageNum > 1 && signal) {
        this.isLoadingMore = true // 开始加载
      }
      this.isDataFetched = false
      uni.$emit('skeleton-refresh', true)
      const { cityCode, lon, lat } = this.location
      try {
        const resp = await fetchProductListAPI({
          pageNum: this.params.pageNum,
          pageSize: this.params.pageSize,
          cityCode,
          lng: lon ? lon : undefined,
          lat: lat ? lat : undefined,
          categoryIds: this.params.categoryId
            ? [this.params.categoryId]
            : undefined,
          sortType: this.params.sortType,
          fromChannel: 'APP',
        })
        this.totalCount = Number(resp.data.data.totalCount)
        const products = resp.data.data.data || []
        this.products = this.products.concat(products)
        if (this.totalCount > this.products.length) {
          // 还有数据，继续分页请求
          this.params.pageNum++
        } else {
          // 在数据加载完后渲染
          this.$nextTick(() => {
            this.isFinished = true
          })
        }
      } catch (error) {
        console.error('Failed to fetch product list:', error)
      } finally {
        uni.$emit('skeleton-refresh', false)
        this.isDataFetched = true
        this.isLoadingMore = false
      }
    },
    async onSwitchTab(tabIndex) {
      if (String(this.params.categoryId) === String(tabIndex.id)) {
        return
      }
      this.$emit('tabClick')
      this.params.categoryId = tabIndex.id
      this.reset()
      await this.fetchProductListData()
    },
    async onFilterChange(filterType) {
      this.$emit('tabClick')
      this.params.sortType = filterType
      this.reset()
      await this.fetchProductListData()
    },
    reset() {
      this.params.pageNum = 1 // 重置页码
      this.isFinished = false
      this.products = []
    },
  },
}
</script>

<style scoped>
.last-container {
  width: 100%;
  display: flex;
  margin-top: 30rpx;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 23rpx;
  color: #5a5a5a;
  line-height: 33rpx;
  padding-bottom: 40rpx;
}
.sticky-container {
  position: sticky;
  top: 0;
  z-index: 999;
  background-color: #fff;
  height: 100px;
  border: 1px solid black;
}
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx;
}
.loading-image {
  width: 60rpx;
  height: 60rpx;
}
</style>
