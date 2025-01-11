export const LocationPermissionStatus = Object.freeze({
  FETCHING: -1, // 正在请求定位权限
  GRANTED: 1, // 权限已授予
  DENIED: 0, // 权限被拒绝 / 状态未确定（未知）
})
