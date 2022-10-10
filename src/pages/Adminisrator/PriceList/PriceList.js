import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PriceMaster from "./PriceMaster";
import {
  delete_PriceListSuccess,
  postPriceListDataSuccess,
  delete_PriceList,
  editPriceList,
  updatePriceListSuccess,
  getPriceListPage
} from "../../../store/Administrator/PriceList/action";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import { PRICE } from "../../../routes/route_url";

const PriceList = (props) => {
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

  const action = {
    getList: getPriceListPage,
    editId: editPriceList,
    deleteId: delete_PriceListSuccess,
    postSucc: postPriceListDataSuccess,
    updateSucc: updatePriceListSuccess,
    deleteSucc: delete_PriceList
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(94))
    dispatch(getPriceListPage());
  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={PriceMaster}
            masterPath={PRICE}
            ButtonMsgLable={"price"}
            deleteName={"Name"}
          />
          : null
      }

    </React.Fragment>
  )
}

export default PriceList;
