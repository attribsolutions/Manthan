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
import Select from "react-select";
import { getcompanyList } from "../../../../store/Administrator/CompanyRedux/actions"
import {
    editItemSuccess,
    getBaseUnit_ForDropDown,
    getBrandTagName,
    getItemTagName,
    get_CategoryTypes_ForDropDown,
    get_Category_By_CategoryType_ForDropDownAPI,
    get_Division_ForDropDown,
    get_ImageType_ForDropDown,
    get_Party_ForDropDown,
    saveItemMasterAction,
    SaveItemMasterActionSuccess,
    updateItemMasterAction,
    updateItemMasterActionSuccess
} from "../../../../store/Administrator/ItemsRedux/action";
import { Breadcrumb_inputName, getCategoryTypelist } from "../../../../store/actions";
import { getPartyListAPI } from "../../../../store/Administrator/PartyRedux/action";
import GSTTab from "./GST_Tab";
import MRPTab from "./MRP_Tab";
import Margin_Tab from "./MarginTab/index";
import GroupTab from "./Group_Tab";
import UnitConverstion from "./UnitConversion_Tab/Index";
import Image from "./Image_Tab/Index";
import {
    breadcrumbReturnFunc,
    loginUserID,
    loginCompanyID,
    btnIsDissablefunc,
    metaTagLabel
} from "../../../../components/Common/CommonFunction";
import * as url from "../../../../routes/route_url";
import * as mode from "../../../../routes/PageMode";
import { GeneralMasterSubType, } from "../../../../store/Administrator/GeneralRedux/action";
import { customAlert } from "../../../../CustomAlert/ConfirmDialog";
import { SaveButton } from "../../../../components/Common/CommonButton";
import WeightageTab from "./Weightage_Tab";
import { C_Select } from "../../../../CustomValidateForm";
import { showToastAlert } from "../../../../helpers/axios_Config";
import { mobileApp_ProductAdd_Api, mobileApp_ProductUpdate_Api } from "../../../../helpers/backend_helper";

export const unitConversionInitial = {
    id: 1,
    Conversion: '',
    Unit: '',
    POUnit: false,
    SOUnit: false,
    IsBase: false,
    hasEdit: false,
    hasDelete: false
};
const ItemsMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const [EditData, setEditData] = useState({});
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [activeTab1, setactiveTab1] = useState("1")

    const [searchResults, setSearchResults] = React.useState([]);

    let initial = {
        Name: "",
        SAPItemCode: "",
        ShortName: "",
        BarCode: '',
        BaseUnit: "",
        Category: [],
        CategoryType: [],
        Division: [],
        MRP: '',
        GST: '',
        HSN: '',
        isActive: true,
        Tag: '',
        Sequence: '',
        BrandName: [],
        IsSCM: false
    }
    const initialInValid = ["txtName0", "txtShortName0",]

    const [inValidDrop, setInValidDrop] = useState({
        BaseUnit: false,
        Company: false,
        CategoryType: false,
        Category: false,
        Division: false,
        BrandName: false,
    })

    let [isValidate, setIsValidate] = useState(initialInValid);

    const [formValue, setFormValue] = useState(initial);

    const [marginMaster, setMarginMaster] = useState([]);

    const [imageTabTable, setImageTabTable] = useState([{
        ImageType: '',
        ImageUpload: ''
    }]);

    const [baseUnitTableData, setBaseUnitTableData] = useState([unitConversionInitial]);
    const [previousBaseUnitTableData, setPreviousBaseUnitTableData] = useState([]);

    const [MRP_Tab_TableData, setMRP_Tab_TableData] = useState([]);
    const [Group_Tab_TableData, setGroup_Tab_TableData] = useState([]);
    const [GStDetailsMaster, setGStDetailsMaster] = useState([]);

    const [weightageTabMaster, setWeightageTabMaster] = useState({
        Breadth: '',
        Grammage: '',
        Height: '',
        Length: '',
        StoringCondition: '',
    });

    const [isShelfLife, setIsShelfLife] = useState('');
    const [editItemShelfLife, setEditItemShelfLife] = useState('');

    const {
        BaseUnit,
        postMsg,
        userAccess,
        Division,
        CategoryTypeList,
        CategoryList,
        ItemTagList,
        BrandTagList,
        updateMsg,
        BrandName,
        saveBtnloading,
        categotyDropDownLoading,
    } = useSelector((state) => ({
        saveBtnloading: state.ItemMastersReducer.saveBtnloading,
        BaseUnit: state.ItemMastersReducer.BaseUnit,
        userAccess: state.Login.RoleAccessUpdateData,
        postMsg: state.ItemMastersReducer.postMsg,
        updateMsg: state.ItemMastersReducer.updateMsg,
        Division: state.ItemMastersReducer.Division,
        CategoryTypeList: state.categoryTypeReducer.categoryTypeListData,
        CategoryList: state.ItemMastersReducer.Category,
        ItemTagList: state.ItemMastersReducer.ItemTagList,
        BrandTagList: state.ItemMastersReducer.BrandTagList,
        BrandName: state.GeneralReducer.GeneralMasterSubType,
        categotyDropDownLoading: state.ItemMastersReducer.categotyDropDownLoading,
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
            setUserAccState(userAcc)
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
            TypeID: 1
        });
        dispatch(GeneralMasterSubType(jsonBody));
    }, []);

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

                const editDivision = hasEditVal.ItemDivisionDetails.map(index => ({
                    value: index.Party,
                    label: index.PartyName
                }))

                const editCategoryType = {
                    value: hasEditVal.ItemCategoryDetails[0].CategoryType,
                    label: hasEditVal.ItemCategoryDetails[0].CategoryTypeName
                }

                const editCategory = hasEditVal.ItemCategoryDetails.map(index => ({
                    value: index.Category,
                    label: index.CategoryName
                }))

                const editBrandName = hasEditVal.BrandName.map(index => ({
                    value: index.id,
                    label: index.Name
                }))


                let initialFormValue = {
                    // ====================== Base detail tab ======================

                    Name: hasEditVal.Name,
                    SAPItemCode: hasEditVal.SAPItemCode,
                    ShortName: hasEditVal.ShortName,
                    BarCode: hasEditVal.BarCode,
                    Sequence: hasEditVal.Sequence,
                    Company: { label: hasEditVal.CompanyName, value: hasEditVal.Company },
                    CategoryType: editCategoryType,
                    Category: editCategory,
                    Division: editDivision,
                    BaseUnit: { label: hasEditVal.BaseUnitName, value: hasEditVal.BaseUnitID },
                    isActive: hasEditVal.isActive,
                    IsSCM: hasEditVal.IsSCM,
                    BrandName: editBrandName
                }
                // ====================== Images tab ======================



                // if (hasEditVal.ItemImagesDetails.length === 0) {
                //     setImageTabTable(imageTabTable)
                // }
                // let ItemImagesDetails = hasEditVal.ItemImagesDetails.map((index) => {
                //     
                //     if (index.ItemImagesDetails.length === 0) {
                //         return setImageTabTable(imageTabTable)
                //     }
                //     else {
                //         return {
                //             ImageType:
                //             {
                //                 label: index.ImageTypeName,
                //                 value: index.ImageType
                //             },
                //             ImageUpload: index.Item_pic,
                //         }
                //     }

                // })
                // setImageTabTable(ItemImagesDetails)


                let ItemShelfLife = hasEditVal.ItemShelfLife.map((index) => {

                    return index.Days
                })
                setEditItemShelfLife(ItemShelfLife[0])
                setIsShelfLife(ItemShelfLife[0])
                // ====================== Unit Conversion tab  start ======================

                const UnitDetails = []
                hasEditVal.ItemUnitDetails.forEach((index, key) => {
                    // if (!index.IsBase) {
                    UnitDetails.push({
                        id: key + 1,
                        Unit: { label: index.UnitName, value: index.UnitID },
                        Conversion: index.BaseUnitQuantity,
                        IsBase: index.IsBase,
                        POUnit: index.PODefaultUnit,
                        SOUnit: index.SODefaultUnit,
                    })
                    // }
                })


                if ((UnitDetails.length === 0)) {

                    UnitDetails.push(unitConversionInitial)
                };


                setPreviousBaseUnitTableData(JSON.parse(JSON.stringify(UnitDetails)));// Assign the deep copy to previousBaseUnitTableData
                setBaseUnitTableData(UnitDetails);
                // ====================== Weightage tab =================================

                setWeightageTabMaster({
                    Breadth: hasEditVal.Breadth,
                    Grammage: hasEditVal.Grammage,
                    Height: hasEditVal.Height,
                    Length: hasEditVal.Length,
                    StoringCondition: hasEditVal.StoringCondition,
                })

                setFormValue(initialFormValue);
                // setImageTabTable(ItemImagesDetails)
                setMRP_Tab_TableData(hasEditVal.ItemMRPDetails)
                setMarginMaster(hasEditVal.ItemMarginDetails)
                setGStDetailsMaster(hasEditVal.ItemGSTHSNDetails)
                setGroup_Tab_TableData(hasEditVal.ItemGroupDetails)
                seteditCreatedBy(hasEditVal.CreatedBy)
                dispatch(editItemSuccess({ Status: false }))
            }
        }

    }, [])

    useEffect(() => {
        dispatch(getcompanyList());
        dispatch(getBaseUnit_ForDropDown());
        dispatch(get_CategoryTypes_ForDropDown());
        dispatch(getPartyListAPI());
        dispatch(get_ImageType_ForDropDown());
        dispatch(get_Division_ForDropDown());
        dispatch(get_Party_ForDropDown());
        // dispatch(priceListByCompay_Action());
        dispatch(getCategoryTypelist());
        dispatch(getItemTagName())
        dispatch(getBrandTagName())

    }, []);

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(SaveItemMasterActionSuccess({ Status: false }))

            //***************mobail app api*********************** */
            const mobilApiResp = await mobileApp_ProductAdd_Api(postMsg.TransactionID)
            if (mobilApiResp.StatusCode === 200) { showToastAlert(mobilApiResp.Message) }
            //************************************** */

            if (pageMode === mode.dropdownAdd) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                const promise = await customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                if (promise) {
                    history.push({
                        pathname: url.ITEM_lIST,
                    })
                }
            }
        }

        else if (postMsg.Status === true) {
            dispatch(SaveItemMasterActionSuccess({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(async () => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {

            //***************mobail app api*********************** */
            const mobilApiResp = await mobileApp_ProductUpdate_Api(updateMsg.TransactionID);
            if (mobilApiResp.StatusCode === 200) { showToastAlert(mobilApiResp.Message); }
            //************************************** */

            history.push({
                pathname: url.ITEM_lIST,
            });

        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateItemMasterActionSuccess({ Status: false }));
            customAlert({
                Type: 3,
                Message: JSON.stringify(updateMsg.Message),
            })
        }
    }, [updateMsg, modalCss]);

    const toggle1 = tab => {
        if (activeTab1 !== tab) {
            setactiveTab1(tab)
        }
    }

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

    const BrandName_DropdownOptions = BrandName.map((data) => ({
        value: data.id,
        label: data.Name,
    }));

    function dropDownValidation(event, type,) {
        let isval = (event.value === '')
        if (isval) {
            inValidDrop[type] = true
            return
        } else {
            setFormValue((i) => {
                return { ...i, [type]: event }
            })
            // formValue[type] = event
            inValidDrop[type] = false

        }
        if (type === "BaseUnit") {
            setBaseUnitTableData([{ ...unitConversionInitial, IsBase: true, Conversion: 1, Unit: event }])
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

    const CategoryType_Handler = (event) => {
        dropDownValidation(event, "CategoryType");
        setFormValue((i) => {
            const a = { ...i };
            a.Category = []
            return { ...a }
        })
        dispatch(get_Category_By_CategoryType_ForDropDownAPI(event.value))
    };

    const Category_Handler = (event) => {
        dropDownValidation(event, "Category")
    };

    const Division_Handler = (event) => {
        dropDownValidation(event, "Division")
    };

    const BrandName_Handler = (event) => {
        dropDownValidation(event, "BrandName")
    };

    const SaveHandler = (event) => {

        event.preventDefault();
        const btnId = event.target.id;
        btnIsDissablefunc({ btnId, state: true })

        try {
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

            if (formValue.BaseUnit === '') {
                setInValidDrop(i => {
                    const a = { ...i }
                    a.BaseUnit = true
                    return a
                })
                isvalid = false
                inValidMsg.push("BaseUnit: Is Requried")

            }
            if (formValue.CategoryType.length < 1) {
                setInValidDrop(i => {
                    const a = { ...i }
                    a.CategoryType = true
                    return a
                })
                isvalid = false
                inValidMsg.push("CategoryType: Is Requried")
            }
            if (formValue.Category.length < 1) {
                setInValidDrop(i => {
                    const a = { ...i }
                    a.Category = true
                    return a
                })
                isvalid = false
                inValidMsg.push("Category: Is Requried")
            }

            // if (formValue.Division.length < 1) {
            //     setInValidDrop(i => {
            //         const a = { ...i }
            //         a.Division = true
            //         return a
            //     })
            //     isvalid = false
            //     inValidMsg.push("Division:Is Requried")
            // }

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
            if (isvalid) {  // ************* is valid if start 

                //**************** Brand Name **************** */
                const ItemBrandName = formValue.BrandName.map((index) => {
                    return index.value
                })
                // ====================== Unit conversion *****start ======================

                const specificID = formValue.BaseUnit.value;
                const isEditMode = pageMode === mode.edit; // Set the value based on your page mode
                let isChangeBaseUnitTable = false; // Flag to track if there are any changes in the data

                // Check if the page is in edit mode and compare the current and previous baseUnitTableData arrays
                if (isEditMode) {
                    // Check if the lengths of the arrays are different, indicating a change
                    if (baseUnitTableData.length !== previousBaseUnitTableData.length) {
                        isChangeBaseUnitTable = true;
                    } else {
                        // Compare each element of the arrays if their properties are different
                        for (let i = 0; i < baseUnitTableData.length; i++) {
                            const currentData = baseUnitTableData[i];
                            const previousData = previousBaseUnitTableData[i];

                            // If any property is different, set the isChange flag to true and break out of the loop
                            if (
                                currentData.Unit.value !== previousData.Unit.value ||
                                Number(currentData.Conversion) !== Number(previousData.Conversion) ||
                                currentData.IsBase !== previousData.IsBase ||
                                currentData.SOUnit !== previousData.SOUnit ||
                                currentData.POUnit !== previousData.POUnit
                            ) {
                                isChangeBaseUnitTable = true;
                                break;
                            }
                        }
                    }
                }

                // Initialize the itemUnitDetails array and perform filtering and transformations using reduce
                let itemUnitDetails = baseUnitTableData.reduce((result, index, key) => {
                    const val1 = index.Conversion !== '' ? parseFloat(index.Conversion).toFixed(3) : '';
                    const unit1 = index.Unit.value;

                    // Check if there are any duplicates in the baseUnitTableData array
                    const isDuplicate = baseUnitTableData.some((i, k) => {
                        const inner = i.Conversion !== '' ? parseFloat(i.Conversion).toFixed(3) : '';
                        return val1 === inner && unit1 === i.Unit.value && key !== k;
                    });

                    // Check if the combination of BaseUnitQuantity and UnitID already exists in the result array
                    const isExisting = result.some((i, k) => {
                        return val1 === i.BaseUnitQuantity && unit1 === i.UnitID && key !== k;
                    });

                    // Add the item to the result array if it's not a duplicate, not existing already, and not empty
                    // Also, if in edit mode, exclude the item if its UnitID matches the specificID
                    if (!isDuplicate && !isExisting && val1 !== '' && unit1 !== '' && !(isEditMode && unit1 === specificID)) {
                        result.push({
                            BaseUnitQuantity: index.Conversion,
                            UnitID: unit1,
                            IsBase: index.IsBase,
                            SODefaultUnit: index.SOUnit,
                            PODefaultUnit: index.POUnit
                        });
                    }

                    return result;
                }, []);

                //If isChangeBaseUnitTable flase and edit mode true then  itemUnitDetails blanck array
                if (!isChangeBaseUnitTable && isEditMode) {
                    itemUnitDetails = []
                }


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


                let imagedata = imageTabTable.map(function (index) {

                    if ((index.ImageType === '') || (index.ImageUpload === '')) {


                        return imageTabTable.length = []
                    }
                    else {
                        return ({
                            ImageType: index.ImageType.value,
                            Item_pic: index.ImageUpload
                        })
                    }
                })

                let imagedata1 = imagedata.reduce(function (r, a) { return r.concat(a); }, []);

                if (GStDetailsMaster.length === 0) {
                    customAlert({
                        Type: 4,
                        Message: "GST Details Required",
                    })
                    return btnIsDissablefunc({ btnId, state: false });
                }

                const isShelfLifeArr = [];

                if (Number(editItemShelfLife) !== isShelfLife) {
                    isShelfLifeArr.push({
                        Days: isShelfLife,
                        CreatedBy: loginUserID(),
                        UpdatedBy: loginUserID(),
                        IsAdd: true
                    });
                }

                const jsonBody = JSON.stringify({
                    Name: formValue.Name,
                    ShortName: formValue.ShortName,
                    SAPItemCode: formValue.SAPItemCode,
                    BarCode: formValue.BarCode,
                    isActive: formValue.isActive,
                    IsSCM: formValue.IsSCM,
                    Company: loginCompanyID(),
                    BaseUnitID: formValue.BaseUnit.value,
                    BrandName: ItemBrandName.toString(),
                    Tag: formValue.Tag,
                    Sequence: formValue.Sequence,
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID(),
                    Breadth: weightageTabMaster.Breadth,
                    Grammage: weightageTabMaster.Grammage,
                    Height: weightageTabMaster.Height,
                    Length: weightageTabMaster.Length,
                    StoringCondition: weightageTabMaster.StoringCondition,
                    ItemCategoryDetails: ItemCategoryDetails,
                    ItemUnitDetails: itemUnitDetails,

                    ItemDivisionDetails: formValue.Division.map((i) => {
                        return ({ Party: i.value })
                    }),

                    ItemImagesDetails: imagedata1,
                    ItemMRPDetails: hasAdd_MRP,
                    ItemMarginDetails: hasAdd_Margin,
                    ItemGSTHSNDetails: hasAdd_GST,
                    ItemGroupDetails: Group_Tab_TableData,
                    ItemShelfLife: isShelfLifeArr
                });

                if (pageMode === mode.edit) {
                    dispatch(updateItemMasterAction({ jsonBody, updateId: EditData.id, btnId }));
                    // console.log(jsonBody)
                }
                else {
                    dispatch(saveItemMasterAction({ jsonBody, btnId }));
                    // console.log(jsonBody)
                }
            }                                                            // ************* is valid if start 
            else {                                                       // ************* is valid esle start 
                customAlert({
                    Type: 4,
                    Message: JSON.stringify(inValidMsg),
                })
                return btnIsDissablefunc({ btnId, state: false })

            }

        } catch (error) { btnIsDissablefunc({ btnId, state: false }) }
    }


    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        var x = document.getElementById("itemtag");
        if (event.target == "") {
            var x = document.getElementById("itemtag");
            x.style.display = "none";
        }
    }

    let data1 = BrandTagList.map((index) => {
        return index.dta
    })

    let data = ItemTagList.map((index) => {
        return index.dta
    })

    const handleChange = event => {
        // 
        dispatch(Breadcrumb_inputName(event.target.value));
        CommonTab_SimpleText_INPUT_handller_ForAll(event.target.value, "Name")
        var searchtext = event.target.value
        const results = data.filter(person =>
            person.toLowerCase().includes(searchtext)
        );

        setSearchResults(results);
        var x = document.getElementById("itemtag");
        document.addEventListener('click', function handleClickOutsideBox(event) {
            if (!x.contains(event.target)) {
                x.style.display = 'none';
            }
        });
        x.style.display = "block";
        var di = "100Px"

        if (event.target.value == "") {
            di = `${x.style.display = "none"}`
        }
        else if (results.length == 0) {
            di = `${x.style.display = "none"}`
        }
        else if (results.length < 2) {
            di = "50Px"
        } else if (results.length > 5) {
            di = "300Px"
        } else if (results.length < 2) {
            di = "50Px"
        }
        x.style.height = di

    };


    const onclickselect = function () {
        const hasNone = document.getElementById("itemtag").style;

        if (hasNone.display === "none") {
            hasNone.display = "block";
        } else {
            hasNone.display = "none";
        }
    };


    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css, marginBottom: "1cm" }}>
                    <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
                    <Container fluid>
                        <form >
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

                                                <NavItem>
                                                    <NavLink
                                                        id="nave-link-8"
                                                        style={{ cursor: "pointer" }}
                                                        className={classnames({
                                                            active: activeTab1 === "8",
                                                        })}
                                                        onClick={() => {
                                                            toggle1("8")
                                                        }}
                                                    >
                                                        <span className="d-block d-sm-none">
                                                            <i className="fas fa-home"></i>
                                                        </span>
                                                        <span className="d-none d-sm-block">Weightage</span>
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
                                                                            autoFocus={true}
                                                                            // value={searchTerm}
                                                                            onClick={onclickselect}
                                                                            onChange={handleChange}

                                                                        />
                                                                        <div id="itemtag" >
                                                                            <ul style={{}}>
                                                                                {searchResults.map(item => (
                                                                                    <li className="liitem" >{item}</li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
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
                                                                        />
                                                                    </FormGroup>

                                                                    <FormGroup className=" col col-sm-4 " >
                                                                        <Label >Shelf Life<samp className="text-secondary">/Day</samp></Label>
                                                                        <Input
                                                                            type="text"
                                                                            rows="1"
                                                                            id='txtShelfLife0'
                                                                            // defaultValue={pageMode === 'edit' ? isShelfLife : ''}
                                                                            Value={isShelfLife}
                                                                            placeholder=" Please Enter Days "
                                                                            autoComplete="off"
                                                                            onChange={(e) => { setIsShelfLife(e.target.value) }}
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
                                                                        <Label >BarCode</Label>
                                                                        <Input
                                                                            id='txtBarCode0'
                                                                            placeholder=" Please Enter BarCode "
                                                                            defaultValue={EditData.BarCode}
                                                                            autoComplete="off"
                                                                            onChange={(e) => { CommonTab_SimpleText_INPUT_handller_ForAll(e.target.value, "BarCode") }}
                                                                        />
                                                                    </FormGroup>

                                                                    <FormGroup className="mb-3 col col-sm-4 " >
                                                                        <Label >SAP Code</Label>
                                                                        <Input
                                                                            id='txtSAPItemCode0'
                                                                            defaultValue={EditData.SAPItemCode}
                                                                            placeholder=" Please Enter SAP Code "
                                                                            autoComplete="off"
                                                                            onChange={(e) => { CommonTab_SimpleText_INPUT_handller_ForAll(e.target.value, "SAPItemCode") }}
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
                                                                        <Label >Category</Label>
                                                                        <C_Select
                                                                            value={formValue.Category}
                                                                            isMulti={true}
                                                                            className="basic-multi-select"
                                                                            options={CategoryList_DropdownOptions}
                                                                            isLoading={categotyDropDownLoading}
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


                                                                    <FormGroup className="mb-3 col col-sm-4 ">
                                                                        <Label >Brand Name</Label>
                                                                        <Select
                                                                            defaultValue={formValue.BrandName}
                                                                            isMulti={true}
                                                                            className="basic-multi-select"
                                                                            options={BrandName_DropdownOptions}
                                                                            styles={{
                                                                                control: base => ({
                                                                                    ...base,
                                                                                    border: inValidDrop.BrandName ? '1px solid red' : '',

                                                                                })
                                                                            }}
                                                                            onChange={(e) => { BrandName_Handler(e) }}
                                                                            classNamePrefix="select2-selection"
                                                                        />
                                                                    </FormGroup>
                                                                </Row>

                                                                <Row>
                                                                    <FormGroup className=" col col-sm-4 ">
                                                                        {/* <div className="mb-3">
                                                                            <Label >Division</Label>
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
                                                                        </div> */}
                                                                    </FormGroup>

                                                                    <FormGroup className=" col col-sm-4 " >
                                                                        <Label >Item Tag</Label>
                                                                        <Input
                                                                            type="textarea"
                                                                            rows="1"
                                                                            id='txtTag0'
                                                                            defaultValue={EditData.Tag}
                                                                            placeholder=" Please Enter Item Tag "
                                                                            autoComplete="off"
                                                                            onChange={(e) => { CommonTab_SimpleText_INPUT_handller_ForAll(e.target.value, "Tag") }}
                                                                        />
                                                                    </FormGroup>

                                                                    <FormGroup className=" col col-sm-4 " >
                                                                        <Label >Sequence</Label>
                                                                        <Input
                                                                            type="text"
                                                                            rows="1"
                                                                            id='txtSequence0'
                                                                            defaultValue={EditData.Sequence}
                                                                            placeholder=" Please Enter Sequence "
                                                                            autoComplete="off"
                                                                            onChange={(e) => { CommonTab_SimpleText_INPUT_handller_ForAll(e.target.value, "Sequence") }}
                                                                        />
                                                                    </FormGroup>

                                                                </Row>
                                                                <Row >
                                                                    <FormGroup className=" col col-md-4">
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


                                                                    <FormGroup className=" col col-md-4">
                                                                        <Row className="justify-content-ml-left ">
                                                                            <Label htmlFor="horizontal-firstname-input"
                                                                                className="col-md-3 col-form-label" >IsSCM </Label>
                                                                            <Col md={6} style={{ marginTop: '9px' }} >

                                                                                <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                                                                    <Input type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                                                                        defaultChecked={formValue.IsSCM}
                                                                                        onChange={(e) => { formValue.IsSCM = e.target.checked }}

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
                                                </TabPane>
                                                <TabPane tabId="4">{/* ++++++++++++ TabPane Item Image ++++++++++++++++++++++++++++++++++++++++++ */}
                                                    <Image state={{
                                                        imageTable: imageTabTable,
                                                        setImageTable: setImageTabTable
                                                    }}
                                                    />
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

                                                <TabPane tabId="8">{/* +++++++++++++ TabPane Gst ++++++++++++++++++++++++++++++++++++++++++ */}
                                                    <Row>
                                                        <Col md={12}  >
                                                            <Row className="mt-3">
                                                                <Col className=" col col-12 ">
                                                                    <WeightageTab weightageTabMaster={weightageTabMaster} setWeightageTabMaster={setWeightageTabMaster} />
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </TabPane>
                                            </TabContent>

                                            <Row >{/* +++++++++++++++++++++++++++ Save Button  ++++++++++++++++++++++++++++++++++++++++++ */}
                                                <Col sm={2}>
                                                    <SaveButton
                                                        loading={saveBtnloading}
                                                        pageMode={pageMode}
                                                        onClick={SaveHandler}
                                                        userAcc={userPageAccessState}
                                                        editCreatedBy={editCreatedBy}
                                                        module={"Item"}
                                                    />

                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>

                        </form>
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




