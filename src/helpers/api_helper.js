import axios from "axios"
import { CheckAPIResponse, CommonConsole } from "../components/Common/CommonFunction"



  const API_URL = "http://192.168.1.114:8000"

// const API_URL = "http://103.135.203.145:8000"

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

export function get(url, btnId) {

  CommonConsole("get api call");
  AuthonticationFunction();
  return axiosApi.get(url)
    .then(response => {
      return CheckAPIResponse({ method: "get", url, response, btnId });
    })
    .catch(error => {
      return CheckAPIResponse({ method: "get", url, error, btnId });
    });
}

export function post(url, body, btnId) {

  CommonConsole("Post api call");
  AuthonticationFunction();

  return axiosApi.post(url, body, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    }
  }).then(response => {
    return CheckAPIResponse({ method: "post", url, response, body, btnId });
  }).catch(error => {
    return CheckAPIResponse({ method: "post", url, error, body, btnId });
  });
};

export function put(url, body, btnId,) {

  CommonConsole("put api call");
  AuthonticationFunction();

  return axiosApi.put(url, body, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    }
  }).then(response => {
    return CheckAPIResponse({ method: "put", url, response, body, btnId });
  }).catch(error => {
    return CheckAPIResponse({ method: "put", url, error, body, btnId });
  });
}

export function del(url, btnId) {

  CommonConsole(" delete api call");
  AuthonticationFunction();

  return axiosApi.delete(url,).then(response => {
    return CheckAPIResponse({ method: "delete", url, response, btnId });
  }).catch(error => {
    return CheckAPIResponse({ method: "delete", url, error, btnId });
  });
}

// for forget password
export function postForget(url, body,) {
  return axiosApi
    .post(url, body, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    })
    .then(response => {
      return CheckAPIResponse({ method: "postForget", body, url, response });
    })
    .catch(error => {
      return CheckAPIResponse({ method: "postForget", url, error });
    });

}

export async function getModify(url) {
  AuthonticationFunction();
  return axiosApi.get(url).then(response => {
    return CheckAPIResponse({ method: "get", url, response });
  })
    .catch(error => {
      return CheckAPIResponse({ method: "get", url, error });
    });
}

