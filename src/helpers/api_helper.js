 import {axiosApi} from "./axios_Config"




export function get(url, param) {
  return axiosApi
    .get(url, param)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function post(url, body) {
  return axiosApi
    .post(url, body, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function put(url, body) {
  return axiosApi
    .put(url, body, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function del(url) {
  return axiosApi
    .delete(url)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}


export function postWithoutToken(url, body) {
  return axiosApi
    .post(url, body, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: null,
      },
    })
    .then((response) => {
      return response.data;
    })
}

export async function postRefreshToken(url, body) {
  return axiosApi
    .post(url, body, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      return response.data;
    });
}

export function getWithotMsg(url) {
  // CommonConsole(`${url} :get api call `);

  return axiosApi
    .get(url)
    .then((response) => {
      return response.data;
    });

}

export function postMethodExcel(url, body) {
  // CommonConsole(`${url} :post api call `);

  return axiosApi
    .post(url, body, {
      responseType: "arraybuffer",
    })
    .then((response) => {
      return response.data;
    });
}



export function delwithPostBody(url, body) {
  return axiosApi
    .delete(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: body
    })
    .then((response) => {
      return response.data;
    });
}

