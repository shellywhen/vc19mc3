<template>
<div id="timeline">
  <div stype="text-align: center;">
    <el-tabs type="card" @tab-click="handleClick">
   <el-tab-pane label="Unit">
     <!-- <div style="overflow: scroll;"> -->
     <div>
       <svg id="timeLine" width="1000" height="200">
       </svg>
           <!-- <p id="textDetail" style="width: 80vh; text-align: left;">text detail</p> -->
           <p id="textDetail">
             text detail
           </p>
     </div>
   </el-tab-pane>
   <el-tab-pane label="Matrix">
     <svg id="matrix" width="1000" height="200">
     </svg>
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
    }
  },
  computed: {
    ...mapState([
      'detail',
      'sheet',
      'matrixStat'
    ])
  },
  mounted: function () {
    this.timeLine = new Timeline()
  },
  methods: {
    handleClick (tab, event) {
    }
  },

  watch: {
    detail (sheet) {
      // temportary
      this.timeLine.drawTimeline(sheet)
    },
    matrixStat (matrix) {
      this.timeLine.drawMatrix(matrix)
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
</style>
