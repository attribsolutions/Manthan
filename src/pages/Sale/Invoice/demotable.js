import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import {
  BreadcrumbShowCountlabel,
  commonPageFieldSuccess,
} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../store/actions";
import { Link, useHistory } from "react-router-dom";
import {
  comAddPageFieldFunc,
  initialFiledFunc,
  onChangeDate,
} from "../../../components/Common/validationFunction";
import Select from "react-select";
import {
  Change_Button,
  Go_Button,
  SaveButton,
} from "../../../components/Common/CommonButton";
import { updateBOMListSuccess } from "../../../store/Production/BOMRedux/action";
import {
  breadcrumbReturnFunc,
  date_dmy_func,
  loginUserID,
  currentDate_ymd,
  loginPartyID,
  btnIsDissablefunc,
} from "../../../components/Common/CommonFunction";
import * as mode from "../../../routes/PageMode";
import * as pageId from "../../../routes/allPageID";
import * as url from "../../../routes/route_url";
import {
  editInvoiceListSuccess,
  GoButtonForinvoiceAdd,
  GoButtonForinvoiceAddSuccess,
  invoiceSaveAction,
  invoiceSaveActionSuccess,
  makeIB_InvoiceActionSuccess,
} from "../../../store/Sales/Invoice/action";
import { GetVenderSupplierCustomer } from "../../../store/CommonAPI/SupplierRedux/actions";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { bulkSearch, discountCalculate } from "./invoiceCaculations";
import "./invoice.scss";
import demoData from "./demo1.json";
import { numberWithCommas } from "../../../Reports/Report_common_function";
import CustomTable2 from "../../../CustomTable2/Table";
import { C_DatePicker } from "../../../CustomValidateForm";


const Invoice = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const subPageMode = history.location.pathname;

  const goBtnId = `ADDGoBtn${subPageMode}`;
  const saveBtnid = `saveBtn${subPageMode}`;

  const fileds = {
    // id: "",
    InvoiceDate: currentDate_ymd,
    Customer: "",
  };

  const [state, setState] = useState(() => initialFiledFunc(fileds));

  const [modalCss, setModalCss] = useState(false);
  const [pageMode, setPageMode] = useState(mode.defaultsave);
  const [userPageAccessState, setUserAccState] = useState("");
  const [showAllStockState, setShowAllStockState] = useState(true);

  //Access redux store Data /  'save_ModuleSuccess' action data
  const {
    postMsg,
    updateMsg,
    pageField,
    userAccess,
    GoButton = "",
    vendorSupplierCustomer,
    makeIBInvoice,
  } = useSelector((state) => ({
    postMsg: state.InvoiceReducer.postMsg,
    updateMsg: state.BOMReducer.updateMsg,
    userAccess: state.Login.RoleAccessUpdateData,
    pageField: state.CommonPageFieldReducer.pageField,
    customer: state.CommonAPI_Reducer.customer,
    GoButton: state.InvoiceReducer.gobutton_Add,
    vendorSupplierCustomer: state.CommonAPI_Reducer.vendorSupplierCustomer,
    makeIBInvoice: state.InvoiceReducer.makeIBInvoice,
  }));

  const { OrderItemDetails = [], OrderIDs = [] } = GoButton;

  const location = { ...history.location };
  const hasShowloction = location.hasOwnProperty("editValue");
  const hasShowModal = props.hasOwnProperty("editValue");

  const values = { ...state.values };
  const { isError } = state;
  const { fieldLabel } = state;

  useEffect(() => {
    dispatch(GetVenderSupplierCustomer(subPageMode));
    dispatch(commonPageFieldSuccess(null));
    dispatch(commonPageField(pageId.INVOICE_1));
    dispatch(GoButtonForinvoiceAddSuccess([]));
  }, []);

  // userAccess useEffect
  useEffect(() => {
    let userAcc = null;
    let locationPath = location.pathname;

    if (hasShowModal) {
      locationPath = props.masterPath;
    }
    userAcc = userAccess.find((inx) => {
      return `/${inx.ActualPagePath}` === locationPath;
    });

    if (userAcc) {
      setUserAccState(userAcc);
      breadcrumbReturnFunc({ dispatch, userAcc });
    }
  }, [userAccess]);

  // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
  useEffect(() => {
    if (hasShowloction || hasShowModal) {
      let hasEditVal = null;
      if (hasShowloction) {
        setPageMode(location.pageMode);
        hasEditVal = location.editValue;
      } else if (hasShowModal) {
        hasEditVal = props.editValue;
        setPageMode(props.pageMode);
        setModalCss(true);
      }

      if (hasEditVal) {
        const { Customer, CustomerName } = hasEditVal;
        const { values, hasValid } = { ...state };
        hasValid.Customer.valid = true;

        values.Customer = { label: CustomerName, value: Customer };

        //++++++++++++++++++++++++++**Dynamic go Button API Call method+++++++++++++++++
        const jsonBody = JSON.stringify({
          FromDate: hasEditVal.InvoiceDate,
          Customer: hasEditVal.Customer,
          Party: loginPartyID(),
          OrderIDs: "",
        });
        dispatch(GoButtonForinvoiceAdd({ jsonBody }));
        dispatch(editInvoiceListSuccess({ Status: false }));
      }
    }
  }, []);

  useEffect(async () => {
    if (postMsg.Status === true && postMsg.StatusCode === 200) {
      dispatch(invoiceSaveActionSuccess({ Status: false }));
      dispatch(GoButtonForinvoiceAddSuccess([]));

      if (pageMode === mode.dropdownAdd) {
        customAlert({
          Type: 1,
          Message: JSON.stringify(postMsg.Message),
        });
      } else {
        const promise = await customAlert({
          Type: 1,
          Message: JSON.stringify(postMsg.Message),
          RedirectPath: url.INVOICE_LIST_1,
        });
        if (promise) {
          if (subPageMode === url.INVOICE_1) {
            history.push({ pathname: url.INVOICE_LIST_1 });
          } else if (subPageMode === url.IB_INVOICE) {
            history.push({ pathname: url.IB_INVOICE_LIST });
          }
        }
      }
    } else if (postMsg.Status === true) {
      customAlert({
        Type: 4,
        Message: JSON.stringify(postMsg.Message),
      });
    }
  }, [postMsg]);

  useEffect(() => {
    if (
      updateMsg.Status === true &&
      updateMsg.StatusCode === 200 &&
      !modalCss
    ) {
      history.push({
        pathname: url.MATERIAL_ISSUE_LIST,
      });
    } else if (updateMsg.Status === true && !modalCss) {
      dispatch(updateBOMListSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(updateMsg.Message),
        })
      );
    }
  }, [updateMsg, modalCss]);

  useEffect(() => {
    if (pageField) {
      const fieldArr = pageField.PageFieldMaster;
      comAddPageFieldFunc({ state, setState, fieldArr });
    }
  }, [pageField]);

  useEffect(() => {
    showAllStockOnclick(showAllStockState);
  }, [showAllStockState]);

  useEffect(() => {
    if (makeIBInvoice.Status === true && makeIBInvoice.StatusCode === 200) {
      setState((i) => {
        const obj = { ...i };
        obj.values.Customer = makeIBInvoice.customer;
        obj.hasValid.Customer.valid = true;
        return obj;
      });
      goButtonHandler(makeIBInvoice);
      dispatch(makeIB_InvoiceActionSuccess({ Status: false }));
    }
  }, [makeIBInvoice]);

  const CustomerDropdown_Options = vendorSupplierCustomer.map((index) => ({
    value: index.id,
    label: index.Name,
  }));

  const pagesListColumns = [
    {
      dataField: "PartyName",
      text: "party",
      hidden: true,
    },

    {
      //***************ItemName********************************************************************* */
      text: "Item Name",
      dataField: "ItemName",
      classes: (cell, row) =>
        row.header === true ? "multiinvoice" : "invoice-item-row",
      attrs: (cell, row, rowIndex, colIndex) =>
        row.header === true ? { colSpan: "4" } : {},
      formatter: (cellContent, index1) => {
        if (index1.header) {
          return (
            <div className="_heder">
              <div className="div-1">
                <div>
                  <Label>{index1.PartyName}</Label>
                </div>
              </div>
              <div className="div-2">
                <div>
                  <Label>Invoice No</Label>
                </div>
                <div>
                  {" "}
                  <Input type="text" />
                </div>
              </div>

              <div className="div-2">
                <div>
                  <Label>Amount</Label>
                </div>
                <div>
                  <Input
                    id={`partytAmt${index1.id}-${index1.Party}`}
                    type="text"
                    placeholder="Calculate Invoice Value"
                    disabled={true}
                  />
                </div>
              </div>
            </div>
          );
        }
        return (
          <>
            <div className="invoice-item-row-div-1">
              <samp id={`ItemName${index1.id}-${index1.Party}`}>
                {index1.ItemName}
              </samp>
            </div>
            {index1.StockInValid && (
              <div>
                <samp
                  id={`StockInvalidMsg${index1.id}-${index1.Party}`}
                  style={{ color: "red" }}
                >
                  {index1.StockInvalidMsg}
                </samp>
              </div>
            )}
          </>
        );
      },
    },
    
    {
      //***************Quantity********************************************************************* */
      text: "Quantity Unit",
      dataField: "",
      classes: () => "invoice-quantity-row",
      style: (cell, row, rowIndex, colIndex) => {
        return row.header === true ? { display: "none" } : {}; //make sure other things are not displayed
      },
      formatter: (cellContent, index1) => (
        <>
          <div className="div-1">
            <label className="label">Qty</label>
            <Input
              type="text"
              disabled={pageMode === "edit" ? true : false}
              id={`OrderQty${index1.id}-${index1.Party}`}
              className="input"
              style={{ textAlign: "right" }}
              key={index1.id}
              autoComplete="off"
              defaultValue={index1.Quantity}
              onChange={(event) => orderQtyOnChange(event, index1)}
            />
          </div>
          <div className="div-1 ">
            <label className="label">Unit</label>
            <div id="select">
              <Select
                classNamePrefix="select2-selection"
                id={"ddlUnit"}
                isDisabled={pageMode === "edit" ? true : false}
                defaultValue={index1.UnitDrop}
                // className=" width-100"
                options={index1.UnitDetails.map((i) => ({
                  label: i.UnitName,
                  value: i.Unit,
                  ConversionUnit: i.ConversionUnit,
                  Unitlabel: i.Unitlabel,
                }))}
                onChange={(event) => orderQtyUnit_SelectOnchange(event, index1)}
              ></Select>
            </div>
          </div>
          <div className="bottom-div">
            <span>Order-Qty :</span>
            <samp>{index1.OrderQty}</samp>
            <samp>{index1.UnitName}</samp>
          </div>
        </>
      ),
    },

    {
      //***************StockDetails********************************************************************* */
      text: "Stock Details",
      dataField: "StockDetails",
      style: (cell, row, rowIndex, colIndex) => {
        return row.header === true ? { display: "none" } : {}; //make sure other things are not displayed
      },
       // attrs: (cell, row, rowIndex, colIndex) => (
      //     rowIndex === 0 ? { hidden: true } : {}
      // ),
      // headerFormatter: (cell, index1 = [], k) => {

      //     return (
      //         <div className="d-flex flex-content-start">
      //             {OrderItemDetails.length > 0 ? <div>
      //                 <samp id={`${allplus-circle}-${index1.Party}`}>
      //                     <i className=" mdi mdi-plus-circle-outline text-primary font-size-16 "
      //                         style={{
      //                             position: "",
      //                             display: showAllStockState ? "none" : "block"
      //                         }}
      //                         onClick={(e) => {
      //                             setShowAllStockState(!showAllStockState)
      //                             // showAllStockOnclick(true)
      //                         }}
      //                     >
      //                     </i>
      //                 </samp>
      //                 <samp id={`${allminus-circle}-${index1.Party}`}  >
      //                     <i className="mdi mdi-minus-circle-outline text-primary font-size-16"
      //                         style={{
      //                             position: "",
      //                             // display: "none"
      //                             display: showAllStockState ? "block" : "none"
      //                         }}
      //                         onClick={(e) => {
      //                             setShowAllStockState(!showAllStockState)
      //                             // showAllStockOnclick(false)
      //                         }}
      //                     ></i>
      //                 </samp>
      //             </div>
      //                 : null
      //             }

      //             <div style={{ paddingLeft: "1px", paddingTop: "1px" }}>
      //                 <samp > Stock Details</samp>
      //             </div>

      //         </div>
      //     )
      // },

      formatter: (cellContent, index1) => (
        <div>
          <div key={`plus-circle-icon${index1.id}-${index1.Party}`}>
            {index1.StockTotal > 0 ? (
              <>
                <samp
                  key={`plus-circle${index1.id}-${index1.Party}`}
                  id={`plus-circle${index1.id}-${index1.Party}`}
                  style={{
                    display: showAllStockState ? "none" : "block",
                  }}
                >
                  <i
                    className=" mdi mdi-plus-circle-outline text-primary font-size-16"
                    style={{ position: "absolute" }}
                    onClick={(e) => {
                      showStockOnclick(index1, true);
                    }}
                  ></i>
                  <samp
                    style={{
                      fontWeight: "bold",
                      textShadow: 1,
                      marginLeft: "20px",
                    }}
                  >
                    {`Total Stock:${index1.StockTotal}`}
                  </samp>
                </samp>
              </>
            ) : (
              <samp style={{ fontWeight: "bold", textShadow: 1 }}>
                {"Total Stock:0"}
              </samp>
            )}

            <samp
              key={`minus-circle${index1.id}-${index1.Party}`}
              id={`minus-circle${index1.id}-${index1.Party}`}
              style={{ display: showAllStockState ? "block" : "none" }}
            >
              <i
                className="mdi mdi-minus-circle-outline text-primary font-size-16"
                style={{ position: "absolute" }}
                onClick={(e) => {
                  showStockOnclick(index1, false);
                }}
              ></i>
            </samp>
          </div>

          <div
            id={`view${index1.id}-${index1.Party}`}
            style={{
              backgroundColor: "#b9be511a",
              display: showAllStockState ? "bolck" : "none",
            }}
          >
            <table className="table table-bordered table-responsive mb-1">
              <thead>
                <tr style={{ zIndex: -3 }}>
                  <th>Batch Code </th>
                  <th>Supplier BatchCode</th>
                  <th>Batch Date</th>
                  <th>
                    <div>
                      <samp>Stock Quantity</samp>
                    </div>
                    <samp>{`(${index1.StockTotal} ${index1.StockUnit})`} </samp>
                  </th>
                  <th className="">
                    <div>
                      <samp>Quantity</samp>
                    </div>
                    <samp id={`stocktotal${index1.id}-${index1.Party}`}>
                      {`Total:${index1.InpStockQtyTotal} ${index1.StockUnit}`}{" "}
                    </samp>
                  </th>
                  <th>Rate</th>
                  <th>MRP</th>
                </tr>
              </thead>
              <tbody>
                {cellContent.map((index2) => {
                  return (
                    <tr key={`${index1.id}-${index1.Party}`}>
                      <td>
                        <div style={{ width: "120px" }}>
                          {index2.SystemBatchCode}
                        </div>
                      </td>
                      <td>
                        <div style={{ width: "120px" }}>{index2.BatchCode}</div>
                      </td>
                      <td>
                        <div style={{ width: "90px" }}>
                          {date_dmy_func(index2.BatchDate)}
                        </div>
                      </td>
                      <td>
                        <div style={{ width: "120px", textAlign: "right" }}>
                          {`${index2.BaseUnitQuantity} ${index1.StockUnit}`}
                        </div>
                      </td>
                      <td>
                        <div style={{ width: "150px" }}>
                          <Input
                            type="text"
                            disabled={pageMode === "edit" ? true : false}
                            style={{ textAlign: "right" }}
                            key={`batchQty${index1.id}-${index2.id}-${index1.Party}`}
                            id={`batchQty${index1.id}-${index2.id}-${index1.Party}`}
                            defaultValue={index2.Qty}
                            onChange={(event) =>
                              StockQtyOnChange(event, index1, index2)
                            }
                          ></Input>
                        </div>
                      </td>
                      <td>
                        <div style={{ width: "50px" }}>{index1.Rate}</div>
                      </td>
                      <td>
                        <div style={{ width: "50px" }}>{index1.MRPValue}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      //***************Discount********************************************************************* */
      text: "Discount",
      dataField: "",
      classes: () => "invoice-discount-row",
      style: (cell, row, rowIndex, colIndex) => {
        return row.header === true ? { display: "none" } : {}; //make sure other things are not displayed
      },
      formatter: (cell, row) => {
        if (!row.DiscountType) row.DiscountType = 2;
        if (!row.Discount) row.Discount = 0;
        return (
          <>
            <div className="div-1">
              <label className="label">Type</label>
              <div id="select">
                <Select
                  className="react-dropdown "
                  defaultValue={{ value: 2, label: " % " }}
                  options={[
                    { value: 1, label: "Rs" },
                    { value: 2, label: "%" },
                  ]}
                  onChange={(e) => {
                    row.DiscountType = e.value;
                    discountOnchange(row);
                  }}
                />
              </div>
            </div>
            <div className="div-1">
              <label className="label">Value</label>
              <Input
                className="input"
                style={{ textAlign: "right" }}
                type="text"
                defaultValue={row.Discount}
                onChange={(e) => {
                  row.Discount = e.target.value;
                  discountOnchange(row);
                }}
              />
            </div>
            <div className="bottom-div">
              <span>Amount:</span>
              <samp id={`tAmount${row.id}-${row.Party}`}>{row.OrderQty}</samp>
            </div>
          </>
        );
      },
    },
  ];

  function discountOnchange(row) {
    TotalAmtCalcFunc(row);
  }

  function showAllStockOnclick(isplus = false) {
    try {
      if (isplus) {
        document.getElementById("allplus-circle").style.display = "none";
        document.getElementById("allminus-circle").style.display = "block";
      } else {
        document.getElementById("allplus-circle").style.display = "block";
        document.getElementById("allminus-circle").style.display = "none";
      }
    } catch (w) { }

    OrderItemDetails.forEach((index1) => {
      if (!index1.StockTotal > 0) {
        return;
      }
      try {
        if (isplus) {
          document.getElementById(`view${index1.id}`).style.display = "block";
          document.getElementById(`plus-circle${index1.id}`).style.display =
            "none";
          document.getElementById(`minus-circle${index1.id}`).style.display =
            "block";
        } else {
          document.getElementById(`view${index1.id}`).style.display = "none";
          document.getElementById(`plus-circle${index1.id}`).style.display =
            "block";
          document.getElementById(`minus-circle${index1.id}`).style.display =
            "none";
        }
      } catch (w) { }
    });
  }

  function showStockOnclick(index1, isplus = false) {
    try {
      if (isplus) {
        document.getElementById(
          `view${index1.id}-${index1.Party}`
        ).style.display = "block";
        document.getElementById(
          `plus-circle${index1.id}-${index1.Party}`
        ).style.display = "none";
        document.getElementById(
          `minus-circle${index1.id}-${index1.Party}`
        ).style.display = "block";
      } else {
        document.getElementById(
          `view${index1.id}-${index1.Party}`
        ).style.display = "none";
        document.getElementById(
          `plus-circle${index1.id}-${index1.Party}`
        ).style.display = "block";
        document.getElementById(
          `minus-circle${index1.id}-${index1.Party}`
        ).style.display = "none";
      }
    } catch (w) { }
  }

  function InvoiceDateOnchange(y, v, e) {
    dispatch(GoButtonForinvoiceAddSuccess([]));
    onChangeDate({ e, v, state, setState });
  }

  function CustomerOnchange(hasSelect, evn) {
    setState((i) => {
      const v1 = { ...i };
      v1.values.Customer = hasSelect;
      v1.hasValid.Customer.valid = true;
      return v1;
    });
    // dispatch(GoButtonForinvoiceAddSuccess([]))
  }

  const StockQtyOnChange = (event, index1, index2) => {
    let input = event.target.value;
    let result = /^\d*(\.\d{0,3})?$/.test(input);
    let val1 = 0;
    let v3 = index2.Qty;
    if (result) {
      let v1 = Number(index2.BaseUnitQuantity);
      let v2 = Number(input);
      if (v1 >= v2) {
        val1 = input;
      } else {
        val1 = v1;
      }
    } else if (v3 >= 0 && !(input === "")) {
      val1 = v3;
    } else {
      val1 = 0;
    }

    event.target.value = val1;
    index2.Qty = val1;

    let t1 = 0; //L1 Current StockDetails QTY Sum="t1"
    let t2 = index1.StockUnit; //L2 Current StockDetails QTY Unit="t2"

    //C1 start* for loop for Stock Sum
    index1.StockDetails.forEach((i2) => {
      t1 = Number(t1) + Number(i2.Qty);
    });
    //C1 end*

    index1.Quantity = (t1 / index1.ConversionUnit).toFixed(3);
    try {
      // C2 start ** Total stock Qty label
      document.getElementById(
        `stocktotal${index1.id}`
      ).innerText = `Total:${t1} ${t2}`;
      document.getElementById(`OrderQty${index1.id}`).value = index1.Quantity;
      // C2 end
    } catch (e) { }
    TotalAmtCalcFunc(index1);
  };

  function TotalAmtCalcFunc(index1) {
    let tAmount = 0;
    index1.StockDetails.map((i2) => {
      if (i2.Qty > 0) {
        const calculate = discountCalculate(i2, index1);
        tAmount = tAmount + Number(calculate.tAmount);
      }
    });
    const tA4 = tAmount.toFixed(2);
    index1.tAmount = tA4;
    try {
      document.getElementById(`tAmount${index1.id}-${index1.Party}`).innerText =
        tA4;
    } catch (e) { }
  }

  function stockDistributeFunc(index) {
    const v1 = index.Quantity;
    let orderqty = Number(v1) * Number(index.ConversionUnit);

    index.StockDetails = index.StockDetails.map((i2) => {
      let stockqty = Number(i2.BaseUnitQuantity);

      if (orderqty > stockqty && !(orderqty === 0)) {
        orderqty = orderqty - stockqty;
        i2.Qty = stockqty.toFixed(3);
      } else if (orderqty <= stockqty && orderqty > 0) {
        i2.Qty = orderqty.toFixed(3);
        orderqty = 0;
      } else {
        i2.Qty = 0;
      }
      try {
        document.getElementById(
          `batchQty${index.id}-${i2.id}-${index.Party}`
        ).value = i2.Qty;
      } catch (e) { }

      return i2;
    });

    const t1 = v1 * index.ConversionUnit;
    const t2 = index.StockUnit;
    const t3 = index.StockTotal;

    if (t1 > t3) {
      try {
        document.getElementById(`OrderQty${index.id}-${index.Party}`).value =
          t3.toFixed(3);
      } catch (e) { }
    }
    try {
      index.StockInValid = false;
      index.StockInvalidMsg = null;
      document.getElementById(
        `StockInvalidMsg${index.id}-${index.Party}`
      ).style.display = "none";
    } catch (e) { }
    try {
      document.getElementById(
        `stocktotal${index.id}-${index.Party}`
      ).innerText = `Total:${t1} ${t2}`;
    } catch (e) { }
  }

  function orderQtyOnChange(event, index) {
    let input = event.target.value;
    let result = /^\d*(\.\d{0,3})?$/.test(input);
    let val1 = 0;
    if (result) {
      let v1 = Number(index.StockTotal);
      let v2 = Number(input) * Number(index.ConversionUnit);
      if (v1 >= v2) {
        val1 = input;
      } else {
        val1 = v1 / Number(index.ConversionUnit);
      }
    } else if (index.Quantity >= 0 && !(input === "")) {
      val1 = index.Quantity;
    } else {
      val1 = 0;
    }

    event.target.value = val1;
    index.Quantity = val1;

    stockDistributeFunc(index);
    TotalAmtCalcFunc(index);
  }

  function orderQtyUnit_SelectOnchange(event, index) {
    index.UnitDrop = event;
    index.ConversionUnit = event.ConversionUnit;
    stockDistributeFunc(index);
  }

  function goButtonHandler(makeIBInvoice) {
    const btnId = goBtnId;
    btnIsDissablefunc({ btnId, state: true });

    try {
      const jsonBody = JSON.stringify({
        FromDate: values.InvoiceDate,
        // Customer: 1,
        Customer: makeIBInvoice
          ? makeIBInvoice.customer.value
          : values.Customer.value,
        Party: loginPartyID(),
        OrderIDs: "",
      });
      dispatch(GoButtonForinvoiceAdd({ subPageMode, jsonBody, btnId }));
    } catch (e) {
      btnIsDissablefunc({ btnId, state: false });
    }
  }

  const calculationFunc = () => {
    let all_tAmt = 0;

    // demoData.forEach((index1, key1) => {
    let invoiceAmt = 0;
    OrderItemDetails.forEach((index2, key2) => {
      TotalAmtCalcFunc(index2);
      invoiceAmt = invoiceAmt + Number(index2.tAmount);
    });

    all_tAmt = all_tAmt + Number(invoiceAmt);
    OrderItemDetails.invoiceAmt = invoiceAmt.toFixed(2);
    const tA4 = numberWithCommas(OrderItemDetails.invoiceAmt);
    try {
      document.getElementById(
        `partytAmt${OrderItemDetails.id}-${OrderItemDetails.Party}`
      ).value = tA4;
    } catch (e) { }
    // })
    const tIn = numberWithCommas(all_tAmt.toFixed(2));
    dispatch(BreadcrumbShowCountlabel(`${"Invoice Total"}:₹ ${tIn}`));
  };

  const SaveHandler = async (event) => {
    event.preventDefault();

    const btnId = event.target.id;
    btnIsDissablefunc({ btnId, state: true });

    function returnFunc() {
      btnIsDissablefunc({ btnId, state: false });
    }
    try {
      const validMsg = [];
      const invoiceItems = [];
      let grand_total = 0;

      OrderItemDetails.forEach((index) => {
        if (index.StockInValid) {
          validMsg.push(`${index.ItemName}:${index.StockInvalidMsg}`);
          return returnFunc();
        }

        index.StockDetails.forEach((ele) => {
          if (ele.Qty > 0) {
            const calculate = discountCalculate(ele, index);
            grand_total = grand_total + Number(calculate.tAmount);

            invoiceItems.push({
              Item: index.Item,
              Unit: index.UnitDrop.value,
              BatchCode: ele.BatchCode,
              Quantity: ele.Qty,
              BatchDate: ele.BatchDate,
              BatchID: ele.id,
              BaseUnitQuantity: ele.BaseUnitQuantity,
              LiveBatch: ele.LiveBatche,
              MRP: ele.LiveBatcheMRPID,
              Rate: ele.Rate,
              BasicAmount: calculate.discountBaseAmt,
              GSTAmount: calculate.gstAmt,
              GST: ele.LiveBatcheGSTID,
              CGST: calculate.CGST,
              SGST: calculate.SGST,
              IGST: 0,
              GSTPercentage: ele.GST,
              CGSTPercentage: ele.GST / 2,
              SGSTPercentage: ele.GST / 2,
              IGSTPercentage: 0,
              Amount: calculate.tAmount,
              TaxType: "GST",
              DiscountType: index.DiscountType,
              Discount: index.Discount,
              DiscountAmount: calculate.disCountAmt,
            });
          }
        });
      });

      if (validMsg.length > 0) {
        dispatch(
          AlertState({
            Type: 4,
            Status: true,
            Message: JSON.stringify(validMsg),
            RedirectPath: false,
            AfterResponseAction: false,
          })
        );
        return returnFunc();
      }
      const forInvoice_1_json = () => ({
        // Json Body Generate For Invoice_1  Start+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        InvoiceDate: values.InvoiceDate,
        InvoiceItems: invoiceItems,
        InvoicesReferences: OrderIDs.map((i) => ({ Order: i })),
      });

      const forIB_Invoice_json = async () => ({
        //   Json Body Generate For IB_Invoice  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        IBChallanDate: values.InvoiceDate,
        IBChallanItems: invoiceItems,
        IBChallansReferences: await OrderIDs.map((i) => ({ Demand: i })),
      });

      const for_common_json = () => ({
        //   Json Body Generate Common for Both +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        CustomerGSTTin: "41",
        GrandTotal: Math.round(grand_total),
        RoundOffAmount: (grand_total - Math.trunc(grand_total)).toFixed(2),
        Customer: values.Customer.value,
        Party: loginPartyID(),
        CreatedBy: loginUserID(),
        UpdatedBy: loginUserID(),
      });

      let jsonBody; //json body decleration
      if (subPageMode === url.INVOICE_1) {
        jsonBody = JSON.stringify({
          ...for_common_json(),
          ...forInvoice_1_json(),
        });
      } else if (subPageMode === url.IB_INVOICE) {
        jsonBody = JSON.stringify({
          ...for_common_json(),
          ...forIB_Invoice_json(),
        });
      }
      // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      if (pageMode === mode.edit) {
        returnFunc();
      } else {
        dispatch(invoiceSaveAction({ subPageMode, jsonBody, btnId }));
      }
    } catch (e) {
      returnFunc();
    }
  };

  if (!(userPageAccessState === "")) {
    return (
      <React.Fragment>
        <MetaTags>
          <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title>
        </MetaTags>

        <div className="page-content">
          <form noValidate>
            <Col className="px-2 mb-1 c_card_filter header text-black" sm={12}>
              <Row>
                <Col className=" mt-1 row  " sm={11}>
                  <Col sm="6">
                    <FormGroup className="row mt-2 mb-3  ">
                      <Label className="mt-1" style={{ width: "150px" }}>
                        {fieldLabel.InvoiceDate}{" "}
                      </Label>
                      <Col sm="7">
                        <C_DatePicker
                          name="InvoiceDate"
                          value={values.InvoiceDate}
                          id="myInput11"
                          disabled={
                            OrderItemDetails.length > 0 || pageMode === "edit"
                              ? true
                              : false
                          }
                          onChange={InvoiceDateOnchange}
                        />
                        {isError.InvoiceDate.length > 0 && (
                          <span className="invalid-feedback">
                            {isError.InvoiceDate}
                          </span>
                        )}
                      </Col>
                    </FormGroup>
                  </Col>

                  <Col sm="6">
                    <FormGroup className="row mt-2 mb-3 ">
                      <Label className="mt-2" style={{ width: "100px" }}>
                        {" "}
                        {fieldLabel.Customer}{" "}
                      </Label>
                      <Col sm={7}>
                        <Select
                          name="Customer"
                          value={values.Customer}
                          isSearchable={true}
                          isDisabled={
                            OrderItemDetails.length > 0 ? true : false
                          }
                          id={"customerselect"}
                          className="react-dropdown"
                          classNamePrefix="dropdown"
                          options={CustomerDropdown_Options}
                          onChange={CustomerOnchange}
                        />
                        {isError.Customer.length > 0 && (
                          <span className="text-danger f-8">
                            <small>{isError.Customer}</small>
                          </span>
                        )}
                      </Col>
                    </FormGroup>
                  </Col>
                </Col>

                <Col sm={1} className="mt-3">
                  {pageMode === mode.defaultsave ? (
                    OrderItemDetails.length === 0 ? (
                      <Go_Button onClick={(e) => goButtonHandler()} />
                    ) : (
                      <Change_Button
                        onClick={(e) =>
                          dispatch(GoButtonForinvoiceAddSuccess([]))
                        }
                      />
                    )
                  ) : null}
                </Col>
                <Col></Col>
              </Row>
            </Col>
            <CustomTable2
              data={demoData}
              columns={pagesListColumns}
              customSearch={bulkSearch}
              classes={" table table-responsive  table-bordered table-hover"}
              noDataIndication={
                <div className="text-danger text-center ">
                  Invoice Not available
                </div>
              }
            >
            </CustomTable2>

            {OrderItemDetails.length > 0 && (
              <div className={"invoice-savebtn"}>
                <div className="div-1">
                  <Button
                    type="button"
                    color="warning"
                    onClick={calculationFunc}
                  >
                    calculate
                  </Button>
                </div>
                <div className="div-1">
                  <SaveButton
                    pageMode={pageMode}
                    onClick={SaveHandler}
                    id={saveBtnid}
                    userAcc={userPageAccessState}
                    module={"Material Issue"}
                  />
                </div>
              </div>
            )}
          </form>
        </div>
      </React.Fragment >
    );
  } else {
    return <React.Fragment></React.Fragment>;
  }
};

export default Invoice;



