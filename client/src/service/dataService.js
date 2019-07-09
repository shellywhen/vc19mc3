import Vue from 'vue'
import VueResource from 'vue-resource'
import axios from 'axios'
Vue.use(VueResource)

const serverUrl = 'http://localhost:1111'

function get (field) {
  return new Promise((resolve, reject) => {
    const url = `${serverUrl}/` + field
    axios.get(url)
      .then(res => {
        console.log(res)
        console.log('why???')
      }).catch(err => {
        console.log(err)
      })
  })
}

function getSheet () {
  let tmp = get('data')
  console.log('!!!', typeof (tmp), tmp)
  return tmp
}

export default {
  get,
  getSheet
}
