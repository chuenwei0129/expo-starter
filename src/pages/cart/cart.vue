<template>
  <view> </view>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          title: '洗澡',
          image: 'http://iph.href.lu/60x60?text=Bath&bg=0000FF&fg=FFFFFF',
          cornerIcon: 'http://iph.href.lu/20x20?text=Icon&bg=FF0000&fg=FFFFFF',
          jumpType: '1',
          h5Link: 'https://example.com/services/bath',
          appLink: '',
          miniLink: '/pages/service/detail?id=101',
        },
        {
          title: '美容',
          image: 'http://iph.href.lu/60x60?text=Beauty&bg=FF0000&fg=FFFFFF',
          cornerIcon: '',
          jumpType: '2',
          h5Link: '',
          appLink: 'app://beauty-service',
          miniLink: '/pages/service/detail?id=102',
        },
        {
          title: '绝育',
          image: 'http://iph.href.lu/60x60?text=Neuter&bg=00FF00&fg=FFFFFF',
          cornerIcon: '',
          jumpType: '1',
          h5Link: 'https://example.com/services/neuter',
          appLink: '',
          miniLink: '/pages/service/detail?id=103',
        },
        {
          title: '疫苗',
          image: 'http://iph.href.lu/60x60?text=Vaccine&bg=FF00FF&fg=FFFFFF',
          cornerIcon: 'http://iph.href.lu/20x20?text=Icon&bg=FF0000&fg=FFFFFF',
          jumpType: '2',
          h5Link: '',
          appLink: 'app://vaccine-service',
          miniLink: '/pages/service/detail?id=104',
        },
        {
          title: '体检',
          image: 'http://iph.href.lu/60x60?text=Checkup&bg=FFFF00&fg=000000',
          cornerIcon: '',
          jumpType: '3',
          h5Link: '',
          appLink: '',
          miniLink: '/pages/service/detail?id=105',
        },
        {
          title: '体检',
          image: 'http://iph.href.lu/60x60?text=Checkup&bg=FFFF00&fg=000000',
          cornerIcon: '',
          jumpType: '3',
          h5Link: '',
          appLink: '',
          miniLink: '/pages/service/detail?id=105',
        },
        {
          title: '体检',
          image: 'http://iph.href.lu/60x60?text=Checkup&bg=FFFF00&fg=000000',
          cornerIcon: '',
          jumpType: '3',
          h5Link: '',
          appLink: '',
          miniLink: '/pages/service/detail?id=105',
        },
      ],
    }
  },
}
</script>
