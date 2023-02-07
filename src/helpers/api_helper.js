import axios from "axios"
import { CkeckAlert } from "../CustomAlert/ConfirmDialog"

const API_URL = "http://192.168.1.114:8000"

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
  const res = await axiosApi.get(url, { ...config }).then(response => response.data).catch(error => ({ StatusCode: 500, Data: [], Status: false }));
  //  console.log(`${url}/* getapiCall Url=>`, url);
  await CkeckAlert("get", url, res)
  console.log(`${url}/* getapiCall response:=>`, res);
  return res
}

export async function post(url, data, config = {}) {
  AuthonticationFunction();

  const res = await axiosApi
    .post(url, data, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    })
    .then(response => response.data)
    .catch(error => (''));

  // console.log(`${url}/*postapiCall Url:`, url);
  console.log(`${url}/*postapiCall Body:`, data)
  console.log(`${url}/* postapiCall Response:`, res);
  await  CkeckAlert("post", url, res)

  return res
}

export async function put(url, data, config = {}) {

  AuthonticationFunction();
  const res = await axiosApi
    .put(url, data, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    })
    .then(response => response.data)
    .catch(error => (error));
  // console.log(`${url}/*put-apiCall Url:`, url);
  console.log(`${url}/*put-apiCall Body:`, data);
  console.log(`${url}/*putapiCall Response:`, res);
  CkeckAlert("put", url, res)

  return res
}

export async function del(url, config = {}) {
  AuthonticationFunction();
  const res = await axiosApi
    .delete(url, { ...config })
    .then(response => response.data)
    .catch(error => (error));
  // console.log(`${url}/*deleteapiCall Url:`, url);
  console.log(`${url}/*delete-apiCall response:`, res);
  CkeckAlert("delete", url, res)
  return res
}

// for forget password
export async function postForget(url, data, config = {}) {
  // debugger
  // AuthonticationFunction();
  return axiosApi
    .post(url, data, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    })
    .then(response => response.data)

}

export async function getModify(url) {
  AuthonticationFunction();
  const res = await axiosApi.get(url).then(response => response.data)
  console.log("getModify Url:", url);
  console.log(`${url}/* getModify response:=>`, res);
  return res
}