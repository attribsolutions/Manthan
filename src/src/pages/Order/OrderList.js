import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Modal, Row, Col, Label, Container, Card, CardBody, FormGroup } from "reactstrap";
import Select from "react-select";
import { useHistory } from "react-router-dom";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import flatpickr from "flatpickr";
import {
  deleteOrderID_From_OrderPage,
  deleteOrderID_From_OrderPageSuccess,
  editOrder_forOrderPage, getOrderList,
  updateOrderID_From_OrderPageSuccess
} from "../../store/Purchase/OrderPageRedux/actions";
import { MetaTags } from "react-meta-tags";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Breadcrumbs from "../../components/Common/Breadcrumb";
// import generate from "../../Reports/Page"
import './div.css'
import OrderPage from "./OrderPage";
import { AlertState } from "../../store/actions";
import generate from "../../Reports/InvioceReport/Page";
import { InvoiceFakeData } from "./InvioceFakedata";
import { get_Party_ForDropDown } from "../../store/Administrator/ItemsRedux/action";

export const topFunction = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
const OrderList = (props) => {

  const [modal_center, setmodal_center] = useState(false);
  const [partyName_dropdown_Select, setPartyName_dropdown_Select] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const current = new Date();
  const month = current.getMonth() + 1;
  const date = current.getDate();

  const currentDate = `${current.getFullYear()}-${month < 10 ? `0${month}` : `${month}`
    }-${date < 10 ? `0${date}` : `${date}`}`;

  const fromDateIn = `${current.getFullYear()}-${month < 10 ? `0${month}` : `${month}`
    }-${date < 10 ? `0${date}` : `${date}`}`;

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [orderDelete, setOrderDelete] = useState(false);

  function tog_center() {
    setmodal_center(!modal_center)
  }

  //fetch list Page Function 
  function fetchOrderList_dispatch_function() {
    const orderlistInitial = {
      FromDate: fromDateIn,// !fromDate ? fromDateIn : fromDate,
      ToDate: currentDate, //!toDate ? currentDate : toDate,
      CustomerID: 0,
      DivisionID: 3,
    };
    dispatch(getOrderList(orderlistInitial));
    return getOrderList(orderlistInitial)
  }

  useEffect(() => {
    fetchOrderList_dispatch_function()
    dispatch(get_Party_ForDropDown());
  }, [dispatch, currentDate, fromDateIn, orderDelete]);


  const customerNameOption = props.orderList;

  const { editOrderData, TableListData, deleteMessage, updateMessage,Party } = useSelector((state) => ({
    editOrderData: state.OrderPageReducer.editOrderData,
    TableListData: state.OrderPageReducer.ordersList,
    deleteMessage: state.OrderPageReducer.deleteMessage,
    updateMessage: state.OrderPageReducer.updateMessage,
    Party: state.ItemMastersReducer.Party,
  }));

  function goHandeller() {
    debugger
    const orderlistInitial = {
      FromDate: !fromDate ? fromDateIn : fromDate,
      ToDate: !toDate ? currentDate : toDate,
      CustomerID: 0,
      DivisionID: 3,
    };
    dispatch(getOrderList(orderlistInitial));
  }

  useEffect(() => {

    if ((updateMessage.Status === true) && (updateMessage.StatusCode === 200)) {
      dispatch(updateOrderID_From_OrderPageSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 1, Status: true,
        Message: updateMessage.Message,
        AfterResponseAction: fetchOrderList_dispatch_function,
      }))
      tog_center()
    }
    else if (updateMessage.Status === true) {
      dispatch(updateOrderID_From_OrderPageSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 3, Status: true,
        Message: updateMessage.Message,
      }));
    }
  }, [updateMessage.Status, dispatch]);

  useEffect(() => {
    if ((deleteMessage.Status === true) && (deleteMessage.StatusCode === 200)) {
      dispatch(deleteOrderID_From_OrderPageSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 1, Status: true,
        Message: deleteMessage.Message,
        AfterResponseAction: fetchOrderList_dispatch_function,
      }))
    } else if (deleteMessage.Status === true) {
      dispatch(deleteOrderID_From_OrderPageSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 3,
        Status: true,
        Message: "error Message",
      }));
    }
  }, [deleteMessage.Status])

  // Edit Modal Show When Edit Data is true
  useEffect(() => {
    if (editOrderData.Status === true) {
      tog_center()
    }
  }, [editOrderData]);


  function OnPritHandeller(id) {
    // dispatch(editOrder_forOrderPage(id));
    // if (!(editOrderData.length === 0)) {
    //   console.log("datataat", editOrderData)
    generate(InvoiceFakeData)
  }

  function EditPageHandler(id) {
    dispatch(editOrder_forOrderPage(id));
  }

  //  Delete Button Handller
  const deleteHandeler = (id, name) => {
    debugger
    dispatch(AlertState({
      Type: 5, Status: true,
      Message: `Are you sure you want to delete this item : "${name}"`,
      RedirectPath: false,
      PermissionAction: deleteOrderID_From_OrderPage,
      ID: id
    }));
  }

  const PartyDropdown_Options = Party.map((Data) => ({
    value: Data.id,
    label: Data.Name
}));

function PartyType_Dropdown_OnChange_Handller(e) {
  setPartyName_dropdown_Select(e)
}

  const pageOptions = {
    sizePerPage: 15,
    totalSize: TableListData.length, // replace later with size(users),
    custom: true,
  };
  const defaultSorted = [
    {
      dataField: "OrderDate", // if dataField is not match to any column you defined, it will be ignored.
      order: "desc", // desc or asc
    },
  ];

  const TableListColumns = [
    {
      text: "Customer",
      dataField: "Customer",
      sort: true,
    },
    {
      text: "Order Amount",
      dataField: "OrderAmount",
      sort: true,
    },
    {
      text: "OrderDate",
      dataField: "OrderDate",
      sort: true,
    },

    {
      text: "Action",
      formatter: (cellContent, order) => (

        <div class="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >
          <buton
            type="button"
            onClick={() => {
              EditPageHandler(order.ID);
            }}
            className="badge badge-soft-primary font-size-12"
          >
            <i class="mdi mdi-pencil font-size-18" id="edittooltip"></i>
          </buton>

          <buton
            className="badge badge-soft-danger font-size-12"
            onClick={() => {
              deleteHandeler(order.id, order.customerName);
            }}
          >
            <i class="mdi mdi-delete font-size-18" ></i>
          </buton>

          <buton
            className="badge badge-soft-info font-size-12"
            onClick={() => {
              OnPritHandeller()
            }}
          >
            <i class="mdi mdi-shredder font-size-18"></i>
          </buton>
        </div>
      ),
    },
  ];

  window.onscroll = function () { scrollFunction() };

  function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      // document.getElementById("myBtn").style.display = "block";
    } else {
      // document.getElementById("myBtn").style.display = "none";
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Order List| FoodERP-React FrontEnd</title>
        </MetaTags>
        {/* 
        <div class="footer-tools">
          <button onClick={() => topFunction()} id="myBtn" data-toggle="tooltip" title="Back To Top"><i className="dripicons-arrow-up"></i></button>
        </div> */}
        <PaginationProvider
          pagination={paginationFactory(pageOptions)}
        >
          {({ paginationProps, paginationTableProps }) => (
            <ToolkitProvider
              keyField="id"
              data={TableListData}
              columns={TableListColumns}
              search
            >
              {toolkitProps => (
                <React.Fragment>
                  <Breadcrumbs
                    title={"Count :"}
                    // breadcrumbItem={"Orders List"}
                    breadcrumbCount={`Order Count : ${TableListData.length}`}
                    IsButtonVissible={true}
                    SearchProps={toolkitProps.searchProps}
                    // breadcrumbCount={TableListData.length}
                    RedirctPath={"/order"}
                  />
                  <Container fluid>
                    <Card >
                      {/* <CardHeader className="card-header   text-dark" style={{ backgroundColor: "#dddddd" }}>
              <h4 className=" text-center text-black" >React Validation - Normal</h4>
              <p className=" text-black">Provide valuable, actionable feedback to your users with HTML5 form validation–available in all our supported browsers.</p>
            </CardHeader> */}
                      < CardBody>
                        <Row className="mb-1 border border-black text-black mt-n3" style={{ backgroundColor: "#dddddd" }} >

                          <Col md="4" className="">
                            <FormGroup className="mb- row mt-3 " >
                              <Label className="col-sm-3 p-2">To Date</Label>
                              <Col md="7">
                                <Input
                                  // className="form-control"
                                  type="date"
                                  defaultValue={fromDateIn}
                                  onChange={(e) => {
                                    setFromDate(e.target.value);
                                  }}
                                  id="example-date-input1"
                                />
                              </Col>
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup className="mb-2 row mt-3 " >
                              <Label className="col-sm-3 p-2">From Date</Label>
                              <Col md="7">
                                <Input
                                  // className="form-control"
                                  type="date"
                                  defaultValue={currentDate}
                                  onChange={(e) => {
                                    setToDate(e.target.value);
                                  }}
                                  id="example-date-input2"
                                />
                              </Col>
                            </FormGroup>
                          </Col >

                          <Col md="3">
                            <FormGroup className="mb-2 row mt-3" >
                              <Label className="col-sm-6 p-2">Customer Name</Label>
                              <Col md="6">
                                <Select options={PartyDropdown_Options} />
                              </Col>
                            </FormGroup>
                          </Col>
                          <Col>
                            <Button
                              className="btn btn-success align-right mt-3 "
                              onClick={() => {
                                goHandeller();
                              }}
                            >
                              Go{" "}
                            </Button>
                          </Col>
                        </Row>

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
                            <PaginationListStandalone
                              {...paginationProps}
                            />
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>

                  </Container>
                </React.Fragment>
              )}
            </ToolkitProvider>
          )}
        </PaginationProvider>


      </div >

      <Modal
        isOpen={modal_center}
        toggle={() => { tog_center() }}
        size="xl"
        scrollable='off'
      >
        <OrderPage state={editOrderData.Data} />
      </Modal>

    </React.Fragment >
  );
};


export default OrderList