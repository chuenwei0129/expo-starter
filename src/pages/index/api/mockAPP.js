// mockAPP.js
const mockAPP = {
  // 模拟调用方法的存储
  registeredCallbacks: {},

  // 422179060978331648

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
        setTimeout(() => {
          console.log('模拟跳转到定位权限设置...')
          this.permission = 1
        }, 2000)
      },

      startOnceLocation: () => {
        // 模拟单次定位
        setTimeout(() => {
          console.log('定位完成:', this.locationData)
          this.invokeRegisteredCallback('locationCallback', this.locationData)
        }, 2000)
      },
    }

    const handler = methodHandlers[method]
    if (handler) {
      handler()
    } else {
      console.warn(`未实现的方法: ${method}`)
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
