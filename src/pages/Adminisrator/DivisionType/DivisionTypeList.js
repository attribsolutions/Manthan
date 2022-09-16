import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Button, Col, Modal, Row } from "reactstrap";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, useDispatch } from "react-redux";
import { AlertState } from "../../../store/actions";
import "../../../assets/scss/CustomeTable/datatables.scss";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import DivisionType from "./DivisionType";
import {
  deleteDivisionTypeIDSuccess,
  delete_DivisionType_ID,
  editDivisionTypeId,
  getDivisionTypelist,
  PostDivisionTypeSuccess,
  updateDivisionTypeIDSuccess
} from "../../../store/Administrator/DivisionTypeRedux/action";
import { listPageCommonButtonFunction } from "../../../components/Common/CmponentRelatedCommonFile/listPageCommonButtons";

const DivisionTypeList = (props) => {

  const dispatch = useDispatch();
  const history = useHistory()

  const [userPageAccessState, setUserPageAccessState] = useState('');
  const [modal_center, setmodal_center] = useState(false);

  // get Access redux data
  const { TableListData, editData, updateMessage, deleteMessage, RoleAccessModifiedinSingleArray,PostAPIResponse } = useSelector(
    (state) => ({
      TableListData: state.DivisionTypeReducer.ListData,
      editData: state.DivisionTypeReducer.editData,
      updateMessage: state.DivisionTypeReducer.updateMessage,
      deleteMessage: state.DivisionTypeReducer.deleteMessage,
      RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
      PostAPIResponse: state.DivisionTypeReducer.PostData,
    })
  );

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
    dispatch(getDivisionTypelist());
  }, []);

  // This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal
  useEffect(() => {

    if (updateMessage.Status === true && updateMessage.StatusCode === 200) {
      dispatch(updateDivisionTypeIDSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: updateMessage.Message,
          AfterResponseAction: getDivisionTypelist,
        })
      );
      tog_center();
    } else if (updateMessage.Status === true) {
      dispatch(updateDivisionTypeIDSuccess({ Status: false }));
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
      dispatch(deleteDivisionTypeIDSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: deleteMessage.Message,
          AfterResponseAction: getDivisionTypelist,
        })
      );
    } else if (deleteMessage.Status === true) {
      dispatch(deleteDivisionTypeIDSuccess({ Status: false }));
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
        dispatch(PostDivisionTypeSuccess({ Status: false }))
        tog_center();
        dispatch(getDivisionTypelist());
        dispatch(AlertState({
            Type: 1,
            Status: true,
            Message: PostAPIResponse.Message,
        }))
    }

    else if ((PostAPIResponse.Status === true)) {
        dispatch(PostDivisionTypeSuccess({ Status: false }))
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
      text: "Is SCM ",
      dataField: "IsSCM",
      sort: true,
    },

    // For Edit, Delete ,and View Button Common Code function
    listPageCommonButtonFunction({
      dispatchHook: dispatch,
      ButtonMsgLable: "Division Type",
      deleteName: "Name",
      userPageAccessState: userPageAccessState,
      editActionFun: editDivisionTypeId,
      deleteActionFun: delete_DivisionType_ID
    })
  ];

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <MetaTags>
          <title>Division Type List| FoodERP-React FrontEnd</title>
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
                      breadcrumbCount={`Division Count: ${TableListData.length}`}
                      IsSearchVissible={true}
                      isExcelButtonVisible={true}
                      ExcelData={TableListData}
                    // RedirctPath={`/RoleMaster`}
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
            <DivisionType state={editData.Data} relatatedPage={"/DivisionType"} pageMode={editData.pageMode}/>
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

export default DivisionTypeList;
