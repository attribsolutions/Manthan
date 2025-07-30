import React, { useEffect, useMemo, useRef, useState, } from "react";
import {

    Col,
    Container,
    FormGroup,
    Label,
    Row,

    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,

} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import {

    Breadcrumb_inputName,
    commonPageField,
    commonPageFieldSuccess,
    get_Group_By_GroupType_ForDropDown,
    get_Sub_Group_By_Group_ForDropDown,
    getItemList
} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    resetFunction
} from "../../../components/Common/validationFunction";
import { C_Button, SaveButton } from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    btnIsDissablefunc,
    metaTagLabel,
} from "../../../components/Common/CommonFunction";
import * as pageId from "../../../routes/allPageID";
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { getCommonPartyDrodownOptionAction } from "../../../store/Utilites/PartyDrodown/action";
import { editSchemeIDSuccess, saveSchemeMaster, saveSchemeMaster_Success, updateSchemeID, updateSchemeIDSuccess } from "../../../store/Administrator/SchemeMasterRedux/action";
import { getSchemeTypelist } from "../../../store/Administrator/SchemeRedux/action";
import classnames from "classnames"
import SchemeTabForm from "./SchemeTabForm";
import SchemeItemTabForm from "./SchemeItemTabForm";
import SchemePartyTabForm from "./SchemePartyTabForm";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import { C_Select } from "../../../CustomValidateForm";
import { allLabelWithZero } from "../../../components/Common/CommonErrorMsg/HarderCodeData";
import { Validation } from "./data";
import { get_SubGroup_Group } from "../../../helpers/backend_helper";

const SchemeMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const { location } = history
    const SchemeTabRef = useRef(null);
    const SchemeItemTabRef = useRef(null);
    const SchemePartyTabRef = useRef(null);

    const hasShowloction = location.hasOwnProperty(mode.editValue)

    const fileds = {
        SchemeName: "",
        SchemeValue: "",
        ValueIn: "%",
        FromPeriod: _cfunc.currentDate_ymd,
        ToPeriod: _cfunc.currentDate_ymd,
        Item: "",
        VoucherLimit: null,
        QRPrefix: "",
        IsActive: true,
        SchemeTypeID: "",
        BillAbove: "",
        Message: "",
        OverLappingScheme: false,
        SchemeDetails: "",
        SchemeValueUpto: "",
        SchemeQuantity: "",
        Party: "",
        SchemeId: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [pageMode, setPageMode] = useState();
    const [userPageAccessState, setUserAccState] = useState('');
    const [activeTab, setactiveTab] = useState("1")
    const [groupDropdownSelect, setGroupDropdownSelect] = useState(allLabelWithZero);
    const [subGroupDropdownSelect, setSubGroupDropdownSelect] = useState(allLabelWithZero);
    const [ItemDropDown_Option, setItemDropDown_Option] = useState([allLabelWithZero]);
    const [ItemSelect, setItemSelect] = useState(allLabelWithZero);
    const [ItemData, setItemData] = useState([]);
    const [ItemTabledata, setItemTabledata] = useState([]);
    const [PartyTabledata, setPartyTabledata] = useState([]);

    const [PartySelect, setPartySelect] = useState(allLabelWithZero);
    const [schemeType, setSchemeType] = useState(null)
    const [schemeTypeValidation, setSchemeTypeValidation] = useState(null)




    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        pageField,
        saveBtnloading,
        updateMsg,
        SchemeType,
        GroupList,
        SubGroupList,
        groupDropDownLoading,
        subgroupDropDownLoading,
        PartyDropDown,
        userAccess } = useSelector((state) => ({
            postMsg: state.SchemeReducer.postMsg,
            updateMsg: state.SchemeReducer.updateMsg,
            saveBtnloading: state.SPos_MachineType_Reducer.saveBtnloading,
            userAccess: state.Login.RoleAccessUpdateData,
            SchemeType: state.SchemeTypeReducer.SchemeTypeList,
            pageField: state.CommonPageFieldReducer.pageField,
            GroupList: state.ItemMastersReducer.GroupList,
            SubGroupList: state.ItemMastersReducer.SubGroupList,
            groupDropDownLoading: state.ItemMastersReducer.groupDropDownLoading,
            subgroupDropDownLoading: state.ItemMastersReducer.subgroupDropDownLoading,
            PartyDropDown: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
        }));




    useEffect(() => {
        const page_Id = pageId.SCHEME_MASTER
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getItemList());
        dispatch(getSchemeTypelist());
        dispatch(getCommonPartyDrodownOptionAction())
        dispatch(get_Group_By_GroupType_ForDropDown(5))

        return () => {
            dispatch(saveSchemeMaster_Success({ Status: false }));


        }
    }, []);


    useEffect(async () => {
        const jsonBody = JSON.stringify({ GroupType_id: 5, Company_id: _cfunc.loginCompanyID() })
        const response = await get_SubGroup_Group({ jsonBody })
        if (response) {
            setItemData(response.Data)
        }
    }, [])

    useEffect(() => {

        if (updateMsg.Status === true && updateMsg.StatusCode === 200) {
            dispatch(updateSchemeIDSuccess({ Status: false }));

            customAlert({
                Type: 1,
                Message: JSON.stringify(updateMsg.Message),
            })
            history.push({
                pathname: url.SCHEME_MASTER_LIST,
            })
        }

        else if (updateMsg.Status === true) {
            dispatch(updateSchemeIDSuccess({ Status: false }));

            customAlert({
                Type: 3,
                Message: JSON.stringify(updateMsg.Message),
            })
        }
    }, [updateMsg]);

    useEffect(() => {

        if (groupDropdownSelect.value === 0 && subGroupDropdownSelect.value === 0) {
            const allItems = ItemData.flatMap(group => group.Items || []);
            setItemDropDown_Option(allItems.map(i => ({
                ...i,
                Quantity: 0,
                applicable: false,
                not_applicable: false,
                effective: false,
                value: i.ItemID,
                label: i.ItemName,
                DiscountValue: 0,
                DiscountType: "%"
            })));

        } else if (groupDropdownSelect.value !== 0 && (subGroupDropdownSelect.value && subGroupDropdownSelect.value !== 0)) {
            const subGroupItems = ItemData
                .filter(g => g.SubGroupID === subGroupDropdownSelect.value)
                .flatMap(g => g.Items || []);
            setItemDropDown_Option(subGroupItems.map(i => ({
                ...i,
                Quantity: 0,
                applicable: false,
                not_applicable: false,
                effective: false,
                value: i.ItemID,
                label: i.ItemName,
                DiscountValue: 0,
                DiscountType: "%"
            })));
        } else if (groupDropdownSelect.value !== 0) {
            const groupItems = ItemData
                .filter(g => g.GroupID === groupDropdownSelect.value)
                .flatMap(g => g.Items || []);
            setItemDropDown_Option(groupItems.map(i => ({
                ...i,
                Quantity: 0,
                applicable: false,
                not_applicable: false,
                effective: false,
                value: i.ItemID,
                label: i.ItemName,
                DiscountValue: 0,
                DiscountType: "%"
            })));
        }
    }, [groupDropdownSelect, subGroupDropdownSelect, ItemData]);



    const hasShowModal = props.hasOwnProperty(mode.editValue)

    // userAccess useEffect
    useEffect(() => {

        let userAcc = null;
        let locationPath;

        if (props.pageMode === mode.dropdownAdd) {
            locationPath = props.masterPath;
        } else {
            locationPath = location.pathname;
        }

        if (hasShowModal) {
            locationPath = props.masterPath;
        };

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (userAcc) {
            setUserAccState(userAcc);
            if (!props.isdropdown) {
                breadcrumbReturnFunc({ dispatch, userAcc });
            }
        };
    }, [userAccess])



    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time
    useEffect(() => {
        setPageMode(mode.defaultsave)
        if ((hasShowloction || hasShowModal)) {

            let hasEditVal = null
            if (hasShowloction) {
                setPageMode(location.pageMode)
                hasEditVal = location.editValue
                setSchemeType({ value: hasEditVal[0].SchemeTypeID, label: hasEditVal[0].SchemeTypeName })
                setSchemeTypeValidation(Validation[String(hasEditVal[0].SchemeTypeID)])

            }
            else if (hasShowModal) {
                setPageMode(props.pageMode)
                hasEditVal = props.editValue
                setSchemeType({ value: hasEditVal[0].SchemeTypeID, label: hasEditVal[0].SchemeTypeName })
                setSchemeTypeValidation(Validation[String(hasEditVal[0].SchemeTypeID)])
            }

            if (hasEditVal) {
                const { SchemeName, SchemeValue, ValueIn, FromPeriod, SchemeId,
                    ToPeriod, ItemDetails, VoucherLimit, QrPrefix, IsActive,
                    SchemeTypeID, BillAbove, Message, OverLappingScheme, SchemeTypeName,
                    SchemeDetails, SchemeValueUpto, PartyDetails, UsageTime, UsageType, SchemeQuantity
                } = hasEditVal[0]

                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.ToPeriod.valid = true;
                hasValid.IsActive.valid = true;
                hasValid.SchemeValue.valid = true;
                hasValid.ValueIn.valid = true;
                hasValid.SchemeName.valid = true;
                hasValid.QRPrefix.valid = true;
                hasValid.BillAbove.valid = true;
                hasValid.VoucherLimit.valid = true;
                hasValid.FromPeriod.valid = true;
                hasValid.SchemeTypeID.valid = true;
                hasValid.SchemeValueUpto.valid = true;
                hasValid.OverLappingScheme.valid = true;
                hasValid.SchemeDetails.valid = true;
                hasValid.SchemeQuantity.valid = true;


                values.ToPeriod = ToPeriod
                values.IsActive = IsActive
                // values.Item = ItemDetails.map(i => ({
                //     label: i.ItemName,
                //     value: i.ItemID
                // }));
                // values.Party = PartyDetails.map(i => ({
                //     label: i.PartyName,
                //     value: i.PartyID
                // }));
                values.SchemeValue = SchemeValue
                values.SchemeId = SchemeId
                values.ValueIn = ValueIn
                values.QRPrefix = QrPrefix
                values.SchemeName = SchemeName
                values.BillAbove = BillAbove
                values.UsageTime = UsageTime
                values.UsageType = UsageType
                values.VoucherLimit = VoucherLimit
                values.IsActive = IsActive
                values.FromPeriod = FromPeriod
                values.Message = Message
                values.SchemeQuantity = SchemeQuantity
                values.SchemeTypeID = {
                    label: SchemeTypeName,
                    value: SchemeTypeID
                }
                values.SchemeValueUpto = SchemeValueUpto
                values.OverLappingScheme = OverLappingScheme
                values.SchemeDetails = SchemeDetails

                setState({ values, fieldLabel, hasValid, required, isError })
                setItemTabledata(ItemDetails.map(i => ({
                    ...i,
                    label: i.ItemName,
                    value: i.ItemID,
                    applicable: i.applicable === 1,
                    not_applicable: i.not_applicable === 1,
                    effective: i.effective === 1
                })))

                setPartyTabledata(PartyDetails.map(i => ({
                    label: i.PartyName,
                    value: i.PartyID,
                    IsPartySelect: true,

                })))
                dispatch(editSchemeIDSuccess({ Status: false }));
                dispatch(Breadcrumb_inputName(SchemeName))
            }
        }
    }, [location]);




    const toggle1 = tab => {
        if (activeTab !== tab) { setactiveTab(tab) }
    }

    const PartyList_Options = useMemo(() => {
        const options = PartyDropDown.map(item => ({
            ...item,
            value: item.id,
            label: item.Name,
            IsPartySelect: false,
        }));

        return [allLabelWithZero, ...options]; // add only once
    }, [PartyDropDown]);

    const SchemeType_Options = SchemeType.map((index) => ({
        value: index.id,
        label: index.SchemeTypeName,
    }));

    const Group_DropdownOptions = GroupList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));
    Group_DropdownOptions.unshift(allLabelWithZero)

    const SubGroup_DropdownOptions = SubGroupList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));
    SubGroup_DropdownOptions.unshift(allLabelWithZero)

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveSchemeMaster_Success({ Status: false }));
            setState(() => resetFunction(fileds, state)) // Clear form values 

            if (pageMode === "other") {
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
                    history.push({ pathname: url.SCHEME_MASTER_LIST })
                }
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveSchemeMaster_Success({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])


    useEffect(() => {

        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    const Group_Handler = (event) => {

        setGroupDropdownSelect(event);
        dispatch(get_Sub_Group_By_Group_ForDropDown(event.value))
        setSubGroupDropdownSelect(allLabelWithZero);
        setItemSelect(allLabelWithZero)

    };

    const SubGroup_Handler = (event) => {
        setSubGroupDropdownSelect(event);
        setItemSelect(allLabelWithZero)
    };

    const SaveHandler = (event) => {
        event.preventDefault();
        const btnId = event.target.id
        const SchemeData = state

        if (PartyTabledata.length > 0 && ItemTabledata.length > 0) {
            SchemeData.hasValid.Party.valid = true
            SchemeData.hasValid.Item.valid = true
        }
        if (PartyTabledata.length === 0) {
            customAlert({
                Type: 4,
                Message: alertMessages.selectParty,
            })
            return
        }

        if (ItemTabledata.length === 0 && !(schemeTypeValidation?.SchemeItemTab?.hidden)) {
            customAlert({
                Type: 4,
                Message: alertMessages.selectItemName,
            })
            return
        }

        const statusMap = {
            applicable: 1,
            not_applicable: 2,
            effective: 3
        };

        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify({
                    SchemeName: SchemeData.values.SchemeName,
                    SchemeValue: SchemeData.values.SchemeValue,
                    ValueIn: SchemeData.values.ValueIn,
                    FromPeriod: SchemeData.values.FromPeriod,
                    ToPeriod: SchemeData.values.ToPeriod,
                    FreeItemID: null,
                    OverLappingScheme: SchemeData.values.OverLappingScheme,
                    VoucherLimit: SchemeData.values.VoucherLimit,
                    SchemeValueUpto: SchemeData.values.SchemeValueUpto,
                    BillAbove: SchemeData.values.BillAbove,
                    QRPrefix: SchemeData.values.QRPrefix,
                    IsActive: SchemeData.values.IsActive,
                    SchemeQuantity: SchemeData.values.SchemeQuantity,
                    SchemeTypeID: schemeType.value,
                    BillEffect: 1,
                    SchemeDetails: SchemeData.values.SchemeDetails,
                    PartyDetails: PartyTabledata
                        .filter(i => i.IsPartySelect) // only include items where IsPartySelect is true
                        .map(i => ({
                            PartyID: i.value
                        })),

                    ItemDetails: ItemTabledata.filter(i => i.applicable || i.not_applicable || i.effective).flatMap(i => {
                        const baseItem = Object.keys(statusMap)
                            .filter(statusKey => i[statusKey] === true)
                            .map(statusKey => ({
                                Item: i.ItemID,
                                ItemName: i.ItemName,
                                DiscountType: i.DiscountType,
                                TypeForItem: statusMap[statusKey],
                                DiscountValue: i.DiscountValue,
                                Quantity: i.Quantity || 0,
                            }));

                        let Item = {}

                        if (i.effective === true) {
                            Item = {
                                ...baseItem,
                                TypeForItem: statusMap["effective"]  // Override with effective
                            };

                        } else {
                            Item = {
                                ...baseItem,

                            };
                        }
                        return baseItem;
                    })

                });

                if (pageMode == mode.edit) {
                    dispatch(updateSchemeID({ jsonBody, updateId: SchemeData.values.SchemeId, }));
                } else {
                    dispatch(saveSchemeMaster({ jsonBody }));
                }


            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };


    const Gobuttonhandlechange = () => {
        if (!schemeType) {
            customAlert({
                Type: 4,
                Message: "Please select Scheme Type",
            })
            return
        }
        if (Validation.hasOwnProperty(String(schemeType.value))) {
            setSchemeTypeValidation(Validation[String(schemeType.value)])
        } else {
            customAlert({
                Type: 4,
                Message: "Scheme Type Not Found",
            })
            return
        }

    }

    const Addhandler = () => {
        debugger
        if (ItemSelect.value === 0) {
            // setItemTabledata(ItemDropDown_Option)

            setItemTabledata(prev => {
                const validOptionValues = new Set(ItemDropDown_Option.map(item => item.value));
                const filteredExisting = prev.filter(item => validOptionValues.has(item.value));
                const existingValues = new Set(filteredExisting.map(item => item.value));
                const newItems = ItemDropDown_Option.filter(item => !existingValues.has(item.value));

                return [...filteredExisting, ...newItems];
            });
        } else {

            setItemTabledata(prev => {
                const alreadyExists = prev.some(item => item.value === ItemSelect.value);
                if (alreadyExists) {
                    customAlert({
                        Type: 4,
                        Message: `${ItemSelect.label} ${alertMessages.ItemNameAlreadyExists}`,
                    })
                    return prev; // don't add duplicate
                }
                return [...prev, ItemSelect];  // add new item
            });

        }

    }

    useEffect(() => {

        if (pageMode === mode.defaultsave) {
            setItemTabledata(ItemDropDown_Option)
        }
    }, [ItemDropDown_Option, pageMode])

    useEffect(() => {
        if (pageMode === mode.defaultsave) {
            debugger
            if (PartyTabledata.length > 0) {
                setPartyTabledata(PartyTabledata)
            } else {
                setPartyTabledata(PartyList_Options.filter(i => i.value !== 0))
            }
        }

    }, [PartyDropDown, pageMode])



    const AddPartyhandler = () => {

        if (PartySelect.value === 0) {
            setPartyTabledata(prev => {
                const existingValues = new Set(prev.map(item => item.value));
                const newItems = PartyList_Options
                    .filter(i => i.value !== 0 && !existingValues.has(i.value));
                return [...prev, ...newItems];
            });
        } else {
            setPartyTabledata(prev => {
                const alreadyExists = prev.some(item => item.value === PartySelect.value);
                if (alreadyExists) {
                    customAlert({
                        Type: 4,
                        Message: `${PartySelect.label} ${alertMessages.partyAlreadyExist}`,
                    })
                    return prev; // don't add duplicate
                }
                return [...prev, PartySelect];  // add new item
            });

        }

    }



    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" >
                    <Container fluid>
                        <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

                        {/* <Card className="text-black" style={{ marginTop: "3px" }}> */}
                        {/* <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader> */}
                        <Row>
                            <Col sm={schemeTypeValidation ? 11 : 12} >
                                <div className="px-2   c_card_filter text-black" >
                                    <div className="row" >
                                        <Col sm={3} className="mt-2">
                                            <FormGroup className=" row" >
                                                <Label className="col-sm-5 p-2"
                                                    style={{ width: "120px" }}>{`Scheme Type ${!schemeTypeValidation ? "" : ":"}`}</Label>
                                                <Col sm="7">
                                                    {!schemeTypeValidation ? <C_Select
                                                        id="SchemeType"
                                                        name="SchemeType"
                                                        value={schemeType}
                                                        isSearchable={true}
                                                        classNamePrefix="dropdown"
                                                        styles={{
                                                            menu: provided => ({ ...provided, zIndex: 2 })
                                                        }}
                                                        options={SchemeType_Options}
                                                        onChange={(e) => { setSchemeType(e) }}

                                                    />
                                                        :
                                                        <Label className="col-sm-5 p-2"
                                                            style={{ width: "200px" }}> {schemeType.label}</Label>}
                                                </Col>
                                            </FormGroup>
                                        </Col>

                                        <Col sm={3} className="mt-2">
                                            {activeTab === "2" && < FormGroup className="row" >
                                                <Label className="col-sm-5 p-2"
                                                    style={{ width: "60px" }}>Group</Label>
                                                <Col sm="7">
                                                    <C_Select
                                                        value={groupDropdownSelect}
                                                        options={Group_DropdownOptions}
                                                        onChange={Group_Handler}
                                                        isLoading={groupDropDownLoading}
                                                        classNamePrefix="dropdown"
                                                        styles={{
                                                            menu: provided => ({ ...provided, zIndex: 2 })
                                                        }}
                                                    />
                                                </Col>
                                            </FormGroup>
                                            }
                                            {activeTab === "3" && < FormGroup className="row" >
                                                <Label className="col-sm-5 p-2"
                                                    style={{ width: "60px" }}>Party</Label>
                                                <Col sm="8">
                                                    <C_Select
                                                        value={PartySelect}
                                                        options={PartyList_Options}
                                                        onChange={(e) => { setPartySelect(e) }}

                                                        classNamePrefix="dropdown"
                                                        styles={{
                                                            menu: provided => ({ ...provided, zIndex: 2 })
                                                        }}
                                                    />
                                                </Col>
                                            </FormGroup>}
                                        </Col>

                                        <Col sm={3} className="mt-2">
                                            {activeTab === "2" && <FormGroup className="row" >
                                                <Label className="col-sm-5 p-2"
                                                    style={{ width: "90px" }}>Sub Group</Label>
                                                <Col sm="7">
                                                    <C_Select
                                                        value={subGroupDropdownSelect}
                                                        options={SubGroup_DropdownOptions}
                                                        isLoading={subgroupDropDownLoading}
                                                        onChange={SubGroup_Handler}
                                                        classNamePrefix="dropdown"
                                                        styles={{
                                                            menu: provided => ({ ...provided, zIndex: 2 })
                                                        }}
                                                    />
                                                </Col>
                                            </FormGroup>}
                                        </Col>

                                        <Col sm={schemeTypeValidation ? 3 : 1} className="mt-2">
                                            {activeTab === "2" && <FormGroup className="row" >
                                                <Label className="col-sm-5 p-2"
                                                    style={{ width: "60px" }}>Item</Label>
                                                <Col sm="7">
                                                    <C_Select
                                                        value={ItemSelect}
                                                        options={ItemDropDown_Option}
                                                        isLoading={subgroupDropDownLoading}
                                                        onChange={(e) => { setItemSelect(e) }}
                                                        classNamePrefix="dropdown"
                                                        styles={{
                                                            menu: provided => ({ ...provided, zIndex: 2 })
                                                        }}
                                                    />
                                                </Col>
                                                <Col >
                                                    <C_Button
                                                        type="button"
                                                        spinnerColor="white"
                                                        className="btn btn-success  mt-1"
                                                        onClick={() => Addhandler()}
                                                    >
                                                        Go
                                                    </C_Button>
                                                </Col>
                                            </FormGroup>

                                            }


                                            {activeTab === "3" && <Col className={`d-flex justify-content-end`}>
                                                <C_Button
                                                    type="button"
                                                    spinnerColor="white"
                                                    className="btn btn-success  mt-1"
                                                    onClick={() => AddPartyhandler()}
                                                >
                                                    Go
                                                </C_Button>
                                            </Col>}


                                        </Col>
                                        <Col className={`d-flex justify-content-end`} sm={2}>
                                            {!schemeTypeValidation && <C_Button
                                                type="button"
                                                spinnerColor="white"
                                                className="btn btn-success  mr"
                                                onClick={() => Gobuttonhandlechange()}
                                            >
                                                Go
                                            </C_Button>}
                                        </Col>
                                    </div>
                                </div >

                            </Col>
                            {schemeTypeValidation && <Col sm={1} >
                                <div className="px-2   c_card_filter text-black" >
                                    <Col className={`d-flex justify-content-end ${!schemeTypeValidation ? "col-xxl-9" : "col-11"}`}>
                                        {
                                            <C_Button
                                                type="button"
                                                spinnerColor="white"
                                                className="btn btn-info  mr"
                                                forceDisabled={pageMode === mode.edit}
                                                title="Change Scheme Type"
                                                onClick={() => setSchemeTypeValidation(null)}
                                            >
                                                Change
                                            </C_Button>



                                        }

                                    </Col>
                                </div >

                            </Col>}

                        </Row>
                        {/* <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} > */}
                        {/* <Card className="text-black mt-2"> */}
                        <form noValidate>
                            {schemeTypeValidation && <>
                                <Nav tabs className="nav-tabs-custom nav-justified">
                                    {!(schemeTypeValidation?.SchemeTab?.hidden) && <NavItem>
                                        <NavLink
                                            id="nave-link-1"
                                            style={{ cursor: "pointer" }}
                                            className={classnames({
                                                active: activeTab === "1",
                                            })}
                                            onClick={() => {
                                                toggle1("1")
                                            }}
                                        >
                                            <span className="d-block d-sm-none">
                                                <i className="fas fa-home"></i>
                                            </span>
                                            <span className="d-none d-sm-block">Scheme</span>
                                        </NavLink>
                                    </NavItem>}

                                    {!(schemeTypeValidation?.SchemeItemTab?.hidden) && <NavItem>
                                        <NavLink
                                            id="nave-link-2"
                                            style={{ cursor: "pointer" }}
                                            className={classnames({
                                                active: activeTab === "2",
                                            })}
                                            onClick={() => {
                                                toggle1("2")
                                            }}
                                        >
                                            <span className="d-block d-sm-none">
                                                <i className="fas fa-home"></i>
                                            </span>
                                            <span className="d-none d-sm-block">Scheme Item</span>
                                        </NavLink>
                                    </NavItem>}

                                    {!(schemeTypeValidation?.SchemePartyTab?.hidden) && <NavItem>
                                        <NavLink
                                            id="nave-link-3"
                                            style={{ cursor: "pointer" }}
                                            className={classnames({
                                                active: activeTab === "3",
                                            })}
                                            onClick={() => {
                                                toggle1("3")
                                            }}
                                        >
                                            <span className="d-block d-sm-none">
                                                <i className="fas fa-home"></i>
                                            </span>
                                            <span className="d-none d-sm-block">Scheme Party</span>
                                        </NavLink>
                                    </NavItem>}

                                </Nav>

                                <TabContent activeTab={activeTab} className="p-3 text-muted">
                                    {activeTab === "1" && <TabPane tabId="1">
                                        <SchemeTabForm ref={SchemeTabRef}
                                            props={props}
                                            Validation={schemeTypeValidation}
                                            pageMode={pageMode}
                                            setState={setState}
                                            state={state}
                                        />

                                    </TabPane>}

                                    {activeTab === "2" && <TabPane tabId="2">
                                        <SchemeItemTabForm ref={SchemeItemTabRef}
                                            props={props}
                                            Addhandler={Addhandler}
                                            pageMode={pageMode}
                                            setState={setItemTabledata}
                                            state={ItemTabledata}
                                        />
                                    </TabPane>}

                                    {activeTab === "3" && <TabPane tabId="3">
                                        <SchemePartyTabForm
                                            ref={SchemePartyTabRef}
                                            props={props}
                                            Validation={schemeTypeValidation}
                                            pageMode={pageMode}
                                            setState={setPartyTabledata}
                                            state={PartyTabledata}
                                            AddPartyhandler={AddPartyhandler}
                                        />
                                    </TabPane>}

                                </TabContent>
                            </>}


                        </form>
                        {/* </Card> */}
                        {schemeTypeValidation && <SaveButtonDraggable>
                            <SaveButton pageMode={pageMode}
                                loading={saveBtnloading}
                                onClick={SaveHandler}
                                userAcc={userPageAccessState}
                            />
                        </SaveButtonDraggable>}
                    </Container>
                </div>
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default SchemeMaster

