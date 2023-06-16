import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
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
import { getCityOnDistrict, getCityOnDistrictSuccess, getState } from "../../../../store/Administrator/EmployeeRedux/action"
import {
    editPartyIDSuccess,
    getDistrictOnState,
    getDistrictOnStateSuccess,
    postPartyData,
    postPartyDataSuccess,
    updatePartyID,
    updatePartyIDSuccess
} from "../../../../store/Administrator/PartyRedux/action"
import { Breadcrumb_inputName, commonPageField, commonPageFieldSuccess } from "../../../../store/actions"
import { btnIsDissablefunc, isEditMode_CssFun, loginCompanyID, loginUserID, metaTagLabel } from "../../../../components/Common/CommonFunction"
import * as url from "../../../../routes/route_url";
import * as pageId from "../../../../routes/allPageID"
import * as mode from "../../../../routes/PageMode"
import { getPartyTypelist } from "../../../../store/Administrator/PartyTypeRedux/action";
import { getcompanyList } from "../../../../store/Administrator/CompanyRedux/actions";
import { SaveButton } from "../../../../components/Common/CommonButton";
import { SSDD_List_under_Company } from "../../../../store/CommonAPI/SupplierRedux/actions";
import AddressTabForm from "./AddressDetailsTab/index";
import { customAlert } from "../../../../CustomAlert/ConfirmDialog";
import { bulkSetState, formValid } from "../../../../components/Common/validationFunction";
import BaseTabForm from "./FirstTab/index";
import PrefixTab from "./PrefixTab/PrefixTab";
import { priceListByPartyAction, priceListByPartyActionSuccess } from "../../../../store/Administrator/PriceList/action";
import { userAccessUseEffect } from "../../../../components/Common/CommonUseEffect";



function initialState(history) {

    let page_Id = '';
    let listPath = ''
    let sub_Mode = history.location.pathname;

    if (sub_Mode === url.PARTY) {
        page_Id = pageId.PARTY;
        listPath = url.PARTY_lIST
    }
    else {
        page_Id = pageId.RETAILER_MASTER;
        listPath = url.RETAILER_LIST
    }
    return { page_Id, listPath }
};

const PartyMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const addressTabRef = useRef(null);
    const baseTabRef = useRef(null);
    const prefixTabRef = useRef(null);

    const [page_id] = useState(() => initialState(history).page_Id)
    const [listPath] = useState(() => initialState(history).listPath)
    const [subPageMode] = useState(history.location.pathname)

    const [EditData, setEditData] = useState('');
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState(11);
    const [activeTab1, setactiveTab1] = useState("1")
    const [modalCss, setModalCss] = useState(false);

    const [editCreatedBy, seteditCreatedBy] = useState("");

    const {
        postMsg,
        userAccess,
        updateMsg,
        saveBtnloading
    } = useSelector((state) => ({
        saveBtnloading: state.PartyMasterReducer.saveBtnloading,
        postMsg: state.PartyMasterReducer.postMsg,
        updateMsg: state.PartyMasterReducer.updateMsg,
        Company: state.Company.companyList,
        PartyTypes: state.PartyTypeReducer.ListData,
        PriceList: state.PartyMasterReducer.PriceList,
        AddressTypes: state.PartyMasterReducer.AddressTypes,
        userAccess: state.Login.RoleAccessUpdateData,
    }));

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)


    useEffect(() => userAccessUseEffect({
        props,
        userAccess,
        dispatch,
        setUserAccState
    }), [userAccess]);


    useEffect(() => {

        try {
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
                    seteditCreatedBy(hasEditVal.CreatedBy);

                    let baseValue = {
                        Name: hasEditVal.Name,
                        MobileNo: hasEditVal.MobileNo,
                        PartyType: {
                            label: hasEditVal.PartyType.Name,
                            value: hasEditVal.PartyType.id,
                        },
                        SAPPartyCode: hasEditVal.SAPPartyCode,


                        Supplier: hasEditVal.PartySubParty.map(i => ({
                            value: i.Party,
                            label: i.PartyName,
                            Creditlimit: i.Creditlimit,
                            Route: i.Route,
                            Subparty: i.Subparty
                        })),
                        PAN: hasEditVal.PAN,
                        Email: hasEditVal.Email,
                        AlternateContactNo: hasEditVal.AlternateContactNo,
                        State: {
                            label: hasEditVal.State.Name,
                            value: hasEditVal.State.id,
                        },
                        District: {
                            label: hasEditVal.District.Name,
                            value: hasEditVal.District.id,
                        },
                        CityName: {
                            label: hasEditVal.City.Name,
                            value: hasEditVal.City.id,
                        },
                        GSTIN: hasEditVal.GSTIN,
                        MkUpMkDn: hasEditVal.MkUpMkDn,
                        isActive: hasEditVal.isActive,

                    };

                    let prefix = (hasEditVal.PartyPrefix.length > 0) ? hasEditVal.PartyPrefix[0] : '';
                    let prefixValue = {
                        OrderPrefix: prefix.Orderprefix,
                        InvoicePrefix: prefix.Invoiceprefix,
                        GRNPrefix: prefix.Grnprefix,
                        ReceiptPrefix: prefix.Receiptprefix,
                        ChallanPrefix: prefix.Challanprefix,
                        WorkOrderPrefix: prefix.WorkOrderprefix,
                        MaterialIssuePrefix: prefix.MaterialIssueprefix,
                        DemandPrefix: prefix.Demandprefix,
                        IBChallanPrefix: prefix.IBChallanprefix,
                        IBInwardPrefix: prefix.IBInwardprefix,
                    };

                    let editPriceList = (hasEditVal.PriceList) ? {
                        label: hasEditVal.PriceList.Name, value: hasEditVal.PriceList.id,
                    } : { label: '' };

                    let nextId = 1;
                    let addressTabPreIncrementId = hasEditVal.PartyAddress.map((obj) => {
                        const newObj = { ...obj, RowId: nextId };
                        nextId++;
                        return newObj;
                    })

                    let getBaseTab = baseTabRef.current.getCurrentState();
                    let setBaseTab = baseTabRef.current.setCurrentState;
                    let getPrefixtab = prefixTabRef.current.getCurrentState();
                    let setPrefixtab = prefixTabRef.current.setCurrentState;
                    let setAddressTab = addressTabRef.current.setCurrentState;
                    let setPriceList = baseTabRef.current.setPriceListSelect;


                    bulkSetState(baseValue, getBaseTab, setBaseTab)
                    bulkSetState(prefixValue, getPrefixtab, setPrefixtab)
                    setAddressTab(addressTabPreIncrementId)
                    setPriceList(editPriceList);

                    dispatch(getDistrictOnState(hasEditVal.State.id))
                    dispatch(getCityOnDistrict(hasEditVal.District.id))
                    dispatch(priceListByPartyAction(hasEditVal.PartyType.id,))
                    dispatch(editPartyIDSuccess({ Status: false }));
                }
            }
        } catch (e) { }
    }, []);

    useLayoutEffect(() => {

        dispatch(getDistrictOnStateSuccess([]))//clear district privious options
        dispatch(getCityOnDistrictSuccess([]))//clear City privious options
        dispatch(commonPageFieldSuccess(null));//clear privious PageField
        dispatch(priceListByPartyActionSuccess([]));//clear privious priceList
        dispatch(commonPageField(page_id))
        dispatch(getState());
        dispatch(getPartyTypelist());
        dispatch(getcompanyList());
        dispatch(SSDD_List_under_Company())
    }, [])



    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200) && !(pageMode === mode.dropdownAdd)) {
            dispatch(postPartyDataSuccess({ Status: false }))

            if (pageMode === mode.dropdownAdd) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                const a = await customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                if (a) {
                    history.push({
                        pathname: listPath,
                    });
                }
            }
        }
        else if ((postMsg.Status === true) && !(pageMode === mode.dropdownAdd)) {
            dispatch(postPartyDataSuccess({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg.Status])

    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            history.push({
                pathname: listPath,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updatePartyIDSuccess({ Status: false }));
            dispatch(
                customAlert({
                    Type: 3,
                    Message: JSON.stringify(updateMsg.Message),
                })
            );
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

        let baseTabDetail = baseTabRef.current.getCurrentState()
        let priceListSelect = baseTabRef.current.getPriceListSelect()
        let setBaseTabDetail = baseTabRef.current.setCurrentState
        let addressTabDetail = addressTabRef.current.getCurrentState()
        let prefixValue = prefixTabRef.current.getCurrentState().values

        const validBasetab = formValid(baseTabDetail, setBaseTabDetail)

        if (!validBasetab) {
            setactiveTab1("1")
            return
        };

        if (addressTabDetail.length === 0) {
            setactiveTab1("2")
            customAlert({
                Type: 4,
                Message: "Address details is required",
            })
            return;
        };
        debugger
        const trueValues = addressTabDetail.map((index) => {
            return (index.IsDefault === true)
        })

        const totalIsDefault = trueValues.reduce((count, value) => {
            if (value === true) {
                count++
            }
            return count
        }, 0)

        if (totalIsDefault === 0) {
            setactiveTab1("2")
            customAlert({
                Type: 4,
                Message: "Atleast One Default Address is Select ",
            })
            return;
        };

        try {
            btnIsDissablefunc({ btnId, state: true })

            const baseValue = baseTabDetail.values

            const supplierArr = baseValue.Supplier.map((i) => ({

                Party: i.value,
                CreatedBy: loginUserID(),
                UpdatedBy: loginUserID(),
                Creditlimit: pageMode === mode.edit ? i.Creditlimit : "",
                Route: pageMode === mode.edit ? i.Route : "",
            }))

            addressTabDetail.map((i) => {
                if (i.RowId) {
                    i["id"] = "0"
                }
            })

            const jsonBody = JSON.stringify({
                "Name": baseValue.Name,
                "PriceList": priceListSelect.value,
                "PartyType": baseValue.PartyType.value,
                "Company": (pageMode === mode.defaultsave) ? loginCompanyID() : EditData.Company.id,
                "PAN": baseValue.PAN,
                "Email": baseValue.Email,
                "MobileNo": baseValue.MobileNo,
                "AlternateContactNo": baseValue.AlternateContactNo,
                "State": baseValue.State.value,
                "District": baseValue.District.value,
                "City": baseValue.CityName.value,
                "SAPPartyCode": !(baseValue.SAPPartyCode === "") ? baseValue.SAPPartyCode : null,
                "Taluka": 0,
                // "City": 0,
                "GSTIN": baseValue.GSTIN,
                "MkUpMkDn": baseValue.MkUpMkDn,
                "isActive": baseValue.IsActive,
                "CreatedBy": loginUserID(),
                "UpdatedBy": loginUserID(),
                "PartySubParty": supplierArr,
                "PartyAddress": addressTabDetail,

                "PartyPrefix": [
                    {
                        "Orderprefix": prefixValue.OrderPrefix,
                        "Invoiceprefix": prefixValue.InvoicePrefix,
                        "Grnprefix": prefixValue.GRNPrefix,
                        "Receiptprefix": prefixValue.ReceiptPrefix,
                        "Challanprefix": prefixValue.Challanprefix,
                        "WorkOrderprefix": prefixValue.WorkOrderPrefix,
                        "MaterialIssueprefix": prefixValue.MaterialIssuePrefix,
                        "Demandprefix": prefixValue.DemandPrefix,
                        "IBChallanprefix": prefixValue.IBChallanPrefix,
                        "IBInwardprefix": prefixValue.IBInwardPrefix
                    }
                ],

            });

            if (pageMode === mode.edit) {

                dispatch(updatePartyID({ jsonBody, updateId: EditData.id, btnId }));
            }
            else {
                dispatch(postPartyData({ jsonBody, btnId }));
            }

        } catch (error) { btnIsDissablefunc({ btnId, state: false }) }
    };

    let IsEditMode_Css = isEditMode_CssFun();

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <MetaTags> {metaTagLabel(userPageAccessState)}</MetaTags>
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
                                                    <span className="d-none d-sm-block">Party Master</span>
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
                                                    <span className="d-none d-sm-block">Address Details</span>

                                                </NavLink>
                                            </NavItem>
                                            {subPageMode === url.PARTY &&// only view when party  master Mode
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
                                                        <span className="d-none d-sm-block">Transaction Prefix</span>
                                                    </NavLink>
                                                </NavItem>}


                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    <span className="d-block d-sm-none">
                                                        <i className="fas fa-home"></i>
                                                    </span>
                                                </NavLink>
                                            </NavItem>
                                        </Nav>

                                        <TabContent activeTab={activeTab1} className="p-3 text-muted">
                                            <TabPane tabId="1">
                                                <BaseTabForm ref={baseTabRef} subPageMode={subPageMode} />
                                            </TabPane>

                                            <TabPane tabId="2">
                                                <AddressTabForm ref={addressTabRef} subPageMode={subPageMode} />
                                            </TabPane>

                                            <TabPane tabId="3">
                                                <PrefixTab ref={prefixTabRef} subPageMode={subPageMode} />
                                            </TabPane>
                                        </TabContent>
                                    </CardBody>

                                    <div style={{ paddingLeft: "30px", paddingBottom: "10px" }}>
                                        <SaveButton pageMode={pageMode}
                                            loading={saveBtnloading}
                                            userAcc={userPageAccessState}
                                            editCreatedBy={editCreatedBy}
                                            module={"PartyMaster"}
                                            onClick={SaveHandler}
                                        />
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                    </Container>
                </div >
            </React.Fragment>
        );
    };
    return null
};
export default PartyMaster;




