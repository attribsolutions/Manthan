import axios from "axios"
import { CheckAPIResponse, CommonConsole } from "../components/Common/CommonFunction"



const API_URL = "http://192.168.1.114:8000"

// const API_URL = "http://117.248.109.234:8000"
// const API_URL = "http://10.4.5.64:8000"

// const API_URL = "http://cbmfooderp.com:8000"


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

  CommonConsole("get api call", url);
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

  CommonConsole("Post api call", url, body);
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
export function postWithoutToken(url, body,) {
  return axiosApi
    .post(url, body, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": null
      }
    })
    .then(response => {
      console.log(`${url} Body :`, body)
      console.log(`${url} response :`, response)
      return response.data
    })
    .catch(error => {
      console.log(`${url} Body :`, body)
      console.log(`${url} error :`, error)
      return Promise.reject(error)

    });

}

export async function postRefreshToken(url, body) {
  AuthonticationFunction();
  return axiosApi.post(url, body, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    }
  }).then(response => {
    return response.data;
  })

}

export function getWithotMsg(url, btnId) {

  CommonConsole(`${url} :get api call `);
  AuthonticationFunction();
  return axiosApi.get(url)
    .then(response => {
      console.log(`${url} response :`, response)
      return response.data
    })
    .catch(error => {
      console.log(`${url} error :`, error)
      return Promise.reject(error)
    })
}





