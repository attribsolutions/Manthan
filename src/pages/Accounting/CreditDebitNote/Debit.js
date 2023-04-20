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
    onChangeText,
    resetFunction
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    btnIsDissablefunc,
    loginCompanyID,
    loginUserID
} from "../../../components/Common/CommonFunction";
import Select from "react-select";
import Flatpickr from "react-flatpickr"
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import {
    editBankIDSuccess,
    saveBankMaster,
    saveBankMaster_Success,
    updateBankID,
    updateBankIDSuccess
} from "../../../store/Accounting/BankRedux/action";


const Credit = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        id: "",
        Name: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [pageMode, setPageMode] = useState(mode.defaultsave);//changes
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState(123);
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        pageField,
        updateMsg,
        userAccess } = useSelector((state) => ({
            postMsg: state.BankReducer.postMsg,
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
    useEffect(() => {

        if ((hasShowloction || hasShowModal)) {

            let hasEditVal = null
            if (hasShowloction) {
                setPageMode(location.pageMode)
                hasEditVal = location.editValue
            }
            else if (hasShowModal) {
                hasEditVal = props.editValue
                setPageMode(props.pageMode)
                setModalCss(true)
            }

            if (hasEditVal) {
                const { id, Name } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.Name.valid = true;

                values.id = id
                values.Name = Name;

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editBankIDSuccess({ Status: false }))
        }
    }, [])

    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveBankMaster_Success({ Status: false }))
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
            dispatch(saveBankMaster_Success({ Status: false }))
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
                <div className="page-content" style={{ marginTop: IsEditMode_Css, }}>
                    <form noValidate>
                        <Card>
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>
                            {/* <div className="px-2 c_card_filter header text-black mb-2" > */}
                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                            <CardBody className="c_card_body">
                                <Row>
                                    <Col sm="6">
                                        <FormGroup className="row mt-2" >
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginRight: "0.4cm" }}>Date</Label>
                                            <Col sm="7">
                                                <Flatpickr
                                                    name='ReturnDate'
                                                    // value={values.ReturnDate}
                                                    className="form-control d-block p-2 bg-white text-dark"
                                                    placeholder="Select..."
                                                    options={{
                                                        altInput: true,
                                                        altFormat: "d-m-Y",
                                                        dateFormat: "Y-m-d",
                                                    }}
                                                // onChange={ReturnDate_Onchange}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col >

                                    <Col sm="6">
                                        <FormGroup className=" row mt-2 " >
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginRight: "0.4cm" }}>Narration</Label>
                                            <Col sm="7">
                                                <Input
                                                    name="Comment"
                                                    id="Comment"
                                                    // value={values.Comment}
                                                    type="text"
                                                    // className={isError.Comment.length > 0 ? "is-invalid form-control" : "form-control"}
                                                    placeholder="Please Enter Comment"
                                                    autoComplete='off'
                                                    autoFocus={true}
                                                // onChange={(event) => {
                                                //     onChangeText({ event, state, setState })
                                                // }}
                                                />
                                                {/* {isError.Retailer.length > 0 && (
                                                <span className="text-danger f-8"><small></small></span>
                                            )} */}
                                            </Col>

                                        </FormGroup>
                                    </Col >
                                </Row>

                                <Row>
                                    <Col sm="6">
                                        <FormGroup className=" row mt-2 " >
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginRight: "0.4cm" }}>Party Name </Label>
                                            <Col sm="7">
                                                <Select
                                                    id="ReturnReason "
                                                    name="ReturnReason"
                                                    // value={values.ReturnReason}
                                                    isSearchable={true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                // options={ReturnReasonOptions}
                                                // onChange={(hasSelect, evn) => {
                                                //     onChangeSelect({ hasSelect, evn, state, setState, })
                                                // }}
                                                />
                                                {/* {isError.ReturnReason.length > 0 && (
                                                <span className="text-danger f-8"><small></small></span>
                                            )} */}
                                            </Col>

                                        </FormGroup>
                                    </Col >

                                    <Col sm="6">
                                        <FormGroup className=" row mt-2 " >
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginRight: "0.4cm" }}>Comment</Label>
                                            <Col sm="7">
                                                <Input
                                                    name="Comment"
                                                    id="Comment"
                                                    // value={values.Comment}
                                                    type="text"
                                                    // className={isError.Comment.length > 0 ? "is-invalid form-control" : "form-control"}
                                                    placeholder="Please Enter Comment"
                                                    autoComplete='off'
                                                    autoFocus={true}
                                                // onChange={(event) => {
                                                //     onChangeText({ event, state, setState })
                                                // }}
                                                />
                                                {/* {isError.Comment.length > 0 && (
                                                <span className="invalid-feedback"></span>
                                            )} */}
                                            </Col>

                                        </FormGroup>
                                    </Col >
                                </Row>

                                <Row>
                                    <Col sm="6">
                                        <FormGroup className=" row mt-2 " >
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginRight: "0.4cm" }}>Service Items</Label>
                                            <Col sm="7">
                                                <Select
                                                    id="ItemName "
                                                    name="ItemName"
                                                    // value={values.ItemName}
                                                    // isDisabled={(returnMode === 1) ? true : false}
                                                    isSearchable={true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                // options={ItemOptions}
                                                // onChange={(hasSelect, evn) => {
                                                //     onChangeSelect({ hasSelect, evn, state, setState, })
                                                //     setrRturnMode(2)
                                                // }}
                                                />
                                                {/* {isError.ItemName.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ItemName}</small></span>
                                            )} */}
                                            </Col>


                                        </FormGroup>
                                    </Col >
                                    <Col sm="6">
                                        <FormGroup className=" row mt-2 " >
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginRight: "0.4cm" }}>Amount</Label>
                                            <Col sm="7">
                                                <Input
                                                    name="Comment"
                                                    id="Comment"
                                                    // value={values.Comment}
                                                    type="text"
                                                    // className={isError.Comment.length > 0 ? "is-invalid form-control" : "form-control"}
                                                    placeholder="Please Enter Comment"
                                                    autoComplete='off'
                                                    autoFocus={true}
                                                // onChange={(event) => {
                                                //     onChangeText({ event, state, setState })
                                                // }}
                                                />
                                                {/* {isError.Comment.length > 0 && (
                                                <span className="invalid-feedback"></span>
                                            )} */}
                                            </Col>

                                        </FormGroup>
                                    </Col >

                                </Row>
                                </CardBody>
                                </CardBody>

                            {/* </div> */}
                            <FormGroup>
                                <Col sm={2} style={{marginLeft:"15px",marginBottom:"10px"}}>
                                    
                                    <SaveButton pageMode={pageMode}
                                        onClick={saveHandeller}
                                        userAcc={userPageAccessState}
                                        editCreatedBy={editCreatedBy}
                                        module={"SalesReturn"}
                                    />

                                </Col>
                            </FormGroup >
                        </Card>

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

