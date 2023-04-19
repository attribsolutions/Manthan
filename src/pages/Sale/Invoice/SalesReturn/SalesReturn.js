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
import { GetCustomer } from "../../../../store/CommonAPI/SupplierRedux/actions";
import { CustomAlert } from "../../../../CustomAlert/ConfirmDialog";
import { postSelect_Field_for_dropdown } from "../../../../store/Administrator/PartyMasterBulkUpdateRedux/actions";
import { InvoiceNumber, InvoiceNumberSuccess } from "../../../../store/Sales/SalesReturnRedux/action";
import CustomTable2 from "../../../../CustomTable2/Table";
import "./salesReturn.scss";
import CInput from "../../../../CustomValidateForm/CInput";
import { floatRegx } from "../../../../CustomValidateForm/RegexPattern";

const SalesReturn = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [editCreatedBy, seteditCreatedBy] = useState("");

    const fileds = {
        ReturnDate: currentDate,
        Retailer: "",
        ItemName: "",
        InvoiceNumber: "",
        ReturnReason: "",
        Comment: ""
    }

    const [state, setState] = useState(initialFiledFunc(fileds))

    const [TableArr, setTableArr] = useState([]);

    const [returnMode, setrRturnMode] = useState(0);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        RetailerList,
        ItemList,
        ReturnReasonList,
        InvoiceNo,
        pageField,
        userAccess,
    } = useSelector((state) => ({
        postMsg: state.LoadingSheetReducer.postMsg,
        RetailerList: state.CommonAPI_Reducer.customer,
        ItemList: state.ItemMastersReducer.pages,
        ReturnReasonList: state.PartyMasterBulkUpdateReducer.SelectField,
        InvoiceNo: state.SalesReturnReducer.InvoiceNo,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
    }));

    useEffect(() => {
        dispatch(InvoiceNumberSuccess([]))
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

    // Return Reason dropdown Values
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
            TypeID: 8
        });
        dispatch(postSelect_Field_for_dropdown(jsonBody));
    }, []);

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    // useEffect(() => {
    //     if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
    //         dispatch(SaveLoadingSheetMasterSucccess({ Status: false }))
    //         setState(() => resetFunction(fileds, state))// Clear form values  
    //         dispatch(Breadcrumb_inputName(''))

    //         if (pageMode === mode.dropdownAdd) {
    //             dispatch(AlertState({
    //                 Type: 1,
    //                 Status: true,
    //                 Message: postMsg.Message,
    //             }))
    //         }
    //         else {
    //             dispatch(AlertState({
    //                 Type: 1,
    //                 Status: true,
    //                 Message: postMsg.Message,
    //                 RedirectPath: url.LOADING_SHEET_LIST,
    //             }))
    //         }
    //     }
    //     else if (postMsg.Status === true) {
    //         dispatch(SaveLoadingSheetMasterSucccess({ Status: false }))
    //         dispatch(AlertState({
    //             Type: 4,
    //             Status: true,
    //             Message: JSON.stringify(postMessage.Message),
    //             RedirectPath: false,
    //             AfterResponseAction: false
    //         }));
    //     }
    // }, [postMsg])

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

    const InvoiceNo_Options = InvoiceNo.map((index) => ({
        value: index.Invoice,
        label: index.FullInvoiceNumber,
    }));

    function deleteButtonAction(row) {
        const newArr = TableArr.filter((index) => !(index.id === row.id))
        setTableArr(newArr)
    }

    const pagesListColumns = [
        // {
        //     text: "ReturnDate",
        //     dataField: "ReturnDate",
        //     classes: () => "sales-return-row",
        // },
        // {
        //     text: "Retailer",
        //     dataField: "Retailer",
        //     classes: () => "sales-return-row",
        // },
        // {
        //     text: "InvoiceNumber",
        //     dataField: "InvoiceNumber",
        // },
        {
            text: "ItemName",
            dataField: "ItemName",
        },
        {
            text: "Quantity",
            dataField: "",
            classes: () => "sales-return-row",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <CInput
                        id={`Quantity${key}`}
                        key={`Quantity${row.id}`}
                        defaultValue={row.Quantity}
                        autoComplete="off"
                        type="text"
                        pattern={floatRegx}
                        className="col col-sm text-end"
                        onChange={(event) => {
                            const data = event.target.value
                        }}
                    />
                </span>)
            }
        },
        {
            text: "Unit",
            dataField: "",
            classes: () => "sales-return-row",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <Select
                        id={`MRP${key}`}
                        name="MRP"
                        defaultValue={row.Calculate}
                        isSearchable={true}
                        className="react-dropdown"
                        classNamePrefix="dropdown"
                        options={ItemOptions}
                        onChange={(event) => { row.MRP = event.value }}
                    />
                </span>)
            }
        },
        {
            text: "MRP",
            dataField: "",
            classes: () => "sales-return-row",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <Select
                        id={`MRP${key}`}
                        name="MRP"
                        defaultValue={row.Calculate}
                        isSearchable={true}
                        className="react-dropdown"
                        classNamePrefix="dropdown"
                        options={ItemOptions}
                        onChange={(event) => { row.MRP = event.value }}
                    />
                </span>)
            }
        },
        {
            text: "Rate",
            dataField: "",
            classes: () => "sales-return-row",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <CInput
                        id=""
                        key={row.id}
                        defaultChecked={row.BatchCode}
                        type="text"
                        pattern={/^-?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)$/}
                        className="col col-sm text-end"
                        onChange={(event) => {
                            const data = event.target.value
                        }}

                    />
                </span>)
            }
        },
        {
            text: "BatchCode",
            dataField: "",
            classes: () => "sales-return-row",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <Input
                        id=""
                        key={row.id}
                        defaultChecked={row.BatchCode}
                        type="text"
                        className="col col-sm text-center"
                    // onChange={e => { SelectAll(e.target.checked, row, key) }}
                    />
                </span>)
            }
        },
        {
            text: "BatchDate",
            dataField: "",
            classes: () => "sales-return-row",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
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
                    // onChange={ReturnDate_Onchange}
                    />
                </span>)
            }
        },
        // {
        //     text: "ReturnReason",
        //     dataField: "ReturnReason",
        // },
        {
            text: "ItemComment",
            dataField: "",
            classes: () => "sales-return-row",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
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
                    // onChange={ReturnDate_Onchange}
                    />
                </span>)
            }
        },
        {
            text: "Image",
            dataField: "",
            classes: () => "sales-return-Image-row",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <Input type="file"
                        className="form-control "
                        // value={FileName}
                        name="image"
                        id="file"
                        accept=".jpg, .jpeg, .png ,.pdf"
                    // onChange={(event) => { onchangeHandler(event) }}
                    />
                </span>)
            }
        },
        {
            text: "Action ",
            dataField: "",
            formatter: (cellContent, row, key) => (
                <>
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Button
                                    id={"deleteid"}
                                    type="button"
                                    className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
                                    data-mdb-toggle="tooltip" data-mdb-placement="top" title='Delete MRP'
                                    onClick={(e) => { deleteButtonAction(row) }}
                                >
                                    <i className="mdi mdi-delete font-size-18"></i>
                                </Button>
                            </FormGroup>
                        </Col>
                    </div>
                </>
            ),
        },
    ];

    function AddPartyHandler(e) {
        debugger
        const invalidMsg1 = []
        if ((returnMode === 0) && (values.ItemName === '') && (values.InvoiceNumber === '')) {
            invalidMsg1.push(`Select a value from both Item & Invoice No.`)
        }
        if ((returnMode === 2) && (values.ItemName === '')) {
            invalidMsg1.push(`Item is Required`)
        };
        if ((returnMode === 1) && (values.InvoiceNumber === '')) {
            invalidMsg1.push(`Invoice No. is Required`)
        };

        if (invalidMsg1.length > 0) {
            CustomAlert({
                Type: 4,
                Message: JSON.stringify(invalidMsg1)
            })
            return
        }

        setTableArr([...TableArr, {
            id: TableArr.length + 1,
            ReturnDate: values.ReturnDate,
            Retailer: values.Retailer.label,
            InvoiceNumber: values.InvoiceNumber.label,
            ItemName: values.ItemName.label,
            ReturnReason: values.ReturnReason.label
        }]);

        setState((i) => {
            let a = { ...i }
            a.values.ItemName = ""
            a.values.InvoiceNumber = ""
            a.hasValid.ItemName.valid = true;
            a.hasValid.InvoiceNumber.valid = true;
            return a
        })


    }

    function RetailerHandler(event) {

        const jsonBody = JSON.stringify({
            PartyID: loginPartyID(),
            CustomerID: event.value
        });

        dispatch(InvoiceNumber(jsonBody));
    }

    const saveHandeller = async (event) => {
        event.preventDefault();
        const btnId = event.target.id
    };

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
                                                    RetailerHandler(hasSelect)
                                                }}
                                            />
                                            {isError.Retailer.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Retailer}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >
                            </Row>

                            <Row>
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

                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Comment} </Label>
                                        <Col sm="7">
                                            <Input
                                                name="Comment"
                                                id="Comment"
                                                value={values.Comment}
                                                type="text"
                                                className={isError.Comment.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Comment"
                                                autoComplete='off'
                                                autoFocus={true}
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
                                                isDisabled={(returnMode === 1) ? true : false}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={ItemOptions}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                    setrRturnMode(2)
                                                }}
                                            />
                                            {isError.ItemName.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ItemName}</small></span>
                                            )}
                                        </Col>

                                        <Col sm="1" className="mx-4 mt-1 ">
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginLeft: "0.5cm", color: " rgb(125 74 157)" }}>
                                                OR </Label>

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
                                                isDisabled={(returnMode === 2) ? true : false}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={InvoiceNo_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                    setrRturnMode(1)
                                                }}
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

                        {/* <PaginationProvider
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

                        </PaginationProvider> */}

                        <CustomTable2
                            data={TableArr}
                            columns={pagesListColumns}
                            // customSearch={bulkSearch}
                            classes={" table table-responsive table-bordered table-hover"}
                            noDataIndication={
                                <div className="text-danger text-center ">
                                    Record Not available
                                </div>
                            }
                        >
                        </CustomTable2>

                        {
                            TableArr.length > 0 ?
                                <FormGroup>
                                    <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                        <SaveButton pageMode={pageMode}
                                            onClick={saveHandeller}
                                            userAcc={userPageAccessState}
                                            editCreatedBy={editCreatedBy}
                                            module={"SalesReturn"}
                                        />

                                    </Col>
                                </FormGroup >
                                : null
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

export default SalesReturn
