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

const ItemsList = (props) => {
  const dispatch = useDispatch();
  const [modal_center, setmodal_center] = useState(false);
  const [pageHeading, setPageHeading] = useState();

  // get Access redux data
  const { pages, editData, updateMessage, deleteMessage } = useSelector(
    (state) => ({
      pages: state.ItemMastersReducer.pages,
      editData: state.ItemMastersReducer.editData,
      updateMessage: state.ItemMastersReducer.updateMessage,
      deleteMessage: state.ItemMastersReducer.deleteMessage,
    })
  );

  const history = useHistory()

  const userPageAccess = history.location.state
  debugger

  useEffect(() => {

    if ((userPageAccess === undefined)) {

      history.push("/Dashboard")
    }
    else {
      if (!(userPageAccess.fromDashboardAccess)) {
        history.push("/Dashboard")

      }
      // setPageHeading( userPageAccess.label)
    };
  }, [props])

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

  // Edit Modal Show When Edit Data is true
  useEffect(() => {
    if (editData.Status === true) {
      tog_center();
    }
  }, [editData]);

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
      formatter: (cellContent, Item) => (
        <>
          <div
            className="d-flex gap-3"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <buton
              type="button"
              data-mdb-toggle="tooltip"
              data-mdb-placement="top"
              title="Edit Item"
              onClick={() => {
                EditPageHandler(Item.id);
              }}
              className="badge badge-soft-primary font-size-12"
            >
              <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
            </buton>
            <buton
              className="badge badge-soft-danger font-size-12"
              data-mdb-toggle="tooltip"
              data-mdb-placement="top"
              title="Delete Item"
              onClick={() => {
                deleteHandeler(Item.id, Item.Name);
              }}
            >
              <i className="mdi mdi-delete font-size-18"></i>
            </buton>
          </div>
        </>
      ),
    },
  ];

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
                    breadcrumbItem={"Item List"}
                    IsButtonVissible={true}
                    SearchProps={toolkitProps.searchProps}
                    breadcrumbCount={`Items Count: ${pages.length}`}
                    userPageAccess={userPageAccess}
                    RedirctPath={`/${btoa("ItemMaster")}`}
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
};

export default ItemsList;
