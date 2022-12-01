import React, { useEffect, useRef, useState, } from "react";
// import Breadcrumb from "../../../components/Common/Breadcrumb3";
import Breadcrumb from "../../../../components/Common/Breadcrumb3"
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
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
} from "reactstrap";
import classnames from "classnames"
import { MetaTags } from "react-meta-tags";
import Flatpickr from "react-flatpickr"
import { Breadcrumb_inputName, commonPageFieldSuccess, getBaseUnit_ForDropDown, getItemList } from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeDate,
    onChangeSelect,
    onChangeText,
} from "../../../../components/Common/CmponentRelatedCommonFile/validationFunction";
import {
    editGroupTypeIdSuccess,
    getGroupTypeslistSuccess,
    PostGroupTypeSubmit,
    PostGroupTypeSubmitSuccess,
    updateGroupTypeID,
    updateGroupTypeIDSuccess
} from "../../../../store/Administrator/GroupTypeRedux/action";
import Select from "react-select";
import ItemTab from "./ItemQuantityTab";
// import SaveButton from "../../../../components/Common/CommonSaveButton";

const BOMMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const formRef = useRef(null);
    const [EditData, setEditData] = useState({});
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [ItemQuantityDetails, setItemQuantityDetails] = useState([]);
    const [activeTab1, setactiveTab1] = useState("1")

    const initialFiled = {
        id: "",
        BOMDate: "",
        ItemName: "",
        EstimatedOutput: "",
        Unit: "",
        Comment: "",
        IsActive: false
    }

    const [state, setState] = useState(initialFiledFunc(initialFiled))

    const toggle1 = tab => {
        if (activeTab1 !== tab) {
            setactiveTab1(tab)
        }
    }
    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        Items,
        Unit
    } = useSelector((state) => ({
        postMsg: state.GroupTypeReducer.PostData,
        updateMsg: state.GroupTypeReducer.updateMessage,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        Items: state.ItemMastersReducer.pages,
        Unit: state.ItemMastersReducer.BaseUnit,
    }));

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(69))
        dispatch(getItemList())
        dispatch(getBaseUnit_ForDropDown());
    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty("editValue")

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
        };
    }, [userAccess])

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    // useEffect(() => {

    //     if ((hasShowloction || hasShowModal)) {

    //         let hasEditVal = null
    //         if (hasShowloction) {
    //             setPageMode(location.pageMode)
    //             hasEditVal = location.editValue
    //         }
    //         else if (hasShowModal) {
    //             hasEditVal = props.editValue
    //             setPageMode(props.pageMode)
    //             setModalCss(true)
    //         }

    //         if (hasEditVal) {
    //             setEditData(hasEditVal);
    //             const { id, Name, IsReserved } = hasEditVal
    //             const { values, fieldLabel, hasValid, required, isError } = { ...state }

    //             hasValid.Name.valid = true;
    //             hasValid.IsReserved.valid = true;

    //             values.id = id
    //             values.Name = Name;
    //             values.IsReserved = IsReserved;
    //             setState({ values, fieldLabel, hasValid, required, isError })
    //             dispatch(editGroupTypeIdSuccess({ Status: false }))
    //             dispatch(Breadcrumb_inputName(hasEditVal.GroupTypeMaster))
    //         }
    //     }
    // }, [])

    // useEffect(() => {
    //     if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
    //         dispatch(PostGroupTypeSubmitSuccess({ Status: false }))
    //         formRef.current.reset();
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
    //                 RedirectPath: GROUPTYPE_lIST,
    //             }))
    //         }
    //     }
    //     else if (postMsg.Status === true) {
    //         dispatch(getGroupTypeslistSuccess({ Status: false }))
    //         dispatch(AlertState({
    //             Type: 4,
    //             Status: true,
    //             Message: JSON.stringify(postMessage.Message),
    //             RedirectPath: false,
    //             AfterResponseAction: false
    //         }));
    //     }
    // }, [postMsg])

    // useEffect(() => {
    //     if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
    //         history.push({
    //             pathname: GROUPTYPE_lIST,
    //         })
    //     } else if (updateMsg.Status === true && !modalCss) {
    //         dispatch(updateGroupTypeIDSuccess({ Status: false }));
    //         dispatch(
    //             AlertState({
    //                 Type: 3,
    //                 Status: true,
    //                 Message: JSON.stringify(updateMsg.Message),
    //             })
    //         );
    //     }
    // }, [updateMsg, modalCss]);

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })// new change
        }
    }, [pageField])

    const ItemDropdown_Options = Items.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const Unit_DropdownOptions = Unit.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const formSubmitHandler = (event) => {

        event.preventDefault();
        if (formValid(state, setState)) {
            debugger
            const jsonBody = JSON.stringify({
                Name: values.Name,
                IsReserved: values.IsReserved,
                CreatedBy: 1,
                CreatedOn: "0002-10-03T12:48:14.910491",
                UpdatedBy: 1,
                UpdatedOn: "0002-10-03T12:48:14.910491"

            });

            if (pageMode === 'edit') {
                dispatch(updateGroupTypeID(jsonBody, EditData.id));
            }
            else {
                dispatch(PostGroupTypeSubmit(jsonBody));
            }
        }
    };


    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags>
                            <title>GroupTypeMaster | FoodERP-React FrontEnd</title>
                        </MetaTags>
                        <Breadcrumb pageHeading={userPageAccessState.PageHeading} />

                        {/* <Card className="text-black">
                            <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >

                                <form onSubmit={formSubmitHandler} ref={formRef} noValidate>

                                   

                                </form>
                            </CardBody>
                        </Card> */}

                        <Row>
                            <Col lg={12}>
                                <Card className="text-black" >
                                    <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                                        <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                        <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                                    </CardHeader>
                                    <CardBody>
                                        <Nav tabs className="nav-tabs-custom nav-justified">
                                            <NavItem>
                                                <NavLink
                                                    id="nave-link-1"
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: activeTab1 === "1",
                                                    })}
                                                    onClick={() => {
                                                        toggle1("1")
                                                    }}
                                                >
                                                    <span className="d-block d-sm-none">
                                                        <i className="fas fa-home"></i>
                                                    </span>
                                                    <span className="d-none d-sm-block">Items Details</span>
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    id="nave-link-2"
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: activeTab1 === "2",
                                                    })}
                                                    onClick={() => {
                                                        toggle1("2")
                                                    }}
                                                >
                                                    <span className="d-block d-sm-none">
                                                        <i className="fas fa-home"></i>
                                                    </span>
                                                    <span className="d-none d-sm-block">Material Details</span>

                                                </NavLink>
                                            </NavItem>

                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    <span className="d-block d-sm-none">
                                                        <i className="fas fa-home"></i>
                                                    </span>
                                                    <Row >
                                                        <Col sm={2}>
                                                            <div>
                                                                {
                                                                    pageMode === "edit" ?
                                                                        userPageAccessState.RoleAccess_IsEdit ?
                                                                            <button
                                                                                type="submit"
                                                                                data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Role"
                                                                                className="btn btn-success w-md"
                                                                            >
                                                                                <i class="fas fa-edit me-2"></i>Update
                                                                            </button>
                                                                            :
                                                                            <></>
                                                                        : (
                                                                            userPageAccessState.RoleAccess_IsSave ?
                                                                                <button
                                                                                    type="submit"
                                                                                    data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Role"
                                                                                    className="btn btn-primary w-md"
                                                                                > <i className="fas fa-save me-2"></i> Save
                                                                                </button>
                                                                                :
                                                                                <></>
                                                                        )
                                                                }
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </NavLink>
                                            </NavItem>
                                        </Nav>

                                        <TabContent activeTab={activeTab1} className="p-3 text-muted">
                                            <TabPane tabId="1">
                                                <Row>
                                                    
                                                   < Card className="text-black" style={{ backgroundColor: "whitesmoke" }} >
                                                   <Row className="mt-3 ">
                                                            <Row>
                                                                <FormGroup className="mb-2 col col-sm-4 ">
                                                                    <Label >{fieldLabel.BOMDate} </Label>
                                                                    <Flatpickr
                                                                        name="BOMDate"
                                                                        value={values.BOMDate}
                                                                        className="form-control d-block p-2 bg-white text-dark"
                                                                        placeholder="YYYY-MM-DD"
                                                                        autoComplete="0,''"
                                                                        options={{
                                                                            altInput: true,
                                                                            altFormat: "F j, Y",
                                                                            dateFormat: "Y-m-d",
                                                                            minDate: new Date().fp_incr("n"),
                                                                            maxDate: new Date().fp_incr(0) // 14 days from now"0,''"
                                                                        }}
                                                                        onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                                    />
                                                                    {isError.BOMDate.length > 0 && (
                                                                        <span className="invalid-feedback">{isError.BOMDate}</span>
                                                                    )}
                                                                </FormGroup>

                                                                <Col md="1"></Col>
                                                                <FormGroup className="mb-2 col col-sm-4 ">
                                                                    <Label >{fieldLabel.EstimatedOutput} </Label>
                                                                    <Input
                                                                        name="EstimatedOutput"
                                                                        value={values.EstimatedOutput}
                                                                        type="text"
                                                                        className={isError.EstimatedOutput.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                        placeholder="Please Enter EstimatedOutput"
                                                                        autoComplete='off'
                                                                        onChange={(event) => {
                                                                            onChangeText({ event, state, setState })
                                                                        }}
                                                                    />
                                                                    {isError.EstimatedOutput.length > 0 && (
                                                                        <span className="invalid-feedback">{isError.EstimatedOutput}</span>
                                                                    )}
                                                                </FormGroup>
                                                            </Row>

                                                            <Row>
                                                                <FormGroup className="mb-2 col col-sm-4 ">
                                                                    <Label> {fieldLabel.ItemName} </Label>
                                                                    <Col sm={12}>
                                                                        <Select
                                                                            name="ItemName"
                                                                            value={values.ItemName}
                                                                            isSearchable={true}
                                                                            className="react-dropdown"
                                                                            classNamePrefix="dropdown"
                                                                            options={ItemDropdown_Options}
                                                                            onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}

                                                                        />
                                                                        {isError.ItemName.length > 0 && (
                                                                            <span className="text-danger f-8"><small>{isError.ItemName}</small></span>
                                                                        )}
                                                                    </Col>
                                                                </FormGroup>

                                                                <Col md="1"></Col>
                                                                <FormGroup className="mb-2 col col-sm-4 ">
                                                                    <Label > {fieldLabel.Unit} </Label>
                                                                    <Col sm={12}>
                                                                        <Select
                                                                            name="Unit"
                                                                            value={values.Unit}
                                                                            isSearchable={true}
                                                                            className="react-dropdown"
                                                                            classNamePrefix="dropdown"
                                                                            options={Unit_DropdownOptions}
                                                                            onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}

                                                                        />
                                                                        {isError.Unit.length > 0 && (
                                                                            <span className="text-danger f-8"><small>{isError.Unit}</small></span>
                                                                        )}
                                                                    </Col>
                                                                </FormGroup>
                                                            </Row>

                                                            <Row>
                                                                <FormGroup className="mb-2 col col-sm-4 ">
                                                                    <Label >{fieldLabel.Comment} </Label>
                                                                    <Input
                                                                        name="Comment"
                                                                        value={values.Comment}
                                                                        type="text"
                                                                        className={isError.Comment.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                        placeholder="Please Enter EstimatedOutput"
                                                                        autoComplete='off'
                                                                        onChange={(event) => {
                                                                            onChangeText({ event, state, setState })
                                                                        }}
                                                                    />
                                                                    {isError.Comment.length > 0 && (
                                                                        <span className="invalid-feedback">{isError.Comment}</span>
                                                                    )}
                                                                </FormGroup>

                                                                <Col md="1"></Col>
                                                                <FormGroup className="mb-2 col col-sm-3 mt-4">
                                                                    <Row className="justify-content-md-left">
                                                                        <Label className="col-sm-6 col-form-label" >{fieldLabel.IsActive}</Label>
                                                                        <Col md={4} style={{ marginTop: '10px' }} >

                                                                            <div className="form-check form-switch form-switch-md mb-3" >
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

                                                            {/* <FormGroup>
                                                                <Row>
                                                                    <Col sm={2}>
                                                                        <SaveButton pageMode={pageMode} userAcc={userPageAccessState}
                                                                            module={"GroupTypeMaster"}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </FormGroup > */}

                                                        </Row>
                                                    </Card>
                                                </Row>
                                            </TabPane>

                                            <TabPane tabId="2">
                                                <Row>
                                                    <Col md={12}  >
                                                        <Row className="mt-3">
                                                            <Col className=" col col-11 ">
                                                                    <ItemTab tableData={ItemQuantityDetails} func={setItemQuantityDetails} />
                                                                </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </TabPane>


                                        </TabContent>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
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

export default BOMMaster
