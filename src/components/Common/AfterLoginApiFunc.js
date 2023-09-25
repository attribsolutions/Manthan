import { roleAceessAction } from "../../store/actions";
import { getpartysetting_API } from "../../store/Administrator/PartySetting/action";
import { commonPartyDrodown, commonPartyDropSelectAction } from "../../store/Utilites/PartyDrodown/action";
import { loginCompanyID } from "./CommonFunction";

export const afterloginOneTimeAPI = (user, dispatch) => {

    const employeeId = user.Employee_id;
    const partyId = user.Party_id;
    const partyName = user.PartyName

    if (user.PartyType === "Company Division") {
        const selectedParty = JSON.parse(localStorage.getItem("selectedParty"));
        if (!selectedParty.value > 0) {
            dispatch(commonPartyDropSelectAction({ value: 0, label: "select...", SAPPartyCode: "" }))
            localStorage.setItem("selectedParty", JSON.stringify({ value: 0, label: "select...", SAPPartyCode: "" }));
        }
    }
    else {
        dispatch(commonPartyDropSelectAction({ value: partyId, label: partyName, SAPPartyCode: "" }))
        localStorage.setItem("selectedParty", JSON.stringify({ value: partyId, label: partyName, SAPPartyCode: "" }));
    }

    localStorage.setItem("roleId", JSON.stringify(user));
    localStorage.setItem("roleId2", JSON.stringify(user));
    dispatch(roleAceessAction(partyId, employeeId, loginCompanyID()))
    dispatch(getpartysetting_API(partyId, loginCompanyID()))//login party id pass to getpartysetting_API
    dispatch(commonPartyDrodown())  // Party Dropdown Action 

}