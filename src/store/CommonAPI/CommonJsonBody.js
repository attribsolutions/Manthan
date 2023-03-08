import {
    loginCompanyID,
    loginPartyID,
    loginRoleID,
    loginUserID
} from "../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";

export const loginJsonBody = () => ({
    UserID: loginUserID(),
    RoleID: loginRoleID(),
    CompanyID: loginCompanyID(),
    PartyID: loginPartyID()
})
