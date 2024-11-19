import { divisionDropdownSelectAction, getUserDetailsAction, loginUser, roleAceessAction } from "../../store/actions";
import { getpartysetting_API } from "../../store/Administrator/PartySetting/action";
import { getCommonPartyDrodownOptionAction, commonPartyDropSelectAction } from "../../store/Utilites/PartyDrodown/action";
import { loginCompanyID } from "./CommonFunction";

export const afterloginOneTimeAPI = (user, dispatch) => {
    
    const employeeId = user.Employee_id;
    const partyId = user.Party_id;
    const partyName = user.PartyName

    if (user.PartyType === "Company Division") {
        const selectedParty = JSON.parse(localStorage.getItem("selectedParty")) || '';
        if (selectedParty.value > 0) {
            dispatch(commonPartyDropSelectAction(selectedParty))
        }
        else {
            dispatch(commonPartyDropSelectAction({ value: 0, label: "select party...", SAPPartyCode: "" }))
            localStorage.setItem("selectedParty", JSON.stringify({ value: 0, label: "select party...", SAPPartyCode: "" }));
        }
    }
    else {
        dispatch(commonPartyDropSelectAction({ value: partyId, label: partyName, SAPPartyCode: "" }))
        localStorage.setItem("selectedParty", JSON.stringify({ value: partyId, label: partyName, SAPPartyCode: "" }));
    }

    localStorage.setItem("roleId", JSON.stringify(user));
    localStorage.setItem("roleId2", JSON.stringify(user));

    dispatch(roleAceessAction(partyId, employeeId, loginCompanyID()))
    dispatch(getpartysetting_API(partyId, loginCompanyID()))
    dispatch(getCommonPartyDrodownOptionAction())

}


// export const loginFromOutSideLink_Func = ({ Credentials, subPageMode, dispatch, LoginDetails, LoginUserDetails }) => {
//     
//     const [User, password] = Credentials?.split('-');
//     if ((LoginDetails.Status === false) && (Credentials)) {
//         const values = {
//             UserName: User,
//             Password: password
//         }
//         dispatch(loginUser(values))
//     }
//     if (LoginDetails) {
//         dispatch(getUserDetailsAction(LoginDetails.UserID))
//     }
//     if (LoginUserDetails) {
//         dispatch(divisionDropdownSelectAction(localStorage.getItem("EmployeeID")))
//     }


// }




export const loginFromOutSideLink_Func = async ({ Credentials, subPageMode, dispatch, LoginDetails, LoginUserDetails = {}, divisionDropdown }) => {

    const [User, password] = Credentials?.split('-') || [];
    const token = localStorage.getItem("token")
    
    if ((LoginDetails?.Status === false && Credentials) || !token || !LoginDetails.UserID) {
        const values = {
            UserName: User,
            Password: password
        };
        await dispatch(loginUser(values));
        return
    }

    // if (LoginDetails && LoginDetails.Status === true && !(Object.keys(LoginUserDetails).length > 0)) {
    //     await dispatch(getUserDetailsAction(LoginDetails.UserID));
    //     return
    // }

    // if (LoginUserDetails && !(divisionDropdown.length > 0)) {
    //     const employeeID = localStorage.getItem("EmployeeID");
    //     if (employeeID) {
    //         await dispatch(divisionDropdownSelectAction(employeeID));
    //         return
    //     }
    // }
    // if (divisionDropdown.length > 0) {
    //     const User = divisionDropdown[0]
    //     localStorage.setItem("roleId", JSON.stringify(User));
    //     const Party_Id = User.Party_id
    //     const Employee_Id = User.Employee_id
    //     await dispatch(roleAceessAction(Party_Id, Employee_Id, loginCompanyID()))
    //     await dispatch(getCommonPartyDrodownOptionAction())
    //     await dispatch(getpartysetting_API(Party_Id, loginCompanyID()))
    //     return
    // }


};
