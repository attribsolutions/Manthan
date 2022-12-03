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

import "../../../assets/scss/CustomTable2/datatables.scss"
import {
  deleteItemID,
  deleteItemIdSuccess,
  editItemId,
  editItemSuccess,
  getItemList,
  PostItemDataSuccess,
  updateItemSuccess,
} from "../../../store/Administrator/ItemsRedux/action";
import ItemsMaster from "./ItemMaster/index";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { listPageCommonButtonFunction } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";



const ItemsList = (props) => {

  const dispatch = useDispatch();
  const history = useHistory();

  const [userPageAccessState, setUserPageAccessState] = useState('');
  const [modal_center, setmodal_center] = useState(false);

  // get Access redux data
  const { pages, editData, updateMessage, deleteMessage, RoleAccessModifiedinSingleArray,PostAPIResponse } = useSelector(
    (state) => ({
      pages: state.ItemMastersReducer.pages,
      editData: state.ItemMastersReducer.editData,
      updateMessage: state.ItemMastersReducer.updateMessage,
      deleteMessage: state.ItemMastersReducer.deleteMessage,
      RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
      PostAPIResponse: state.ItemMastersReducer.postMessage,
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
    dispatch(getItemList());
  }, []);

  // This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal
  useEffect(() => {
    if (updateMessage.Status === true && updateMessage.StatusCode === 200) {
      dispatch(updateItemSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: updateMessage.Message,
          AfterResponseAction: getItemList,
        })
      );
      tog_center();
    } else if (updateMessage.Status === true) {
      dispatch(updateItemSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(updateMessage.Message),
        })
      );
    }
  }, [updateMessage.Status, dispatch]);

  // This UseEffect => delete Module Success/Unsucces  Show and Hide Control Alert_modal.
  useEffect(() => {
    if (deleteMessage.Status === true && deleteMessage.StatusCode === 200) {
      dispatch(deleteItemIdSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: deleteMessage.Message,
          AfterResponseAction: getItemList,
        })
      );
    } else if (deleteMessage.Status === true) {
      dispatch(deleteItemIdSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(deleteMessage.Message),

        })
      );
    }
  }, [deleteMessage.Status]);

  useEffect(() => {

    if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {
        dispatch(PostItemDataSuccess({ Status: false }))
        tog_center();
        dispatch(getItemList());
        dispatch(AlertState({
            Type: 1,
            Status: true,
            Message: PostAPIResponse.Message,
        }))
    }

    else if ((PostAPIResponse.Status === true)) {
        dispatch(PostItemDataSuccess({ Status: false }))
        dispatch(AlertState({
            Type: 4,
            Status: true,
            Message: JSON.stringify(PostAPIResponse.Message),
            RedirectPath: false,
            AfterResponseAction: false
        }));
    }
}, [PostAPIResponse.Status])
  // This UseEffect => Edit Modal Show When Edit Data is true
  useEffect(() => {
    if (editData.Status === true) {
      tog_center();
      // dispatch(editItemSuccess({ Status: false }))
    }
   
  }, [editData]);

  function tog_center() {
    setmodal_center(!modal_center);
     

  }

console.log("editData",editData)
  const pageOptions = {
    sizePerPage: 10,
    totalSize: pages.length,
    custom: true,
  };

  const defaultSorted = [
    {
      dataField: "Name", // if dataField is not match to any column you defined, it will be ignored.
      order: "asc", // desc or asc
    },
  ];

  const pagesListColumns = [
    {
      text: "ID",
      dataField: "id",
      sort: true,
    },
    {
      text: "Item Name",
      dataField: "Name",
      sort: true,
    },
    {
      text: "Short Name",
      dataField: "ShortName",
      sort: true,
    },
    {
      text: "Base Unit",
      dataField: "BaseUnitName",
      sort: true,
    },
    {
      text: "Company",
      dataField: "CompanyName",
      sort: true,
    },
    {
      text: "BarCode",
      dataField: "BarCode",
      sort: true,
    },

    // For Edit, Delete ,and View Button Common Code function
    listPageCommonButtonFunction({
      dispatchHook: dispatch,
      ButtonMsgLable: "Item",
      deleteName: "Name",
      userPageAccessState: userPageAccessState,
      editActionFun: editItemId,
      deleteActionFun: deleteItemID
    })

  ];

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <MetaTags>
          <title>Item List| FoodERP-React FrontEnd</title>
        </MetaTags>
        <div className="page-content">
          <PaginationProvider pagination={paginationFactory(pageOptions)}>
            {({ paginationProps, paginationTableProps }) => (
              <ToolkitProvider
                keyField="id"
                data={pages}
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
                      isExcelButtonVisible={true}
                      breadcrumbCount={`Items Count: ${pages.length}`}
                      IsSearchVissible={true}
                      ExcelData={pages}
                    // RedirctPath={`/${btoa("ItemMaster")}`}
                    // RedirctPath={`/ItemMaster`}
                    />
                    <Row>
                      <Col xl="12">
                        <div className="table-responsive">
                          <BootstrapTable
                            keyField={"id"}
                            responsive
                            bordered={false}
                            striped={false}
                            defaultSorted={defaultSorted}
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
            <ItemsMaster state={editData.Data} relatatedPage={"/ItemMaster"} pageMode={editData.pageMode} />
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

export default ItemsList;
