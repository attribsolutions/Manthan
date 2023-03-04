import axios from "axios"
import { mainSppinerOnOff } from "../components/Common/ComponentRelatedCommonFile/listPageCommonButtons"
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

export function get(url, isspinner, config = {}) {
  console.log("get api call")
  // 
  // if (isspinner) {
  //   mainSppinerOnOff(true)
  // }
  AuthonticationFunction();
  return axiosApi.get(url, { ...config })
    .then(response => {
      return CkeckAlert("get", url, response, isspinner);
    })
    .catch(error => {
      return CkeckAlert("get", url, error, isspinner);
    });


}

export function post(url, data, isspinner, config = {}) {
  console.log("Post api call")
  // debugger
  // if (isspinner) {
  //   mainSppinerOnOff(true)
  // }
  AuthonticationFunction();
  return axiosApi
    .post(url, data, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    })
    .then(response => {
     
      // setTimeout(function () {
      //   mainSppinerOnOff(false)
      // }, 100000);
      return CkeckAlert("post", url, response, data, isspinner);
    })
    .catch(error => {
      // setTimeout(function () {
      //   mainSppinerOnOff(false)
      // }, 5000);
      return CkeckAlert("post", url, error, data, isspinner);
    });
};


export function put(url, data, config = {}) {

  console.log(" put api call")
  AuthonticationFunction();
  return axiosApi
    .put(url, data, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    })
    .then(response => {
      return CkeckAlert("put", url, response, data);
    })
    .catch(error => {
      return CkeckAlert("put", url, error,);
    });
}

export function del(url, config = {}) {
  console.log(" delete api call")
  AuthonticationFunction();
  return axiosApi
    .delete(url, { ...config })
    .then(response => {
      return CkeckAlert("delete", url, response);
    })
    .catch(error => {
      return CkeckAlert("delete", url, error);
    });
}

// for forget password
export function postForget(url, data, config = {}) {
  // 
  // AuthonticationFunction();
  return axiosApi
    .post(url, data, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    })
    .then(response => {
      return CkeckAlert("postForget", url, response);
    })
    .catch(error => {
      return CkeckAlert("postForget", url, error);
    });

}

export async function getModify(url) {
  AuthonticationFunction();
  return axiosApi.get(url).then(response => {
    return CkeckAlert("get", url, response);
  })
    .catch(error => {
      return CkeckAlert("get", url, error);
    });
}