import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Label,
    Input,
    Row,
    Button,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, Breadcrumb_inputName, commonPageFieldSuccess, post_Send_to_superStockiest_Id_Succcess } from "../../../store/actions";
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
import { url, mode, pageId } from "../../../routes/index"
import { GetVenderSupplierCustomer, Retailer_List } from "../../../store/CommonAPI/SupplierRedux/actions";
import "../../Sale/SalesReturn/salesReturn.scss";
import { CInput, C_DatePicker, C_Select } from "../../../CustomValidateForm/index";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { SaveButton } from "../../../components/Common/CommonButton";

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
    const [TableArr, setTableArr] = useState([]);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        supplier,
        pageField,
        userAccess,
    } = useSelector((state) => ({
        supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
    }));

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.PURCHASE_RETURN_MODE_3))
        dispatch(GetVenderSupplierCustomer({ subPageMode, RouteID: "" }))
        dispatch(post_Send_to_superStockiest_Id_Succcess({ Status: false }))
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

    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
            hidden: false,
            formatter: (cell, row) => {
                return (
                    <Label style={{ minWidth: "200px" }}>{row.ItemName}</Label>
                )
            }
        },
        {
            text: "Invoice Qty",
            align: () => "right",
            formatter: (cell, row) => <Label>{row.InvoiceQuantity}</Label>,

        },
        {
            text: "Quantity",
            dataField: "",
            classes: () => "sales-discount-row",

        },

        {
            text: "MRP",
            dataField: "MRP",
            hidden: false,
            formatExtraData: { TableArr },

        },

        {
            text: "GST",
            dataField: "",
            hidden: false,
            formatExtraData: { TableArr },

        },
        {
            text: "Basic Rate",
            dataField: "",
            hidden: false,
            classes: () => "sales-rate-row",
            formatExtraData: { TableArr },

        },
        {
            text: "Batch",
            dataField: "",
            classes: () => "sales-rate-row",


        },
        {
            text: "Return Reason",
            dataField: "",
            classes: () => "sales-return-row",

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
                                                isDisabled={((TableArr.length > 0)) ? true : false}
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
                                data={TableArr}
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
                                                        id="table_Arrow"
                                                        classes={"table  table-bordered "}
                                                        noDataIndication={
                                                            <div className="text-danger text-center ">
                                                                Items Not available
                                                            </div>
                                                        }
                                                        {...toolkitProps.baseProps}
                                                        onDataSizeChange={(e) => {
                                                            _cfunc.tableInputArrowUpDounFunc("#table_Arrow")
                                                        }}
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
                    <div style={{ marginLeft: '-10px' }}>
                        <FormGroup>
                            <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"} >
                                <SaveButton
                                    pageMode={mode.edit}
                                    // forceDisabled={addBtnLoading}
                                    // loading={saveBtnloading}
                                    // onClick={SaveHandler}
                                    userAcc={userPageAccessState}
                                    module={"SalesReturn"}
                                />

                            </Col>
                        </FormGroup >
                    </div>

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





