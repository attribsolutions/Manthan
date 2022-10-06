import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Col, Modal, Row } from "reactstrap";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, useDispatch } from "react-redux";
import "../../../assets/scss/CustomeTable/datatables.scss";
import CompanyGroupMaster from "./CompanyGroupMaster";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import {
  deleteCompanyGroupTypeIDSuccess,
  updateCompanyGroupTypeIDSuccess,
  getMethodForCompanyGroupList,
  editCompanyGroupTypeId,
  delete_CompanyGroupType_ID,
  PostMethod_ForCompanyGroupMasterSuccess,
} from "../../../store/Administrator/CompanyGroupRedux/action";
import { AlertState } from "../../../store/actions";
import { listPageCommonButtonFunction }
  from "../../../components/Common/CmponentRelatedCommonFile/listPageCommonButtons";

const CompanyGroupList = (props) => {

  const dispatch = useDispatch();
  const history = useHistory()

  const [userPageAccessState, setUserPageAccessState] = useState('');
  const [modal_center, setmodal_center] = useState(false);

  const { TableListData, editData, updateMessage, deleteMessage, RoleAccessModifiedinSingleArray, PostAPIResponse } = useSelector(
    (state) => ({
      TableListData: state.CompanyGroupReducer.CompanyGroupList,
      editData: state.CompanyGroupReducer.editData,
      updateMessage: state.CompanyGroupReducer.updateMessage,
      deleteMessage: state.CompanyGroupReducer.deleteMessage,
      RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
      PostAPIResponse: state.CompanyGroupReducer.PostDataMessage,
    })
  );
  console.log("TableListData", TableListData)
  useEffect(() => {
    const locationPath = history.location.pathname
    let userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
      return (`/${inx.ActualPagePath}` === locationPath)
    })
    if (!(userAcc === undefined)) {
      setUserPageAccessState(userAcc)
    }
  }, [RoleAccessModifiedinSingleArray])

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(getMethodForCompanyGroupList());
  }, []);

  // This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal
  useEffect(() => {

    if (updateMessage.Status === true && updateMessage.StatusCode === 200) {
      dispatch(updateCompanyGroupTypeIDSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: updateMessage.Message,
          AfterResponseAction: getMethodForCompanyGroupList,
        })
      );
      tog_center();
    } else if (updateMessage.Status === true) {
      dispatch(updateCompanyGroupTypeIDSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(updateMessage.Message),
        })
      );
    }
  }, [updateMessage]);

  useEffect(() => {
    if (deleteMessage.Status === true && deleteMessage.StatusCode === 200) {
      dispatch(deleteCompanyGroupTypeIDSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: deleteMessage.Message,
          AfterResponseAction: getMethodForCompanyGroupList,
        })
      );
    } else if (deleteMessage.Status === true) {
      dispatch(deleteCompanyGroupTypeIDSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(deleteMessage.Message),
        })
      );
    }
  }, [deleteMessage]);


  useEffect(() => {

    if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {
      dispatch(PostMethod_ForCompanyGroupMasterSuccess({ Status: false }))
      tog_center();
      dispatch(getMethodForCompanyGroupList());
      dispatch(AlertState({
        Type: 1,
        Status: true,
        Message: PostAPIResponse.Message,
      }))
    }

    else if ((PostAPIResponse.Status === true)) {
      dispatch(PostMethod_ForCompanyGroupMasterSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: JSON.stringify(PostAPIResponse.Message),
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }


  }, [PostAPIResponse.Status])
  // Edit Modal Show When Edit Data is true
  useEffect(() => {
    if (editData.Status === true) {
      tog_center();
    }
  }, [editData]);

  function tog_center() {
    setmodal_center(!modal_center);
  }

  const defaultSorted = [
    {
      dataField: "Name", // if dataField is not match to any column you defined, it will be ignored.
      order: "asc", // desc or asc
    },
  ];

  const pageOptions = {
    sizePerPage: 10,
    totalSize: TableListData.length,
    custom: true,
  };

  const pagesListColumns = [
    {
      text: "Name",
      dataField: "Name",
      sort: true,
    },

    {
      text: "IsSCM",
      dataField: "IsSCM",
      sort: true,
    },

    // For Edit, Delete ,and View Button Common Code function
    listPageCommonButtonFunction({
      dispatchHook: dispatch,
      ButtonMsgLable: "Name",
      deleteName: "Name",
      userPageAccessState: userPageAccessState,
      editActionFun: editCompanyGroupTypeId,
      deleteActionFun: delete_CompanyGroupType_ID
    })
  ];

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <MetaTags>
          <title>CompanyGroupList| FoodERP-React FrontEnd</title>
        </MetaTags>
        <div className="page-content">
          <PaginationProvider pagination={paginationFactory(pageOptions)}>
            {({ paginationProps, paginationTableProps }) => (
              <ToolkitProvider
                keyField="id"
                defaultSorted={defaultSorted}
                data={TableListData}
                columns={pagesListColumns}
                search
              >
                {(toolkitProps) => (
                  <React.Fragment>
                    <Breadcrumbs
                      title={"Count :"}
                      breadcrumbItem={userPageAccessState.PageHeading}
                      IsButtonVissible={(userPageAccessState.RoleAccess_IsSave) ? true : false}
                      SearchProps={toolkitProps.searchProps}
                      breadcrumbCount={`Product Count: ${TableListData.length}`}
                      IsSearchVissible={true}
                      RedirctPath={`/CompanyGroupMaster`}
                      isExcelButtonVisible={true}
                      ExcelData={TableListData}
                    />
                    <Row>
                      <Col xl="12">
                        <div className="table-responsive">
                          <BootstrapTable
                            keyField={"id"}
                            responsive
                            bordered={false}
                            striped={false}
                            classes={"table  table-bordered"}
                            {...toolkitProps.baseProps}
                            {...paginationTableProps}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row className="align-items-md-center mt-30">
                      <Col className="pagination pagination-rounded justify-content-end mb-2">
                        <PaginationListStandalone {...paginationProps} />
                      </Col>
                    </Row>
                  </React.Fragment>
                )}
              </ToolkitProvider>
            )}
          </PaginationProvider>
          <Modal
            isOpen={modal_center}
            toggle={() => {
              tog_center();
            }}
            size="xl"
          >
            <CompanyGroupMaster state={editData.Data} relatatedPage={"/CompanyGroupMaster"} pageMode={editData.pageMode} />
          </Modal>
        </div>
      </React.Fragment>
    );
  }
  else {
    return (
      <React.Fragment></React.Fragment>
    )
  }
}

export default CompanyGroupList;
