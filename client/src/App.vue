<template>
<div id="app">
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item index="1">Vast Challenge 2019</el-menu-item>
    <el-submenu index="2">
      <template slot="title">Mini Challenge 3</template>
      <el-menu-item index="2-1">选项1</el-menu-item>
      <el-menu-item index="2-2">选项2</el-menu-item>
      <el-menu-item index="2-3">选项3</el-menu-item>
      <el-submenu index="2-4">
        <template slot="title">选项4</template>
        <el-menu-item index="2-4-1">选项1</el-menu-item>
        <el-menu-item index="2-4-2">选项2</el-menu-item>
        <el-menu-item index="2-4-3">选项3</el-menu-item>
      </el-submenu>
    </el-submenu>
    <el-menu-item index="3"><a href="https://docs.google.com/document/d/15fy2iDnXeKRUaS6qCJGHZNKqO_cH028gHmdw-BEfNvc/edit?usp=sharing" target="_blank">Answer Sheet</a></el-menu-item>
    <el-menu-item index="4"><a href="http://vis.pku.edu.cn/wiki/doku.php?id=visgroup:projects:ieee_vast_challenge_2019:mc3:start" target="_blank">About</a></el-menu-item>
  </el-menu>
  <el-row :gutter="20">
  <el-col :span="16">
    <div id="leftWrapper">
      <div id="detailView"><detailView></detailView></div>
      <div id="timelineView"><timelineView></timelineView></div>
    </div>

  </el-col>
  <el-col :span="8">
    <div class="grid-content bg-purple">
      <div id="rightWrapper">
        <div id="configueView">
            <configureView></configureView>
        </div>
        <div id="sheetView">
          <sheetView></sheetView>
        </div>
      </div>
    </div>
  </el-col>
</el-row>
  <div class="line"></div>
</div>
</template>

<script>
import configureView from './components/ConfigureView/configure.vue'
import timelineView from './components/TimelineView/timeline.vue'
import sheetView from './components/SheetView/sheet.vue'
import detailView from './components/DetailView/detail.vue'
export default {
  name: 'App',
  components: {
    timelineView,
    configureView,
    sheetView,
    detailView
  },
  data () {
    return {
      activeIndex: '1',
      activeIndex2: '1'
    }
  },
  methods: {
    handleSelect (key, keyPath) {
    }
  },
  created () {
    // Initalize the store
    this.$store.dispatch('init')
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body::-webkit-scrollbar {
    width: 1em;
}
body::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
}
body::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}

#detailView {
  height: 45vh;
  width: 100%;
}
#timelineView {
  height: 55vh;
  width: 100%;
}
#leftWrapper {
  height:100vh;
  width:100%;
  padding-top:2vh;
  padding-right:2vh;
}
#rightWrapper {
  height:100vh;
  width:100%;
  padding-top:2vh;
}
#configureView {
  height: 20vh;
  width:100%;
}
#sheetView {
  height: 40vh;
  width:100%;
}
</style>
