<template>
  <div>
<p id="timePeriod">
</p>
<el-row>
  <el-col :span="24">
    <svg id="wordView" height="350" width="800">
    </svg>
  </el-col>
</el-row>
</div>
</template>

<script>
import {
  mapState
} from 'vuex'
import Word from './word.js'
export default {
  name: 'detailView',
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      detail: state => state.detail,
      period: state => state.period,
      wordCount: state => state.wordCount
    })
  },
  watch: {
    period: function (per) {
      this.wordView.updatePeriod(per)
    },
    wordCount: function () {
      this.wordView.drawCloud(this.wordCount)
    }
  },
  mounted: function () {
    this.wordView = new Word()
  },
  methods: {
  }
}
</script>
