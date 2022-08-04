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
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import "../../../assets/scss/CustomeTable/datatables.scss";
import {
  deleteItemID,
  deleteItemIdSuccess,
  editItemId,
  getItemList,
  updateItemSuccess,
} from "../../../store/Administrator/ItemsRedux/action";
import ItemsMaster from "./ItemMaster";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";

const ItemsList = (props) => {

  const dispatch = useDispatch();
  const history = useHistory();

  const [userPageAccessState, setUserPageAccessState] = useState('');
  const [modal_center, setmodal_center] = useState(false);

  // get Access redux data
  const { pages, editData, updateMessage, deleteMessage } = useSelector(
    (state) => ({
      pages: state.ItemMastersReducer.pages,
      editData: state.ItemMastersReducer.editData,
      updateMessage: state.ItemMastersReducer.updateMessage,
      deleteMessage: state.ItemMastersReducer.deleteMessage,
    })
  );

  useEffect(() => {
    const userAcc = CommonGetRoleAccessFunction(history)
    if (!(userAcc === undefined)) {
      setUserPageAccessState(userAcc)
    }
  }, [history])

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

  // This UseEffect => Edit Modal Show When Edit Data is true
  useEffect(() => {
    if (editData.Status === true) {
      tog_center();
    }
  }, [editData]);
debugger
  function tog_center() {
    setmodal_center(!modal_center);
  }

  //select id for delete row
  const deleteHandeler = (id, name) => {
    dispatch(
      AlertState({
        Type: 5,
        Status: true,
        Message: `Are you sure you want to delete this item : "${name}"`,
        RedirectPath: false,
        PermissionAction: deleteItemID,
        ID: id,
      })
    );
  };
  // edit Buutton Handller
  const EditPageHandler = (id) => {
    dispatch(editItemId(id));
  };

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
      text: "Item Name",
      dataField: "Name",
      sort: true,
    },
    {
      text: "GST(%)",
      dataField: "GSTPercentage",
      sort: true,
    },
    {
      text: "MRP",
      dataField: "MRP",
      sort: true,
    },
    {
      text: "Active",
      dataField: "isActive",
      sort: true,
    },

    {
      text: "Action",
      hidden: (
        !(userPageAccessState.RoleAccess_IsEdit)
        && !(userPageAccessState.RoleAccess_IsView)
        && !(userPageAccessState.RoleAccess_IsDelete)) ? true : false,

      formatter: (cellContent, Item) => (
        <div className="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >
             {((userPageAccessState.RoleAccess_IsEdit))  ?
            <Button
              type="button"
              data-mdb-toggle="tooltip" data-mdb-placement="top" title="Edit Item"
              onClick={() => { EditPageHandler(Item.id); }}
              className="badge badge-soft-success font-size-12 btn btn-success waves-effect waves-light w-xxs border border-light"
            >
              <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
            </Button> : null}

          {(!(userPageAccessState.RoleAccess_IsEdit) && (userPageAccessState.RoleAccess_IsView)) ?
            <Button
              type="button"
              data-mdb-toggle="tooltip" data-mdb-placement="top" title="View Item"
              onClick={() => { EditPageHandler(Item.id); }}
              className="badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"

            >
              <i className="bx bxs-show font-size-18 "></i>
            </Button> : null}

          {(userPageAccessState.RoleAccess_IsDelete)
            ?
            <Button
              className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
              data-mdb-toggle="tooltip" data-mdb-placement="top" title="Delete Item"
              onClick={() => { deleteHandeler(Item.id, Item.Name); }}
            >
              <i className="mdi mdi-delete font-size-18"></i>
            </Button>
            : null
          }

        </div>
      ),
    },
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
                      breadcrumbCount={`Items Count: ${pages.length}`}
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
            <ItemsMaster state={editData.Data} />
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
