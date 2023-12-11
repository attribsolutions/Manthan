import { DELETE_PRICE_LIST_SUCCESS, PRICE_LIST_BY_PARTY_ACTION_SUCCESS, POST_PRICE_LIST_DATA_SUCCESS, EDIT_PRICE_LIST_SUCCESS, UPDATE_PRICE_LIST_SUCCESS, GET_PRICE_LIST_PAGE_SUCCESS, PRICE_LIST_BY_COMPANY_SUCCESS, PRICE_LIST_BY_COMPANY, PRICE_lIST_API_ERROR_ACTION, POST_PRICE_LIST_DATA, PRICE_LIST_BY_PARTY_ACTION } from "./actionType";

const INIT_STATE = {
  postMsg: { Status: false },
  priceListByPartyType: [],
  priceListByCompany: [],
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMessage: { Status: false },
  listBtnLoading: false,
  saveBtnloading: false,
  priceListDropDownLoading: false
}

const PriceListReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    // post api
    case POST_PRICE_LIST_DATA:
      return {
        ...state,
        saveBtnloading: true,
      };
    // post api
    case POST_PRICE_LIST_DATA_SUCCESS:
      return {
        ...state,
        saveBtnloading: false,
        postMsg: action.payload,
      };

    // GET api
    case PRICE_LIST_BY_PARTY_ACTION:
      return {
        ...state,
        priceListDropDownLoading: true,
      };

    // GET api
    case PRICE_LIST_BY_PARTY_ACTION_SUCCESS:
      return {
        ...state,
        priceListByPartyType: action.payload,
        priceListDropDownLoading: false,
      };

    // GET api
    case PRICE_LIST_BY_COMPANY:
      return {
        ...state,
        listBtnLoading: true,
      };
    // GET api
    case PRICE_LIST_BY_COMPANY_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        priceListByCompany: action.payload,
      };

    // DELETE api
    case DELETE_PRICE_LIST_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
      };

    case EDIT_PRICE_LIST_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      };


    case UPDATE_PRICE_LIST_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
      };

    case PRICE_lIST_API_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false,
        listBtnLoading: false,
        priceListDropDownLoading: false,
      };



    default:
      return state;
  }
};
export default PriceListReducer;
