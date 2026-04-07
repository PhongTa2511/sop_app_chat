import axios from "axios"
import {
  getToken,
  getUserName,
  removeToken,
  removeUserName,
  removeFullName,
  removePhoneNumber,
  removeEmployCode,
} from "@/utils/auth"

// create an axios instance
import { useNotification } from "@kyvg/vue3-notification"

const notification = useNotification()

const service = axios.create({
  baseURL: "https://icpc1hn.work/api/",

  // baseURL: " https://localhost:44367/",
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 20000, // request timeout
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})


// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    const token = getToken()

    if (token != "" && token) {
      config.data.Token = getToken()
      config.data.UserName = getUserName()
    }

    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  },
)

// response interceptor
service.interceptors.response.use(
  response => {
    if (response.data == null) {
      response.data = {}
    }
    const res = response.data

    res.RespCode = res.ResCode
    res.RespText = res.ResMes
    res.Token = res.token

    // if the custom code is not 20000, it is judged as an error.
    if (res.RespCode !== 0) {
      if (res.RespCode === -1) {
        notification.notify({
          type: "error",
          title: "Hết hạn",
          text: "Phiên đăng nhập hết hạn",
        })
        removeToken()
        removeUserName()
        removeFullName()
        removePhoneNumber()
        removeEmployCode()
        store.dispatch("user/resetToken").then(() => {})
        location.reload()
      } else {
        notification.notify({
          type: "error",
          title: "Lỗi",
          text: res.RespText,
        })
        
        return null
      }
    } else {
      return res
    }
  },
  error => {
    return Promise.reject(error)
  },
)

export default service
