<script>
export default {
  name: 'navBar',
  props: {
    title: {
      type: String,
      default: '',
    },
    titleColor: {
      type: String,
      default: '#000',
    },
    showBackBtn: {
      type: Boolean,
      default: false,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    titleSize: {
      type: Number,
      default: 35,
    },
    navColor: {
      type: String,
      default: '',
    },
    //是否适用白色返回按钮
    whiteBack: {
      type: Boolean,
      default: false,
    },
    customback: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      statusBarHeight: getApp().globalData.statusBarHeight + 'px',
      navHeight: getApp().globalData.navHeight + 'px',
      navBarHeight: getApp().globalData.navBarHeight + 'px',
      menuButtonWidth: '',
      titleWidth: '',
    }
  },
  computed: {
    navColorStyle() {
      let style = {}
      if (this.$props.navColor.length) {
        style.backgroundColor = this.$props.navColor
      }
      return style
    },
  },
  methods: {
    navBackClickHandle() {
      // #ifdef MP-WEIXIN
      let pages = getCurrentPages() //页面对象
      if (pages.length == 1) {
        uni.switchTab({ url: '/pages/mall/index' })
        return
      }
      // #endif
      if (this.customback) {
        this.$emit('navBackClickHandle')
      } else {
        this.$emit('navBackClickHandle')
        // #ifdef MP-WEIXIN
        uni.navigateBack({
          fail: (result) => {
            uni.switchTab({ url: '/pages/mall/index' })
          },
        })
        // #endif
      }
    },
  },
  mounted() {
    //#ifdef MP-WEIXIN
    uni.getSystemInfo({
      success: (res) => {
        this.statusBarHeight = res.statusBarHeight + 'px'
      },
    })
    this.navBarHeight = getApp().globalData.navBarHeight + 'px'
    this.navHeight = getApp().globalData.navHeight + 'px'
    //#endif
    //#ifdef H5
    this.statusBarHeight = getApp().globalData.h5StatusBarHeight + 'px'
    this.navBarHeight = getApp().globalData.h5NavBarHeight + 'px'
    let h5NavHeight =
      Number(getApp().globalData.h5StatusBarHeight) +
      Number(getApp().globalData.h5NavBarHeight)
    this.navHeight = h5NavHeight + 'px'
    //#endif
    this.menuButtonWidth = getApp().globalData.menuButtonWidth + 'px'
    this.titleWidth = `calc(85vw - ${this.navBarHeight} - ${this.menuButtonWidth})`
  },
}
</script>

<template>
  <view class="header" :style="[{ height: navHeight }, navColorStyle]">
    <view :style="{ height: statusBarHeight }"></view>
    <view
      class="navbar-wrapper"
      :style="{
        height: navBarHeight,
        color: titleColor,
        fontSize: titleSize,
      }"
    >
      <view v-if="showTitle" :style="{ maxWidth: titleWidth }" class="title">{{
        title
      }}</view>
      <view
        class="back-wrapper"
        v-if="showBackBtn"
        :style="{ width: `${navBarHeight}`, height: `${navBarHeight}` }"
        @click="navBackClickHandle"
      >
        <image
          v-if="!whiteBack"
          mode="aspectFit"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index/back-black-tag.png"
        />
        <image
          v-else
          mode="aspectFit"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/change/return.png"
        />
      </view>
      <slot name="righticon" />
    </view>
  </view>
</template>

<style scoped lang="scss">
.header {
  text-align: center;

  .navbar-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    .title {
      font-size: 35rpx;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .back-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      justify-content: center;
      align-items: center;

      image {
        width: 22px;
        height: 22px;
      }
    }
  }
}
</style>
