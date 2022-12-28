import React, { useEffect, useState, } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb3";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Label,
    Row,
    Table,
    Button,
    Input,
} from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import {
    Breadcrumb_inputName,
    commonPageField,
    commonPageFieldSuccess
} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { Tbody, Thead } from "react-super-responsive-table";
import { AlertState } from "../../../store/actions";
import {
    PostMethodForVehicleMaster,
    getMethodForVehicleList,
    getMethod_DriverList_ForDropDown,
    getMethod_VehicleTypes_ForDropDown,
    PostMethod_ForVehicleMasterSuccess,
    getMethod_ForVehicleListSuccess,
    editVehicleTypeSuccess,
    updateVehicleTypeID,
    updateVehicleTypeIDSuccess
} from "../../../store/Administrator/VehicleRedux/action";
import { get_Division_ForDropDown, } from "../../../store/Administrator/ItemsRedux/action";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    onChangeText,
    resetFunction
} from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import { SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import { createdBy, saveDissable } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import * as pageId from "../../../routes/allPageID";
import * as url from "../../../routes/route_url";

const VehicleMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const fileds = {
        id: "",
        VehicleNumber: "",
        Description: "",
        Driver: "",
        VehicleType: "",
        VehicleDivisions: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [divisionData, setDivisionData] = useState([]);
    const [divisionType_dropdown_Select, setDivisionType_dropdown_Select] = useState("");
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        Divisions,
        VehicleTypes,
        pageField,
        DriverList_redux,
        userAccess } = useSelector((state) => ({
            postMsg: state.VehicleReducer.postMsg,
            updateMsg: state.VehicleReducer.updateMsg,
            VehicleList: state.VehicleReducer.VehicleList,
            Divisions: state.ItemMastersReducer.Division,
            VehicleTypes: state.VehicleReducer.VehicleTypes,
            DriverList_redux: state.VehicleReducer.DriverList,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {
        const page_Id = pageId.VEHICLE
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getMethodForVehicleList());
        dispatch(getMethod_DriverList_ForDropDown());
        dispatch(getMethod_VehicleTypes_ForDropDown());
        dispatch(get_Division_ForDropDown());
    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty("editValue")

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

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


    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time
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

                const divisionTable = hasEditVal.VehicleDivisions.map((data) => ({
                    value: data.Division,
                    label: data.DivisionName
                }))

                const { id, VehicleNumber, Description, Driver, DriverName, VehicleType, VehicleTypeName, VehicleDivisions, } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.VehicleNumber.valid = true;
                hasValid.Driver.valid = true;
                hasValid.Description.valid = true;
                hasValid.VehicleType.valid = true;
                hasValid.VehicleDivisions.valid = true;


                values.id = id
                values.VehicleNumber = VehicleNumber
                values.Description = Description
                values.Driver = { label: DriverName, value: Driver };
                values.VehicleType = { label: VehicleTypeName, value: VehicleType };
                values.VehicleDivisions = divisionTable

                setDivisionData(divisionTable)
                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.RoleMaster))
                dispatch(editVehicleTypeSuccess({ Status: false }))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
        }
    }, []);

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(PostMethod_ForVehicleMasterSuccess({ Status: false }))
            setState(() => resetFunction(fileds, state))// Clear form values  
            saveDissable(false);//save Button Is enable function
            dispatch(Breadcrumb_inputName(''))

            if (pageMode === "dropdownAdd") {
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
                    RedirectPath: url.VEHICLE_lIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            saveDissable(false);//save Button Is enable function
            dispatch(getMethod_ForVehicleListSuccess({ Status: false }))
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
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            saveDissable(false);//Update Button Is enable function
            setState(() => resetFunction(fileds, state))// Clear form values 
            history.push({
                pathname: url.VEHICLE_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            saveDissable(false);//Update Button Is enable function
            dispatch(updateVehicleTypeIDSuccess({ Status: false }));
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

    const DivisionType_DropdownOptions = Divisions.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const DriverList_DropdownOptions = DriverList_redux.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const VehicleType_DropdownOptions = VehicleTypes.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function DivisionType_DropDown_handller(e) {
        setDivisionType_dropdown_Select(e)
    }

    // For Delete Button in table
    function UserRoles_DeleteButton_Handller(tableValue) {
        setDivisionData(divisionData.filter(
            (item) => !(item.value === tableValue)
        )
        )
    }
    function AddDivisionHandler() {
        const find = divisionData.find((element) => {
            return element.value === divisionType_dropdown_Select.value
        });

        if (divisionType_dropdown_Select.length <= 0) {
            dispatch(AlertState({
                Type: 3, Status: true,
                Message: "Select One Role",
            }));
        }
        else if (find === undefined) {
            setDivisionData([...divisionData, divisionType_dropdown_Select]);
        }
        else {
            dispatch(AlertState({
                Type: 4, Status: true,
                Message: "DivisionType already Exists ",
            }));
        }
    }

    // For Delete Button in table
    function UserRoles_DeleteButton_Handller(tableValue) {
        setDivisionData(divisionData.filter(
            (item) => !(item.value === tableValue)
        )
        )
    }

    const SaveHandler = (event) => {
        event.preventDefault();
        const leng = divisionData.length
        if (leng === 0) {
            dispatch(AlertState({
                Type: 3, Status: true,
                Message: "Select Atleast One Division..!",
            }));
            return
        }
        if (formValid(state, setState)) {
            var division = divisionData.map(i => ({ Division: i.value }))
            const jsonBody = JSON.stringify({
                VehicleNumber: values.VehicleNumber,
                Description: values.Description,
                Driver: values.Driver.value,
                VehicleType: values.VehicleType.value,
                VehicleDivisions: division,
                CreatedBy: createdBy(),
                UpdatedBy: createdBy()
            });

            saveDissable(true);//save Button Is dissable function

            if (pageMode === 'edit') {
                dispatch(updateVehicleTypeID(jsonBody, values.id));
            }
            else {
                dispatch(PostMethodForVehicleMaster(jsonBody));
            }
        }
    };


    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags>
                            <title>{userPageAccessState.PageHeading}  | FoodERP-React FrontEnd</title>
                        </MetaTags>
                        <Breadcrumb pageHeading={userPageAccessState.PageHeading} />

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form onSubmit={SaveHandler} noValidate>
                                    <Row className="">
                                        <Col md={12}>
                                            <Card>
                                                <CardBody className="c_card_body">
                                                    <Row className="mt-1">
                                                        <Col md="3">
                                                            <FormGroup className="mb-3">
                                                                <Label htmlFor="validationCustom01">{fieldLabel.Driver} </Label>
                                                                <Col sm={12}>
                                                                    <Select
                                                                        id="DriverDropDown "
                                                                        name="Driver"
                                                                        value={values.Driver}
                                                                        isSearchable={false}
                                                                        className="react-dropdown"
                                                                        classNamePrefix="dropdown"
                                                                        options={DriverList_DropdownOptions}
                                                                        onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                                                    />
                                                                    {isError.Driver.length > 0 && (
                                                                        <span className="text-danger f-8"><small>{isError.Driver}</small></span>
                                                                    )}
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md="1" className="mx-n1">  </Col>
                                                        <Col md="3">
                                                            <FormGroup className="mb-3">
                                                                <Label htmlFor="validationCustom01"> {fieldLabel.VehicleType}</Label>
                                                                <Col sm={12}>
                                                                    <Select
                                                                        id="VehicleDropDown "
                                                                        name="VehicleType"
                                                                        value={values.VehicleType}
                                                                        isSearchable={false}
                                                                        className="react-dropdown"
                                                                        classNamePrefix="dropdown"
                                                                        options={VehicleType_DropdownOptions}
                                                                        onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                                                    />
                                                                    {isError.VehicleType.length > 0 && (
                                                                        <span className="text-danger f-8"><small>{isError.VehicleType}</small></span>
                                                                    )}
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>

                                                        <Row>
                                                            <Col md="4">
                                                                <FormGroup className="mb-2 col col-sm-9 ">
                                                                    <Label htmlFor="validationCustom01">{fieldLabel.VehicleNumber} </Label>
                                                                    <Input
                                                                        name="VehicleNumber"
                                                                        id="VehicleNumber"
                                                                        value={values.VehicleNumber}
                                                                        type="text"
                                                                        className={isError.VehicleNumber.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                        placeholder="Please Enter VehicleNumber"
                                                                        autoComplete='off'
                                                                        onChange={(event) => {
                                                                            onChangeText({ event, state, setState })
                                                                            dispatch(Breadcrumb_inputName(event.target.value))
                                                                        }}
                                                                    />
                                                                    {isError.VehicleNumber.length > 0 && (
                                                                        <span className="invalid-feedback">{isError.VehicleNumber}</span>
                                                                    )}
                                                                </FormGroup>
                                                            </Col>

                                                            <Col md="3">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01"> {fieldLabel.Description} </Label>
                                                                    <Input
                                                                        name="Description"
                                                                        id="Description"
                                                                        value={values.Description}
                                                                        type="text"
                                                                        className={isError.Description.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                        placeholder="Please Enter Description"
                                                                        autoComplete='off'
                                                                        onChange={(event) => {
                                                                            onChangeText({ event, state, setState })
                                                                            dispatch(Breadcrumb_inputName(event.target.value))
                                                                        }}
                                                                    />
                                                                    {isError.Description.length > 0 && (
                                                                        <span className="invalid-feedback">{isError.Description}</span>
                                                                    )}
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <FormGroup className="col col-sm-3">
                                                                <Label htmlFor="validationCustom21">{fieldLabel.VehicleDivisions}</Label>
                                                                <Select
                                                                    id="DivisionDropDown "
                                                                    name="VehicleDivisions"
                                                                    value={values.VehicleDivisions}
                                                                    isSearchable={false}
                                                                    className="react-dropdown"
                                                                    classNamePrefix="dropdown"
                                                                    options={DivisionType_DropdownOptions}
                                                                    onChange={(hasSelect, evn) => {
                                                                        onChangeSelect({ hasSelect, evn, state, setState, })
                                                                        DivisionType_DropDown_handller(hasSelect)
                                                                    }}
                                                                />
                                                                {isError.VehicleDivisions.length > 0 && (
                                                                    <span className="text-danger f-8"><small>{isError.VehicleDivisions}</small></span>
                                                                )}

                                                            </FormGroup>
                                                            <Col sm={1} style={{ marginTop: '17px' }} >
                                                                {" "}
                                                                <Button
                                                                    type="button"
                                                                    className="button_add badge badge-soft-primary font-size-12 waves-effect  waves-light  btn-outline-primary"
                                                                    onClick={() =>
                                                                        AddDivisionHandler()
                                                                    }
                                                                >
                                                                    <i className="dripicons-plus "></i>
                                                                </Button>
                                                            </Col>
                                                            <Col sm={3} style={{ marginTop: '28px' }}>
                                                                {divisionData.length > 0 ? (

                                                                    <div className="table-responsive">
                                                                        <Table className="table table-bordered  text-center">
                                                                            <Thead >
                                                                                <tr>
                                                                                    <th>Division Name</th>

                                                                                    <th>Action</th>
                                                                                </tr>
                                                                            </Thead>
                                                                            <Tbody>
                                                                                {divisionData.map((TableValue) => (
                                                                                    <tr>
                                                                                        <td>
                                                                                            {TableValue.label}
                                                                                        </td>
                                                                                        <td>
                                                                                            <i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                                                                                UserRoles_DeleteButton_Handller(TableValue.value)
                                                                                            }} >
                                                                                            </i>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </Tbody>
                                                                        </Table>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                    </>
                                                                )}
                                                            </Col>
                                                        </Row>

                                                        <FormGroup>
                                                            <Row>
                                                                <Col sm={2} className="mt-3">
                                                                    <SaveButton pageMode={pageMode}
                                                                        userAcc={userPageAccessState}
                                                                        editCreatedBy={editCreatedBy}
                                                                        module={"VehicleMaster"}
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
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default VehicleMaster

