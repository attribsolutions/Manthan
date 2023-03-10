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

export function get(url, event) {
  debugger
  console.log("get api call")
  AuthonticationFunction();
  return axiosApi.get(url)
    .then(response => {
    return CkeckAlert({method:"get", url, response, event});
    })
    .catch(error => {
      return CkeckAlert({method:"get", url, error, event});
    });


}

export function post(url, data, event) {
  console.log("Post api call")
  AuthonticationFunction();
  return axiosApi
    .post(url, data, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    })
    .then(response => {
      return CkeckAlert({method:"post", url, response, data, event});
    })
    .catch(response => {
      return CkeckAlert({method:"post", url, response, data, event});
    });
};


export function put(url, data, event,) {

  console.log(" put api call")
  AuthonticationFunction();
  return axiosApi.put(url, data, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    }
  }).then(response => {
    return CkeckAlert({method:"put", url, response, data, event});
  })
    .catch(response => {
      return CkeckAlert({method:"put", url, response, event});
    });
}

export function del(url,) {
  console.log(" delete api call")
  AuthonticationFunction();
  return axiosApi.delete(url,).then(response => {
    return CkeckAlert({method:"delete", url, response});
  })
    .catch(response => {
      return CkeckAlert({method:"delete", url, response});
    });
}

// for forget password
export function postForget(url, data,) {
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
      return CkeckAlert({method:"postForget", url, response});
    })
    .catch(response => {
      return CkeckAlert({method:"postForget", url, response});
    });

}

export async function getModify(url) {
  AuthonticationFunction();
  return axiosApi.get(url).then(response => {
    return CkeckAlert({method:"get", url, response});
  })
    .catch(response => {
      return CkeckAlert({method:"get", url, response});
    });
}