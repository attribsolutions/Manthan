import {

    VOUCHER_REDEMPTION_CLAIM_ACTION,
    VOUCHER_REDEMPTION_CLAIM_ACTION_SUCCESS,
    VOUCHER_REDEMPTION_CLAIM_ERROR_ACTION,

} from "./actionType"

const INIT_STATE = {
    VoucherRedemptionClaimData: [],
    listBtnLoading: false
}

const VoucherRedemptionClaimReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case VOUCHER_REDEMPTION_CLAIM_ACTION:
            return {
                ...state,
                listBtnLoading: true
            }

        case VOUCHER_REDEMPTION_CLAIM_ACTION_SUCCESS:
            return {
                ...state,
                VoucherRedemptionClaimData: action.payload,
                listBtnLoading: false
            }


        case VOUCHER_REDEMPTION_CLAIM_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
            };

        default:
            return state
    }
}

export default VoucherRedemptionClaimReducer;  