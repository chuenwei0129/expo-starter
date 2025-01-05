<template>
  <MyTabs
    :list="list"
    line-width="31rpx"
    line-height="2"
    line-color="#FE2442"
    font-size="14"
    scrolled
    :active-style="{
      color: '#000',
      fontFamily: 'AlimamaShuHeiTi-Bold',
      transform: 'scale(1)',
    }"
    :inactive-style="{
      color: '#000',
      transform: 'scale(1)',
    }"
    :current="tabIndex"
    @click="handleChooseTab"
  />
</template>

<script>
// import MyTabs from '@/pages/mall/components/choiceness/customTabs/customTabs.vue'
import MyTabs from '../../components/customTabs/customTabs.vue'
export default {
  name: 'FilterTabs',
  components: {
    MyTabs,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['onSwitch'],
  data() {
    return {
      tabIndex: 0,
      tabWidth: 28,
    }
  },
  created() {
    uni.loadFontFace({
      family: 'AlimamaShuHeiTi-Bold',
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/AlimamaShuHeiTi-Bold.otf")',
      success() {
        console.log('success load ttf')
      },
      fail() {
        console.log('fail load ttf')
      },
    })
  },
  methods: {
    handleChooseTab(item) {
      const { rect } = item
      if (rect) {
        this.tabWidth = rect.width - 24 > 28 ? rect.width - 24 : 28
      }
      this.$emit('onSwitch', item.index)
    },
  },
}
</script>
