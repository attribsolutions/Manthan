import React, { useEffect, useState, } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SaveButton } from "../../../components/Common/CommonButton";
import * as _cfunc from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { globalTableSearchProps } from "../../../components/Common/SearchBox/MySearch";
import { ReceiptGoButtonMaster_Success, saveReceiptMaster, saveReceiptMaster_Success } from "../../../store/Accounting/Receipt/action";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { C_DatePicker } from "../../../CustomValidateForm";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";

const BulkRecipt = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const [pageMode] = useState(mode.defaultsave)
    const [userPageAccessState, setUserAccState] = useState(123);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        ReceiptGoButton,
        saveBtnloading,
        userAccess,
        commonPartyDropSelect } = useSelector((state) => ({
            postMsg: state.ReceiptReducer.postMsg,
            saveBtnloading: state.ReceiptReducer.saveBtnloading,
            ReceiptGoButton: state.ReceiptReducer.ReceiptGoButton,
            userAccess: state.Login.RoleAccessUpdateData,
            commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
        }));

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const { Data = [] } = ReceiptGoButton

    useEffect(() => {
        const page_Id = pageId.BULK_RECIPT
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
    }, []);

    useEffect(() => {
        // dispatch(BreadcrumbShowCountlabel(`BulkReceipt Count :${Data.length}`))
    }, [ReceiptGoButton]);


    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveReceiptMaster_Success({ Status: false }))
            dispatch(ReceiptGoButtonMaster_Success([]))

            if (pageMode === mode.dropdownAdd) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                history.push({ pathname: url.RECEIPTS_LIST })
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveReceiptMaster_Success({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;

        if (hasShowModal) {
            locationPath = props.masterPath;
        };

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (userAcc) {
            setUserAccState(userAcc)
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    function CalculateOnchange(e, row, key) {

        let Calculate = e.target.value
        if (Calculate <= 0) {
            row.Calculate = row.BalanceAmount

        } else {
            row.Calculate = Calculate
        }
    }

    const pagesListColumns = [
        {
            text: "Party",
            dataField: "CustomerName",
        },
        {
            text: "Invoice Date",
            dataField: "InvoiceDate",
        },
        {
            text: "Bill No",
            dataField: "FullInvoiceNumber",
        },
        {
            text: "Bill Amount",
            dataField: "GrandTotal",
            align: () => ("right")
        },
        {
            text: "Paid",
            dataField: "PaidAmount",
            align: () => ("right")
        },
        {
            text: "Bal Amt",
            dataField: "BalanceAmount",
            align: () => ("right")
        },
        {
            text: "Calculate",
            dataField: "",

            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center' }}>
                    <Input
                        id=""
                        key={row.Invoice}
                        defaultValue={row.BalanceAmount}
                        disabled={true}
                        className="text-end"
                        onChange={e => { CalculateOnchange(e, row, key) }}
                    />
                </span>)
            },
            headerStyle: () => {
                return { width: '180px', textAlign: 'center' };
            }
        }

    ];

    const SaveHandler = (event) => {

        event.preventDefault();
        const btnId = event.target.id
        const arr1 = []
        try {
            _cfunc.btnIsDissablefunc({ btnId, state: true })

            Data.forEach(i => {
                const arr =
                {
                    ReceiptDate: _cfunc.currentDate_ymd,
                    Description: "",
                    AmountPaid: i.GrandTotal,
                    BalanceAmount: i.BalanceAmount,
                    OpeningBalanceAdjusted: "",
                    DocumentNo: "",
                    AdvancedAmountAjusted: "",
                    Customer: i.Customer,
                    ChequeDate: "",
                    Party: commonPartyDropSelect.value,
                    ReceiptMode: 31,
                    ReceiptType: 29,
                    CreatedBy: _cfunc.loginUserID(),
                    UpdatedBy: _cfunc.loginUserID(),
                    Bank: "",
                    DepositorBank: "",
                    ReceiptInvoices: [
                        {
                            Invoice: i.Invoice,
                            GrandTotal: i.GrandTotal,
                            PaidAmount: i.Calculate <= 0 ? i.GrandTotal : i.Calculate.toFixed(2),
                        }],
                    PaymentReceipt: []
                }
                arr1.push(arr)
            })

            const jsonBody = JSON.stringify({
                BulkData: arr1
            })
            dispatch(saveReceiptMaster({ jsonBody, btnId }));

        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    };


    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content" style={{ marginBottom: "5cm" }}>

                    <form noValidate>
                        <div className="px-2 c_card_filter header text-black mb-1" >
                            <div className=" row ">
                                <Col sm="6">
                                    <FormGroup className=" row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>Receipt Date</Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='Date'
                                                value={_cfunc.currentDate_ymd}
                                            // disabled={true}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >
                                <Col sm="3" className="">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "120px" }}>Recepiet Mode :</Label>
                                        <Col sm="3">
                                            <Label className=" mt-2">Cash</Label>
                                        </Col>
                                    </FormGroup>
                                </Col>
                            </div>
                        </div>


                        <ToolkitProvider

                            keyField="id"
                            data={Data}
                            columns={pagesListColumns}

                            search
                        >
                            {toolkitProps => (
                                <React.Fragment>
                                    <div className="table">
                                        <BootstrapTable
                                            keyField={"id"}
                                            bordered={true}
                                            striped={false}
                                            noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                                            classes={"table align-middle table-nowrap table-hover"}
                                            headerWrapperClasses={"thead-light"}

                                            {...toolkitProps.baseProps}

                                        />

                                        {globalTableSearchProps(toolkitProps.searchProps)}
                                    </div>

                                </React.Fragment>
                            )
                            }
                        </ToolkitProvider>

                        {Data.length > 0 &&
                            <SaveButtonDraggable>
                                <SaveButton pageMode={pageMode}
                                    onClick={SaveHandler}
                                    loading={saveBtnloading}
                                    userAcc={userPageAccessState}
                                />

                            </SaveButtonDraggable>
                        }

                    </form >
                </div >
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default BulkRecipt

