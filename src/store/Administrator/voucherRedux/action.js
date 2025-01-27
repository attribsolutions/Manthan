import {

    GET_VOUCHER_LIST,
    VOUCHER_ERROR_ACTION,
    DELETE_VOUCHER_ID_SUCCESS,
    DELETE_VOUCHER_ID,
    UPDATE_VOUCHER_ID_SUCCESS,
    UPDATE_VOUCHER_ID,
    EDIT_VOUCHER_ID_SUCCESS,
    EDIT_VOUCHER_ID,
    SAVE_VOUCHER_SUCCESS,
    SAVE_VOUCHER_MASTER,
    GET_VOUCHER_LIST_SUCCESS,
    VALIDE_VOUCHER_ID,
    VALIDE_VOUCHER_ID_SUCCESS
} from "./actionType";

export const getVoucherlist = (config = {}) => ({// get List Action
    type: GET_VOUCHER_LIST,
    config
});

export const getVoucherlistSuccess = (pages) => ({// get List success
    type: GET_VOUCHER_LIST_SUCCESS,
    payload: pages,
});

export const saveVoucher = (config = {}) => ({// save Action
    type: SAVE_VOUCHER_MASTER,
    config,
});

export const saveVoucherSuccess = (resp) => ({// Save  success
    type: SAVE_VOUCHER_SUCCESS,
    payload: resp,
});

export const editVoucherID = (config = {}) => ({// Edit Action 
    type: EDIT_VOUCHER_ID,
    config,
})
export const editVoucherIDSuccess = (resp) => ({// Edit  Success
    type: EDIT_VOUCHER_ID_SUCCESS,
    payload: resp,
})

export const ValideVoucherID = (config = {}) => ({// Edit Action 
    type: VALIDE_VOUCHER_ID,
    config,
})
export const ValideVoucherIDSuccess = (resp) => ({// Edit  Success
    type: VALIDE_VOUCHER_ID_SUCCESS,
    payload: resp,
})

export const updateVoucherID = (config = {}) => ({// update  Action
    type: UPDATE_VOUCHER_ID,
    config,
})
export const updateVoucherIDSuccess = (resp) => ({//Update Success
    type: UPDATE_VOUCHER_ID_SUCCESS,
    payload: resp,
})

export const deleteVoucherTypeID = (config = {}) => ({// Delete  Action
    type: DELETE_VOUCHER_ID,
    config,
});

export const deleteVoucherIDSuccess = (resp) => ({// Delete Success
    type: DELETE_VOUCHER_ID_SUCCESS,
    payload: resp
});

export const VoucherErrorAction = () => ({
    type: VOUCHER_ERROR_ACTION,
})
