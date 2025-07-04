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
import { editSchemeIDSuccess, saveSchemeMaster, saveSchemeMaster_Success, updateSchemeID, updateSchemeIDSuccess } from "../../../store/Administrator/SchemeMasterRedux/action";
import { getSchemeTypelist } from "../../../store/Administrator/SchemeRedux/action";
import classnames from "classnames"
import SchemeTabForm from "./SchemeTabForm";
import SchemeItemTabForm from "./SchemeItemTabForm";
import SchemePartyTabForm from "./SchemePartyTabForm";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";

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
        VoucherLimit: "",
        QRPrefix: "",
        IsActive: null,
        SchemeTypeID: "",
        BillAbove: "",
        Message: "",
        OverLappingScheme: null,
        SchemeDetails: "",
        SchemeValueUpto: "",
        Party: "",
        SchemeId: ""
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
            dispatch(editSchemeIDSuccess({ Status: false }));

        }
    }, []);


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
                hasEditVal = location.rowData
            }
            else if (hasShowModal) {
                setPageMode(props.pageMode)
                hasEditVal = props.editValue
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

        if (ItemData.length === 0) {
            customAlert({
                Type: 4,
                Message: alertMessages.selectItemName,
            })
            return
        }
        debugger
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
                    SchemeTypeID: SchemeData.values.SchemeTypeID.value,
                    BillEffect: 1,
                    PartyDetails: PartyData.map(i => ({
                        PartyID: i.value,

                    })),
                    ItemDetails: ItemData.map(i => ({
                        Item: i.value,    // ItemID           
                        ItemName: i.label, // ItemName
                        DiscountType: i.DiscountType, // DiscountType
                        TypeForItem: i.TypeForItem, // TypeForItem
                        DiscountValue: i.DiscountValue, // DiscountValue
                        Quantity: i.Quantity || 0,
                    })),
                });

                if (pageMode == mode.edit) {
                    dispatch(updateSchemeID({ jsonBody, updateId: SchemeData.values.SchemeId, }));
                } else {
                    dispatch(saveSchemeMaster({ jsonBody }));
                }


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

                                        <NavItem>
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
                                        </NavItem>

                                    </Nav>

                                    <TabContent activeTab={activeTab} className="p-3 text-muted">
                                        <TabPane tabId="1">
                                            <SchemeTabForm ref={SchemeTabRef} props={props} />
                                        </TabPane>

                                        <TabPane tabId="2">
                                            <SchemeItemTabForm ref={SchemeItemTabRef} props={props} />
                                        </TabPane>

                                        <TabPane tabId="3">
                                            <SchemePartyTabForm ref={SchemePartyTabRef} props={props} />
                                        </TabPane>

                                    </TabContent>

                                    <SaveButton pageMode={pageMode}
                                        loading={saveBtnloading}
                                        onClick={SaveHandler}
                                        userAcc={userPageAccessState}
                                    />

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

