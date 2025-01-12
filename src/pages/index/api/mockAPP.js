// mockAPP.js
const mockAPP = {
  // 模拟调用方法的存储
  registeredCallbacks: {},

  // 模拟定位数据
  locationData: {
    address: '北京市海淀区中关村大街27号',
    lat: 31.229234,
    lon: 121.45712,
    cityCode: '3304',
    cityName: '北京市',
    province: '北京市',
    provinceCode: '110000',
    countyCode: '110108',
    county: '海淀区',
  },

  permission: 1,
  userId: 'mock_user_id_123', // 模拟用户ID

  // 模拟 $dsBridge.call
  call(method, args, callback) {
    console.log(`调用方法: ${method}, 参数: ${args}`)

    const methodHandlers = {
      checkLocationPermission: () => {
        setTimeout(() => {
          console.log(`定位权限: ${this.permission ? '已授权' : '未授权'}`)
          if (callback) callback(JSON.stringify(this.permission))
        }, 500)
      },

      gotoLocationPermissionSet: () => {
        // 模拟跳转定位权限设置
        console.log('模拟跳转到定位权限设置...')
        this.permission = 1
      },

      startOnceLocation: () => {
        // 模拟单次定位
        console.log('定位完成:', this.locationData)
        setTimeout(() => {
          this.invokeRegisteredCallback('locationCallback', this.locationData)
        }, 3000)
      },

      getUserId: () => {
        // 模拟获取用户ID
        console.log(`获取用户ID: ${this.userId}`)
        return this.userId
      },

      getAddressInfo: () => {
        // 模拟获取地址信息
        console.log('获取地址信息:', this.locationData)
        if (this.permission === 0) return null
        return JSON.stringify(this.locationData)
      },

      closeCurrentWebview: () => {
        // 模拟关闭当前webview
        console.log('模拟关闭当前WebView')
        return 'WebView关闭成功'
      },

      gotoPageThroughRoute: (route) => {
        console.log('🚀 ~ call ~ route:', route)
        return `跳转到路由: ${route}`
      },
    }

    const handler = methodHandlers[method]
    if (handler) {
      const result = handler()
      if (callback && method !== 'checkLocationPermission') {
        callback(result)
      }
      return result
    } else {
      console.warn(`未实现的方法: ${method}`)
      return `未实现的方法: ${method}`
    }
  },

  // 模拟 $dsBridge.register
  register(event, callback) {
    console.log(`注册事件: ${event}`)
    this.registeredCallbacks[event] = callback
  },

  // 调用注册的回调
  invokeRegisteredCallback(event, data) {
    const callback = this.registeredCallbacks[event]
    if (callback) {
      console.log(`触发回调: ${event}, 数据: ${data}`)
      callback(data)
    } else {
      console.warn(`未注册的回调: ${event}`)
    }
  },
}

export default mockAPP
