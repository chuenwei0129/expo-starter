<template>
  <view class="search-bar" @click="$u.debounce(goToSearchPage, 500)">
    <view class="search-bar__input">
      <view class="search-bar__placeholder">
        <!-- <scan-code color="red" /> -->
        <view class="search-bar__divider" />
        <transition name="fade-slide-up">
          <text v-if="showText" class="search-bar__text">
            {{ currentKeyword }}
          </text>
        </transition>
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
import ScanCode from '@/components/scanCode/index.vue'
import { fetchHotWordAPI } from './api/mockAPI'
// import { fetchHotWordAPI } from './api/inStoreService'
import { action_report } from '@/utils/track'

export default {
  name: 'SearchBar',
  components: { ScanCode },
  data() {
    return {
      hotKeywords: [], // 热词列表
      currentKeyword: '搜你想要的到店服务名称', // 当前显示的热词
      loopTimer: null, // 热词轮播定时器
      rollTime: 5000, // 轮播时间间隔
      showText: true, // 控制文本显示
    }
  },
  mounted() {
    this.fetchHotWordData()
  },
  beforeDestroy() {
    clearInterval(this.loopTimer)
    this.loopTimer = null
  },
  methods: {
    goToSearchPage() {
      action_report({
        action_name: 'service_search_click',
        module_name: 'service',
        extend: {
          user_id: this.$dsBridge.call('getUserId', 'getUserId'),
        },
      })

      this.$dsBridge.call('gotoPageThroughRoute', {
        page: '/home/search?scene=5&keyword=' + this.currentKeyword,
      })
    },
    // 获取热词列表
    async fetchHotWordData() {
      const resp = await fetchHotWordAPI()
      this.hotKeywords = resp.data.hotWords || []
      this.rollTime = resp.data.rollTime * 1000
      this.startKeywordRotation() // 获取到热词后开始轮播
    },

    // 开始热词轮播
    startKeywordRotation() {
      if (this.hotKeywords.length > 0) {
        let currentIndex = 0
        this.currentKeyword = this.hotKeywords[currentIndex] // 初始化显示第一个热词
        this.loopTimer = setInterval(() => {
          currentIndex = (currentIndex + 1) % this.hotKeywords.length
          // 使用 nextTick 确保 DOM 更新后再触发动画
          this.showText = false
          this.$nextTick(() => {
            this.currentKeyword = this.hotKeywords[currentIndex]
            this.showText = true
          })
        }, this.rollTime) // 每 5 秒切换一次
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/utils/fn.scss';
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
    @include ellipsis(500rpx);
    font-size: inherit;
    color: #666666;
    max-height: 63rpx; // 限制高度，防止溢出
    overflow: hidden;
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

// 过渡动画
.fade-slide-up-enter-active,
.fade-slide-up-leave-active {
  transition: all 1s ease; // 增加过渡时间到 1s
}

.fade-slide-up-enter,
.fade-slide-up-leave-to {
  opacity: 0; // 初始和结束时完全透明
  transform: translateY(50%); // 从下方 50% 进入
}

.fade-slide-up-leave-to {
  opacity: 0;
  transform: translateY(-50%); // 向上方 50% 消失
}
</style>
