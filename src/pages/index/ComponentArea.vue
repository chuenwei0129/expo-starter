<template>
  <view class="component-area">
    <u-row
      class="component-area__list"
      :gutter="10"
    >
      <!-- 根据子项数量动态设置列宽 -->
      <u-col
        v-for="(item, index) in list"
        :key="index"
        :span="itemSpan"
        @click="handleClick(item.link)"
      >
        <view class="component-area__item">
          <!-- 也可以设置容器高度为 maxImageHeight，然后动态计算图片样式-->
          <!-- :style="imageStyles[index]" -->
          <!-- 设置图片高度为 maxImageHeight -->
          <image
            :src="item.image"
            :style="{ height: maxImageHeight + 'rpx' }"
            class="component-area__image"
          />
        </view>
      </u-col>
    </u-row>
  </view>
</template>

<script>
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
    // 计算最大图片高度，遍历 list 数组，找到最高的图片高度
    maxImageHeight () {
      const maxHeight = Math.max(...this.list.map((item) => item.imageHeight))
      return maxHeight
    },
    // 计算每个图片的样式，根据图片的宽高比和最大高度动态设置样式
    // imageStyles() {
    //   return this.list.map((item) => {
    //     const itemImageHeight = item.imageHeight
    //     return {
    //       width: 'calc(100% - 20rpx)', // 减去 padding
    //       height: `${itemImageHeight}rpx`,
    //       // maxWidth: `${aspectRatio * itemImageHeight}rpx`,
    //       // maxHeight: `${this.maxImageHeight - 20}rpx`,
    //       borderRadius: '16rpx',
    //     }
    //   })
    // },
  },
  methods: {
    handleClick (link) {
      this.$dsBridge.call('gotoPageThroughRoute', {
          page: `${link}`,
        })
    },
  },
}
</script>

<style scoped lang="scss">
.component-area {
  width: 96%;
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

/* 图片 hover 效果 */
// .component-area__image:hover {
//   transform: scale(1.1);
// }
</style>
