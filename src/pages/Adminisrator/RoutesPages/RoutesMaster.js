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
import { commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { Breadcrumb_inputName } from "../../../store/Utilites/Breadcrumb/actions";
import { useDispatch, useSelector } from "react-redux";
import {
    SaveRoutesMaster,
    SaveRoutesMasterSuccess,
    editRoutesIDSuccess,
    updateRoutesID,
    GetRoutesListSuccess,
    updateRoutesIDSuccess,
} from "../../../store/Administrator/RoutesRedux/actions";
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
    loginCompanyID,
    loginPartyID,
    loginUserID,
    btnIsDissablefunc,
    metaTagLabel,
    loginSelectedPartyID,

} from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import PartyDropdown_Common from "../../../components/Common/PartyDropdown";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";

const RoutesMaster = (props) => {

    const history = useHistory();
    const dispatch = useDispatch();

    const fileds = {
        id: "",
        Name: "",
        Party: "",
        IsActive: false,
        Sunday: false,
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState(123);
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg,
        updateMsg,
        pageField,
        saveBtnloading,
        userAccess } = useSelector((state) => ({
            saveBtnloading: state.RoutesReducer.saveBtnloading,
            postMsg: state.RoutesReducer.PostData,
            updateMsg: state.RoutesReducer.updateMessage,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {
        const page_Id = pageId.ROUTES
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
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

                const { id, Name, IsActive, Party, PartyName, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                values.id = id;
                values.Party = { value: Party, label: PartyName }
                values.Name = Name;
                values.IsActive = IsActive
                values.Sunday = Sunday
                values.Monday = Monday
                values.Tuesday = Tuesday
                values.Wednesday = Wednesday
                values.Thursday = Thursday
                values.Friday = Friday
                values.Saturday = Saturday

                hasValid.Party.valid = true;
                hasValid.Name.valid = true;
                hasValid.IsActive.valid = true;
                hasValid.Sunday.valid = true;
                hasValid.Monday.valid = true;
                hasValid.Tuesday.valid = true;
                hasValid.Wednesday.valid = true;
                hasValid.Thursday.valid = true;
                hasValid.Friday.valid = true;
                hasValid.Saturday.valid = true;

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editRoutesIDSuccess({ Status: false }))
        }
    }, [])

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(SaveRoutesMasterSuccess({ Status: false }))
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
                    history.push({ pathname: url.ROUTES_LIST })
                }
            }
        }

        else if (postMsg.Status === true) {
            dispatch(GetRoutesListSuccess({ Status: false }))
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
                pathname: url.ROUTES_LIST,
            })
        }

        else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateRoutesIDSuccess({ Status: false }));
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


    const SaveHandler = async (event) => {

        event.preventDefault();
        const btnId = event.target.id

        try {
            if ((loginSelectedPartyID() === 0)) {
                customAlert({ Type: 3, Message: "Please Select Party" });
                return;
            };
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify({
                    Name: values.Name,
                    IsActive: values.IsActive,
                    Party: loginSelectedPartyID(),
                    Sunday: values.Sunday,
                    Monday: values.Monday,
                    Tuesday: values.Tuesday,
                    Wednesday: values.Wednesday,
                    Thursday: values.Thursday,
                    Friday: values.Friday,
                    Saturday: values.Saturday,
                    Company: loginCompanyID(),
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID()
                });

                if (pageMode === mode.edit) {
                    dispatch(updateRoutesID({ jsonBody, updateId: values.id, btnId }));
                }

                else {
                    dispatch(SaveRoutesMaster({ jsonBody, btnId }));
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
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <PartyDropdown_Common />

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

                                                    <Col>
                                                        <FormGroup className="mt-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01" >{fieldLabel.Sunday}</Label>
                                                            <Input
                                                                style={{ marginLeft: "53px" }}
                                                                type="checkbox"
                                                                className="p-1"
                                                                name="Sunday"
                                                                checked={values.Sunday}
                                                                onChange={(e) => {
                                                                    setState((i) => {
                                                                        const a = { ...i }
                                                                        a.values.Sunday = e.target.checked;
                                                                        return a
                                                                    })
                                                                }}
                                                            >
                                                            </Input>
                                                        </FormGroup>


                                                        <FormGroup className="mt-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Monday}</Label>
                                                            <Input
                                                                style={{ marginLeft: "51px" }}
                                                                type="checkbox"
                                                                className="p-1"
                                                                name="Monday"
                                                                checked={values.Monday}
                                                                onChange={(e) => {
                                                                    setState((i) => {
                                                                        const a = { ...i }
                                                                        a.values.Monday = e.target.checked;
                                                                        return a
                                                                    })
                                                                }}
                                                            >
                                                            </Input>
                                                        </FormGroup>


                                                        <FormGroup className="mt-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Tuesday}</Label>
                                                            <Input
                                                                style={{ marginLeft: "49px" }}
                                                                type="checkbox"
                                                                className="p-1"
                                                                name="Tuesday"
                                                                checked={values.Tuesday}
                                                                onChange={(e) => {
                                                                    setState((i) => {
                                                                        const a = { ...i }
                                                                        a.values.Tuesday = e.target.checked;
                                                                        return a
                                                                    })
                                                                }}
                                                            >
                                                            </Input>
                                                        </FormGroup>


                                                        <FormGroup className="mt-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Wednesday}</Label>
                                                            <Input
                                                                style={{ marginLeft: "28px" }}
                                                                type="checkbox"
                                                                className="p-1"
                                                                name="Wednesday"
                                                                checked={values.Wednesday}
                                                                onChange={(e) => {
                                                                    setState((i) => {
                                                                        const a = { ...i }
                                                                        a.values.Wednesday = e.target.checked;
                                                                        return a
                                                                    })
                                                                }}
                                                            >
                                                            </Input>
                                                        </FormGroup>


                                                        <FormGroup className="mt-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Thursday}</Label>
                                                            <Input
                                                                style={{ marginLeft: "43px" }}
                                                                type="checkbox"
                                                                className="p-1"
                                                                name="Thursday"
                                                                checked={values.Thursday}
                                                                onChange={(e) => {
                                                                    setState((i) => {
                                                                        const a = { ...i }
                                                                        a.values.Thursday = e.target.checked;
                                                                        return a
                                                                    })
                                                                }}
                                                            >
                                                            </Input>
                                                        </FormGroup>

                                                        <FormGroup className="mt-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Friday}</Label>
                                                            <Input
                                                                style={{ marginLeft: "62px" }}
                                                                type="checkbox"
                                                                className="p-1"
                                                                name="Friday"
                                                                checked={values.Friday}
                                                                onChange={(e) => {
                                                                    setState((i) => {
                                                                        const a = { ...i }
                                                                        a.values.Friday = e.target.checked;
                                                                        return a
                                                                    })
                                                                }}
                                                            >
                                                            </Input>
                                                        </FormGroup>

                                                        <FormGroup className="mt-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Saturday}</Label>
                                                            <Input
                                                                style={{ marginLeft: "43px" }}
                                                                type="checkbox"
                                                                className="p-1"
                                                                name="Saturday"
                                                                checked={values.Saturday}
                                                                onChange={(e) => {
                                                                    setState((i) => {
                                                                        const a = { ...i }
                                                                        a.values.Saturday = e.target.checked;
                                                                        return a
                                                                    })
                                                                }}
                                                            >
                                                            </Input>
                                                        </FormGroup>
                                                    </Col>

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
                                                                    module={"RoutesMaster"}
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
            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default RoutesMaster

