<template>
  <div class="city">
    <h1>City Page</h1>
    <button @click="navigateToWithQuery">部分参数</button>
    <button @click="navigateToWithState">全部参数</button>
  </div>
</template>

<script>
export default {
  methods: {
    navigateToWithQuery() {
      const params = {
        province: '',
        cityName: '南京市',
        address: '',
        cityCode: '3302',
        county: '',
        lat: '', // 纬度
        lon: '', // 经度
      }
      uni.navigateTo({
        url: `/pages/index/index?${JSON.stringify(params)}`,
      })
    },
    navigateToWithState() {
      const params = {
        province: '',
        cityName: '南京市',
        address: '步步高大撒',
        cityCode: '3302',
        county: '',
        lat: '0.0000', // 纬度
        lon: '0.000', // 经度
      }
      uni.navigateTo({
        url: `/pages/index/index?${JSON.stringify(params)}`,
      })
    },
  },
}
</script>

<style lang="scss"></style>
