import React, { useEffect, useLayoutEffect, useState } from "react";
import {
    Button,
    Card,
    CardBody,
    Col,
    FormGroup,
    Input,
    Label,
    Row,
    Table,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import Flatpickr from "react-flatpickr";
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
    convertDatefunc,
    loginUserID,
    currentDate,
    loginPartyID,
    btnIsDissablefunc,
} from "../../../components/Common/CommonFunction";
import paginationFactory, {
    PaginationListStandalone,
    PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

import BootstrapTable from "react-bootstrap-table-next";
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

import { CustomAlert } from "../../../CustomAlert/ConfirmDialog";
import "./bulk.scss";
import demoData from "./bulkRecipt";
import { numberWithCommas } from "../../../Reports/Report_common_function";
import CustomTable, { groupBy } from "../../../components/Common/CustomTable";
import CustomTable2 from "../../../CustomTable2/Table";

const BulkRecipt = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const subPageMode = history.location.pathname;

    const goBtnId = `ADDGoBtn${subPageMode}`;
    const saveBtnid = `saveBtn${subPageMode}`;

    const location = { ...history.location };
    const hasShowloction = location.hasOwnProperty("editValue");
    const hasShowModal = props.hasOwnProperty("editValue");

    const fileds = {
        // id: "",
        InvoiceDate: currentDate,
        Customer: "",
    };

    const [state, setState] = useState(() => initialFiledFunc(fileds));

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState("");

    const {
        pageField,
        userAccess,
    } = useSelector((state) => ({
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
    }));
    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.BULK_RECIPT));
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
    const pagesListColumns = [
        {
            dataField: "PartyName",
            text: "party",
            hidden: true,
        },

        {
            //***************ItemName********************************************************************* */
            text: "Receipt Date",
            dataField: "ReceiptDate",
            classes: (cell, row) =>
                row.header === true ? "multiinvoice" : "invoice-item-row",
            attrs: (cell, row, rowIndex, colIndex) =>
                row.header === true ? { colSpan: "6" } : {},
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
                                    <Label>Amount Paid :</Label>
                                </div>
                                <div>
                                    <Label id={`paidAmt-${index1.id}-${index1.Party}`}>{index1.AmountPaid}</Label>
                                </div>
                            </div>

                            <div className="div-2">
                                <div>
                                    <Label>Opening Balance :</Label>
                                </div>
                                <div>
                                    <Label>{index1.OpBalance}</Label>
                                </div>
                            </div>
                        </div>
                    );
                }
                return (
                    <>
                        <samp id={`ItemName${index1.id}-${index1.ReceiptDate}`}>
                            {index1.ReceiptDate}
                        </samp>
                    </>
                );
            },
        },

        {
            //***************BillNo********************************************************************* */
            text: "Bill No",
            dataField: "BillNo",
            style: (cell, row, rowIndex, colIndex) => {
                return row.header === true ? { display: "none" } : {}; //make sure other things are not displayed
            },

        },
        {
            //***************Bill Amount********************************************************************* */
            text: "Bill Amount",
            dataField: "BillAmount",
            style: (cell, row, rowIndex, colIndex) => {
                return row.header === true ? { display: "none" } : {}; //make sure other things are not displayed
            },

        },
        {
            //***************Bill Amount********************************************************************* */
            text: "Paid",
            dataField: "Paid",
            style: (cell, row, rowIndex, colIndex) => {
                return row.header === true ? { display: "none" } : {}; //make sure other things are not displayed
            },
        },
        {
            //***************Bill Amount********************************************************************* */
            text: "Bal Amt",
            dataField: "BalAmt",
            style: (cell, row, rowIndex, colIndex) => {
                return row.header === true ? { display: "none" } : {}; //make sure other things are not displayed
            },
            formatter: (cellContent, index1) => {
                return <>
                    <Input value={cellContent} disabled={true}></Input></>
            }
        },
        {
            //***************Bill Amount********************************************************************* */
            text: "Calculate",
            dataField: "Calculate",
            style: (cell, row, rowIndex, colIndex) => {
                return row.header === true ? { display: "none" } : {}; //make sure other things are not displayed
            },
            formatter: (cell, row, r, c, data = []) => {
                return <>
                    <Input onChange={(e) => { calculateOnChange(e, row, data) }}></Input>
                </>
            }
        }


    ];
    function calculateOnChange(e, row, data = []) {
        row.Calculate = e.target.value
        data.forEach(index1 => {
            if (row.Party === index1.Party && index1.header === true) {
                index1.AmountPaid = row.Calculate
                document.getElementById(`paidAmt-${index1.id}-${index1.Party}`).innerText = row.Calculate
            }
        })
        debugger

    }


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
                                    <Col sm="3">
                                        <FormGroup className="row mt-2 mb-3  ">
                                            <Label className="mt-1" style={{ width: "100px" }}>
                                                {"Date"}
                                            </Label>
                                            <Col sm="7">
                                                <Flatpickr
                                                    name="InvoiceDate"
                                                    // value={values.InvoiceDate}
                                                    className="form-control d-block bg-white text-dark"
                                                    id="myInput11"
                                                    // disabled={
                                                    //     OrderItemDetails.length > 0 || pageMode === "edit"
                                                    //         ? true
                                                    //         : false
                                                    // }
                                                    options={{
                                                        dateFormat: "Y-m-d",
                                                    }}
                                                // onChange={InvoiceDateOnchange}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col sm="6">
                                        {/* <FormGroup className="row mt-2 mb-3 ">
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
                                        </FormGroup> */}
                                    </Col>
                                </Col>

                                {/* <Col sm={1} className="mt-3">
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
                    </Col> */}
                                <Col></Col>
                            </Row>
                        </Col>
                        <CustomTable2
                            data={demoData}
                            columns={pagesListColumns}
                            customSearch={customSearch}>

                        </CustomTable2>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        {/* <CustomTable
                            keyField={"id"}
                            responsive
                            bordered={false}
                            striped={false}
                            classes={"table  table-bordered"}
                            noDataIndication={
                                <div className="text-danger text-center ">
                                    Items Not available
                                </div>
                            }
                            data={demoData}
                            columns={pagesListColumns}
                        /> */}

                        {/* {OrderItemDetails.length > 0 && (
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
                )} */}
                    </form>
                </div>
            </React.Fragment>
        );
    } else {
        return <React.Fragment></React.Fragment>;
    }
}
export default BulkRecipt


function customSearch(text,data,columns) {
    debugger
    let search = text.toLowerCase()

    const filter = data.filter((item) => {
        let found = false

        if (item.header) { return true }

        for (let i = 0; i < columns.length; i++) {

            let isCell = item[columns[i].dataField]
            if (!(isCell === null)
                && !(isCell === undefined)
                && typeof isCell !== 'object'
                && !Array.isArray(isCell)
            ) {
                if (!found) {
                    isCell = JSON.stringify(isCell)
                    isCell = isCell.toLowerCase(isCell)
                    found = isCell.includes(search)
                }
            }
        }
        return found

    })
    let hasHedRow1 = []
    const grouped = groupBy(filter, pet => pet.Party);
    grouped.forEach(i => {
        if (i.length > 1) {
            i.forEach(k => {
                hasHedRow1.push(k)
            })
        }
    })
    return hasHedRow1
}