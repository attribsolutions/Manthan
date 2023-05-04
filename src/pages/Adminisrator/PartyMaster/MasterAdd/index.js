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
import { getState } from "../../../../store/Administrator/EmployeeRedux/action"
import {
    editPartyIDSuccess,
    getPriceList,
    postPartyData,
    postPartyDataSuccess,
    updatePartyID,
    updatePartyIDSuccess
} from "../../../../store/Administrator/PartyRedux/action"
import { AlertState, Breadcrumb_inputName, commonPageField, commonPageFieldSuccess } from "../../../../store/actions"
import { breadcrumbReturnFunc, btnIsDissablefunc, isEditMode_CssFun, loginCompanyID, loginUserID, metaTageLabel } from "../../../../components/Common/CommonFunction"
import * as url from "../../../../routes/route_url";
import * as pageId from "../../../../routes/allPageID"
import * as mode from "../../../../routes/PageMode"
import { getPartyTypelist } from "../../../../store/Administrator/PartyTypeRedux/action";
import { getcompanyList } from "../../../../store/Administrator/CompanyRedux/actions";
import { SaveButton } from "../../../../components/Common/CommonButton";
import { SSDD_List_under_Company } from "../../../../store/CommonAPI/SupplierRedux/actions";
import AddressTabForm from "./AddressDetailsTab/index";
import { CustomAlert } from "../../../../CustomAlert/ConfirmDialog";
import { bulkSetState, formValid } from "../../../../components/Common/validationFunction";
import BaseTabForm from "./FirstTab/index";
import PrefixTab from "./PrefixTab/PrefixTab";

const PartyMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const addressTabRef = useRef(null);
    const baseTabRef = useRef(null);
    const prefixTabRef = useRef(null);

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
    } = useSelector((state) => ({
        postMsg: state.PartyMasterReducer.PartySaveSuccess,
        updateMsg: state.PartyMasterReducer.updateMessage,
        Company: state.Company.companyList,
        PartyTypes: state.PartyTypeReducer.ListData,
        PriceList: state.PartyMasterReducer.PriceList,
        AddressTypes: state.PartyMasterReducer.AddressTypes,
        userAccess: state.Login.RoleAccessUpdateData,
    }));

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

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
                    PriceList: (hasEditVal.PriceList) && {
                        label: hasEditVal.PriceList.Name,
                        value: hasEditVal.PriceList.id,
                    },
                    PartyType: {
                        label: hasEditVal.PartyType.Name,
                        value: hasEditVal.PartyType.id,
                    },
                    SAPPartyCode: hasEditVal.SAPPartyCode,
                    Supplier: [],
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
                    GSTIN: hasEditVal.GSTIN,
                    MkUpMkDn: hasEditVal.MkUpMkDn,
                    isActive: hasEditVal.isActive,

                }

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
                }

                let getBaseTab = baseTabRef.current.getCurrentState();
                let setBaseTab = baseTabRef.current.setCurrentState;
                let getPrefixtab = prefixTabRef.current.getCurrentState();
                let setPrefixtab = prefixTabRef.current.setCurrentState;
                let setAddressTab = addressTabRef.current.setCurrentState;

                bulkSetState(baseValue, getBaseTab, setBaseTab)
                bulkSetState(prefixValue, getPrefixtab, setPrefixtab)
                setAddressTab(hasEditVal.PartyAddress)
                dispatch(editPartyIDSuccess({ Status: false }));
            }
        }
    }, []);

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.PARTY))
        dispatch(getState());
        dispatch(getPriceList());
        dispatch(getPartyTypelist());
        dispatch(getcompanyList());
        dispatch(SSDD_List_under_Company())
    }, [dispatch]);

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200) && !(pageMode === mode.dropdownAdd)) {
            dispatch(postPartyDataSuccess({ Status: false }))

            if (pageMode === mode.dropdownAdd) {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                    RedirectPath: '/PartyList',
                    AfterResponseAction: false
                }))
            }
        }
        else if ((postMsg.Status === true) && !(pageMode === mode.dropdownAdd)) {
            dispatch(postPartyDataSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMsg.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg.Status])

    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            history.push({
                pathname: url.PARTY_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updatePartyIDSuccess({ Status: false }));
            dispatch(
                AlertState({
                    Type: 3,
                    Status: true,
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
            CustomAlert({
                Type: 4,
                Message: "Address details is required",
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
            }))

            const jsonBody = JSON.stringify({
                "Name": baseValue.Name,
                "PriceList": priceListSelect.value,
                "PartyType": baseValue.PartyType.value,
                "Company": loginCompanyID(),
                "PAN": baseValue.PAN,
                "Email": baseValue.Email,
                "MobileNo": baseValue.MobileNo,
                "AlternateContactNo": baseValue.AlternateContactNo,
                "State": baseValue.State.value,
                "District": baseValue.District.value,
                "SAPPartyCode": baseValue.SAPPartyCode,
                "Taluka": 0,
                "City": 0,
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
            debugger
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
                    <MetaTags> {metaTageLabel(userPageAccessState)}</MetaTags>
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
                                            </NavItem>

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
                                                <BaseTabForm ref={baseTabRef} />
                                            </TabPane>

                                            <TabPane tabId="2">
                                                <AddressTabForm ref={addressTabRef} />
                                            </TabPane>

                                            <TabPane tabId="3">
                                                <PrefixTab ref={prefixTabRef} />
                                            </TabPane>
                                        </TabContent>
                                    </CardBody>

                                    <div style={{ paddingLeft: "30px", paddingBottom: "10px" }}>
                                        <SaveButton pageMode={pageMode}
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




