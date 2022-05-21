import axios from "axios"

const API_URL = "http://192.168.1.114:8001"

const axiosApi = axios.create({
  baseURL: API_URL,
})
const AuthonticationFunction = () => {
  const token = "Bearer " + (localStorage.getItem("token"))
  if (token) {
    axiosApi.defaults.headers.common["Authorization"] = token
  }
  else {
    axiosApi.defaults.headers.common["Authorization"] = ""
  }
}

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)
export async function get(url, config = {}) {
  AuthonticationFunction();
  return await axiosApi.get(url, { ...config }).then(response => response.data)
}

export async function getModify(url) {
  AuthonticationFunction();
  return await axiosApi.get(url).then(response => response.data)
}

export async function post(url, data, config = {}) {
  console.log("post",url,data)
  AuthonticationFunction();
  return axiosApi
    .post(url, data, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    })
    .then(response => response.data)
}

export async function put(url, data, config = {}) {
  AuthonticationFunction();
  return axiosApi
    .put(url, data, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    })
    .then(response => response.data)
}

export async function del(url, config = {}) {
  AuthonticationFunction();
  return await axiosApi
    .delete(url, { ...config })
    .then(response => response.data)
}


