import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  Input,
  Row,
  Col,
  CardBody,

} from "reactstrap";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

// store action import
import { getOrderPage, submitOrderPage, editOrder } from "../../../store/Purchase/Orders/actions";
import { useSelector, useDispatch } from "react-redux";
import { MetaTags } from "react-meta-tags";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import BootstrapTable from "react-bootstrap-table-next";

const OrderPage = (props) => {

  const [ModuldeSelect, setModuldeSelect] = useState({ value: 1, label: 'Box' });

  const dispatch = useDispatch();
  const current = new Date();
  const month = current.getMonth() + 1;
  const currentDate = `${current.getFullYear()}-${month < 10 ? `0${month}` : `${month}`
    }-${current.getDate()}`;

  const [orderDate, setOrderDate] = useState("");
  const Order_Id = props.location.state;
  useEffect(() => {
    if (Order_Id === undefined) {
    } else {
      dispatch(editOrder(Order_Id.orderId));
    }
    dispatch(getOrderPage());
  }, [dispatch, Order_Id]);
  //  var TableListData=[]
  //  var orders=[]
  const { TableListData, editOrderData1, } = useSelector((state) => ({
    TableListData: state.OrdersReducers.orders,
    editOrderData: state.OrdersReducers.editOrderData.Items,
  }));
  // console.log("ModuldeSelect", ModuldeSelect)


  const saveHandeller = () => {
    var abc = [];
    for (var i = 0; i < TableListData.length - 1; i++) {
      let qty = document.getElementById("txtqty" + i).value;
      if (qty > 0) {
        var itemid = document.getElementById("lblItemID" + i).value;
        var UnitID = document.getElementById("ddlUnit" + i).value;

        var comments = document.getElementById("comment" + i).value;
        var abc1 = {
          OrderId: 0,
          ItemID: itemid,
          Quantity: qty,
          UnitID: UnitID,
          Comments: comments,
          IsOrderItem: false,
        };
        abc.push(abc1);
      }
    }
    const requestOptions = {
      body: JSON.stringify({
        CustomerID: 13,
        OrderDate: !orderDate ? currentDate : orderDate,
        CompanyID: 1,
        DivisionID: 3,
        ExpectedDeliveryDate: !orderDate ? currentDate : orderDate,
        CreatedOn: !orderDate ? currentDate : orderDate,
        UpdatedBy: 1,
        UpdatedOn: !orderDate ? currentDate : orderDate,
        OrderitemInfo: abc,
      }),
    };
    dispatch(submitOrderPage(requestOptions.body));
  };

  function handllerModuleID(e) {
    console.log("handllerModuleID", e)
    setModuldeSelect(e)
  }
  function handleKeyDown(e) {
    var cont = e.target.id;

    var abc = cont.split("y");
    cont = abc[1];
    if (e.keyCode === 40) {
      cont = ++cont;
      document.getElementById("txtqty" + cont).focus();
    }
    if (e.keyCode === 38 && cont > 0) {
      cont = cont - 1;
      document.getElementById("txtqty" + cont).focus();
    }
  }

  const pageOptions = {
    sizePerPage: 15,
    totalSize: TableListData.length, // replace later with size(users),
    custom: true,
  };
  const defaultSorted = [
    {
      dataField: "Name", // if dataField is not match to any column you defined, it will be ignored.
      order: "asc", // desc or asc
    },
  ];

  const TableListColumns = [
    {
      text: "Item Group Name",
      dataField: "ItemGroupName",
      sort: true,
    },
    {
      text: "Item Name",
      dataField: "ItemName",
      sort: true,
    },
    {
      text: "Quantity",
      dataField: "Quantity",
      sort: true,
      formatter: (cellContent, module) => (
        <div class="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >
          < Input>
          </Input>
        </div>
      ),
    },
    {
      text: "UOM",
      dataField: "UOM",
      sort: true,
      formatter: (cellContent, orderElementData, key) =>
      (

        <select
          classNamePrefix="select2-selection"
          id={"ddlUnit" + key}
          onClick={(e) => {
            // console.log(e);
            var UnitIDq = document.getElementById("ddlUnit" + 1);
            console.log("var UnitID ", UnitIDq)
              ;
            // setModuldeSelect({ value: e.target.value, label: e.target.label })
          }}
        >
          {orderElementData.Units.map((units, key) => {
            console.log("orderElementData", units.UnitsID)
            return (
              <option value={units.UnitsID}
                label={units.label}
              >
                {units.label}
              </option>
            );
          })}
        </select>
        // <Select
        //   value={ModuldeSelect}
        //   options={orderElementData.Units.map((Data) =>
        //   ({
        //     value: Data.UnitsID,
        //     label: Data.label,
        //   }))}
        //   onChange={(e) => { handllerModuleID(e) }}
        //   autocomplete="off" >
        // </Select>

      ),
    },
    {
      text: "Comments",
      dataField: "Comments",
      sort: true,
      formatter: (cellContent, module) => (

        <div class="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >
          <Input></Input>
        </div>
      ),
    },
  ];


  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Order List| FoodERP-React FrontEnd</title>
        </MetaTags>

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
                    RedirctPath={"/company"}
                  />
                  <CardBody>
                  </CardBody>
                  <Row>
                    <Col xl="12">
                      <div className="table-responsive">
                        <BootstrapTable
                          keyField={"id"}
                          responsive
                          data={TableListData}
                          columns={TableListColumns}
                          bordered={false}
                          striped={false}
                          noDataIndication="Table is Empty"
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

    </React.Fragment >
  );
};

export default OrderPage2;
  // changes in pagination list