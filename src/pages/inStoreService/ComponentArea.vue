<template>
  <view class="component-area">
    <u-row
      class="component-area__list"
      :gutter="10"
    >
      <u-col
        v-for="(item, index) in list"
        :key="index"
        :span="itemSpan"
        @click="handleClick(item.link)"
      >
        <view class="component-area__item">
          <image
            :src="item.image"
            :style="{ height: calculateImageHeight(item) + 'rpx', width: itemWidth + 'rpx' }"
            class="component-area__image"
            mode="widthFix"
          />
        </view>
      </u-col>
    </u-row>
  </view>
</template>

<script>
import { action_report } from '@/utils/track'

export default {
  name: 'ComponentArea',
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  computed: {
    itemSpan () {
      return this.list.length > 0 ? 12 / this.list.length : 12
    },
    // 每个 item 的宽度，减去 gutter 的影响
    itemWidth () {
      const totalWidth = 716 // 总宽度
      const gutter = 10 // 间距
      const columns = this.list.length
      const totalGutter = columns > 1 ? (columns - 1) * gutter : 0
      return (totalWidth - totalGutter) / columns
    },
  },
  methods: {
    handleClick (link) {
      const userId =
        this.$dsBridge.call('getUserId', 'getUserId') || '401211901598814208'
        action_report({
          action_name: 'service_recommend_component_click',
          module_name: 'service',
          extend: {
            user_id: userId,
            recommend_name: link,
          },
        })

      this.$dsBridge.call('gotoPageThroughRoute', {
        page: `${link}`,
      })
    },
    // 根据图片的宽高比和当前宽度计算图片高度
    calculateImageHeight (item) {
      if (item.imageWidth && item.imageHeight) {
        const aspectRatio = item.imageHeight / item.imageWidth
        return this.itemWidth * aspectRatio
      }
      return 0 // 或者返回一个默认高度
    },
  },
}
</script>

<style scoped lang="scss">
.component-area {
  width: 716rpx;
  margin: 0 auto;
  margin-bottom: 25rpx;
}

.component-area__list {
  display: flex;
  align-items: center;
}

.component-area__item {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 16rpx;
}

.component-area__image {
  display: block;
  border-radius: 16rpx;
  transition: transform var(--animation-duration, 0.3s);
}
</style>
