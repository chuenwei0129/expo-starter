export const LocationPermissionStatus = Object.freeze({
  UNDETERMINED: 0, // 状态未确定（未知）
  FETCHING: 1, // 正在请求定位权限
  GRANTED: 2, // 权限已授予
  DENIED: 3, // 权限被拒绝
})
