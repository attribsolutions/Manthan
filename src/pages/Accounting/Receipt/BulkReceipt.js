import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import Flatpickr from "react-flatpickr";
import {
    BreadcrumbShowCountlabel,
    commonPageFieldSuccess,
} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    initialFiledFunc,
} from "../../../components/Common/validationFunction";

import {
    SaveButton,
} from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    currentDate,
    groupBy,
} from "../../../components/Common/CommonFunction";

import * as mode from "../../../routes/PageMode";
import * as pageId from "../../../routes/allPageID";
import * as url from "../../../routes/route_url";
import { CustomAlert } from "../../../CustomAlert/ConfirmDialog";
import "./bulk.scss";
import demoData from "./bulkRecipt";
import CustomTable2 from "../../../CustomTable2/Table";
import { bulkSearch } from "../../Sale/Invoice/invoiceCaculations";

const BulkRecipt = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const subPageMode = history.location.pathname;

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

    useEffect(() => {
        totalAmtCalculateFunc(demoData)
    }, [demoData])

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
                                    <Label className="text-primary">{index1.PartyName}</Label>
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
                    <Input defaultValue={row.Calculate} onChange={(e) => { calculateOnChange(e, row, data) }}></Input>
                </>
            }
        }


    ];

    function calculateOnChange(e, row, data = []) {

        row.Calculate = e.target.value
        const grouped = groupBy(data, p => p.Party)
        const collection = grouped.get(row.Party)
        let addition = 0
        collection.forEach(index1 => {
            addition = addition + Number(index1.Calculate)
        })
        totalAmtCalculateFunc(data, addition, row)

    }
    function totalAmtCalculateFunc(data = [], addition = 0, row = '') {
        let totalAmt = 0
        data.forEach(index1 => {
            if (!(index1.header === true)) {
                totalAmt = Number(index1.Calculate) + totalAmt
            }
            if (row.Party === index1.Party && index1.header === true) {
                index1.AmountPaid = addition.toFixed(3)
                document.getElementById(`paidAmt-${index1.id}-${index1.Party}`).innerText = index1.AmountPaid
            }
        })
        dispatch(BreadcrumbShowCountlabel(`ToTal Amount :${totalAmt}`))
    }
    function SaveHandler() {

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
                            customSearch={bulkSearch}
                            classes={" table table-responsive  table-bordered table-hover"}
                            noDataIndication={
                                <div className="text-danger text-center ">
                                    Items Not available
                                </div>
                            }
                        >
                        </CustomTable2>


                        {demoData.length > 0 && (
                            <div className={"invoice-savebtn"}>
                                <div className="div-1">
                                    <SaveButton
                                        pageMode={pageMode}
                                        onClick={SaveHandler}
                                        id={saveBtnid}
                                        userAcc={userPageAccessState}
                                        module={userAccess.PageHeading}
                                    />
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </React.Fragment>
        );
    } else {
        return <React.Fragment></React.Fragment>;
    }
}
export default BulkRecipt


