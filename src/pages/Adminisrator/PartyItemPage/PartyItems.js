import React, { useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, FormGroup, Input, Label, Spinner } from "reactstrap";

import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { BreadcrumbShowCountlabel, Breadcrumb_inputName, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { goButtonPartyItemAddPageSuccess, goButtonPartyItemAddPage, savePartyItemsAction, savePartyItemsActionSuccess, editPartyItemIDSuccess, channalItemViewDetailAction } from "../../../store/Administrator/PartyItemsRedux/action";
import { globalTableSearchProps } from "../../../components/Common/SearchBox/MySearch";
import { C_Button, PageLoadingSpinner, SaveButton } from "../../../components/Common/CommonButton";
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import BootstrapTable from "react-bootstrap-table-next";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { breadcrumbReturnFunc, metaTagLabel } from "../../../components/Common/CommonFunction";
import * as pageId from "../../../routes/allPageID";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { C_Select } from "../../../CustomValidateForm";
import { getPartyTypelist, getPartyTypelistSuccess } from "../../../store/Administrator/PartyTypeRedux/action";
import ChannelViewDetails from "./ChannelViewDetails";
import { vieBtnCss } from "../../../components/Common/ListActionsButtons";
import { changeCommonPartyDropDetailsAction } from "../../../store/Utilites/PartyDrodown/action";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";

function initialState(history) {

	let page_Id = '';
	let sub_Mode = history.location.pathname;

	if (sub_Mode === url.PARTYITEM) {
		page_Id = pageId.PARTYITEM;
	}
	else if (sub_Mode === url.CHANNEL_ITEM) {
		page_Id = pageId.CHANNEL_ITEM;
	}

	return { page_Id }
};

const PartyItems = (props) => {
	const history = useHistory();
	const dispatch = useDispatch();
	const [subPageMode] = useState(history.location.pathname)
	const [pageMode, setPageMode] = useState(mode.defaultsave);
	const [userPageAccessState, setUserAccState] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	const [page_id] = useState(() => initialState(history).page_Id)
	const [partyIdSelect, setPartyIdSelect] = useState({ value: _cfunc.loginSelectedPartyID() })
	const [channelTypeSelect, setChannelTypeSelect] = useState('');

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
		PartyTypes,
		viewBtnLoading,
		partyItemListLoading
	} = useSelector((state) => ({
		saveBtnloading: state.PartyItemsReducer.saveBtnloading,
		GoBtnlistloading: state.PartyItemsReducer.partyItemListLoading,
		postMsg: state.PartyItemsReducer.postMsg,
		tableList: state.PartyItemsReducer.partyItem,
		userAccess: state.Login.RoleAccessUpdateData,
		pageField: state.CommonPageFieldReducer.pageField,
		PartyTypes: state.PartyTypeReducer.ListData,
		viewBtnLoading: state.PartyItemsReducer.channeItemViewBtnLoading,
		partyItemListLoading: state.PartyItemsReducer.partyItemListLoading,

	}));

	const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);

	// Common Party select Dropdown useEffect
	useEffect(() => {
		if ((commonPartyDropSelect.value > 0) && !(subPageMode === url.CHANNEL_ITEM)) {
			goButtonHandler()
		} else {
			partyOnChngeButtonHandler()
		}
	}, [commonPartyDropSelect])

	useEffect(() => {

		dispatch(commonPageFieldSuccess(null));
		dispatch(getPartyTypelist());
		if (hasShowModal !== true) {
			dispatch(commonPageField(page_id));
		}
		if (!(subPageMode === url.PARTYITEM)) {
			dispatch(changeCommonPartyDropDetailsAction({ isShow: false }))//change party drop-down show false
		}

		return () => {
			dispatch(changeCommonPartyDropDetailsAction({ isShow: true }))//change party drop-down restore show state	
			dispatch(getPartyTypelistSuccess([]));
			dispatch(goButtonPartyItemAddPageSuccess([]));
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

		if (hasShowloction || hasShowModal) {
			let hasEditVal = null;
			if (hasShowModal) {
				hasEditVal = props.editValue;
				setPageMode(props.pageMode);
			} else if (hasShowloction) {
				setPageMode(location.pageMode);
				hasEditVal = location.editValue;
			}
			if (hasEditVal) {
				const { Party, PartyName, PartyItem = [] } = hasEditVal;
				const convArr = PartyItem.map((item) => {
					item.selectCheck = false;
					if (item.Party > 0) {
						item.selectCheck = true;
					}
					return item;
				});
				setPartyIdSelect({ value: Party, label: PartyName })
				dispatch(goButtonPartyItemAddPageSuccess(convArr));
				dispatch(Breadcrumb_inputName(PartyName));
			}
			dispatch(editPartyItemIDSuccess({ Status: false }));
		}
		return () => {
			props?.isOpenModal && props.isOpenModal(false)
		}
	}, []);

	useEffect(() => {
		if (postMsg.Status === true && postMsg.StatusCode === 200) {
			dispatch(savePartyItemsActionSuccess({ Status: false }));
			dispatch(Breadcrumb_inputName(""));
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
			dispatch(savePartyItemsActionSuccess({ Status: false }));
			customAlert({
				Type: 3,
				Message: JSON.stringify(postMsg.Message),
			});
		}
	}, [postMsg]);

	useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [tableList]);

	const channelDropdownOptions = useMemo(() => {
		return PartyTypes.map(item => ({ value: item.id, label: item.Name }))
	}, [PartyTypes]);

	globalTableSearchProps({
		onSearch: (text) => {
			setSearchQuery(text);
		},
	});

	const groupWiseItemArray = useMemo(() => {
		const groupItemsByGroup = (items) => {

			const groupedItems = items.reduce((result, item) => {
				const { GroupName, ...rest } = item;
				if (!result[GroupName]) {
					result[GroupName] = [];
				}
				result[GroupName].push(rest);
				return result;
			}, {});
			return Object.entries(groupedItems).map(([group, items]) => ({ group, items, })
			);
		};
		return groupItemsByGroup(tableList);
	}, [tableList]);

	const filterdItemWise_tableData = useMemo(() => {
		const groupWiseItemNewArray = groupWiseItemArray
			.map(({ items, ...rest }) => ({
				...rest,
				items: items.filter((item) => {
					return (
						item.ItemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
						String(item.Item).toLowerCase().includes(searchQuery.toLowerCase())
					);
				}),
			}))
			.filter((row) => row.items.length > 0);



		const numberOfItems = groupWiseItemNewArray.reduce((total, group) => total + group.items.length, 0);

		dispatch(BreadcrumbShowCountlabel(`Groups:${numberOfItems}`));
		return groupWiseItemNewArray
	}, [searchQuery, groupWiseItemArray]);

	const tableColumns = [
		{
			text: "Item ID",
			dataField: "Item",
			sort: true,
			style: {
				width: "100px",
			},
		},
		{
			text: "Item Name",
			dataField: "ItemName",
			sort: true,
			style: {
				width: "700px",
			},
		},

		{
			text: "View",
			dataField: "",
			hidden: (subPageMode === url.PARTYITEM),
			formatExtraData: { viewBtnLoading },
			formatter: (cell, row, __, { viewBtnLoading }) => {

				return <div >
					<C_Button
						className={vieBtnCss}
						loading={(viewBtnLoading === row.Item) && true}
						spinnerColor='white'
						onClick={() => {
							const jsonBody = JSON.stringify({
								"Item": row.Item,
								"PartyType": channelTypeSelect.value,
							})
							dispatch(channalItemViewDetailAction({ jsonBody, btnId: row.Item }))
						}}><i className="bx bxs-show font-size-16" /></C_Button>
				</div>
			}

		},
		{
			text: 'Not Available For Ordering',
			dataField: '',
			hidden: (subPageMode === url.PARTYITEM || hasShowModal === true),
			// formatExtraData: { forceReferesh },
			// headerFormatter: (column, colIndex) => {

			// 	const OrderAvailableHeaderHandler = ({ column, colIndex, event }) => {
			// 		setforceReferesh(i => !i)
			// 		let checked = event.target.checked
			// 		const filterData = filterdItemWise_tableData.forEach((i, key) => {
			// 			i.items.forEach(i => {
			// 				if (i.selectCheck) {
			// 					i["IsAvailableForOrdering"] = checked
			// 				}
			// 			});


			// 		})

			// 		// row["IsAvailableForOrdering"] = checked
			// 	}
			// 	return <div className="">

			// 		<Input type="checkbox"
			// 			onChange={(event) => { OrderAvailableHeaderHandler({ column: column, colIndex: colIndex, event: event }) }}
			// 		/>
			// 		<label style={{ paddingLeft: "7px" }}>{"Is Available For Ordering"}</label>
			// 	</div>
			// },
			formatter: (cell, row) => {

				const OrderAvailableHandler = ({ cell, row, event }) => {

					let checked = event.target.checked
					row["IsAvailableForOrdering"] = checked
				}
				return <div className="">
					<Input type="checkbox"

						onChange={(event) => { OrderAvailableHandler({ cell: cell, row: row, event: event }) }}
						defaultChecked={row.IsAvailableForOrdering}
						disabled={!row.selectCheck}
						style={(!row.selectCheck) ? {
							opacity: 0.5,
							backgroundColor: "#ababab82",
						} : {}}
					/>
				</div>
			}

		},
	];

	function goButtonHandler(event) {

		try {
			const jsonBody = {
				..._cfunc.loginJsonBody(),
				PartyID: commonPartyDropSelect.value,
				PartyTypeID: channelTypeSelect.value
			};
			dispatch(goButtonPartyItemAddPage({ jsonBody, subPageMode }));
		}
		catch (error) { }
		return
	};

	function partyOnChngeButtonHandler() {
		dispatch(goButtonPartyItemAddPageSuccess([]));
	}

	const rowSelected = (tableArray) => {
		return tableArray.map((index) => (index.selectCheck && index.Item));
	};
	const nonSelectedRow = (tableArray) => {
		var noSelectedIds = [];
		if (subPageMode === url.CHANNEL_ITEM) {
			noSelectedIds = tableArray
				.filter(row => (row.InPartyItem == true))
				.map(row => row.Item);
		} else if (subPageMode === url.PARTYITEM) {
			noSelectedIds = tableArray
				.filter(row => (row.InStock == true))
				.map(row => row.Item);
		}
		return noSelectedIds;
	};


	const tableSelectCheckConfig = ({
		rowSelected = '',
		nonSelectable = [],
		position,
		headLabel,
		bgColor = "#9dadf09e",
		disabledWithMsg = '',
		keyField,
		tableData = []
	}) => ({

		mode: "checkbox",
		bgColor: bgColor,
		onSelectAll: (isSelecte) => {
			tableData.forEach(ele => {
				const isNonSelectable = nonSelectable.includes(ele[keyField]);
				if (!isNonSelectable) {
					ele.selectCheck = isSelecte
				}
			});
		},
		onSelect: (row, event) => {
			const isNonSelectable = nonSelectable.includes(row[keyField]);
			if (isNonSelectable) {
				return
			}
			row.selectCheck = event
		},
		selected: rowSelected,
		selectColumnPosition: position ? position : "right",
		attrs: () => ({ 'data-label': "Select" }),
		selectionHeaderRenderer: (head) => (
			<div className="">
				<Input type="checkbox" checked={head.checked} />
				<label style={{ paddingLeft: "7px" }}>{headLabel ? headLabel : "SelectAll"}</label>
			</div>
		),
		selectionRenderer: ({ mode, checked, rowKey, ...rest }) => {

			const isNonSelectable = nonSelectable.includes(rowKey);
			if (isNonSelectable) {

				const rowData = tableData.find(r => r[keyField] === rowKey)
				return <>
					<Input
						type="checkbox"
						{...rest}
						disabled
						checked={rowData?.selectCheck}
						style={!rowData?.selectCheck ? {
							opacity: 0.5,
							backgroundColor: "#ababab82",
						} : {}}
					/>
					&nbsp;&nbsp; <samp className="text-danger">{disabledWithMsg}</samp> &nbsp;&nbsp;{rowData.isItemMap ? <samp className="text-danger">{"(Item Not Map)"}</samp> : null}
				</>;
			} else {

				const rowData = tableData.find(r => r[keyField] === rowKey)
				return <>
					<Input type="checkbox" checked={checked}  {...rest} />&nbsp;&nbsp;&nbsp;
					{rowData.isItemMap ? <samp className="text-danger">{"Item Not Map"}</samp> : null}
				</>
			}
		}
	})

	const SaveHandler = (event) => {
		event.preventDefault();

		const selectedItems = groupWiseItemArray.flatMap(group => group.items.filter(item => item.selectCheck));

		if (subPageMode === url.PARTYITEM) {
			const UploadSalesDatafromExcelParty = _cfunc.loginUserDetails().UploadSalesDatafromExcelParty;

			const filteredDataExists = selectedItems.some(row => {

				return UploadSalesDatafromExcelParty === 1 && row.isItemMap === true;
			});

			if (filteredDataExists) {
				customAlert({
					Type: 4,
					Message: "Item Not Map",
				});
				return;
			}
		}

		if (selectedItems.length === 0) {
			customAlert({
				Type: 4,
				Message: "Select Atleast One Item",
			});
			return;
		}

		try {
			const jsonBody = JSON.stringify(selectedItems.map((index) => ({

				Item: index.Item,
				// Party: partyIdSelect.value,
				Party: (pageMode === mode.assingLink) ? partyIdSelect.value : commonPartyDropSelect.value,
				PartyType: channelTypeSelect.value,
				IsAvailableForOrdering: index.IsAvailableForOrdering ? 1 : 0
			})));
			dispatch(savePartyItemsAction({ jsonBody, subPageMode }));
		} catch (w) { }
	};


	const ChannelTypeDropdown = () => {
		if (subPageMode === url.CHANNEL_ITEM) {
			return (
				<div className="px-2 c_card_header text-black mb-1">
					<div className="row pt-2">
						<Col sm="5">
							<FormGroup className="row">
								<Label className="col-sm-5 p-2" style={{ width: "120px" }}>
									Channel Type
								</Label>
								<Col sm="6">
									<C_Select
										name="Name"
										value={channelTypeSelect}
										isDisabled={(filterdItemWise_tableData.length > 0)}
										className="react-dropdown"
										classNamePrefix="dropdown"
										styles={{
											menu: (provided) => ({ ...provided, zIndex: 2 }),
										}}
										options={channelDropdownOptions}
										onChange={(e) => { setChannelTypeSelect(e) }}
									/>
								</Col>
							</FormGroup>
						</Col>

						<Col sm="1">
							{((filterdItemWise_tableData.length === 0)) ? (
								<C_Button
									type="button"
									loading={GoBtnlistloading}
									className="btn btn-outline-primary border-1 font-size-12 text-center"
									onClick={(e) => {
										goButtonHandler(e)
									}}
								>
									Select
								</C_Button>
							) : (
								<C_Button
									type="button"
									spinnerColor={"info"}
									className="btn btn-outline-info border-1 font-size-12 "
									onClick={() => { dispatch(goButtonPartyItemAddPageSuccess([])); }}

								>Change</C_Button>
							)}
						</Col>
					</div>
				</div>
			);
		}
		return null
	};
	var IsEditMode_Css = ''
	if (props.isAssing) { IsEditMode_Css = "1%" };
	debugger
	return (
		<>
			<PageLoadingSpinner isLoading={(GoBtnlistloading || !pageField)} />
			{userPageAccessState && (
				<div className="page-content" >
					<Container fluid>
						<MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

						<ChannelViewDetails />

						<Card className="text-black">
							<CardHeader className="card-header text-black c_card_header">
								<h4 className="card-title text-black">
									{userPageAccessState.PageDescription}
								</h4>
								<p className="card-title-desc text-black">
									{userPageAccessState.PageDescriptionDetails}
								</p>
							</CardHeader>

							<CardBody style={{ backgroundColor: "#whitesmoke" }}>
							{partyItemListLoading ? 
									<div className="text-center my-4">
										<Spinner color="primary" />
										<div>Loading Items...</div>
									</div>:
									<>
								<ChannelTypeDropdown />
								{filterdItemWise_tableData.length > 0 ? (
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
														selectRow={
															tableSelectCheckConfig({
																// selectAllCheck({
																rowSelected: rowSelected(i.items),
																disabledWithMsg: subPageMode == url.PARTYITEM && "In-stock",
																keyField: "Item",
																bgColor: '',
																selectedDisabled: nonSelectedRow(i.items),
																tableData: i.items,
																nonSelectable: nonSelectedRow(i.items),
															})}

														// cellEdit={cellEditFactory({ mode: 'click', blurToSave: true })}
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
								) : (
									<>
										<BootstrapTable
											keyField={"Item"}
											data={[]}
											columns={tableColumns}
											noDataIndication={
												<div className="text-danger text-center ">
													Items Not available
												</div>
											}
										/>
									</>
								)}
								</>
							}
								<SaveButtonDraggable>
									<SaveButton
										loading={saveBtnloading}
										pageMode={pageMode}
										userAcc={userPageAccessState}
										module={"PartyItems"}
										onClick={SaveHandler}
									/>
								</SaveButtonDraggable>
							</CardBody>
						</Card>
					</Container>
				</div>
			)}
		</>
	);
};

export default PartyItems;
