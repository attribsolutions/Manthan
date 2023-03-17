import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Row,
    Table
} from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import {
    savePartySubPartySuccess,
    getPartySubParty_For_party_dropdown,
} from "../../../store/Administrator/PartySubPartyRedux/action";
import {
    AlertState,
    Breadcrumb_inputName,
    commonPageField,
    commonPageFieldSuccess
} from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    get_Party_ForDropDown,
} from "../../../store/Administrator/ItemsRedux/action";
import { SaveButton } from "../../../components/Common/CommonButton";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
} from "../../../components/Common/validationFunction";
import { breadcrumbReturnFunc, btnIsDissablefunc, loginUserID } from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import { Retailer_List, SSDD_List_under_Company } from "../../../store/CommonAPI/SupplierRedux/actions";

const PartySubParty = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const fileds = {
        id: "",
        PartyName: "",
        SubParty: "",
        IsRetailerTransfer: false,
        SSDD: "",
        Retailer: ""
    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [modalCss, setModalCss] = useState(false);
    const [PartyData, setPartyData] = useState([]);
    const [Division_dropdown_Select, setDivision_dropdown_Select] = useState([]);
    const [userPageAccessState, setUserPageAccessState] = useState(123);
    const [Party_dropdown_Select, setParty_dropdown_Select] = useState([]);
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg,
        SSDD_List,
        RetailerList,
        updateMsg,
        pageField,
        PartySubParty,
        userAccess } = useSelector((state) => ({
            postMsg: state.PartySubPartyReducer.postMsg,
            SSDD_List: state.CommonAPI_Reducer.SSDD_List,
            RetailerList: state.CommonAPI_Reducer.RetailerList,
            updateMsg: state.PartySubPartyReducer.updateMsg,
            pageField: state.CommonPageFieldReducer.pageField,
            userAccess: state.Login.RoleAccessUpdateData,
            PartySubParty: state.PartySubPartyReducer.PartySubParty,
        }));

    useEffect(() => {
        const page_Id = pageId.PARTY_SUB_PARTY
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(SSDD_List_under_Company());
        dispatch(Retailer_List());

    }, []);

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

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
            setUserPageAccessState(userAcc)
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200) && !(pageMode === mode.dropdownAdd)) {
            dispatch(savePartySubPartySuccess({ Status: false }))
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
                    RedirectPath: url.PARTY_SUB_PARTY_lIST,
                }))
            }
        }
        else if ((postMsg.Status === true) && !(pageMode === mode.dropdownAdd)) {
            dispatch(savePartySubPartySuccess({ Status: false }))
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

    const PartyDropdown_Options = SSDD_List.map(i => ({
        value: i.id,
        label: i.Name
    }));

    const RetailerDropdown_Options = RetailerList.map(i => ({
        value: i.id,
        label: i.Name,
    }));

    function handllerDivision(e) {
        dispatch(getPartySubParty_For_party_dropdown(e.value));
        setDivision_dropdown_Select(e)
    }


    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((pageMode === mode.edit) || (pageMode === mode.copy) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form noValidate>
                                    <Row className="">
                                        <Col md={12}>
                                            <Card>
                                                <CardBody className="c_card_body">

                                                    <Row className="mb-3">
                                                        <Col sm="4">
                                                            <FormGroup>
                                                                <Label htmlFor="validationCustom01"> {fieldLabel.PartyName}</Label>
                                                                <Select
                                                                    name="PartyName"
                                                                    value={values.PartyName}
                                                                    isSearchable={true}
                                                                    className="react-dropdown"
                                                                    classNamePrefix="dropdown"
                                                                    options={PartyDropdown_Options}
                                                                    onChange={(hasSelect, evn) => {
                                                                        onChangeSelect({ hasSelect, evn, state, setState, })
                                                                    }}
                                                                />
                                                                {/* {isError.PartyName.length > 0 && (
                                                                        <span className="text-danger f-8"><small>{isError.PartyName}</small></span>
                                                                    )} */}
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col sm="4">
                                                            <FormGroup>
                                                                <Label htmlFor="validationCustom01"> {fieldLabel.SubParty}</Label>
                                                                <Select
                                                                    name="SubParty"
                                                                    value={values.SubParty}
                                                                    isSearchable={true}
                                                                    className="react-dropdown"
                                                                    classNamePrefix="dropdown"
                                                                    options={PartyDropdown_Options}
                                                                    onChange={(hasSelect, evn) => {
                                                                        onChangeSelect({ hasSelect, evn, state, setState, })
                                                                    }}
                                                                />
                                                                {/* {isError.SubParty.length > 0 && (
                                                                        <span className="text-danger f-8"><small>{isError.SubParty}</small></span>
                                                                    )} */}
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <FormGroup className="mt-3 col col-sm-5">
                                                            <Row className="justify-content-md-left">
                                                                <Label htmlFor="horizontal-firstname-input" className="col-sm-5 col-form-label">{fieldLabel.IsRetailerTransfer}</Label>
                                                                <Col md={2} style={{ marginTop: '9px' }} >
                                                                    <div className="form-check form-switch form-switch-md mb-3">
                                                                        <Input type="checkbox" className="form-check-input"
                                                                            checked={values.IsRetailerTransfer}
                                                                            name="IsRetailerTransfer"
                                                                            onChange={(e) => {
                                                                                setState((i) => {
                                                                                    const a = { ...i }
                                                                                    a.values.IsRetailerTransfer = e.target.checked;
                                                                                    return a
                                                                                })
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
                                                    </Row>

                                                    {
                                                        values.IsRetailerTransfer ?
                                                            <div>
                                                                <Row className="mb-3">
                                                                    <Col sm="4">
                                                                        <FormGroup>
                                                                            <Label htmlFor="validationCustom01"> {fieldLabel.SSDD}</Label>
                                                                            <Select
                                                                                name="SSDD"
                                                                                value={values.SSDD}
                                                                                isSearchable={true}
                                                                                className="react-dropdown"
                                                                                classNamePrefix="dropdown"
                                                                                options={PartyDropdown_Options}
                                                                                onChange={(hasSelect, evn) => {
                                                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                                                }}
                                                                            />
                                                                            {/* {isError.SSDD.length > 0 && (
                                                                        <span className="text-danger f-8"><small>{isError.SSDD}</small></span>
                                                                    )} */}
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row className="mb-3">
                                                                    <Col sm="4">
                                                                        <FormGroup>
                                                                            <Label htmlFor="validationCustom01"> {fieldLabel.Retailer}</Label>
                                                                            <Select
                                                                                name="Retailer"
                                                                                value={values.Retailer}
                                                                                isSearchable={true}
                                                                                className="react-dropdown"
                                                                                classNamePrefix="dropdown"
                                                                                options={RetailerDropdown_Options}
                                                                                onChange={(hasSelect, evn) => {
                                                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                                                }}
                                                                            />
                                                                            {/* {isError.Retailer.length > 0 && (
                                                                        <span className="text-danger f-8"><small>{isError.Retailer}</small></span>
                                                                    )} */}
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                            : null
                                                    }



                                                    <FormGroup className="mt-3">
                                                        <Row>
                                                            <Col sm={2}>
                                                                <SaveButton pageMode={pageMode}
                                                                    // onClick={SaveHandler}
                                                                    userAcc={userPageAccessState}
                                                                    editCreatedBy={editCreatedBy}
                                                                    module={"PartySubParty"}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </FormGroup >


                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </form>
                            </CardBody>

                        </Card>

                    </Container>
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

export default PartySubParty

