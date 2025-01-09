<template>
  <view class="navigation-area">
    <swiper
      class="navigation-area__swiper"
      :indicator-dots="false"
      :duration="500"
      :current="swiperIndex"
      @change="handleSwiperChange"
      :style="{ height: swiperHeight }"
      circular
    >
      <swiper-item
        v-for="(pageItems, pageIndex) in paginatedItems"
        :key="pageIndex"
        class="navigation-area__swiper-item"
        :style="{ height: getSwiperItemHeight(pageIndex) }"
      >
        <view
          class="navigation-area__swiper-item-row"
          v-for="(row, rowIndex) in getRows(pageItems, pageIndex)"
          :key="rowIndex"
          :style="{
            marginBottom:
              rowIndex < getRows(pageItems, pageIndex).length - 1
                ? rowMarginBottom
                : '0rpx',
          }"
        >
          <view
            v-for="(item, itemIndex) in row"
            :key="item.title"
            class="navigation-area__swiper-item-content"
            :style="{ width: itemWidthPercentage + '%' }"
            @click="handleNavigationClick(item)"
          >
            <view class="navigation-area__image-wrapper">
              <u-image
                class="navigation-area__image"
                :src="item.image"
                mode="aspectFill"
                width="85rpx"
                height="85rpx"
                radius="10rpx"
                lazy-load
                :alt="item.title"
              />
              <image
                v-if="item.cornerIcon"
                class="navigation-area__corner-icon"
                :src="item.cornerIcon"
                :alt="item.title"
              />
            </view>
            <view class="navigation-area__swiper-item-name">
              {{ item.title }}
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>
    <!-- 自定义指示器 -->
    <view class="navigation-area__custom-indicator" v-if="showIndicatorDots">
      <view
        v-for="(page, index) in paginatedItems"
        :key="index"
        class="navigation-area__indicator-dot"
        :class="{
          'navigation-area__indicator-dot--active': index === swiperIndex,
        }"
      ></view>
    </view>
  </view>
</template>

<script>
const BASE_HEIGHT = 157 // 基础高度
const ROW_MARGIN_BOTTOM = 24 // 行间距
const ITEMS_PER_ROW = 5 // 每行数量
const FIRST_PAGE_LIMIT = 5 // 第一页最大数量
const MAX_ITEMS = 15 // 每页最大显示数量

export default {
  name: 'NavigationArea',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      swiperIndex: 0,
      paginatedItems: [],
    }
  },
  computed: {
    itemWidthPercentage() {
      return 100 / ITEMS_PER_ROW
    },
    showIndicatorDots() {
      return this.paginatedItems.length > 1
    },
    rowMarginBottom() {
      return `${ROW_MARGIN_BOTTOM}rpx`
    },
    swiperHeight() {
      return this.getSwiperItemHeight(this.swiperIndex)
    },
  },
  watch: {
    list: {
      handler: 'paginateItems',
      immediate: true,
    },
  },
  methods: {
    paginateItems() {
      this.paginatedItems = []
      for (
        let i = 0;
        i < this.list.length;
        i += i === 0 ? FIRST_PAGE_LIMIT : MAX_ITEMS
      ) {
        const start = i
        const end =
          i === 0 ? FIRST_PAGE_LIMIT : Math.min(this.list.length, i + MAX_ITEMS)
        this.paginatedItems.push(this.list.slice(start, end))
      }
    },
    getRows(pageItems, pageIndex) {
      const rows = []
      const isFirstPage = pageIndex === 0
      const perRow = isFirstPage ? pageItems.length : ITEMS_PER_ROW // 第一页特殊处理

      for (let i = 0; i < pageItems.length; i += perRow) {
        rows.push(pageItems.slice(i, i + perRow))
      }

      return rows
    },
    handleSwiperChange(e) {
      const newIndex = e.detail.current
      if (newIndex !== this.swiperIndex) {
        // 只在页码变化时才更新高度
        this.swiperIndex = newIndex
      }
    },
    handleNavigationClick(item) {
      console.log('🚀 ~ handleNavigationClick ~ item:', item)
    },
    // 计算每个 swiper-item 的高度, 改为计算属性
    getSwiperItemHeight(pageIndex) {
      if (!this.paginatedItems[pageIndex]) return `${BASE_HEIGHT}rpx`
      const rows = this.getRows(
        this.paginatedItems[pageIndex],
        pageIndex
      ).length
      const height = BASE_HEIGHT * rows + (rows - 1) * ROW_MARGIN_BOTTOM
      return `${height}rpx`
    },
  },
}
</script>

<style lang="scss" scoped>
$base-height: 157rpx;
$row-margin-bottom: 24rpx;
$indicator-dot-size: 12rpx;
$active-indicator-dot-size: 24rpx;
$indicator-opacity: 0.25;

.navigation-area {
  position: relative;
  padding-bottom: 20rpx;

  &__swiper {
    width: 100%;
  }

  &__swiper-item {
    display: flex;
    flex-direction: column;
  }

  &__swiper-item-row {
    display: flex;
    flex-wrap: nowrap;
  }

  &__swiper-item-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 16rpx;
    padding-bottom: 16rpx;
  }

  &__image-wrapper {
    position: relative;
  }

  &__corner-icon {
    position: absolute;
    width: 42rpx;
    height: 25rpx;
    top: -8rpx;
    left: 52rpx;
  }

  &__swiper-item-name {
    margin-top: 8rpx;
    font-size: 24rpx;
  }

  &__custom-indicator {
    position: absolute;
    bottom: 5rpx;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
  }

  &__indicator-dot {
    width: $indicator-dot-size;
    height: $indicator-dot-size;
    border-radius: 50%;
    background-color: #1f1f1f;
    opacity: $indicator-opacity;
    margin: 0 12rpx;
    transition: all 0.3s ease;

    &--active {
      opacity: 1;
      width: $active-indicator-dot-size;
      border-radius: $indicator-dot-size;
    }
  }
}
</style>
