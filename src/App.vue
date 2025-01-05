<script>
export default {
  globalData: {
    statusBarHeight: 0, // 状态导航栏高度
    navHeight: 0, // 总体高度
    navBarHeight: 0, // 导航栏高度(标题栏高度)
    h5NavBarFullHeight: 0, //H5 App导航栏高度(包含状态栏)
    h5NavBarHeight: 0, //H5 App导航栏高度(不包含状态栏)
    h5StatusBarHeight: 0, //H5 App状态栏高度
    windowWidth: 0, // 可使用窗口字宽度
    windowHeight: 0, // 可使用窗口高度
    menuButtonLeft: 0, //胶囊按钮X轴坐标
    MenuButtonPadding: 0, //胶囊按钮左右间距
    menuButtonWidth: 0, //胶囊按钮宽度(包含了左右间距)
    bottomSafeAreaHeight: 0, //底部安全距离
    h5BottomSafeAreaHeight: 0, //APP底部安全距离
  },
  onLaunch: function () {
    console.log('App Launch')
    // 状态栏高度
    this.globalData.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
    this.globalData.windowHeight = uni.getSystemInfoSync().windowHeight
    this.globalData.windowWidth = uni.getSystemInfoSync().windowWidth
    this.globalData.bottomSafeAreaHeight =
      uni.getSystemInfoSync().safeAreaInsets.bottom
    // #ifdef MP-WEIXIN
    // 获取微信胶囊的位置信息 width,height,top,right,left,bottom
    const custom = wx.getMenuButtonBoundingClientRect()
    this.globalData.menuButtonLeft = custom.left
    this.globalData.menuButtonPadding =
      this.globalData.windowWidth - custom.right
    this.globalData.menuButtonWidth =
      custom.width + this.globalData.menuButtonPadding * 2

    // 导航栏高度(标题栏高度) = 胶囊高度 + (顶部距离 - 状态栏高度) * 2
    this.globalData.navBarHeight =
      custom.height + (custom.top - this.globalData.statusBarHeight) * 2

    // 总体高度 = 状态栏高度 + 导航栏高度
    this.globalData.navHeight =
      this.globalData.navBarHeight + this.globalData.statusBarHeight
    // #endif
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import 'uview-ui/index.scss';
</style>
