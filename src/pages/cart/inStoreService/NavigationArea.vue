<template>
  <view class="navigation-area">
    <swiper :indicator-dots="showIndicatorDots" class="navigation-area__swiper">
      <swiper-item
        v-for="(pageItems, pageIndex) in paginatedItems"
        :key="pageIndex"
        class="navigation-area__swiper-item"
        :style="{ height: getSwiperItemHeight(pageIndex) }"
      >
        <view
          v-for="(item, itemIndex) in pageItems"
          :key="itemIndex"
          class="navigation-area__swiper-item-content"
          :style="{ width: itemWidthPercentage + '%' }"
        >
          <view style="position: relative" @click="handleNavigationClick(item)">
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
          <view class="navigation-area__swiper-item-name">
            {{ item.title }}
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import { action_report } from '@/utils/track'

export default {
  name: 'NavigationArea',
  props: {
    // 导航项数据列表
    list: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      // 分页后的导航项数组
      paginatedItems: [],
    }
  },

  computed: {
    // 计算每个导航项的宽度百分比
    itemWidthPercentage() {
      // 每行显示5个
      return 20 // 100 / 5 = 20
    },

    // 是否显示分页指示点
    showIndicatorDots() {
      // 当数据超过一页且第一页数据大于5个时显示指示点
      return this.paginatedItems.length > 1
    },
  },

  watch: {
    // 监听导航项数据的变化，当数据变化时重新进行分页
    list: {
      handler: 'paginateItems',
      immediate: true,
    },
  },

  methods: {
    // 对导航项数据进行分页
    paginateItems() {
      const firstPageLimit = 5
      const secondPageLimit = 15
      const totalLimit = firstPageLimit + secondPageLimit

      this.paginatedItems = []

      if (this.list.length > 0) {
        // 第一页
        this.paginatedItems.push(this.list.slice(0, firstPageLimit))

        // 第二页 (如果有, 且总数不超过 totalLimit)
        if (this.list.length > firstPageLimit) {
          this.paginatedItems.push(
            this.list.slice(
              firstPageLimit,
              Math.min(this.list.length, totalLimit)
            )
          )
        }
      }
    },

    // 处理导航项点击事件
    handleNavigationClick(item) {
      action_report({
        action_name: 'service_recommend_diamond_click',
        module_name: 'service',
        extend: {
          user_id: this.$dsBridge.call('getUserId', 'getUserId'),
          diamond_name: item.title,
        },
      })

      // 检查 appLink 是否以 https 开头，如果是直接跳转如果不是按下面注释规则跳转
      if (item.appLink.startsWith('https')) {
        this.$dsBridge.call('gotoPageThroughRoute', {
          page: `${item.appLink}`,
        })
        return
      }

      // transparentTopBar=1 是控制导航栏，感觉需要后台自己配
      this.$dsBridge.call('gotoPageThroughRoute', {
        page: `${window.location.origin}/crm-medical-h5/#${item.appLink}`,
      })
    },

    // 计算每个 swiper-item 的高度
    getSwiperItemHeight(pageIndex) {
      // 基础高度：一行的高度为 85rpx (图片高度) + 16rpx * 2 (上下边距) + 8rpx (文字上边距) + 24rpx(文字高度) = 157rpx
      const baseHeight = 157

      if (pageIndex === 0) {
        // 第一页高度
        return `${baseHeight}rpx`
      } else {
        // 其他页高度
        const itemsCount = this.paginatedItems[pageIndex].length
        const rows = Math.ceil(itemsCount / 5) // 每行5个，计算行数
        let height = baseHeight * rows
        if (pageIndex > 0) {
          height += 60 // 页间距
        }
        return `${height}rpx`
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.navigation-area {
  border-radius: 16rpx;
  margin: 40rpx 0;

  &__swiper-item {
    display: flex;
    flex-wrap: wrap;
  }

  &__swiper-item-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    // overflow: hidden;
    padding-top: 8rpx; // 添加这一行，至少8rpx，或者根据实际情况调整
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
