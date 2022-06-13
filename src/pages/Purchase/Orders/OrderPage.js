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

import generate from "../../../Reports/InvioceReport/Page";
import { InvoiceFakeData } from "./InvioceFakedata";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";

const OrderPage = (props) => {
  var itemgroups = "";
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


  const { OrderItems, APIResponse, } = useSelector((state) => ({
    OrderItems: state.OrderPageReducer.OrderItems,
    APIResponse: state.OrderPageReducer.submitOrderSuccess,
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
          Message: APIResponse.Message,
        }))
      }
      else {
        dispatch(AlertState({
          Type: 1,
          Status: true,
          Message: APIResponse.Message,
          RedirectPath: '/Orders',

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
    var abc = [];
    for (var i = 0; i < OrderItems.length - 1; i++) {
      let qty = document.getElementById("txtqty" + i).value;
      if (qty > 0) {
        var itemid = document.getElementById("lblItemID" + i).value;
        var UnitID = document.getElementById("ddlUnit" + i).value;
        console.log("a", UnitID)
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

    if (IsEdit) {
      // dispatch(updateModuleID(requestOptions.body, EditData.ID));
    }
    else {
      dispatch(submitOrder_fromOrderPage(requestOptions.body));
    }
    // generate(InvoiceFakeData)
    // dispatch(submitOrder_fromOrderPage(requestOptions.body));
  };

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


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row className="mb-1">
            <div class="col-lg-2">
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
                className="table-responsive mb-0"
                data-pattern="priority-columns"
              >
                <Table
                  id="tech-companies-1"
                  className="table  table-bordered"
                >
                  <Thead>
                    <Tr>
                      <Th data-priority="1">Itemgroup Name</Th>
                      <Th data-priority="1">Item Name</Th>
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
                            {item.ItemGroup === itemgroups ? (
                              ""
                            ) : (
                              <label className="btn btn-secondary btn-sm waves-effect waves-light">
                                {item.ItemGroup}
                                {(itemgroups = item.ItemGroup)}
                              </label>
                            )}
                          </Td>
                          <Td>
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
                          </Td>
                          <Td>
                            <input
                              type="text"
                              id={"txtqty" + key}
                              key={item.ID}
                              // value={QtValueHandller(item.ItemID)}
                              defaultvalue={qat}
                              onKeyDown={(e) => {
                                handleKeyDown(e);
                              }}
                              class="form-control form-control-sm"
                              autoComplete="false"
                            />
                          </Td>
                          <Td>
                            <select
                              classNamePrefix="select2-selection"
                              id={"ddlUnit" + key}
                            >
                              {/* {item.Units.map((units, key) => {
                                return (
                                  <option value={units.UnitsID}
                                  >
                                    {units.label}
                                  </option>
                                );
                              })} */}

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
                              // value={ComValueHandeller(item.ItemID)}
                              id={"comment" + key}
                              class="form-control form-control-sm"
                              autoComplete="false"
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
