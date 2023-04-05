import {
  GET_SUPPLIER_SUCCESS,
  GET_SUPPLIER_ADDRESS_SUCCESS,
  GET_ORDER_TYPE_SUCCESS,
  GET_VENDER_SUCCESS,
  GET_CUSTOMER_SUCCESS,
  GET_VENDER_SUPPLIER_CUSTOMER_SUCCESS,
  SSDD_LIST_UNDER_COMPANY_SUCCESS,
  RETAILER_LIST_SUCCESS,
  PARTY_DROPDOWN_LIST_SUCCESS,
} from "./actionType"

const INIT_STATE = {
  supplier: [],
  supplierAddress: [],
  orderType: [],
  vender: [],
  customer: [],
  vendorSupplierCustomer: [],
  SSDD_List: [],
  RetailerList:[],
  partyList:[]
}

const CommonAPI_Reducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_SUPPLIER_SUCCESS:
      return {
        ...state,
        supplier: action.payload,
      }
    case GET_SUPPLIER_ADDRESS_SUCCESS:
      return {
        ...state,
        supplierAddress: action.payload,
      }
    case GET_ORDER_TYPE_SUCCESS:
      return {
        ...state,
        orderType: action.payload,
      }
    case GET_VENDER_SUCCESS:
      return {
        ...state,
        vender: action.payload,
      }
    case GET_CUSTOMER_SUCCESS:
      return {
        ...state,
        customer: action.payload,
      }

    case GET_VENDER_SUPPLIER_CUSTOMER_SUCCESS:
      return {
        ...state,
        vendorSupplierCustomer: action.payload,
      }

    case SSDD_LIST_UNDER_COMPANY_SUCCESS:
      return {
        ...state,
        SSDD_List: action.payload,
      }

    case RETAILER_LIST_SUCCESS:
      return {
        ...state,
        RetailerList: action.payload,
      }
      case PARTY_DROPDOWN_LIST_SUCCESS:
        return {
          ...state,
          partyList: action.payload,
        }
    default:
      return state
  }

}

export default CommonAPI_Reducer