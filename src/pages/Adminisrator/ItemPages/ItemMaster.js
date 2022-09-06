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

import { Link, useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames"
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { AvField, AvForm, AvInput } from "availity-reactstrap-validation"
import Select from "react-select";
import { fetchCompanyList } from "../../../store/Administrator/CompanyRedux/actions"
import {
    getBaseUnit_ForDropDown,
    get_CategoryTypes_ForDropDown,
    get_Category_By_CategoryType_ForDropDown,
    get_Category_ForDropDown,
    get_ImageType_ForDropDown,
    get_MRPTypes_ForDropDown,
    get_SubCategory_ForDropDown,
    get_Sub_Category_By_CategoryType_ForDropDown,
    postItemData,
    PostItemDataSuccess
} from "../../../store/Administrator/ItemsRedux/action";
import Dropzone from "react-dropzone";
import { AlertState, BreadcrumbShow } from "../../../store/actions";
import { Tbody, Thead } from "react-super-responsive-table";
import { getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";

const ItemsMaster = (props) => {
    const dispatch = useDispatch();
    const history = useHistory()

    //*** "isEditdata get all data from ModuleID for Binding  Form controls
    let editDataGatingFromList = props.state;
    let pageModeProps = props.pageMode

    const [EditData, setEditData] = useState([]);
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState(11);
    const [selectedFiles, setselectedFiles] = useState([])

    const [activeTab1, setactiveTab1] = useState("1")

    const [division_dropdown_Select, setDivision_dropdown_Select] = useState("");

    let initial = {
        Name: "",
        Sequence: "",
        ShortName: "",
        BarCode: { label: "" },
        Company: "",
        BaseUnit: '',
        MRP: '',
        GST: '',
        HSN: '',
        isActive: true,
    }

    const initialInValid = ["txtName0", "txtShortName0", "txtBarCode0", "dropBaseUnit-0", "dropCompany-0", "txtSequence0"]
    let [isValidate, setIsValidate] = useState(initialInValid);
    let [refresh, setrefresh] = useState('');

    const [formValue, setFormValue] = useState(initial);


    // categoryTabTable
    const [categoryTabTable, setCategoryTabTable] = useState([{
        CategoryType: { label: 'select', value: 0 },
        CategoryTypeOption: [],
        Category: { label: 'select', value: 0 },
        SubCategory: { label: 'select', value: 0 },

        Category_DropdownOptions: [],
        SubCategory_DropdownOptions: []
    }]);




    const [marginTabTable, setMarginTabTable] = useState([{
        PriceList: { label: "selectPrice", value: 0 },
        Margin: ''
    }]);

    const [divisionTableData, setDivisionTableData] = useState([]);

    const [imageTabTable, setImageTabTable] = useState([{
        ImageType: '',
        ImageUpload: ''
    }]);
    const [baseUnitTableData, setBaseUnitTableData] = useState([{
        Conversion: '',
        Unit: { label: "", value: 0 },
    }]);
    const [rateDetailTableData, setRateDetailTableData] = useState([{
        MRP: '',
        GSTPercentage: '',
        HSNCode: '',
        MRPType: { value: 0, label: "select" }
    }]);

    const { companyList,
        BaseUnit,
        CategoryType,
        Category,
        SubCategory,
        DivisionType,
        PostAPIResponse,
        RoleAccessModifiedinSingleArray,
        ImageType,
        MRPType
    } = useSelector((state) => ({
        companyList: state.Company.companyList,
        BaseUnit: state.ItemMastersReducer.BaseUnit,
        CategoryType: state.ItemMastersReducer.CategoryType,
        Category: state.ItemMastersReducer.CategoryByCategoryType,
        SubCategory: state.ItemMastersReducer.SubCategoryByCategoryType,
        DivisionType: state.PartyMasterReducer.partyList,
        RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
        PostAPIResponse: state.ItemMastersReducer.postMessage,
        ImageType: state.ItemMastersReducer.ImageType,
        MRPType: state.ItemMastersReducer.MRPType,
    }));


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
    useEffect(() => {

        if (!(userPageAccessState === '')) { document.getElementById("txtName0").focus(); }


        if (!(editDataGatingFromList === undefined)) {
            let editMode_Data = editDataGatingFromList
            setPageMode(pageModeProps);
            dispatch(BreadcrumbShow(editMode_Data.Name))

            //   setEditData(editDataGatingFromList);

            let initialFormValue = {
                Name: editMode_Data.Name,
                Sequence: editMode_Data.Sequence,
                ShortName: editMode_Data.ShortName,
                BarCode: editMode_Data.BarCode,
                Company: { label: editMode_Data.CompanyName, value: editMode_Data.CompanyName },
                BaseUnit: { label: editMode_Data.BaseUnitID, value: editMode_Data.BaseUnitName },
                isActive: true,
            }
            let initialCategory = editMode_Data.ItemCategoryDetails.map((indx) => {
                return {
                    CategoryType: {
                        label: indx.CategoryTypeName,
                        value: indx.CategoryType
                    },
                    CategoryTypeOption: [],
                    Category: {
                        label: indx.CategoryName,
                        value: indx.Category
                    },
                    SubCategory: {
                        label: indx.SubCategoryName,
                        value: indx.SubCategory
                    },

                    Category_DropdownOptions: [],
                    SubCategory_DropdownOptions: []
                }
            })

            setFormValue(initialFormValue);
            setCategoryTabTable(initialCategory)

        }

    }, [editDataGatingFromList]);

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
        // dispatch(get_Category_By_CategoryType_ForDropDown());
        // dispatch(get_Sub_Category_By_CategoryType_ForDropDown());
        dispatch(getPartyListAPI());
        dispatch(get_ImageType_ForDropDown());
        dispatch(get_MRPTypes_ForDropDown());

    }, [dispatch]);


    useEffect(() => {

        let key = Category.key
        if ((key === null)) return;

        let Category_DropdownOptions = Category.Data.map((data) => ({
            value: data.id,
            label: data.Name
        }));

        var found = categoryTabTable.find((i, k) => {
            return (k === key)
        })

        let newSelectValue = {
            CategoryType: found.CategoryType,
            Category: found.Category,
            SubCategory: found.SubCategory,
            Category_DropdownOptions: Category_DropdownOptions,
            SubCategory_DropdownOptions: []
        }

        let newTabArr = categoryTabTable.map((index, k) => {
            return (k === key) ? newSelectValue : index
        })
        setCategoryTabTable(newTabArr)

    }, [Category]);

    useEffect(() => {

        let key = SubCategory.key
        if ((key === null)) return;

        let SubCategory_DropdownOptions = SubCategory.Data.map((data) => ({
            value: data.id,
            label: data.Name
        }));

        var found = categoryTabTable.find((i, k) => {
            return (k === key)
        })

        let newSelectValue = {
            CategoryType: found.CategoryType,
            Category: found.Category,
            SubCategory: found.SubCategory,
            Category_DropdownOptions: found.Category_DropdownOptions,
            SubCategory_DropdownOptions: SubCategory_DropdownOptions,
        }

        let newTabArr = categoryTabTable.map((index, k) => {
            return (k === key) ? newSelectValue : index
        })
        setCategoryTabTable(newTabArr)

    }, [SubCategory]);



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


    const DivisionType_DropdownOptions = DivisionType.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const ImageType_DropdownOptions = ImageType.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const MRPType_DropdownOptions = MRPType.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function Common_Drop_Validation(event, type, key) {
        debugger
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

        if (validateReturn === true) {
            isValidate.push(`txt${type}0`)
            return
        } else {

            isValidate = isValidate.filter((indF) => {
                formValue[`txt${type}0`] = event.target.value
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
            isValidate = isValidate.filter((indFind) => {
                formValue[type] = event
                return !(indFind === `drop${type}-${key}`)
            })
            setIsValidate(isValidate)
        }

        setrefresh(event)
    }

    function CategoryType_Dropdown_Handler(e, key) {
        CategoryTab_Common_onChange_Handller(e, "CategoryType", key,);
        dispatch(get_Category_By_CategoryType_ForDropDown
            (e.value, key))
    }

    function Category_Dropdown_Handler(e, key) {
        CategoryTab_Common_onChange_Handller(e, "Category", key,);
        dispatch(get_Sub_Category_By_CategoryType_ForDropDown(e.value, key))
    }

    function CategoryTab_AddRow_Handler() {

        let key = categoryTabTable.length - 1
        let cat_TableElement = categoryTabTable[key];
        let valid = true;

        let arr = ["CategoryType", "Category", "SubCategory"];
        arr.map((label) => {
            var valid11 = Common_Drop_Validation(cat_TableElement[label], label, key,)
            if (!valid11) { valid = valid11 }
        })

        if (valid === false) {
            return
        }

        var newarr = [...categoryTabTable, {
            CategoryType: { value: 0, label: "select" },
            Category: { value: 0, label: "select" },
            SubCategory: { value: 0, label: "select" },
            Category_DropdownOptions: [],
            SubCategory_DropdownOptions: []
        }]
        setCategoryTabTable(newarr)
    }
    function CategoryTab_DeleteRow_Handler(key) {

        var removeElseArrray = categoryTabTable.filter((i, k) => {
            return !(k === key)
        })

        setCategoryTabTable(removeElseArrray)

    }
    function CategoryTab_Common_onChange_Handller(event, type, key) {

        let validateReturn = Common_Drop_Validation(event, type, key);
        if (validateReturn === false) return;


        var found = categoryTabTable.find((i, k) => {
            return (k === key)
        })

        let newSelectValue = ''

        if (type === "CategoryType") {
            newSelectValue = {
                CategoryType: event,
                Category: { label: 'select', value: 0 },
                SubCategory: { label: 'select', value: 0 },
                Category_DropdownOptions: [],
                SubCategoryOption: []
            }
        }
        else if (type === 'Category') {
            newSelectValue = {
                CategoryType: found.CategoryType,
                Category: event,
                SubCategory: { label: 'select', value: 0 },
                Category_DropdownOptions: found.Category_DropdownOptions,
                SubCategory_DropdownOptions: []
            }
        }
        else {
            newSelectValue = {
                CategoryType: found.CategoryType,
                Category: found.Category,
                SubCategory: event,
                Category_DropdownOptions: found.Category_DropdownOptions,
                SubCategory_DropdownOptions: found.SubCategory_DropdownOptions
            }
        }

        let newTabArr = categoryTabTable.map((index, k) => {
            return (k === key) ? newSelectValue : index
        })
        setCategoryTabTable(newTabArr)
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

    function MarginTab_AddRow_Handler(key) {

        let margin_TableElement = marginTabTable[key];
        debugger
        let validateReturn = Common_Drop_Validation(margin_TableElement.PriceList, "PriceList", key);
        let validateReturn1 = Common_Text_INPUT_Validation(margin_TableElement.Margin, "Margin", key)
        if ((validateReturn1 === false) || (validateReturn === false)) return;

        var newarr1 = [...marginTabTable, {
            PriceList: { label: "selectPrice", value: 0 },
            Margin: ''
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

            let validateReturn = Common_Drop_Validation(event, type, key,)
            if (validateReturn === false) return;

            newSelectValue = {
                PriceList: event,
                Margin: found.Margin,
            }
        }
        else if (type === 'Margin') {
            let validateReturn = Common_Text_INPUT_Validation(event, type, key);
            if (validateReturn === false) return;

            newSelectValue = {
                PriceList: found.PriceList,
                Margin: event,
            }
        }

        let newTabArr = marginTabTable.map((index, k) => {
            return (k === key) ? newSelectValue : index
        })
        setMarginTabTable(newTabArr)
    }


    function RateDetailTab_AddRow_Handler(key) {
        debugger
        let rate_TableElement = rateDetailTableData[key];

        let validateReturn1 = Common_Drop_Validation(rate_TableElement.MRPType, "MRPType", key)
        let validateReturn2 = Common_Text_INPUT_Validation(rate_TableElement.MRP, "MRP", key);

        let validateReturn3 = Common_Text_INPUT_Validation(rate_TableElement.GSTPercentage, "GSTPercentage", key);
        let validateReturn4 = Common_Text_INPUT_Validation(rate_TableElement.HSNCode, "HSNCode", key);

        if ((validateReturn1 === false)
            || (validateReturn2 === false)
            || (validateReturn3 === false)
            || (validateReturn4 === false)) return;

        var newarr = [...rateDetailTableData, {
            MRPType: { value: 0, label: "select" },
            MRP: '',
            GSTPercentage: '',
            HSNCode: ''
        }]
        setRateDetailTableData(newarr)
    }
    function RateDetailTab_DeleteRow_Handler(key) {

        var removeElseArrray = rateDetailTableData.filter((i, k) => {
            return !(k === key)
        })

        setRateDetailTableData(removeElseArrray)

    }
    function RateDetail_Common_onChange_Handller(event, type, key,) {
        debugger
        var found = rateDetailTableData.find((i, k) => {
            return (k === key)
        })
        let newSelectValue = ''


        if (type === "MRP") {
            let validateReturn = Common_Text_INPUT_Validation(event, type, key);
            if (validateReturn === false) return;

            newSelectValue = {
                MRP: event,
                GSTPercentage: found.GSTPercentage,
                HSNCode: found.HSNCode,
                MRPType: found.MRPType
            }

        }

        else if (type === "GSTPercentage") {
            let validateReturn = Common_Text_INPUT_Validation(event, type, key);
            if (validateReturn === false) return;

            newSelectValue = {
                MRP: found.MRP,
                GSTPercentage: event,
                HSNCode: found.HSNCode,
                MRPType: found.MRPType
            }
        } else if (type === "HSNCode") {
            let validateReturn = Common_Text_INPUT_Validation(event, type, key);
            if (validateReturn === false) return;

            newSelectValue = {
                MRP: found.MRP,
                GSTPercentage: found.GSTPercentage,
                HSNCode: event,
                MRPType: found.MRPType
            }
        }
        else if (type === "MRPType") {
            let validateReturn = Common_Drop_Validation(event, type, key);
            if (validateReturn === false) return;

            newSelectValue = {
                MRP: found.MRP,
                GSTPercentage: found.GSTPercentage,
                HSNCode: found.HSNCode,
                MRPType: event
            }
        }

        let newTabArr = rateDetailTableData.map((index, k) => {
            return (k === key) ? newSelectValue : index
        })
        setRateDetailTableData(newTabArr)
    }


    const handleValidSubmit = (event, values) => {

        const itemCategoryDetails = categoryTabTable.map((index) => ({
            CategoryType: index.CategoryType.value,
            Category: index.Category.value,
            SubCategory: index.SubCategory.value
        }))

        const itemUnitDetails = baseUnitTableData.map((index) => ({
            BaseUnitQuantity: index.Conversion,
            UnitID: index.Unit.value,
        }))

        const itemDivisionDetails = divisionTableData.map((index) => ({
            Division: index.value
        }))

        const iteMarginDetails = marginTabTable.map((index) => ({
            PriceList: index.PriceList.value,
            Margin: index.Margin
        }))

        const itemMRPDetails = rateDetailTableData.map((index) => ({
            MRP: index.MRP,
            GSTPercentage: index.GSTPercentage,
            HSNCode: index.HSNCode,
            MRPType: index.MRPType.value
        }))


        let submitValid1 = false;
        let submitValid2 = false

        isValidate.map((ind) => {
            document.getElementById(ind).className = "form-control is-invalid"
        })

        if ((isValidate.length == 0)) {
            submitValid1 = true
        } else { submitValid1 = false }

        categoryTabTable.map((ind, key) => {

            let return1 = Common_Drop_Validation(ind.CategoryType, "CategoryType", key);
            if (return1 === false) submitValid2 = return1;

            let return2 = Common_Drop_Validation(ind.Category, "Category", key);
            if (return2 === false) submitValid2 = return2;

            let return3 = Common_Drop_Validation(ind.SubCategory, "SubCategory", key);
            if (return3 === false) submitValid2 = return3;
        })

        debugger

        if (submitValid1) {

            const jsonBody = JSON.stringify({
                Name: formValue.Name,
                ShortName: formValue.ShortName,
                Sequence: formValue.Sequence,
                BarCode: formValue.BarCode,
                isActive: formValue.isActive,
                Company: formValue.Company.value,
                BaseUnitID: formValue.BaseUnit.value,
                ItemCategoryDetails: itemCategoryDetails,
                ItemUnitDetails: itemUnitDetails,

                ItemImagesDetails: [
                    {
                        ImageType: "1",
                        Item_pic: "sadsadasdas"
                    }
                ],
                ItemDivisionDetails: itemDivisionDetails,
                ItemMRPDetails: itemMRPDetails,
                ItemMarginDetails: iteMarginDetails,

            });

            dispatch(postItemData(jsonBody));
            console.log("jsonBody", jsonBody)
        }
        else {
            setactiveTab1('1');
            alert("check Validation")
        }
    };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <MetaTags>
                        <title>Tabs & Accordions | Minia - React Admin & Dashboard Template</title>
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
                                                        <span className="d-none d-sm-block">Category</span>

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
                                                        id="nave-link-4"
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
                                                        <span className="d-none d-sm-block">Division</span>
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
                                                        <span className="d-none d-sm-block">Rate Details</span>
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
                                                                        <Input type="text" id='txtName0'
                                                                            placeholder=" Please Enter Name "
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
                                                                            onChange={(event) => Common_DropDown_handller_ForAll(event, "Company", 0)}
                                                                        />
                                                                    </FormGroup>

                                                                    <FormGroup className=" col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom21">Base Unit</Label>
                                                                        <Select
                                                                            id='dropBaseUnit-0'
                                                                            value={formValue.BaseUnit}
                                                                            options={BaseUnit_DropdownOptions}
                                                                            onChange={(event) => Common_DropDown_handller_ForAll(event, "BaseUnit", 0)}
                                                                        />
                                                                    </FormGroup>

                                                                    <FormGroup className="mb-3 col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom01">BarCode</Label>
                                                                        <Input
                                                                            id='txtBarCode0'
                                                                            placeholder=" Please Enter BarCode "
                                                                            autoComplete="off"
                                                                            // validate={{
                                                                            //     required: { value: true, errorMessage: 'Please Enter BarCode' },
                                                                            // }}
                                                                            // onChange={(e) => { formValue.BarCode = e.target.value }}
                                                                            onChange={(e) => { CommonTab_SimpleText_INPUT_handller_ForAll(e.target.value, "BarCode") }}
                                                                        />
                                                                    </FormGroup>

                                                                    <FormGroup className="mb-3 col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom01">Sequence</Label>
                                                                        <Input
                                                                            id='txtSequence0'
                                                                            placeholder=" Please Enter Sequence "
                                                                            autoComplete="off"
                                                                            onChange={(e) => { CommonTab_SimpleText_INPUT_handller_ForAll(e.target.value, "ShortName") }}
                                                                        // onChange={(e) => { formValue.Sequence = e.target.value }}
                                                                        />

                                                                    </FormGroup>
                                                                    <FormGroup className="mb-2 col col-sm-5">
                                                                        <Row className="justify-content-md-left">
                                                                            <Label htmlFor="horizontal-firstname-input" className="col-sm-2 col-form-label" >Active </Label>
                                                                            <Col md={2} style={{ marginTop: '9px' }} >

                                                                                <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                                                                    <Input type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                                                                        value={formValue.isActive}
                                                                                        defaultChecked={true}
                                                                                        onChange={(e) => { formValue.isActive = e.target.checked }}
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

                                                                {categoryTabTable.map((index, key) => {

                                                                    return <Row className="mt-3">
                                                                        <Col className=" col col-11 ">
                                                                            <Row>
                                                                                <FormGroup className=" col col-sm-4 " >
                                                                                    <Label htmlFor="validationCustom21">Category Type</Label>
                                                                                    <Select
                                                                                        id={`dropCategoryType-${key}`}
                                                                                        value={categoryTabTable[key].CategoryType}

                                                                                        options={CategoryType_DropdownOptions}
                                                                                        onChange={(e) => {
                                                                                            CategoryType_Dropdown_Handler(e, key, "CategoryType")
                                                                                        }}
                                                                                    />
                                                                                </FormGroup>

                                                                                <FormGroup className=" col col-sm-4 " >
                                                                                    <Label htmlFor="validationCustom21">Category</Label>
                                                                                    <Select
                                                                                        id={`dropCategory-${key}`}
                                                                                        // styles={customStyles}
                                                                                        value={categoryTabTable[key].Category}
                                                                                        options={categoryTabTable[key].Category_DropdownOptions}

                                                                                        onChange={(e) => {
                                                                                            Category_Dropdown_Handler(e, key, "Category")

                                                                                        }}
                                                                                    />
                                                                                </FormGroup>

                                                                                <FormGroup className=" col col-sm-4 " >
                                                                                    <Label htmlFor="validationCustom21">Sub Category</Label>
                                                                                    <Select
                                                                                        // styles={customStyles}
                                                                                        id={`dropSubCategory-${key}`}
                                                                                        value={categoryTabTable[key].SubCategory}
                                                                                        options={categoryTabTable[key].SubCategory_DropdownOptions}
                                                                                        onChange={(e) => { CategoryTab_Common_onChange_Handller(e,  "SubCategory",key) }}
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
                                                                            <FormGroup className=" col col-sm-4 " >
                                                                                <Label >Base Unit</Label>
                                                                                <Select
                                                                                    id={`dropBaseUnit-0`}
                                                                                    value={formValue.BaseUnit}
                                                                                    options={BaseUnit_DropdownOptions}
                                                                                    onChange={(e) => Common_DropDown_handller_ForAll(e, "BaseUnit", 0)}

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
                                                                                                <AvInput
                                                                                                    name="value"
                                                                                                    type="text"
                                                                                                    id={`txtConversion${key}`}
                                                                                                    defaultValue={TableValue.Conversion}
                                                                                                    onChange={(e) => UnitConversionsTab_BaseUnit2_onChange_Handller(e, "Conversion", key,)}></AvInput>
                                                                                            </td>
                                                                                            <td>
                                                                                                <Select
                                                                                                    id={`dropUnit-${key}`}
                                                                                                    placeholder="select unit"
                                                                                                    value={TableValue.Unit}
                                                                                                    options={BaseUnit_DropdownOptions2}
                                                                                                    onChange={(e) => UnitConversionsTab_BaseUnit2_onChange_Handller(e, "Unit", key)}
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
                                                                            </Table>
                                                                            </Col>
                                                                        </Row>
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

                                                                        {(imageTabTable.length === key + 1) ?
                                                                            <Col className="col col-1 mt-3">
                                                                                <Button
                                                                                    className="btn btn-sm mt-3 mb-0 btn-light  btn-outline-primary  "
                                                                                    type="button"
                                                                                    onClick={() => { ImageTab_AddRow_Handler(key) }} >
                                                                                    <i className="dripicons-plus"></i></Button>
                                                                            </Col>
                                                                            : <Col className="col col-1 mt-3">
                                                                                <i
                                                                                    className="mdi mdi-trash-can d-block text-danger font-size-20 mt-3"
                                                                                    onClick={() => {
                                                                                        ImageTab_DeleteRow_Handler(key);
                                                                                    }}
                                                                                ></i>

                                                                            </Col>}
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
                                                            <Card className="text-black">
                                                                <CardBody style={{ backgroundColor: "whitesmoke" }}>

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

                                                                    {rateDetailTableData.map((index, key) => {

                                                                        return <Row className="mt-3">
                                                                            <Col className=" col col-11 ">
                                                                                <Row>
                                                                                    <FormGroup className="mb-3 col col-sm-3 " >
                                                                                        <Label >MRP Type</Label>
                                                                                        <Select
                                                                                            id={`dropMRPType-${key}`}
                                                                                            value={rateDetailTableData[key].MRPType}
                                                                                            options={MRPType_DropdownOptions}
                                                                                            onChange={(e) => { RateDetail_Common_onChange_Handller(e, "MRPType", key,) }}
                                                                                        />
                                                                                    </FormGroup>
                                                                                    <FormGroup className="mb-3 col col-sm-3 " >
                                                                                        <Label htmlFor="validationCustom01">MRP</Label>
                                                                                        <Input name="MRP" type="text"
                                                                                            id={`txtMRP${key}`}
                                                                                            placeholder=" Please Enter MRP "
                                                                                            autoComplete="off"
                                                                                            value={rateDetailTableData[key].MRP}
                                                                                            onChange={(e) => { RateDetail_Common_onChange_Handller(e.target.value, "MRP", key) }}
                                                                                        />
                                                                                    </FormGroup>

                                                                                    <FormGroup className="mb-3 col col-sm-3 " >
                                                                                        <Label htmlFor="validationCustom01">GST</Label>
                                                                                        <Input name="GST" type="text"
                                                                                            id={`txtGSTPercentage${key}`}
                                                                                            value={rateDetailTableData[key].GSTPercentage}
                                                                                            placeholder=" Please Enter GST "
                                                                                            autoComplete="off"
                                                                                            onChange={(e) => { RateDetail_Common_onChange_Handller(e.target.value, "GSTPercentage", key) }}
                                                                                        />
                                                                                    </FormGroup>

                                                                                    <FormGroup className="mb-3 col col-sm-3 " >
                                                                                        <Label htmlFor="validationCustom01">HSN</Label>
                                                                                        <Input name="HSN" type="text"
                                                                                            id={`txtHSNCode${key}`}
                                                                                            value={rateDetailTableData[key].HSNCode}
                                                                                            placeholder=" Please Enter HSN "
                                                                                            autoComplete="off"
                                                                                            onChange={(e) => { RateDetail_Common_onChange_Handller(e.target.value, "HSNCode", key) }}
                                                                                        />
                                                                                    </FormGroup>

                                                                                </Row>
                                                                            </Col>
                                                                            {(rateDetailTableData.length === key + 1) ?
                                                                                <Col className="col col-1 mt-3">
                                                                                    <Button className="btn btn-sm btn-light mt-3 "
                                                                                        type="button"
                                                                                        onClick={() => { RateDetailTab_AddRow_Handler(key) }} >
                                                                                        <i className="dripicons-plus"></i></Button>
                                                                                </Col>
                                                                                : <Col className="col col-1 mt-3">

                                                                                    <i
                                                                                        className="mdi mdi-trash-can d-block text-danger font-size-20 mt-3"
                                                                                        onClick={() => {
                                                                                            RateDetailTab_DeleteRow_Handler(key);
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
                                                <TabPane tabId="7">
                                                    <Row>
                                                        <Col md={12}  >
                                                            <Card className="text-black">
                                                                <CardBody style={{ backgroundColor: "whitesmoke" }}>

                                                                    {marginTabTable.map((index, key) => {

                                                                        return <Row className="mt-3">
                                                                            <Col className=" col col-10 ">
                                                                                <Row>
                                                                                    <FormGroup className=" col col-sm-5 " >
                                                                                        <Label >Price List</Label>
                                                                                        <Select


                                                                                            id={`dropPriceList-${key}`}
                                                                                            value={marginTabTable[key].PriceList}
                                                                                            options={PriceList_DropdownOptions}
                                                                                            onChange={(e) => { MarginTab_onChange_Handler(e, key, "PriceList") }}
                                                                                        />
                                                                                    </FormGroup>

                                                                                    <FormGroup className="mb-3 col col-sm-5 " >
                                                                                        <Label >Margin</Label>
                                                                                        <Input type="text"
                                                                                            id={`txtMargin${key}`}
                                                                                            value={marginTabTable.Margin}
                                                                                            placeholder="Please Enter Margin"
                                                                                            onChange={(e) => MarginTab_onChange_Handler(e.target.value, key, "Margin")}></Input>
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
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};
export default ItemsMaster;




