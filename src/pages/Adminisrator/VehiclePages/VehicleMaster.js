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
import { PostMethodForVehicleMaster, getMethodForVehicleList, getMethod_DriverList_ForDropDown, getMethod_VehicleTypes_ForDropDown, PostMethod_ForVehicleMasterSuccess, getMethod_ForVehicleListSuccess, editVehicleTypeSuccess, updateVehicleTypeID } from "../../../store/Administrator/VehicleRedux/action";
import { get_Division_ForDropDown, } from "../../../store/Administrator/ItemsRedux/action";
import { useHistory } from "react-router-dom";
// import { actionChannel } from "redux-saga/effects";
import { SaveButton } from "../../../components/CommonSaveButton";


const VehicleMaster = (props) => {
    //*** "isEditdata get all data from ModuleID for Binding  Form controls
    let editDataGatingFromList = props.state;
    let pageModeProps = props.pageMode;
    let propsPageMode = props.pageMode;

    const dispatch = useDispatch();
    const history = useHistory()
    const formRef = useRef(null);

    const [divisionData, setDivisionData] = useState([]);
    const [divisionType_dropdown_Select, setDivisionType_dropdown_Select] = useState("");
    const [DriverList_dropdown_Select, setDriverList_dropdown_Select] = useState("");
    const [VehicleType_dropdown_Select, setVehicleType_dropdown_Select] = useState("");
    //  const [VehicleList_dropdown_Select, setVehicleList_dropdown_Select] = useState("");
    const [pageMode, setPageMode] = useState("");
    const [userPageAccessState, setUserPageAccessState] = useState(123);
    const [EditData, setEditData] = useState([]);


    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PostAPIResponse,
        VehicleList,
        Divisions,
        VehicleTypes,
        DriverList_redux,
        RoleAccessModifiedinSingleArray } = useSelector((state) => ({
            PostAPIResponse: state.VehicleReducer.PostDataMessage,
            VehicleList: state.VehicleReducer.VehicleList,
            Divisions: state.ItemMastersReducer.Division,
            VehicleTypes: state.VehicleReducer.VehicleTypes,
            DriverList_redux: state.VehicleReducer.DriverList,
            RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,

        }));


    useEffect(() => {
        //  dispatch(PostMethodForVehicleMaster());
        dispatch(getMethodForVehicleList());
        dispatch(getMethod_DriverList_ForDropDown());
        dispatch(getMethod_VehicleTypes_ForDropDown());
        dispatch(get_Division_ForDropDown());
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

        //   if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
        if (!(editDataGatingFromList === undefined)) {
            setEditData(editDataGatingFromList);
            setPageMode(pageModeProps);
            setDriverList_dropdown_Select({
                value: editDataGatingFromList.Driver,
                label: editDataGatingFromList.DriverName
            });
            setVehicleType_dropdown_Select({
                value: editDataGatingFromList.VehicleType,
                label: editDataGatingFromList.VehicleTypeName
            });
            let division = editDataGatingFromList.VehicleDivisions.map((index) => {
                return {
                    label: index.DivisionName,
                    value: index.Division
                }
            })
            setDivisionData(division)
            dispatch(editVehicleTypeSuccess({ Status: false }))
            dispatch(BreadcrumbShow(editDataGatingFromList.VehicleTypeName))
            return
        }

        else if (!(propsPageMode === undefined)) {
            setPageMode(propsPageMode)
        }
    }, [editDataGatingFromList, propsPageMode]);


    useEffect(() => {
        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {

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


    const DivisionType_DropdownOptions = Divisions.map((data) => ({
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

    // const VehicleList_DropdownOptions = VehicleList_redux.map((data) => ({
    //     value: data.id,
    //     label: data.Name
    // }));

    // function VehicleList_DropDown_handller(e) {
    //     setVehicleList_dropdown_Select(e)
    // }

    const FormSubmitButton_Handler = (event, values) => {
        var division = divisionData.map(i => ({ Division: i.value }))
          const jsonBody = JSON.stringify({
            VehicleNumber: values.VehicleNumber,
            Description: values.Description,
            Driver: DriverList_dropdown_Select.value,
            VehicleType: VehicleType_dropdown_Select.value,
            VehicleDivisions: division,
        });


        if (pageMode === 'edit') {
            dispatch(updateVehicleTypeID(jsonBody, EditData.id));
        }
        else {
            dispatch(PostMethodForVehicleMaster(jsonBody));

        }
    };

    /// Role Table Validation
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


                                                    <Row className="mt-3">
                                                        <Col md="3">
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


                                                        <Col md="1">  </Col>
                                                        <Col md="3">
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


                                                        <Col md="1">
                                                        </Col>
                                                        <Col md="4">
                                                            <FormGroup className="mb-2 col col-sm-8 ">
                                                                <Label htmlFor="validationCustom01">Vehicle Number </Label>
                                                                <AvField
                                                                    name="VehicleNumber"
                                                                    id="VehicleNumber"
                                                                    value={EditData.VehicleNumber}
                                                                    type="text"
                                                                    placeholder="Please Enter VehicleNumber"
                                                                    autoComplete='off'
                                                                    validate={{
                                                                        required: {
                                                                            value: true, errorMessage: "Please Enter valid VehicleNumber."
                                                                        },
                                                                        tel: {
                                                                            pattern: /^[A-Z]{2}[ -]{0,1}[0-9]{2}[ -]{0,1}[A-Z]{1,2}[ -]{0,1}[0-9]{1,4}$/,
                                                                            errorMessage: "Please Enter valid VehicleNumber.(Ex:MH 15 AA 1234)"
                                                                        }
                                                                    }}

                                                                />
                                                            </FormGroup>

                                                        </Col>

                                                        <Row>
                                                            <Col md="3">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01"> Description </Label>
                                                                    <AvField
                                                                        name="Description"
                                                                        id="Description"
                                                                        value={EditData.Description}
                                                                        type="text"
                                                                        placeholder="Please Enter Description"
                                                                        autoComplete='off'
                                                                        validate={{
                                                                            required: { value: true, errorMessage: 'Please Enter Description' },
                                                                        }}
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <FormGroup className="col col-sm-3">
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
                                                                {divisionData.length > 0 ? (

                                                                    <div className="table-responsive">
                                                                        <Table className="table table-bordered  text-center">
                                                                            <Thead >
                                                                                <tr>
                                                                                    <th>Division Type</th>

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
                                                                <Col sm={2}>
                                                                {SaveButton({ pageMode, userPageAccessState, module: "VehicleMaster" })}
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

