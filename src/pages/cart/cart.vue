<template>
  <view class="page">
    <scroll-view
      scroll-y
      class="scroll-view"
      :scroll-top="scrollTop"
      @scroll="onScroll"
    >
      <!-- 顶部内容 -->
      <view ref="header" class="header"> 顶部内容 </view>

      <!-- Tab部分 -->
      <view ref="tabContainer" class="tab-container">
        <view
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab"
          :class="{ active: activeTab === index }"
          @tap="scrollToTab(index)"
        >
          {{ tab }}
        </view>
      </view>

      <!-- 内容区域 -->
      <view class="content">
        <view v-for="(item, index) in list" :key="index" class="item">
          {{ item }}
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`),
      tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
      scrollTop: 0, // 当前滚动位置
      tabTop: 0, // Tab 距离顶部的实际位置
      activeTab: 0, // 当前激活的 Tab
      headerHeight: 0,
      contentItemHeight: 40, // 假设每个 item 高度为 40
    }
  },
  mounted() {
    this.calculateTabTop()
    this.calculateHeaderHeight()
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
    onScroll(event) {
      const { scrollTop } = event.detail
      this.scrollTop = scrollTop
      this.updateActiveTab()
    },
    updateActiveTab() {
      const currentTab = Math.floor(
        (this.scrollTop - this.headerHeight) / (this.contentItemHeight * 10)
      )
      this.activeTab = Math.max(0, Math.min(currentTab, this.tabs.length - 1))
    },
    scrollToTab(index) {
      this.activeTab = index
      // 计算滚动位置，滚动到 Tab 顶部
      this.scrollTop = this.tabTop
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
  height: 200px;
  background-color: #f5f5f5;
  text-align: center;
  line-height: 200px;
}
.tab-container {
  background-color: #fff;
  z-index: 10;
  display: flex;
}
.tab {
  padding: 10px;
  text-align: center;
  border-bottom: 2px solid transparent;
  flex: 1;
}
.tab.active {
  border-bottom-color: #007aff;
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
</style>
