<template>
  <view class="no-data-container">
    <img
      class="no-data-image"
      :src="img"
      alt="No Data"
    >
    <p class="no-data-text">
      {{ noDataText }}
    </p>
    <slot name="button" />
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
      default: 'https://frontend-cdn.chongpangpang.com/image/qykimg2/default.png', // Provide a default image URL
    },
  },
}
</script>

<style lang="scss" scoped>
.no-data-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; // Center content vertically as well
  padding: 20rpx; // Add some padding around the content
  height: 100%; // Ensure the container takes up the full height available

  .no-data-image {
    width: 346rpx;
    height: 346rpx;
    margin-bottom: 20rpx; // Add margin between image and text
  }

  .no-data-text {
    color: #999;
    font-size: 26rpx;
    line-height: 1.5;
    margin-bottom: 20rpx; // Add margin between text and button slot
    text-align: center;
  }
}
</style>
