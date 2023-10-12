import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { MetaTags } from "react-meta-tags";
import Select from "react-select";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess, getBaseUnit_ForDropDown, getBaseUnit_ForDropDownSuccess } from "../../store/actions";
import C_Report from "../../components/Common/C_Report";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { mode, pageId } from "../../routes/index"
import { stockReport_GoButton_API, stockReport_GoButton_API_Success } from "../../store/Report/StockReport/action";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";
import { ExcelDownloadFunc } from "./ExcelDownloadFunc";

const StockReport = (props) => {

	const dispatch = useDispatch();
	const history = useHistory();
	const currentDate_ymd = _cfunc.date_ymd_func();
	const isSCMParty = _cfunc.loginIsSCMParty();

	const [headerFilters, setHeaderFilters] = useState('');
	const [userPageAccessState, setUserAccState] = useState('');

	const [partyDropdown, setPartyDropdown] = useState("");
	const [unitDropdown, setUnitDropdown] = useState({ value: 1, label: 'No' });
	const [tableData, setTableData] = useState([]);

	const [btnMode, setBtnMode] = useState(0);
	const [mrpWise, setMrpWise] = useState(false);
	const [originalTableData, setOriginalTableData] = useState([]);
	const [stockTypeSelect, setStockTypeSelect] = useState({ value: 1, label: 'SaleableStock' });

	const reducers = useSelector(
		(state) => ({
			listBtnLoading: state.StockReportReducer.listBtnLoading,
			goButtonData: state.StockReportReducer.StockReportGobtn,
			BaseUnit: state.ItemMastersReducer.BaseUnit,
			SSDD_List: state.CommonPartyDropdownReducer.commonPartyDropdown,
			userAccess: state.Login.RoleAccessUpdateData,
			pageField: state.CommonPageFieldReducer.pageField
		})
	);

	const { userAccess, BaseUnit, SSDD_List, pageField, goButtonData = [], } = reducers;
	const { fromdate = currentDate_ymd, todate = currentDate_ymd } = headerFilters;

	// Featch Modules List data First Rendering
	const location = { ...history.location }
	const hasShowModal = props.hasOwnProperty(mode.editValue)

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
			_cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
		};
	}, [userAccess])

	useEffect(() => {

		dispatch(getBaseUnit_ForDropDown());
		dispatch(commonPageFieldSuccess(null));
		dispatch(commonPageField(pageId.STOCK_REPORT));
		dispatch(BreadcrumbShowCountlabel(`Count:${0}`));
		return () => {
			dispatch(commonPageFieldSuccess(null));
			dispatch(stockReport_GoButton_API_Success([]));
			dispatch(getBaseUnit_ForDropDownSuccess([]));
		}
	}, [])

	useEffect(() => {
		try {
			let nextId = 1;
			let updatedReduxData = [];
			if (goButtonData.Status === true && goButtonData.StatusCode === 200) {
				updatedReduxData = goButtonData.Data.map((obj) => {
					const newObj = { ...obj, ID: nextId };
					nextId++;
					return newObj;
				});

				if (goButtonData.Data.length === 0) {
					setBtnMode(0);
				}

				if (btnMode === 2) {
					const { tData, MRPWise } = MRPWise_TableChange(mrpWise, updatedReduxData);
					ExcelDownloadFunc({
						pageField,
						excelData: tData, // Use tableData here
						excelFileName: "Current_Stock_Report",
						mrpWise: MRPWise,
					});

				} else if (btnMode === 1) {
					MRPWise_TableChange(mrpWise, updatedReduxData);
				}

			} else if (goButtonData.Status === true) {
				updatedReduxData = [];
			}

			// Sort the data by ItemName in ascending order
			updatedReduxData.sort((a, b) => a.ItemName.localeCompare(b.ItemName));

			setBtnMode(0); // Reset button mode
			setTableData(updatedReduxData);
			setOriginalTableData(updatedReduxData);
		} catch (e) { }
	}, [goButtonData]);

	function MRPWise_TableChange(mrpWiseChecked, tableData) {

		let updatedTableData;

		if (!mrpWiseChecked) {
			const combinedItems = {};
			tableData.forEach((item) => {
				const { Item, ActualQty } = item;
				if (!combinedItems[Item]) {
					combinedItems[Item] = { ...item };
				} else {
					combinedItems[Item].ActualQty += ActualQty;
				}
			});

			updatedTableData = Object.values(combinedItems);

		} else {
			updatedTableData = tableData;
		}
		updatedTableData.sort((a, b) => a.ItemName.localeCompare(b.ItemName));

		setTableData(updatedTableData);
		setMrpWise(mrpWiseChecked);
		return { tData: updatedTableData, MRPWise: mrpWiseChecked }
	}
	const BaseUnit_DropdownOptions = BaseUnit.filter(index => index.Name === "No" || index.Name === "Kg" || index.Name === "Box")
		.map(data => ({
			value: data.id,
			label: data.Name
		}));

	const Party_Option = SSDD_List.map(i => ({
		value: i.id,
		label: i.Name
	}));

	const StockTypeOptions = [{
		value: 1,
		label: "Saleable Stock"
	},
	{
		value: 2,
		label: "Damage Stock"
	}]

	function goButtonHandler(e, btnMode) {

		try {
			setBtnMode(btnMode)
			if (unitDropdown === "") {
				customAlert({
					Type: 3,
					Message: "Please Select Unit"
				})
				setBtnMode(0)
				return
			} else if ((isSCMParty) && (partyDropdown === "")) {
				customAlert({ Type: 3, Message: "Please Select Party" });
				setBtnMode(0)
				return;
			}

			const jsonBody = JSON.stringify({
				"FromDate": fromdate,
				"ToDate": todate,
				"Unit": unitDropdown.value,
				"PartyID": partyDropdown === "" ? _cfunc.loginPartyID() : partyDropdown.value,
			});

			dispatch(stockReport_GoButton_API({ jsonBody, stockType: stockTypeSelect.value }))

		} catch (error) { _cfunc.CommonConsole(error) }
	}

	function fromdateOnchange(e, date) {
		let newObj = { ...headerFilters }
		newObj.fromdate = date
		setHeaderFilters(newObj)
	}

	function todateOnchange(e, date) {
		let newObj = { ...headerFilters }
		newObj.todate = date
		setHeaderFilters(newObj)
	}

	const PageListColumns = [
		{
			text: "ItemName",
			dataField: "ItemName",
		},
		{
			text: "Quantity",
			dataField: "ActualQty",
			align: "right"
		},
		{
			text: "Unit",
			dataField: "Unit",
		},
	];

	// // Conditionally add the "MRP" column based on the mrpWise condition
	// Check if the "MRP" column should be added
	if (mrpWise) {
		const mrpColumn = {
			text: "MRP",
			dataField: "MRP",
			formatter: (value, row, k) => (
				<div className="text-end">
					<samp key={row.id} className="font-asian">
						{Number(row.MRP)}
					</samp>
				</div>
			),
			headerStyle: () => ({
				width: '100px',
				textAlign: 'center',
				text: 'end',
			})
		};

		// Find the index of the "Unit" column
		const unitColumnIndex = PageListColumns.findIndex(column => column.dataField === "Unit");

		// Insert the "MRP" column right before the "Unit" column
		if (unitColumnIndex !== -1) {
			PageListColumns.splice(unitColumnIndex, 0, mrpColumn);
		}
	}
	
	function StockTypeHandler(e) {
		setStockTypeSelect(e);
		setTableData([]);
	}

	return (
		<React.Fragment>
			<MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
			<div className="page-content">
				<div className="px-2 c_card_filter text-black mb-1" >
					<div className="row " >
						<Col sm={3} className="">
							<FormGroup className=" mb-2 row mt-2 " >
								<Label className="col-sm-4 p-2"
									style={{ width: "66px" }}>FromDate</Label>
								<Col sm={7}>
									<C_DatePicker
										name='fromdate'
										value={fromdate}
										disabled={true}
										onChange={fromdateOnchange}
									/>
								</Col>
							</FormGroup>
						</Col>

						<Col sm={3} className="">
							<FormGroup className=" row mt-2 " >
								<Label className="col-sm-4 p-2"
									style={{ width: "60px" }}>ToDate</Label>
								<Col sm={7}>
									<C_DatePicker
										nane='todate'
										value={todate}
										disabled={true}
										onChange={todateOnchange}
									/>
								</Col>
							</FormGroup>
						</Col>

						<Col sm={3}>
							<FormGroup className=" row mt-2 " >
								<Label className="col-sm-2 p-2"
									style={{ width: "85px" }}>Unit</Label>
								<Col sm={7}>
									<Select
										name="Unit"
										value={unitDropdown}
										isSearchable={true}
										className="react-dropdown"
										classNamePrefix="dropdown"
										styles={{
											menu: provided => ({ ...provided, zIndex: 2 })
										}}
										options={BaseUnit_DropdownOptions}
										onChange={(e) => {
											setUnitDropdown(e);
											setTableData([]);
										}}
									/>
								</Col>
							</FormGroup>
						</Col >

						{isSCMParty &&
							<Col sm={3}>
								<FormGroup className=" row mt-2 " >
									<Label className="col-md-3 p-2 "
										style={{ width: "90px" }}>Party</Label>
									<Col sm={7}>
										<Select
											name="Party"
											value={partyDropdown}
											isSearchable={true}
											className="react-dropdown"
											classNamePrefix="dropdown"
											styles={{
												menu: provided => ({ ...provided, zIndex: 2 })
											}}
											options={Party_Option}
											onChange={(e) => {
												setPartyDropdown(e);
												setTableData([]);
											}}
										/>
									</Col>
								</FormGroup>
							</Col >
						}
					</div>

					<div className="row" >
						<Col sm={3} className="">
							<FormGroup className=" mb-1 row mt-1 " >
								<Label className="col-sm-4 p-2"
									style={{ width: "66px" }}>Stock Type</Label>
								<Col sm={7}>
									<Select
										name="stockType"
										value={stockTypeSelect}
										isSearchable={true}
										className="react-dropdown"
										classNamePrefix="dropdown"
										styles={{
											menu: provided => ({ ...provided, zIndex: 2 })
										}}
										options={StockTypeOptions}
										onChange={(e) => {
											StockTypeHandler(e)

										}}
									/>
								</Col>
							</FormGroup>
						</Col>

						<Col sm={2}>
							<FormGroup className=" row mt-1 " >
								<Label htmlFor="horizontal-firstname-input" className="col-sm-6 col-form-label" >MRP-Wise</Label>
								<Col md={2} style={{ marginTop: '7px' }} >
									<div className="form-check form-switch form-switch-md ">
										<Input type="checkbox" className="form-check-input"
											checked={mrpWise}
											name="mrpWise"
											onChange={(e) => { MRPWise_TableChange(e.target.checked, originalTableData) }}
										/>
									</div>
								</Col>
							</FormGroup>
						</Col>

						<Col sm={1} className="mt-1" >
							<C_Button
								type="button"
								spinnerColor="white"
								loading={btnMode === 1 && true}
								className="btn btn-success"
								onClick={(e) => goButtonHandler(e, 1)}
							>
								Show
							</C_Button>

						</Col>

						<Col sm={1} className="mt-1 ">
							<C_Button
								type="button"
								spinnerColor="white"
								loading={btnMode === 2 && true}
								className="btn btn-primary"
								onClick={(e) => goButtonHandler(e, 2)}
							>
								Excel
							</C_Button>
						</Col>
					</div>

				</div>

				<div className="mt-1">
					<ToolkitProvider
						keyField="ID"
						data={tableData}
						columns={PageListColumns}
						search
					>
						{(toolkitProps,) => (
							<React.Fragment>
								<Row>
									<Col xl="12">
										<div className="table-responsive table">
											<BootstrapTable
												keyField="ID"
												classes={"table  table-bordered table-hover"}
												noDataIndication={
													<div className="text-danger text-center ">
														Record Not available
													</div>
												}
												onDataSizeChange={({ dataSize }) => {
													dispatch(BreadcrumbShowCountlabel(`Count:${dataSize}`));
												}}
												{...toolkitProps.baseProps}
											/>
											{mySearchProps(toolkitProps.searchProps)}
										</div>
									</Col>
								</Row>

							</React.Fragment>
						)}
					</ToolkitProvider>
				</div>
			</div>
			<C_Report />
		</React.Fragment >
	)
}

export default StockReport;
