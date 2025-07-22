import React, { useEffect, useRef, useState, } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Label,
    Row,
    Input,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Button,
} from "reactstrap";
import Select from "react-select";
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
    onChangeDate,
    onChangeSelect,
    onChangeText,
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
import { C_ItemSelect, C_Select } from "../../../CustomValidateForm";
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
        ValueIn: "",
        FromPeriod: _cfunc.currentDate_ymd,
        ToPeriod: _cfunc.currentDate_ymd,
        Item: "",
        VoucherLimit: null,
        QRPrefix: "",
        IsActive: null,
        SchemeTypeID: "",
        BillAbove: "",
        Message: "",
        OverLappingScheme: false,
        SchemeDetails: "",
        SchemeValueUpto: "",
        Party: "",
        SchemeId: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [activeTab, setactiveTab] = useState("1")
    const [groupDropdownSelect, setGroupDropdownSelect] = useState(allLabelWithZero);
    const [subGroupDropdownSelect, setSubGroupDropdownSelect] = useState(allLabelWithZero);
    const [ItemDropDown_Option, setItemDropDown_Option] = useState([allLabelWithZero]);
    const [ItemSelect, setItemSelect] = useState(allLabelWithZero);
    const [ItemData, setItemData] = useState([]);

    const [ItemTabledata, setItemTabledata] = useState([]);
    const [PartySelect, setPartySelect] = useState(allLabelWithZero);

    const [PartyTabledata, setPartyTabledata] = useState([]);

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
            dispatch(editSchemeIDSuccess({ Status: false }));

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


    useEffect(() => {

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

        }
    }, [location]);

    const getItemData = () => {
        return SchemeItemTabRef.current.getValue();
    }
    const getSchemeData = () => {
        return SchemeTabRef.current.getValue();
    }

    const getPartyData = () => {
        return SchemePartyTabRef.current.getValue();
    }

    const toggle1 = tab => {
        if (activeTab !== tab) {
            setactiveTab(tab)
        }
    }

    const PartyList_Options = PartyDropDown.map((item) => ({
        value: item.id,
        label: item.Name,
        IsPartySelect: false,

    }));
    PartyList_Options.unshift(allLabelWithZero)

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
        const SchemeData = getSchemeData()
        const ItemData = getItemData()
        const PartyData = getPartyData()
        const setSchemeData = SchemeTabRef.current.updateValue;


        if (PartyData.length > 0 && ItemData.length > 0) {
            SchemeData.hasValid.Party.valid = true
            SchemeData.hasValid.Item.valid = true
        }
        if (PartyData.length === 0) {
            customAlert({
                Type: 4,
                Message: alertMessages.selectParty,
            })
            return
        }

        if (ItemData.length === 0 && !(schemeTypeValidation?.SchemeItemTab?.hidden)) {
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
            if (formValid(SchemeData, setSchemeData)) {
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
                    PartyDetails: PartyData
                        .filter(i => i.IsPartySelect) // only include items where IsPartySelect is true
                        .map(i => ({
                            PartyID: i.value
                        })),

                    ItemDetails: ItemData.filter(i => i.applicable || i.not_applicable).flatMap(i => {
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
        if (ItemSelect.value === 0) {
            setItemTabledata(ItemDropDown_Option)
        } else {
            setItemTabledata([ItemSelect])
        }
    }


    const AddPartyhandler = () => {

        if (PartySelect.value === 0) {
            setPartyTabledata(PartyList_Options.filter(i => i.value !== 0))
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
            // setPartyTabledata([PartySelect])
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
                                    <TabPane tabId="1">
                                        <SchemeTabForm ref={SchemeTabRef}
                                            props={props}
                                            Validation={schemeTypeValidation}
                                            pageMode={pageMode} />
                                    </TabPane>

                                    <TabPane tabId="2">
                                        <SchemeItemTabForm ref={SchemeItemTabRef}
                                            props={props}
                                            Addhandler={Addhandler}
                                            pageMode={pageMode}
                                            ItemTabledata={ItemTabledata} />
                                    </TabPane>

                                    <TabPane tabId="3">
                                        <SchemePartyTabForm
                                            ref={SchemePartyTabRef}
                                            props={props}
                                            Validation={schemeTypeValidation}
                                            pageMode={pageMode}
                                            PartyTabledata={PartyTabledata}
                                            AddPartyhandler={AddPartyhandler}
                                        />
                                    </TabPane>

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

