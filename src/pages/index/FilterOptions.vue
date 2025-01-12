<template>
  <view class="filter-options">
    <view class="filter-options__group">
      <view
        :class="[
          'filter-options__item',
          isFilterSelected(filterTypes.INTELLIGENT)
            ? 'filter-options__item--active'
            : '',
        ]"
        @click="onSelectFilter(filterTypes.INTELLIGENT)"
      >
        综合排序
      </view>
      <view
        v-if="isShowDistance"
        :class="[
          'filter-options__item',
          isFilterSelected(filterTypes.DISTANCE)
            ? 'filter-options__item--active'
            : '',
        ]"
        @click="onSelectFilter(filterTypes.DISTANCE)"
      >
        距离优先
      </view>
      <view
        :class="[
          'filter-options__item',
          isFilterSelected(filterTypes.SALES)
            ? 'filter-options__item--active'
            : '',
        ]"
        @click="onSelectFilter(filterTypes.SALES)"
      >
        销量优先
      </view>
      <view
        :class="[
          'filter-options__item',
          isPriceFilterActive ? 'filter-options__item--active' : '',
        ]"
        @click="
          onSelectFilter(
            currentPriceType === filterTypes.PRICE_ASC
              ? filterTypes.PRICE_DESC
              : filterTypes.PRICE_ASC
          )
        "
      >
        <view class="filter-options__label"> 价格 </view>
        <view :class="priceIconCssClass" />
      </view>
    </view>
  </view>
</template>

<script>
import { action_report, display_report } from '@/utils/track'

export default {
  name: 'FilterOptions',
  inject: ['userId'],
  props: {
    isShowDistance: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['filterChange'],
  data() {
    return {
      currentFilter: 1, // 当前选中的筛选类型
      filterTypes: {
        INTELLIGENT: 1, // 综合排序
        DISTANCE: 2, // 距离优先
        SALES: 3, // 销量优先
        PRICE_ASC: 4, // 价格升序
        PRICE_DESC: 5, // 价格降序
      },
    }
  },
  computed: {
    currentPriceType() {
      return this.currentFilter
    },
    isPriceFilterActive() {
      return (
        this.currentFilter === this.filterTypes.PRICE_ASC ||
        this.currentFilter === this.filterTypes.PRICE_DESC
      )
    },
    priceIconCssClass() {
      if (this.currentFilter === this.filterTypes.PRICE_ASC) {
        return 'filter-options__price-icon filter-options__price-icon--asc'
      } else if (this.currentFilter === this.filterTypes.PRICE_DESC) {
        return 'filter-options__price-icon filter-options__price-icon--desc'
      }
      return 'filter-options__price-icon'
    },
  },
  watch: {
    isShowDistance: {
      handler(newVal, oldVal) {
        if (newVal === oldVal) return // 检查是否变化

        const filterOptions = newVal
          ? ['综合排序', '距离优先', '销量优先', '价格']
          : ['综合排序', '销量优先', '价格']

        filterOptions.forEach((item) => {
          display_report({
            display_name: 'service_filter_items_display',
            object_type: 'service',
            extend: {
              filter_items_name: item,
            },
          })
        })
      },
      immediate: true, // 立即触发
    },
  },
  methods: {
    isFilterSelected(filterType) {
      return this.currentFilter === filterType
    },
    onSelectFilter(filterType) {
      const filterTypeMap = new Map([
        [1, '综合排序'],
        [2, '距离优先'],
        [3, '销量优先'],
        [4, '价格升序'],
        [5, '价格降序'],
      ])

      action_report({
        action_name: 'service_filter_items_click',
        module_name: 'service',
        extend: {
          user_id: this.userId,
          filter_items_name: filterTypeMap.get(filterType),
        },
      })

      if (this.currentFilter === filterType) return
      this.currentFilter = filterType
      this.$emit('filterChange', this.currentFilter)
    },
  },
}
</script>

<style lang="scss" scoped>
.filter-options {
  width: 100%;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;

  &__group {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 20rpx;
  }

  &__item {
    flex: 1;
    height: 46rpx;
    line-height: 46rpx;
    margin: 0 10rpx;
    font-size: 21rpx;
    font-weight: 400;
    color: #333333;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s;
    background: #f7f7f7;
    border-radius: 23rpx;

    &--active {
      height: 46rpx;
      color: #fe2442;
      font-weight: 500;
      font-size: 21rpx;
      line-height: 46rpx;
      text-align: center;
      background-color: #ffeded;
    }
  }

  &__label {
    font-size: 21rpx;
  }

  &__price-icon {
    height: 26rpx;
    width: 26rpx;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url('https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/sort_filter_price.png');

    &--asc {
      background-image: url('https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/sort_filter_price_asc1.png');
    }

    &--desc {
      background-image: url('https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/sort_filter_price_desc1.png');
    }
  }
}
</style>
