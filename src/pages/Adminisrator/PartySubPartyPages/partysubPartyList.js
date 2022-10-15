import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import AddEmployee from "./EmployeeMaster";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import { EMPLOYEE } from "../../../routes/route_url";
import {
  deletePartySubParty,
  deletePartySubPartySuccess,
  editPartySubParty,
  getPartySubPartylist,
  postPartySubPartySuccess,
  updatePartySubPartySuccess
} from "../../../store/Administrator/PartySubPartyRedux/action";
import { PARTY_SUB_PARTY } from "../../../helpers/url_helper";

const Employee_List = () => {
  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.PartySubPartyReducer.listData,
      postMsg: state.M_EmployeesReducer.postMsg,
      editData: state.M_EmployeesReducer.editData,
      updateMsg: state.M_EmployeesReducer.updateMsg,
      deleteMsg: state.M_EmployeesReducer.deleteMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList

    })
  );

  const action = {
    getList: getPartySubPartylist,
    editId: editPartySubParty,
    deleteId: deletePartySubParty,
    postSucc: postPartySubPartySuccess,
    updateSucc: updatePartySubPartySuccess,
    deleteSucc: deletePartySubPartySuccess
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(122))
    dispatch(getPartySubPartylist());
  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={AddEmployee}
            masterPath={PARTY_SUB_PARTY}
            ButtonMsgLable={"PartySubParty"}
            deleteName={"PartySubParty"}
          />
          : null
      }

    </React.Fragment>
  )
}

export default Employee_List;
