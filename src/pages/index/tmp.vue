<template>
  <view class="search-bar" @click="$u.debounce(navigateToSearch, 500)">
    <view class="search-bar__input">
      <view class="search-bar__placeholder">
        <!-- <scan-code
          color="red"
          @click="gotoScan"
        /> -->
        <view class="search-bar__divider" />
        <text class="search-bar__text">
          {{ currentHotWord || '搜你想要的宠物商品' }}
        </text>
      </view>
      <view class="search-bar__button">
        <image
          class="search-bar__icon"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/header-search.png"
          alt="Search Icon"
        />
      </view>
    </view>
  </view>
</template>

<script>
// import ScanCode from '@/components/scanCode/index.vue'
import { GET_HOT_WORDS } from '@/api/index.js' // 假设这是你的 API 文件路径

export default {
  name: 'SearchBar',
  // components: { ScanCode },
  data() {
    return {
      hotWords: [], // 热词列表
      currentHotWord: '', // 当前显示的热词
      loopTimer: null, // 热词轮播定时器
    }
  },
  methods: {
    navigateToSearch() {
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: '/pagesC/searchGoods/index?keyword=' + this.currentHotWord,
      })
      // #endif
      // #ifdef H5
      this.$dsBridge.call('gotoPageThroughRoute', {
        page: '/home/search?scene=5&keyword=' + this.currentHotWord,
      })
      // #endif
    },
    // 获取热词列表
    async getHotWords() {
      try {
        const { data } = await GET_HOT_WORDS()
        this.hotWords = data.data || []
        this.startHotWordLoop() // 获取到热词后开始轮播
      } catch (error) {
        console.error('获取热词失败:', error)
      }
    },

    // 开始热词轮播
    startHotWordLoop() {
      if (this.hotWords.length > 0) {
        let currentIndex = 0
        this.currentHotWord = this.hotWords[currentIndex] // 初始化显示第一个热词
        this.loopTimer = setInterval(() => {
          currentIndex = (currentIndex + 1) % this.hotWords.length
          this.currentHotWord = this.hotWords[currentIndex]
        }, 5000) // 每 5 秒切换一次
      }
    },
  },
  created() {
    this.getHotWords()
  },
  beforeDestroy() {
    clearInterval(this.loopTimer)
    this.loopTimer = null
  },
}
</script>

<style lang="scss">
.search-bar {
  width: 100%;
  border-radius: 18px;
  border: 3rpx solid #fe2442;

  &__input {
    width: 100%;
    height: 63rpx;
    border-radius: 35rpx;
    background: white;
    display: flex;
    align-items: center;
    padding: 3rpx;
  }

  &__placeholder {
    color: #1f1f1f;
    font-size: 27rpx;
    margin-left: 20rpx;
    display: flex;
    align-items: center;
    font-weight: 300;
  }

  &__divider {
    width: 2rpx;
    height: 35rpx;
    background-color: #dddddd;
    margin: 0 20rpx;
  }

  &__text {
    font-size: inherit;
    color: inherit;
  }

  &__button {
    background-color: #fe2442;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 88rpx;
    height: 54rpx;
    border-radius: 27rpx;
    margin-left: auto;
    margin-right: 5rpx;
  }

  &__icon {
    width: 20px;
    height: 20px;
  }
}
</style>
