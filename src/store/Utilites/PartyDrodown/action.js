import { COMMON_PARTY_DROPDOWN, COMMON_PARTY_DROPDOWN_SUCCESS } from "./actionType";

export const commonPartyDrodown = () => ({
    type: COMMON_PARTY_DROPDOWN,

});
export const commonPartyDrodownSuccess = (data) => ({
    type: COMMON_PARTY_DROPDOWN_SUCCESS,
    payload: data,
});