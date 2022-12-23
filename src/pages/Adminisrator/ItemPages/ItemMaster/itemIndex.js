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
import { useHistory } from "react-router-dom"
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
    get_Category_By_CategoryType_ForDropDownAPI,
    get_Division_ForDropDown,
    get_ImageType_ForDropDown,
    get_Party_ForDropDown,
    get_PriceList_ForDropDown,
    postItemData,
    PostItemDataSuccess,
    updateItemID
} from "../../../../store/Administrator/ItemsRedux/action";
import { AlertState, Breadcrumb_inputName, getCategoryTypelist } from "../../../../store/actions";
import { getPartyListAPI } from "../../../../store/Administrator/PartyRedux/action";
import GSTTab from "./GST_Tab";
import MRPTab from "./MRP_Tab";
import Margin_Tab from "./MarginTab/index";
import GroupTab from "./Group_Tab";
import UnitConverstion from "./UnitConversion_Tab/Index";
import Image from "./Image_Tab/Index";
import { createdBy, saveDissable } from "../../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { initialFiledFunc, resetFunction } from "../../../../components/Common/ComponentRelatedCommonFile/validationFunction";

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
        Tag: '',
        BrandName: ''
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
    console.log("imageTabTable", imageTabTable)
    const [baseUnitTableData, setBaseUnitTableData] = useState([{
        Conversion: '',
        Unit: '',
        IsBase: false
    }]);


    const [MRP_Tab_TableData, setMRP_Tab_TableData] = useState([]);
    const [Group_Tab_TableData, setGroup_Tab_TableData] = useState([]);
    const [GStDetailsMaster, setGStDetailsMaster] = useState([]);


    const {
        companyList,
        BaseUnit,
        PostAPIResponse,
        userAccess,
        Division,
        CategoryTypeList,
        CategoryList
    } = useSelector((state) => ({
        companyList: state.Company.companyList,
        BaseUnit: state.ItemMastersReducer.BaseUnit,
        userAccess: state.Login.RoleAccessUpdateData,
        PostAPIResponse: state.ItemMastersReducer.postMessage,
        Division: state.ItemMastersReducer.Division,
        CategoryTypeList: state.categoryTypeReducer.categoryTypeListData,
        CategoryList: state.ItemMastersReducer.Category,
    }));


    const fileds = {
        id: "",
        Name: "",

    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

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
                dispatch(Breadcrumb_inputName(hasEditVal.Name))

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
                    // ====================== Base detail tab ======================

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
                // ====================== Images tab ======================

                let ItemImagesDetails = hasEditVal.ItemImagesDetails.map((index) => {
                    debugger
                    return {
                        ImageType:
                        {
                            label: index.ImageTypeName,
                            value: index.ImageType
                        },
                        ImageUpload: index.Item_pic
                    }
                })




                // ====================== Unit Conversion tab  start ======================

                const UnitDetails = []
                hasEditVal.ItemUnitDetails.forEach((index) => {
                    if (!index.IsBase) {
                        UnitDetails.push({
                            Unit: { label: index.UnitName, value: index.UnitID },
                            Conversion: index.BaseUnitQuantity,
                            IsBase: false
                        })
                    }
                })

                if ((UnitDetails.length === 0)) {
                    UnitDetails.push({
                        Unit: '',
                        Conversion: '',
                        IsBase: false,
                    })
                };

                setBaseUnitTableData(UnitDetails)
                // ====================== Unit Conversion tab  end ======================

                setFormValue(initialFormValue);
                setImageTabTable(ItemImagesDetails)

                setMRP_Tab_TableData(hasEditVal.ItemMRPDetails)
                setMarginMaster(hasEditVal.ItemMarginDetails)
                setGStDetailsMaster(hasEditVal.ItemGSTHSNDetails)
                setGroup_Tab_TableData(hasEditVal.ItemGroupDetails)

                dispatch(editItemSuccess({ Status: false }))

            }
        }

    }, [])


    useEffect(() => {

        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
            dispatch(PostItemDataSuccess({ Status: false }))
            setState(() => resetFunction(fileds, state))//+++++++++ Clear form values
            saveDissable(false);//+++++++++save Button Is enable function

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
            saveDissable(false);//+++++++++save Button Is enable function
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



    const CategoryTypeList_DropdownOptions = CategoryTypeList.map((data) => ({
        value: data.id,
        label: data.Name,
    }));

    const CategoryList_DropdownOptions = CategoryList.map((data) => ({
        value: data.id,
        label: data.Name,
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



    const CategoryType_Handler = (event) => {
        dropDownValidation(event, "CategoryType")
        dispatch(get_Category_By_CategoryType_ForDropDownAPI(event.value))
    };

    const Category_Handler = (event) => {
        dropDownValidation(event, "Category")
    };

    const Division_Handler = (event) => {
        dropDownValidation(event, "Division")

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
        if (isvalid) {/// ************* is valid if start 

            // ====================== Unit conversion *****start ======================

            const itemUnitDetails = []

            baseUnitTableData.forEach((index, key) => {
                let val1 = index.Conversion
                const unit1 = index.Unit.value;

                if (!(val1 === '')) {
                    val1 = parseFloat(val1).toFixed(3)
                }

                const found = baseUnitTableData.find((i, k) => {
                    let inner = i.Conversion;
                    if (!(inner === '')) { inner = parseFloat(inner).toFixed(3) }
                    return ((val1 === inner) && (unit1 === i.Unit.value) && !(key === k))
                });
                const found2 = itemUnitDetails.find((i, k) => {
                    return ((val1 === i.BaseUnitQuantity) && (unit1 === i.UnitID) && !(key === k))
                });


                if (
                    ((found === undefined) || (found2 === undefined))
                    && !(val1 === '')
                    && !(unit1 === ''))

                    if (
                        ((found === undefined) || (found2 === undefined))
                        && !(index.Conversion === '')
                        && !(index.Unit === '')) {
                        itemUnitDetails.push({
                            BaseUnitQuantity: index.Conversion,
                            UnitID: index.Unit.value,
                            IsBase: index.IsBase
                        })
                    }

            });



            if (pageMode === 'save')
                itemUnitDetails.push({
                    BaseUnitQuantity: 1,
                    UnitID: formValue.BaseUnit.value,
                    IsBase: true
                })

            //  ======================   ItemCategoryDetails *****start   ====================== 

            const ItemCategoryDetails = formValue.Category.map((index) => ({
                CategoryType: formValue.CategoryType.value,
                Category: index.value
            }))
            //  ======================   MRP_Tab_TableData *****start   ====================== 

            let hasAdd_MRP = []
            MRP_Tab_TableData.forEach((index) => {
                if (index.IsAdd === true) { hasAdd_MRP.push(index) }
            })

            // ======================  marginMaster *****start   ====================== 

            let hasAdd_Margin = []
            marginMaster.forEach((index) => {
                if (index.IsAdd === true) { hasAdd_Margin.push(index) }
            })

            // ======================  GStDetailsMaster *****start   ====================== 

            let hasAdd_GST = []
            GStDetailsMaster.forEach((index) => {
                if (index.IsAdd === true) { hasAdd_GST.push(index) }
            })

            debugger
            const jsonBody = JSON.stringify({
                Name: formValue.Name,
                ShortName: formValue.ShortName,
                Sequence: formValue.Sequence,
                BarCode: formValue.BarCode,
                isActive: formValue.isActive,
                Company: formValue.Company.value,
                BaseUnitID: formValue.BaseUnit.value,
                BrandName: formValue.BrandName,
                Tag: formValue.Tag,
                CreatedBy: createdBy(),
                UpdatedBy: createdBy(),
                ItemCategoryDetails: ItemCategoryDetails,

                ItemUnitDetails: itemUnitDetails,

                ItemDivisionDetails: formValue.Division.map((i) => {
                    return ({ Division: i.value })
                }),

                ItemImagesDetails: imageTabTable.map((i) => ({

                    ImageType: i.ImageType.value,
                    Item_pic: i.ImageUpload
                })),
                ItemMRPDetails: hasAdd_MRP,
                ItemMarginDetails: hasAdd_Margin,
                ItemGSTHSNDetails: hasAdd_GST,
                ItemGroupDetails: Group_Tab_TableData,

            });

            saveDissable(true);//+++++++++save Button Is dissable function

            if (pageMode === 'edit') {
                dispatch(updateItemID(jsonBody, EditData.id));
                console.log("items edit json", jsonBody)
            }

            else {
                dispatch(postItemData(jsonBody));
                console.log("items post json", jsonBody)
            }
        } /// ************* is valid if start 
        else { /// ************* is valid esle start 
            dispatch(AlertState({
                Type: 4, Status: true,
                Message: JSON.stringify(inValidMsg),
                // Message: (inValidMsg),
                RedirectPath: false,
                PermissionAction: false,
            }));
        }

    };



    // autocomplet item

    // function autocomplete(inp, arr) {
    //     /*the autocomplete function takes two arguments,
    //     the text field element and an array of possible autocompleted values:*/
    //     var currentFocus;
    //     /*execute a function when someone writes in the text field:*/
    //     inp.addEventListener("input", function (e) {
    //         var a, b, i, val = this.value;
    //         /*close any already open lists of autocompleted values*/
    //         closeAllLists();
    //         if (!val) { return false; }
    //         currentFocus = -1;
    //         /*create a DIV element that will contain the items (values):*/
    //         a = document.createElement("DIV");
    //         a.setAttribute("id", this.id + "autocomplete-list");
    //         a.setAttribute("class", "autocomplete-items");
    //         /*append the DIV element as a child of the autocomplete container:*/
    //         this.parentNode.appendChild(a);
    //         /*for each item in the array...*/
    //         for (i = 0; i < arr.length; i++) {
    //             /*check if the item starts with the same letters as the text field value:*/
    //             if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
    //                 /*create a DIV element for each matching element:*/
    //                 b = document.createElement("DIV");
    //                 /*make the matching letters bold:*/
    //                 b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
    //                 b.innerHTML += arr[i].substr(val.length);
    //                 /*insert a input field that will hold the current array item's value:*/
    //                 b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
    //                 /*execute a function when someone clicks on the item value (DIV element):*/
    //                 b.addEventListener("click", function (e) {
    //                     /*insert the value for the autocomplete text field:*/
    //                     inp.value = this.getElementsByTagName("input")[0].value;
    //                     /*close the list of autocompleted values,
    //                     (or any other open lists of autocompleted values:*/
    //                     closeAllLists();
    //                 });
    //                 a.appendChild(b);
    //             }
    //         }
    //     });
    //     /*execute a function presses a key on the keyboard:*/
    //     inp.addEventListener("keydown", function (e) {
    //         var x = document.getElementById(this.id + "autocomplete-list");
    //         if (x) x = x.getElementsByTagName("div");
    //         if (e.keyCode == 40) {
    //             /*If the arrow DOWN key is pressed,
    //             increase the currentFocus variable:*/
    //             currentFocus++;
    //             /*and and make the current item more visible:*/
    //             addActive(x);
    //         } else if (e.keyCode == 38) { //up
    //             /*If the arrow UP key is pressed,
    //             decrease the currentFocus variable:*/
    //             currentFocus--;
    //             /*and and make the current item more visible:*/
    //             addActive(x);
    //         } else if (e.keyCode == 13) {
    //             /*If the ENTER key is pressed, prevent the form from being submitted,*/
    //             e.preventDefault();
    //             if (currentFocus > -1) {
    //                 /*and simulate a click on the "active" item:*/
    //                 if (x) x[currentFocus].click();
    //             }
    //         }
    //     });
    //     function addActive(x) {
    //         /*a function to classify an item as "active":*/
    //         if (!x) return false;
    //         /*start by removing the "active" class on all items:*/
    //         removeActive(x);
    //         if (currentFocus >= x.length) currentFocus = 0;
    //         if (currentFocus < 0) currentFocus = (x.length - 1);
    //         /*add class "autocomplete-active":*/
    //         x[currentFocus].classList.add("autocomplete-active");
    //     }
    //     function removeActive(x) {
    //         /*a function to remove the "active" class from all autocomplete items:*/
    //         for (var i = 0; i < x.length; i++) {
    //             x[i].classList.remove("autocomplete-active");
    //         }
    //     }
    //     function closeAllLists(elmnt) {
    //         /*close all autocomplete lists in the document,
    //         except the one passed as an argument:*/
    //         var x = document.getElementsByClassName("autocomplete-items");
    //         for (var i = 0; i < x.length; i++) {
    //             if (elmnt != x[i] && elmnt != inp) {
    //                 x[i].parentNode.removeChild(x[i]);
    //             }
    //         }
    //     }
    //     /*execute a function when someone clicks in the document:*/
    //     document.addEventListener("click", function (e) {
    //         closeAllLists(e.target);
    //     });
    // }


    // var countries = ["Afghanistan", "Albania", "Algeria",
    //     "Andorra", "Angola", "Anguilla", "Antigua & Barbuda", "Argentina",
    //     "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas",
    //     "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize",
    //     "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia & Herzegovina", "Botswana",
    //     "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    //     "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central Arfrican Republic", "Chad",
    //     "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cuba",
    //     "Curacao", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
    //     "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe",
    //     "Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia",
    //     "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea",
    //     "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran",
    //     "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan",
    //     "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
    //     "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia",
    //     "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova",
    //     "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauro", "Nepal", "Netherlands",
    //     "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "Norway",
    //     "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
    //     "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre & Miquelon", "Samoa",
    //     "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
    //     "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain",
    //     "Sri Lanka", "St Kitts & Nevis", "St Lucia", "St Vincent", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland",
    //     "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey",
    //     "Turkmenistan", "Turks & Caicos",
    //     "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu",
    //     "Vatican City", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];

    // autocomplete(document.getElementById("myInput"), countries);

    // autocomplet item






    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css, marginBottom: "1cm" }}>
                    <MetaTags>
                        <title>{userPageAccessState.PageHeading} | FoodERP-React FrontEnd</title>
                    </MetaTags>
                    <Container fluid>
                        <Breadcrumb pageHeading={userPageAccessState.PageHeading} />
                        <AvForm onValidSubmit={(e, v) => { handleValidSubmit(e, v); }}>
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

                                                <TabPane tabId="1">{/* +++++++++++ TabPane tabId="1" ++++++++++++++++++++++++++++++++++++++++++ */}
                                                    <Col md={12}  >
                                                        <Card className="text-black">
                                                            <CardBody className="c_card_body">
                                                                <Row>

                                                                    <FormGroup className="mb-3 col col-sm-4 " >
                                                                        <Label >Name</Label>
                                                                        <Input type="text"
                                                                            id='txtName0'
                                                                            placeholder=" Please Enter Name "
                                                                            defaultValue={EditData.Name}
                                                                            autoComplete="off"
                                                                            // onChange={(e) => { dispatch(Breadcrumb_inputName(e.target.value)) }}
                                                                            onChange={(e) => {
                                                                                dispatch(Breadcrumb_inputName(e.target.value));
                                                                                CommonTab_SimpleText_INPUT_handller_ForAll(e.target.value, "Name")
                                                                            }}
                                                                        />
                                                                          {/* </div> */}

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
                                                                            isDisabled={pageMode === "edit" ? true : false}
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
                                                                    <FormGroup className="mb-3 col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom01">Brand Name</Label>
                                                                        <Input
                                                                            id='txtBrandName0'
                                                                            defaultValue={EditData.BrandName}
                                                                            placeholder=" Please Enter Brand Name "
                                                                            autoComplete="off"
                                                                            onChange={(e) => { CommonTab_SimpleText_INPUT_handller_ForAll(e.target.value, "BrandName") }}
                                                                        // onChange={(e) => { formValue.Sequence = e.target.value }}
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

                                                                    <FormGroup className="mb-3 col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom01">Item Tag</Label>
                                                                        <Input
                                                                            type="textarea"
                                                                            rows="1"
                                                                            id='txtTag0'
                                                                            defaultValue={EditData.Tag}
                                                                            placeholder=" Please Enter Item Tag "
                                                                            autoComplete="off"
                                                                            onChange={(e) => { CommonTab_SimpleText_INPUT_handller_ForAll(e.target.value, "Tag") }}
                                                                        // onChange={(e) => { formValue.Sequence = e.target.value }}
                                                                        />
                                                                    </FormGroup>

                                                                    <FormGroup className="mt-4 col col-md-4">
                                                                        <Row className="justify-content-ml-left ">
                                                                            <Label htmlFor="horizontal-firstname-input"
                                                                                className="col-md-3 col-form-label" >Active </Label>
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

                                                <TabPane tabId="2">{/* +++++++++++ TabPane Group Type ++++++++++++++++++++++++++++++++++++++++++ */}
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


                                                <TabPane tabId="3">{/* ++++++++++++ TabPane UnitConverstion ++++++++++++++++++++++++++++++++++++++++++ */}
                                                    <UnitConverstion
                                                        state={{
                                                            pageMode: pageMode,
                                                            formValue: formValue,
                                                            TableData: baseUnitTableData,
                                                            BaseUnit: BaseUnit
                                                        }}
                                                        settable={setBaseUnitTableData}
                                                        setFormValue={setFormValue}
                                                    />
                                                    {/* <Card className="text-black">
                                                        <CardBody style={{ backgroundColor: "whitesmoke" }}>

                                                            <Row>
                                                                <FormGroup className=" col col-sm-4 " >
                                                                    <Label >Base Unit</Label>
                                                                    <Select
                                                                        id={`dropBaseUnit-0`}
                                                                        placeholder="Select..."
                                                                        value={formValue.BaseUnit}
                                                                        isDisabled={pageMode === "edit" ? true : false}
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
                                                                                                    value={baseUnitTableData[key].Unit}
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
                                                    </Card> */}

                                                </TabPane>


                                                <TabPane tabId="4">{/* ++++++++++++ TabPane Item Image ++++++++++++++++++++++++++++++++++++++++++ */}
                                                    <Image state={{
                                                        imageTable: imageTabTable,
                                                        setImageTable: setImageTabTable,
                                                    }} />
                                                </TabPane>


                                                <TabPane tabId="5">{/* ++++++++++++ TabPane MRP_Tab ++++++++++++++++++++++++++++++++++++++++++ */}
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

                                                <TabPane tabId="6">{/* ++++++++++++ TabPane Margin ++++++++++++++++++++++++++++++++++++++++++ */}
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

                                                <TabPane tabId="7">{/* +++++++++++++ TabPane Gst ++++++++++++++++++++++++++++++++++++++++++ */}
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

                                            <Row >{/* +++++++++++++++++++++++++++ Save Button  ++++++++++++++++++++++++++++++++++++++++++ */}
                                                <Col sm={2}>
                                                    <div style={{ paddingLeft: "14px" }}>
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




