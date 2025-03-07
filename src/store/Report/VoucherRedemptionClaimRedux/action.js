import {
    VOUCHER_REDEMPTION_CLAIM_ACTION,
    VOUCHER_REDEMPTION_CLAIM_ACTION_SUCCESS,
    VOUCHER_REDEMPTION_CLAIM_ERROR_ACTION
} from "./actionType";

export const VoucherRedemptionClaim_Action = (config) => ({
    type: VOUCHER_REDEMPTION_CLAIM_ACTION,
    config
});

export const VoucherRedemptionClaim_Action_Success = resp => ({
    type: VOUCHER_REDEMPTION_CLAIM_ACTION_SUCCESS,
    payload: resp,
});

export const VoucherRedemptionClaim_ErrorAction = resp => ({
    type: VOUCHER_REDEMPTION_CLAIM_ERROR_ACTION,
    payload: resp,
})
