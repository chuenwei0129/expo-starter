export const PermissionStatus = Object.freeze({
  FETCHING: -1, // 正在请求权限
  GRANTED: 1, // 权限已授予
  DENIED: 0, // 权限被拒绝 / 权限未确定（未知）
})

export default {
  data() {
    return {
      sharedValue: '我是 mixin 的数据',
      locationInfo: {
        address: '',
        cityCode: '',
        cityName: '',
        lon: '',
        lat: '',
        province: '',
        provinceCode: '',
        county: '',
        countyCode: '',
      },
    }
  },
  onShow() {
    console.log('Mixin 的 onShow 生命周期')
  },
  methods: {
    sharedMethod() {
      console.log('这是 mixin 的方法')
    },
  },
}
