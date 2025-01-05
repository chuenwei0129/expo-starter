<template>
  <view class="after-sale-input-logistics-content">
    <text style="color: #333333; font-size: 27rpx"
      >超过7天未提交则视为退款失败</text
    >
    <view v-if="hasGift" style="margin-top: 18rpx; width: 100%">
      <view
        style="
          background-color: #ffd41e;
          width: 100%;
          height: 88rpx;
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
        <text style="font-size: 29rpx; color: #1f1f1f"
          >注：请务必将赠品与主商品一起退回</text
        >
      </view>
    </view>
    <view
      class="logistics-form"
      :style="{ marginTop: hasGift ? '16rpx' : '43rpx' }"
    >
      <view class="form-item">
        <view class="form-item-title">寄回物流公司</view>
        <input
          class="form-item-input"
          placeholder="请输入快递公司名称，如申通快递"
          placeholder-class="form-item-placeholder"
          v-model="deliveryCompanyName"
        />
      </view>
      <view style="height: 2rpx; background-color: #f8f8f8; width: 100%" />
      <view class="form-item">
        <view class="form-item-title">寄回物流单号</view>
        <input
          class="form-item-input"
          placeholder="请填写快递单号"
          placeholder-class="form-item-placeholder"
          v-model="logisticsNo"
        />
      </view>
    </view>
    <view class="logistics-address">
      <text class="address-item">
        退货地址：{{ refundAddress.address }}
        <text class="address-copy" @click="handleCopy(refundAddress.address)"
          >复制</text
        >
      </text>
      <text class="address-item">
        电话：{{ refundAddress.phone }}
        <text class="address-copy" @click="handleCopy(refundAddress.phone)"
          >复制</text
        >
      </text>
      <text class="address-item">
        收件人：{{ refundAddress.name }}
        <text class="address-copy" @click="handleCopy(refundAddress.name)"
          >复制</text
        >
      </text>
    </view>
    <view
      class="logistics-commit"
      :style="{
        backgroundColor: canCommit ? '#FE2442' : '#EEEEEE',
        color: canCommit ? '#FFF' : '#999',
      }"
      @tap="$u.debounce(handleCommit, 500)"
      >提交</view
    >
  </view>
</template>

<script>
// import { CREATE_AFTER_SALE_SEND_BACK } from '@/api/mall'
// import { GET_SEND_BACK_ADDRESS } from '@/api/mallv2'

export default {
  data() {
    return {
      refundAddress: {},
      deliveryCompanyName: '',
      logisticsNo: '',
      afterSaleOrderId: '',
      storeId: '',
      sellerId: '',
      hasGift: false,
    }
  },
  computed: {
    canCommit() {
      if (!this.deliveryCompanyName || !this.logisticsNo) {
        return false
      }
      return this.deliveryCompanyName.length > 0 && this.logisticsNo.length > 0
    },
  },
  methods: {
    async queryData() {
      const res = await GET_SEND_BACK_ADDRESS({
        storeId: this.sellerId,
        // sellerId: this.sellerId,
      })
      this.refundAddress = res.data.data
    },
    async commitForm() {
      const res = await CREATE_AFTER_SALE_SEND_BACK({
        deliveryCompanyName: this.deliveryCompanyName,
        logisticsNo: this.logisticsNo,
        afterSaleOrderId: this.afterSaleOrderId,
        address: this.refundAddress.address,
        city: this.refundAddress.city,
        cityCode: this.refundAddress.cityCode,
        county: this.refundAddress.county,
        countyCode: this.refundAddress.countyCode,
        name: this.refundAddress.name,
        phone: this.refundAddress.phone,
        province: this.refundAddress.province,
        provinceCode: this.refundAddress.provinceCode,
      })
      if (res.data.success) {
        uni.showToast({
          title: '提交成功',
          icon: 'none',
        })
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.emit('onCommit', {})
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } else {
        uni.showToast({
          title: res.data.message ?? '提交失败',
          icon: 'none',
        })
      }
    },
    handleCopy(e) {
      uni.setClipboardData({
        data: e,
        showToast: false,
        success: (res) => {
          uni.showToast({
            title: '复制成功',
            icon: 'none',
          })
        },
      })
    },
    handleCommit() {
      if (!this.canCommit) {
        return
      }
      this.commitForm()
    },
  },
  mounted() {
    // this.queryData()
  },
  onLoad(e) {
    this.afterSaleOrderId = e.afterSaleOrderId
    this.storeId = e.storeId
    this.sellerId = e.sellerId
    this.hasGift = e.hasGift
  },
}
</script>

<style lang="scss">
.after-sale-input-logistics-content {
  height: 100vh;
  background-color: #f7f8fc;
  display: flex;
  flex-direction: column;
  align-items: center;
  .logistics-form {
    width: calc(100% - 32rpx);
    margin-left: 16rpx;
    margin-top: 43rpx;
    background-color: white;
    border-radius: 16rpx;
    padding: 2rpx 0 2rpx 23rpx;
    .form-item {
      display: flex;
      padding: 31rpx 23rpx 31rpx 0;
      .form-item-placeholder {
        font-size: 29rpx;
        color: #999;
        font-weight: normal;
      }
      .form-item-input {
        font-size: 29rpx;
        color: #1f1f1f;
        font-weight: bold;
        flex: 1;
        margin-left: 37rpx;
      }
    }
  }
  .logistics-address {
    background-color: white;
    padding: 35rpx 29rpx;
    font-size: 27rpx;
    color: #666;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 39rpx;
    .address-item {
      .address-copy {
        color: #fe2442;
        margin-left: 24rpx;
      }
    }
    .address-item + .address-item {
      margin-top: 24rpx;
    }
  }
  .logistics-commit {
    font-size: 31rpx;
    font-weight: bold;
    margin-top: 60rpx;
    width: calc(100% - 78rpx);
    height: 85rpx;
    border-radius: 42.5rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
