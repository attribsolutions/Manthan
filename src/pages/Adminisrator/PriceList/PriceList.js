import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PriceMaster from "./PriceMaster";
import {
  delete_PriceListSuccess,
  savePriceMasterActionSuccess,
  delete_PriceList,
  editPriceList,
  updatePriceListSuccess,
  priceListByCompay_Action
} from "../../../store/Administrator/PriceList/action";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import { PRICE } from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"

const PriceList = () => {
  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.PriceListReducer.priceListByCompany,
      editData: state.PriceListReducer.editData,
      updateMsg: state.PriceListReducer.updateMessage,
      deleteMsg: state.PriceListReducer.deleteMsg,
      postMsg: state.PriceListReducer.postMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const { pageField, userAccess = [] } = reducers

  const action = {
    getList: priceListByCompay_Action,
    editId: editPriceList,
    deleteId: delete_PriceListSuccess,
    postSucc: savePriceMasterActionSuccess,
    updateSucc: updatePriceListSuccess,
    deleteSucc: delete_PriceList
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(pageId.PARTYITEM_LIST))
    dispatch(priceListByCompay_Action());
  }, []);


  function editBodyfunc(row) {

    const config = { ...row }
    config.PartyTypeName = row.rowData.PLPartyTypeName
    config.PartyTypeId = row.rowData.PLPartyType;
    config.editId = row.rowData.PLPartyType

    dispatch(editPriceList(config))
  }

  return (
    <React.Fragment>
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={PriceMaster}
            masterPath={PRICE}
            ButtonMsgLable={"Price"}
            deleteName={"Name"}
            editBodyfunc={editBodyfunc}
          />
          : null
      }

    </React.Fragment>
  )
}
export default PriceList;
