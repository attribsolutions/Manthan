import React, { useState, useEffect } from "react";
import Select from "react-select";
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
    getState
} from "../../../store/Administrator/EmployeeRedux/action";
import { AlertState, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { Breadcrumb_inputName } from "../../../store/Utilites/Breadcrumb/actions";
import { MetaTags } from "react-meta-tags";
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
    loginUserID,
    metaTagLabel,
} from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { saveCityMaster, saveCityMaster_Success } from "../../../store/Administrator/CityRedux/action";
import { getDistrictOnState, getDistrictOnStateSuccess } from "../../../store/Administrator/PartyRedux/action";


const CityMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const fileds = {
        id: "",
        StateName: "",
        DistrictName: "",
        Name: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [modalCss, setModalCss] = useState(false);
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        State,
        district,
        postMsg,
        userAccess,
        pageField,
        saveBtnloading
    } = useSelector((state) => ({
        saveBtnloading: state.CityReducer.saveBtnloading,
        State: state.EmployeesReducer.State,
        district: state.PartyMasterReducer.DistrictOnState,
        postMsg: state.CityReducer.PostData,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    }));

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        dispatch(getDistrictOnStateSuccess([]))
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.CITY))
        dispatch(getState());
    }, [dispatch]);



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
                const { id, StateName, DistrictName, Name, State_id, District_id } = hasEditVal

                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.id.valid = id
                hasValid.Name.valid = true
                hasValid.StateName.valid = true;
                hasValid.DistrictName.valid = true;

                values.id = id;
                values.StateName = { label: StateName, value: State_id };
                values.DistrictName = { label: DistrictName, value: District_id };
                values.Name = Name
                dispatch(getDistrictOnState(State_id))
                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
        }
    }, [])



    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveCityMaster_Success({ Status: false }))
            dispatch(Breadcrumb_inputName(''))
            setState(() => resetFunction(fileds, state))// Clear form values  
            if (props.pageMode === mode.dropdownAdd) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                // dispatch(getPartyTypelist())
                props.isOpenModal(false)
            }
            else if (pageMode === mode.edit) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                // history.push({ pathname: url.CITY })  list page not desing
            }
            else {
                dispatch(Breadcrumb_inputName(''))
                const promise = await customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                if (promise) {
                    // history.push({ pathname: url.CITY })  list page not desing
                }
            }

        } else if
            (postMsg.Status === true) {
            dispatch(saveCityMaster_Success({ Status: false }))
            customAlert({
                Type: 3,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])



    useEffect(() => {

        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])


    const State_DropdownOptions = State.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const District_DropdownOptions = district.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function State_Dropdown_Handler(e) {
        dispatch(getDistrictOnState(e.value))
        setState((i) => {
            const a = { ...i }
            a.values.DistrictName = "";
            a.hasValid.DistrictName.valid = false
            return a
        })
    }

    const SaveHandler = (event) => {
        event.preventDefault();
        const btnId = event.target.id;
        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })
                const jsonBody = JSON.stringify({
                    Name: values.Name,
                    District: values.DistrictName.value,
                    Company: loginCompanyID(),
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID()
                });
                dispatch(saveCityMaster({ jsonBody, btnId }))
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
                    <Container fluid>

                        <Card className="text-black">
                            <CardHeader className="card-header   text-dark c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody>
                                <form noValidate>
                                    <Card  >
                                        <CardBody className="c_card_body">
                                            <Row>
                                                <FormGroup className="mb-2 col col-sm-3 ">
                                                    <Label htmlFor="validationCustom01"> {fieldLabel.StateName} </Label>
                                                    <Col sm={12}>
                                                        <Select
                                                            name="StateName"
                                                            id="state"
                                                            value={values.StateName}
                                                            isSearchable={true}
                                                            classNamePrefix="dropdown"
                                                            autoFocus={true}
                                                            options={State_DropdownOptions}
                                                            onChange={(hasSelect, evn) => {
                                                                onChangeSelect({ hasSelect, evn, state, setState, })
                                                                State_Dropdown_Handler(hasSelect)
                                                            }}
                                                        />
                                                        {isError.StateName.length > 0 && (
                                                            <span className="text-danger f-8"><small>{isError.StateName}</small></span>
                                                        )}
                                                    </Col>
                                                </FormGroup>
                                            </Row>

                                            <Row>
                                                <FormGroup className="mb-2 col col-sm-3 ">
                                                    <Label htmlFor="validationCustom01"> {fieldLabel.DistrictName} </Label>
                                                    <Col sm={12}>
                                                        <Select
                                                            name="DistrictName"
                                                            value={values.DistrictName}
                                                            isSearchable={true}
                                                            className="react-dropdown"
                                                            classNamePrefix="dropdown"
                                                            options={District_DropdownOptions}
                                                            onChange={(hasSelect, evn) => {
                                                                onChangeSelect({ hasSelect, evn, state, setState, })
                                                            }}
                                                        />
                                                        {isError.DistrictName.length > 0 && (
                                                            <span className="text-danger f-8"><small>{isError.DistrictName}</small></span>
                                                        )}
                                                    </Col>
                                                </FormGroup>
                                            </Row>

                                            <Row>
                                                <FormGroup className="mb-2 col col-sm-4 ">
                                                    <Label htmlFor="validationCustom01">City</Label>
                                                    <Col sm={9}>
                                                        <Input
                                                            name="Name"
                                                            id="txtName"
                                                            value={values.Name}
                                                            type="text"
                                                            className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
                                                            placeholder="Please Enter CityName"
                                                            autoComplete="off"
                                                            onChange={(event) => {
                                                                onChangeText({ event, state, setState })
                                                                dispatch(Breadcrumb_inputName(event.target.value))
                                                            }}
                                                        />
                                                        {isError.Name.length > 0 && (
                                                            <span className="invalid-feedback">{isError.Name}</span>
                                                        )}
                                                    </Col>
                                                </FormGroup>
                                            </Row>
                                        </CardBody>
                                    </Card>

                                    <FormGroup className="mt-3">
                                        <Row>
                                            <Col sm={2}>
                                                <SaveButton
                                                    loading={saveBtnloading}
                                                    pageMode={pageMode}
                                                    onClick={SaveHandler}
                                                    userAcc={userPageAccessState}
                                                    editCreatedBy={editCreatedBy}
                                                    module={"CityMaster"}
                                                />
                                            </Col>
                                        </Row>
                                    </FormGroup>
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
export default CityMaster;
