<template>
<p>
text cloud, comparison {{this.period}}
</p>
</template>
<script>
import {
  mapState
} from 'vuex'
export default {
  name: 'detailView',
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      detail: state => state.detail,
      sheet: state => state.sheet,
      period: state => state.period
    })
  },
  watch: {
    period: function () {
      console.log(this.period)
    }
  },
  mounted: function () {
  },
  methods: {
  }
}
</script>
