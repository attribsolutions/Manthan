import React, { useEffect, useRef, useState } from "react"
import MetaTags from "react-meta-tags"
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
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
import {
    Breadcrumb_inputName,
    commonPageField,
    commonPageFieldSuccess,
    getCategoryTypelist
} from "../../../../store/actions";
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
    metaTagLabel,
    CommonConsole
} from "../../../../components/Common/CommonFunction";
import * as url from "../../../../routes/route_url";
import * as mode from "../../../../routes/PageMode";
import { GeneralMasterSubType, } from "../../../../store/Administrator/GeneralRedux/action";
import { customAlert } from "../../../../CustomAlert/ConfirmDialog";
import { SaveButton } from "../../../../components/Common/CommonButton";
import WeightageTab from "./Weightage_Tab";
import { showToastAlert } from "../../../../helpers/axios_Config";
import {
    mobileApp_ProductAdd_Api,
    mobileApp_ProductUpdate_Api
} from "../../../../helpers/backend_helper";
import { getGroupTypeslist } from "../../../../store/Administrator/GroupTypeRedux/action";
import { priceListByCompay_Action } from "../../../../store/Administrator/PriceList/action";
import { alertMessages } from "../../../../components/Common/CommonErrorMsg/alertMsg";
import BasicInfoTabForm from "../ItemMaster/Basic_Info_Tab/index";
import { pageId } from "../../../../routes";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc
} from "../../../../components/Common/validationFunction";

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
    const baseTabRef = useRef(null);

    const history = useHistory()
    const [EditData, setEditData] = useState({});
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [activeTab1, setactiveTab1] = useState("1")

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

    const [editItemShelfLife, setEditItemShelfLife] = useState('');

    const fileds = {
        Name: "",
        ShortName: "",
        ShelfLife: "",
        BaseUnitName: "",
        SAPItemCode: "",
        BarCode: '',
        Category: [],
        CategoryType: "",
        BrandName: [],
        Division: [],
        Tag: '',
        Sequence: '',
        isActive: true,
        IsSCM: false
    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [mobileApiLoading, setMobileApiLoading] = useState(false);

    const {
        BaseUnit,
        postMsg,
        userAccess,
        updateMsg,
        saveBtnloading,
        pageField
    } = useSelector((state) => ({
        BaseUnit: state.ItemMastersReducer.BaseUnit,
        saveBtnloading: state.ItemMastersReducer.saveBtnloading,
        userAccess: state.Login.RoleAccessUpdateData,
        postMsg: state.ItemMastersReducer.postMsg,
        updateMsg: state.ItemMastersReducer.updateMsg,
        BrandTagList: state.ItemMastersReducer.BrandTagList,
        pageField: state.CommonPageFieldReducer.pageField,
    }));

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));//clear privious PageField
        dispatch(commonPageField(pageId.ITEM))
        dispatch(get_Division_ForDropDown());//divsion tab
        dispatch(getCategoryTypelist());//Category tab
        dispatch(getGroupTypeslist());//group Tab
        dispatch(get_ImageType_ForDropDown());
        dispatch(get_Party_ForDropDown());//margin tab
        dispatch(priceListByCompay_Action());
        dispatch(getcompanyList());
        dispatch(getBaseUnit_ForDropDown());
        dispatch(get_CategoryTypes_ForDropDown());
        dispatch(getPartyListAPI());
        dispatch(getItemTagName())
        dispatch(getBrandTagName());
        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
            TypeID: 1
        });
        dispatch(GeneralMasterSubType(jsonBody));

    }, []);

    const { values } = state;

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
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster;
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    // Edit Data UseEffect
    useEffect(() => {

        if ((hasShowloction || hasShowModal) && (pageField)) {

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

                dispatch(get_Category_By_CategoryType_ForDropDownAPI(editCategoryType.value));

                const editCategory = hasEditVal.ItemCategoryDetails.map(index => ({
                    value: index.Category,
                    label: index.CategoryName
                }))

                const editBrandName = hasEditVal.BrandName.map(index => ({
                    value: index.id,
                    label: index.Name
                }))

                let ItemShelfLife = hasEditVal.ItemShelfLife.map((index) => {

                    return index.Days
                })
                setEditItemShelfLife(ItemShelfLife[0])

                const { id, Name, SAPItemCode, ShortName, BarCode, Sequence, CompanyName, Company,
                    BaseUnitName, BaseUnitID, isActive, IsSCM } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.Name.valid = true;
                hasValid.SAPItemCode.valid = true;
                hasValid.ShortName.valid = true;
                hasValid.BarCode.valid = true;
                hasValid.Sequence.valid = true;
                hasValid.BaseUnitName.valid = true;
                hasValid.isActive.valid = true;
                hasValid.IsSCM.valid = true;
                hasValid.CategoryType.valid = true;
                hasValid.Category.valid = true;
                hasValid.ShelfLife.valid = true;

                values.id = id
                values.Name = Name;
                values.SAPItemCode = SAPItemCode;
                values.ShortName = ShortName;
                values.BarCode = BarCode;
                values.Sequence = Sequence;
                values.Company = { label: CompanyName, value: Company }
                values.BaseUnitName = { label: BaseUnitName, value: BaseUnitID }
                values.isActive = isActive;
                values.IsSCM = IsSCM;
                values.CategoryType = editCategoryType;
                values.Category = editCategory;
                values.Division = editDivision;
                values.BrandName = editBrandName;
                values.ShelfLife = ItemShelfLife[0];

                setState({ values, fieldLabel, hasValid, required, isError })

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

                setMRP_Tab_TableData(hasEditVal.ItemMRPDetails)
                setMarginMaster(hasEditVal.ItemMarginDetails)
                setGStDetailsMaster(hasEditVal.ItemGSTHSNDetails)
                setGroup_Tab_TableData(hasEditVal.ItemGroupDetails)
                seteditCreatedBy(hasEditVal.CreatedBy)
                dispatch(editItemSuccess({ Status: false }))
            }
        }

    }, [hasShowloction, hasShowModal, pageField])

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(SaveItemMasterActionSuccess({ Status: false }))

            //***************mobail app api*********************** */
            const mobilApiResp = await mobileApp_ProductAdd_Api(postMsg.TransactionID)
            if (mobilApiResp.StatusCode === 200) {
                showToastAlert(mobilApiResp.Message)
            }
            else {
                setMobileApiLoading(false)
            }
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
            setMobileApiLoading(true)

            //***************mobail app api*********************** */
            const jsonBody = JSON.stringify({
                products: (updateMsg.TransactionID).toString()
            })

            const mobilApiResp = await mobileApp_ProductUpdate_Api({ jsonBody });
            if (mobilApiResp.StatusCode === 200) {
                showToastAlert(mobilApiResp.Message);
                setMobileApiLoading(false)
            }
            else {
                setMobileApiLoading(false)
            }
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

    const SaveHandler = (event) => {

        event.preventDefault();
        const btnId = event.target.id;
        btnIsDissablefunc({ btnId, state: true })

        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })

                if (!Group_Tab_TableData.length > 0) {
                    customAlert({
                        Type: 4,
                        Message: "GroupType Primary:Is Requried"
                    })
                    return;
                }
                else {
                    const found = Group_Tab_TableData.find(element => {
                        return element.GroupTypeName === "Primary"
                    });
                    if (found === undefined) {
                        customAlert({
                            Type: 4,
                            Message: "GroupType Primary:Is Requried"
                        })
                        return;
                    }
                }

                if (GStDetailsMaster.length === 0) {
                    customAlert({
                        Type: 4,
                        Message: alertMessages.gstDetailsIsRequired,
                    })
                    return btnIsDissablefunc({ btnId, state: false });
                }

                if (MRP_Tab_TableData.length === 0) {
                    customAlert({
                        Type: 4,
                        Message: alertMessages.mrpDetailsIsRequired,
                    })
                    return btnIsDissablefunc({ btnId, state: false });
                }

                const ItemBrandName = values.BrandName.map((index) => {
                    return index.value
                });

                const ItemCategoryDetails = values.Category.map((index) => ({
                    CategoryType: values.CategoryType.value,
                    Category: index.value
                }));

                const specificID = values.BaseUnitName.value;
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

                    //Add the item to the result array if it's not a duplicate, not existing already,and not empty
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

                // ======================  MRP Tab *****start   ====================== 
                let hasAdd_MRP = []
                MRP_Tab_TableData.forEach((index) => {
                    if (index.IsAdd === true) { hasAdd_MRP.push(index) }
                })

                // ======================  Margin Tab *****start   ====================== 
                let hasAdd_Margin = []
                marginMaster.forEach((index) => {
                    if (index.IsAdd === true) { hasAdd_Margin.push(index) }
                })

                // ======================  GStDetailsMaster *****start   ====================== 
                let hasAdd_GST = []
                GStDetailsMaster.forEach((index) => {
                    if (index.IsAdd === true) { hasAdd_GST.push(index) }
                })

                const isShelfLifeArr = [];
                if (Number(editItemShelfLife) !== values.ShelfLife) {
                    isShelfLifeArr.push({
                        Days: values.ShelfLife,
                        CreatedBy: loginUserID(),
                        UpdatedBy: loginUserID(),
                        IsAdd: true
                    });
                }

                const jsonBody = JSON.stringify({
                    Name: values.Name,
                    ShortName: values.ShortName,
                    SAPItemCode: values.SAPItemCode,
                    BarCode: values.BarCode,
                    isActive: values.isActive,
                    IsSCM: values.IsSCM,
                    Company: loginCompanyID(),
                    BaseUnitID: values.BaseUnitName.value,
                    BrandName: ItemBrandName.toString(),
                    Tag: values.Tag,
                    Sequence: values.Sequence,
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID(),
                    Breadth: weightageTabMaster.Breadth,
                    Grammage: weightageTabMaster.Grammage,
                    Height: weightageTabMaster.Height,
                    Length: weightageTabMaster.Length,
                    StoringCondition: weightageTabMaster.StoringCondition,
                    ItemCategoryDetails: ItemCategoryDetails,
                    ItemUnitDetails: itemUnitDetails,

                    ItemDivisionDetails: values.Division.map((i) => {
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
                }
                else {
                    dispatch(saveItemMasterAction({ jsonBody, btnId }));
                }
            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    }

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" >
                    <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
                    <Container fluid>
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
                                            {activeTab1 === "1" &&
                                                <TabPane tabId="1">{/* ++++ TabPane tabId="1" ++++++ */}
                                                    {(pageField) &&
                                                        <BasicInfoTabForm
                                                            ref={baseTabRef}
                                                            state={state}
                                                            setState={setState}
                                                            settable={setBaseUnitTableData}
                                                            pageField={pageField}
                                                        />
                                                    }
                                                </TabPane>
                                            }

                                            {activeTab1 === "2" &&
                                                <TabPane tabId="2">{/* ++++++ TabPane Group Type +++++ */}
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
                                            }

                                            {activeTab1 === "3" &&
                                                <TabPane tabId="3">{/*++++ TabPane UnitConverstion +++++++ */}
                                                    <UnitConverstion
                                                        state={{
                                                            pageMode: pageMode,
                                                            formValue: state,
                                                            TableData: baseUnitTableData,
                                                            BaseUnit: BaseUnit
                                                        }}
                                                        settable={setBaseUnitTableData}
                                                        setFormValue={setState}
                                                    />
                                                </TabPane>
                                            }
                                            {activeTab1 === "4" &&
                                                <TabPane tabId="4">{/* +++++ TabPane Item Image ++++ */}
                                                    <Image state={{
                                                        imageTable: imageTabTable,
                                                        setImageTable: setImageTabTable
                                                    }}
                                                    />
                                                </TabPane>
                                            }
                                            {activeTab1 === "5" &&
                                                <TabPane tabId="5">{/*+++++ TabPane MRP_Tab +++++++ */}
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
                                            }
                                            {activeTab1 === "6" &&
                                                <TabPane tabId="6">{/*+++++ TabPane Margin +++++++ */}
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
                                            }
                                            {activeTab1 === "7" &&
                                                <TabPane tabId="7">{/*+++++ TabPane Gst +++++++ */}
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
                                            }
                                            {activeTab1 === "8" &&
                                                <TabPane tabId="8">{/*+++++ TabPane Weightage +++++++ */}
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
                                            }
                                        </TabContent>

                                        <Row >{/*+++++ Save Button   +++++++ */}
                                            <Col sm={2}>
                                                {
                                                    (pageField) &&
                                                    <SaveButton
                                                        loading={saveBtnloading || mobileApiLoading}
                                                        pageMode={pageMode}
                                                        onClick={SaveHandler}
                                                        userAcc={userPageAccessState}
                                                        editCreatedBy={editCreatedBy}
                                                        module={"Item"}
                                                    />
                                                }

                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

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




