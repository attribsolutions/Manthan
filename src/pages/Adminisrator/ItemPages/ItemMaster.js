import React, { useEffect, useState } from "react"
import MetaTags from "react-meta-tags"
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardSubtitle,
    CardText,
    CardTitle,
    Col,
    Container,
    Form,
    FormGroup,
    Label,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    Table,
    TabPane,
} from "reactstrap"

import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames"
import BreadcrumbDemo from "../../../components/Common/CmponentRelatedCommonFile/BreadcrumbDemo"
import { AvField, AvForm, AvInput } from "availity-reactstrap-validation"
import Select from "react-select";
import { fetchCompanyList } from "../../../store/Administrator/CompanyRedux/actions"
import { getBaseUnit_ForDropDown, get_CategoryTypes_ForDropDown, get_Category_ForDropDown, get_SubCategory_ForDropDown } from "../../../store/Administrator/ItemsRedux/action";
import { getDivisionTypelist } from "../../../store/Administrator/DivisionTypeRedux/action";
import Dropzone from "react-dropzone";
import { AlertState } from "../../../store/actions";
import { Tbody, Thead } from "react-super-responsive-table";

const ItemsMaster = () => {
    const [selectedFiles, setselectedFiles] = useState([])
    const dispatch = useDispatch();
    const [activeTab1, setactiveTab1] = useState("1")
    const [companyList_dropdown_Select, setCompanyList_dropdown_Select] = useState("");
    const [BaseUnit_dropdown_Select, setBaseUnit_dropdown_Select] = useState("");
    const [BaseUnit_dropdown_Select2, setBaseUnit_dropdown_Select2] = useState("");
    const [categoryType_dropdown_Select, setCategoryType_dropdown_Select] = useState("");
    const [category_dropdown_Select, setCategory_dropdown_Select] = useState("");
    const [subCategory_dropdown_Select, setsubCategory_dropdown_Select] = useState("");
    const [divisionType_dropdown_Select, setDivisionType_dropdown_Select] = useState("");
    const [name, setName] = useState("");
    const [DefaultBaseUnit, setDefaultBaseUnit] = useState("");
    const [multiCat, setMultiCat] = useState([{
        CategoryType: '',
        Category: '',
        SubCategory: ''
    },
    ]);
    const [divisionTypeData, setDivisionTypeData] = useState([]);
    const [priceList_Dropdown_Select, setPriceList_Dropdown_Selecte]=useState([]);
    const [baseUnitTableData, setBaseUnitTableData] = useState([{
        conversionRatio: '',
        toBaseUnit: '',
    }]);


    const { companyList, BaseUnit, CategoryType, Category, SubCategory, DivisionType } = useSelector((state) => ({
        companyList: state.Company.companyList,
        BaseUnit: state.ItemMastersReducer.BaseUnit,
        CategoryType: state.ItemMastersReducer.CategoryType,
        Category: state.ItemMastersReducer.Category,
        SubCategory: state.ItemMastersReducer.SubCategory,
        DivisionType: state.DivisionTypeReducer.ListData,
    }));

    useEffect(() => {
        dispatch(fetchCompanyList());
        dispatch(getBaseUnit_ForDropDown());
        dispatch(get_CategoryTypes_ForDropDown());
        dispatch(get_Category_ForDropDown());
        dispatch(get_SubCategory_ForDropDown());
        dispatch(getDivisionTypelist());
    }, [dispatch]);

    const toggle1 = tab => {
        if (activeTab1 !== tab) {
            setactiveTab1(tab)
        }
    }

    const Company_DropdownOptions = companyList.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function CompanyList_DropDown_handller(e) {
        setCompanyList_dropdown_Select(e)
    }

    const BaseUnit_DropdownOptions = BaseUnit.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const PriceList_DropdownOptions = BaseUnit.map((data) => ({
        value: data.id,
        label: data.Name
    }));


    const BaseUnit_DropdownOptions2 = BaseUnit.map((data) => ({
        value: data.id,
        label: data.Name
    }));


    const CategoryType_DropdownOptions = CategoryType.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function CategoryType_DropDown_handller(e) {
        setCategoryType_dropdown_Select(e)
    }
    const Category_DropdownOptions = Category.map((data) => ({
        value: data.id,
        label: data.Name
    }));


    const SubCategory_DropdownOptions = SubCategory.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const DivisionType_DropdownOptions = DivisionType.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function MultipleAddRow_Button_Handler_tab3() {
        var newarr = [...baseUnitTableData, {
            conversionRatio: '',
            toBaseUnit: '',
        }]
        setBaseUnitTableData(newarr)
    }
    function BaseUnit_DropDown_handller(e) {
        setBaseUnit_dropdown_Select(e)
    }
    function PriceList_DropDown_handller(e) {
        setPriceList_Dropdown_Selecte(e)
    }


    function DivisionType_DropDown_handller(e) {
        setDivisionType_dropdown_Select(e)
    }

    // for image upload
    function handleAcceptedFiles(files) {
        files.map(file =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: formatBytes(file.size),
            })
        )
        setselectedFiles(files)
        console.log("f", files)
    }


    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
    }

    function Common_DropDown_handller_tabe_2(event, key, type) {
        debugger

        var found = multiCat.find((i, k) => {
            return (k === key)
        })
        let newSelectValue = ''


        if (type === "CategoryType") {
            newSelectValue = {
                CategoryType: event,
                Category: found.Category,
                SubCategory: found.SubCategory
            }
        }
        else if (type === 'Category') {
            newSelectValue = {
                CategoryType: found.CategoryType,
                Category: event,
                SubCategory: found.SubCategory
            }
        } else {
            newSelectValue = {
                CategoryType: found.CategoryType,
                Category: found.Category,
                SubCategory: event
            }
        }

        let newTabArr = multiCat.map((index, k) => {
            return (k === key) ? newSelectValue : index
        })
        setMultiCat(newTabArr)
    }
    function MuliSelectTab2Handler(key) {


        var newarr = [...multiCat, {
            CategoryType: { value: 0, label: "select" },
            Category: { value: 0, label: "select" },
            SubCategory: { value: 0, label: "select" }
        }]

        setMultiCat(newarr)
    }
    function MulitDeletrTab_2Handler(key) {
     
        var removeElseArrray = multiCat.filter((i, k) => {
            return !(k === key)
        })

        setMultiCat(removeElseArrray)

    }


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

    function BaseUnitTable_Delete_Row_Handller_tab_3(key) {

        var removeElseArrray = baseUnitTableData.filter((i, k) => {
            return !(k === key)
        })

        setBaseUnitTableData(removeElseArrray)

    }
    function BaseUnit2_DropDown_handller(event, key, type) {

        let newSelectValue = ''

        var found = baseUnitTableData.find((i, k) => {
            return (k === key)
        })

        if (type === "Conversion") {
            newSelectValue = {
                conversionRatio: event.target.value,
                toBaseUnit: found.toBaseUnit,
            }
        }
        else if (type === 'BaseUnit') {
            newSelectValue = {
                conversionRatio: found.conversionRatio,
                toBaseUnit: event,
            }

        }

        let newTabArr = baseUnitTableData.map((index, k) => {
            return (k === key) ? newSelectValue : index
        })
        setBaseUnitTableData(newTabArr)
        // setBaseUnit_dropdown_Select2(e)
    }

    console.log("f", baseUnitTableData)
    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Tabs & Accordions | Minia - React Admin & Dashboard Template</title>
                </MetaTags>
                <Container fluid>
                    <AvForm >
                        {/* Render Breadcrumbs */}
                        <BreadcrumbDemo title="Components" breadcrumbItem="Tabs & Accordions" />
                        <Row>


                            <Col lg={12}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="h4">Justify Tabs</CardTitle>

                                    </CardHeader>
                                    <CardBody>
                                        <Nav tabs className="nav-tabs-custom nav-justified">
                                            <NavItem>
                                                <NavLink
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
                                                    <span className="d-none d-sm-block">Tab1</span>
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
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
                                                    <span className="d-none d-sm-block">Tab2</span>

                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
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
                                                    <span className="d-none d-sm-block">Tab3</span>
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: activeTab1 === "4",
                                                    })}
                                                    onClick={() => {
                                                        toggle1("4")
                                                    }}
                                                >
                                                    <span className="d-block d-sm-none">
                                                        <i className="fas fa-home"></i>
                                                    </span>
                                                    <span className="d-none d-sm-block">Tab4</span>
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: activeTab1 === "5",
                                                    })}
                                                    onClick={() => {
                                                        toggle1("5")
                                                    }}
                                                >
                                                    <span className="d-block d-sm-none">
                                                        <i className="fas fa-home"></i>
                                                    </span>
                                                    <span className="d-none d-sm-block">Tab5</span>
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: activeTab1 === "6",
                                                    })}
                                                    onClick={() => {
                                                        toggle1("6")
                                                    }}
                                                >
                                                    <span className="d-block d-sm-none">
                                                        <i className="fas fa-home"></i>
                                                    </span>
                                                    <span className="d-none d-sm-block">Tab6</span>
                                                </NavLink>
                                            </NavItem>


                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: activeTab1 === "7",
                                                    })}
                                                    onClick={() => {
                                                        toggle1("7")
                                                    }}
                                                >
                                                    <span className="d-block d-sm-none">
                                                        <i className="fas fa-home"></i>
                                                    </span>
                                                    <span className="d-none d-sm-block">Tab7</span>
                                                </NavLink>
                                            </NavItem>
                                            
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    // className={classnames({
                                                    //     active: activeTab1 === "7",
                                                    // })}
                                                    // onClick={() => {
                                                    //     toggle1("7")
                                                    // }}
                                                >
                                                    <span className="d-block d-sm-none">
                                                        <i className="fas fa-home"></i>
                                                    </span>
                                                    {/* <span className="d-none d-sm-block">Tab7</span> */}
                                                    <Button> save</Button>
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                        <TabContent activeTab={activeTab1} className="p-3 text-muted">
                                            <TabPane tabId="1">
                                                <Col md={12}  >
                                                    <Card className="text-black">
                                                        <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                            <Row>

                                                                <FormGroup className="mb-3 col col-sm-4 " >
                                                                    <Label htmlFor="validationCustom01">Name</Label>
                                                                    <AvField name="Name" value={""} type="text" id='txtName'
                                                                        placeholder=" Please Enter Name "
                                                                        autoComplete="off"
                                                                        validate={{
                                                                            required: { value: true, errorMessage: 'Please Enter Name' },
                                                                        }}
                                                                        onChange={(e) => { (setName(e.target.value)) }}
                                                                    />
                                                                </FormGroup>

                                                                <FormGroup className="mb-3 col col-sm-4 " >
                                                                    <Label htmlFor="validationCustom01">ShortName</Label>
                                                                    <AvField name="Name" value={""} type="text" id='txtName'
                                                                        placeholder=" Please Enter ShortName "
                                                                        autoComplete="off"
                                                                        validate={{
                                                                            required: { value: true, errorMessage: 'Please Enter Name' },
                                                                        }}
                                                                    />
                                                                </FormGroup>

                                                                <FormGroup className=" col col-sm-4 " >
                                                                    <Label htmlFor="validationCustom21">Company</Label>
                                                                    <Select
                                                                        value={companyList_dropdown_Select}
                                                                        options={Company_DropdownOptions}
                                                                        onChange={(e) => { CompanyList_DropDown_handller(e) }}
                                                                    />
                                                                </FormGroup>

                                                                <FormGroup className=" col col-sm-4 " >
                                                                    <Label htmlFor="validationCustom21">Base Unit</Label>
                                                                    <Select
                                                                        value={BaseUnit_dropdown_Select}
                                                                        options={BaseUnit_DropdownOptions}
                                                                        onChange={(e) => { BaseUnit_DropDown_handller(e) }}
                                                                    />
                                                                </FormGroup>

                                                                <FormGroup className="mb-3 col col-sm-4 " >
                                                                    <Label htmlFor="validationCustom01">BarCode</Label>
                                                                    <AvField name="Name" value={""} type="text" id='txtName'
                                                                        placeholder=" Please Enter BarCode "
                                                                        autoComplete="off"
                                                                        validate={{
                                                                            required: { value: true, errorMessage: 'Please Enter BarCode' },
                                                                        }}
                                                                    />
                                                                </FormGroup>

                                                                <FormGroup className="mb-3 col col-sm-4 " >
                                                                    <Label htmlFor="validationCustom01">Sequence</Label>
                                                                    <AvField name="Name" value={""} type="text" id='txtName'
                                                                        placeholder=" Please Enter Sequence "
                                                                        autoComplete="off"
                                                                        validate={{
                                                                            required: { value: true, errorMessage: 'Please Enter Sequence' },
                                                                        }}
                                                                    />
                                                                </FormGroup>
                                                                <FormGroup className="mb-2 col col-sm-5">
                                                                    <Row className="justify-content-md-left">
                                                                        <Label htmlFor="horizontal-firstname-input" className="col-sm-2 col-form-label" >Active </Label>
                                                                        <Col md={2} style={{ marginTop: '9px' }} >

                                                                            <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                                                                <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                                                                    checked={""}
                                                                                    defaultChecked={true}
                                                                                    name="isActive"
                                                                                />
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </FormGroup>
                                                            </Row>
                                                        </CardBody>
                                                    </Card>
                                                </Col>

                                            </TabPane>

                                            <TabPane tabId="2">
                                                <Col md={12}  >
                                                    <Card className="text-black">
                                                        <CardBody style={{ backgroundColor: "whitesmoke" }}>

                                                            <Row>
                                                                <h5>Item Name :<Label className="text-primary" >{name}</Label></h5>
                                                            </Row>
                                                            {multiCat.map((index, key) => {

                                                                return <Row className="mt-3">
                                                                    <Col className=" col col-11 ">
                                                                        <Row>
                                                                            <FormGroup className=" col col-sm-4 " >
                                                                                <Label htmlFor="validationCustom21">Category Type</Label>
                                                                                <Select
                                                                                    value={multiCat[key].CategoryType}
                                                                                    options={CategoryType_DropdownOptions}
                                                                                    onChange={(e) => { Common_DropDown_handller_tabe_2(e, key, "CategoryType") }}
                                                                                />
                                                                            </FormGroup>

                                                                            <FormGroup className=" col col-sm-4 " >
                                                                                <Label htmlFor="validationCustom21">Category</Label>
                                                                                <Select
                                                                                    value={multiCat[key].Category}
                                                                                    options={Category_DropdownOptions}
                                                                                    onChange={(e) => { Common_DropDown_handller_tabe_2(e, key, "Category") }}
                                                                                />
                                                                            </FormGroup>

                                                                            <FormGroup className=" col col-sm-4 " >
                                                                                <Label htmlFor="validationCustom21">Sub Category</Label>
                                                                                <Select
                                                                                    value={multiCat[key].SubCategory}
                                                                                    options={SubCategory_DropdownOptions}
                                                                                    onChange={(e) => { Common_DropDown_handller_tabe_2(e, key, "SubCategory") }}
                                                                                />
                                                                            </FormGroup>
                                                                        </Row>
                                                                    </Col>
                                                                    {(multiCat.length === key + 1) ?
                                                                        <Col className="col col-1 mt-3">
                                                                            <Button className="btn btn-sm btn-light mt-3 "
                                                                                type="button"
                                                                                onClick={() => { MuliSelectTab2Handler(key) }} >
                                                                                <i className="dripicons-plus"></i></Button>
                                                                            {/* 

                                                                                <i
                                                                                className="dripicons-plus text-primary font-size-20 mt-3"
                                                                                onClick={() => {
                                                                                    MuliSelectTab2Handler(key);
                                                                                }}
                                                                            ></i> */}
                                                                        </Col>
                                                                        : <Col className="col col-1 mt-3">

                                                                            <i
                                                                                className="mdi mdi-trash-can d-block text-danger font-size-20 mt-3"
                                                                                onClick={() => {
                                                                                    MulitDeletrTab_2Handler(key);
                                                                                }}
                                                                            ></i>

                                                                        </Col>}
                                                                </Row>


                                                            })}

                                                        </CardBody>
                                                    </Card>

                                                </Col>

                                            </TabPane>

                                            <TabPane tabId="3">
                                                <Col md={12}>
                                                    <Row>
                                                        <Col md={12}  >
                                                            <Card className="text-black">
                                                                <CardBody style={{ backgroundColor: "whitesmoke" }}>

                                                                    <Row>
                                                                        <h5>Item Name :<Label className="text-primary" >{name}</Label></h5>
                                                                    </Row>

                                                                    <Row>
                                                                        <FormGroup className=" col col-sm-4 " >
                                                                            <Label >Base Unit</Label>
                                                                            <Select
                                                                                value={BaseUnit_dropdown_Select}
                                                                                options={BaseUnit_DropdownOptions}
                                                                                onChange={BaseUnit_DropDown_handller}
                                                                            />
                                                                        </FormGroup>
                                                                    </Row>




                                                                    <Row className="mt-3">
                                                                        <Col md={8}><Table className="table table-bordered  text-center ">
                                                                            <Thead >
                                                                                <tr>
                                                                                    <th>Unit Name</th>

                                                                                    <th className="col-sm-3 text-center">Conversion Ratio </th>
                                                                                    <th> To Base Unit</th>
                                                                                    <th>Action</th>
                                                                                </tr>
                                                                            </Thead>
                                                                            <Tbody  >
                                                                                {baseUnitTableData.map((TableValue, key) => (
                                                                                    <tr >
                                                                                        <td>
                                                                                            <Label>1</Label>    {BaseUnit_dropdown_Select.label}
                                                                                        </td>
                                                                                        <td>
                                                                                            <AvInput name="value" type="text"
                                                                                                defaultValue={TableValue.conversionRatio}
                                                                                                onChange={(e) => BaseUnit2_DropDown_handller(e, key, "Conversion")}></AvInput>
                                                                                        </td>
                                                                                        <td>
                                                                                            <Select
                                                                                                // placeholder="select unit"
                                                                                                value={TableValue.toBaseUnit}
                                                                                                options={BaseUnit_DropdownOptions2}
                                                                                                onChange={(e) => BaseUnit2_DropDown_handller(e, key, "BaseUnit")}
                                                                                            />
                                                                                        </td>
                                                                                        <td>
                                                                                            {(baseUnitTableData.length === key + 1) ?
                                                                                                <Row className="">
                                                                                                    <Col >
                                                                                                        <Button className="btn btn-sm btn-light mt-3 col col-6  align-items-sm-end"
                                                                                                            type="button"
                                                                                                            onClick={() => { MultipleAddRow_Button_Handler_tab3(key) }} >
                                                                                                            <i className="dripicons-plus"></i>
                                                                                                        </Button>
                                                                                                    </Col>
                                                                                                    <Col className="mt-3">
                                                                                                        < i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                                                                                            BaseUnitTable_Delete_Row_Handller_tab_3(key)
                                                                                                        }} >
                                                                                                        </i>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                                :

                                                                                                < i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                                                                                    BaseUnitTable_Delete_Row_Handller_tab_3(key)
                                                                                                }} >
                                                                                                </i>


                                                                                            }
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </Tbody>
                                                                        </Table></Col>

                                                                    </Row>

                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                </Col>


                                            </TabPane>

                                            <TabPane tabId="4">
                                                <Row>
                                                    <Col className="col-12">
                                                        <Card>
                                                            <CardBody>
                                                                {/* <CardTitle>Image Upload</CardTitle> */}
                                                                {/* <CardSubtitle className="mb-3">
                                                                    {" "}
                                                                    DropzoneJS is an open source library that provides
                                                                    drag’n’drop file uploads with image previews.
                                                                </CardSubtitle> */}
                                                                {/* <Form> */}
                                                                <Dropzone
                                                                    onDrop={acceptedFiles => {
                                                                        handleAcceptedFiles(acceptedFiles)
                                                                    }}
                                                                >
                                                                    {({ getRootProps, getInputProps }) => (
                                                                        // <div className="dropzone">
                                                                        <div
                                                                            className="dz-message needsclick mt-2"
                                                                            {...getRootProps()}
                                                                        >
                                                                            <input {...getInputProps()} />

                                                                            <div className="mb-3">

                                                                                <i className="display-6 text-muted bx  bx bx-cloud-upload" />
                                                                            </div>
                                                                            {/* <h4>Drop files here or click to upload.</h4> */}
                                                                        </div>
                                                                        // </div>
                                                                    )}
                                                                </Dropzone>
                                                                <div className="dropzone-previews mt-3" id="file-previews">
                                                                    {selectedFiles.map((index, i) => {
                                                                        return (
                                                                            <Card
                                                                                className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                                                                key={i + "-file"}
                                                                            >
                                                                                <div className="p-2">
                                                                                    <Row className="align-items-center">
                                                                                        <Col className="col-auto">
                                                                                            <img
                                                                                                data-dz-thumbnail=""
                                                                                                height="80"
                                                                                                className="avatar-sm rounded bg-light"
                                                                                                alt={index.name}
                                                                                                src={index.preview}

                                                                                            />
                                                                                        </Col>
                                                                                        <Col>
                                                                                            <Link
                                                                                                to="#"
                                                                                                className="text-muted font-weight-bold"
                                                                                            >
                                                                                                {index.name}
                                                                                            </Link>
                                                                                            <p className="mb-0">
                                                                                                <strong>{index.formattedSize}</strong>
                                                                                            </p>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </div>
                                                                            </Card>
                                                                        )
                                                                    })}
                                                                </div>
                                                                {/* </Form> */}

                                                                <div className="text-center mt-4">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-primary "
                                                                    >
                                                                        Upload
                                                                    </button>
                                                                </div>
                                                                <form action="/action_page.php">
                                                                    <input type="file" id="myFile" name="filename" />
                                                                    <input type="submit" />
                                                                </form>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </TabPane>

                                            <TabPane tabId="5">
                                                <Row>
                                                    <Col md={12}  >
                                                        <Card className="text-black">
                                                            <CardBody style={{ backgroundColor: "whitesmoke" }}>

                                                                <Row>
                                                                    <h5>Item Name :<Label className="text-primary" >{name}</Label></h5>
                                                                </Row>

                                                                <Row>
                                                                    <FormGroup className=" col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom21">Division Type</Label>
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
                                                                                    <Tbody  >
                                                                                        {divisionTypeData.map((TableValue) => (
                                                                                            <tr >
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

                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </TabPane>

                                            <TabPane tabId="6">
                                                <Row>
                                                    <Col md={12}  >
                                                        <Card className="text-black">
                                                            <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                                <Row>
                                                                    <h5>Item Name :<Label className="text-primary" >{name}</Label></h5>
                                                                </Row>
                                                                <Row>
                                                                    <FormGroup className="mb-3 col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom01">MRP</Label>
                                                                        <AvField name="MRP" value={""} type="text" id='txtName'
                                                                            placeholder=" Please Enter MRP "
                                                                            autoComplete="off"
                                                                            validate={{
                                                                                required: { value: true, errorMessage: 'Please Enter MRP ' },
                                                                            }}
                                                                            onChange={(e) => { (setName(e.target.value)) }}
                                                                        />
                                                                    </FormGroup>

                                                                    <FormGroup className="mb-3 col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom01">GST</Label>
                                                                        <AvField name="GST" value={""} type="text" id='txtName'
                                                                            placeholder=" Please Enter GST "
                                                                            autoComplete="off"
                                                                            validate={{
                                                                                required: { value: true, errorMessage: 'Please Enter GST' },
                                                                            }}
                                                                        />
                                                                    </FormGroup>
                                                                </Row>

                                                                <Row>
                                                                    <FormGroup className="mb-3 col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom01">HSN</Label>
                                                                        <AvField name="HSN" value={""} type="text" id='txtName'
                                                                            placeholder=" Please Enter HSN "
                                                                            autoComplete="off"
                                                                            validate={{
                                                                                required: { value: true, errorMessage: 'Please Enter HSN' },
                                                                            }}
                                                                        />
                                                                    </FormGroup>

                                                                </Row>
                                                            </CardBody>
                                                        </Card>

                                                    </Col>

                                                </Row>
                                            </TabPane>
                                            <TabPane tabId="7">
                                                <Row>
                                                    <Col md={12}  >
                                                        <Card className="text-black">
                                                            <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                                <Row>
                                                                    <h5>Item Name :<Label className="text-primary" >{name}</Label></h5>
                                                                </Row>
                                                                <Row>

                                                                    <FormGroup className=" col col-sm-4 " >
                                                                        <Label >Price List</Label>
                                                                        <Select
                                                                            value={priceList_Dropdown_Select}
                                                                            options={PriceList_DropdownOptions}
                                                                            onChange={()=>{PriceList_DropDown_handller()}}
                                                                        />
                                                                    </FormGroup>

                                                                    <FormGroup className="mb-3 col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom01">Margin</Label>
                                                                        <AvField name="GST" value={""} type="text" id='txtName'
                                                                            placeholder=" Please Enter GST "
                                                                            autoComplete="off"
                                                                            validate={{
                                                                                required: { value: true, errorMessage: 'Please Enter GST' },
                                                                            }}
                                                                        />
                                                                    </FormGroup>

                                                                </Row>

                                                                <Row>



                                                                </Row>
                                                            </CardBody>
                                                        </Card>

                                                    </Col>

                                                </Row>
                                            </TabPane>

                                        </TabContent>
                                    </CardBody>
                                </Card>
                            </Col>

                        </Row>

                    </AvForm>
                </Container>
            </div >
        </React.Fragment >
    );
}

export default ItemsMaster;
