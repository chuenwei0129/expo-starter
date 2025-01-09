<template>
  <view class="details">
    <swiper
      class="swiper"
      :duration="500"
      :current="swiperIndex"
      @change="changeSwiper"
      :style="{ height: swiperHeight + 'px' }"
      circular
      indicator-dots
      indicator-color="rgba(0, 0, 0, .3)"
      indicator-active-color="#007aff"
    >
      <swiper-item v-for="(item, index) in bannerList" :key="index">
        <image
          :id="'wrap' + index"
          class="swiper-img"
          :src="item"
          mode="widthFix"
          @load="imageLoaded(index)"
        ></image>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  data() {
    return {
      swiperIndex: 0, // 当前索引
      swiperHeight: 0, // 滑块的高度(单位px)
      bannerList: [], // 初始化为空数组
      imageLoadedCount: 0, // 记录已加载的图片数量
      baseWidth: 750, // 设计稿基准宽度，根据你的设计稿调整
    }
  },
  onLoad() {
    this.generateBannerList()
    this.$nextTick(() => {
      this.setSwiperHeight() // 动态设置 swiper 的高度
    })
  },
  methods: {
    generateBannerList() {
      const widths = [this.baseWidth, this.baseWidth, this.baseWidth] // 对应三个 banner 的宽度，可以根据需要调整
      const heights = [400, 600, 500] // 对应三个 banner 的高度，可以根据需要调整，现在固定

      this.bannerList = widths.map((width, index) => {
        const height = heights[index]
        return `https://picsum.photos/${width}/${height}?image=${Math.floor(
          Math.random() * 1000
        )}` // 随机生成图片 URL
      })
    },
    changeSwiper(e) {
      this.swiperIndex = e.detail.current
      this.$nextTick(() => {
        this.setSwiperHeight() // 动态设置 swiper 的高度
      })
    },
    /* 动态设置 swiper 的高度 */
    setSwiperHeight() {
      // 如果所有图片都已加载，则使用当前索引的图片高度
      if (this.imageLoadedCount === this.bannerList.length) {
        const element = '#wrap' + this.swiperIndex
        const query = uni.createSelectorQuery().in(this)
        query.select(element).boundingClientRect()
        query.exec((res) => {
          if (res && res[0]) this.swiperHeight = res[0].height
        })
      } else {
        // 如果还有图片未加载，则使用默认高度或者保持当前高度
        // 这里可以根据需要设置一个默认高度，例如：
        if (this.swiperHeight === 0) {
          this.swiperHeight = 400 // 默认高度设置为 400px
        }
      }
    },
    imageLoaded(index) {
      // 监听图片加载事件，每加载一张图片，计数器加一
      if (index === this.swiperIndex) {
        this.setSwiperHeight()
      }
      this.imageLoadedCount++
    },
  },
}
</script>

<style lang="scss" scoped>
.details {
  width: 100%;
  overflow: hidden;
}

.swiper {
  width: 100%;
}

.swiper-img {
  width: 100%;
  display: block;
}
</style>
