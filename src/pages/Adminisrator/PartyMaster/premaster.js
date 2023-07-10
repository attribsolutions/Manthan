import React, { useEffect, useState } from "react"
import MetaTags from "react-meta-tags"
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane,
} from "reactstrap"
import { Link, useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames"
import { AvField, AvForm, AvInput } from "availity-reactstrap-validation"
import Select from "react-select";
import { priceListByPartyAction } from "../../../store/Administrator/PriceList/action";
import { getState } from "../../../store/Administrator/EmployeeRedux/action"
import {
    editPartyIDSuccess,
    getDistrictOnState,
    getPriceList,
    postPartyData,
    postPartyDataSuccess,
    updatePartyID,
    updatePartyIDSuccess
} from "../../../store/Administrator/PartyRedux/action"
import {  Breadcrumb_inputName } from "../../../store/actions"
import Tree from "./Tree"
import AddressDetails_Tab from "./AddressDetailsTab"
import { breadcrumbReturnFunc, loginCompanyID, loginPartyID, loginUserID } from "../../../components/Common/CommonFunction"
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import { getPartyTypelist } from "../../../store/Administrator/PartyTypeRedux/action";
import { getcompanyList } from "../../../store/Administrator/CompanyRedux/actions";
import { SaveButton } from "../../../components/Common/CommonButton";
import { SSDD_List_under_Company } from "../../../store/CommonAPI/SupplierRedux/actions";
import NewForm from "./NewForm";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";

const PartyMaster = (props) => {
    const dispatch = useDispatch();
    const history = useHistory()

    const [EditData, setEditData] = useState('');
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState(11);
    const [activeTab1, setactiveTab1] = useState("1")
    const [modalCss, setModalCss] = useState(false);
    const [state_DropDown_select, setState_DropDown_select] = useState([]);
    const [district_dropdown_Select, setDistrict_dropdown_Select] = useState([]);
    const [companyList_dropdown_Select, setCompanyList_dropdown_Select] = useState([]);
    const [partyType_dropdown_Select, setPartyType_dropdown_Select] = useState([]);
    const [PriceList_dropdown_Select, setPriceList_dropdown_Select] = useState([]);
    const [AddressDetailsMaster, setAddressDetailsMaster] = useState([]);
    const [PartyPrefix, setPartyPrefix] = useState([]);
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [suppilerSelect, setSuppilerSelect] = useState([]);

    const toggle1 = tab => {
        if (activeTab1 !== tab) {
            setactiveTab1(tab)
        }
    }

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PostAPIResponse,
        State,
        DistrictOnState,
        Company,
        PartyTypes,
        priceListByPartyType,
        userAccess,
        updateMsg,
        Supplier
    } = useSelector((state) => ({
        PostAPIResponse: state.PartyMasterReducer.PartySaveSuccess,
        updateMsg: state.PartyMasterReducer.updateMessage,
        State: state.EmployeesReducer.State,
        DistrictOnState: state.PartyMasterReducer.DistrictOnState,
        Company: state.Company.companyList,
        PartyTypes: state.PartyTypeReducer.ListData,
        PriceList: state.PartyMasterReducer.PriceList,
        AddressTypes: state.PartyMasterReducer.AddressTypes,
        userAccess: state.Login.RoleAccessUpdateData,
        priceListByPartyType: state.PriceListReducer.priceListByPartyType,
        Supplier: state.CommonAPI_Reducer.SSDD_List
    }));

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

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
            setUserAccState(userAcc)
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

                setEditData(hasEditVal);
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy);

                setState_DropDown_select({
                    label: hasEditVal.State.Name,
                    value: hasEditVal.State.id,
                });
                setDistrict_dropdown_Select({
                    label: hasEditVal.District.Name,
                    value: hasEditVal.District.id,
                });

                setPartyType_dropdown_Select({
                    label: hasEditVal.PartyType.Name,
                    value: hasEditVal.PartyType.id,
                });

                setCompanyList_dropdown_Select({
                    label: hasEditVal.Company.Name,
                    value: hasEditVal.Company.id,
                });
                if (hasEditVal.PriceList) {
                    setPriceList_dropdown_Select({
                        label: hasEditVal.PriceList.Name,
                        value: hasEditVal.PriceList.id,
                    });
                }
                // ====================== Images tab ======================

                setPartyPrefix(hasEditVal.PartyPrefix)
                setAddressDetailsMaster(hasEditVal.PartyAddress)
                dispatch(editPartyIDSuccess({ Status: false }));
            }
        }
    }, []);

    useEffect(() => {
        dispatch(getState());
        dispatch(getPriceList());
        dispatch(getPartyTypelist());
        dispatch(getcompanyList());
        dispatch(SSDD_List_under_Company())
    }, [dispatch]);

    useEffect(() => {
        if (Company.length === 1) {
            setCompanyList_dropdown_Select({
                value: Company[0].id,
                label: Company[0].Name
            })
        }
    }, [Company])

    useEffect(() => {
        if (PartyTypes.length === 1) {
            setPartyType_dropdown_Select({
                value: PartyTypes[0].id,
                label: PartyTypes[0].Name
            })
            dispatch(priceListByPartyAction(PartyTypes[0].id))
        }
    }, [PartyTypes])

    useEffect(async () => {
        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200) && !(pageMode === mode.dropdownAdd)) {
            dispatch(postPartyDataSuccess({ Status: false }))
            setCompanyList_dropdown_Select('')
            setPartyType_dropdown_Select('')
            setPriceList_dropdown_Select('')
            setDistrict_dropdown_Select('')
            setState_DropDown_select('')

            if (pageMode === mode.dropdownAdd) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                let isPermission = await customAlert({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                })
                if (isPermission) {
                    history.push({ pathname: url.PARTY_lIST })
                }
            }
        }
        else if ((PostAPIResponse.Status === true) && !(pageMode === mode.dropdownAdd)) {
            dispatch(postPartyDataSuccess({ Status: false }))
            customAlert({
                Type: 4,
                 Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [PostAPIResponse.Status])

    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            history.push({
                pathname: url.PARTY_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updatePartyIDSuccess({ Status: false }));
            dispatch(
                customAlert({
                    Type: 3,
                    Message: JSON.stringify(updateMsg.Message),
                })
            );
        }
    }, [updateMsg, modalCss]);

    const StateValues = State.map((index) => ({
        value: index.id,
        label: index.Name
    }));

    const DistrictOnStateValues = DistrictOnState.map((index) => ({
        value: index.id,
        label: index.Name
    }));

    const companyListValues = Company.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const PartyTypeDropdown_Options = PartyTypes.map((index) => ({
        value: index.id,
        label: index.Name,
        division: index.IsDivision
    }));

    const SupplierOptions = Supplier.map((index) => ({
        value: index.id,
        label: index.Name
    }));

    function handllerState(e) {
        setState_DropDown_select(e)
        dispatch(getDistrictOnState(e.value))
        setDistrict_dropdown_Select('')
    }

    function handllerDistrictOnState(e) {
        setDistrict_dropdown_Select(e)
    }

    function handllercompanyList(e) {
        setCompanyList_dropdown_Select(e)
    }

    function PartyType_Dropdown_OnChange_Handller(e) {
        setPartyType_dropdown_Select(e)
        setPriceList_dropdown_Select({ label: '' })
        // setCompanyList_dropdown_Select('')
        dispatch(priceListByPartyAction(e.value))
    }


    const onclickselect = function () {
        const hasNone = document.getElementById("color").style;

        if (hasNone.display === "none") {
            hasNone.display = "block";
        } else {
            hasNone.display = "none";
        }
    };

    const test1 = () => {

        return (
            <>
                <div id="color"  >
                    <div style={{ width: "6cm", marginBottom: "-60px" }} id="">

                        <Tree id="tree" data={priceListByPartyType} priceList={PriceList_dropdown_Select}
                            func1={setPriceList_dropdown_Select} />
                    </div>
                </div>

            </>
        )
    }

    const SaveHandler = (event, values) => {

        if (AddressDetailsMaster.length === 0) {
            dispatch(
                customAlert({
                    Type: 4,
                    Status: true,
                    Message: "Address details is required",
                    RedirectPath: false,
                    PermissionAction: false,
                })
            );
            return;
        }

        const data = AddressDetailsMaster.map((index) => {
            return index.IsDefault === true
        })

        const count1 = data.filter(value => value === true).length;

        if (count1 === 0) {
            dispatch(
                customAlert({
                    Type: 4,
                    Status: true,
                    Message: "At least one Address Details IsDefault true",
                    RedirectPath: false,
                    PermissionAction: false,
                })
            );
            return;
        }

        const Supplier = suppilerSelect.map((i) => ({
            Party: i.value,
            CreatedBy: loginUserID(),
            UpdatedBy: loginUserID(),
        }))

        const jsonBody = JSON.stringify({
            Name: values.Name,
            PriceList: PriceList_dropdown_Select.value,
            PartyType: partyType_dropdown_Select.value,
            Company: loginCompanyID(),
            PAN: values.PAN,
            Email: values.Email,
            MobileNo: values.MobileNo,
            AlternateContactNo: values.AlternateContactNo,
            State: state_DropDown_select.value,
            District: district_dropdown_Select.value,
            Taluka: 0,
            City: 0,
            GSTIN: values.GSTIN,
            MkUpMkDn: values.MkUpMkDn,
            isActive: values.isActive,
            IsDivision: partyType_dropdown_Select.division,
            // SupplierID:loginPartyID(),
            CreatedBy: loginUserID(),
            CreatedOn: "2022-06-24T11:16:53.165483Z",
            UpdatedBy: loginUserID(),
            UpdatedOn: "2022-06-24T11:16:53.330888Z",
            PartyAddress: AddressDetailsMaster,
            PartyPrefix: [
                {
                    Orderprefix: values.Orderprefix,
                    Invoiceprefix: values.Invoiceprefix,
                    Grnprefix: values.Grnprefix,
                    Receiptprefix: values.Receiptprefix,
                    Challanprefix: values.Challanprefix,
                    WorkOrderprefix: values.WorkOrderprefix,
                    MaterialIssueprefix: values.MaterialIssueprefix,
                    Demandprefix: values.Demandprefix,
                    IBChallanprefix: values.IBChallanprefix,
                    IBInwardprefix: values.IBInwardprefix
                }
            ],
            PartySubParty: Supplier
        });

        if (pageMode === mode.edit) {
            dispatch(updatePartyID(jsonBody, EditData.id));
        }
        else {
            
            dispatch(postPartyData(jsonBody));
        }
    };

    var IsEditMode_Css = ''
    if ((pageMode === mode.edit) || (pageMode === mode.copy) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };
    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
                    <Container fluid>
                    <NewForm/>
                        <AvForm onValidSubmit={(e, v) => { SaveHandler(e, v); }}>

                            <Row>
                                <Col lg={12}>
                                    <Card className="text-black" >
                                        <CardHeader className="card-header   text-black c_card_header" >
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
                                                        <span className="d-none d-sm-block">Party Master</span>
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
                                                        <span className="d-none d-sm-block">Address Details</span>

                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        id="nave-link-3"
                                                        style={{ cursor: "pointer" }}
                                                        className={classnames({
                                                            active: activeTab1 === "3",
                                                        })}
                                                        onClick={() => {
                                                            toggle1("3")
                                                        }}
                                                    >
                                                        <span className="d-block d-sm-none">
                                                            <i className="fas fa-home"></i>
                                                        </span>
                                                        <span className="d-none d-sm-block">Transaction Prefix</span>
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

                                                            </Col>
                                                        </Row>
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>

                                            <TabContent activeTab={activeTab1} className="p-3 text-muted">
                                                <TabPane tabId="1">

                                                    <Card className="text-black" >
                                                        <CardBody className="c_card_body">
                                                            <Row >
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01">Name </Label>
                                                                        <AvField name="Name" id="txtName"
                                                                            value={EditData.Name}
                                                                            type="text"
                                                                            placeholder="Please Enter Name"
                                                                            autoComplete='off'
                                                                            // autoFocus={true}
                                                                            validate={{
                                                                                required: { value: true, errorMessage: 'Please Enter Name' },
                                                                            }}
                                                                            onChange={(e) => { dispatch(Breadcrumb_inputName(e.target.value)) }}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="1">  </Col>
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01">Mobile Number </Label>
                                                                        <AvField name="MobileNo" type="tel"
                                                                            value={EditData.MobileNo}
                                                                            id="mobileNo"
                                                                            placeholder="Enter Mobile No."
                                                                            autoComplete='off'
                                                                            validate={{
                                                                                required: { value: true, errorMessage: 'Enter your Mobile Number' },
                                                                                tel: {
                                                                                    pattern: /^(\+\d{1,3}[- ]?)?\d{10}$/,
                                                                                    errorMessage: "Please Enter 10 Digit Mobile Number."
                                                                                }
                                                                            }}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="1">  </Col>
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01">Alternate Contact Number(s)</Label>
                                                                        <AvField name="AlternateContactNo" type="tel"
                                                                            value={EditData.AlternateContactNo}
                                                                            autoComplete='off'
                                                                            id="mobileNo"
                                                                            placeholder="Alternate Contact Number(s)"
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row className="mt-2">
                                                                <Col md="3">
                                                                    <FormGroup >
                                                                        <Label htmlFor="validationCustom01">Email </Label>
                                                                        <AvField name="Email" type="email"
                                                                            id="email"
                                                                            value={EditData.Email}
                                                                            placeholder="Enter your Email"
                                                                            autoComplete='off'
                                                                            validate={{
                                                                                required: { value: true, errorMessage: 'Please Enter your Email' },
                                                                                tel: {
                                                                                    pattern: "/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/",
                                                                                    errorMessage: "Please Enter valid Email Address.(Ex:abc@gmail.com)"
                                                                                }
                                                                            }
                                                                            }
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                        </CardBody>
                                                    </Card>


                                                    <Card className=" text-black mt-n2" >
                                                        <CardBody className="c_card_body">
                                                            <Row >
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01"> Party Type </Label>
                                                                        <Select
                                                                            value={partyType_dropdown_Select}
                                                                            options={PartyTypeDropdown_Options}
                                                                            onChange={(e) => { PartyType_Dropdown_OnChange_Handller(e) }}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="1">  </Col>
                                                                <Col md="3">
                                                                    <FormGroup>
                                                                        <Label htmlFor="validationCustom01">Price List </Label>
                                                                        <Input id="Input"
                                                                            value={PriceList_dropdown_Select.label}
                                                                            autoComplete={"off"}
                                                                            placeholder="Select..."
                                                                            onClick={onclickselect}
                                                                        >
                                                                        </Input>
                                                                        {test1()}
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="1">  </Col>
                                                                {/* <Col md="3">
                                                                    <FormGroup>
                                                                        <Label htmlFor="validationCustom01">Company Name </Label>
                                                                        <Select
                                                                            value={companyList_dropdown_Select}
                                                                            options={companyListValues}
                                                                            onChange={(e) => { handllercompanyList(e) }}
                                                                        />
                                                                    </FormGroup>
                                                                </Col> */}
                                                                 <Col md="3">
                                                                    <FormGroup>
                                                                        <Label htmlFor="validationCustom01">Suppiler </Label>
                                                                        {/* style={{ height: "2.9cm" }} */}
                                                                        <Col sm={12} >
                                                                            <Select
                                                                                name="Suppiler"
                                                                                value={suppilerSelect}
                                                                                isMulti={true}
                                                                                options={SupplierOptions}
                                                                                onChange={(e) => setSuppilerSelect(e)}
                                                                                classNamePrefix="dropdown"
                                                                            />
                                                                        </Col>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01"> PAN </Label>
                                                                        <AvField
                                                                            name="PAN"
                                                                            value={EditData.PAN}
                                                                            placeholder="Please Enter PAN"
                                                                            type="text"
                                                                            errorMessage='Please Enter valid PAN Number.(Ex:AAAAA1234A).'
                                                                            className="form-control"
                                                                            autoComplete='off'
                                                                            validate={{
                                                                                required: { value: true },
                                                                                tel: {
                                                                                    pattern: /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
                                                                                    errorMessage: 'Please Enter valid PAN Number.(Ex:AAAAA1234A).'
                                                                                }
                                                                            }}
                                                                            id="validationCustom01"
                                                                        />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="1">  </Col>
                                                                <Col md="3">
                                                                    <FormGroup>
                                                                        <Label htmlFor="validationCustom01"> GSTIN </Label>
                                                                        <AvField
                                                                            name="GSTIN"
                                                                            value={EditData.GSTIN}
                                                                            placeholder="Please Enter GSTIN"
                                                                            type="text"
                                                                            errorMessage='Please Enter valid GSTIN number.(Ex:27AAAAA0000A1Z5).'
                                                                            autoComplete='off'
                                                                            className="form-control"
                                                                            validate={{
                                                                                required: { value: true },
                                                                                tel: {
                                                                                    pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                                                                                    errorMessage: 'Please Enter valid GSTIN number.(Ex:27AAAAA0000A1Z5).'
                                                                                }
                                                                            }}
                                                                            id="validationCustom01"
                                                                        />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="1">  </Col>
                                                                <Col md="3">
                                                                    <FormGroup>
                                                                        <Row style={{ marginTop: '25px' }}>
                                                                            <Label
                                                                                htmlFor="horizontal-firstname-input"
                                                                                className="col-sm-4 col-form-label"
                                                                            >
                                                                                MKUpMkDn
                                                                            </Label>
                                                                            <Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">
                                                                                <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                                                                    <AvInput type="checkbox" className="form-check-input " id="inp-MkUpMkDn"
                                                                                        checked={EditData.MkUpMkDn}
                                                                                        name="MkUpMkDn"
                                                                                    />
                                                                                    <label className="form-check-label" ></label>
                                                                                </div>
                                                                            </Col>
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="3">
                                                                    <FormGroup >
                                                                        <Label htmlFor="validationCustom01">State</Label>
                                                                        <Col sm={12} >
                                                                            <Select
                                                                                value={state_DropDown_select}
                                                                                options={StateValues}
                                                                                onChange={(e) => { handllerState(e) }}
                                                                            />
                                                                        </Col>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="1">  </Col>
                                                                <Col md="3">
                                                                    <FormGroup>
                                                                        <Label htmlFor="validationCustom01">District </Label>
                                                                        <Col sm={12}>
                                                                            <Select
                                                                                value={district_dropdown_Select}
                                                                                options={DistrictOnStateValues}
                                                                                onChange={(e) => { handllerDistrictOnState(e) }}
                                                                            />
                                                                        </Col>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="1"></Col>
                                                                <Col md="3">
                                                                    <FormGroup>
                                                                        <Row style={{ marginTop: '25px' }}>
                                                                            <Label
                                                                                htmlFor="horizontal-firstname-input"
                                                                                className="col-sm-4 col-form-label"
                                                                            >
                                                                                Active
                                                                            </Label>
                                                                            <Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">
                                                                                <div className="form-check form-switch form-switch-md " dir="ltr">
                                                                                    <AvInput type="checkbox" className="form-check-input " id="inp-isActive"
                                                                                        checked={EditData.isActive}
                                                                                        defaultChecked={true}
                                                                                        name="isActive"
                                                                                    />
                                                                                    <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                                                                </div>
                                                                            </Col>
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>

                                                                {/* <Col md={1} className="mx-n1"> </Col>
                                                                <FormGroup className="mb-2 col col-sm-4 ">
                                                                    <Label htmlFor="validationCustom01">Suppiler</Label>
                                                                    <Select
                                                                        name="Suppiler"
                                                                        value={suppilerSelect}
                                                                        isMulti={true}
                                                                        // options={EmployeeType_DropdownOptions}
                                                                        // onChange={(e) => SuppilerOnChange(e)}
                                                                        classNamePrefix="dropdown"
                                                                    />
                                                                </FormGroup> */}



                                                            </Row>

                                                            <Row className="mt-3" >
                                                               
                                                            </Row>

                                                        </CardBody>
                                                    </Card>
                                                </TabPane>

                                                <TabPane tabId="2">
                                                    <Row>
                                                        <Col md={12}  >
                                                            <Row className="mt-3">
                                                                <Col className=" col col-11 ">
                                                                    <AddressDetails_Tab tableData={AddressDetailsMaster} func={setAddressDetailsMaster} />
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </TabPane>

                                                <TabPane tabId="3">
                                                    <Col md={12}  >
                                                        <Card className="text-black " >
                                                            <CardBody className="c_card_body">
                                                                <Col>
                                                                    <FormGroup className="mb-3">
                                                                        <Row md="5">
                                                                            <Label htmlFor="validationCustom01"> Order Prefix</Label>
                                                                            <AvField
                                                                                value={PartyPrefix.length === 1 ? PartyPrefix[0].Orderprefix : ''}
                                                                                type="text"
                                                                                autoComplete='off'
                                                                                name="Orderprefix"
                                                                                placeholder="Please Enter Order Prefix"
                                                                                className="form-control "
                                                                            />
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col >
                                                                    <FormGroup className="mb-3">
                                                                        <Row md="5">
                                                                            <Label htmlFor="validationCustom01">Invoice Prefix</Label>
                                                                            <AvField
                                                                                value={PartyPrefix.length === 1 ? PartyPrefix[0].Invoiceprefix : ''}
                                                                                type="text"
                                                                                autoComplete='off'
                                                                                name="Invoiceprefix"
                                                                                placeholder="Please Enter Invoice Prefix "
                                                                                className="form-control"
                                                                            />
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col>
                                                                    <FormGroup className="mb-3">
                                                                        <Row md="5">
                                                                            <Label htmlFor="validationCustom01"> GRN Prefix</Label>
                                                                            <AvField
                                                                                value={PartyPrefix.length === 1 ? PartyPrefix[0].Grnprefix : ''}
                                                                                type="text"
                                                                                autoComplete='off'
                                                                                name="Grnprefix"
                                                                                placeholder="Please Enter GRN Prefix"
                                                                                className="form-control "
                                                                            />
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col>
                                                                    <FormGroup>
                                                                        <Row md="5">
                                                                            <Label htmlFor="validationCustom01"> Receipt Prefix</Label>
                                                                            <AvField
                                                                                value={PartyPrefix.length === 1 ? PartyPrefix[0].Receiptprefix : ''}
                                                                                type="text"
                                                                                autoComplete='off'
                                                                                name="Receiptprefix"
                                                                                placeholder="Please Enter Receipt Prefix"
                                                                                className="form-control"
                                                                            />
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col>
                                                                    <FormGroup className="mt-3">
                                                                        <Row md="5">
                                                                            <Label htmlFor="validationCustom01"> Challan Prefix</Label>
                                                                            <AvField
                                                                                value={PartyPrefix.length === 1 ? PartyPrefix[0].Challanprefix : ''}
                                                                                type="text"
                                                                                autoComplete='off'
                                                                                name="Challanprefix"
                                                                                placeholder="Please Enter Challan Prefix"
                                                                                className="form-control"
                                                                            />
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col>
                                                                    <FormGroup className="mt-3">
                                                                        <Row md="5">
                                                                            <Label htmlFor="validationCustom01"> WorkOrder Prefix</Label>
                                                                            <AvField
                                                                                value={PartyPrefix.length === 1 ? PartyPrefix[0].WorkOrderprefix : ''}
                                                                                type="text"
                                                                                autoComplete='off'
                                                                                name="WorkOrderprefix"
                                                                                placeholder="Please Enter WorkOrder Prefix"
                                                                                className="form-control"
                                                                            />
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col>
                                                                    <FormGroup className="mt-3">
                                                                        <Row md="5">
                                                                            <Label htmlFor="validationCustom01"> MaterialIssue Prefix</Label>
                                                                            <AvField
                                                                                value={PartyPrefix.length === 1 ? PartyPrefix[0].MaterialIssueprefix : ''}
                                                                                type="text"
                                                                                autoComplete='off'
                                                                                name="MaterialIssueprefix"
                                                                                placeholder="Please Enter MaterialIssue Prefix"
                                                                                className="form-control"
                                                                            />
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col>
                                                                    <FormGroup className="mt-3">
                                                                        <Row md="5">
                                                                            <Label htmlFor="validationCustom01"> Demand Prefix</Label>
                                                                            <AvField
                                                                                value={PartyPrefix.length === 1 ? PartyPrefix[0].Demandprefix : ''}
                                                                                type="text"
                                                                                autoComplete='off'
                                                                                name="Demandprefix"
                                                                                placeholder="Please Enter Demand Prefix"
                                                                                className="form-control"
                                                                            />
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col>
                                                                    <FormGroup className="mt-3">
                                                                        <Row md="5">
                                                                            <Label htmlFor="validationCustom01"> IBChallan Prefix</Label>
                                                                            <AvField
                                                                                value={PartyPrefix.length === 1 ? PartyPrefix[0].IBChallanprefix : ''}
                                                                                type="text"
                                                                                autoComplete='off'
                                                                                name="IBChallanprefix"
                                                                                placeholder="Please Enter IBChallan Prefix"
                                                                                className="form-control"
                                                                            />
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col>
                                                                    <FormGroup className="mt-3">
                                                                        <Row md="5">
                                                                            <Label htmlFor="validationCustom01"> IBInward Prefix</Label>
                                                                            <AvField
                                                                                value={PartyPrefix.length === 1 ? PartyPrefix[0].IBInwardprefix : ''}
                                                                                type="text"
                                                                                autoComplete='off'
                                                                                name="IBInwardprefix"
                                                                                placeholder="Please Enter IBInward Prefix"
                                                                                className="form-control"
                                                                            />
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </TabPane>
                                            </TabContent>
                                        </CardBody>

                                        {/* <div style={{ marginLeft: "35px", marginBottom: "60px" }}>
                                            {
                                                (pageMode === mode.edit) ?
                                                    (userPageAccessState.RoleAccess_IsEdit) ?
                                                        <button
                                                            type="submit"
                                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Party"
                                                            className="btn btn-success w-md"
                                                        >
                                                            <i class="fas fa-edit me-2"></i>Update
                                                        </button>
                                                        :
                                                        null
                                                    : ((pageMode === mode.defaultsave) || (pageMode === mode.copy) || (pageMode === mode.dropdownAdd)) ? (
                                                        (userPageAccessState.RoleAccess_IsSave) ?
                                                            <button
                                                                type="submit"
                                                                data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Party"
                                                                className="btn btn-primary w-md"
                                                            > <i className="fas fa-save me-2"></i> Save
                                                            </button>
                                                            :
                                                            null
                                                    )
                                                        : null
                                            }
                                        </div> */}

                                        <div style={{ paddingLeft: "30px", paddingBottom: "10px" }}>
                                            <SaveButton pageMode={pageMode}
                                                userAcc={userPageAccessState}
                                                editCreatedBy={editCreatedBy}
                                                module={"PartyMaster"}
                                            />
                                        </div>
                                    </Card>
                                </Col>
                            </Row>
                        </AvForm>
                        <Input/>
                     
                    </Container>
                </div >
            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};
export default PartyMaster;




