<template>
<div id="timeline">
  <div stype="text-align: center;">
    <el-tabs type="card" @tab-click="handleClick">
   <el-tab-pane label="Unit">
     <!-- <div style="overflow: scroll;"> -->
     <div>
       <svg id="timeLine" width="1000" height="280">
       </svg>
           <!-- <p id="textDetail" style="width: 80vh; text-align: left;">text detail</p> -->
           <p id="textDetail">
             text detail
           </p>
     </div>
   </el-tab-pane>
   <el-tab-pane label="Matrix">
     <svg id="matrix" width="1000" height="280">
     </svg>
     <p id="valueDetail">
       Value
     </p>
   </el-tab-pane>
 </el-tabs>

  </div>
  <p>
  </p>
</div>
</template>
<script>
import Timeline from './timeline.js'
import { mapState } from 'vuex'
export default {
  name: 'timelineView',
  data () {
    return {
      period: ['fuck', 'vue']
    }
  },
  computed: {
    ...mapState([
      'detail',
      'sheet',
      'matrixStat',
      'interval'
    ])
  },
  mounted: function () {
    this.timeLine = new Timeline(this)
  },
  methods: {
    handleClick (tab, event) {
    }
  },

  watch: {
    detail (sheet) {
      // temportary
      this.timeLine.drawTimeline(sheet, this.interval)
    },
    matrixStat (matrix) {
      this.timeLine.drawMatrix(matrix, this.interval)
    }
  }
}
</script>
<style>
.el-table td, .el-table th {
  padding: 1px;
  padding-right: 1px;
}
.el-table .cell {
  padding: 2px;
}
p {
  margin: 0;
}
.circleHighlight {
  stoke: 4px;
}
</style>
