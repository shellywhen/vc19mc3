<template>
  <div>
    <el-row>
    <!-- <el-col :span="10" style="padding-right: 5px">
      <el-input placeholder="Keyword Search" v-model="form.keyword" clearable disabled>
</el-input>
    </el-col> -->
    <el-col :span="12">
      <el-select v-model="form.location" multiple collapse-tags  placeholder="Select">
         <el-option v-for="item in selection.location" :key="item.value" :label="item.label" :value="item.value">
         </el-option>
       </el-select>
    </el-col>
    <el-col :span="6">
      <el-switch
  v-model="form.filter"
  active-text="Original"
  inactive-text="">
</el-switch>
    </el-col>
    <el-col :span="6">
      <el-switch
      v-model="form.overview"
      active-text="Overview"
      inactive-text="">
      </el-switch>
    </el-col>
    </el-row>
    <el-row>
      <el-col :span="5" style="padding-top: 15px;">
        <div>timeslice</div>
      </el-col>
      <el-col :span="15">
       <el-slider
         v-model="form.aggregation"
         :step="15"
         :marks=selection.aggregation.marks
         :min=selection.aggregation.range[0]
         :max=selection.aggregation.range[1]
         show-stops>
       </el-slider>
      </el-col>
    </el-row>
    <el-row style="margin: 15px;">
      <el-col :span="24">
        <el-tag
  :key="tag.label"
  v-for="tag in selection.topic.dynamicTags"
  closable
  :disable-transitions="false"
  :type="tag.trigger"
  @close="handleClose(tag)"
  @click="handleClick(tag)">
  {{tag.label}}
</el-tag>
<el-input
  class="input-new-tag"
  v-if="selection.topic.inputVisible"
  v-model="selection.topic.inputValue"
  ref="saveTagInput"
  size="mini"
  @keyup.enter.native="handleInputConfirm"
  @blur="handleInputConfirm"
>
</el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
      </el-col>
    </el-row>
    <el-form :inline="true" class="demo-form-inline" size="mini">
      <el-form-item size="mini">
          <el-switch
          v-model="mode"
          active-text="Quick"
          inactive-text="">
          </el-switch>
      </el-form-item>
      <el-form-item size="mini">
        <el-button type="primary" @click="onSubmit">Check</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'configureView',
  data () {
    return {
      mode: true,
      selection: {
        aggregation: {
          range: [15, 360],
          marks: {
            15: '15 min',
            60: '1 hour',
            120: '2 hour'
          }
        },
        topic: {
          dynamicTags: [{
            label: 'earthquake',
            trigger: ''
          }, {
            label: 'help',
            trigger: 'info'
          }, {
            label: 'shelter',
            trigger: 'info'
          }],
          inputVisible: false,
          inputValue: ''
        },
        location: [{
          'value': 'Old Town',
          'label': 'Old Town 🔥'
        }, {
          'value': 'Safe Town',
          'label': 'Safe Town 🔥'
        }, {
          'value': 'Pepper Mill',
          'label': 'Pepper Mill 🔥'
        }, {
          'value': 'Wilson Forest',
          'label': 'Wilson Forest 🔥'
        }, {
          'value': 'UNKNOWN',
          'label': 'UNKNOWN 🔥'
        }, {
          'value': '<Location with-held due to contract>',
          'label': '<Location with-held due to contract> 🔥'
        }, {
          'value': 'Cheddarford',
          'label': 'Cheddarford'
        }, {
          'value': 'Southton',
          'label': 'Southton'
        }, {
          'value': 'Scenic Vista',
          'label': 'Scenic Vista'
        }, {
          'value': 'Terrapin Springs',
          'label': 'Terrapin Springs'
        }, {
          'value': 'West Parton',
          'label': 'West Parton'
        }, {
          'value': 'Palace Hills',
          'label': 'Palace Hills'
        }, {
          'value': 'Downtown',
          'label': 'Downtown'
        }, {
          'value': 'Weston',
          'label': 'Weston'
        }, {
          'value': 'East Parton',
          'label': 'East Parton'
        }, {
          'value': 'Southwest',
          'label': 'Southwest'
        }, {
          'value': 'Easton',
          'label': 'Easton'
        }, {
          'value': 'Broadview',
          'label': 'Broadview'
        }, {
          'value': 'Oak Willow',
          'label': 'Oak Willow'
        }, {
          'value': 'Northwest',
          'label': 'Northwest'
        }, {
          'value': 'Chapparal',
          'label': 'Chapparal'}
        ]},
      form: {
        keyword: '',
        location: [],
        aggregation: 60,
        filter: true,
        topic: ['earthquake'],
        overview: false
      }
    }
  },
  computed: {
    ...mapState({
      detail: state => state.detail,
      sheet: state => state.sheet,
      period: state => state.period
    })
  },
  mounted: function () {

  },
  watch: {
    period: async function () {
      if (this.mode === true) return
      await this.axios.post('http://localhost:1111/word_request', {
        'configure': this.form,
        'period': this.period
      }).then(res => {
        this.$store.commit('set', {'field': 'wordCount', 'data': res.data})
      })
    }
  },
  methods: {
    async onSubmit () {
      this.$store.commit('set', {'field': 'interval', 'data': this.form.aggregation})
      let form = this.form.topic
      await this.axios.post('http://localhost:1111/data_request', {
        'configure': this.form
      }).then(res => {
        console.log('receive data from data_request', typeof res.data)
        if (res.data.constructor === String) {
          res.data = JSON.parse(res.data)
        }
        this.$store.commit('set', {'field': 'detail', 'data': res.data.data})
        this.$store.commit('set', {'field': 'matrixStat', 'data': res.data.stat})
        this.form.topic = form
      })
    },
    handleClose (tag) {
      this.selection.topic.dynamicTags.splice(this.selection.topic.dynamicTags.indexOf(tag), 1)
      this.form.topic.splice(this.form.topic.indexOf(tag.label))
    },
    showInput () {
      this.selection.topic.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.selection.topic.inputValue
      if (inputValue) {
        this.selection.topic.dynamicTags.push({'label': inputValue, 'trigger': 'info'})
      }
      this.selection.topic.inputVisible = false
      this.selection.topic.inputValue = ''
    },
    handleClick (tag) {
      if (tag.trigger === 'info') {
        tag.trigger = ''
        this.form.topic.push(tag.label)
      } else {
        tag.trigger = 'info'
        this.form.topic.splice(this.form.topic.indexOf(tag.label))
      }
    }
  }
}
</script>
