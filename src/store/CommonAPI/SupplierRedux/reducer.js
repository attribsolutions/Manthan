import {
  GET_SUPPLIER_SUCCESS,
  GET_SUPPLIER_ADDRESS_SUCCESS,
  GET_ORDER_TYPE_SUCCESS,
} from "./actionType"

const INIT_STATE = {
  supplier: [],
  supplierAddress: [],
  orderType:[]
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
    default:
      return state
  }

}

export default SupplierReducer