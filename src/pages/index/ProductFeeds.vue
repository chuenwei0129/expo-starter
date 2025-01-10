<template>
  <view>
    <!-- 展示商品信息 -->
    <view>
      <ProductList
        v-if="products.length"
        :goods="formattedProducts"
        class="product-list"
      />
      <view v-if="isFinished" class="last-container"> 已经到底啦喵～ </view>
      <NoData
        v-else-if="isFetched && !products.length"
        :is-show-more="false"
        img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
      />
    </view>
  </view>
</template>

<script>
import ProductList from './ProductList.vue'
import NoData from '@/components/noData/index.vue'

import { fetchProductListAPI } from './api/mockAPI'
// import {
//   fetchRecommendClassifyAPI,
//   fetchProductListAPI,
// } from './api/inStoreService'

export default {
  name: 'ProductFeeds',
  components: {
    ProductList,
    NoData,
  },
  props: {
    locationInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      list: [],
      products: [], // 新增：商品列表数据
      isFetched: false,
      params: {
        pageNum: 1,
        pageSize: 10,
        // 类目 id
        // 默认为推荐类目
        categoryId: 0,
        // 排序类型
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
    tabList() {
      return [{ id: 0, name: '推荐' }, ...this.list]
    },
  },
  async mounted() {
    await this.fetchRecommendClassifyData()
    await this.fetchProductListData()
  },
  methods: {
    async fetchRecommendClassifyData() {
      const resp = await fetchRecommendClassifyAPI()
      console.log('🚀 ~ fetchRecommendClassifyData ~ resp:', resp)
      this.list = resp.data.data.filter((item) => item.recommendType === 1)
    },
    async fetchProductListData() {
      if (this.isFinished) {
        return
      }
      const { cityCode, lon: lng, lat } = this.locationInfo
      this.isFetched = false
      const resp = await fetchProductListAPI({
        pageNum: this.params.pageNum,
        pageSize: 10,
        cityCode,
        lng,
        lat,
        // 传入类目 id
        categoryIds: this.params.categoryId
          ? [this.params.categoryId]
          : undefined,
        sortType: this.params.sortType,
        fromChannel: 'APP',
      })
      this.isFetched = true
      console.log('🚀 ~ fetchProductListData ~ resp:', resp)
      this.totalCount = Number(resp.data.data.totalCount)
      this.products = this.products.concat(resp.data.data.data || [])
      if (this.totalCount > this.products.length) {
        // 还有数据，继续分页请求
        this.params.pageNum++
      } else {
        this.isFinished = true
      }
    },
    onSwitchTab(tabIndex) {
      console.log('🚀 ~ onSwitchTab ~ tabIndex:', tabIndex)
      if (this.params.categoryId === tabIndex) {
        return
      }
      this.params.categoryId = tabIndex
      this.reset()
      this.fetchProductListData()
    },
    onFilterChange(filterType) {
      console.log('🚀 ~ onFilterChange ~ filterType:', filterType)
      this.params.sortType = filterType
      this.reset()
      this.fetchProductListData() // 重新获取数据
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
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}
</style>
