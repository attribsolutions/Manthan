import React, { useEffect, useRef, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Modal, Row } from "reactstrap";
import {
  deleteHpagesUsingID,
  deleteModuleIDSuccess,
  editHPagesID,
  GetHpageListData,
  saveHPagesSuccess,
  updateHPagesSuccess,
} from "../../../store/Administrator/HPagesRedux/actions";
import HPageMaster from "./PageMaster";
import {  commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";


export default function PageList() {

  const dispatch = useDispatch();
  const history = useHistory()



  // const { HPageListData, editData, updateMessage, deleteModuleID, RoleAccessModifiedinSingleArray, PostAPIResponse } =
  //   useSelector((state) => ({
  //     HPageListData: state.H_Pages.HPagesListData,
  //     editData: state.H_Pages.editData,
  //     updateMessage: state.H_Pages.updateMessage,
  //     deleteModuleID: state.H_Pages.deleteModuleID,
  //     RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
  //     PostAPIResponse: state.H_Pages.saveMessage,
  //   }));



  const reducers = useSelector(
    (state) => ({
      tableList: state.H_Pages.HPagesListData,
      editData: state.H_Pages.editData,
      updateMsg: state.H_Pages.updateMessage,
      deleteMsg: state.H_Pages.deleteModuleID,
      postMsg: state.H_Pages.saveMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: GetHpageListData,
    editId: editHPagesID,
    deleteId: deleteHpagesUsingID,
    postSucc: saveHPagesSuccess,
    updateSucc: updateHPagesSuccess,
    deleteSucc: deleteModuleIDSuccess
  }

  // Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(5))
    dispatch(GetHpageListData());
  }, []);

  const { pageField } = reducers;

  return (
    <React.Fragment>
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={HPageMaster}
            masterPath={'/PageMaster'}
            ButtonMsgLable={"Page"}
            deleteName={"Name"}
          />
          : null
      }

    </React.Fragment>
  )
}