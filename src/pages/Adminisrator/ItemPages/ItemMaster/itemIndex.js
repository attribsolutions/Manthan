import React, { useEffect, useState } from "react"
import MetaTags from "react-meta-tags"
import {
    Button,
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
    Table,
    TabPane,
} from "reactstrap"
import { Link, useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames"
import Breadcrumb from "../../../../components/Common/Breadcrumb";
import { AvForm } from "availity-reactstrap-validation"
import Select from "react-select";
import { fetchCompanyList } from "../../../../store/Administrator/CompanyRedux/actions"
import {
    editItemSuccess,
    getBaseUnit_ForDropDown,
    get_CategoryTypes_ForDropDown,
    get_Category_By_CategoryType_ForDropDown,
    get_Category_By_CategoryType_ForDropDownAPI,
    get_Category_By_CategoryType_ForDropDown_Success,
    get_Division_ForDropDown,
    get_ImageType_ForDropDown,
    get_Party_ForDropDown,
    get_PriceList_ForDropDown,
    get_Sub_Category_By_CategoryType_ForDropDown,
    get_Sub_Category_By_CategoryType_ForDropDown_Success,
    postItemData,
    PostItemDataSuccess,
    updateItemID
} from "../../../../store/Administrator/ItemsRedux/action";
import { AlertState, BreadcrumbShow, getCategoryTypelist } from "../../../../store/actions";
import { Tbody, Thead } from "react-super-responsive-table";
import { getPartyListAPI } from "../../../../store/Administrator/PartyRedux/action";
import GSTTab from "./GST_Tab";
import MRPTab from "./MRP_Tab";
import Margin_Tab from "./MarginTab/index";
import GroupTab from "./Group_Tab";
import CategoryTab from "./Category_Tab";
import DivisionTab from "./Division_Tab";

const ItemsMaster = (props) => {
    const dispatch = useDispatch();
    const history = useHistory()


    const [EditData, setEditData] = useState({});
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState('');

    const [activeTab1, setactiveTab1] = useState("1")


    let initial = {
        Name: "",
        Sequence: "",
        ShortName: "",
        BarCode: '',
        Company: [],
        BaseUnit: [],
        Category: [],
        CategoryType: [],
        Division: [],
        MRP: '',
        GST: '',
        HSN: '',
        isActive: true,
    }

    const initialInValid = ["txtName0", "txtShortName0",]
    const [inValidDrop, setInValidDrop] = useState({
        BaseUnit: false,
        Company: false,
        CategoryType: false,
        Category: false,
        Division: false
    })
    let [isValidate, setIsValidate] = useState(initialInValid);

    const [formValue, setFormValue] = useState(initial);
    const [pageRefresh, setpageRefresh] = useState(false);



    const [marginMaster, setMarginMaster] = useState([]);

    const [imageTabTable, setImageTabTable] = useState([{
        ImageType: '',
        ImageUpload: ''
    }]);
    const [baseUnitTableData, setBaseUnitTableData] = useState([{
        Conversion: '',
        Unit: '',
    }]);

    const [Division_Tab_TableData, setDivision_Tab_TableData] = useState([]);

    const [MRP_Tab_TableData, setMRP_Tab_TableData] = useState([]);

    const [Group_Tab_TableData, setGroup_Tab_TableData] = useState([]);

    const [Category_Tab_TableData, setCategory_Tab_TableData] = useState([]);

    const [GStDetailsMaster, setGStDetailsMaster] = useState([]);

    const {
        companyList,
        BaseUnit,
        PostAPIResponse,
        userAccess,
        ImageType,
        Division,
        CategoryTypeList,
        CategoryList
    } = useSelector((state) => ({
        companyList: state.Company.companyList,
        BaseUnit: state.ItemMastersReducer.BaseUnit,
        userAccess: state.Login.RoleAccessUpdateData,
        PostAPIResponse: state.ItemMastersReducer.postMessage,
        ImageType: state.ItemMastersReducer.ImageType,
        Division: state.ItemMastersReducer.Division,
        CategoryTypeList: state.categoryTypeReducer.categoryTypeListData,
        CategoryList: state.ItemMastersReducer.Category,
    }));


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

    useEffect(() => {

        // if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
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

                dispatch(BreadcrumbShow(hasEditVal.Name))

                const editDivision = hasEditVal.ItemDivisionDetails.map(index => ({
                    value: index.Division,
                    label: index.DivisionName
                }))

                const editCategoryType = {
                    value: hasEditVal.ItemCategoryDetails[0].CategoryType,
                    label: hasEditVal.ItemCategoryDetails[0].CategoryTypeName
                }

                const editCategory = hasEditVal.ItemCategoryDetails.map(index => ({
                    value: index.Category,
                    label: index.CategoryName
                }))

                let initialFormValue = {
                    Name: hasEditVal.Name,
                    Sequence: hasEditVal.Sequence,
                    ShortName: hasEditVal.ShortName,
                    BarCode: hasEditVal.BarCode,
                    Company: { label: hasEditVal.CompanyName, value: hasEditVal.Company },
                    CategoryType: editCategoryType,
                    Category: editCategory,
                    Division: editDivision,
                    BaseUnit: { label: hasEditVal.BaseUnitName, value: hasEditVal.BaseUnitID },
                    isActive: hasEditVal.isActive,
                }

                let ItemImagesDetails = hasEditVal.ItemImagesDetails.map((index) => {
                    return {
                        ImageType: {
                            label: index.ImageTypeName,
                            value: index.ImageType
                        },
                        ImageUpload: index.Item_pic
                    }
                })

                const ItemUnitDetails = []
                hasEditVal.ItemUnitDetails.filter((index) => {
                    if (!(hasEditVal.BaseUnitID === index.UnitID)) {
                        ItemUnitDetails.push({
                            Unit: {
                                label: index.UnitName,
                                value: index.UnitID,
                            },
                            Conversion: index.BaseUnitQuantity,
                        })
                    }
                });
                
                if(ItemUnitDetails.length===0){
                    ItemUnitDetails.push({
                        Unit: '',
                        Conversion: '',
                    })
                };

                setFormValue(initialFormValue);
                setImageTabTable(ItemImagesDetails)
                setBaseUnitTableData(ItemUnitDetails)
                setMRP_Tab_TableData(hasEditVal.ItemMRPDetails)
                setMarginMaster(hasEditVal.ItemMarginDetails)
                setGStDetailsMaster(hasEditVal.ItemGSTHSNDetails)
                setGroup_Tab_TableData(hasEditVal.ItemGroupDetails)
                setCategory_Tab_TableData(hasEditVal.ItemCategoryDetails)

                dispatch(editItemSuccess({ Status: false }))

            }
        }

    }, [])


    useEffect(() => {

        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
            dispatch(PostItemDataSuccess({ Status: false }))

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
                    RedirectPath: '/ItemList',
                }))
            }
        }

        else if (PostAPIResponse.Status === true) {
            dispatch(PostItemDataSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(PostAPIResponse.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [PostAPIResponse])

    useEffect(() => {
        dispatch(fetchCompanyList());
        dispatch(getBaseUnit_ForDropDown());
        dispatch(get_CategoryTypes_ForDropDown());
        dispatch(getPartyListAPI());
        dispatch(get_ImageType_ForDropDown());
        dispatch(get_Division_ForDropDown());
        dispatch(get_Party_ForDropDown());
        dispatch(get_PriceList_ForDropDown());
        dispatch(getCategoryTypelist());
        dispatch(get_Category_By_CategoryType_ForDropDownAPI());
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

    let BaseUnit_DropdownOptions2 = []
    BaseUnit.forEach(myFunction);
    function myFunction(item, index, arr) {
        if (!(formValue.BaseUnit.label === item.Name)) {
            BaseUnit_DropdownOptions2[index] = {
                value: item.id,
                label: item.Name
            };
        }
    }

    const CategoryTypeList_DropdownOptions = CategoryTypeList.map((data) => ({
        value: data.id,
        label: data.Name,
    }));

    const CategoryList_DropdownOptions = CategoryList.map((data) => ({
        value: data.id,
        label: data.Name,
    }));


    const ImageType_DropdownOptions = ImageType.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const Division_DropdownOptions = Division.map((data) => ({
        value: data.id,
        label: data.Name
    }));


    function dropDownValidation(event, type,) {

        let returnVal = event.value === ''
        if (returnVal) {
            inValidDrop[type] = true
            return
        } else {
            formValue[type] = event
            inValidDrop[type] = false

        }
        setpageRefresh(!pageRefresh)
    }

    function Common_Drop_Validation(event, type, key) {

        let OnchangeControl = document.getElementById(`drop${type}-${key}`)
        if (event.value === 0) {
            OnchangeControl.className = 'form-control is-invalid'
            return false
        } else {
            OnchangeControl.className = '';
            return true
        }

    }
    function Common_Text_INPUT_Validation(value, type, key) {

        let OnchangeControl = document.getElementById(`txt${type}${key}`)

        if (value === '') {
            OnchangeControl.className = 'form-control is-invalid'
            return false
        } else {
            OnchangeControl.className = 'form-control';
            return true
        }
    }
    function CommonTab_SimpleText_INPUT_handller_ForAll(event, type, key) {

        let validateReturn = Common_Text_INPUT_Validation(event, type, 0);

        if (validateReturn === false) {
            isValidate.push(`txt${type}0`)
            return
        } else {

            formValue[type] = event
            isValidate = isValidate.filter((indF) => {
                return !(indF === `txt${type}0`)
            })
            setIsValidate(isValidate)
        }

    }

    function Common_DropDown_handller_ForAll(event, type, key) {

        let returnVal = Common_Drop_Validation(event, type, key)
        if (returnVal === '') {

            isValidate.push(`drop${type}-${key}`)
            return
        } else {
            formValue[type] = event
            isValidate = isValidate.filter((indFind) => {
                return !(indFind === `drop${type}-${key}`)
            })
            setIsValidate(isValidate)
        }

    }

    function UnitConversionsTab_AddRow_Handle() {

        let key = baseUnitTableData.length - 1
        let unit_TableElement = baseUnitTableData[key];

        let validateReturn = Common_Drop_Validation(unit_TableElement.Unit, "Unit", key);
        let validateReturn1 = Common_Text_INPUT_Validation(unit_TableElement.Conversion, "Conversion", key)
        if ((validateReturn1 === false) || (validateReturn === false)) return;

        var newarr = [...baseUnitTableData, {
            Conversion: '',
            Unit: '',
        }]
        setBaseUnitTableData(newarr)
    }
    function UnitConversionsTab_DeleteRow_Handler(key) {

        var removeElseArrray = baseUnitTableData.filter((i, k) => {
            return !(k === key)
        })

        setBaseUnitTableData(removeElseArrray)

    }
    function UnitConversionsTab_BaseUnit2_onChange_Handller(event, type, key,) {

        let newSelectValue = ''

        var found = baseUnitTableData.find((i, k) => {
            return (k === key)
        })

        if (type === "Conversion") {
            let validateReturn = Common_Text_INPUT_Validation(event, type, key);
            if (validateReturn === false) return;

            newSelectValue = {
                Conversion: event.target.value,
                Unit: found.Unit,
            }
        }
        else if (type === 'Unit') {
            // if(event.label===formValue.){ }
            const foundDublicate = baseUnitTableData.find((element) => {
                return (element[type].value === event.value)
            });
            if (!(foundDublicate === undefined)) {
                dispatch(AlertState({
                    Type: 4,
                    Status: true,
                    Message: "Unit already Select",
                }))
                return
            }
            let validateReturn = Common_Drop_Validation(event, type, key,)
            if (validateReturn === false) return;

            newSelectValue = {
                Conversion: found.Conversion,
                Unit: event,
            }
        }

        let newTabArr = baseUnitTableData.map((index, k) => {
            return (k === key) ? newSelectValue : index
        })
        setBaseUnitTableData(newTabArr)
        // setBaseUnit_dropdown_Select2(e)
    }

    function ImageTab_AddRow_Handler(key) {


        var newarr1 = [...imageTabTable, {
            ImageType: { value: 0, label: "select" },
            ImageUpload: {}
        }]
        setImageTabTable(newarr1)
    }
    function ImageTab_DeleteRow_Handler(key) {
        var removeElseArrray1 = imageTabTable.filter((i, k) => {
            return !(k === key)
        })
        setImageTabTable(removeElseArrray1)
    }
    function ImageTab_onChange_Handler(event, key, type) {

        var found = imageTabTable.find((i, k) => {
            return (k === key)
        })
        let newSelectValue = ''

        if (type === "ImageType") {
            const foundDublicate = imageTabTable.find((element) => {
                return (element[type].value === event.value)
            });
            if (!(foundDublicate === undefined)) {
                dispatch(AlertState({
                    Type: 4,
                    Status: true,
                    Message: "PriceList Already Select",
                }))
                return
            }
            newSelectValue = {
                ImageType: event,
                ImageUpload: found.ImageUpload,
            }
        }
        else if (type === 'ImageUpload') {
            newSelectValue = {
                ImageType: found.ImageType,
                ImageUpload: event.target.value,
            }
        }

        let newTabArr = imageTabTable.map((index, k) => {
            return (k === key) ? newSelectValue : index
        })
        setImageTabTable(newTabArr)
    }


    const CategoryType_Handler = (event) => {
        dropDownValidation(event, "CategoryType")
        // setCategoryTypeDropdownSelect(event);
        dispatch(get_Category_By_CategoryType_ForDropDownAPI(event.value))
    };

    const Category_Handler = (event) => {
        // setcategoryDropdownSelect(event);
        dropDownValidation(event, "Category")

    };

    const Division_Handler = (event) => {
        dropDownValidation(event, "Division")
        // setDivision_dropdown_Select(event);

    };

    const handleValidSubmit = (event, values) => {

        let isvalid = true
        let inValidMsg = []

        if (formValue.Name === '') {
            document.getElementById("txtName0").className = "form-control is-invalid"
            inValidMsg.push("Name: Is Requried")
            isvalid = false
        }
        if (formValue.ShortName === '') {
            document.getElementById("txtShortName0").className = "form-control is-invalid"
            isvalid = false
            inValidMsg.push("ShortName: Is Requried")
        }
        if (formValue.Company.length < 1) {
            inValidDrop.Company = true
            isvalid = false
            inValidMsg.push("Company: Is Requried")
        }
        if (formValue.BaseUnit.length < 1) {
            inValidDrop.BaseUnit = true
            isvalid = false
            inValidMsg.push("BaseUnit: Is Requried")

        }
        if (formValue.CategoryType.length < 1) {
            inValidDrop.CategoryType = true
            isvalid = false
            inValidMsg.push("CategoryType: Is Requried")
        }
        if (formValue.Category.length < 1) {
            inValidDrop.Category = true
            isvalid = false
            inValidMsg.push("Category: Is Requried")

        }

        if (formValue.Division.length < 1) {
            inValidDrop.Division = true
            isvalid = false
            inValidMsg.push("Division:Is Requried")
        }
        if (!Group_Tab_TableData.length > 0) {
            isvalid = false
            inValidMsg.push(" GroupType Primary:Is Requried")
        }
        else {
            const found = Group_Tab_TableData.find(element => {
                return element.GroupTypeName === "Primary"
            });
            if (found === undefined) {
                isvalid = false;
                inValidMsg.push(" GroupType Primary:Is Requried")
            }
        }
        if (isvalid) {

            const itemUnitDetails = baseUnitTableData.map((index) => ({
                BaseUnitQuantity: index.Conversion,
                UnitID: index.Unit.value,
            }))
            const islastIndex = itemUnitDetails.length

            if (islastIndex === 1) {
                itemUnitDetails[itemUnitDetails.length - 1] = {
                    BaseUnitQuantity: 1,
                    UnitID: formValue.BaseUnit.value,
                }
            } else if (islastIndex === 0) {
                itemUnitDetails.unshift({
                    BaseUnitQuantity: 1,
                    UnitID: formValue.BaseUnit.value,
                })
            }
            const ItemCategoryDetails = formValue.Category.map((index) => ({
                CategoryType: formValue.CategoryType.value,
                Category: index.value
            }))

            let hasAdd_MRP = []
            MRP_Tab_TableData.forEach((index) => {
                if (index.IsAdd === true) { hasAdd_MRP.push(index) }
            })
            let hasAdd_Margin = []
            marginMaster.forEach((index) => {
                if (index.IsAdd === true) { hasAdd_Margin.push(index) }
            })

            let hasAdd_GST = []
            GStDetailsMaster.forEach((index) => {
                if (index.IsAdd === true) { hasAdd_GST.push(index) }
            })


            const jsonBody = JSON.stringify({
                Name: formValue.Name,
                ShortName: formValue.ShortName,
                Sequence: formValue.Sequence,
                BarCode: formValue.BarCode,
                isActive: formValue.isActive,
                Company: formValue.Company.value,
                BaseUnitID: formValue.BaseUnit.value,
                CreatedBy: 1,
                UpdatedBy: 1,
                ItemCategoryDetails: ItemCategoryDetails,

                ItemUnitDetails: itemUnitDetails,

                ItemDivisionDetails: formValue.Division.map((i) => {
                    return ({ Division: i.value })
                }),
                ItemImagesDetails: [
                    {
                        ImageType: "1",
                        Item_pic: "sadsadasdas"
                    }
                ],
                ItemMRPDetails: hasAdd_MRP,
                ItemMarginDetails: hasAdd_Margin,
                ItemGSTHSNDetails: hasAdd_GST,
                ItemGroupDetails: Group_Tab_TableData,

            });

            if (pageMode === 'edit') {
                dispatch(updateItemID(jsonBody, EditData.id));
                console.log("edit json", jsonBody)
            }

            else {
                dispatch(postItemData(jsonBody));
                // console.log("post json", jsonBody)
            }
        }
        else {
            dispatch(AlertState({
                Type: 4, Status: true,
                Message: JSON.stringify(inValidMsg),
                // Message: (inValidMsg),
                RedirectPath: false,
                PermissionAction: false,
            }));
        }

    };

    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <MetaTags>
                        <title>Item Master| FoodERP-React FrontEnd</title>
                    </MetaTags>
                    <Container fluid>
                        <AvForm onValidSubmit={(e, v) => { handleValidSubmit(e, v); }}>
                            {/* Render Breadcrumbs */}
                            <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />

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
                                                        <span className="d-none d-sm-block">Basic Info</span>
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
                                                        <span className="d-none d-sm-block">Item Group</span>

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
                                                        <span className="d-none d-sm-block">Unit Conversions</span>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        id="nave-link-5"
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
                                                        id="nave-link-5"
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
                                                        <span className="d-none d-sm-block">MRP</span>
                                                    </NavLink>
                                                </NavItem>

                                                <NavItem>
                                                    <NavLink
                                                        id="nave-link-6"
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
                                                        <span className="d-none d-sm-block">Margin</span>
                                                    </NavLink>
                                                </NavItem>

                                                <NavItem>
                                                    <NavLink
                                                        id="nave-link-7"
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
                                                        <span className="d-none d-sm-block">GST Details</span>
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
                                                                        <Input type="text" id='txtName0'
                                                                            placeholder=" Please Enter Name "
                                                                            defaultValue={EditData.Name}
                                                                            autoComplete="off"
                                                                            // onChange={(e) => { dispatch(BreadcrumbShow(e.target.value)) }}
                                                                            onChange={(e) => {
                                                                                dispatch(BreadcrumbShow(e.target.value));
                                                                                CommonTab_SimpleText_INPUT_handller_ForAll(e.target.value, "Name")
                                                                            }}

                                                                        />
                                                                    </FormGroup>

                                                                    <FormGroup className="mb-3 col col-sm-4 " >
                                                                        <Label >ShortName</Label>
                                                                        <Input type="text"
                                                                            id='txtShortName0'
                                                                            className=""
                                                                            defaultValue={EditData.ShortName}
                                                                            placeholder=" Please Enter ShortName "
                                                                            autoComplete="off"
                                                                            onChange={(e) => { CommonTab_SimpleText_INPUT_handller_ForAll(e.target.value, "ShortName") }}
                                                                        // onChange={(e) => { formValue.ShortName = e.target.value }}
                                                                        />
                                                                    </FormGroup>

                                                                    <FormGroup className=" col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom21">Company</Label>
                                                                        <Select
                                                                            id='dropCompany-0'
                                                                            value={formValue.Company}
                                                                            options={Company_DropdownOptions}
                                                                            styles={{
                                                                                control: base => ({
                                                                                    ...base,
                                                                                    border: inValidDrop.Company ? '1px solid red' : '',

                                                                                })
                                                                            }}
                                                                            onChange={(event) => dropDownValidation(event, "Company")}
                                                                        />
                                                                    </FormGroup>

                                                                </Row>

                                                                <Row>
                                                                    <FormGroup className=" col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom21">Base Unit</Label>
                                                                        <Select
                                                                            id='dropBaseUnit-0'
                                                                            value={formValue.BaseUnit}
                                                                            options={BaseUnit_DropdownOptions}
                                                                            isDisabled={pageMode==="edit"?true:false}
                                                                            styles={{
                                                                                control: base => ({
                                                                                    ...base,
                                                                                    border: inValidDrop.BaseUnit ? '1px solid red' : '',

                                                                                })
                                                                            }}
                                                                            onChange={(event) => dropDownValidation(event, "BaseUnit")}
                                                                        />
                                                                    </FormGroup>

                                                                    <FormGroup className="mb-3 col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom01">BarCode</Label>
                                                                        <Input
                                                                            id='txtBarCode0'
                                                                            placeholder=" Please Enter BarCode "
                                                                            defaultValue={EditData.BarCode}
                                                                            autoComplete="off"
                                                                            onChange={(e) => { CommonTab_SimpleText_INPUT_handller_ForAll(e.target.value, "BarCode") }}
                                                                        />
                                                                    </FormGroup>

                                                                    <FormGroup className="mb-3 col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom01">Sequence</Label>
                                                                        <Input
                                                                            id='txtSequence0'
                                                                            defaultValue={EditData.Sequence}
                                                                            placeholder=" Please Enter Sequence "
                                                                            autoComplete="off"
                                                                            onChange={(e) => { CommonTab_SimpleText_INPUT_handller_ForAll(e.target.value, "Sequence") }}
                                                                        // onChange={(e) => { formValue.Sequence = e.target.value }}
                                                                        />

                                                                    </FormGroup>
                                                                </Row>

                                                                <Row>
                                                                    <FormGroup className="mb-3 col col-sm-4 ">
                                                                        <Label>Category Type</Label>
                                                                        <Select
                                                                            id={`dropCategoryType-${0}`}
                                                                            value={formValue.CategoryType}
                                                                            options={CategoryTypeList_DropdownOptions}
                                                                            styles={{
                                                                                control: base => ({
                                                                                    ...base,
                                                                                    border: inValidDrop.CategoryType ? '1px solid red' : '',

                                                                                })
                                                                            }}
                                                                            onChange={(e) => { CategoryType_Handler(e) }}
                                                                        />
                                                                    </FormGroup>


                                                                    <FormGroup className="mb-3 col col-sm-4 ">

                                                                        <Label className="form-label font-size-13 ">Category</Label>
                                                                        <Select
                                                                            defaultValue={formValue.Category}
                                                                            isMulti={true}
                                                                            className="basic-multi-select"
                                                                            options={CategoryList_DropdownOptions}
                                                                            styles={{
                                                                                control: base => ({
                                                                                    ...base,
                                                                                    border: inValidDrop.Category ? '1px solid red' : '',

                                                                                })
                                                                            }}
                                                                            onChange={(e) => { Category_Handler(e) }}
                                                                            classNamePrefix="select2-selection"
                                                                        />
                                                                    </FormGroup>

                                                                </Row>

                                                                <Row>
                                                                    <FormGroup className="mb-3 col col-sm-4 ">
                                                                        <div className="mb-3">
                                                                            <Label className="form-label font-size-13 ">Division</Label>
                                                                            <Select
                                                                                defaultValue={formValue.Division}
                                                                                isMulti={true}
                                                                                className="basic-multi-select"
                                                                                options={Division_DropdownOptions}
                                                                                styles={{
                                                                                    control: base => ({
                                                                                        ...base,
                                                                                        border: (inValidDrop.Division) ? '1px solid red' : '',

                                                                                    })
                                                                                }}
                                                                                onChange={(e) => { Division_Handler(e) }}
                                                                                classNamePrefix="select2-selection"
                                                                            />
                                                                        </div>
                                                                    </FormGroup>
                                                                    <FormGroup className="mt-4 col col-md-5">
                                                                        <Row className="justify-content-ml-left ">
                                                                            <Label htmlFor="horizontal-firstname-input"
                                                                                className="col-md-2 col-form-label" >Active </Label>
                                                                            <Col md={6} style={{ marginTop: '9px' }} >

                                                                                <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                                                                    <Input type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                                                                        defaultChecked={formValue.isActive}
                                                                                        onChange={(e) => { formValue.isActive = e.target.checked }}

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
                                                    <Row>
                                                        <Col md={12}  >
                                                            <Row className="mt-3">
                                                                <Col className=" col col-12 ">
                                                                    <GroupTab tableData={Group_Tab_TableData} func={setGroup_Tab_TableData} />
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </TabPane>
                                                <TabPane tabId="3">
                                                    <Col md={12}>
                                                        <Row>
                                                            <Col md={12}  >
                                                                <Card className="text-black">
                                                                    <CardBody style={{ backgroundColor: "whitesmoke" }}>

                                                                        <Row>
                                                                            <FormGroup className=" col col-sm-4 " >
                                                                                <Label >Base Unit</Label>
                                                                                <Select
                                                                                    id={`dropBaseUnit-0`}
                                                                                    placeholder="Select..."
                                                                                    value={formValue.BaseUnit}
                                                                                    isDisabled={pageMode==="edit"?true:false}
                                                                                    options={BaseUnit_DropdownOptions}
                                                                                    onChange={(e) => Common_DropDown_handller_ForAll(e, "BaseUnit", 0)}
                                                                                />
                                                                            </FormGroup>
                                                                        </Row>

                                                                        {!(formValue.BaseUnit.value === 0)
                                                                            ? <Row className="mt-3">
                                                                                <Col md={8}><Table className="table table-bordered  ">
                                                                                    <Thead >
                                                                                        <tr>
                                                                                            <th className="col-sm-3">Unit Name</th>
                                                                                            <th className="col-sm-3 text-center">Conversion To Base Unit </th>
                                                                                            <th className="col-sm-2">Action</th>
                                                                                        </tr>
                                                                                    </Thead>
                                                                                    <Tbody  >
                                                                                        {baseUnitTableData.map((TableValue, key) => (
                                                                                          
                                                                                                    <tr >
                                                                                                        <td>
                                                                                                            <Row>
                                                                                                                <Label className=" col-sm-2 col-form-label">1</Label>
                                                                                                                <Col md={7}>
                                                                                                                    <Select
                                                                                                                        id={`dropUnit-${key}`}
                                                                                                                        placeholder="Select..."
                                                                                                                        defaultValue={baseUnitTableData[key].Unit}
                                                                                                                        options={BaseUnit_DropdownOptions2}
                                                                                                                        onChange={(e) => UnitConversionsTab_BaseUnit2_onChange_Handller(e, "Unit", key)}
                                                                                                                    />
                                                                                                                </Col>
                                                                                                                < Label className=" col-sm-3 col-form-label">=</Label>
                                                                                                            </Row>
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <Row>
                                                                                                                <Col>
                                                                                                                    <Input
                                                                                                                        type="text"
                                                                                                                        id={`txtConversion${key}`}
                                                                                                                        placeholder="Select..."
                                                                                                                        autoComplete="off"
                                                                                                                        value={baseUnitTableData[key].Conversion}
                                                                                                                        onChange={(e) => UnitConversionsTab_BaseUnit2_onChange_Handller(e, "Conversion", key,)}>

                                                                                                                    </Input>
                                                                                                                </Col>
                                                                                                                <Label className=" col-sm-4 col-form-label"> {formValue.BaseUnit.label}</Label>
                                                                                                            </Row>
                                                                                                        </td>

                                                                                                        <td>
                                                                                                            {(baseUnitTableData.length === key + 1) ?
                                                                                                                <Row className="">
                                                                                                                    <Col md={6} className=" mt-3">
                                                                                                                        {(baseUnitTableData.length > 1) ? <>
                                                                                                                            < i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                                                                                                                UnitConversionsTab_DeleteRow_Handler(key)
                                                                                                                            }} >
                                                                                                                            </i>
                                                                                                                        </> : <Col md={6} ></Col>}

                                                                                                                    </Col>

                                                                                                                    <Col md={6} >
                                                                                                                        <Button className="btn btn-sm btn-light mt-3   align-items-sm-end"
                                                                                                                            type="button"
                                                                                                                            onClick={() => { UnitConversionsTab_AddRow_Handle(key) }} >
                                                                                                                            <i className="dripicons-plus"></i>
                                                                                                                        </Button>
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
                                                                                </Table>
                                                                                </Col>
                                                                            </Row>
                                                                            :
                                                                            <Row className="mt-3">
                                                                                <br></br>
                                                                                <Label className="text-danger">Please select BaseUnit</Label></Row>}
                                                                    </CardBody>
                                                                </Card>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </TabPane>

                                                <TabPane tabId="4">
                                                    <Col md={12} >
                                                        <Card className="text-black">
                                                            <CardBody style={{ backgroundColor: "whitesmoke" }}>

                                                                {imageTabTable.map((index, key) => {
                                                                    return <Row className=" col col-sm-11" >
                                                                        <FormGroup className="mb-3 col col-sm-4 " >
                                                                            <Label htmlFor="validationCustom21">Image Type</Label>
                                                                            <Select
                                                                                value={imageTabTable[key].ImageType}
                                                                                options={ImageType_DropdownOptions}
                                                                                onChange={(e) => { ImageTab_onChange_Handler(e, key, "ImageType") }}
                                                                            />
                                                                        </FormGroup>

                                                                        <FormGroup className="mb-3 col col-sm-4 " >
                                                                            <Label >Upload</Label>
                                                                            <Input type="file" className="form-control col col-sm-4 "
                                                                                value={imageTabTable.ImageUpload}
                                                                                // value={"C:\fakepath\cropper.jpg"}
                                                                                onChange={(e) => ImageTab_onChange_Handler(e, key, "ImageUpload")} />
                                                                        </FormGroup>


                                                                        <Col md={1}>
                                                                            {(imageTabTable.length === key + 1) ?
                                                                                <Row className=" mt-3">
                                                                                    <Col md={6} className=" mt-3">
                                                                                        {(imageTabTable.length > 1)
                                                                                            ?
                                                                                            < i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                                                                                ImageTab_DeleteRow_Handler(key)
                                                                                            }} >
                                                                                            </i>
                                                                                            : <Col md={6} ></Col>
                                                                                        }

                                                                                    </Col>

                                                                                    <Col md={6}>
                                                                                        <Button className="btn btn-sm mt-3 btn-light  btn-outline-primary  align-items-sm-end"
                                                                                            type="button"
                                                                                            onClick={() => { ImageTab_AddRow_Handler(key) }} >
                                                                                            <i className="dripicons-plus"></i>Add
                                                                                        </Button>
                                                                                    </Col>
                                                                                </Row>
                                                                                :
                                                                                <Row className="mt-3">
                                                                                    < i className="mdi mdi-trash-can d-block text-danger font-size-20 mt-3" onClick={() => {
                                                                                        ImageTab_DeleteRow_Handler(key)
                                                                                    }} >
                                                                                    </i>
                                                                                </Row>
                                                                            }

                                                                        </Col>
                                                                    </Row>
                                                                })}
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                    <Row>
                                                    </Row>
                                                </TabPane>

                                                <TabPane tabId="5">
                                                    <Row>
                                                        <Col md={12}  >
                                                            <Row className="mt-3">
                                                                <Col className=" col col-12 ">
                                                                    <MRPTab tableData={MRP_Tab_TableData} func={setMRP_Tab_TableData} />
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </TabPane>

                                                <TabPane tabId="6">

                                                    <Row>
                                                        <Col md={12}  >
                                                            <Row className="mt-3">
                                                                <Col className=" col col-12 ">
                                                                    <Margin_Tab tableData={marginMaster} func={setMarginMaster} />
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>

                                                </TabPane>

                                                <TabPane tabId="7">
                                                    <Row>
                                                        <Col md={12}  >
                                                            <Row className="mt-3">
                                                                <Col className=" col col-12 ">
                                                                    <GSTTab tableData={GStDetailsMaster} func={setGStDetailsMaster} />
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </TabPane>
                                            </TabContent>
                                            <Row >
                                                <Col sm={2}>
                                                    <div className="">
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
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};
export default ItemsMaster;




