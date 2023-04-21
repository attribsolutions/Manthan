import React, { useEffect, useState, } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Row
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import {
    Breadcrumb_inputName,
    commonPageField,
    commonPageFieldSuccess,
} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    onChangeText,
    resetFunction
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    btnIsDissablefunc,
    loginCompanyID,
    loginPartyID,
    loginUserID
} from "../../../components/Common/CommonFunction";
import Select from "react-select";
import Flatpickr from "react-flatpickr"
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import {
    saveBankMaster,
    updateBankID,
    updateBankIDSuccess
} from "../../../store/Accounting/BankRedux/action";
import { currentDate } from "../../../components/Common/CommonFunction"
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import CInput from "../../../CustomValidateForm/CInput";
import { decimalRegx } from "../../../CustomValidateForm/RegexPattern"
import { ReceiptGoButtonMaster, ReceiptTypeAPI } from "../../../store/Accounting/Receipt/action";
import { Retailer_List } from "../../../store/CommonAPI/SupplierRedux/actions";
import { postSelect_Field_for_dropdown } from "../../../store/Administrator/PartyMasterBulkUpdateRedux/actions";



const Credit = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        CreditDate: currentDate,
        PartyName: "",
        CreditNoteReason: "",
        servicesItem: "",
        Narration: "",
        Amount: "",

    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [pageMode, setPageMode] = useState(mode.defaultsave);//changes
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState(198);
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        pageField,
        ReceiptGoButton,
        updateMsg,
        RetailerList,
        ReceiptType,
        ReceiptModeList,
        userAccess } = useSelector((state) => ({
            postMsg: state.BankReducer.postMsg,
            RetailerList: state.CommonAPI_Reducer.RetailerList,
            ReceiptType: state.ReceiptReducer.ReceiptType,
            ReceiptGoButton: state.ReceiptReducer.ReceiptGoButton,
            ReceiptModeList: state.PartyMasterBulkUpdateReducer.SelectField,
            updateMsg: state.BankReducer.updateMessage,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {
        const page_Id = pageId.CREDIT//changes
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
    }, []);

    
    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const { Data = [] } = ReceiptGoButton

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)//changes
    const hasShowModal = props.hasOwnProperty(mode.editValue)//changes



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

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    // useEffect(() => {

    //     if ((hasShowloction || hasShowModal)) {

    //         let hasEditVal = null
    //         if (hasShowloction) {
    //             setPageMode(location.pageMode)
    //             hasEditVal = location.editValue
    //         }
    //         else if (hasShowModal) {
    //             hasEditVal = props.editValue
    //             setPageMode(props.pageMode)
    //             setModalCss(true)
    //         }

    //         if (hasEditVal) {
    //             const { id, Name } = hasEditVal
    //             const { values, fieldLabel, hasValid, required, isError } = { ...state }

    //             hasValid.Name.valid = true;

    //             values.id = id
    //             values.Name = Name;

    //             setState({ values, fieldLabel, hasValid, required, isError })
    //             dispatch(Breadcrumb_inputName(hasEditVal.Name))
    //             seteditCreatedBy(hasEditVal.CreatedBy)
    //         }
    //         dispatch(editBankIDSuccess({ Status: false }))
    //     }
    // }, [])

    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            setState(() => resetFunction(fileds, state)) //Clear form values 
            dispatch(Breadcrumb_inputName(''))

            if (pageMode === "other") {
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
                    RedirectPath: url.BANK_LIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
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
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            setState(() => resetFunction(fileds, state)) // Clear form values 
            history.push({
                pathname: url.BANK_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateBankIDSuccess({ Status: false }));
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
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    useEffect(() => {
        
         
        const jsonBody = JSON.stringify({
            Type: 1,
            PartyID: loginPartyID(),
            CompanyID: loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
    }, []);

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
            TypeID: 6
        });
        dispatch(postSelect_Field_for_dropdown(jsonBody));
    }, []);
   

    const PartyOptions = RetailerList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const ReceiptModeOptions = ReceiptModeList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    function DateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.DebitDate = date;
            a.hasValid.DebitDate.valid = true
            return a
        })
    }
    function CustomerOnChange(e) { // Customer dropdown function

        setState((i) => {
            i.values.AmountPaid = 0
            i.hasValid.AmountPaid.valid = true;
            return i
        })
        const jsonBody = JSON.stringify({
            PartyID: loginPartyID(),
            CustomerID: e.value,
            InvoiceID: ""
        });

        // const jsonBody1 = JSON.stringify({
        //     PartyID: loginPartyID(),
        //     CustomerID: e.value,
        //     ReceiptDate: values.ReceiptDate
        // });

        const body = { jsonBody, pageMode }
        dispatch(ReceiptGoButtonMaster(body));
        // dispatch(GetOpeningBalance(jsonBody1));
    }

    const pagesListColumns = [
        {
            text: "InvoiceDate",
            dataField: "InvoiceDate",
        },
        {
            text: "Bill No",
            dataField: "FullInvoiceNumber",
        },
        {
            text: "Bill Amount",
            dataField: "GrandTotal",
        },
        {
            text: "Paid",
            dataField: "PaidAmount",
        },
        {
            text: "Bal Amt",
            dataField: "BalanceAmount",
        },
        {
            text: "Calculate",
            dataField: "",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <CInput
                        key={`Quantity${row.FullInvoiceNumber}${key}`}
                        id={`Quantity${row.FullInvoiceNumber}`}
                        pattern={decimalRegx}
                        defaultValue={row.Calculate}
                        // disabled={page_Mode === mode.modeSTPsave ? true : false}
                        // value={row.Calculate}
                        // type="text"
                        autoComplete="off"
                        className="col col-sm text-center"
                    // onChange={(e) => CalculateOnchange(e, row, key)}

                    />
                </span>)
            },
            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            },
        },
    ];





    const saveHandeller = async (event) => {
        event.preventDefault();
        const btnId = event.target.id
        try {
            
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })
                
                const jsonBody = JSON.stringify({
                    Name: values.Name,
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID(),
                    Company: loginCompanyID(),
                });

                if (pageMode === mode.edit) {
                    dispatch(updateBankID({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    dispatch(saveBankMaster({ jsonBody, btnId }));
                }
            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
                <div className="page-content" style={{ marginBottom: "5cm" }}>
                    <form noValidate>
                        {/* <Card> */}
                        {/* <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader> */}
                        {/* <div className="px-2 c_card_filter header text-black mb-2" > */}
                        {/* <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} > */}
                        <div className="px-2 c_card_filter header text-black mb-2" >
                            {/* <CardBody className="c_card_body"> */}
                                <Row>
                                    <Col sm="6">
                                        <FormGroup className="row mt-2" >
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.CreditDate}</Label>
                                            <Col sm="7">
                                                <Flatpickr
                                                    name='CreditDate'
                                                    value={values.CreditDate}
                                                    className="form-control d-block p-2 bg-white text-dark"
                                                    placeholder="Select..."
                                                    options={{
                                                        altInput: true,
                                                        altFormat: "d-m-Y",
                                                        dateFormat: "Y-m-d",
                                                    }}
                                                    onChange={DateOnchange}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col >

                                    <Col sm="6">
                                        <FormGroup className=" row mt-2 " >
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Narration}</Label>
                                            <Col sm="7">
                                                <Input
                                                    name="Narration"
                                                    id="Narration"
                                                    value={values.Narration}
                                                    type="text"
                                                    className={isError.Narration.length > 0 ? "is-invalid form-control" : "form-control"}
                                                    placeholder="Please Enter Comment"
                                                    autoComplete='off'
                                                    autoFocus={true}
                                                    onChange={(event) => {
                                                        onChangeText({ event, state, setState })
                                                    }}
                                                />
                                                {isError.Narration.length > 0 && (
                                                    <span className="text-danger f-8"><small>{isError.Narration}</small></span>
                                                )}
                                            </Col>

                                        </FormGroup>
                                    </Col >
                                </Row>

                                <Row>
                                    <Col sm="6">
                                        <FormGroup className=" row mt-2 " >
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.PartyName} </Label>
                                            <Col sm="7">
                                                <Select
                                                    id="PartyName"
                                                    name="PartyName"
                                                    value={values.PartyName}
                                                    isSearchable={true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={PartyOptions}
                                                    onChange={(hasSelect, evn) => {
                                                        onChangeSelect({ hasSelect, evn, state, setState });
                                                        CustomerOnChange(hasSelect)
                                                    }}
                                                />
                                                {isError.PartyName.length > 0 && (
                                                    <span className="text-danger f-8"><small>{isError.PartyName}</small></span>
                                                )}
                                            </Col>

                                        </FormGroup>
                                    </Col >
                                    <Col sm="6">
                                        <FormGroup className=" row mt-2 " >
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Amount}</Label>
                                            <Col sm="7">
                                                <Input
                                                    name="Amount"
                                                    id="Amount"
                                                    value={values.Amount}
                                                    type="text"
                                                    className={isError.Amount.length > 0 ? "is-invalid form-control" : "form-control"}
                                                    placeholder="Please Enter Comment"
                                                    autoComplete='off'
                                                    autoFocus={true}
                                                    onChange={(event) => { onChangeText({ event, state, setState }) }}
                                                />
                                                {isError.Amount.length > 0 && (
                                                    <span className="text-danger f-8"><small>{isError.Amount}</small></span>

                                                )}
                                            </Col>

                                        </FormGroup>
                                    </Col >
                                </Row>

                                <Row>
                                    <Col sm="6">
                                        <FormGroup className=" row mt-2 " >
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.CreditNoteReason}</Label>
                                            <Col sm="7">
                                                <Select
                                                    id="CreditNoteReason "
                                                    name="CreditNoteReason"
                                                    value={values.CreditNoteReason}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={ReceiptModeOptions}
                                                    onChange={(hasSelect, evn) => { onChangeSelect({ hasSelect, evn, state, setState, }) }}
                                                />
                                                {isError.CreditNoteReason.length > 0 && (
                                                    <span className="text-danger f-8"><small>{isError.CreditNoteReason}</small></span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col >

                                </Row>
                            {/* </CardBody> */}
                        </div>
                        {/* </CardBody> */}

                        {/* </div> */}

                        {/* </Card> */}

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

                                        {mySearchProps(toolkitProps.searchProps)}
                                    </div>

                                </React.Fragment>
                            )
                            }
                        </ToolkitProvider>

                        {Data.length > 0 ?
                            <FormGroup>
                                <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                    <SaveButton pageMode={pageMode}
                                        onClick={saveHandeller}
                                        userAcc={userPageAccessState}
                                        editCreatedBy={editCreatedBy}
                                        module={"Receipts"}
                                    />

                                </Col>
                            </FormGroup >
                            : null
                        }

                    </form >
                </div>
            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default Credit

