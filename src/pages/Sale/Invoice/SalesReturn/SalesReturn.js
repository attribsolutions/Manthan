import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Label,
    Input,
    Row,
    Button
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import Flatpickr from "react-flatpickr"
import { Breadcrumb_inputName, commonPageFieldSuccess, getItemList } from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeDate,
    onChangeSelect,
    onChangeText,
    resetFunction,
} from "../../../../components/Common/validationFunction";
import Select from "react-select";
import { Go_Button, SaveButton } from "../../../../components/Common/CommonButton";
import { breadcrumbReturnFunc, loginPartyID, currentDate, btnIsDissablefunc, loginUserID, loginCompanyID } from "../../../../components/Common/CommonFunction";
import * as pageId from "../../../../routes//allPageID";
import * as url from "../../../../routes/route_url";
import * as mode from "../../../../routes/PageMode";
import { LoadingSheet_GoBtn_API, LoadingSheet_GoBtn_API_Succcess, SaveLoadingSheetMaster, SaveLoadingSheetMasterSucccess } from "../../../../store/Sales/LoadingSheetRedux/action";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../../../components/Common/SearchBox/MySearch";
import { countlabelFunc } from "../../../../components/Common/CommonPurchaseList";
import { GetCustomer } from "../../../../store/CommonAPI/SupplierRedux/actions";
import { CustomAlert } from "../../../../CustomAlert/ConfirmDialog";
import { postSelect_Field_for_dropdown } from "../../../../store/Administrator/PartyMasterBulkUpdateRedux/actions";

const SalesReturn = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');

    const fileds = {
        ReturnDate: currentDate,
        Retailer: "",
        ItemName: "",
        InvoiceNumber: "",
        ReturnReason: ""
    }

    const [state, setState] = useState(initialFiledFunc(fileds))
    const [TableArr, setTableArr] = useState([]);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        RetailerList,
        ItemList,
        ReturnReasonList,
        pageField,
        userAccess,
    } = useSelector((state) => ({
        postMsg: state.LoadingSheetReducer.postMsg,
        RetailerList: state.CommonAPI_Reducer.customer,
        ItemList: state.ItemMastersReducer.pages,
        ReturnReasonList: state.PartyMasterBulkUpdateReducer.SelectField,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
    }));

    useEffect(() => {
        dispatch(LoadingSheet_GoBtn_API_Succcess([]))
        const page_Id = pageId.SALES_RETURN
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(GetCustomer())
        dispatch(getItemList())
    }, []);

    const location = { ...history.location }
    // const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    // userAccess useEffect
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
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    // Receipt Mode dropdown Values
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
            TypeID: 8
        });
        dispatch(postSelect_Field_for_dropdown(jsonBody));
    }, []);

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(SaveLoadingSheetMasterSucccess({ Status: false }))
            setState(() => resetFunction(fileds, state))// Clear form values  
            dispatch(Breadcrumb_inputName(''))

            if (pageMode === mode.dropdownAdd) {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                    RedirectPath: url.LOADING_SHEET_LIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(SaveLoadingSheetMasterSucccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMessage.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    function ReturnDate_Onchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ReturnDate = date;
            a.hasValid.ReturnDate.valid = true
            return a
        })
    }

    const customerOptions = RetailerList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const ItemOptions = ItemList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const ReturnReasonOptions = ReturnReasonList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const pagesListColumns = [
        {
            text: "ReturnDate",
            dataField: "ReturnDate",
        },
        {
            text: "Retailer",
            dataField: "Retailer",
        },
        {
            text: "InvoiceNumber",
            dataField: "InvoiceNumber",
        },
        {
            text: "ItemName",
            dataField: "ItemName",
        },
        {
            text: "ReturnReason",
            dataField: "ReturnReason",

        },
    ];

    const pageOptions = {
        sizePerPage: 10,
        totalSize: TableArr.length,
        custom: true,
    };

    function AddPartyHandler(e, a, k) {

        debugger
        // if (values.ItemName === '') {
        //     CustomAlert({
        //         Type: 3,
        //         Message: "Select Item",
        //     })
        // }

        setTableArr([...TableArr, {
            id: TableArr.length + 1,
            ReturnDate: values.ReturnDate,
            Retailer: values.Retailer.label,
            InvoiceNumber: values.InvoiceNumber,
            ItemName: values.ItemName.label,
            ReturnReason: values.ReturnReason.label
        }]);

    }




    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

                <div className="page-content" style={{ marginBottom: "5cm" }}>

                    <form noValidate>
                        <div className="px-2 c_card_filter header text-black mb-2" >

                            <Row>
                                <Col sm="6">
                                    <FormGroup className="row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ReturnDate}  </Label>
                                        <Col sm="7">
                                            <Flatpickr
                                                name='ReturnDate'
                                                value={values.ReturnDate}
                                                className="form-control d-block p-2 bg-white text-dark"
                                                placeholder="Select..."
                                                options={{
                                                    altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                }}
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
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Retailer} </Label>
                                        <Col sm="7">
                                            <Select
                                                id="Retailer "
                                                name="Retailer"
                                                value={values.Retailer}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={customerOptions}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                }}
                                            />
                                            {isError.Retailer.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Retailer}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ReturnReason} </Label>
                                        <Col sm="7">
                                            <Select
                                                id="ReturnReason "
                                                name="ReturnReason"
                                                value={values.ReturnReason}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={ReturnReasonOptions}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                }}
                                            />
                                            {isError.ReturnReason.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ReturnReason}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >

                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ItemName} </Label>
                                        <Col sm="7">
                                            <Select
                                                id="ItemName "
                                                name="ItemName"
                                                value={values.ItemName}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={ItemOptions}
                                                onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                            />
                                            {isError.ItemName.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ItemName}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.InvoiceNumber}</Label>
                                        <Col sm="7">
                                            <Select
                                                id="InvoiceNumber "
                                                name="InvoiceNumber"
                                                value={values.InvoiceNumber}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={ItemOptions}
                                                onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                            />
                                            {isError.InvoiceNumber.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.InvoiceNumber}</small></span>
                                            )}
                                        </Col>
                                        <Col sm="1" className="mx-4 mt-1 ">{/*Go_Button  */}

                                            <Button type="button" color="btn btn-outline-primary border-1 font-size-11 text-center"
                                                onClick={(e,) => AddPartyHandler(e, "1")}
                                            >        <i > </i>Add</Button>

                                        </Col>
                                    </FormGroup>
                                </Col >

                            </Row>
                        </div>

                        <PaginationProvider
                            pagination={paginationFactory(pageOptions)}
                        >
                            {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider

                                    keyField="id"
                                    data={[...TableArr]}
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
                                                    {...paginationTableProps}
                                                />
                                                {countlabelFunc(toolkitProps, paginationProps, dispatch, "MRP")}
                                                {mySearchProps(toolkitProps.searchProps)}
                                            </div>

                                            <Row className="align-items-md-center mt-30">
                                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                    <PaginationListStandalone
                                                        {...paginationProps}
                                                    />
                                                </Col>
                                            </Row>
                                        </React.Fragment>
                                    )
                                    }
                                </ToolkitProvider>
                            )
                            }

                        </PaginationProvider>

                        {/* {
                            Data.length > 0 ?
                                <FormGroup>
                                    <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                        <SaveButton pageMode={pageMode}
                                            onClick={saveHandeller}
                                            userAcc={userPageAccessState}
                                            editCreatedBy={editCreatedBy}
                                            module={"LoadingSheet"}
                                        />

                                    </Col>
                                </FormGroup >
                                : null
                        } */}

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

export default SalesReturn
