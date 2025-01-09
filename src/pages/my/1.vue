<template>
  <view class="details">
    <!-- 自适应导航区域 -->
    <view class="adaptive-navigation">
      <swiper
        class="swiper"
        :indicator-dots="showIndicatorDots"
        :duration="500"
        :current="navSwiperIndex"
        @change="changeNavSwiper"
        :style="{ height: navSwiperHeight + 'rpx' }"
        circular
      >
        <swiper-item
          v-for="(pageItems, pageIndex) in paginatedItems"
          :key="pageIndex"
          class="swiper-item"
        >
          <view
            class="swiper-item-row"
            v-for="(row, rowIndex) in getRows(pageItems, pageIndex)"
            :key="rowIndex"
          >
            <view
              v-for="(item, itemIndex) in row"
              :key="itemIndex"
              class="swiper-item-content"
              :style="{ width: itemWidthPercentage + '%' }"
              @click="handleNavigationClick(item)"
            >
              <view style="position: relative">
                <u-image
                  :src="item.image"
                  mode="aspectFill"
                  width="85rpx"
                  height="85rpx"
                  radius="10rpx"
                />
                <image
                  v-if="item.cornerIcon"
                  style="
                    position: absolute;
                    width: 42rpx;
                    height: 25rpx;
                    top: -8rpx;
                    left: 52rpx;
                  "
                  :src="item.cornerIcon"
                />
              </view>
              <view class="swiper-item-name">
                {{ item.title }}
              </view>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CartPage',
  data() {
    return {
      navSwiperIndex: 0,
      navSwiperHeight: 157, // 初始高度设置为一行的基础高度
      paginatedItems: [],
      navigationList: [],
    }
  },
  computed: {
    itemWidthPercentage() {
      return 20 // 每行5个，100 / 5 = 20
    },
    showIndicatorDots() {
      return this.paginatedItems.length > 1
    },
  },
  watch: {
    navigationList: {
      handler: 'paginateItems',
      immediate: true,
    },
  },
  onLoad() {
    this.generateNavigationList()
  },
  methods: {
    // 导航区域相关方法
    generateNavigationList() {
      // 生成20条模拟数据
      this.navigationList = Array.from({ length: 20 }, (_, index) => ({
        image: `https://picsum.photos/85/85?image=${Math.floor(
          Math.random() * 100
        )}`,
        cornerIcon:
          index % 3 === 0
            ? `https://picsum.photos/42/25?image=${Math.floor(
                Math.random() * 100
              )}`
            : '',
        title: `服务 ${index + 1}`,
        appLink: `/pages/service/detail?id=${index + 1}`, // 假设的跳转链接
      }))
    },
    paginateItems() {
      const firstPageLimit = 5
      const maxItems = 20 // 最大显示20个

      this.paginatedItems = []

      if (this.navigationList.length > 0) {
        // 第一页始终是5个
        this.paginatedItems.push(this.navigationList.slice(0, firstPageLimit))

        // 第二页及以后，最多显示到20个
        if (this.navigationList.length > firstPageLimit) {
          const remainingItems = this.navigationList.slice(
            firstPageLimit,
            Math.min(this.navigationList.length, maxItems)
          )
          this.paginatedItems.push(remainingItems)
        }
      }
    },
    getRows(pageItems, pageIndex) {
      const perRow = 5
      const rows = []
      if (pageIndex === 0) {
        // 第一页始终只有一行
        rows.push(pageItems)
      } else {
        // 其他页根据数量分割成多行
        for (let i = 0; i < pageItems.length; i += perRow) {
          rows.push(pageItems.slice(i, i + perRow))
        }
      }

      // 更新当前 swiper 的高度
      this.$nextTick(() => {
        this.updateNavSwiperHeight(pageIndex, rows.length)
      })

      return rows
    },
    updateNavSwiperHeight(pageIndex, numRows) {
      const baseHeight = 157 // 一行的基础高度
      const pageSpacing = 60 // 页间距
      let height = baseHeight

      if (pageIndex > 0) {
        height = baseHeight * numRows + pageSpacing
      }

      if (this.navSwiperIndex === pageIndex) {
        this.navSwiperHeight = height
      }
    },
    changeNavSwiper(e) {
      this.navSwiperIndex = e.detail.current
      // 更新高度
      this.$nextTick(() => {
        const pageItems = this.paginatedItems[this.navSwiperIndex]
        const numRows =
          this.navSwiperIndex === 0 ? 1 : Math.ceil(pageItems.length / 5)
        this.updateNavSwiperHeight(this.navSwiperIndex, numRows)
      })
    },
    handleNavigationClick(item) {
      action_report({
        action_name: 'service_recommend_diamond_click',
        module_name: 'service',
        extend: {
          user_id: this.$dsBridge.call('getUserId', 'getUserId'),
          diamond_name: item.title,
        },
      })
      if (item.appLink.startsWith('https')) {
        this.$dsBridge.call('gotoPageThroughRoute', {
          page: `${item.appLink}`,
        })
      } else {
        this.$dsBridge.call('gotoPageThroughRoute', {
          page: `${window.location.origin}/crm-medical-h5/#${item.appLink}?transparentTopBar=1`,
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.details {
  // 导航区域样式
  .adaptive-navigation {
    .swiper {
      width: 100%;
    }
    .swiper-item {
      display: flex;
      flex-direction: column; // 将 swiper-item 的布局改为垂直方向
    }
    .swiper-item-row {
      display: flex;
      flex-wrap: nowrap; // 行内不允许换行
    }
    .swiper-item-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 8rpx;
    }
    .swiper-item-name {
      margin-top: 8rpx;
      font-size: 24rpx;
    }
  }

  /* 使用 ::v-deep 修改指示器样式 */
  ::v-deep .uni-swiper-dot {
    width: 15rpx;
    height: 4rpx;
    border-radius: 4rpx;
    background-color: #1f1f1f;
    opacity: 0.25;
  }

  ::v-deep .uni-swiper-dot-active {
    background-color: #1f1f1f;
    opacity: 1;
  }
}
</style>
