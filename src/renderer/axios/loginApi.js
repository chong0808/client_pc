import axios from 'axios'
const apiUrl = require('./../../apiUrl')
let url = apiUrl.url + apiUrl.auth + apiUrl.version
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.baseURL = url
axios.defaults.timeout = 2000

// 请求拦截器
axios.interceptors.request.use(function (config) {
  console.log(config)
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  return Promise.reject(error)
})

// 封装axios的post请求
export function fetch (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default {
  login (url, params) {
    return fetch(url, params)
  }
}
