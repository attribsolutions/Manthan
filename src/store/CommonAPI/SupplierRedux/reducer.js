import {
  GET_SUPPLIER_SUCCESS,
  GET_SUPPLIER_ADDRESS_SUCCESS,
  GET_ORDER_TYPE_SUCCESS,
  GET_VENDER_SUCCESS,
  GET_CUSTOMER_SUCCESS,
} from "./actionType"

const INIT_STATE = {
  supplier: [],
  supplierAddress: [],
  orderType:[],
  vender:[],
  customer:[]
}

const SupplierReducer = (state = INIT_STATE, action) => {
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
    default:
      return state
  }

}

export default SupplierReducer