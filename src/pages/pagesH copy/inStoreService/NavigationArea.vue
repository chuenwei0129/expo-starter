<template>
  <view class="navigation-area">
    <swiper
      :indicator-dots="shouldShowIndicator && showPaginationDots"
      class="navigation-area__swiper"
      :style="{ height: swiperHeight }"
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
            style="position: relative"
            @click="handleNavigationClick(item)"
          >
            <u-image
              :src="item.image"
              mode="aspectFill"
              width="85rpx"
              height="85rpx"
              radius="10rpx"
            />
            <image
              v-if="item.cornerIcon"
              style="position: absolute;width: 42rpx;height: 25rpx;top: -8rpx;left: 52rpx;"
              :src="item.cornerIcon"
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
    // 导航项数据列表
    list: {
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
      default: 2,
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
    // TODO: 指定轮播组件的高度在有 dot 时会导致 item 上下间距变宽，需要优化
    swiperHeight () {
      // 基础高度：一行的高度为 85rpx (图片高度) + 16rpx * 2 (上下边距) + 8rpx (文字上边距) + 24rpx(文字高度) = 157rpx
      const baseItemHeight = 85 + 16 + 16 + 8 + 24
      let height = 0
      if (this.list.length <= this.itemsPerRow) {
        // 小于等于一行，只显示一行
        height = baseItemHeight
      } else {
        // 超过一行，根据 rowsPerPage 计算高度
        height = baseItemHeight * this.rowsPerPage
      }

      // 如果有多页，则加上指示器高度 (假设指示器高度为 50rpx，可根据实际情况调整)
      if (this.showPaginationDots && this.shouldShowIndicator) {
        height += 50
      }
      return `${height}rpx`
    },
    // 是否显示分页指示点
    showPaginationDots () {
      return this.paginatedItems.length > 1
    },
  },

  watch: {
    // 监听导航项数据的变化，当数据变化时重新进行分页
    list: {
      handler: 'paginateItems',
      immediate: true,
    },
    itemsPerRow: {
      handler: 'paginateItems',
    },
    rowsPerPage: {
      handler: 'paginateItems',
    },
  },

  methods: {
    // 对导航项数据进行分页
    paginateItems () {
      // 计算每页的导航项数量
      const itemsPerPage = this.itemsPerRow * this.rowsPerPage
      // 最多显示 30 个
      const slicedList = this.list
      // 使用 reduce 方法对导航项进行分页
      this.paginatedItems = slicedList.reduce((pages, item, index) => {
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
      // 检查 appLink 是否以https开头，如果是直接跳转如果不是按下面注释规则跳转
      if (item.appLink.startsWith('https')) {
        this.$dsBridge.call('gotoPageThroughRoute', {
        page: `${item.appLink}`,
      })
        return
      }

      this.$dsBridge.call('gotoPageThroughRoute', {
        page: `${window.location.origin}/crm-medical-h5/#/${item.appLink}`
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.navigation-area {
  border-radius: 16rpx;
  margin: 20rpx 0;

  &__swiper-item {
    display: flex;
    flex-wrap: wrap;
  }

  &__swiper-item-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
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
