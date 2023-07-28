import { roleAceessAction } from "../../store/actions";
import { getpartysetting_API } from "../../store/Administrator/PartySetting/action";
import { commonPartyDrodown } from "../../store/Utilites/PartyDrodown/action";
import { loginCompanyID } from "./CommonFunction";

export const afterloginOneTimeAPI = (user, dispatch) => {
    var employeeId = user.Employee_id;
    var partyId = user.Party_id;

    localStorage.setItem("roleId", JSON.stringify(user));
    localStorage.setItem("selectedParty", JSON.stringify({ value: 0, label: "select..." }));
    localStorage.setItem("roleId2", JSON.stringify(user));
    dispatch(roleAceessAction(partyId, employeeId, loginCompanyID()))
    dispatch(getpartysetting_API(partyId, loginCompanyID()))//login party id pass to getpartysetting_API
    dispatch(commonPartyDrodown())  // Party Dropdown Action 

}