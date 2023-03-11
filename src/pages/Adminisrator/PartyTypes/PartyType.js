import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    Breadcrumb_inputName,
    AlertState,
    commonPageField,
    commonPageFieldSuccess
} from "../../../store/actions";
import {
    editPartyTypeSuccess,
    PostPartyTypeAPISuccess,
    getPartyTypelist,
    updatePartyTypeID,
    PostPartyTypeAPI,
    updatePartyTypeIDSuccess
} from "../../../store/Administrator/PartyTypeRedux/action";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeText,
    resetFunction
} from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import { SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import { breadcrumbReturn, loginCompanyID, loginUserID, saveDissable } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"

const PartyType = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const fileds = {
        id: "",
        Name: "",
        IsSCM: false,
        IsDivision: false,
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.modeSTPsave);
    const [userPageAccessState, setUserPageAccessState] = useState("");
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PostAPIResponse, pageField, updateMsg, userAccess } =
        useSelector((state) => ({
            PostAPIResponse: state.PartyTypeReducer.PostData,
            pageField: state.CommonPageFieldReducer.pageField,
            userAccess: state.Login.RoleAccessUpdateData,
            updateMsg: state.PartyTypeReducer.updateMessage
        }));

    useEffect(() => {
        const page_Id = pageId.PARTYTYPE
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getPartyTypelist());
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
            breadcrumbReturn({dispatch,userAcc});
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
                const { id, Name, IsSCM, IsDivision } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }
                values.Name = Name;
                values.IsSCM = IsSCM;
                values.IsDivision = IsDivision;
                values.id = id
                hasValid.Name.valid = true;
                hasValid.IsSCM.valid = true;
                hasValid.IsDivision.valid = true;

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editPartyTypeSuccess({ Status: false }))
        }
    }, [])

    useEffect(() => {
        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200) && !(pageMode === mode.dropdownAdd)) {
            dispatch(PostPartyTypeAPISuccess({ Status: false }))
            setState(() => resetFunction(fileds, state))// Clear form values  
            saveDissable(false);//save Button Is enable function
            dispatch(Breadcrumb_inputName(''))

            if (pageMode === mode.dropdownAdd) {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: PostAPIResponse.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: PostAPIResponse.Message,
                    RedirectPath: url.PARTYTYPE_lIST,

                }))
            }
        }
        else if ((PostAPIResponse.Status === true) && !(pageMode === mode.dropdownAdd)) {
            saveDissable(false);//save Button Is enable function
            dispatch(PostPartyTypeAPISuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(PostAPIResponse.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [PostAPIResponse])

    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            saveDissable(false);//Update Button Is enable function
            setState(() => resetFunction(fileds, state))// Clear form values 
            history.push({
                pathname: url.PARTYTYPE_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            saveDissable(false);//Update Button Is enable function
            dispatch(updatePartyTypeIDSuccess({ Status: false }));
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

    const SaveHandler = (event) => {
        event.preventDefault();
        if (formValid(state, setState)) {
            const jsonBody = JSON.stringify({
                Name: values.Name,
                IsSCM: values.IsSCM,
                IsDivision: values.IsDivision,
                Company:loginCompanyID(),
                CreatedBy: loginUserID(),
                CreatedOn: "2022-07-18T00:00:00",
                UpdatedBy: loginUserID(),
                UpdatedOn: "2022-07-18T00:00:00"
            });

            saveDissable(true);//save Button Is dissable function

            if (pageMode === mode.edit) {
                dispatch(updatePartyTypeID(jsonBody, values.id));
            }
            else {
                dispatch(PostPartyTypeAPI(jsonBody));
            }
        }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((pageMode === mode.edit) || (pageMode === mode.copy) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
                    <Container fluid>
                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header"  >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form onSubmit={SaveHandler} noValidate>
                                    <Row className="">
                                        <Col md={12}>
                                            <Card>
                                                <CardBody className="c_card_body">
                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Name} </Label>
                                                            <Input
                                                                name="Name"
                                                                id="txtName"
                                                                value={values.Name}
                                                                type="text"
                                                                className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                placeholder="Please Enter Name"
                                                                autoComplete='off'
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

                                                        <Row>
                                                            <FormGroup className="mb-2 col col-sm-5">
                                                                <Row className="justify-content-md-left">
                                                                    <Label htmlFor="horizontal-firstname-input" className="col-sm-3 col-form-label" >{fieldLabel.IsSCM} </Label>
                                                                    <Col md={2} style={{ marginTop: '9px' }} >
                                                                        <div className="form-check form-switch form-switch-md mb-2">
                                                                            <Input type="checkbox" className="form-check-input"
                                                                                checked={values.IsSCM}
                                                                                name="IsSCM"
                                                                                onChange={(e) => {
                                                                                    setState((i) => {
                                                                                        const a = { ...i }
                                                                                        a.values.IsSCM = e.target.checked;
                                                                                        return a
                                                                                    })
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </FormGroup>
                                                        </Row>

                                                        <Row>
                                                            <FormGroup className="mb-2 col col-sm-5">
                                                                <Row className="justify-content-md-left">
                                                                    <Label htmlFor="horizontal-firstname-input" className="col-sm-3 col-form-label" >{fieldLabel.IsDivision} </Label>
                                                                    <Col md={2} style={{ marginTop: '9px' }} >
                                                                        <div className="form-check form-switch form-switch-md mb-3">
                                                                            <Input type="checkbox" className="form-check-input"
                                                                                checked={values.IsDivision}
                                                                                name="IsDivision"
                                                                                onChange={(e) => {
                                                                                    setState((i) => {
                                                                                        const a = { ...i }
                                                                                        a.values.IsDivision = e.target.checked;
                                                                                        return a
                                                                                    })
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </FormGroup>
                                                        </Row>

                                                        <FormGroup>
                                                            <Row>
                                                                <Col sm={2}>
                                                                    <SaveButton pageMode={pageMode}
                                                                        userAcc={userPageAccessState}
                                                                        editCreatedBy={editCreatedBy}
                                                                        module={"PartyType"}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </FormGroup >
                                                    </Row>

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
        )
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default PartyType



