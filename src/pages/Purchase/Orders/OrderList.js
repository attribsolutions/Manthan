import React, { useEffect, useState } from "react";
import { useDispatch, connect, useSelector } from "react-redux";
import { Button, CardSubtitle, CardTitle, Input, Label, Modal } from "reactstrap";
import Select from "react-select";
import { useHistory } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardBody,
  cardTitle,
  CardHeader,
  Container,
} from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { editOrder, getOrderList } from "../../../store/Purchase/OrderPageRedux/actions";
import { MetaTags } from "react-meta-tags";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
// import generate from "../../Reports/Page"
import './div.css'

export const topFunction = () => {
  debugger
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
const OrderList = (props) => {

  const [modal_center, setmodal_center] = useState(false);
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

  // console.log('date',fromDateIn)
  useEffect(() => {
    const orderlistInitial = {
      FromDate: fromDateIn,// !fromDate ? fromDateIn : fromDate,
      ToDate: currentDate, //!toDate ? currentDate : toDate,
      CustomerID: 0,
      DivisionID: 3,
    };
    dispatch(getOrderList(orderlistInitial));
  }, [dispatch, currentDate, fromDateIn, orderDelete]);


  const customerNameOption = props.orderList;

  const { editOrderData, TableListData } = useSelector((state) => ({
    editOrderData: state.OrderPageReducer.orderItemInfo,
    TableListData: state.OrderPageReducer.ordersList
  }));

  function goHandeller() {
    const orderlistInitial = {
      FromDate: !fromDate ? fromDateIn : fromDate,
      ToDate: !toDate ? currentDate : toDate,
      CustomerID: 0,
      DivisionID: 3,
    };
    dispatch(getOrderList(orderlistInitial));
  }
  function OnPritHandeller(id) {
    dispatch(editOrder(id));
    if (!(editOrderData.length === 0)) {
      console.log("datataat", editOrderData)
      // generate(editOrderData)
    }
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
      dataField: "customerName",
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
      formatter: (cellContent, module) => (

        <div class="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >
          <buton
            type="button"
            onClick={() => {
              //  EditPageHandler(module.ID);
            }}
            className="badge badge-soft-primary font-size-12"
          >
            <i class="mdi mdi-pencil font-size-18" id="edittooltip"></i>
          </buton>

          <buton
            className="badge badge-soft-danger font-size-12"
            onClick={() => {
              //  deleteHandeler(module.ID, module.Name);
            }}
          >
            <i class="mdi mdi-delete font-size-18" ></i>
          </buton>

          <buton
            className="badge badge-soft-info font-size-12"
            onClick={() => {
              //  deleteHandeler(module.ID, module.Name);
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
                    breadcrumbItem={"Orders List"}
                    IsButtonVissible={true}
                    SearchProps={toolkitProps.searchProps}
                    breadcrumbCount={TableListData.length}
                    RedirctPath={"/order"}
                  />
                  <Row>
                    <Col>
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
                    <Col>
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
                    <Col >
                      <Select options={customerNameOption} />
                    </Col>
                    <Col>
                      <Button
                        className="btn btn-success "
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
      >
        {/* <CompanyModule state={editData.Data} /> */}
      </Modal>
    </React.Fragment >
  );
};


export default OrderList