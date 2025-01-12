export const LocationPermissionStatus = Object.freeze({
  FETCHING: -1, // 正在请求权限
  GRANTED: 1, // 权限已授予
  DENIED: 0, // 权限被拒绝 / 权限未知
})
