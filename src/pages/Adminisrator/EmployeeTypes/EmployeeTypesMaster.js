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
    editEmployeeTypeSuccess,
    getEmployeeTypelist,
    PostEmployeeTypeSubmit,
    PostEmployeeTypeSubmitSuccess,
    updateEmployeeTypeID,
    updateEmployeeTypeIDSuccess
} from "../../../store/Administrator/EmployeeTypeRedux/action";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import {
    AlertState,
    commonPageField,
    commonPageFieldSuccess
} from "../../../store/actions";
import { Breadcrumb_inputName } from "../../../store/actions";
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
    loginUserID,
    loginCompanyID
} from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode";
import { CustomAlert } from "../../../CustomAlert/ConfirmDialog";

const EmployeeTypesMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const location = useLocation()
    const fileds = {
        id: "",
        Name: "",
        IsPartyConnection: false,
        IsSCM: false,
        IsSalesTeamMember: false
    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [modalCss, setModalCss] = useState(false);
    const [editCreatedBy, seteditCreatedBy] = useState("");
    console.log("userPageAccessState in Employee type", userPageAccessState)
    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg,
        updateMsg,
        pageField,
        userAccess, } = useSelector((state) => ({
            postMsg: state.EmployeeTypeReducer.PostEmployeeType,
            updateMsg: state.EmployeeTypeReducer.updateMessage,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));


    useEffect(() => {
        const page_Id = pageId.EMPLOYEETYPE
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
    }, []);


    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    // userAccess useEffect
    useEffect(() => {
       
        let userAcc = null;
        let locationPath;

        if (props.pageMode === mode.dropdownAdd) {
            locationPath = props.masterPath;
        } else {
            locationPath = location.pathname;
        }

        if (hasShowModal) {
            locationPath = props.masterPath;
        };

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (userAcc) {
            setUserAccState(userAcc);
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])


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
                const { id, Name, IsPartyConnection, IsSCM, IsSalesTeamMember } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }
                values.Name = Name;
                values.IsPartyConnection = IsPartyConnection;
                values.IsSCM = IsSCM;
                values.id = id
                values.IsSalesTeamMember = IsSalesTeamMember;

                hasValid.Name.valid = true;
                hasValid.IsSCM.valid = true;
                hasValid.IsPartyConnection.valid = true;
                hasValid.IsSalesTeamMember.valid = true;

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editEmployeeTypeSuccess({ Status: false }))
        }
    }, [])

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(PostEmployeeTypeSubmitSuccess({ Status: false }))
            dispatch(Breadcrumb_inputName(''))
            setState(() => resetFunction(fileds, state))// Clear form values  
            if (props.pageMode === mode.dropdownAdd) {
                CustomAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                // history.push({
                //     Data: postMsg.Data
                // })
                dispatch(getEmployeeTypelist())

                props.isOpenModal(false)
            }
            else if (pageMode === mode.edit) {
                CustomAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                history.push({ pathname: url.EMPLOYEETYPE_lIST })
            }
            else {
                dispatch(Breadcrumb_inputName(''))
                const promise = await CustomAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                if (promise) { history.push({ pathname: url.EMPLOYEETYPE_lIST }) }
            }

        } else if
            (postMsg.Status === true) {
            CustomAlert({
                Type: 3,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {

        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            setState(() => resetFunction(fileds, state))//Clear form values  
            history.push({
                pathname: url.EMPLOYEETYPE_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateEmployeeTypeIDSuccess({ Status: false }));
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

    const SaveHandler = async (event) => {
        event.preventDefault();
        const btnId = event.target.id
        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify({
                    Name: values.Name,
                    Company: loginCompanyID(),
                    IsSalesTeamMember: values.IsSalesTeamMember,
                    CreatedBy: loginUserID(),
                    CreatedOn: "2022-07-18T00:00:00",
                    UpdatedBy: loginUserID(),
                    UpdatedOn: "2022-07-18T00:00:00"
                });

                if (pageMode === mode.edit) {
                    dispatch(updateEmployeeTypeID({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    dispatch(PostEmployeeTypeSubmit({ jsonBody, btnId }));
                }

            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-20.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

                    <Container fluid>
                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black">
                                <form noValidate>
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
                                                                    <Label htmlFor="horizontal-firstname-input"
                                                                        className="col-sm-5 col-form-label" >{fieldLabel.IsSalesTeamMember} </Label>
                                                                    <Col md={2} style={{ marginTop: '9px' }} >
                                                                        <div className="form-check form-switch form-switch-md mb-3" >
                                                                            <Input type="checkbox" className="form-check-input"
                                                                                name="IsSalesTeamMember"
                                                                                checked={values.IsSalesTeamMember}
                                                                                onChange={(e) => {
                                                                                    setState((i) => {
                                                                                        const a = { ...i }
                                                                                        a.values.IsSalesTeamMember = e.target.checked;
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
                                                                        onClick={SaveHandler}
                                                                        userAcc={userPageAccessState}
                                                                        editCreatedBy={editCreatedBy}
                                                                        module={"EmployeeTypesMaster"}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
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

export default EmployeeTypesMaster
