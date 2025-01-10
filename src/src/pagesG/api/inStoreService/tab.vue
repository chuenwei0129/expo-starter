<template>
  <view class="page">
    <scroll-view
      scroll-y
      class="scroll-view"
      :scroll-top="scrollTop"
      @scroll="onScroll"
    >
      <!-- 顶部内容 -->
      <view
        ref="header"
        class="header"
      >
        顶部内容
      </view>

      <!-- Tab部分 -->
      <view
        ref="tabContainer"
        :class="['tab-container', { 'sticky': isSticky }]"
      >
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
        <view
          v-for="(item, index) in list"
          :key="index"
          class="item"
        >
          {{ item }}
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      list: Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`),
      tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
      scrollTop: 0, // 当前滚动位置
      tabTop: 0, // Tab 距离顶部的实际位置
      isSticky: false, // 控制吸顶状态
      activeTab: 0, // 当前激活的 Tab
      headerHeight: 0,
    }
  },
  mounted () {
    this.calculateTabTop()
    this.calculateHeaderHeight()
  },
  methods: {
    calculateTabTop () {
      const query = uni.createSelectorQuery().in(this)
      query
        .select('.tab-container')
        .boundingClientRect((res) => {
          if (res) {
            this.tabTop = res.top // 动态更新Tab的距离
          }
        })
        .exec()
    },
    calculateHeaderHeight () {
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
    onScroll (event) {
      const { scrollTop } = event.detail
      this.scrollTop = scrollTop

      // 判断是否需要吸顶
      this.isSticky = scrollTop >= this.headerHeight

      // 更新当前激活的 Tab
      // 可以根据实际需求实现，例如根据每个内容块的位置计算
      // 这里简化处理，仅根据滚动位置大致判断
      const contentItemHeight = 40 // 假设每个 item 高度为 40
      const currentTab = Math.floor((scrollTop - this.headerHeight) / (contentItemHeight * 10))
      this.activeTab = Math.max(0, Math.min(currentTab, this.tabs.length - 1))
    },
    scrollToTab (index) {
      this.activeTab = index
      // 计算滚动位置，这里需要根据每个 Tab 对应的内容块高度进行计算
      // 这里简化处理，仅滚动到 Tab 顶部
      this.scrollTop = this.tabTop
      // 或者滚动到对应内容块
      // this.scrollTop = this.headerHeight + index * (contentItemHeight * 10)
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
  display: flex; /* 使用 flex 布局 */
}
.tab {
  padding: 10px;
  text-align: center;
  border-bottom: 2px solid transparent;
  flex: 1; /* 平均分配宽度 */
}
.tab.active {
  border-bottom-color: #007aff; /* 激活状态的下边框颜色 */
}
.content {
  padding: 10px;
}
.item {
  margin: 10px 0;
  background: #f9f9f9;
  padding: 10px;
  height: 40px; /* 假设高度 */
}

/* 吸顶样式 */
.sticky {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
</style>
