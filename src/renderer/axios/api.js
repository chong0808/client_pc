import axios from 'axios'
const apiUrl = require('./../../apiUrl')
let url = apiUrl.url + apiUrl.api + apiUrl.version
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.baseURL = url
axios.defaults.timeout = 2000

// 请求拦截器
axios.interceptors.request.use(function (config) {
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
  getStudentList (params) {
    return fetch('/studentLists', params)
  },
  getStudent (params) {
    return fetch('/getstudent', params)
  },
  gobalCache (params) {
    return fetch('/getCacheData', params)
  },
  getAppNum (params) {
    return fetch('/finance/income', params)
  },
  addStudent (params) {
    return fetch('/addstudent', params)
  },
  updateStudent (params) {
    return fetch('/updatestudent', params)
  },
  deleteStudent (params) {
    return fetch('/deletestudent', params)
  },
  teacherList (params) {
    return fetch('/teacherLists', params)
  },
  addTeacher (params) {
    return fetch('/addteacher', params)
  },
  updateTeacher (params) {
    return fetch('/updateteacher', params)
  },
  deleteTeacher (params) {
    return fetch('/deleteteacher', params)
  },
  subjectList (params) {
    return fetch('/subjectLists', params)
  },
  subjectAdd (params) {
    return fetch('/addsubject', params)
  },
  subjectupdate (params) {
    return fetch('/updatesubject', params)
  },
  deletesubject (params) {
    return fetch('/deletesubject', params)
  },
  getClassSchedule (params) {
    return fetch('/addschedule', params)
  },
  getClassUnSchedule (params) {
    return fetch('/studentUnSchedule', params)
  },
  submitSchedule (params) {
    return fetch('/addschedule', params)
  },
  scheduleList (params) {
    return fetch('/scheduleList', params)
  },
  querySchedule (params) {
    return fetch('/querySchedule', params)
  },
  addAttendance (params) {
    return fetch('/addattendance', params)
  },
  updateSchedule (params) {
    return fetch('/updateSchedule', params)
  },
  attendanceLists (params) {
    return fetch('/attendanceLists', params)
  },
  getStudentItem (params) {
    return fetch('/studentItem', params)
  }
}
