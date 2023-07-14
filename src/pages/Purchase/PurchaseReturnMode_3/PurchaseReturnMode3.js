import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Label,
    Input,
    Row,

} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { commonPageFieldSuccess, post_Send_to_superStockiest_Id_Succcess, saveSalesReturnMaster, saveSalesReturnMaster_Success } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
    onChangeSelect,
    onChangeText,
    resetFunction,

} from "../../../components/Common/validationFunction";
import { mode, pageId, url } from "../../../routes/index"
import { GetVenderSupplierCustomer, } from "../../../store/CommonAPI/SupplierRedux/actions";
import "../../Sale/SalesReturn/salesReturn.scss";
import { CInput, C_DatePicker, C_Select, decimalRegx } from "../../../CustomValidateForm/index";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { SaveButton } from "../../../components/Common/CommonButton";
import { return_discountCalculate_Func } from "../../Sale/SalesReturn/SalesCalculation";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";

const PurchaseReturnMode3 = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [pageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');

    const fileds = {
        ReturnDate: currentDate_ymd,
        Customer: "",
        Comment: ""
    }

    const [state, setState] = useState(initialFiledFunc(fileds))
    const [subPageMode] = useState(history.location.pathname)

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        sendToSSbtnTableData,
        saveBtnloading,
        postMsg,
        supplier,
        pageField,
        userAccess,
    } = useSelector((state) => ({
        saveBtnloading: state.SalesReturnReducer.saveBtnloading,
        sendToSSbtnTableData: state.SalesReturnReducer.sendToSSbtnTableData,
        supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
        postMsg: state.SalesReturnReducer.postMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
    }));

    const { Data = [] } = sendToSSbtnTableData

    const tableData = Data.map((item, index) => {
        return { ...item, id: index + 1 };
    })

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.PURCHASE_RETURN_MODE_3))
        dispatch(GetVenderSupplierCustomer({ subPageMode, RouteID: "" }))
    }, []);

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    useEffect(() => {// userAccess useEffect
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

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveSalesReturnMaster_Success({ Status: false }))
            dispatch(post_Send_to_superStockiest_Id_Succcess({ Status: false }))
            setState(() => resetFunction(fileds, state))// Clear form values  
            await customAlert({
                Type: 1,
                Message: postMsg.Message,
            })
            history.push({ pathname: url.PURCHASE_RETURN_LIST })
        }
        else if (postMsg.Status === true) {
            dispatch(saveSalesReturnMaster_Success({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
        },

        {
            text: "Quantity",
            dataField: "Quantity",
            formatter: (value, row, k) => {

                return (
                    <span >
                        <CInput type="text"
                            id={`Quantity${k}`}
                            key={`Quantity${row.id}`}
                            disabled={true}
                            cpattern={decimalRegx}
                            className="text-end"
                            defaultValue={row.Quantity}
                            autoComplete="off"
                            onChange={(e) => { row.Quantity = e.target.value }}
                        />
                    </span>
                )
            },
            headerStyle: () => {
                return { width: '140px', textAlign: 'center' };
            }
        },

        {
            text: "UnitName",
            dataField: "UnitName",
        },

        {
            text: "MRP",
            dataField: "MRPValue",
            formatter: (value, row, k) => {
                return (
                    <span >
                        <Input type="text"
                            id={`MRPValue${k}`}
                            key={`MRPValue${row.id}`}
                            disabled={true}
                            className="text-end"
                            defaultValue={row.MRPValue}
                            autoComplete="off"
                            onChange={(e) => { row["MRPValue"] = e.target.value }}
                        />
                    </span>
                )
            },

            headerStyle: () => {
                return { width: '140px', textAlign: 'center' };
            }
        },

        {
            text: "Basic Rate",
            dataField: "Rate",
            formatter: (value, row, k) => {

                return (
                    <span >
                        <CInput type="text"
                            id={`Rate${k}`}
                            className="text-end"
                            key={`Rate${row.id}`}
                            cpattern={decimalRegx}
                            disabled={true}
                            defaultValue={row.Rate}
                            autoComplete="off"
                            onChange={(e) => { row.Rate = e.target.value }}
                        />
                    </span>
                )
            },

            headerStyle: () => {
                return { width: '140px', textAlign: 'center' };
            }
        },

        {
            text: "BatchDate",
            dataField: "BatchDate",
        },
        {
            text: "BatchCode",
            dataField: "BatchCode",
        },

        {
            text: "Reason",
            dataField: "ItemReasonName",
        },

        {
            text: "Comment",
            dataField: "ItemComment",
        },
    ];

    const ReturnDate_Onchange = (e, date) => {
        setState((i) => {
            const a = { ...i }
            a.values.ReturnDate = date;
            a.hasValid.ReturnDate.valid = true
            return a
        })
    }

    const SaveHandler = async (event) => {

        event.preventDefault();
        const btnId = event.target.id;
        let grand_total = 0;

        if (values.Customer === "") {
            customAlert({
                Type: 4,
                Message: "Please Select Supplier",
            });
            return;
        }

        const ReturnItems = tableData.map((i) => {
            
            const calculate = return_discountCalculate_Func(i);
            grand_total += Number(calculate.roundedTotalAmount);

            return {
                "Item": i.Item,
                "Quantity": i.Quantity,
                "Unit": i.Unit,
                "BaseUnitQuantity": i.BaseUnitQuantity,
                "BatchCode": i.BatchCode,
                "BatchDate": i.BatchDate,
                "MRP": i.MRP,
                "MRPValue": i.MRPValue,
                "Rate": i.Rate,
                "GST": i.GST,
                "ItemReason": i.ItemReason,
                "Comment": i.ItemComment,
                "CGST": i.CGST,
                "SGST": i.SGST,
                "IGST": i.IGST,
                "GSTPercentage": i.GSTPercentage,
                "CGSTPercentage": i.CGSTPercentage,
                "SGSTPercentage": i.SGSTPercentage,
                "IGSTPercentage": i.IGSTPercentage,
                "BasicAmount": i.BasicAmount,
                "GSTAmount": i.GSTAmount,
                "Amount": i.Amount,
                "TaxType": 'GST',
                "DiscountType": calculate.discountType,
                "Discount": calculate.discount,
                "DiscountAmount": Number(calculate.disCountAmt).toFixed(2),
                "ReturnItemImages": [],
            };
        });

        try {
            const jsonBody = JSON.stringify({
                ReturnDate: values.ReturnDate,
                ReturnReason: '',
                BatchCode: values.BatchCode,
                Customer: _cfunc.loginPartyID(),// Customer Swipe when Po return
                Party: values.Customer.value,// Party Swipe when Po return
                Comment: values.Comment,
                GrandTotal: grand_total.toFixed(2),
                RoundOffAmount: (grand_total - Math.trunc(grand_total)).toFixed(2),
                CreatedBy: _cfunc.loginUserID(),
                UpdatedBy: _cfunc.loginUserID(),
                Mode: 3,
                ReturnItems: ReturnItems,
            });
            dispatch(saveSalesReturnMaster({ jsonBody, btnId }));

        } catch (e) { _cfunc.CommonConsole(e) }
    };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" style={{ marginBottom: "5cm" }}>

                    <form noValidate>
                        <div className="px-2 c_card_filter header text-black mb-1" >

                            <Row>
                                <Col sm="6">
                                    <FormGroup className="row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ReturnDate}  </Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='ReturnDate'
                                                value={values.ReturnDate}
                                                onChange={ReturnDate_Onchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Customer} </Label>
                                        <Col sm="7">
                                            <C_Select
                                                id="Customer "
                                                name="Customer"
                                                value={values.Customer}
                                                isSearchable={true}
                                                options={supplierOptions}
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                }
                                                }

                                            />
                                            {isError.Customer.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Customer}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Comment} </Label>
                                        <Col sm="7">
                                            <Input
                                                name="Comment"
                                                id="Comment"
                                                value={values.Comment}
                                                type="text"
                                                className={isError.Comment.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Enter Comment"
                                                autoComplete='off'
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.Comment.length > 0 && (
                                                <span className="invalid-feedback">{isError.Comment}</span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >
                            </Row>

                        </div>

                        <div>
                            <ToolkitProvider
                                keyField={"id"}
                                data={tableData}
                                columns={pagesListColumns}
                                search
                            >
                                {(toolkitProps) => (
                                    <React.Fragment>
                                        <Row>
                                            <Col xl="12">
                                                <div className="table-responsive table" style={{ minHeight: "60vh" }}>
                                                    <BootstrapTable
                                                        keyField={"id"}
                                                        classes={"table  table-bordered "}
                                                        noDataIndication={
                                                            <div className="text-danger text-center ">
                                                                Record Not available
                                                            </div>
                                                        }
                                                        {...toolkitProps.baseProps}
                                                    />
                                                </div>
                                            </Col>
                                            {mySearchProps(toolkitProps.searchProps,)}
                                        </Row>

                                    </React.Fragment>
                                )}
                            </ToolkitProvider>
                        </div>

                    </form >

                    {
                        tableData.length > 0 ?
                            <div style={{ marginLeft: '-35px' }}>
                                <FormGroup>
                                    <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"} >
                                        <SaveButton
                                            pageMode={mode.edit}
                                            loading={saveBtnloading}
                                            onClick={SaveHandler}
                                            userAcc={userPageAccessState}
                                            module={"SalesReturn"}
                                        />

                                    </Col>
                                </FormGroup >
                            </div>
                            : null
                    }

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

export default PurchaseReturnMode3





