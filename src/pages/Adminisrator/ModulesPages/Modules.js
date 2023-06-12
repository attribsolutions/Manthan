import React, { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Label,
    CardHeader,
    FormGroup,
    Input,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
    saveModuleMaster,
    updateModuleID,
    saveModuleMasterSuccess,
    editModuleIDSuccess,
    updateModuleIDSuccess,
    getModuleList,
} from "../../../store/Administrator/ModulesRedux/actions";
import { MetaTags } from "react-meta-tags";
import {
    AlertState,
    commonPageField,
    commonPageFieldSuccess
} from "../../../store/actions";
import { Breadcrumb_inputName } from "../../../store/Utilites/Breadcrumb/actions";
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
    loginUserID,
    btnIsDissablefunc,
    metaTagLabel
} from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import { customAlert } from "../../../CustomAlert/ConfirmDialog";

const Modules = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const fileds = {
        id: "",
        Name: "",
        DisplayIndex: "",
        Icon: "",
        isActive: true,
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg,
        pageField,
        userAccess,
        saveBtnloading,
        updateMsg } = useSelector((state) => ({
            saveBtnloading: state.Modules.saveBtnloading,
            postMsg: state.Modules.modulesSubmitSuccesss,
            updateMsg: state.Modules.updateMessage,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {
        const page_Id = pageId.MODULE
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
            if (!props.isdropdown) {
                breadcrumbReturnFunc({ dispatch, userAcc });
            }
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

                const { id, Name, DisplayIndex, isActive, Icon } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.Name.valid = true;
                hasValid.DisplayIndex.valid = true;
                hasValid.isActive.valid = true;
                hasValid.Icon.valid = true;

                values.Name = Name;
                values.DisplayIndex = DisplayIndex;
                values.isActive = isActive;
                values.Icon = Icon;
                values.id = id
                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Modules))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editModuleIDSuccess({ Status: false }))
        }
    }, [])

    // This UseEffect clear Form Data and when modules Save Successfully.
    // useEffect(() => {

    //     if ((postMsg.Status === true) && (postMsg.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
    //         dispatch(saveModuleMasterSuccess({ Status: false }))
    //         setState(() => resetFunction(fileds, state)) // Clear form values 
    //         dispatch(Breadcrumb_inputName(''))

    //         if (pageMode === "dropdownAdd") {
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
    //                 RedirectPath: url.MODULE_lIST,
    //             }))
    //         }
    //     } else if ((postMsg.Status === true) && !(pageMode === "dropdownAdd")) {
    //         dispatch(saveModuleMasterSuccess({ Status: false }))
    //         dispatch(AlertState({
    //             Type: 4,
    //             Status: true,
    //             Message: JSON.stringify(postMsg.Message),
    //             RedirectPath: false,
    //             AfterResponseAction: false
    //         }));
    //     }
    // }, [postMsg])

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveModuleMasterSuccess({ Status: false }))
            dispatch(Breadcrumb_inputName(''))
            setState(() => resetFunction(fileds, state))// Clear form values  
            if (props.pageMode === mode.dropdownAdd) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                // history.push({
                //     Data: postMsg.Data
                // })
                dispatch(getModuleList())

                props.isOpenModal(false)
            }
            else if (pageMode === mode.edit) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                history.push({ pathname: url.MODULE_lIST })
            }
            else {
                dispatch(Breadcrumb_inputName(''))
                const promise = await customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                if (promise) { history.push({ pathname: url.MODULE_lIST }) }
            }

        } else if
            (postMsg.Status === true) {
            customAlert({
                Type: 3,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])


    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            setState(() => resetFunction(fileds, state)) // Clear form values 
            history.push({
                pathname: url.MODULE_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateModuleIDSuccess({ Status: false }));
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
                    DisplayIndex: values.DisplayIndex,
                    isActive: values.isActive,
                    Icon: values.Icon,
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID(),
                });

                if (pageMode === mode.edit) {
                    dispatch(updateModuleID({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    dispatch(saveModuleMaster({ jsonBody, btnId }));
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
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
                    <Container fluid >

                        <Card className="text-black" >
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>
                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form noValidate>

                                    <Row className="">
                                        <Col md={12}  >
                                            <Card >
                                                <CardBody className="c_card_body">
                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 " >
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
                                                    </Row>

                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.DisplayIndex} </Label>
                                                            <Input name="DisplayIndex" autoComplete='off'
                                                                placeholder="Please Enter DisplayIndex"
                                                                value={values.DisplayIndex}
                                                                type="text"
                                                                className={isError.DisplayIndex.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                onChange={(event) => {
                                                                    onChangeText({ event, state, setState })
                                                                    dispatch(Breadcrumb_inputName(event.target.value))
                                                                }}
                                                            />
                                                            {isError.DisplayIndex.length > 0 && (
                                                                <span className="invalid-feedback">{isError.DisplayIndex}</span>
                                                            )}
                                                        </FormGroup>
                                                    </Row>

                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 " >
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Icon} </Label>
                                                            <Input name="Icon"
                                                                autoComplete='off'
                                                                placeholder="Please Enter IconPath"
                                                                value={values.Icon}
                                                                type="text"
                                                                className={isError.Icon.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                onChange={(event) => {
                                                                    onChangeText({ event, state, setState })
                                                                    dispatch(Breadcrumb_inputName(event.target.value))
                                                                }}
                                                            />
                                                            {isError.Icon.length > 0 && (
                                                                <span className="invalid-feedback">{isError.Icon}</span>
                                                            )}
                                                        </FormGroup>
                                                    </Row>

                                                    <FormGroup className="mb-2 col col-sm-5">
                                                        <Row className="justify-content-md-left">
                                                            <Label htmlFor="horizontal-firstname-input" className="col-sm-3 col-form-label" >{fieldLabel.isActive}  </Label>
                                                            <Col md={2} style={{ marginTop: '9px' }} >
                                                                <div className="form-check form-switch form-switch-md mb-3">
                                                                    <Input type="checkbox" className="form-check-input"
                                                                        checked={values.isActive}
                                                                        name="isActive"
                                                                        onChange={(e) => {
                                                                            setState((i) => {
                                                                                const a = { ...i }
                                                                                a.values.isActive = e.target.checked;
                                                                                return a
                                                                            })
                                                                        }}
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>

                                                    <FormGroup >
                                                        <Row >
                                                            <Col sm={2}>
                                                                <SaveButton pageMode={pageMode}
                                                                    loading={saveBtnloading}
                                                                    onClick={SaveHandler}
                                                                    userAcc={userPageAccessState}
                                                                    editCreatedBy={editCreatedBy}
                                                                    module={"Modules"}
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
        )
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};
export default Modules
