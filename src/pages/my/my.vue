<template>
  <view class="page">
    <view ref="header" class="header"> NavBar </view>
    <!-- 下拉刷新动画 -->
    <view v-if="isRefreshing" class="refresh-animation">
      <image src="/static/refresh.gif" mode="aspectFit" class="gif" />
      <text class="refresh-text">胖胖努力中...</text>
    </view>
    <scroll-view
      scroll-y
      class="scroll-view"
      :scroll-top="scrollTop"
      @scroll="throttledScroll"
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
      @refresherrestore="onRestore"
      refresher-default-style="none"
      @scrolltolower="onScrollToLower"
    >
      <!-- 顶部内容 -->
      <view ref="header" class="header"> 顶部内容 </view>

      <!-- Tab部分 -->
      <view
        ref="tabContainer"
        :class="['tab-container', { sticky: isSticky }]"
        :style="stickyStyle"
      >
        <u-tabs
          :list="tabs"
          :current="activeTab"
          @change="scrollToTab"
        ></u-tabs>
      </view>

      <!-- 内容区域 -->
      <view class="content">
        <view v-for="(item, index) in list" :key="index" class="item">
          {{ item }}
        </view>
      </view>

      <!-- 上拉加载动画 -->
      <view v-if="isLoading" class="loading-animation">
        <image
          src="https://frontend-cdn.chongpangpang.com/image/cpp-static/prod/ui/cpp_h5_loading.png"
          mode="scaleToFill"
          class="loading-gif"
        />
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 数据到底提示 -->
      <view v-if="isEnd" class="end-text">已经到底了喵</view>
    </scroll-view>
  </view>
</template>

<script>
import { throttle } from 'lodash'

export default {
  data() {
    return {
      list: Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`),
      tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
      scrollTop: 0,
      tabTop: 0,
      isSticky: false,
      activeTab: 0,
      headerHeight: 0,
      isRefreshing: false,
      isLoading: false,
      isEnd: false,
      tabContainerHeight: 0,
    }
  },
  computed: {
    stickyStyle() {
      if (this.isSticky) {
        return {
          transform: `translate3d(0, ${
            this.scrollTop - this.headerHeight
          }px, 0)`,
          height: `${this.tabContainerHeight}px`,
        }
      }
      return {}
    },
  },
  mounted() {
    this.calculateTabTop()
    this.calculateHeaderHeight()
    this.calculateTabContainerHeight()
  },
  methods: {
    calculateTabTop() {
      const query = uni.createSelectorQuery().in(this)
      query
        .select('.tab-container')
        .boundingClientRect((res) => {
          if (res) {
            this.tabTop = res.top
          }
        })
        .exec()
    },
    calculateHeaderHeight() {
      const query = uni.createSelectorQuery().in(this)
      query
        .select('.header')
        .boundingClientRect((res) => {
          if (res) {
            this.headerHeight = res.height
          }
        })
        .exec()
    },
    calculateTabContainerHeight() {
      const query = uni.createSelectorQuery().in(this)
      query
        .select('.tab-container')
        .boundingClientRect((res) => {
          if (res) {
            this.tabContainerHeight = res.height
          }
        })
        .exec()
    },
    onScroll(event) {
      const { scrollTop } = event.detail
      this.scrollTop = scrollTop
      // 判断是否需要吸顶
      this.isSticky = scrollTop >= this.headerHeight

      // 找到当前激活的 Tab
      this.updateActiveTab()
    },
    throttledScroll: throttle(function (event) {
      this.onScroll(event)
    }, 500),
    updateActiveTab() {
      const itemEls = document.querySelectorAll('.item')
      if (!itemEls.length) return
      let activeIndex = 0
      itemEls.forEach((itemEl, index) => {
        const rect = itemEl.getBoundingClientRect()
        if (rect.top <= this.tabTop + this.tabContainerHeight) {
          activeIndex = index
        }
      })
      const tabIndex = Math.floor(activeIndex / 10)
      this.activeTab = Math.max(0, Math.min(tabIndex, this.tabs.length - 1))
    },
    scrollToTab(index) {
      this.activeTab = index
      this.scrollTop = this.tabTop
    },
    onRefresh() {
      this.isRefreshing = true
      // 模拟数据刷新
      setTimeout(() => {
        this.list = Array.from(
          { length: 30 },
          (_, i) => `Refreshed Item ${i + 1}`
        )
        this.isRefreshing = false
        this.isEnd = false // 重置数据到底状态
      }, 2000)
    },
    onRestore() {
      this.isRefreshing = false
    },
    onScrollToLower() {
      if (this.isLoading || this.isEnd) return // 防止重复加载

      this.isLoading = true
      // 模拟数据加载
      setTimeout(() => {
        const newItems = Array.from(
          { length: 10 },
          (_, i) => `New Item ${this.list.length + i + 1}`
        )
        this.list = [...this.list, ...newItems]
        this.isLoading = false

        // 假设数据加载到底
        if (this.list.length >= 50) {
          this.isEnd = true
        }
      }, 2000)
    },
  },
}
</script>

<style scoped>
.page {
  height: 100vh;
}
.scroll-view {
  height: 100%;
}
.header {
  height: 300px;
  background-color: #f5f5f5;
  text-align: center;
  line-height: 200px;
}
.tab-container {
  background-color: #fff;
  z-index: 10;
  transition: transform 0.2s ease-out, height 0.2s ease-out;
}

.content {
  padding: 10px;
}

.item {
  margin: 10px 0;
  background: #f9f9f9;
  padding: 10px;
  height: 40px;
}

/* 吸顶样式 */
.sticky {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}

/* 下拉刷新动画 */
.refresh-animation {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  padding-top: 40px; /* 添加顶部内边距，避免贴顶 */
}
.gif {
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
}
.refresh-text {
  text-align: center;
  color: #666;
}

/* 上拉加载动画 */
.loading-animation {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
.loading-gif {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
}
.loading-text {
  text-align: center;
}

/* 数据到底提示 */
.end-text {
  text-align: center;
  padding: 20px;
  color: #999;
}
</style>
