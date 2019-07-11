<template>
<div>
  <el-table ref="multipleTable" :data="sheet_data.slice((currentPage-1)*pagesize,currentPage*pagesize)" tooltip-effect="dark" style="width: 100%">
    <el-table-column prop="message" :label="msg" width="350">
    </el-table-column>
    <el-table-column prop="location" label="loc" width="100" :filters="filterList" :filter-method="filterHandler">
    </el-table-column>
    <el-table-column prop="time" label="time" width="90" sortable>
    </el-table-column>
    <el-table-column prop="account" label="user" width="80">
    </el-table-column>
    <el-table-column prop="re" label="re" width="80" sortable>
    </el-table-column>
  </el-table>
  <div class="block">
  <el-pagination
    layout="prev, pager, next" :total="total" :page-size="pagesize" @current-change="current_change">
  </el-pagination>
</div>
</div>
</template>
<script>
import {
  mapState
} from 'vuex'
export default {
  name: 'sheetView',
  data () {
    return {
      total: 2000,
      pagesize: 8,
      currentPage: 1,
      sheet_data: [],
      msg: 'msg',
      filterList: [{
        'text': 'Weston', 'value': 'Weston'
      }, {
        'text': 'Southton', 'value': 'Southton'
      }, {
        'text': 'Broadview', 'value': 'Broadview'
      }, {
        'text': 'West Parton', 'value': 'West Parton'
      }, {
        'text': 'Old Town', 'value': 'Old Town'
      }, {
        'text': 'Terrapin Springs', 'value': 'Terrapin Springs'
      }, {
        'text': 'Downtown', 'value': 'Downtown'
      }, {
        'text': 'Southwest', 'value': 'Southwest'
      }, {
        'text': 'Scenic Vista', 'value': 'Scenic Vista'
      }, {
        'text': 'East Parton', 'value': 'East Parton'
      }, {
        'text': 'Cheddarford', 'value': 'Cheddarford'
      }, {
        'text': 'Palace Hills', 'value': 'Palace Hills'
      }, {
        'text': 'Safe Town', 'value': 'Safe Town'
      }, {
        'text': 'Easton', 'value': 'Easton'
      }, {
        'text': 'Chapparal', 'value': 'Chapparal'
      }, {
        'text': 'Northwest', 'value': 'Northwest'
      }, {
        'text': 'Oak Willow', 'value': 'Oak Willow'
      }, {
        'text': 'Pepper Mill', 'value': 'Pepper Mill'
      }, {
        'text': 'Wilson Forest', 'value': 'Wilson Forest'
      }, {
        'text': 'UNKNOWN', 'value': 'UNKNOWN'
      }, {
        'text': '<Location with-held due to contract>', 'value': '<Location with-held due to contract>'
      }]
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
  watch: {
    detail (data) {
      this.total = data.length
      this.msg = 'msg: ' + String(data.length)
      this.sheet_data = data.map(d => {
        let v = {
          time: d.time.substring(5, 16),
          account: d.account,
          message: d.message,
          re: d.re,
          location: d.location
        }
        return v
      })
    }
  },
  methods: {
    filterHandler: function (value, row, column) {
      const property = column['property']
      return row[property] === value // further
    },
    current_change: function (currentPage) {
      this.currentPage = currentPage
    }
  }

}
</script>
