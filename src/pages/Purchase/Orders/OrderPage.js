import React, { useEffect, useState } from "react";
import { Button, FormGroup, Input, Label } from "reactstrap";
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
import { submitOrder_fromOrderPage, getOrderItems_ForOrderPage, submitOrder_fromOrderPage_Success, updateOrderID_From_OrderPage } from "../../../store/Purchase/OrderPageRedux/actions";
import { useSelector, useDispatch } from "react-redux";
import '../../Purchase/Orders/div.css'

import Breadcrumbs3 from "../../../components/Common/Breadcrumb3"
import generate from "../../../Reports/InvioceReport/Page";
import { InvoiceFakeData } from "./InvioceFakedata";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import { topFunction } from "./OrderList";
import { MetaTags } from "react-meta-tags";
import Select from "react-select";
import "@vtaits/react-color-picker/dist/index.css"
import "react-datepicker/dist/react-datepicker.css"
//Import Flatepicker
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr"
import ReactSelect from "react-select";
import { getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";

const OrderPage = (props) => {

  // For table items  for-loop constatnt  
  let itemgroups = "";

  //*** "isEditdata get all data from ModuleID for Binding  Form controls
  let editDataGatingFromList = props.state;
  let CheckPageMode = props.IsComponentMode;


  const dispatch = useDispatch();
  const current = new Date();
  const month = current.getMonth() + 1;
  const currentDate = `${current.getFullYear()}-${month < 10 ? `0${month}` : `${month}`
    }-${current.getDate()}`;


  //'IsEdit'--if true then update data otherwise it will perfrom save operation
  const [IsEdit, setIsEdit] = useState(false);
  const [PageMode, setPageMode] = useState(false);

  //SetState  Edit data Geting From Modules List component
  const [EditData, setEditData] = useState({ OrderItem: [] });
  // useState({OrderItem:[]});



  const [orderDate, setOrderDate] = useState(currentDate);
  const [itemArray, setitemArray] = useState([])
  const [itemCount, setItemCount] = useState(0)
  const [customerName_dropdownSelect, setCustomerName_dropdownSelect] = useState({})
  const [totalAmountCount, setTotalAmountCount] = useState(0)


  useEffect(() => {
    // document.getElementById("txtName").focus();
    dispatch(getOrderItems_ForOrderPage());
    dispatch(getPartyListAPI())
  }, [dispatch])


  useEffect(() => {

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


  const { OrderItems, APIResponse, CustomSearchInput, customerNameList } = useSelector((state) => ({
    OrderItems: state.OrderPageReducer.OrderItems,
    APIResponse: state.OrderPageReducer.submitOrderSuccess,
    CustomSearchInput: state.CustomSearchReducer.CustomSearchInput,
    // **customerNameList ==> this is  party list data geting from party list API
    customerNameList: state.PartyMasterReducer.pages
  }));

  useEffect(() => {
    CustomSearchHandller()
  }, [CustomSearchInput])


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
          Message: APIResponse.Message,
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

    const disc = document.getElementById("inp-description").value
    const selectedItemArray = [];

    // for (var i = 0; i < OrderItems.length - 1; i++) {

    //   let qty = document.getElementById("inp-txtqty" + i).value;

    //   if (qty > 0) {

    //     var itemID = document.getElementById("lblItemID" + i).value;
    //     var itemMRP = document.getElementById("lblItemMRP" + i).value;
    //     var itemGST = document.getElementById("lblItemGST" + i).value;
    //     var UnitID = document.getElementById("ddlUnit" + i).value;
    //     var rate = document.getElementById("rate" + i).value;
    //     var comments = document.getElementById("inp-comment" + i).value;

    //     let arrayElement = {
    //       OrderId: 0,
    //       ItemID: itemID,
    //       Quantity: qty,
    //       UnitID: UnitID,
    //       MRP: itemMRP,
    //       BaseUnitQuantity: "1.00",
    //       Comments: comments,
    //       GST: itemGST,
    //       Rate: rate
    //     };
    //     selectedItemArray.push(arrayElement);
    //   }
    // }

    const requestOptions = {
      body: JSON.stringify({
        CustomerID: 2,
        PartyID: 2,
        OrderAmount: totalAmountCount,
        Descreption: disc,
        CreatedBy: 11,
        OrderDate: orderDate,
        CompanyID: 1,
        DivisionID: 3,
        ExpectedDeliveryDate: orderDate,
        CreatedOn: currentDate,
        UpdatedBy: 1,
        UpdatedOn: currentDate,
        OrderItem: itemArray,// selectedItemArray,
      }),
    };
    debugger
    if (IsEdit && itemArray.length > 0) {
      dispatch(updateOrderID_From_OrderPage(requestOptions.body, EditData.id));
    }
    else if (itemArray.length > 0) {
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

  function InputHandelar(e, i) {

    const quantity = parseFloat(e.target.value)
    const rate = parseFloat(i.Rate)
    const Gst = parseFloat(i.GSTPercentage)
    const basicAmount = rate * quantity;
    const GstAmount = basicAmount * (Gst / 100)
    const totalAmount = GstAmount + basicAmount


    let test = []
    let TotalAmountCount_initial = 0
    let ItemCount_initial = 0

    const find = itemArray.find((element) => {
      return element.ItemID === i.ID
    });


    var dataa = {
      ItemID: i.ID,
      Quantity: quantity,
      MRP: i.MRP,
      Rate: rate,
      UnitID: 1,
      BaseUnitQuantity: 1,
      GST: parseInt(Gst.toFixed(2)),
      BasicAmount: basicAmount,
      GSTAmount: parseInt(GstAmount.toFixed(2)),
      CGST: 1,
      SGST: 1,
      IGST: 1,
      CGSTPercentage: 1,
      SGSTPercentage: 1,
      IGSTPercentage: 1,
      Amount: parseInt(totalAmount.toFixed(2))
    }

    if (quantity > 0) {
      // if (itemArray.length <= 0) {
      //   setitemArray([...itemArray, dataa])
      //   test=[...itemArray, dataa]
      // } else 
      if (find === undefined) {
        setitemArray([...itemArray, dataa])
        test = [...itemArray, dataa]
      } else {

        test = itemArray.filter((ele) => !(ele.ItemID === i.ID))
        test.push(dataa);
        // const isLargeNumber = (element) => element.ItemID === i.ID;
        // const a = itemArray.findIndex(isLargeNumber);
        setitemArray(test)
      }

    }
    else {
      test = itemArray.filter((ele) => !(ele.ItemID === i.ID))
      setitemArray(test)

    }

    test.map((count) => {
      TotalAmountCount_initial = TotalAmountCount_initial + count.Amount
      ItemCount_initial = ItemCount_initial + 1
    })
    if ((test.length > 0)) {
      setTotalAmountCount(TotalAmountCount_initial)
      setItemCount(ItemCount_initial)
    }
    else {
      setTotalAmountCount(0)
      setItemCount(0)
    }
  }

  //  select customer  options ==> gating data  from party master 
  const CustomerDropdownOptions = customerNameList.map((index) => ({
    value: index.ID,
    label: index.Name
  }));

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Order | FoodERP-React FrontEnd</title>
        </MetaTags>
        <Breadcrumbs3
          title={"Count :"}
          breadcrumbItem={"Order"}
          IsSearch={true}
          breadcrumbCount={OrderItems.length}
        />
        <Container fluid>
          <Row className="mb-1 border border-black ">

            <Col md="2" className="">
              <FormGroup className="mb-3 row mt-3 " >
                <Label className="col-sm-4 mt-2 text-end">Order Date :</Label>
                <Col className="md-8">
                  <Flatpickr
                    className="form-control d-block"
                    value={orderDate}
                    placeholder="dd Mm,yyyy"
                    options={{
                      altInput: true,
                      altFormat: "F j, Y",
                      dateFormat: "Y-m-d"
                    }}
                    onChange={(y,e) => {
                      setOrderDate(e);
                    }}
                  />
                </Col>
              </FormGroup>
            </Col>




            <Col className={'md-2'}>
              <FormGroup className="mb-3 row mt-3 " >
                <Label className="col-sm-5 mt-2 text-end">Customer Name :</Label>
                <Col className="md-auto ">
                  <ReactSelect
                    Value={customerName_dropdownSelect}
                    classNamePrefix="select2-Customer"
                    id={"inp-customerName"}
                    options={CustomerDropdownOptions}
                    onchange={(e) => { setCustomerName_dropdownSelect(e) }}
                  />
                </Col>
              </FormGroup>
            </Col >

            <Col md="3">

              <FormGroup className="mb-3 row mt-3 " >
                <Label className="col-sm-3  md-6 mt-2 text-end">Descreption :</Label>
                <Col className="md-6 ">
                  <Input
                    placeholder="Enter Description"
                    id='inp-description'
                  />
                </Col>
              </FormGroup>
            </Col >



            <Col className={'justify-content-md-auto'}></Col>

            <Col className={'justify-content-md-auto'}>
              <Label htmlFor="validationCustom01"> </Label>
              <div className="bg-soft-primary text-center text-primary  external-event  col-ls-6 col-form-label rounded-2 align-right">
                Order Amount : &nbsp;&nbsp; {totalAmountCount.toFixed(2)}&nbsp;
              </div>
              {/* <h5 className=" text-left text-danger  align-left">
                Order Amount:&nbsp; {totalAmountCount.toFixed(2)}
              </h5> */}
            </Col>

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
                      <Th data-priority="15" className="col-sm-5 text-center">
                        <Row className="justify-content-md-center">
                          <Col md={3} className={'align-right'}>Item Name&nbsp;&nbsp;&nbsp;</Col>
                          {/* <Col md={3}></Col> */}
                          <Col md={3} className="bg-soft-warning text-center text-secondary external-event rounded-2 align-left}  ">
                            Count : &nbsp;(&nbsp; {itemCount}&nbsp;)
                          </Col>
                          {/* <Col md={3}></Col> */}
                        </Row>
                      </Th>
                      <Th data-priority="1" className="text-center">MRP</Th>
                      <Th data-priority="1" className="text-center">Rate</Th>
                      <Th data-priority="1" className="text-center" >GST %</Th>
                      <Th data-priority="1" className="col-sm-1 text-center">Quantity
                      </Th>
                      <Th data-priority="1" className="col-sm-2 text-center" >UOM</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {OrderItems.map((item, key) => {
                      var com = "";
                      var qat = '';
                      EditData.OrderItem.map((i, k) => {
                        if (item.ID === i.ItemID) { com = i.Comment; qat = i.Quantity }
                        return ''
                      })
                      return (
                        <Tr>
                          <Td>
                            {item.ItemGroupName === itemgroups ? (
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
                              <React.Fragment>
                                <label className="btn btn-secondary btn-sm waves-effect waves-light">
                                  {/* {item.ItemGroupName} */}
                                  {(itemgroups = item.ItemGroupName)}
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
                                />
                              </React.Fragment>
                            )}
                          </Td>

                          <Td className="align-bottom text-end">
                            <input
                              type="hidden"
                              id={"lblItemMRP" + key}
                              name={"lblItemMRP" + key}
                              value={item.MRP}
                            />
                            <label style={{ a: "end" }}> {item.MRP} </label>

                          </Td>
                          <Td className="align-bottom text-end">
                            <label > {item.Rate} </label>
                            <input
                              type="hidden"
                              value={item.Rate}
                              id={"rate" + key}
                              className="form-control form-control-sm"
                              autoComplete="false"
                            />
                          </Td>
                          <Td className="align-bottom text-end">
                            <label > {item.GSTPercentage} % </label>
                            <input
                              type="hidden"
                              value={item.GSTPercentage}
                              id={"rate" + key}
                              className="form-control form-control-sm"
                              autoComplete="false"
                            />
                          </Td>
                          <Td className="align-bottom text-end">
                            <Row style={{ marginTop: "5px", }}>

                              <input
                                type="text"
                                id={"inp-txtqty" + key}
                                placeholder={"0.0"}
                                className="form-control float-end text-end"
                                key={item.ID}
                                disabled={item.Rate > 0 ? false : true}
                                defaultValue={qat}
                                onKeyDown={(e) => {
                                  handleKeyDown(e);
                                }}
                                onChange={(e) => {
                                  InputHandelar(e, item)
                                }}
                                // className="form-control form-control-sm"
                                autoComplete="off"
                                ng-required="true"
                              />

                            </Row>
                          </Td>
                          <Td className="align-bottom">
                            <ReactSelect
                              classNamePrefix="select2-selection"
                              id={"ddlUnit" + key}
                              options={[{ value: 1, label: "NO", }, { value: 2, label: "Box", }]}
                            >
                            </ReactSelect>
                          </Td>
                          {/* <Td>
                            {" "}
                            <input
                              type="text"
                              defaultValue={com}
                              id={"inp-comment" + key}
                              class="form-control form-control-sm"
                              autoComplete="off"
                            />
                          </Td> */}
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
                {/* <div class="row table1" style={{ paddingBottom: 'center' }}>
                  <button type="button" className="btn btn-success text-center"
                    data-mdb-toggle="tooltip" data-mdb-placement="top" title="Create New"
                    onClick={() => {
                      saveHandeller();
                    }}
                  >
                    Save
                  </button> :
                </div> */}

                {
                  IsEdit ?
                    (
                      <div className="row update1" style={{ paddingBottom: 'center' }}>
                        <button
                          type="submit"
                          data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Order"
                          className="btn btn-success w-md"
                          onClick={() => {
                            saveHandeller();
                          }}
                        >
                          <i className="fas fa-edit me-2"></i>Update
                        </button>
                      </div>
                    )
                    :
                    (
                      <div className="row save1" style={{ paddingBottom: 'center' }}>
                        <button
                          type="submit"
                          data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Order"
                          className="btn btn-success w-md"
                          onClick={() => {
                            saveHandeller();
                          }}
                        > <i className="fas fa-save me-2"></i> Save
                        </button>
                      </div>
                    )
                }

              </div>
            </div>

          </Row>
        </Container>

      </div>
    </React.Fragment>
  );
};

export default OrderPage;
