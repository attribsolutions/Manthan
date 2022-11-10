import {
  GET_SUPPLIER_SUCCESS,
  GET_SUPPLIER_ADDRESS_SUCCESS,
} from "./actionType"

const INIT_STATE = {
  supplier: [],
  supplierAddress: []
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

    default:
      return state
  }

}

export default SupplierReducer