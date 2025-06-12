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
} from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import {
    Breadcrumb_inputName,
    commonPageField,
    commonPageFieldSuccess,
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
import { SaveButton } from "../../../components/Common/CommonButton";
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
import { saveSchemeMaster, saveSchemeMaster_Success } from "../../../store/Administrator/SchemeMasterRedux/action";
import { getSchemeTypelist } from "../../../store/Administrator/SchemeRedux/action";
import classnames from "classnames"
import SchemeTabForm from "./SchemeTabForm";
import SchemeItemTabForm from "./SchemeItemTabForm";

const SchemeMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const { location } = history
    const SchemeTabRef = useRef(null);
    const SchemeItemTabRef = useRef(null);

    const fileds = {
        SchemeName: "",
        SchemeValue: "",
        ValueIn: "",
        FromPeriod: _cfunc.currentDate_ymd,
        ToPeriod: _cfunc.currentDate_ymd,
        Item: "",
        VoucherLimit: "",
        QRPrefix: "",
        IsActive: null,
        SchemeTypeID: "",
        BillAbove: "",
        Message: "",
        OverLappingScheme: null,
        SchemeDetails: "",
        SchemeValueUpto: "",
        Party: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [activeTab, setactiveTab] = useState("1")


    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        pageField,
        saveBtnloading,
        updateMsg,
        userAccess } = useSelector((state) => ({
            postMsg: state.SchemeReducer.postMsg,
            updateMsg: state.SchemeReducer.updateMsg,
            saveBtnloading: state.SPos_MachineType_Reducer.saveBtnloading,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField,
        }));

    useEffect(() => {
        const page_Id = pageId.SCHEME_MASTER
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getItemList());
        dispatch(getSchemeTypelist());
        dispatch(getCommonPartyDrodownOptionAction())
        return () => {
            dispatch(saveSchemeMaster_Success({ Status: false }));
        }
    }, []);

    const hasShowloction = location.hasOwnProperty("rowData")
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }

    const { isError } = state;
    const { fieldLabel } = state;

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

    const getItemData = () => {
        return SchemeItemTabRef.current.getValue();
    }
    const getSchemeData = () => {
        return SchemeTabRef.current.getValue();
    }
    const toggle1 = tab => {
        if (activeTab !== tab) {
            setactiveTab(tab)
        }
    }

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time
    useEffect(() => {

        if ((hasShowloction || hasShowModal)) {

            let hasEditVal = null
            if (hasShowloction) {
                setPageMode(location.pageMode)
                hasEditVal = location.rowData
            }
            else if (hasShowModal) {
                hasEditVal = props.editValue
                setPageMode(props.pageMode)
            }
            debugger
            if (hasEditVal) {
                const { SchemeName, SchemeValue, ValueIn, FromPeriod,
                    ToPeriod, ItemDetails, VoucherLimit, QRPrefix, IsActive,
                    SchemeTypeID, BillAbove, Message, OverLappingScheme, SchemeTypeName,
                    SchemeDetails, SchemeValueUpto, PartyDetails
                } = hasEditVal[0]
                debugger
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
                values.ToPeriod = ToPeriod
                values.IsActive = IsActive
                values.Item = ItemDetails.map(i => ({
                    label: i.ItemName,
                    value: i.ItemID
                }));
                values.Party = PartyDetails.map(i => ({
                    label: i.PartyName,
                    value: i.PartyID
                }));
                values.SchemeValue = SchemeValue
                values.ValueIn = ValueIn
                values.QRPrefix = QRPrefix
                values.SchemeName = SchemeName
                values.BillAbove = BillAbove
                values.VoucherLimit = VoucherLimit
                values.IsActive = IsActive
                values.FromPeriod = FromPeriod
                values.Message = Message
                values.SchemeTypeID = {
                    label: SchemeTypeName,
                    value: SchemeTypeID
                }
                values.SchemeValueUpto = SchemeValueUpto
                values.OverLappingScheme = OverLappingScheme
                values.SchemeDetails = SchemeDetails
                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.RoleMaster))
            }
        }
    }, [location]);

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

    const SaveHandler = async (event) => {
        event.preventDefault();
        const btnId = event.target.id
        const SchemeData = getSchemeData()
        const setSchemeData = SchemeTabRef.current.updateValue;

        const ItemData = getItemData()
        // const setItemData = SchemeItemTabRef.current.updateValue;



        try {
            if (formValid(SchemeData, setSchemeData)) {
                btnIsDissablefunc({ btnId, state: true })
                debugger
                const jsonBody = JSON.stringify({
                    SchemeName: SchemeData.values.SchemeName,
                    SchemeValue: SchemeData.values.SchemeValue,
                    ValueIn: SchemeData.values.ValueIn,
                    FromPeriod: SchemeData.values.FromPeriod,
                    ToPeriod: SchemeData.values.ToPeriod,
                    FreeItemID: null,
                    VoucherLimit: SchemeData.values.VoucherLimit,
                    SchemeValueUpto: SchemeData.values.SchemeValueUpto,
                    BillAbove: SchemeData.values.BillAbove,
                    QRPrefix: SchemeData.values.QRPrefix,
                    IsActive: SchemeData.values.IsActive,
                    SchemeTypeID: SchemeData.values.SchemeTypeID.value,
                    BillEffect: 1,
                    PartyDetails: SchemeData.values.Party.map(i => ({
                        PartyID: i.value,
                        TypeForItem: i.PartyID,
                        DiscountType: i.DiscountType

                    })),
                    ItemDetails: ItemData.map(i => ({
                        Item: i.value,    // ItemID           
                        ItemName: i.label, // ItemName
                        DiscountType: i.DiscountType, // DiscountType
                        TypeForItem: i.ItemType.value, // ItemType
                        DiscountValue: i.DiscountValue, // DiscountValue
                    })),
                });
                dispatch(saveSchemeMaster({ jsonBody }));
            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };




    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" >
                    <Container fluid>
                        <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

                        <Card className="text-black" style={{ marginTop: "3px" }}>
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form noValidate>
                                    <Nav tabs className="nav-tabs-custom nav-justified">
                                        <NavItem>
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
                                        </NavItem>

                                        <NavItem>
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
                                        </NavItem>
                                    </Nav>

                                    <TabContent activeTab={activeTab} className="p-3 text-muted">
                                        <TabPane tabId="1">
                                            <SchemeTabForm ref={SchemeTabRef} />
                                        </TabPane>

                                        <TabPane tabId="2">
                                            <SchemeItemTabForm ref={SchemeItemTabRef} />
                                        </TabPane>


                                    </TabContent>



                                    <SaveButtonDraggable>
                                        <SaveButton pageMode={pageMode}
                                            loading={saveBtnloading}
                                            onClick={SaveHandler}
                                            userAcc={userPageAccessState}
                                        />
                                    </SaveButtonDraggable>
                                </form>
                            </CardBody>
                        </Card>

                    </Container>
                </div>
            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default SchemeMaster

