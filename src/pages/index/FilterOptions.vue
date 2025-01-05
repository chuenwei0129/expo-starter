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
        智能排序
      </view>
      <view
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
        <view class="filter-options__label">
          价格
        </view>
        <view :class="priceIconCssClass" />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'FilterOptions',
  emits: ['filterChange'],
  data () {
    return {
      currentFilter: 1, // 当前选中的筛选类型
      filterTypes: {
        INTELLIGENT: 1, // 智能排序
        DISTANCE: 2, // 距离优先
        SALES: 3, // 销量优先
        PRICE_ASC: 4, // 价格升序
        PRICE_DESC: 5, // 价格降序
      },
    }
  },
  computed: {
    currentPriceType () {
      return this.currentFilter
    },
    isPriceFilterActive () {
      return (
        this.currentFilter === this.filterTypes.PRICE_ASC ||
        this.currentFilter === this.filterTypes.PRICE_DESC
      )
    },
    priceIconCssClass () {
      if (this.currentFilter === this.filterTypes.PRICE_ASC) {
        return 'filter-options__price-icon filter-options__price-icon--asc'
      } else if (this.currentFilter === this.filterTypes.PRICE_DESC) {
        return 'filter-options__price-icon filter-options__price-icon--desc'
      }
      return 'filter-options__price-icon'
    },
  },
  methods: {
    isFilterSelected (filterType) {
      return this.currentFilter === filterType
    },
    onSelectFilter (filterType) {
      if (this.currentFilter === filterType) return
      this.currentFilter = filterType
      this.$emit('filterChange', this.currentFilter)
    },
  },
}
</script>

<style lang="scss">
.filter-options {
  width: 100%;
  background-color: transparent;
  padding: 6rpx 29rpx;

  display: flex;
  justify-content: center;
  align-items: center;

  &__group {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  &__item {
    flex: 1;
    height: 60rpx;
    margin: 0 10rpx;
    font-size: 26rpx;
    font-weight: 400;
    color: #333333;
    background-color: #f5f5f5;
    line-height: 60rpx;
    text-align: center;
    border-radius: 30rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s;

    &--active {
      color: #fe2442;
      font-weight: 500;
      background-color: #ffffff;
      box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
    }
  }

  &__label {
    font-size: 26rpx;
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
