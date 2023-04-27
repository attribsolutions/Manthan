import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PriceMaster from "./PriceMaster";
import {
  delete_PriceListSuccess,
  savePriceMasterActionSuccess,
  delete_PriceList,
  editPriceList,
  updatePriceListSuccess,
  getPriceListPage
} from "../../../store/Administrator/PriceList/action";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import { PRICE } from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"

const PriceList = () => {
  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.PriceListReducer.priceList,
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
    getList: getPriceListPage,
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
    dispatch(getPriceListPage());
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
      <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
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
