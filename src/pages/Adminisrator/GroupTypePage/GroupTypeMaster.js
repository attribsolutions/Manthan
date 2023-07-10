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
import { Breadcrumb_inputName, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import {  commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeText,
    resetFunction
} from "../../../components/Common/validationFunction";
import {
    editGroupTypeIDSuccess,
    getGroupTypeslist,
    saveGroupTypeMaster,
    saveGroupTypeMasterSuccess,
    updateGroupTypeID,
    updateGroupTypeIDSuccess
} from "../../../store/Administrator/GroupTypeRedux/action";
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

const GroupTypeMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const fileds = {
        id: "",
        Name: "",
        IsReserved: false,
        Sequence: ''
    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [EditData, setEditData] = useState({});
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        saveBtnloading,
    } = useSelector((state) => ({
        saveBtnloading: state.GroupTypeReducer.saveBtnloading,
        postMsg: state.GroupTypeReducer.PostData,
        updateMsg: state.GroupTypeReducer.updateMessage,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    }));

    useEffect(() => {
        const page_Id = pageId.GROUPTYPE
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
    }, []);

    const location = { ...history.location }
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
                setEditData(hasEditVal);
                const { id, Name, IsReserved,Sequence } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.Name.valid = true;
                hasValid.IsReserved.valid = true;
                hasValid.Sequence.valid=true;

                values.id = id
                values.Name = Name;
                values.IsReserved = IsReserved;
                values.Sequence=Sequence;
                
                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(editGroupTypeIDSuccess({ Status: false }))
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
        }
    }, [])

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveGroupTypeMasterSuccess({ Status: false }))
            dispatch(Breadcrumb_inputName(''))
            setState(() => resetFunction(fileds, state))// Clear form values  
            if (props.pageMode === mode.dropdownAdd) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })

                dispatch(getGroupTypeslist())

                props.isOpenModal(false)
            }
            else if (pageMode === mode.edit) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                history.push({ pathname: url.GROUPTYPE_lIST })
            }
            else {
                dispatch(Breadcrumb_inputName(''))
                const promise = await customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                if (promise) { history.push({ pathname: url.GROUPTYPE_lIST }) }
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
            setState(() => resetFunction(fileds, state))//Clear form values
            history.push({
                pathname: url.GROUPTYPE_lIST,
            })

        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateGroupTypeIDSuccess({ Status: false }));
            dispatch(
                customAlert({
                    Type: 3,
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
                    IsReserved: values.IsReserved,
                    Sequence:values.Sequence,
                    CreatedBy: loginUserID(),
                    CreatedOn: "0002-10-03T12:48:14.910491",
                    UpdatedBy: loginUserID(),
                    UpdatedOn: "0002-10-03T12:48:14.910491"
                });

                if (pageMode === mode.edit) {
                    dispatch(updateGroupTypeID({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    dispatch(saveGroupTypeMaster({ jsonBody, btnId }));
                }

            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };

    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black"  >
                                <form noValidate>
                                    <Card>
                                        <CardBody className="c_card_body">
                                            <Row>
                                                <FormGroup className="mb-2 col col-sm-4 ">
                                                    <Label htmlFor="validationCustom01">{fieldLabel.Name} </Label>
                                                    <Input
                                                        id="txtName"
                                                        name="Name"
                                                        type="text"
                                                        value={values.Name}
                                                        className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
                                                        placeholder="Please Enter Name"
                                                        autoFocus={true}
                                                        autoComplete='off'
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
                                                    <Label htmlFor="validationCustom01">{fieldLabel.Sequence} </Label>
                                                    <Input
                                                        name="Sequence"
                                                        id="txtSequence"
                                                        value={values.Sequence}
                                                        type="text"
                                                        className={isError.Sequence.length > 0 ? "is-invalid form-control" : "form-control"}
                                                        placeholder="Please Enter Sequence"
                                                        autoComplete='off'
                                                        onChange={(event) => {
                                                            onChangeText({ event, state, setState })
                                                        }}
                                                    />
                                                    {isError.Sequence.length > 0 && (
                                                        <span className="invalid-feedback">{isError.Sequence}</span>
                                                    )}
                                                </FormGroup>
                                            </Row>

                                            <Row>
                                                <FormGroup className="mb-2 col col-sm-3">
                                                    <Row className="justify-content-md-left">
                                                        <Label className="col-sm-6 col-form-label" >{fieldLabel.IsReserved}</Label>
                                                        <Col md={2} style={{ marginTop: '9px' }} >
                                                            <div className="form-check form-switch form-switch-md mb-3" >
                                                                <Input type="checkbox" className="form-check-input"
                                                                    checked={values.IsReserved}
                                                                    name="IsReserved"
                                                                    onChange={(e) => {
                                                                        setState((i) => {
                                                                            const a = { ...i }
                                                                            a.values.IsReserved = e.target.checked;
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
                                                            loading={saveBtnloading}
                                                            onClick={SaveHandler}
                                                            userAcc={userPageAccessState}
                                                            editCreatedBy={editCreatedBy}
                                                            module={"GroupTypeMaster"}
                                                        />
                                                    </Col>
                                                </Row>
                                            </FormGroup >

                                        </CardBody>
                                    </Card>
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

export default GroupTypeMaster
