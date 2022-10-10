
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
import { MetaTags } from "react-meta-tags";
import { useHistory, Redirect } from "react-router-dom";
import {
  deleteDriverTypeIDSuccess,
  updateDriverTypeIDSuccess,
  getMethodForDriverList,
  editDriverTypeId,
  delete_DriverType_ID,
  PostMethod_ForDriverMasterSuccess,
} from "../../../store/Administrator/DriverRedux/action";

import { AlertState } from "../../../store/actions";
import { listPageCommonButtonFunction }
  from "../../../components/Common/CmponentRelatedCommonFile/listPageCommonButtons";

const CommonListPage = (props) => {

  const dispatch = useDispatch();
  const history = useHistory()

  const [userPageAccessState, setUserPageAccessState] = useState('');
  const [modal_center, setmodal_center] = useState(false);
  const [isRedirect, setIsRedirect] = useState(false);

  const {
    tableList,
    editData,
    updateMsg,
    deleteMsg,
    userAccess,
    postMsg,
    pageField

  } = props.reducers;

  const {
    getList,
    editId,
    deleteId,
    postSucc,
    updateSucc,
    deleteSucc

  } = props.action

  const {
    MasterModal,
    masterPath,
    ButtonMsgLable,
    deleteName
  } = props;

  useEffect(() => {
    debugger
    const locationPath = history.location.pathname
    let userAcc = userAccess.find((inx) => {
      return (`/${inx.ActualPagePath}` === locationPath)
    })
    if (!(userAcc === undefined)) {
      setUserPageAccessState(userAcc)
    }
  }, [userAccess])


  // This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal
  useEffect(() => {

    if (updateMsg.Status === true && updateMsg.StatusCode === 200) {
      dispatch(updateSucc({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: updateMsg.Message,
          AfterResponseAction: getList,
        })
      );
      tog_center();
    } else if (updateMsg.Status === true) {
      dispatch(updateSucc({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(updateMsg.Message),
        })
      );
    }
  }, [updateMsg]);

  useEffect(() => {
    if (deleteMsg.Status === true && deleteMsg.StatusCode === 200) {
      dispatch(deleteSucc({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: deleteMsg.Message,
          AfterResponseAction: getList,
        })
      );
    } else if (deleteMsg.Status === true) {
      dispatch(deleteSucc({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(deleteMsg.Message),
        })
      );
    }
  }, [deleteMsg]);


  useEffect(() => {

    if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
      dispatch(postSucc({ Status: false }))
      tog_center();
      dispatch(getList());
      dispatch(AlertState({
        Type: 1,
        Status: true,
        Message: postMsg.Message,
      }))
    }

    else if ((postMsg.Status === true)) {
      dispatch(postSucc({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: JSON.stringify(postMsg.Message),
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }


  }, [postMsg])

  // Edit Modal Show When Edit Data is true
  useEffect(() => {
    if (editData.Status === true) {
      if (pageField.IsEditPopuporComponent) {
        history.push({
          pathname: masterPath,
          editValue: editData.Data,
          pageMode: editData.pageMode,

        })
      }
      else {
        tog_center();
      }
    }
  }, [editData]);

  function tog_center() {
    setmodal_center(!modal_center);
  }

  let sortLabel = ""
  let pageFiledColumn = []
  const columns = []

  // const hasfield = false
  // if (hasfield) {
  //   pageFiledColumn = pageField.PageFieldMaster
  // }

  pageField.PageFieldMaster.forEach((i, k) => {
    if (i.ShowInListPage) {
      columns.push({
        text: i.FieldLabel,
        dataField: i.ControlID,
        sort: true,
      })
      if (i.DefaultSort) {
        sortLabel = i.ControlID
      }
    }
    if (pageField.PageFieldMaster.length - 1 === k) {
      columns.push(listPageCommonButtonFunction({
        dispatchHook: dispatch,
        ButtonMsgLable: ButtonMsgLable,
        deleteName: deleteName,
        userPageAccessState: userPageAccessState,
        editActionFun: editId,
        deleteActionFun: deleteId
      })
      )
    }
  })
  const defaultSorted = [
    {
      dataField: sortLabel, // if dataField is not match to any column you defined, it will be ignored.
      order: "asc", // desc or asc
    },
  ];

  const pageOptions = {
    sizePerPage: 15,
    // totalSize: tableList.length,
    custom: true,
  };

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <MetaTags>
          <title>{userPageAccessState.PageHeading}| FoodERP-React FrontEnd</title>
        </MetaTags>
        <div className="page-content">
          <PaginationProvider pagination={paginationFactory(pageOptions)}>
            {({ paginationProps, paginationTableProps }) => (
              <ToolkitProvider
                keyField="id"
                defaultSorted={defaultSorted}
                data={tableList}
                columns={columns}
                search
              >
                {(toolkitProps) => (
                  <React.Fragment>
                    <Breadcrumbs
                      title={"Count :"}
                      breadcrumbItem={userPageAccessState.PageHeading}
                      IsButtonVissible={(userPageAccessState.RoleAccess_IsSave) ? true : false}
                      SearchProps={toolkitProps.searchProps}
                      breadcrumbCount={`Product Count: ${tableList.length}`}
                      IsSearchVissible={true}
                      RedirctPath={masterPath}
                      isExcelButtonVisible={true}
                      ExcelData={tableList}
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

            <MasterModal editValue={editData.Data} masterPath={masterPath} pageMode={editData.pageMode} />
          </Modal>
        </div>
        {/* {(isRedirect) ? <Redirect to={{
          pathname: masterPath,
          state: editData.Data, relatatedPage: masterPath, pageMode: editData.pageMode
        }} /> : null} */}
      </React.Fragment>
    );
  }
  else {
    return (
      <React.Fragment></React.Fragment>
    )
  }
}

export default CommonListPage;
