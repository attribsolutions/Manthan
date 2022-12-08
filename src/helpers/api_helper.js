import axios from "axios"

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
  const res = await axiosApi.get(url, { ...config }).then(response => response.data)
  console.log("getapiCall Url:", url);
  console.log("getapiCall response:", res);
  return res
}

export async function getModify(url) {
  AuthonticationFunction();
  const res = await axiosApi.get(url).then(response => response.data)
  console.log("getModify Url:", url);
  console.log("getModify response:", res);
  return res
}

export async function post(url, data, config = {}) {
  AuthonticationFunction();
  const res = axiosApi
    .post(url, data, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    })
    .then(response => response.data)
  console.log("postapiCall Url:", url);
  console.log("postapiCall Body:", data);
  console.log("postapiCall Response:", res);
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
  console.log("putapiCall Url:", url);
  console.log("putapiCall Body:", data);
  console.log("putapiCall Response:", res);
  return res
}

export async function del(url, config = {}) {
  AuthonticationFunction();
 const rep= await axiosApi
    .delete(url, { ...config })
    .then(response => response.data)
    console.log("deleteapiCall Url:", url);
    console.log("deleteapiCall response:", rep);
    return rep  
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

