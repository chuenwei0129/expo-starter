<template>
  <view>
    <!-- 展示商品信息 -->
    <view>
      <ProductList
        v-if="products.length"
        :goods="formattedProducts"
        :is-recommend="feeds.categoryId === 0"
      >
        <template #bottom>
          <view
            v-if="isFetched && isFinished"
            class="last-container"
          >
            已经到底啦喵～
          </view>
        </template>
      </ProductList>
      <NoData
        v-else-if="isFetched && !products.length"
        img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
      />
    </view>
  </view>
</template>

<script>
import ProductList from './ProductList.vue'
import NoData from './NoData.vue'

// import { fetchProductListAPI } from './api/mockAPI'
// import { fetchProductListAPI } from './api/inStoreService'

export default {
  name: 'ProductFeeds',
  components: {
    ProductList,
    NoData,
  },
  props: {
    location: {
      type: Object,
      default: () => ({}),
    },
    feeds: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      products: [], // 新增：商品列表数据
      isFetched: false,
      totalCount: 0,
      isFinished: false,
    }
  },
  computed: {
    formattedProducts () {
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
  },
  async mounted () {
    await this.fetchProductListData()
  },
  methods: {
    reset () {
      this.isFinished = false
      this.products = []
    },
      async fetchProductListData () {
      if (this.isFinished) {
        return
      }
      const { cityCode, lon, lat } = this.location
      this.isFetched = false
      const resp = await fetchProductListAPI({
        pageNum: this.feeds.pageNum,
        pageSize: this.feeds.pageSize,
        cityCode,
        lng: lon ? lon : undefined,
        lat: lat ? lat : undefined,
        // 传入类目 id
        categoryIds: this.feeds.categoryId
          ? [this.feeds.categoryId]
          : undefined,
        sortType: this.feeds.sortType,
        fromChannel: 'APP',
      })
      this.isFetched = true
      // uni.$emit('skeleton-refresh', false) // 关闭骨架屏
      console.log('🚀 ~ fetchProductListData ~ resp:', resp)
      this.totalCount = Number(resp.data.data.totalCount)
      const products = resp.data.data.data || []
      this.products = this.products.concat(products)
      if (this.totalCount > this.products.length) {
        // 还有数据，继续分页请求
        this.$emit('loadMore')
      } else {
        this.isFinished = true
      }
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
</style>
