uni.addInterceptor({
  returnValue(res) {
    if (
      !(
        !!res &&
        (typeof res === 'object' || typeof res === 'function') &&
        typeof res.then === 'function'
      )
    ) {
      return res
    }
    return new Promise((resolve, reject) => {
      res.then((res) => (res[0] ? reject(res[0]) : resolve(res[1])))
    })
  },
})

/**
 * 获取到店服务页资源区数据
 * @param {Object} data - 请求参数对象
 * @param {string} data.cityCode - 必传，城市编码
 * @param {number} data.lng - 必传，经度
 * @param {number} data.lat - 必传，纬度
 * @param {string} data.fromChannel - 必传，来源渠道
 * @returns {Promise} 返回一个 Promise 对象，包含请求的结果
 * @example
 * fetchResourceAPI({
 *   cityCode: '3301',
 *   lng: 121.45712,
 *   lat: 31.229234,
 *   fromChannel: 'APP'
 * })
 */
export const fetchResourceAPI = () =>
  uni.request({
    url: 'https://run.mocky.io/v3/9a5a309d-ee2d-485c-88ba-40bfaafa688d',
    method: 'GET',
  })

/**
 * 获取优惠券列表数据
 * @param {Object} data - 请求参数对象
 * @param {string} data.userId - 必传，用户 id
 * @param {number} data.status - 必传，优惠券状态（5 - 待核销）
 * @returns {Promise} 返回一个 Promise 对象，包含请求的结果
 * @example
 * fetchCouponListAPI({
 *   userId: '401211901598814208',
 *   status: 5
 * })
 */
export const fetchCouponListAPI = () =>
  uni.request({
    url: 'https://run.mocky.io/v3/db110a65-cb24-4d2e-883f-546cc573ea5b',
    method: 'GET',
  })

/**
 * 获取到店服务组件区数据
 * @param {Object} data - 请求参数对象
 * @param {number} data.page - 必传，页面标识，2 表示到店服务
 * @returns {Promise} 返回一个 Promise 对象，包含请求的结果
 * @example
 * fetchComponentListAPI({
 *   page: 2
 * })
 */
export const fetchComponentListAPI = () =>
  uni.request({
    url: 'https://run.mocky.io/v3/e488aa72-a786-4384-982d-11f07801ecb1',
    method: 'GET',
  })

/**
 * 获取到店服务金刚区导航数据
 * @param {Object} data - 请求参数对象
 * @param {string} data.displayChannel - 必传，展示渠道，'APP_MP'
 * @param {number} data.bizType - 必传，业务场景类型，2 表示到店服务金刚区
 * @returns {Promise} 返回一个 Promise 对象，包含请求的结果
 * @example
 * fetchNavigationAPI({
 *   displayChannel: 'APP_MP',
 *   bizType: 2
 * })
 */
export const fetchNavigationAPI = () =>
  uni.request({
    url: 'https://run.mocky.io/v3/8a36cafb-6415-40d0-975c-65af0941c852',
    method: 'GET',
  })

/**
 * 获取推荐类目数据
 * @param {Object} data - 请求参数对象
 * @param {number} data.recommendType - 必传，推荐类型（1 - 类目区）
 * @param {number} data.commodityClassifyType - 必传，商品类型（2 - 服务商品）
 * @returns {Promise} 返回一个 Promise 对象，包含请求的结果
 * @example
 * fetchRecommendClassifyAPI({
 *   recommendType: 1,
 *   commodityClassifyType: 2
 * })
 */
export const fetchRecommendClassifyAPI = () =>
  uni.request({
    url: 'https://run.mocky.io/v3/23d37888-8ad7-47d2-9bcd-def92b734b0b',
    method: 'GET',
  })

/**
 * 获取商品列表数据
 * @param {Object} data - 请求参数对象
 * @param {number} data.pageNum - 必传，页码
 * @param {number} data.pageSize - 必传，每页大小
 * @param {string} data.cityCode - 必传，城市编码
 * @param {number} data.lng - 必传，经度
 * @param {number} data.lat - 必传，纬度
 * @param {string[]} [data.categoryIds] - 非必传，类目 ID，不传为推荐区，传了为类目区
 * @param {number} data.sortType - 必传，排序类型（1、智能排序 2、距离优先 3、销量优先 4、低价优先 5、高价优先）
 * @param {string} data.fromChannel - 必传，来源渠道（例如：'APP'）
 * @returns {Promise} 返回一个 Promise 对象，包含请求的结果
 * @example
 * fetchProductListAPI({
 *   pageNum: 1,
 *   pageSize: 2,
 *   cityCode: '3301',
 *   lng: 121.45712,
 *   lat: 31.229234,
 *   categoryIds: ['1730416863288217602'],
 *   sortType: 2,
 *   fromChannel: 'APP'
 * })
 */
export const fetchProductListAPI = () =>
  uni.request({
    url: 'https://run.mocky.io/v3/105535ea-f63e-40fa-9352-c1e314ff8554',
    method: 'GET',
  })

/**
 * 获取当前城市门店信息
 * @param {Object} data - 请求参数对象
 * @param {string} data.cityCode - 必传，城市编码
 * @param {number} data.bizType - 必传，业务类型，3 表示到店服务
 * @returns {Promise} 返回一个 Promise 对象，包含请求的结果
 * @example
 * fetchShopByCityAPI({
 *   cityCode: '3301',
 *   bizType: 3
 * })
 */
export const fetchShopByCityAPI = () =>
  uni.request({
    url: 'https://run.mocky.io/v3/9c20e0a5-88b1-49af-ba6e-0cc4e5605692',
    method: 'GET',
  })

/**
 * 获取热词搜索数据
 * @param {Object} data - 请求参数对象
 * @param {number} data.type - 必传，热词类型，14 表示热词搜索
 * @returns {Promise} 返回一个 Promise 对象，包含请求的结果
 * @example
 * fetchHotWordAPI({
 *   type: 14
 * })
 */
export const fetchHotWordAPI = () =>
  uni.request({
    url: 'https://run.mocky.io/v3/8a0be7a8-6409-428a-9955-ccea3269e069',
    method: 'GET',
  })

/**
 * 获取到店服务城市列表
 * @param {Object} data - 请求参数对象
 * @param {number} data.bizType - 必传，业务类型，3：到店服务
 * @param {number} data.lng - 必传，经度
 * @param {number} data.lat - 必传，纬度
 * @returns {Promise} 返回一个 Promise 对象，包含请求的结果
 * @example
 * fetchHasShopCityList({
 *   bizType: 3,
 *   lng: 121.45712,
 *   lat: 31.229234,
 * })
 */
export const fetchHasShopCityListAPI = () =>
  uni.request({
    url: 'https://run.mocky.io/v3/cfa99c3b-5283-48af-bbd7-d5a7512b5824',
    method: 'GET',
  })
