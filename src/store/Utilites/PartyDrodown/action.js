import {
    COMMON_PARTY_DROPDOWN,
    COMMON_PARTY_DROPDOWN_SUCCESS,
    COMMON_PARTY_DROP_SELECT_ACTION,
    COMMON_PARTY_DROP_SELECT_ACTION_SUCCESS
} from "./actionType";

export const commonPartyDrodown = () => ({
    type: COMMON_PARTY_DROPDOWN,

});
export const commonPartyDrodownSuccess = (data) => ({
    type: COMMON_PARTY_DROPDOWN_SUCCESS,
    payload: data,
});



export const commonPartyDropSelectAction = (data ) => ({
    type: COMMON_PARTY_DROP_SELECT_ACTION,
    payload: data,
});

export const commonPartyDropSelectActionSuccess = (data) => ({
    type: COMMON_PARTY_DROP_SELECT_ACTION_SUCCESS,
    payload: data,
});