<template>
  <view>
    <!-- 滚动区域 -->
    <scroll-view
      :scroll-y="true"
      :scroll-top="scrollTop"
      @scroll="handleScroll"
      style="height: 100vh"
    >
      <view
        v-for="(section, index) in sections"
        :key="index"
        :ref="'section-' + index"
        class="content-section"
      >
        <view class="section-title">{{ section.title }}</view>
        <view class="section-content">{{ section.content }}</view>
      </view>

      <view
        v-for="(section, index) in sections"
        :key="index"
        :ref="'section-' + index"
        class="content-section"
      >
        <view class="section-title">{{ section.title }}</view>
        <view class="section-content">{{ section.content }}</view>
      </view>
      <!-- Tab 区域 -->
      <view class="tab-container" ref="tabContainer">
        <view
          v-for="(tab, index) in tabs"
          :key="index"
          :class="['tab-item', { active: activeTab === index }]"
          @click="handleTabClick(index)"
        >
          {{ tab.name }}
        </view>
      </view>

      <view
        v-for="(section, index) in sections"
        :key="index"
        :ref="'section-' + index"
        class="content-section"
      >
        <view class="section-title">{{ section.title }}</view>
        <view class="section-content">{{ section.content }}</view>
      </view>

      <!-- 内容区域 -->
      <view
        v-for="(section, index) in sections"
        :key="index"
        :ref="'section-' + index"
        class="content-section"
      >
        <view class="section-title">{{ section.title }}</view>
        <view class="section-content">{{ section.content }}</view>
      </view>
    </scroll-view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      tabs: [{ name: 'Tab 1' }, { name: 'Tab 2' }, { name: 'Tab 3' }],
      sections: [
        { title: 'Section 1', content: 'Content of Section 1' },
        { title: 'Section 2', content: 'Content of Section 2' },
        { title: 'Section 3', content: 'Content of Section 3' },
      ],
      activeTab: 0, // 当前激活的 tab 索引
      scrollTop: 0, // 滚动位置
    }
  },
  methods: {
    handleTabClick(index) {
      this.activeTab = index
      const section = this.$refs[`section-${index}`]
      if (section && section[0]) {
        const top = section[0].offsetTop // 获取目标锚点位置
        this.scrollTop = top
      }
    },
    handleScroll(event) {
      const scrollTop = event.detail.scrollTop

      // 自动切换 Tab
      for (let i = 0; i < this.sections.length; i++) {
        const section = this.$refs[`section-${i}`]
        if (section && section[0]) {
          const rect = section[0].getBoundingClientRect()
          if (rect.top >= 0 && rect.top < 100) {
            this.activeTab = i
            break
          }
        }
      }
    },
  },
}
</script>
<style scoped>
.tab-container {
  display: flex;
  background-color: #fff;
  z-index: 10;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  position: sticky;
  top: 0;
}
.tab-item {
  flex: 1;
  text-align: center;
  padding: 10px;
  cursor: pointer;
}
.tab-item.active {
  font-weight: bold;
  color: #007aff;
  border-bottom: 2px solid #007aff;
}
.content-section {
  padding: 20px;
  border-bottom: 1px solid #ddd;
}
</style>
