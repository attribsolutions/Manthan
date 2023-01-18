import {
    POST_GO_BUTTON_FOR_DEMAND,
    POST_GO_BUTTON_FOR_DEMAND_SUCCESS,
    POST_DEMAND,
    POST_DEMAND_SUCCESS
} from "./actionType";


// Go Button Post API
export const postGoButtonForDemand = (data) => ({
    type: POST_GO_BUTTON_FOR_DEMAND,
    data,
});

export const postGoButtonForDemandSuccess = (data) => ({
    type: POST_GO_BUTTON_FOR_DEMAND_SUCCESS,
    payload: data,
});

// post api
export const postDemand = (data) => ({
    type: POST_DEMAND,
    data,
  });
  
  export const postDemandSuccess = (data) => ({
    type: POST_DEMAND_SUCCESS,
    payload: data,
  });

 