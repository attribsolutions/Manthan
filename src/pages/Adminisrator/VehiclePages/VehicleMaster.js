import React, { useEffect, useRef, useState, } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
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
} from "reactstrap";
import { AvField, AvForm, } from "availity-reactstrap-validation";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShow } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { Tbody, Thead } from "react-super-responsive-table";
import { AlertState } from "../../../store/actions";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";
import { PostMethodForVehicleMaster, getMethodForVehicleList, getMethod_DriverList_ForDropDown, getMethod_VehicleTypes_ForDropDown, PostMethod_ForVehicleMasterSuccess, getMethod_ForVehicleListSuccess, editVehicleTypeSuccess } from "../../../store/Administrator/VehicleRedux/action";
import { getDivisionTypesID, getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";
import { useHistory } from "react-router-dom";
// import { actionChannel } from "redux-saga/effects";



const VehicleMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    let editDataGatingFromList = props.state;
    let pageModeProps = props.pageMode;

    const formRef = useRef(null);

    const [divisionTypeData, setDivisionTypeData] = useState([]);
    const [divisionType_dropdown_Select, setDivisionType_dropdown_Select] = useState("");
    const [DriverList_dropdown_Select, setDriverList_dropdown_Select] = useState("");
    const [VehicleType_dropdown_Select, setVehicleType_dropdown_Select] = useState("");
    const [VehicleList_dropdown_Select, setVehicleList_dropdown_Select] = useState("");

    const [pageMode, setPageMode] = useState("");
    
    const [userPageAccessState, setUserPageAccessState] = useState(123);
    const [EditData, setEditData] = useState([]);



    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PostAPIResponse,
        DivisionType,
        VehicleList_redux,
        VehicleTypes,
        DriverList_redux,
        RoleAccessModifiedinSingleArray } = useSelector((state) => ({
            PostAPIResponse: state.VehicleReducer.PostDataMessage,
            DivisionType: state.PartyMasterReducer.partyList,
            VehicleList_redux: state.VehicleReducer.VehicleList,
            VehicleTypes: state.VehicleReducer.VehicleTypes,
            DriverList_redux: state.VehicleReducer.DriverList,
            RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,

        }));




    useEffect(() => {
        //  dispatch(PostMethodForVehicleMaster());
        dispatch(getMethodForVehicleList());
        dispatch(getMethod_DriverList_ForDropDown());
        dispatch(getMethod_VehicleTypes_ForDropDown());
        dispatch(getPartyListAPI());
    }, [dispatch]);

    //userAccess useEffect
    useEffect(() => {

        let userAcc = undefined
        if ((editDataGatingFromList === undefined)) {

            let locationPath = history.location.pathname
            userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
                return (`/${inx.ActualPagePath}` === locationPath)
            })
        }
        else if (!(editDataGatingFromList === undefined)) {
            let relatatedPage = props.relatatedPage
            userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
                return (`/${inx.ActualPagePath}` === relatatedPage)
            })

        }
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }

    }, [RoleAccessModifiedinSingleArray])

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {

        if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
        if (!(editDataGatingFromList === undefined)) {
            debugger
            setEditData(editDataGatingFromList);
            setPageMode(pageModeProps);

            dispatch(editVehicleTypeSuccess({ Status: false }))
            dispatch(BreadcrumbShow(editDataGatingFromList.VehicleNumber))
            return
        }
    }, [editDataGatingFromList])


    useEffect(() => {
        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {
            // setSubCategory_dropdown_Select('')
            dispatch(PostMethod_ForVehicleMasterSuccess({ Status: false }))
            formRef.current.reset();
            if (pageMode === "dropdownAdd") {
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
                    RedirectPath: '/VehicleList',
                }))
            }
        }
        else if (PostAPIResponse.Status === true) {
            dispatch(getMethod_ForVehicleListSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMessage.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [PostAPIResponse])



    const DivisionType_DropdownOptions = DivisionType.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function DivisionType_DropDown_handller(e) {
        setDivisionType_dropdown_Select(e)
    }

    const DriverList_DropdownOptions = DriverList_redux.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function DriverList_DropDown_handller(e) {
        setDriverList_dropdown_Select(e)
    }

    const VehicleType_DropdownOptions = VehicleTypes.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function VehicleType_DropDown_handller(e) {
        setVehicleType_dropdown_Select(e)
    }


    const VehicleList_DropdownOptions = VehicleList_redux.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function VehicleList_DropDown_handller(e) {
        setVehicleList_dropdown_Select(e)
    }


    const FormSubmitButton_Handler = (event, values) => {
        const jsonBody = JSON.stringify({
            Name: values.Name,

        });
        dispatch(PostMethodForVehicleMaster(jsonBody));
    };

    /// Role Table Validation
    function AddDivisionHandler() {
        const find = divisionTypeData.find((element) => {
            return element.value === divisionType_dropdown_Select.value
        });

        if (divisionType_dropdown_Select.length <= 0) {
            dispatch(AlertState({
                Type: 3, Status: true,
                Message: "Select One Role",
            }));
        }
        else if (find === undefined) {
            setDivisionTypeData([...divisionTypeData, divisionType_dropdown_Select]);
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
        setDivisionTypeData(divisionTypeData.filter(
            (item) => !(item.value === tableValue)
        )
        )
    }


    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((pageMode === "edit") || (pageMode === "copy") || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags>
                            <title>VehicleMaster | FoodERP-React FrontEnd</title>
                        </MetaTags>
                        <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <AvForm onValidSubmit={(e, v) => { FormSubmitButton_Handler(e, v) }}
                                    ref={formRef}>
                                    <Row className="">
                                        <Col md={12}>
                                            <Card>
                                                <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">Vehicle Number </Label>
                                                            <AvField
                                                                name="Name"
                                                                id="txtName"
                                                                value={EditData.VehicleNumber}
                                                                type="text"
                                                                placeholder="Please Enter VehicleNumber"
                                                                autoComplete='off'
                                                                validate={{
                                                                    required: { value: true, errorMessage: 'Please Enter VehicleNumber ' },
                                                                }}
                                                                onChange={(e) => { dispatch(BreadcrumbShow(e.target.value)) }}
                                                            />
                                                        </FormGroup>

                                                        <Row>
                                                            <Col md="4">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01"> Description </Label>
                                                                    <AvField
                                                                        name="Name"
                                                                        id="txtName"
                                                                        value={EditData.Description}
                                                                        type="text"
                                                                        placeholder="Please Enter Description"
                                                                        autoComplete='off'
                                                                        validate={{
                                                                            required: { value: true, errorMessage: 'Please Enter Description' },
                                                                        }}
                                                                        onChange={(e) => { dispatch(BreadcrumbShow(e.target.value)) }} />
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="4">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01"> Driver Name </Label>
                                                                    <Col sm={12}>
                                                                        <Select
                                                                            value={DriverList_dropdown_Select}
                                                                            options={DriverList_DropdownOptions}
                                                                            onChange={(e) => { DriverList_DropDown_handller(e) }}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="4">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01"> Vehicle Type </Label>
                                                                    <Col sm={12}>
                                                                        <Select
                                                                            value={VehicleType_dropdown_Select}
                                                                            options={VehicleType_DropdownOptions}
                                                                            onChange={(e) => { VehicleType_DropDown_handller(e) }}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <FormGroup className="col col-sm-4">
                                                                <Label htmlFor="validationCustom21">Division</Label>
                                                                <Select
                                                                    value={divisionType_dropdown_Select}
                                                                    options={DivisionType_DropdownOptions}
                                                                    onChange={(e) => { DivisionType_DropDown_handller(e) }}
                                                                />
                                                            </FormGroup>
                                                            <Col sm={1} style={{ marginTop: '28px' }} >
                                                                {" "}
                                                                <Button
                                                                    type="button"
                                                                    className="btn btn-sm mt-1 mb-0 btn-light  btn-outline-primary  "
                                                                    onClick={() =>
                                                                        AddDivisionHandler()
                                                                    }
                                                                >
                                                                    <i className="dripicons-plus "></i>
                                                                </Button>
                                                            </Col>
                                                            <Col sm={3} style={{ marginTop: '28px' }}>
                                                                {divisionTypeData.length > 0 ? (

                                                                    <div className="table-responsive">
                                                                        <Table className="table table-bordered  text-center">
                                                                            <Thead >
                                                                                <tr>
                                                                                    <th>Division Type</th>

                                                                                    <th>Action</th>
                                                                                </tr>
                                                                            </Thead>
                                                                            <Tbody>
                                                                                {divisionTypeData.map((TableValue) => (
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
                                                                <Col sm={2}>
                                                                    <div>
                                                                        {
                                                                            pageMode === "edit" ?
                                                                                userPageAccessState.RoleAccess_IsEdit ?
                                                                                    <button
                                                                                        type="submit"
                                                                                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Party Type"
                                                                                        className="btn btn-success w-md mt-3"
                                                                                    >
                                                                                        <i class="fas fa-edit me-2"></i>Update
                                                                                    </button>
                                                                                    :
                                                                                    <></>
                                                                                : (
                                                                                    
                                                                                    userPageAccessState.RoleAccess_IsSave ?
                                                                                        <button
                                                                                            type="submit"
                                                                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Party Type"
                                                                                            className="btn btn-primary w-md mt-3 "
                                                                                        > <i className="fas fa-save me-2"></i> Save
                                                                                        </button>
                                                                                        :
                                                                                        <></>
                                                                                )
                                                                        }
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </FormGroup >
                                                    </Row>

                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </AvForm>
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

