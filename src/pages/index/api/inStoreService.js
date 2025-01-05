import { Http } from '@/utils/http'
const { request } = new Http()

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
export const fetchResourceAPI = (
  data = {
    // 测试数据
    cityCode: '3301',
    lng: 121.45712,
    lat: 31.229234,
    fromChannel: 'APP',
  }
) =>
  request({
    url: 'presentation/customer/inStoreService/resource',
    method: 'POST',
    data,
    cqm: true,
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
export const fetchCouponListAPI = (
  // 测试数据
  data = {
    userId: '401211901598814208',
    status: 5,
  }
) =>
  request({
    url: 'presentation/customer/online-offline/v1/order/service/list',
    method: 'POST',
    data,
    cqm: true,
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
export const fetchComponentListAPI = (
  data = {
    page: 2,
  }
) =>
  request({
    url: 'presentation/customer/app/home/listComponent',
    method: 'POST',
    data,
    cqm: true,
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
export const fetchNavigationAPI = (
  data = {
    displayChannel: 'APP_MP',
    bizType: 2,
  }
) =>
  request({
    url: 'presentation/customer/app/homepage/v3/navigationArea',
    method: 'POST',
    data,
    cqm: true,
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
export const fetchRecommendClassifyAPI = (
  data = {
    recommendType: 1, // 推荐类型 => 1：类目区 2：推荐区 3：资源位
    commodityClassifyType: 2, // 商品类型 => 1：实物商品 2：服务商品 3：活体商品
  }
) =>
  request({
    url: 'presentation/customer/app/homepage/v2/recommendClassify',
    method: 'POST',
    data,
    cqm: true,
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
export const fetchProductListAPI = (
  data = {
    pageNum: 1,
    pageSize: 2,
    cityCode: '3301',
    lng: 121.45712,
    lat: 31.229234,
    categoryIds: ['1730416863288217602'],
    sortType: 2,
    fromChannel: 'APP',
  }
) =>
  request({
    url: 'presentation/customer/inStoreService/productList',
    method: 'POST',
    data,
    cqm: true,
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
export const fetchShopByCityAPI = (
  data = {
    // 测试数据
    cityCode: '3301',
    bizType: 3, // 业务类型，1：美洗，2：挂号，3：到店服务
  }
) =>
  request({
    url: 'presentation/customer/applet/shop/shopByCity',
    method: 'POST',
    data,
    cqm: true,
  })
