import React, { useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader, Container, Label, } from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { Breadcrumb_inputName, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { goButtonPartyItemAddPageSuccess, goButtonPartyItemAddPage, savePartyItemsAction, savePartyItemsActionSuccess, } from "../../../store/Administrator/PartyItemsRedux/action";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { PageLoadingSpinner, SaveButton } from "../../../components/Common/CommonButton";
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import BootstrapTable from "react-bootstrap-table-next";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import PartyDropdown_Common from "../../../components/Common/PartyDropdown";
import { breadcrumbReturnFunc, metaTagLabel } from "../../../components/Common/CommonFunction";
import * as pageId from "../../../routes/allPageID";
import { selectAllCheck } from "../../../components/Common/TableCommonFunc";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { CInput, decimalRegx } from "../../../CustomValidateForm";
import { goButton_ServiceItemAssign, goButton_ServiceItemAssign_Success, save_ServiceItemAssign_Action, save_ServiceItemAssign_Success } from "../../../store/Administrator/ServiceItemAssignRedux/action";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";

const ServiceItemAssign = (props) => {
	const history = useHistory();
	const dispatch = useDispatch();
	const [subPageMode] = useState(history.location.pathname)
	const [pageMode, setPageMode] = useState(mode.defaultsave);
	const [modalCss, setModalCss] = useState(false);
	const [userPageAccessState, setUserAccState] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	const location = { ...history.location };
	const hasShowloction = location.hasOwnProperty(mode.editValue);
	const hasShowModal = props.hasOwnProperty(mode.editValue);

	const {
		postMsg,
		pageField,
		tableList,
		saveBtnloading,
		GoBtnlistloading,
		userAccess,

	} = useSelector((state) => ({
		saveBtnloading: state.ServiceItemAssignReducer.saveBtnloading,
		GoBtnlistloading: state.ServiceItemAssignReducer.ServiceItemListLoading,
		postMsg: state.ServiceItemAssignReducer.postMsg,
		tableList: state.ServiceItemAssignReducer.ServiceItemAssignList,
		userAccess: state.Login.RoleAccessUpdateData,
		pageField: state.CommonPageFieldReducer.pageField,
	}));

	useEffect(() => {

		dispatch(commonPageFieldSuccess(null));
		dispatch(commonPageField(pageId.SERVICE_ITEM_ASSIGN));

		if (!(_cfunc.loginSelectedPartyID() === 0)) {
			goButtonHandler()
		}
		return () => {
			dispatch(goButton_ServiceItemAssign_Success([]));
		}
	}, []);

	useEffect(() => {
		let userAcc = null;
		let locationPath = location.pathname;

		if (hasShowModal) {
			locationPath = props.masterPath;
		}

		userAcc = userAccess.find((inx) => {
			return `/${inx.ActualPagePath}` === locationPath;
		});

		if (userAcc) {
			setUserAccState(userAcc);
			if (!props.isAssing) {
				breadcrumbReturnFunc({ dispatch, userAcc });
			}
		}
	}, [userAccess]);

	useEffect(() => {
		if (postMsg.Status === true && postMsg.StatusCode === 200) {
			dispatch(save_ServiceItemAssign_Success({ Status: false }));
			dispatch(Breadcrumb_inputName(""));
			dispatch(goButton_ServiceItemAssign_Success([]));
			goButtonHandler();
			if (pageMode === mode.assingLink) {
				customAlert({
					Type: 1,
					Message: postMsg.Message,
				});
				props.isOpenModal(false);
			} else {
				customAlert({
					Type: 1,
					Message: postMsg.Message,
				});
			}
		} else if (postMsg.Status === true) {
			dispatch(save_ServiceItemAssign_Success({ Status: false }));
			customAlert({
				Type: 3,
				Message: JSON.stringify(postMsg.Message),
			});
		}
	}, [postMsg]);

	useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [tableList]);

	mySearchProps({
		onSearch: (text) => {
			setSearchQuery(text);
		},
	});

	function goButtonHandler(event) {

		try {
			event?.persist();// Call event.persist() to remove the synthetic event from the pool

			if ((_cfunc.loginSelectedPartyID() === 0)) {
				customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
				return;
			};
			const jsonBody = {
				PartyID: _cfunc.loginSelectedPartyID(),
				CompanyID: 1

			};
			dispatch(goButton_ServiceItemAssign({ jsonBody }));
		}
		catch (error) { }
		return
	};

	function partyOnChngeButtonHandler() {
		dispatch(goButton_ServiceItemAssign_Success([]))
	}

	const tableColumns = [
		{
			text: "Item ID",
			dataField: "ServiceItem",
			sort: true,
			style: {
				width: "100px",
			},
		},
		{
			text: "Item Name",
			dataField: "ServiceItemName",
			sort: true,
			style: {
				width: "700px",
			},
		},

		{
			text: "Rate",
			dataField: "Rate",

			formatter: (cellContent, row, key) => {

				return (<span style={{ justifyContent: 'center' }}>
					<CInput
						id={`serviceItemAssign-${row.ServiceItem}`}
						key={`serviceItemAssign-${key}`}
						cpattern={decimalRegx}
						defaultValue={row.Rate}
						// disabled={!(row.selectCheck) && true}
						className="text-end"
						onChange={(event) => { row.Rate = event.target.value }}
					/>
				</span>)
			},
			headerStyle: () => {
				return { width: '180px', textAlign: 'center' };
			}
		}

	];

	function rowSelected() {
		return tableList.map((index) => { return (index.selectCheck) && (index.ServiceItem) })
	}

	const SaveHandler = (event) => {

		event.preventDefault();

		const CheckArray = tableList.filter(index => index.selectCheck === true);

		if (CheckArray.length === 0) {
			customAlert({ Type: 4, Status: true, Message: "At least One Item is Selected" });
			return;
		}

		try {
			const PartiesJson = CheckArray.map((index) => ({
				"CentralServiceItem": index.ServiceItem,
				"Party": _cfunc.loginSelectedPartyID(),
				"Rate": index.Rate,
				"CreatedBy": _cfunc.loginUserID(),
				"UpdatedBy": _cfunc.loginUserID(),
			}))


			const jsonBody = JSON.stringify(PartiesJson);
			dispatch(save_ServiceItemAssign_Action({ jsonBody }));

		} catch (w) { }
	};

	const AdminDivsionRoleDropdown = () => {
		if (subPageMode === url.SERVICE_ITEM_ASSIGN) {
			return (
				<PartyDropdown_Common pageMode={pageMode}
					goBtnLoading={GoBtnlistloading}
					goButtonHandler={goButtonHandler}
					changeButtonHandler={partyOnChngeButtonHandler}
				/>
			)
		}
		return null
	};

	let IsEditMode_Css = "";
	if (modalCss || pageMode === mode.dropdownAdd) {
		IsEditMode_Css = "-5.5%";
	}

	return (
		<>
			<PageLoadingSpinner isLoading={(GoBtnlistloading)} />
			{userPageAccessState && (
				<div className="page-content" style={{ marginTop: IsEditMode_Css }}>
					<Container fluid>
						<MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

						<AdminDivsionRoleDropdown />

						<Card className="text-black">
							<CardHeader className="card-header   text-black c_card_header">
								<h4 className="card-title text-black">
									{userPageAccessState.PageDescription}
								</h4>
								<p className="card-title-desc text-black">
									{userPageAccessState.PageDescriptionDetails}
								</p>
							</CardHeader>

							<CardBody style={{ backgroundColor: "#whitesmoke" }}>
								<form noValidate>
									<ToolkitProvider
										keyField="ServiceItem"
										data={tableList}
										columns={tableColumns}
										search
									>
										{toolkitProps => (
											<React.Fragment>
												<div className="table">
													<BootstrapTable
														keyField={"ServiceItem"}
														bordered={true}
														striped={true}
														selectRow={selectAllCheck({
															rowSelected: rowSelected(),
															bgColor: '',
															tableList: tableList
														})}
														noDataIndication={<div className="text-danger text-center ">Party Not available</div>}
														classes={"table align-middle table-nowrap table-hover"}
														headerWrapperClasses={"thead-light"}
														{...toolkitProps.baseProps}
													/>

													{mySearchProps(toolkitProps.searchProps)}
												</div>

											</React.Fragment>
										)
										}
									</ToolkitProvider>

									<div className="row save1">
										<SaveButton
											loading={saveBtnloading}
											pageMode={pageMode}
											userAcc={userPageAccessState}
											module={"PartyItems"}
											onClick={SaveHandler}
										/>
									</div>

								</form>
								{/* {filterdItemWise_tableData.length > 0 ? (
									<>
										{filterdItemWise_tableData.map((i, key) => (
											<div key={i.group}>
												<Label
													style={{
														background: "#efefef",
														padding: "7px 10px 0px 8px",
														borderRadius: "3px",
													}}
												>
													<h6> Group : {i.group ? i.group : `No Group Assign`}</h6>
												</Label>
												<div className="table">
													<BootstrapTable
														keyField={"Item"}
														key={`table-key-${i.group}-${key}`}
														data={i.items}
														columns={tableColumns}
														Item="table_Arrow"
														selectRow={selectAllCheck({
															rowSelected: rowSelected(i.items),
															bgColor: ''
														})}

														noDataIndication={
															<div className="text-danger text-center ">
																Items Not available
															</div>
														}
														classes={"table align-middle table-nowrap table-hover"}
													/>
												</div>
											</div>
										))}
									</>
								) : ( */}

								{/* )} */}


							</CardBody>
						</Card>
					</Container>
				</div>
			)}
		</>
	);
};

export default ServiceItemAssign;
