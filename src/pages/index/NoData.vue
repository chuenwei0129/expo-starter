<template>
  <view class="no-data-page">
    <view class="no-data-container">
      <img class="no-data-image" :src="img" alt="No Data" />
      <p class="no-data-text">
        {{ noDataText }}
      </p>
      <slot name="button" />
    </view>
  </view>
</template>

<script>
export default {
  props: {
    noDataText: {
      type: String,
      default: '暂无数据',
    },
    img: {
      type: String,
      default:
        'https://frontend-cdn.chongpangpang.com/image/qykimg2/default.png', // Provide a default image URL
    },
  },
}
</script>

<style lang="scss" scoped>
.no-data-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: #fff;
}
.no-data-container {
  transform: translateY(-150rpx);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20rpx;

  .no-data-image {
    width: 240rpx;
    height: 240rpx;
    margin-bottom: 30rpx;
  }

  .no-data-text {
    color: #999;
    font-size: 26rpx;
    line-height: 1.5;
    margin-bottom: 30rpx;
    text-align: center;
  }
}
</style>
