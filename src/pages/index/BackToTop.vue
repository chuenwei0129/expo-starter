<template>
  <view
    class="back-to-top"
    :class="{ 'back-to-top--full-show': type === 1 }"
    @click="$emit('click')"
  >
    <slot name="icon">
      ▲
    </slot>
  </view>
</template>

<script>
export default {
  props: {
    // 从半显示到完全显示的切换时间，默认 1 秒
    fullShowTime: {
      type: Number,
      default: 1000,
    },
  },
  data () {
    return {
      // 1|0.5|0 完全显示|半显示|不显示
      type: 1,
      // 当前定时器
      timeout: null,
    }
  },
  methods: {
    isScroll () {
      // 如果页面正在滚动，则半显示
      if (this.type === 1) {
        this.type = 0.5
        this.timeout = setTimeout(() => {
          // 过指定时间之后，完全显示
          this.type = 1
        }, this.fullShowTime)
      } else {
        if (this.timeout) {
          // 如果在指定时间内，又触发了滚动事件，则清空定时器，重新计算时间
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            this.type = 1
          }, this.fullShowTime)
        }
      }
    },
  },
}
</script>

<style scoped>
/* TODO: 根据 UI 设计稿，调整样式 */
.back-to-top {
  position: fixed;
  bottom: 60px;
    /* width: 60px;
  height: 60px;
  background-color: #ecdcd7; */
  right: -38rpx; /* 初始状态，半隐藏（宽度为60px） */
  width: 76rpx;
  height: 76rpx;
  background: rgba(255,255,255,0.3);
  box-shadow: 0rpx 4rpx 15rpx 0rpx rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: right 0.3s, opacity 0.3s, transform 0.3s, background-color 0.3s;
  opacity: 0.8;
}

.back-to-top--full-show {
  right: 20px; /* 全部展示 */
  opacity: 1;
  transform: scale(1.1);
  background: #FFFFFF;
  box-shadow: 0rpx 4rpx 15rpx 0rpx rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
}
</style>
