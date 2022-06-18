import React, { useEffect, useState } from "react";
import { Button, Input } from "reactstrap";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardSubtitle,
  CardHeader,
  Container,
} from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

// store action import
import { submitOrder_fromOrderPage, getOrderItems_ForOrderPage, submitOrder_fromOrderPage_Success } from "../../../store/Purchase/OrderPageRedux/actions";
import { useSelector, useDispatch } from "react-redux";
import '../../Purchase/Orders/div.css'

import Breadcrumbs3 from "../../../components/Common/Breadcrumb3"
import generate from "../../../Reports/InvioceReport/Page";
import { InvoiceFakeData } from "./InvioceFakedata";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";

const OrderPage = (props) => {
  let itemgroups = "";
  const Order_Id = props.location.state;

  const dispatch = useDispatch();
  const current = new Date();
  const month = current.getMonth() + 1;
  const currentDate = `${current.getFullYear()}-${month < 10 ? `0${month}` : `${month}`
    }-${current.getDate()}`;

  const [orderDate, setOrderDate] = useState("");

  //'IsEdit'--if true then update data otherwise it will perfrom save operation
  const [IsEdit, setIsEdit] = useState(false);
  const [PageMode, setPageMode] = useState(false);

  //SetState  Edit data Geting From Modules List component
  const [EditData, setEditData] = useState([]);

  //*** "isEditdata get all data from ModuleID for Binding  Form controls
  let editDataGatingFromList = props.state;
  let CheckPageMode = props.IsComponentMode;



  useEffect(() => {
    // document.getElementById("txtName").focus();

    dispatch(getOrderItems_ForOrderPage());

    if (!(editDataGatingFromList === undefined)) {
      setEditData(editDataGatingFromList[0]);
      setIsEdit(true);
      // dispatch(editModuleIDSuccess({ Status: false }))
      return
    }
    if (!(CheckPageMode === undefined)) {
      setPageMode(true)
      return
    }

  }, [editDataGatingFromList, CheckPageMode])


  const { OrderItems, APIResponse, CustomSearchInput, } = useSelector((state) => ({
    OrderItems: state.OrderPageReducer.OrderItems,
    APIResponse: state.OrderPageReducer.submitOrderSuccess,
    CustomSearchInput: state.CustomSearchReducer.CustomSearchInput,

  }));

  // This UseEffect clear Form Data and when modules Save Successfully.
  useEffect(() => {
    if ((APIResponse.Status === true) && (APIResponse.StatusCode === 200)) {
      dispatch(submitOrder_fromOrderPage_Success({ Status: false }))
      // formRef.current.reset();
      if (PageMode === true) {
        dispatch(AlertState({
          Type: 1,
          Status: true,
          Message: "Error"
          // APIResponse.Message,
        }))
      }
      else {
        dispatch(AlertState({
          Type: 1,
          Status: true,
          Message: "Error",//APIResponse.Message,
          RedirectPath: '/orderList',

        }))
      }
    } else if (APIResponse.Status === true) {
      dispatch(submitOrder_fromOrderPage_Success({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: "error Message",
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  }, [APIResponse.Status])

  const saveHandeller = () => {
    debugger
    const selectedItemArray = [];

    for (var i = 0; i < OrderItems.length - 1; i++) {

      let qty = document.getElementById("inp-txtqty" + i).value;

      if (qty > 0) {

        var itemID = document.getElementById("lblItemID" + i).value;
        var itemMRP = document.getElementById("lblItemMRP" + i).value;
        var itemGST = document.getElementById("lblItemGST" + i).value;
        var UnitID = document.getElementById("ddlUnit" + i).value;
        var rate = document.getElementById("rate" + i).value;
        var comments = document.getElementById("inp-comment" + i).value;

        let arrayElement = {
          OrderId: 0,
          ItemID: itemID,
          Quantity: qty,
          UnitID: UnitID,
          MRP: itemMRP,
          BaseUnitQuantity: "1.00",
          Comments: comments,
          GST: itemGST,
          Rate: rate
        };
        selectedItemArray.push(arrayElement);
      }
    }
    const requestOptions = {
      body: JSON.stringify({
        CustomerID: 2,
        PartyID: 2,
        OrderAmount: "33.00",
        Discreption: "bb",
        "CreatedBy": 11,
        OrderDate: !orderDate ? currentDate : orderDate,
        CompanyID: 1,
        DivisionID: 3,
        ExpectedDeliveryDate: !orderDate ? currentDate : orderDate,
        CreatedOn: !orderDate ? currentDate : orderDate,
        UpdatedBy: 1,
        UpdatedOn: !orderDate ? currentDate : orderDate,
        OrderItem: selectedItemArray,
      }),
    };

    if (IsEdit && selectedItemArray.length > 0) {
      // dispatch(updateModuleID(requestOptions.body, EditData.ID));
    }
    else if (selectedItemArray.length > 0) {
      dispatch(submitOrder_fromOrderPage(requestOptions.body));
    }
    else {
      dispatch(AlertState({
        Type: 4,
        Status: true, Message: "Please Select At List one Item",
      }))
    }
    // generate(InvoiceFakeData)

  };

  function handleKeyDown(e) {
    debugger
    let inpTarget = e.target.id
    let split = inpTarget.split("y");
    let inp_ID = parseInt(split[1])
    let count = inp_ID;
    let inp_lable = split[0] + 'y';

    if (e.keyCode === 40 && (OrderItems.length - 1 > count)) {

      let next_inpDoun = document.getElementById(inp_lable + (count + 1)).disabled;
      while (next_inpDoun && (OrderItems.length - 1 > count)) {
        count = ++count;
        next_inpDoun = document.getElementById(inp_lable + (count)).disabled;
      }
      if (count === inp_ID) { count = ++count; }
      document.getElementById(inp_lable + count).focus();
      return
    }

    if (e.keyCode === 38 && count > 0) {

      let next_inp_UP = document.getElementById(inp_lable + (count - 1)).disabled;
      while (next_inp_UP && count > 0) {
        count = count - 1;
        next_inp_UP = document.getElementById(inp_lable + (count)).disabled;
      }
      if (count === inp_ID) { count = count - 1; }
      document.getElementById(inp_lable + count).focus();
    }
  }


  useEffect(() => {
    if (!(CustomSearchInput === "")) { CustomSearchHandller() }
  }, [CustomSearchInput])



  function CustomSearchHandller() {

    var input, filter, table, tr, td, i, txtValue;
    // input = document.getElementById("table_search_Input");
    filter = CustomSearchInput.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }

  }






  return (
    <React.Fragment>
      <div className="page-content">
       
        <Breadcrumbs3
          title={"Count :"}
          breadcrumbItem={"Order"}
          IsSearch={true}
          // SearchProps={toolkitProps.searchProps}
          breadcrumbCount={OrderItems.length}
        // RedirctPath={"/modulesMaster"}
        />

        <Container fluid>
          <Row className="mb-1 ">
            <div className="col-lg-2 ">
              <Input
                className="form-control"
                type="date"
                defaultValue={currentDate}
                onChange={(e) => {
                  setOrderDate(e.target.value);
                }}
                on
                id="example-date-input"
              />
            </div>

          </Row>
          <Row>
            <div className="table-rep-plugin">
              <div
                className="table-responsive mb-0 custom_scroll_div"
                data-pattern="priority-columns"
              >
                <Table
                  id="myTable"
                  className="table  table-bordered"
                >
                  <Thead>
                    <Tr>
                      <Th data-priority="1">Item Name</Th>
                      <Th data-priority="1">MRP</Th>
                      <Th data-priority="1">Rate</Th>
                      <Th data-priority="3">Quantity</Th>
                      <Th data-priority="1">UOM</Th>
                      <Th data-priority="3">Comments</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {OrderItems.map((item, key) => {
                      var com = "";
                      var qat = '';
                      EditData.map((i, k) => {
                        if (item.ItemID === i.ItemID) { com = i.Comment; qat = i.Qauntity }
                        return ''
                      })
                      return (
                        <Tr>
                          <Td>
                            {item.ItemGroup.Name === itemgroups ? (
                              <>
                                <label
                                  id={"lblItemName" + key}
                                  name={"lblItemName" + key}
                                >
                                  {item.Name}
                                </label>
                                <input
                                  type="hidden"
                                  id={"lblItemID" + key}
                                  name={"lblItemID" + key}
                                  value={item.ID}
                                />
                                <input
                                  type="hidden"
                                  id={"lblItemGST" + key}
                                  name={"lblItemGST" + key}
                                  value={item.GSTPercentage}
                                />
                              </>

                            ) : (

                              <>

                                <label className="btn btn-secondary btn-sm waves-effect waves-light">
                                  {item.ItemGroup.Name}
                                  {(itemgroups = item.ItemGroup.Name)}
                                </label>
                                <br></br>
                                <label
                                  id={"lblItemName" + key}
                                  name={"lblItemName" + key}
                                >
                                  {item.Name}
                                </label>
                                <input
                                  type="hidden"
                                  id={"lblItemID" + key}
                                  name={"lblItemID" + key}
                                  value={item.ID}
                                />
                                <input
                                  type="hidden"
                                  id={"lblItemGST" + key}
                                  name={"lblItemGST" + key}
                                  value={item.GSTPercentage}
                                /></>
                            )}
                          </Td>

                          <Td>
                            <label > {item.MRP} </label>
                            <input
                              type="hidden"
                              id={"lblItemMRP" + key}
                              name={"lblItemMRP" + key}
                              value={item.MRP}
                            />
                          </Td>
                          <Td>
                            <label > {"121.21"} </label>
                            <input
                              type="hidden"
                              defaultvalue={com}
                              id={"rate" + key}
                              className="form-control form-control-sm"
                              autoComplete="false"
                            />
                          </Td>
                          <Td>
                            <input
                              type="text"
                              id={"inp-txtqty" + key}
                              key={item.ID}
                              disabled={item.MRP > 0 ? false : true}
                              defaultvalue={qat}
                              onKeyDown={(e) => {
                                handleKeyDown(e);
                              }}
                              className="form-control form-control-sm"
                              autoComplete="off"
                              ng-required="true"
                            />
                          </Td>
                          <Td>
                            <select
                              classNamePrefix="select2-selection"
                              id={"ddlUnit" + key}
                            >
                              <option value={1}
                              >
                                {"No"}
                              </option>
                            </select>
                          </Td>
                          <Td>
                            {" "}
                            <input
                              type="text"
                              defaultvalue={com}
                              id={"inp-comment" + key}
                              class="form-control form-control-sm"
                              autoComplete="off"
                            />
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
                <div class="row table1" style={{ paddingBottom: 'center' }}>
                  <button type="button" className="btn btn-success text-center"
                    data-mdb-toggle="tooltip" data-mdb-placement="top" title="Create New"
                    onClick={() => {
                      saveHandeller();
                    }}
                  >
                    Save
                  </button> :
                </div>
              </div>
            </div>

          </Row>
        </Container>
       
      </div>
    </React.Fragment>
  );
};

export default OrderPage;
