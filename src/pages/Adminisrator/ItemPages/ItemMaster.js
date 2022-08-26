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
    Input,
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
import {
    getBaseUnit_ForDropDown,
    get_CategoryTypes_ForDropDown,
    get_Category_ForDropDown,
    get_SubCategory_ForDropDown,
    postItemData
} from "../../../store/Administrator/ItemsRedux/action";
import Dropzone from "react-dropzone";
import { AlertState } from "../../../store/actions";
import { Tbody, Thead } from "react-super-responsive-table";
import { getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";

const ItemsMaster = () => {
    const [selectedFiles, setselectedFiles] = useState([])
    const dispatch = useDispatch();
    const [activeTab1, setactiveTab1] = useState("1")

    const [companyList_dropdown_Select, setCompanyList_dropdown_Select] = useState("");
    const [BaseUnit_dropdown_Select, setBaseUnit_dropdown_Select] = useState("");
    const [division_dropdown_Select, setDivision_dropdown_Select] = useState("");

    let initial = {
        Name: "",
        Sequence: "",
        ShortName: "",
        BarCode: {label:""},
        Company: "",
        BaseUnit: '',
        MRP: '',
        GST: '',
        HSN: '',
    }

    let [name, setName] = useState();
    let [refresh, setrefresh] = useState('');

    const [formValue, setFormValue] = useState(initial);



    // categoryTabTable
    const [categoryTabTable, setCategoryTabTable] = useState([{
        CategoryType: '',
        Category: '',
        SubCategory: ''
    }]);

    const [marginTabTable, setMarginTabTable] = useState([{
        PriceList: '',
        Margin: ''
    }]);

    const [divisionTableData, setDivisionTableData] = useState([]);

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
        DivisionType: state.PartyMasterReducer.partyList,
    }));

    useEffect(() => {
        dispatch(fetchCompanyList());
        dispatch(getBaseUnit_ForDropDown());
        dispatch(get_CategoryTypes_ForDropDown());
        dispatch(get_Category_ForDropDown());
        dispatch(get_SubCategory_ForDropDown());
        dispatch(getPartyListAPI());
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


    function Common_DropDown_handller_ForAll(event,type) {
        formValue[type]=event
        setrefresh(event)
    }





    function CategoryTab_AddRow_Handler() {
        var newarr = [...categoryTabTable, {
            CategoryType: { value: 0, label: "select" },
            Category: { value: 0, label: "select" },
            SubCategory: { value: 0, label: "select" }
        }]
        setCategoryTabTable(newarr)
    }
    function CategoryTab_DeleteRow_Handler(key) {

        var removeElseArrray = categoryTabTable.filter((i, k) => {
            return !(k === key)
        })

        setCategoryTabTable(removeElseArrray)

    }
    function CategoryTab_Common_onChange_Handller(event, key, type) {

        var found = categoryTabTable.find((i, k) => {
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

        let newTabArr = categoryTabTable.map((index, k) => {
            return (k === key) ? newSelectValue : index
        })
        setCategoryTabTable(newTabArr)
    }


    function UnitConversionsTab_AddRow_Handle() {
        var newarr = [...baseUnitTableData, {
            conversionRatio: '',
            toBaseUnit: '',
        }]
        setBaseUnitTableData(newarr)
    }
    function UnitConversionsTab_DeleteRow_Handler(key) {

        var removeElseArrray = baseUnitTableData.filter((i, k) => {
            return !(k === key)
        })

        setBaseUnitTableData(removeElseArrray)

    }
    function  UnitConversionsTab_BaseUnit2_onChange_Handller(event, key, type) {

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


    function DivisionTab_AddRow_Handle() {
        const find = divisionTableData.find((element) => {
            return element.value === division_dropdown_Select.value
        });

        if (division_dropdown_Select.length <= 0) {
            dispatch(AlertState({
                Type: 3, Status: true,
                Message: "Select One Role",
            }));
        }
        else if (find === undefined) {
            setDivisionTableData([...divisionTableData, division_dropdown_Select]);
        }
        else {
            dispatch(AlertState({
                Type: 4, Status: true,
                Message: "DivisionType already Exists ",
            }));
        }
    }
    function DivisionTab_Dropdown_onChange_Handler(e) {
        setDivision_dropdown_Select(e)
    }
    function DivisionTab_DeleteRow_Handler(tableValue) {
        setDivisionTableData(divisionTableData.filter(
            (item) => !(item.value === tableValue)
        )
        )
    }



    function MarginTab_AddRow_Handler(key) {

        var newarr1 = [...marginTabTable, {
            PriceList: { value: 0, label: "select" },
            Margin: {}
        }]
        setMarginTabTable(newarr1)
    }
    function MarginTab_DeleteRow_Handler(key) {
        var removeElseArrray1 = marginTabTable.filter((i, k) => {
            return !(k === key)
        })
        setMarginTabTable(removeElseArrray1)
    }
    function MarginTab_onChange_Handler(event, key, type) {

        var found = marginTabTable.find((i, k) => {
            return (k === key)
        })
        let newSelectValue = ''

        if (type === "PriceList") {
            newSelectValue = {
                PriceList: event,
                Margin: found.Margin,
            }
        }
        else if (type === 'Margin') {
            newSelectValue = {
                PriceList: found.PriceList,
                Margin: event.target.value,
            }
        }

        let newTabArr = setMarginTabTable.map((index, k) => {
            return (k === key) ? newSelectValue : index
        })
        setMarginTabTable(newTabArr)
    }








    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
    }
    let base64String = "";
    let imageBase64Stringsep = ''
    function imageUploaded() {

        var file = document.querySelector(
            'input[type=file]')['files'][0];

        var reader = new FileReader();
        console.log("next");

        reader.onload = function () {
            base64String = reader.result.replace("data:", "")
                .replace(/^.+,/, "");

            imageBase64Stringsep = base64String;

            alert(imageBase64Stringsep);
            console.log(base64String);
            setImage2(base64String)
        }
        reader.readAsDataURL(file);
    }
    const [image2, setImage2] = useState('')
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


    const handleValidSubmit = (event, values) => {
        debugger
        const ItemCategoryDetails = categoryTabTable.map((index) => ({
            CategoryType: index.CategoryType.value,
            Category: index.Category.value,
            SubCategory: index.SubCategory.value
        }))

        const ItemUnitDetails = baseUnitTableData.map((index) => ({
            conversionRatio: index.conversionRatio,
            toBaseUnit: index.toBaseUnit.value,
        }))

        const ItemDivisionDetails = divisionTableData.map((index) => ({
            Division: index.value
        }))
        const jsonBody = JSON.stringify({
            Name: values.Name,
            ShortName: values.ShortName,
            Sequence: values.Sequence,
            BarCode: values.BarCode,
            isActive: values.isActive,
            Company: companyList_dropdown_Select.value,
            BaseUnit: BaseUnit_dropdown_Select.value,
            ItemCategoryDetails: categoryTabTable.value,
            ItemUnitDetails: baseUnitTableData.value,
            ItemImagesDetails: [
                {
                    ImageType: "1",
                    Item_pic: "sadsadasdas"
                }
            ],
            ItemDivisionDetails: divisionTableData.value,
            ItemGstDetails: [
                {
                    GSTPercentage: "5.00",
                    MRP: "100.00",
                    HSNCode: "Aaaa01"
                }
            ],
            ItemMarginDetails: [
                {
                    PriceList: "1",
                    Margin: "10"
                }
            ]
        });

        dispatch(postItemData(jsonBody));
        console.log("jsonBody", jsonBody)
    };
    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Tabs & Accordions | Minia - React Admin & Dashboard Template</title>
                </MetaTags>
                <Container fluid>
                    <AvForm onValidSubmit={(e, v) => { handleValidSubmit(e, v); }}>
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
                                                    <span className="d-none d-sm-block">Basic Info</span>
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
                                                    <span className="d-none d-sm-block">Category</span>

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
                                                    <span className="d-none d-sm-block">Unit Conversions</span>
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
                                                    <span className="d-none d-sm-block">Image</span>
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
                                                    <span className="d-none d-sm-block">Division</span>
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
                                                    <span className="d-none d-sm-block">Rate Details</span>
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
                                                    <span className="d-none d-sm-block">Margin</span>
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
                                                    <Button type="submit"> save</Button>
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
                                                                    <Label >Name</Label>
                                                                    <Input type="text" id='txtName'
                                                                        placeholder=" Please Enter Name "
                                                                        autoComplete="off"
                                                                        onChange={(e) => { formValue.Name = e.target.value }}
                                                                    />
                                                                </FormGroup>

                                                                <FormGroup className="mb-3 col col-sm-4 " >
                                                                    <Label >ShortName</Label>
                                                                    <Input  type="text" id='txtShortName'
                                                                        placeholder=" Please Enter ShortName "
                                                                        autoComplete="off"
                                                                        onChange={(e) => { formValue.ShortName = e.target.value }}
                                                                    />
                                                                </FormGroup>

                                                                <FormGroup className=" col col-sm-4 " >
                                                                    <Label htmlFor="validationCustom21">Company</Label>
                                                                    <Select
                                                                        value={formValue.Company}
                                                                        options={Company_DropdownOptions}
                                                                        onChange={(e) => Common_DropDown_handller_ForAll(e,  "Company")}
                                                                    />
                                                                </FormGroup>

                                                                <FormGroup className=" col col-sm-4 " >
                                                                    <Label htmlFor="validationCustom21">Base Unit</Label>
                                                                    <Select
                                                                        // value={BaseUnit_dropdown_Select}
                                                                        value={formValue.BaseUnit}
                                                                        options={BaseUnit_DropdownOptions}
                                                                        onChange={(e) => Common_DropDown_handller_ForAll(e,  "BaseUnit")}
                                                                    />
                                                                </FormGroup>

                                                                <FormGroup className="mb-3 col col-sm-4 " >
                                                                    <Label htmlFor="validationCustom01">BarCode</Label>
                                                                    <Input
                                                                        placeholder=" Please Enter BarCode "
                                                                        autoComplete="off"
                                                                        // validate={{
                                                                        //     required: { value: true, errorMessage: 'Please Enter BarCode' },
                                                                        // }}
                                                                        onChange={(e) => { formValue.BarCode = e.target.value }}
                                                                    />
                                                                </FormGroup>

                                                                <FormGroup className="mb-3 col col-sm-4 " >
                                                                    <Label htmlFor="validationCustom01">Sequence</Label>
                                                                    <Input
                                                                        placeholder=" Please Enter Sequence "
                                                                        autoComplete="off"

                                                                        onChange={(e) => { formValue.Sequence = e.target.value }}
                                                                    />
                                                                    {/* <AvField name="Name" value={""} type="text" id='txtName'
                                                                        placeholder=" Please Enter Sequence "
                                                                        autoComplete="off"

                                                                        validate={{
                                                                            required: { value: true, errorMessage: 'Please Enter Sequence' },
                                                                        }}
                                                                    /> */}
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
                                                            {categoryTabTable.map((index, key) => {

                                                                return <Row className="mt-3">
                                                                    <Col className=" col col-11 ">
                                                                        <Row>
                                                                            <FormGroup className=" col col-sm-4 " >
                                                                                <Label htmlFor="validationCustom21">Category Type</Label>
                                                                                <Select
                                                                                    value={categoryTabTable[key].CategoryType}
                                                                                    options={CategoryType_DropdownOptions}
                                                                                    onChange={(e) => { CategoryTab_Common_onChange_Handller(e, key, "CategoryType") }}
                                                                                />
                                                                            </FormGroup>

                                                                            <FormGroup className=" col col-sm-4 " >
                                                                                <Label htmlFor="validationCustom21">Category</Label>
                                                                                <Select
                                                                                    value={categoryTabTable[key].Category}
                                                                                    options={Category_DropdownOptions}
                                                                                    onChange={(e) => { CategoryTab_Common_onChange_Handller(e, key, "Category") }}
                                                                                />
                                                                            </FormGroup>

                                                                            <FormGroup className=" col col-sm-4 " >
                                                                                <Label htmlFor="validationCustom21">Sub Category</Label>
                                                                                <Select
                                                                                    value={categoryTabTable[key].SubCategory}
                                                                                    options={SubCategory_DropdownOptions}
                                                                                    onChange={(e) => { CategoryTab_Common_onChange_Handller(e, key, "SubCategory") }}
                                                                                />
                                                                            </FormGroup>
                                                                        </Row>
                                                                    </Col>
                                                                    {(categoryTabTable.length === key + 1) ?
                                                                        <Col className="col col-1 mt-3">
                                                                            <Button className="btn btn-sm btn-light mt-3 "
                                                                                type="button"
                                                                                onClick={() => { CategoryTab_AddRow_Handler() }} >
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
                                                                                    CategoryTab_DeleteRow_Handler(key);
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
                                                                        <h5>Item Name :<Label className="text-primary" >{formValue.Name}</Label></h5>
                                                                    </Row>

                                                                    <Row>
                                                                        <FormGroup className=" col col-sm-4 " >
                                                                            <Label >Base Unit</Label>
                                                                            <Select
                                                                                value={formValue.BaseUnit}
                                                                                options={BaseUnit_DropdownOptions}
                                                                                onChange={(e) => Common_DropDown_handller_ForAll(e,"BaseUnit")}

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
                                                                                            <Label>1</Label>    {formValue.BaseUnit.label}
                                                                                        </td>
                                                                                        <td>
                                                                                            <AvInput name="value" type="text"
                                                                                                defaultValue={TableValue.conversionRatio}
                                                                                                onChange={(e) => UnitConversionsTab_BaseUnit2_onChange_Handller(e, key, "Conversion")}></AvInput>
                                                                                        </td>
                                                                                        <td>
                                                                                            <Select
                                                                                                // placeholder="select unit"
                                                                                                value={TableValue.toBaseUnit}
                                                                                                options={BaseUnit_DropdownOptions2}
                                                                                                onChange={(e) => UnitConversionsTab_BaseUnit2_onChange_Handller(e, key, "BaseUnit")}
                                                                                            />
                                                                                        </td>
                                                                                        <td>
                                                                                            {(baseUnitTableData.length === key + 1) ?
                                                                                                <Row className="">
                                                                                                    <Col >
                                                                                                        <Button className="btn btn-sm btn-light mt-3 col col-6  align-items-sm-end"
                                                                                                            type="button"
                                                                                                            onClick={() => { UnitConversionsTab_AddRow_Handle(key) }} >
                                                                                                            <i className="dripicons-plus"></i>
                                                                                                        </Button>
                                                                                                    </Col>
                                                                                                    <Col className="mt-3">
                                                                                                        < i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                                                                                           UnitConversionsTab_DeleteRow_Handler(key)
                                                                                                        }} >
                                                                                                        </i>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                                :

                                                                                                < i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                                                                                    UnitConversionsTab_DeleteRow_Handler(key)
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


                                                                <input type="file" name="" id="fileId"
                                                                    onChange={() => imageUploaded()} />
                                                                <br></br>
                                                                {/* <img src={`data:image/png;base64,${image2}`} /> */}

                                                                <Card
                                                                    className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                                                // key={i + "-file"}
                                                                >
                                                                    <div className="p-2">
                                                                        <Row className="align-items-center">
                                                                            <Col className="col-auto">
                                                                                <img
                                                                                    data-dz-thumbnail=""
                                                                                    // height="200"
                                                                                    // width={100}
                                                                                    className="avatar-sm rounded bg-light"
                                                                                    alt={"index.name"}
                                                                                    src={`data:image;base64,${image2}`}

                                                                                />
                                                                            </Col>
                                                                            <Col>
                                                                                <Link
                                                                                    to="#"
                                                                                    className="text-muted font-weight-bold"
                                                                                >
                                                                                    {"IMAGE NAME.name"}
                                                                                </Link>
                                                                                <p className="mb-0">
                                                                                    <strong>{"index.formattedSize"}</strong>
                                                                                </p>
                                                                            </Col>
                                                                        </Row>
                                                                    </div>
                                                                </Card>
                                                                <br></br>
                                                                <br></br>
                                                                <br></br>
                                                                <br></br>

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
                                                                            value={division_dropdown_Select}
                                                                            options={DivisionType_DropdownOptions}
                                                                            onChange={(e) => { DivisionTab_Dropdown_onChange_Handler(e) }}
                                                                        />
                                                                    </FormGroup>
                                                                    <Col sm={1} style={{ marginTop: '28px' }} >
                                                                        {" "}
                                                                        <Button
                                                                            type="button"
                                                                            className="btn btn-sm mt-1 mb-0 btn-light  btn-outline-primary  "
                                                                            onClick={() =>
                                                                                DivisionTab_AddRow_Handle()
                                                                            }
                                                                        >
                                                                            <i className="dripicons-plus "></i>
                                                                        </Button>
                                                                    </Col>
                                                                    <Col sm={3} style={{ marginTop: '28px' }}>
                                                                        {divisionTableData.length > 0 ? (

                                                                            <div className="table-responsive">
                                                                                <Table className="table table-bordered  text-center">
                                                                                    <Thead >
                                                                                        <tr>
                                                                                            <th>Division Type</th>

                                                                                            <th>Action</th>
                                                                                        </tr>
                                                                                    </Thead>
                                                                                    <Tbody  >
                                                                                        {divisionTableData.map((TableValue) => (
                                                                                            <tr >
                                                                                                <td>
                                                                                                    {TableValue.label}
                                                                                                </td>
                                                                                                <td>
                                                                                                    <i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                                                                                        DivisionTab_DeleteRow_Handler(TableValue.value)
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
                                                                {marginTabTable.map((index, key) => {

                                                                    return <Row className="mt-3">
                                                                        <Col className=" col col-10 ">
                                                                            <Row>
                                                                                <FormGroup className=" col col-sm-5 " >
                                                                                    <Label >Price List</Label>
                                                                                    <Select
                                                                                        value={marginTabTable[key].PriceList}
                                                                                        options={PriceList_DropdownOptions}
                                                                                        onChange={(e) => { MarginTab_onChange_Handler(e, key, "PriceList") }}
                                                                                    />
                                                                                </FormGroup>

                                                                                <FormGroup className="mb-3 col col-sm-5 " >
                                                                                    <Label >Margin</Label>
                                                                                    <Input type="text"
                                                                                        value={marginTabTable.Margin}
                                                                                        placeholder="Please Enter Margin"
                                                                                        onChange={(e) => MarginTab_onChange_Handler(e, key, "Margin")}></Input>
                                                                                </FormGroup>


                                                                            </Row>
                                                                        </Col>
                                                                        {(marginTabTable.length === key + 1) ?
                                                                            <Col className="col col-1 mt-3">
                                                                                <Button
                                                                                    className="btn btn-sm mt-3 mb-0 btn-light  btn-outline-primary  "
                                                                                    type="button"
                                                                                    onClick={() => { MarginTab_AddRow_Handler(key) }} >
                                                                                    <i className="dripicons-plus"></i></Button>
                                                                            </Col>
                                                                            : <Col className="col col-1 mt-3">

                                                                                <i


                                                                                    className="mdi mdi-trash-can d-block text-danger font-size-20 mt-3"
                                                                                    onClick={() => {
                                                                                        MarginTab_DeleteRow_Handler(key);
                                                                                    }}
                                                                                ></i>

                                                                            </Col>}
                                                                    </Row>


                                                                })}

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
