import axios from "axios"
import { CheckAPIResponse } from "../components/Common/ComponentRelatedCommonFile/listPageCommonButtons"

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
  
  console.log("get api call")
  AuthonticationFunction();
  return axiosApi.get(url)
    .then(response => {
    return CheckAPIResponse({method:"get", url, response, event});
    })
    .catch(response => {
      return CheckAPIResponse({method:"get", url, response, event});
    });


}

export function post(url, body, event) {
  console.log("Post api call")
  AuthonticationFunction();
  return axiosApi
    .post(url, body, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    })
    .then(response => {
      return CheckAPIResponse({method:"post", url, response, body, event});
    })
    .catch(response => {
      return CheckAPIResponse({method:"post", url, response, body, event});
    });
};


export function put(url, body, event,) {

  console.log(" put api call")
  AuthonticationFunction();
  return axiosApi.put(url, body, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    }
  }).then(response => {
    return CheckAPIResponse({method:"put", url, response, body, event});
  })
    .catch(response => {
      return CheckAPIResponse({method:"put", url, response, event});
    });
}

export function del(url,) {
  console.log(" delete api call")
  AuthonticationFunction();
  return axiosApi.delete(url,).then(response => {
    return CheckAPIResponse({method:"delete", url, response});
  })
    .catch(response => {
      return CheckAPIResponse({method:"delete", url, response});
    });
}

// for forget password
export function postForget(url, body,) {
  // 
  // AuthonticationFunction();
  return axiosApi
    .post(url, body, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    })
    .then(response => {
      return CheckAPIResponse({method:"postForget", url, response});
    })
    .catch(response => {
      return CheckAPIResponse({method:"postForget", url, response});
    });

}

export async function getModify(url) {
  AuthonticationFunction();
  return axiosApi.get(url).then(response => {
    return CheckAPIResponse({method:"get", url, response});
  })
    .catch(response => {
      return CheckAPIResponse({method:"get", url, response});
    });
}