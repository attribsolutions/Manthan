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
    Spinner
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { Breadcrumb_inputName, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeText,
    resetFunction,

} from "../../../components/Common/validationFunction";

import { SaveButton } from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    btnIsDissablefunc,
    metaTagLabel,
    loginPartyID,

} from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { editSchemeTypeIDSuccess, saveSchemeType, saveSchemeTypeSuccess, updateSchemeTypeID, updateSchemeTypeIDSuccess,  } from "../../../store/Administrator/SchemeRedux/action";


const SchemeType = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const fileds = {
        SchemeTypeName: "",
        UsageTime: "",
        UsageType: "",
        BillEffect: false, // This tracks the checkbox
        IsQRApplicable:false,
    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [EditData, setEditData] = useState({});
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [editCreatedBy, seteditCreatedBy] = useState("");

    const [vailidity, setvailidity] = useState();




    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        saveBtnloading,
        SchemeTypeValidityData,
        SchemeTypeLoading
    } = useSelector((state) => ({
        saveBtnloading: state.SchemeTypeReducer.saveBtnloading,
        postMsg: state.SchemeTypeReducer.PostData,

        SchemeTypeValidityData: state.SchemeTypeReducer.SchemeTypeValidityData,
        SchemeTypeLoading: state.SchemeTypeReducer.SchemeTypeLoading,

        updateMsg: state.SchemeTypeReducer.updateMessage,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    }));




    useEffect(() => {
        const page_Id = pageId.SCHEME_TYPE
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        return () => {


            dispatch(saveSchemeTypeSuccess({ Status: false }))

        }
    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const [UsageTime, setUsageTime] = useState(""); // "multiple" | "single"
    const [UsageType, setUsageType] = useState(""); // "online" | "offline"


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

    useEffect(() => {

        if (SchemeTypeValidityData?.StatusCode === 200 && SchemeTypeValidityData?.Status === true) {
            customAlert({
                Type: 1,
                Message: SchemeTypeValidityData.Message,
            })
        } else if (SchemeTypeValidityData?.Status === false && [404, 400, 204].includes(SchemeTypeValidityData?.StatusCode)) {
            customAlert({
                Type: 9,
                Message: SchemeTypeValidityData.Message,
            })
        }
    }, [SchemeTypeValidityData])


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
                const {id, SchemeTypeName, UsageTime, UsageType, BillEffect,IsQRApplicable } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

            
                hasValid.SchemeTypeName.valid = true;
                hasValid.UsageTime.valid = true;
                hasValid.UsageType.valid = true;
                hasValid.BillEffect.valid = true;
                hasValid.IsQRApplicable.valid = true;

                values.id = id;
                values.SchemeTypeName = SchemeTypeName;
                values.UsageTime = UsageTime;
                values.UsageType = UsageType;
                values.BillEffect = BillEffect;
                values.IsQRApplicable = IsQRApplicable;

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(editSchemeTypeIDSuccess({ Status: false }))
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
        }
    }, [])

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveSchemeTypeSuccess({ Status: false }))
            dispatch(Breadcrumb_inputName(''))
            setState(() => resetFunction(fileds, state))// Clear form values  
            if (props.pageMode === mode.dropdownAdd) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })

            }
            else if (pageMode === mode.edit) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                history.push({ pathname: url.SCHEME_TYPE_LIST })
            }
            else {
                dispatch(Breadcrumb_inputName(''))
                const promise = await customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                if (promise) { history.push({ pathname: url.SCHEME_TYPE_LIST }) }
            }

        } else if
            (postMsg.Status === false && [404, 400, 204].includes(postMsg.StatusCode)) {

            customAlert({
                Type: 9,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {

        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            setState(() => resetFunction(fileds, state))//Clear form values
            history.push({
                pathname: url.SCHEME_TYPE,
            })

        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateSchemeTypeIDSuccess({ Status: false }));
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
                    SchemeTypeName: values.SchemeTypeName,
                    UsageTime: values.UsageTime,
                    UsageType: values.UsageType,
                    BillEffect: values.BillEffect,
                    IsQRApplicable: values.IsQRApplicable,
                    Party: loginPartyID(),

                });

                if (pageMode === mode.edit) {

                    dispatch(updateSchemeTypeID({ jsonBody, updateId: values.id, btnId }));
                }
               
                else {
                    dispatch(saveSchemeType({ jsonBody, btnId }));
                }

            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };


    // Group 1: Online / Offline


    const handleChangeOnOf = (value) => {
        setUsageType(prev => (prev === value ? "" : value));
    };

    // Group 2: Multiple / Single


    const handleModeChange = (value) => {
        setUsageTime(prev => (prev === value ? "" : value));
    };

    // const handleUsageTypeChange = (type) => {
    //     setState(prev => ({
    //         ...prev,
    //         values: {
    //             ...prev.values,
    //             UsageType: type
    //         }
    //     }));
    // };




    // var IsEditMode_Css = ''
    // if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" >
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
                                        <CardBody className="c_card_body ">
                                            <Row>
                                                <Col sm={12} >
                                                   
                                                    <FormGroup className="mb-2 ">
                                                        <Row>
                                                            <Col sm={2}>
                                                            <Label htmlFor="validationCustom01" className="me-2">{fieldLabel.SchemeTypeName}</Label>
                                                            </Col>
                                                            <Col sm={6}>
                                                                <Input
                                                                    name="SchemeTypeName"
                                                                    type="text"
                                                                    value={values.SchemeTypeName}
                                                                    placeholder="Scheme Type Name"
                                                                    style={{ marginRight: "34px" }}
                                                                    autoComplete="off"
                                                                    onChange={(event) => {
                                                                        onChangeText({ event, state, setState });
                                                                        dispatch(Breadcrumb_inputName(event.target.value));
                                                                    }}
                                                                />


                                                            </Col>

                                                        </Row>

                                                    </FormGroup>



                                                    <Row>
                                                        <Col sm={4}>
                                                            <FormGroup className="mb-3 me-3">
                                                                <Row>
                                                                    <Col sm={6}>
                                                                        <Label htmlFor="validationCustom01" className="mt-4 me-2">{fieldLabel.UsageTime}</Label>
                                                                    </Col>
                                                                    <Col className="mt-3 ms-2" sm={5}>
                                                                        <div className="btn-group mt-1" role="group" aria-label="Basic checkbox toggle button group">

                                                                            <input
                                                                                type="checkbox"
                                                                                id="btncheckMultiple"
                                                                                className="btn-check"
                                                                                autoComplete="off"
                                                                                checked={values.UsageTime === "multiple"}
                                                                                onChange={() =>
                                                                                    setState(prev => ({
                                                                                        ...prev,
                                                                                        values: {
                                                                                            ...prev.values,
                                                                                            UsageTime: "multiple"
                                                                                        }
                                                                                    }))
                                                                                }
                                                                            />
                                                                            <label
                                                                                className={`btn btn-outline-secondary ${values.UsageTime === "multiple" ? "active" : ""}`}
                                                                                htmlFor="btncheckMultiple"
                                                                            >
                                                                                Multiple
                                                                            </label>

                                                                            <input
                                                                                type="checkbox"
                                                                                id="btncheckSingle"
                                                                                className="btn-check"
                                                                                autoComplete="off"
                                                                                checked={values.UsageTime === "single"}
                                                                                onChange={() =>
                                                                                    setState(prev => ({
                                                                                        ...prev,
                                                                                        values: {
                                                                                            ...prev.values,
                                                                                            UsageTime: "single"
                                                                                        }
                                                                                    }))
                                                                                }
                                                                            />
                                                                            <label
                                                                                className={`btn btn-outline-secondary ${values.UsageTime === "single" ? "active" : ""}`}
                                                                                htmlFor="btncheckSingle"
                                                                            >
                                                                                Single
                                                                            </label>

                                                                        </div>
                                                                    </Col>
                                                                </Row>

                                                            </FormGroup>
                                                        </Col>
                                                        {/* </Row> */}

                                                        <Col sm={8}>
                                                            <FormGroup className=" ">
                                                                <Row>
                                                                    <Col sm={4}>
                                                                        <Label htmlFor="validationCustom01" className="mt-4 ms-5">{fieldLabel.UsageType}</Label>
                                                                    </Col>
                                                                    <Col sm={8}>
                                                                        <div className="btn-group mt-3 ms-2 " role="group" aria-label="Basic checkbox toggle button group">

                                                                            <input
                                                                                type="checkbox"
                                                                                id="btncheckOnline"
                                                                                className="btn-check"
                                                                                autoComplete="off"
                                                                                checked={values.UsageType === "online"}
                                                                                onChange={() =>
                                                                                    setState(prev => ({
                                                                                        ...prev,
                                                                                        values: {
                                                                                            ...prev.values,
                                                                                            UsageType: "online"
                                                                                        }
                                                                                    }))
                                                                                }
                                                                            />
                                                                            <label
                                                                                className={`btn btn-outline-secondary ${values.UsageType === "online" ? "active" : ""}`}
                                                                                htmlFor="btncheckOnline"
                                                                            >
                                                                                Online
                                                                            </label>

                                                                            <input
                                                                                type="checkbox"
                                                                                id="btncheckOffline"
                                                                                className="btn-check"
                                                                                autoComplete="off"
                                                                                checked={values.UsageType === "offline"}
                                                                                onChange={() =>
                                                                                    setState(prev => ({
                                                                                        ...prev,
                                                                                        values: {
                                                                                            ...prev.values,
                                                                                            UsageType: "offline"
                                                                                        }
                                                                                    }))
                                                                                }
                                                                            />
                                                                            <label
                                                                                className={`btn btn-outline-secondary ${values.UsageType === "offline" ? "active" : ""}`}
                                                                                htmlFor="btncheckOffline"
                                                                            >
                                                                                Offline
                                                                            </label>

                                                                        </div>
                                                                    </Col>
                                                                </Row>

                                                            </FormGroup>
                                                        </Col>



                                                    </Row>

                                                    <Row className="mt-3">
                                                        <Col sm={4}>
                                                            <FormGroup >
                                                                <Row>
                                                                    <Col sm={5}>
                                                                        <Label htmlFor="validationCustom01">{fieldLabel.BillEffect}</Label>
                                                                    </Col>
                                                                    <Col sm={7}>
                                                                        <Input
                                                                            style={{ marginLeft: "53px" }}
                                                                            type="checkbox"
                                                                            className="p-2"
                                                                            checked={values.BillEffect}
                                                                            onChange={(e) => {
                                                                                setState(prev => ({
                                                                                    ...prev,
                                                                                    values: {
                                                                                        ...prev.values,
                                                                                        BillEffect: e.target.checked
                                                                                    }
                                                                                }));
                                                                            }}
                                                                        />

                                                                    </Col>
                                                                </Row>
                                                            </FormGroup>
                                                        </Col>
                                                        {/* </Row> */}

                                                        <Col sm={8}>
                                                            <FormGroup className="mb-3 ms-5">
                                                                <Row>
                                                                    <Col sm={3}>
                                                                        <Label htmlFor="validationCustom01">{fieldLabel.IsQRApplicable}</Label>
                                                                    </Col>
                                                                    <Col sm={9}>
                                                                        <Input
                                                                            style={{ marginLeft: "53px" }}
                                                                            type="checkbox"
                                                                            className="p-2"
                                                                            checked={values.IsQRApplicable} // Bind to state
                                                                            onChange={(e) => {
                                                                                setState(prev => ({
                                                                                    ...prev,
                                                                                    values: {
                                                                                        ...prev.values,
                                                                                        IsQRApplicable: e.target.checked // Update state with true/false
                                                                                    }
                                                                                }));
                                                                            }}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </FormGroup>
                                                        </Col>



                                                    </Row>

                                                </Col>


                                            </Row>


                                            <FormGroup>
                                                <Row>
                                                    <Col sm={2}>
                                                        <SaveButton 
                                                        pageMode={pageMode}
                                                            loading={saveBtnloading}
                        
                                                            onClick={SaveHandler}
                                                            userAcc={userPageAccessState}
                                                            editCreatedBy={editCreatedBy}
                                                            module={"Scheme Type"}
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

export default SchemeType
