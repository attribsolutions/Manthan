import {
    GET_COMMON_PARTY_DROPDWON_OPTION_ACTION,
    GET_COMMON_PARTY_DROPDWON_OPTION_ACTION_SUCCESS,
    COMMON_PARTY_DROP_SELECT_ACTION,
    COMMON_PARTY_DROP_SELECT_ACTION_SUCCESS,
    CHANGE_COMMON_PARTY_DROPDWON_DETAILS_ACTION
} from "./actionType";

export const getCommonPartyDrodownOptionAction = () => ({
    type: GET_COMMON_PARTY_DROPDWON_OPTION_ACTION,

});
export const getCommonPartyDrodownOptionActionSuccess = (data) => ({
    type: GET_COMMON_PARTY_DROPDWON_OPTION_ACTION_SUCCESS,
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

export const changeCommonPartyDropDetailsAction = (details) => ({
    type: CHANGE_COMMON_PARTY_DROPDWON_DETAILS_ACTION,
    payload: details,
});