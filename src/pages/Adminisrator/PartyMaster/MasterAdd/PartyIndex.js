import React, { useEffect, useRef, useState } from "react"
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
	editPartyID,
	editPartyIDSuccess,
	getDistrictOnState,
	getDistrictOnStateSuccess,
	postPartyData,
	postPartyDataSuccess,
	updatePartyID,
	updatePartyIDSuccess
} from "../../../../store/Administrator/PartyRedux/action"
import { Breadcrumb_inputName, commonPageField } from "../../../../store/actions"
import { btnIsDissablefunc, getMimeTypeFromExtension, loginCompanyID, loginUserAdminRole, loginUserID } from "../../../../components/Common/CommonFunction"
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
import { mobileApp_RetailerUpdate_Api } from "../../../../helpers/backend_helper";
import { showToastAlert } from "../../../../helpers/axios_Config";
import { mobileApp_Send_Retailer_Api } from "../../../../helpers/backend_helper"
import { changeCommonPartyDropDetailsAction } from "../../../../store/Utilites/PartyDrodown/action";
import { alertMessages } from "../../../../components/Common/CommonErrorMsg/alertMsg";
import { getClusterlist } from "../../../../store/Administrator/ClusterRedux/action";
import { getCountryList_Action, getCountryList_Success } from "../../../../store/Administrator/CountryRedux/action";

function initialState(props) {

	let page_Id = '';
	let listPath = ''
	let sub_Mode = props.location.pathname;

	if (sub_Mode === url.PARTY) {
		page_Id = pageId.PARTY;
		listPath = url.PARTY_lIST
	}
	else if (sub_Mode === url.NON_RETAILER_PARTY) {
		page_Id = pageId.NON_RETAILER_PARTY;
		listPath = url.NON_RETAILER_PARTY_lIST
	}
	else if (sub_Mode === url.PARTY_SELF_EDIT) {
		page_Id = pageId.PARTY_SELF_EDIT;
	}
	else if (sub_Mode === url.FRANCHISE_CUSTOMER_MASTER) {

		page_Id = pageId.FRANCHISE_CUSTOMER_MASTER;
		listPath = url.FRANCHISE_CUSTOMER_LIST
	}
	else if (sub_Mode === url.RETAILER_MASTER_1) { // chitale americar change For validation field validation Page id change
		page_Id = pageId.RETAILER_MASTER_1;
		listPath = url.RETAILER_MASTER_LIST_1
		sub_Mode = url.RETAILER_MASTER
	} else {
		page_Id = pageId.RETAILER_MASTER;
		listPath = url.RETAILER_LIST
	}
	return { page_Id, listPath, sub_Mode }
};

const PartyMaster = (props) => {

	const dispatch = useDispatch();
	const history = useHistory()

	const addressTabRef = useRef(null);
	const baseTabRef = useRef(null);
	const prefixTabRef = useRef(null);

	const [page_id] = useState(() => initialState(props).page_Id)
	const [listPath] = useState(() => initialState(props).listPath)
	const [subPageMode] = useState(() => initialState(props).sub_Mode)

	const [EditData, setEditData] = useState('');
	const [pageMode, setPageMode] = useState(mode.defaultsave);
	const [userPageAccessState, setUserAccState] = useState(11);

	const [activeTab1, setactiveTab1] = useState("1")
	const [modalCss, setModalCss] = useState(false);
	const [isMobileRetailer, setIsMobileRetailer] = useState(false);

	const [editCreatedBy, seteditCreatedBy] = useState("");

	const {
		postMsg,
		userAccess,
		editData,
		updateMsg,
		saveBtnloading,

	} = useSelector((state) => ({

		saveBtnloading: state.PartyMasterReducer.saveBtnloading,
		postMsg: state.PartyMasterReducer.postMsg,
		editData: state.PartyMasterReducer.editData,
		updateMsg: state.PartyMasterReducer.updateMsg,
		Company: state.Company.companyList,
		PartyTypes: state.PartyTypeReducer.ListData,
		PriceList: state.PartyMasterReducer.PriceList,
		AddressTypes: state.PartyMasterReducer.AddressTypes,
		userAccess: state.Login.RoleAccessUpdateData,
	}));
	const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);

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


		dispatch(commonPageField(page_id))
		dispatch(getState());
		dispatch(getPartyTypelist());
		dispatch(getClusterlist());
		dispatch(getcompanyList());
		dispatch(SSDD_List_under_Company())

		dispatch(getCountryList_Action());

		return () => {

			dispatch(getCountryList_Success());
			dispatch(priceListByPartyActionSuccess([]));//clear privious priceList
			dispatch(getCityOnDistrictSuccess([]))//clear City privious options
			dispatch(getDistrictOnStateSuccess([]))//clear district privious options
		}
	}, [])

	useEffect(() => {

		if (subPageMode === url.PARTY_SELF_EDIT && commonPartyDropSelect.value > 0) {
			dispatch(editPartyID({
				editId: commonPartyDropSelect.value,
				btnmode: 'edit',
				subPageMode: 'PartySelfEdit',
				btnId: `btn-edit-${commonPartyDropSelect.value}`,

			}))
		}

		if (commonPartyDropSelect.value <= 0 && subPageMode === url.PARTY_SELF_EDIT) {
			partySelectOnChangeHandler();
		}

		return () => {
			dispatch(priceListByPartyActionSuccess([]));//clear privious priceList
			dispatch(changeCommonPartyDropDetailsAction({ isShow: true, forceDisable: false }))//change party drop-down restore state
		}

	}, [commonPartyDropSelect.value])

	function partySelectOnChangeHandler() {

		addressTabRef.current = null;
		baseTabRef.current = null;
		prefixTabRef.current = null;
		dispatch(getDistrictOnStateSuccess([]))//clear district privious options
		dispatch(getCityOnDistrictSuccess([]))//clear City privious options
		dispatch(priceListByPartyActionSuccess([]));//clear privious priceList
		dispatch(editPartyIDSuccess({ Status: false }));
	}

	useEffect(async () => {

		if (editData.Status === true) {

			try {

				if ((hasShowloction || hasShowModal) || (subPageMode === url.PARTY_SELF_EDIT)) {

					let hasEditVal = null
					if (hasShowloction) {
						setPageMode(location.pageMode)
						hasEditVal = location.editValue
						setIsMobileRetailer(location.IsMobileRetailer)
					}
					else if (hasShowModal) {
						hasEditVal = props.editValue
						setPageMode(props.pageMode)
						setModalCss(true)
						// setIsMobileRetailer(true)
					}
					if ((editData.Status === true) && (subPageMode === url.PARTY_SELF_EDIT)) {
						hasEditVal = editData.Data
						setPageMode(mode.edit)
						setModalCss(false)
						dispatch(editPartyIDSuccess({ Status: false }));
						// setIsMobileRetailer(true)
					}

					if (hasEditVal) {

						setEditData(hasEditVal);
						dispatch(Breadcrumb_inputName(hasEditVal.Name))
						seteditCreatedBy(hasEditVal.CreatedBy);

						let baseValue = {
							Name: hasEditVal.Name,
							ShortName: hasEditVal.ShortName,
							MobileNo: hasEditVal.MobileNo,
							Latitude: hasEditVal.Latitude,
							Longitude: hasEditVal.Longitude,
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
								RouteName: i.RouteName,
								Distance: i.Distance,
								Subparty: i.Subparty,
							})),

							PAN: hasEditVal.PAN,
							Email: hasEditVal.Email,
							AlternateContactNo: hasEditVal.AlternateContactNo,
							CountryName: hasEditVal.Country === null ? {
								label: "India",
								value: 1,
							} : {
								label: hasEditVal.Country.Country,
								value: hasEditVal.Country.id,
							},
							State: {
								label: hasEditVal.State.Name,
								value: hasEditVal.State.id,
							},
							District: {
								label: hasEditVal.District.Name,
								value: hasEditVal.District.id,
							},

							Cluster: {
								label: hasEditVal.Cluster ? hasEditVal.Cluster.Name : "Select...",
								value: hasEditVal.Cluster ? hasEditVal.Cluster.id : "",
							},

							SubCluster: {
								label: hasEditVal.SubCluster ? hasEditVal.SubCluster.Name : "Select...",
								value: hasEditVal.SubCluster ? hasEditVal.SubCluster.id : "",
							},

							CityName: {
								label: hasEditVal.City === null ? "Select..." : hasEditVal.City.Name,
								value: hasEditVal.City === null ? "" : hasEditVal.City.id,
							},
							Route: {
								label: hasEditVal.PartySubParty[0]?.RouteName === null ? "Select..." : hasEditVal.PartySubParty[0]?.RouteName,
								value: hasEditVal.PartySubParty[0]?.Route === null ? "" : hasEditVal.PartySubParty[0]?.Route,
							},
							GSTIN: hasEditVal.GSTIN,
							isActive: location.IsMobileRetailer ? true : hasEditVal.isActive,

						};

						let prefix = (hasEditVal.PartyPrefix.length > 0) ? hasEditVal.PartyPrefix[0] : '';
						let prefixValue = {
							OrderPrefix: !prefix.Orderprefix ? "PO" : prefix.Orderprefix,
							InvoicePrefix: !prefix.Invoiceprefix ? "IN" : prefix.Invoiceprefix,
							GRNPrefix: !prefix.Grnprefix ? "GRN" : prefix.Grnprefix,
							ReceiptPrefix: !prefix.Receiptprefix ? "RE" : prefix.Receiptprefix,
							ChallanPrefix: !prefix.Challanprefix ? "CH" : prefix.Challanprefix,
							WorkOrderPrefix: !prefix.WorkOrderprefix ? "WO" : prefix.WorkOrderprefix,
							MaterialIssuePrefix: !prefix.MaterialIssueprefix ? "MI" : prefix.MaterialIssueprefix,
							DemandPrefix: !prefix.Demandprefix ? "DE" : prefix.Demandprefix,
							IBChallanPrefix: !prefix.IBChallanprefix ? "IBCH" : prefix.IBChallanprefix,
							IBInwardPrefix: !prefix.IBInwardprefix ? "IBIN" : prefix.IBInwardprefix,
							PurchaseReturnprefix: !prefix.PurchaseReturnprefix ? "PR" : prefix.PurchaseReturnprefix,
							CreditPrefix: !prefix.Creditprefix ? "CR" : prefix.Creditprefix,
							DebitPrefix: !prefix.Debitprefix ? "DR" : prefix.Debitprefix
						};

						let editPriceList = (hasEditVal.PriceList) ? {
							label: hasEditVal.PriceList.Name, value: hasEditVal.PriceList.id,
						} : { label: '' };

						// let addressTabPreIncrementId = hasEditVal.PartyAddress.map((obj) => {
						// 	const newObj = { ...obj, RowID: obj.id };
						// 	return newObj;
						// })



						let addressTabPreIncrementId = await Promise.all(
							hasEditVal.PartyAddress.map(async (obj) => {
								const newObj = { ...obj, RowID: obj.id };
								const url = obj.fssaidocumenturl;
								debugger
								if (url && typeof url === "string" && url.startsWith("http")) {
									try {
										const response = await fetch(url);
										const blob = await response.blob();
										newObj.file = new File([blob], `${(obj?.filename)}`, { type: getMimeTypeFromExtension(obj?.filename) });;

									} catch (error) {
										console.error("Error fetching file from URL:", error);
									}
								}
								return newObj;
							})
						);

						let getBaseTab = baseTabRef.current.getCurrentState();
						let setBaseTab = baseTabRef.current.setCurrentState;
						let getPrefixtab = prefixTabRef.current.getCurrentState();
						let setPrefixtab = prefixTabRef.current.setCurrentState;
						let setAddressTab = addressTabRef.current.setCurrentState;
						let setPriceList = baseTabRef.current.setPriceListSelect;

						bulkSetState(baseValue, setBaseTab)
						bulkSetState(prefixValue, setPrefixtab)
						setAddressTab(addressTabPreIncrementId)
						setPriceList(editPriceList);

						dispatch(getDistrictOnState(hasEditVal.State.id))
						dispatch(getCityOnDistrict(hasEditVal.District.id))
						dispatch(priceListByPartyAction(hasEditVal.PartyType.id,))
						dispatch(editPartyIDSuccess({ Status: false }));
						// dispatch(changeCommonPartyDropDetailsAction({ forceDisable: true }))//change party drop-down disable when edit/view
					}
				}

			} catch (e) { }
		}

	}, [editData]);

	useEffect(async () => {

		if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
			dispatch(postPartyDataSuccess({ Status: false }));

			//***************mobail app api*********************** */

			//************************************** */

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
						pathname: (props.isdropdown && props.RedirectPath) ? props.RedirectPath : listPath,
					});
				}
			}

			if (subPageMode === url.RETAILER_MASTER) {
				const jsonBody = JSON.stringify({ RetailerID: postMsg.TransactionID.toString(), DistributorID: commonPartyDropSelect.value });
				const mobilApiResp = await mobileApp_Send_Retailer_Api({ jsonBody });
				if (mobilApiResp.Message.code === 200) { showToastAlert(mobilApiResp.Message.message, "success"); };
			}
		}
		else if ((postMsg.Status === true)) {
			dispatch(postPartyDataSuccess({ Status: false }))
			customAlert({
				Type: 4,
				Message: JSON.stringify(postMsg.Message),
			})
		}
	}, [postMsg.Status])

	useEffect(async () => {

		if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
			if (subPageMode === url.PARTY_SELF_EDIT) {
				dispatch(updatePartyIDSuccess({ Status: false }));
				customAlert({
					Type: 1,
					Message: JSON.stringify(updateMsg.Message),
				})
			}

			else {

				//***************mobail app api*********************** */
				if (subPageMode === url.RETAILER_MASTER && !(isMobileRetailer)) {
					const jsonBody = JSON.stringify({
						RetailerID: (updateMsg.TransactionID).toString(),
						DistributorID: commonPartyDropSelect.value

					})
					const mobilApiResp = await mobileApp_RetailerUpdate_Api({ jsonBody });
					if (mobilApiResp.StatusCode === 200) { showToastAlert(mobilApiResp.Message, 'success'); };
				}
				//************************************** */

				history.push({
					pathname: listPath,
				})
			}
		}
		else if (updateMsg.Status === true && !modalCss) {
			dispatch(updatePartyIDSuccess({ Status: false }));
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
		const formData = new FormData(); // Create a new FormData object
		event.preventDefault();
		const btnId = event.target.id;

		let baseTabDetail = baseTabRef.current.getCurrentState()
		let priceListSelect = baseTabRef.current.getPriceListSelect()
		let setBaseTabDetail = baseTabRef.current.setCurrentState
		let addressTabDetail = addressTabRef.current.getCurrentState()
		let prefixValue = prefixTabRef.current.getCurrentState().values
		let addressTabIsAddressEnter = addressTabRef.current.IsAddressEnter()

		const validBasetab = formValid(baseTabDetail, setBaseTabDetail)

		let isError = addressTabIsAddressEnter.isError
		let values = addressTabIsAddressEnter.values

		if (
			(values.PartyAddress.length > 0) &&
			(isError.PartyAddress === "")
		) {
			customAlert({
				Type: 4,
				Message: alertMessages.fillAddressDetailsInTable,
			});
			return;
		}

		if (!validBasetab) {
			setactiveTab1("1")
			return
		};

		if (addressTabDetail.length === 0) {

			setactiveTab1("2")
			customAlert({
				Type: 4,
				Message: alertMessages.addressIsRequired,
			})
			return;
		};

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
				Message: alertMessages.defaultAddressIsSelected,
			})
			return;
		};



		if (pageMode === mode.edit) {

		}
		try {
			btnIsDissablefunc({ btnId, state: true })

			const baseValue = baseTabDetail.values
			let PartyDropCond = ((loginUserAdminRole()) && (subPageMode === url.RETAILER_MASTER))
			const supplierArr = baseValue.Supplier.map((i) => ({
				Party: PartyDropCond ? commonPartyDropSelect.value : i.value,
				Distance: i.value,
				CreatedBy: loginUserID(),
				UpdatedBy: loginUserID(),
				Creditlimit: pageMode === mode.edit ? i.Creditlimit : "",
				Route: baseValue.Route === "" ? "" : baseValue.Route.value,
				Delete: 0,
			}));

			if (!(pageMode === mode.defaultsave)) {
				// Determine items from EditData.PartySubParty that don't have matching "Party" values in supplierArr
				const itemsToPush = EditData.PartySubParty.filter((editItem) => {

					return !supplierArr.some((supplier) => supplier.Party === editItem.Party);
				});

				// Push these items into supplierArr
				itemsToPush.forEach((item) => {
					supplierArr.push({
						Party: item.Party,
						Distance: item.Distance,
						CreatedBy: loginUserID(),
						UpdatedBy: loginUserID(),
						Creditlimit: "",
						Route: "",
						Delete: 1,
					});
				});
			}

			addressTabDetail.map((i) => {
				if (i.id === undefined) {
					i["id"] = "0";
				}
				delete i.fssaidocumenturl; // Remove the key
			});

			if (
				(priceListSelect.label === "" || priceListSelect.value === "") &&
				(subPageMode === url.RETAILER_MASTER || subPageMode === url.FRANCHISE_CUSTOMER_MASTER)
			) {

				customAlert({
					Type: 4,
					Message: alertMessages.PricelistIsRequired,
				});
				return;
			}

			const jsonBody = JSON.stringify({
				"Name": baseValue.Name,
				"ShortName": baseValue.ShortName,
				"PriceList": priceListSelect.value,
				"PartyType": baseValue.PartyType.value,
				"Company": (pageMode === mode.defaultsave) ? loginCompanyID() : EditData.Company.id,
				"PAN": baseValue.PAN,
				"Email": baseValue.Email,
				"MobileNo": baseValue.MobileNo,
				"AlternateContactNo": baseValue.AlternateContactNo,
				"Country": baseValue.CountryName === "" ? null : baseValue.CountryName.value,
				"State": baseValue.State.value,
				"District": baseValue.District.value,
				"City": (baseValue.CityName === "") ? "" : baseValue.CityName.value,
				"SAPPartyCode": !(baseValue.SAPPartyCode === "") ? baseValue.SAPPartyCode : null,
				"Taluka": 0,
				"Latitude": baseValue.Latitude,
				"Longitude": baseValue.Longitude,
				"Cluster": baseValue.Cluster.value,
				"SubCluster": baseValue.SubCluster.value,
				"GSTIN": baseValue.GSTIN,
				"isActive": baseValue.isActive,
				"CreatedBy": loginUserID(),
				"UpdatedBy": loginUserID(),
				"IsApprovedParty": isMobileRetailer && false,
				"PartySubParty": supplierArr,
				"PartyAddress": addressTabDetail,
				"PartyPrefix": [
					{
						"Orderprefix": prefixValue.OrderPrefix,
						"Invoiceprefix": prefixValue.InvoicePrefix,
						"Grnprefix": prefixValue.GRNPrefix,
						"Receiptprefix": prefixValue.ReceiptPrefix,
						"Challanprefix": prefixValue.ChallanPrefix,
						"WorkOrderprefix": prefixValue.WorkOrderPrefix,
						"MaterialIssueprefix": prefixValue.MaterialIssuePrefix,
						"Demandprefix": prefixValue.DemandPrefix,
						"IBChallanprefix": prefixValue.IBChallanPrefix,
						"IBInwardprefix": prefixValue.IBInwardPrefix,
						"PurchaseReturnprefix": prefixValue.PurchaseReturnprefix,
						"Creditprefix": prefixValue.CreditPrefix,
						"Debitprefix": prefixValue.DebitPrefix
					}
				],

			});

			formData.append('PartyData', jsonBody);
			addressTabDetail?.forEach((item, key) => {
				formData.append(`fssaidocument_${item.RowID}`, item.file ? item.file : "");
			})



			if (pageMode === mode.edit) {
				dispatch(updatePartyID({ formData, updateId: EditData.id, btnId }));
			}
			else {
				dispatch(postPartyData({ formData, btnId }));
			}

		} catch (error) { btnIsDissablefunc({ btnId, state: false }) }
	};


	if (!(userPageAccessState === '')) {
		return (
			<React.Fragment>
				{/* <MetaTags> {metaTagLabel(userPageAccessState)}</MetaTags> */}
				<div className="page-content" >

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

											{(!(subPageMode === url.RETAILER_MASTER || subPageMode === url.FRANCHISE_CUSTOMER_MASTER)) &&// only view when party master Mode
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




