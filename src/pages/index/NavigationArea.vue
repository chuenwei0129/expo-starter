<template>
  <view class="navigation-area">
    <swiper
      :indicator-dots="shouldShowIndicator && showPaginationDots"
      class="navigation-area__swiper"
      :style="{ maxHeight: swiperHeight }"
    >
      <swiper-item
        v-for="(pageItems, pageIndex) in paginatedItems"
        :key="pageIndex"
        class="navigation-area__swiper-item"
      >
        <view
          v-for="(item, itemIndex) in pageItems"
          :key="itemIndex"
          class="navigation-area__swiper-item-content"
          :style="{ width: itemWidthPercentage + '%' }"
        >
          <view
            class="navigation-area__swiper-item-image"
            @click="handleNavigationClick(item)"
          >
            <u-image
              :src="item.image"
              width="85rpx"
              height="85rpx"
              radius="10rpx"
            />
          </view>
          <view class="navigation-area__swiper-item-name">
            {{ item.title }}
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  name: 'NavigationArea',
  props: {
    // 导航项数据
    items: {
      type: Array,
      required: true,
    },
    // 每行显示的导航项数量
    itemsPerRow: {
      type: Number,
      default: 5,
    },
    // 每页显示的行数
    rowsPerPage: {
      type: Number,
      default: 1,
    },
    // 是否应该显示分页指示器（当只有一页时不显示）
    shouldShowIndicator: {
      type: Boolean,
      default: true,
    },
  },

  data () {
    return {
      // 分页后的导航项数组
      paginatedItems: [],
    }
  },

  computed: {
    // 计算每个导航项的宽度百分比
    itemWidthPercentage () {
      return 100 / this.itemsPerRow
    },
    // 计算轮播组件的高度
    swiperHeight () {
      // TODO: 根据实际情况调整高度
      return `${185 * this.rowsPerPage}rpx`
    },
    // 是否显示分页指示点
    showPaginationDots () {
      return this.paginatedItems.length > 1
    },
  },

  watch: {
    // 监听导航项数据的变化，当数据变化时重新进行分页
    items: {
      handler: 'paginateItems',
      immediate: true,
    },
  },

  mounted () {
    // 组件挂载时进行分页
    this.paginateItems()
  },

  methods: {
    // 对导航项数据进行分页
    paginateItems () {
      // 计算每页的导航项数量
      const itemsPerPage = this.itemsPerRow * this.rowsPerPage
      // 使用 reduce 方法对导航项进行分页
      this.paginatedItems = this.items.reduce((pages, item, index) => {
        const pageIndex = Math.floor(index / itemsPerPage)
        if (!pages[pageIndex]) {
          pages[pageIndex] = []
        }
        pages[pageIndex].push(item)
        return pages
      }, [])
    },

    // 处理导航项点击事件
    handleNavigationClick (item) {
      // TODO: 使用更具体的跳转逻辑替换示例代码
      this.$dsBridge.call('gotoPageThroughRoute', {
          page: `${item.h5Link}`,
        })
      // uni.showToast({
      //   title: `导航到: ${item.h5Link}`,
      //   icon: 'success',
      // })
    },
  },
}
</script>

<style lang="scss" scoped>
.navigation-area {
  border-radius: 16rpx;
  padding-bottom: 20rpx;

  // &__swiper {
  // }

  &__swiper-item {
    display: flex;
    flex-wrap: wrap;
  }

  &__swiper-item-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 16rpx 0;
    overflow: hidden;
  }

  &__swiper-item-image {
    width: 85rpx;
    height: 85rpx;
  }

  &__swiper-item-name {
    margin-top: 8rpx;
    font-size: 24rpx;
  }
}

/* 使用 ::v-deep 修改指示器样式 */
::v-deep .uni-swiper-dot {
  width: 15rpx;
  height: 4rpx;
  border-radius: 4rpx;
  // margin-left: 6rpx;
  background-color: #1f1f1f;
  opacity: 0.25;
}

::v-deep .uni-swiper-dot-active {
  background-color: #1f1f1f;
  opacity: 1;
  // width: 24rpx;
}
</style>
