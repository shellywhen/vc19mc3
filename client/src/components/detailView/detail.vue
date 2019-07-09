<template>
<p>
text cloud, comparison
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
      sheet: state => state.sheet
    })
  },
  mounted: function () {
  },
  methods: {
  }
}
</script>
