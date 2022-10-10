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
import { commonPageField, commonPageFieldSuccess } from "../../../store/actions";

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
      pageField: state.CommonPageFieldReducer.pageField
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
    dispatch(commonPageFieldSuccess([]))
    dispatch(commonPageField(94))
    dispatch(getPriceListPage());
  }, []);


  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField.length > 0) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={PriceMaster}
            masterPath={"/PriceMaster"}
            ButtonMsgLable={"price"}
            deleteName={"Name"}
          />
          : null
      }

    </React.Fragment>
  )
    }
  export default PriceList;
