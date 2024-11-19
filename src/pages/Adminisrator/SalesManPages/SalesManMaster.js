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
    Row,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { Breadcrumb_inputName } from "../../../store/Utilites/Breadcrumb/actions";
import { useDispatch, useSelector } from "react-redux";
import {
    saveSalesManMaster,
    saveSalesManMasterSuccess,
    editSalesManIDSuccess,
    updateSalesManID,
    getSalesManlistSuccess,
    updateSalesManIDSuccess,
} from "../../../store/Administrator/SalesManRedux/actions";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    onChangeText,
    resetFunction
} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { SaveButton } from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    loginCompanyID,
    loginUserID,
    btnIsDissablefunc,
    metaTagLabel,
    loginJsonBody,

} from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import { GetRoutesList, GetRoutesListSuccess } from "../../../store/Administrator/RoutesRedux/actions";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";

const SalesManMaster = (props) => {

    const history = useHistory();
    const dispatch = useDispatch();

    const fileds = {
        id: "",
        Name: "",
        MobileNo: "",
        Party: '',
        SalesmanRoute: [],
        IsActive: false
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState(123);
    const [editCreatedBy, seteditCreatedBy] = useState("");

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg,
        updateMsg,
        pageField,
        RoutesList,
        saveBtnloading,
        userAccess } = useSelector((state) => ({
            saveBtnloading: state.SalesManReducer.saveBtnloading,
            postMsg: state.SalesManReducer.PostData,
            updateMsg: state.SalesManReducer.updateMessage,
            RoutesList: state.RoutesReducer.RoutesList,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);

    // Common Party select Dropdown useEffect
    useEffect(() => {
        if (commonPartyDropSelect.value > 0) {
            partySelectButtonHandler();
        } else {
            partySelectOnChangeHandler();
        }
    }, [commonPartyDropSelect]);

    useEffect(() => {
        const page_Id = pageId.SALESMAN
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(GetRoutesList())
    }, []);



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

    //This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
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

                const routeArr = hasEditVal.SalesmanRoute.map((data) => ({
                    value: data.Route,
                    label: data.Name
                }))

                const { id, Name, IsActive, MobileNo, Party, PartyName } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }
                values.Name = Name;
                values.id = id;
                values.MobileNo = MobileNo;
                values.IsActive = IsActive
                values.SalesmanRoute = routeArr;
                values.Party = { value: Party, label: PartyName }

                hasValid.Party.valid = true;
                hasValid.Name.valid = true;
                hasValid.IsActive.valid = true;
                hasValid.MobileNo.valid = true;
                hasValid.SalesmanRoute.valid = true;

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editSalesManIDSuccess({ Status: false }))
        }
    }, [])

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveSalesManMasterSuccess({ Status: false }))
            setState(() => resetFunction(fileds, state)) // Clear form values 
            dispatch(Breadcrumb_inputName(''))
            if (pageMode === "other") {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                let isPermission = await customAlert({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                })
                if (isPermission) {
                    history.push({ pathname: url.SALESMAN_LIST })
                }
            }
        }
        else if (postMsg.Status === true) {
            dispatch(getSalesManlistSuccess({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            setState(() => resetFunction(fileds, state)) // Clear form values 
            history.push({
                pathname: url.SALESMAN_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateSalesManIDSuccess({ Status: false }));
            customAlert({
                Type: 3,
                Message: JSON.stringify(updateMsg.Message),
            })
        }
    }, [updateMsg, modalCss]);

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    const RoutesListOptions = RoutesList.map((index) => ({
        value: index.id,
        label: index.Name,
        IsActive: index.IsActive
    }));

    const RouteName_Options = RoutesListOptions.filter((index) => {
        return index.IsActive === true
    });

    const partySelectButtonHandler = (e) => {
        const jsonBody = JSON.stringify({
            ...loginJsonBody(),
            PartyID: commonPartyDropSelect.value,
        });
        dispatch(GetRoutesList(jsonBody));
    }

    function partySelectOnChangeHandler() {
        dispatch(GetRoutesListSuccess([]));
        setState((i) => {
            let a = { ...i }
            a.values.SalesmanRoute = []
            a.hasValid.SalesmanRoute.valid = true;
            return a
        })
    }

    const SaveHandler = async (event) => {

        event.preventDefault();
        const btnId = event.target.id
        try {
            if ((commonPartyDropSelect.value === 0)) {
                customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
                return;
            };
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })

                const routeArr = values.SalesmanRoute.map((i) => ({
                    Route: i.value,
                }))

                const jsonBody = JSON.stringify({
                    Name: values.Name,
                    MobileNo: values.MobileNo,
                    IsActive: values.IsActive,
                    Party: commonPartyDropSelect.value,
                    SalesmanRoute: routeArr,
                    Company: loginCompanyID(),
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID()
                });

                if (pageMode === mode.edit) {
                    dispatch(updateSalesManID({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    dispatch(saveSalesManMaster({ jsonBody, btnId }));
                }
            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    // var IsEditMode_Css = ''
    // if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" >
                    <Container fluid>
                        <Card className="text-black" style={{ marginTop: "3px" }}>
                            <CardHeader className="card-header   text-black c_card_header">
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form noValidate>
                                    <Row className="">
                                        <Col md={12}>
                                            <Card>
                                                <CardBody className="c_card_body">
                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Name}</Label>
                                                            <Input
                                                                name="Name"
                                                                id="txtName"
                                                                value={values.Name}
                                                                type="text"
                                                                className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                placeholder="Please Enter Name"
                                                                autoComplete="off"
                                                                autoFocus={true}
                                                                onChange={(event) => {
                                                                    onChangeText({ event, state, setState })
                                                                    dispatch(Breadcrumb_inputName(event.target.value))
                                                                }}
                                                            />
                                                            {isError.Name.length > 0 && (
                                                                <span className="invalid-feedback">{isError.Name}</span>
                                                            )}
                                                        </FormGroup>
                                                    </Row>
                                                    <Row>
                                                        <FormGroup className="mt-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">Mobile Number </Label>
                                                            <Input
                                                                name="MobileNo"
                                                                value={values.MobileNo}
                                                                type="text"
                                                                className={isError.MobileNo.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                placeholder="Please Enter Mobile"
                                                                autoComplete='off'
                                                                onChange={(event) => {
                                                                    onChangeText({ event, state, setState })
                                                                }}
                                                            />
                                                            {isError.MobileNo.length > 0 && (
                                                                <span className="invalid-feedback">{isError.MobileNo}</span>
                                                            )}
                                                        </FormGroup>
                                                    </Row>

                                                    <Row>
                                                        <FormGroup className="mt-2 col col-sm-4">
                                                            <Label htmlFor="validationCustom01"> {fieldLabel.SalesmanRoute} </Label>
                                                            <Select
                                                                name="SalesmanRoute"
                                                                isMulti={true}
                                                                value={values.SalesmanRoute}
                                                                isSearchable={true}
                                                                className="react-dropdown"
                                                                classNamePrefix="dropdown"
                                                                options={RouteName_Options}
                                                                onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                                            />
                                                            {isError.SalesmanRoute.length > 0 && (
                                                                <span className="text-danger f-8"><small>{isError.SalesmanRoute}</small></span>
                                                            )}
                                                        </FormGroup>
                                                    </Row>

                                                    <Row>
                                                        <FormGroup className="mt-2 col col-sm-5">
                                                            <Row className="justify-content-md-left">
                                                                <Label htmlFor="horizontal-firstname-input" className="col-sm-3 col-form-label">{fieldLabel.IsActive}</Label>
                                                                <Col md={2} style={{ marginTop: '9px' }} >
                                                                    <div className="form-check form-switch form-switch-md mb-3">
                                                                        <Input type="checkbox" className="form-check-input"
                                                                            checked={values.IsActive}
                                                                            name="IsActive"
                                                                            onChange={(e) => {
                                                                                setState((i) => {
                                                                                    const a = { ...i }
                                                                                    a.values.IsActive = e.target.checked;
                                                                                    return a
                                                                                })
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
                                                    </Row>

                                                    <FormGroup className="mt-2">
                                                        <Row>
                                                            <Col sm={2}>
                                                                <SaveButton pageMode={pageMode}
                                                                    loading={saveBtnloading}
                                                                    onClick={SaveHandler}
                                                                    userAcc={userPageAccessState}
                                                                    editCreatedBy={editCreatedBy}
                                                                    module={"SalesManMaster"}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>

                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </form>
                            </CardBody>
                        </Card>
                    </Container>
                </div>
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default SalesManMaster

