import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
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
import DynamicColumnHook from "../../components/Common/TableCommonFunc";

const StockReport = (props) => {

	const dispatch = useDispatch();
	const history = useHistory();
	const currentDate_ymd = _cfunc.date_ymd_func();
	const isSCMParty = _cfunc.loginIsSCMParty();

	const [headerFilters, setHeaderFilters] = useState('');
	const [userPageAccessState, setUserAccState] = useState('');

	const [partyDropdown, setPartyDropdown] = useState("");
	const [unitDropdown, setUnitDropdown] = useState({ value: 1, label: 'No' });

	const [btnMode, setBtnMode] = useState(0);
	const [originalTableData, setOriginalTableData] = useState([]);
	const [stockTypeSelect, setStockTypeSelect] = useState({ value: 0, label: 'SaleableStock' });

	const [batchWise, setBatchWise] = useState(false);
	const [mrpWise, setMrpWise] = useState(false);
	const [tableData, setTableData] = useState([]);
	const [selectedColumns, setSelectedColumns] = useState([
		{
			text: "ItemName",
			dataField: "ItemName",
			sort: true
		},
		{
			text: "Quantity",
			dataField: "ActualQty",
			sort: true
		},
		{
			text: "Unit",
			dataField: "Unit",
			sort: true
		},
	]);


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
					const { filtered } = SortButtonFunc(updatedReduxData);
					ExcelDownloadFunc({
						pageField,
						excelData: filtered,
						excelFileName: "Current_Stock_Report",
						mrpWise: mrpWise,
						batchWise: batchWise
					});
				}
				else if (btnMode === 1) {
					const { filtered } = SortButtonFunc(updatedReduxData)
					setTableData(filtered)
				}

			} else if (goButtonData.Status === true) {
				updatedReduxData = [];
			}

			setBtnMode(0); // Reset button mode
			setOriginalTableData(updatedReduxData);

		} catch (e) { }
	}, [goButtonData]);

	useEffect(() => {

		const { filtered } = SortButtonFunc(originalTableData)
		setTableData(filtered)

	}, [mrpWise, batchWise])

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
		value: 0,
		label: "Saleable Stock"
	},
	{
		value: 1,
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
				"IsDamagePieces": stockTypeSelect.value
			});

			dispatch(stockReport_GoButton_API({ jsonBody }))

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

	function SortButtonFunc(baseData) {

		// Define an array of field names and their corresponding checkbox and select states
		const buttonStateArray = [
			{
				fieldName: 'ItemName',
				dataField: 'ItemName',
				checkboxState: true,
				sequence: 1
			},
			{
				fieldName: 'BatchCode',
				dataField: 'BatchCode',
				checkboxState: batchWise,
				sequence: 2
			},
			{
				fieldName: 'MRP',
				dataField: 'MRP',
				checkboxState: mrpWise,
				sequence: 3
			},
			{
				fieldName: 'Quantity',
				dataField: 'ActualQty',
				checkboxState: true,
				sequence: 4
			},
			{
				fieldName: 'Unit',
				dataField: 'Unit',
				checkboxState: true,
				sequence: 5
			},
		];

		let filtered = [...baseData];
		const newSelectedColumns = buttonStateArray
			.filter(option => option.checkboxState)
			.map(option => ({ text: option.fieldName, dataField: option.dataField }));

		// Add additional default columns here

		setSelectedColumns(newSelectedColumns);

		// Apply grouping and filtering logic for each checkbox option
		if (buttonStateArray.some(option => option.checkboxState)) {
			const groupedData = {};

			filtered.forEach(item => {
				const groupValues = buttonStateArray
					.filter(option => option.checkboxState)
					.map(option => item[option.fieldName]);

				const groupKey = groupValues.join('-');
				if (!groupedData[groupKey]) {
					groupedData[groupKey] = {
						...item,
						ActualQty: 0,
					};
				}
				groupedData[groupKey].ActualQty += parseFloat(item.ActualQty);
			});

			const groupedArray = Object.values(groupedData);
			filtered = groupedArray;

			// Apply filters based on selected options
			buttonStateArray.forEach(option => {
				if (option.checkboxState && option.selectValue && option.selectValue.value !== '') {
					filtered = filtered.filter(item => item[option.fieldName] === option.selectValue.label);
				}
			});
		}
		return { filtered };
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

					<Row>
						<Col className="col col-11  mt-1">
							<Row className="mb-2 row ">
								<Col sm={3}>
									<FormGroup className="mb-n2 row mt-1">

										<Label className="col-sm-3 p-2">FromDate</Label>
										<Col sm={6}>
											<C_DatePicker
												name='fromdate'
												value={fromdate}
												disabled={true}
												onChange={fromdateOnchange}
											/>
										</Col>
									</FormGroup>
								</Col>

								<Col sm={3} className="custom-to-date-col">
									<FormGroup className="mb-n3 row mt-1">
										<Label className="col-sm-4 p-2">ToDate</Label>
										<Col>
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
									<FormGroup className="mb-n3 row mt-1">

										<Label className="col-sm-4 p-2">Unit</Label>
										<Col>
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
								</Col>

								{isSCMParty &&
									<Col sm={3}>
										<FormGroup className="mb-n3 row mt-1">
											<Label className="col-sm-4 p-2">Party</Label>
											<Col>
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
									</Col>}
							</Row>
						</Col>

						<Col sm="1" className="mt-2 mb-1 ">
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
					</Row>

					<Row>
						<Col className="col col-11  mt-1">
							<Row className="mb-2 row ">
								<Col sm={3}>
									<FormGroup className="mb-n2 row mt-1">

										<Label className="col-sm-3 p-2">Stock Type</Label>
										<Col sm={6}>
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
													onChange={(e) => {
														setMrpWise(e.target.checked);
													}}
												/>
											</div>
										</Col>
									</FormGroup>
								</Col>

								<Col sm={1}></Col>
								<Col sm={2}>
									<FormGroup className=" row mt-1 " >
										<Label htmlFor="horizontal-firstname-input" className="col-sm-6 col-form-label" >Batch-Wise</Label>
										<Col md={2} style={{ marginTop: '7px' }} >
											<div className="form-check form-switch form-switch-md ">
												<Input type="checkbox" className="form-check-input"
													checked={batchWise}
													name="batchWise"
													onChange={(e) => {
														setBatchWise(e.target.checked);
													}}
												/>
											</div>
										</Col>
									</FormGroup>
								</Col>

							</Row>
						</Col>

						<Col sm="1" className="mt-2 mb-1 ">
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
					</Row>
				</div>

				<div className="mt-1">
					<ToolkitProvider
						keyField="ID"
						// data={tableData}
						// columns={PageListColumns}
						data={tableData}
						columns={selectedColumns}
						// cellEdit={cellEditFactory({ mode: 'click', blurToSave: true })}
						// filter={filterFactory()}
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
