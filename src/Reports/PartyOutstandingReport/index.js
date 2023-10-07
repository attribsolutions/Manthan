import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { MetaTags } from "react-meta-tags";
import Select from "react-select";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess, getBaseUnit_ForDropDown, getBaseUnit_ForDropDownSuccess } from "../../store/actions";
import C_Report from "../../components/Common/C_Report";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { damageStockReport_GoButton_API, damageStockReport_GoButton_API_Success } from "../../store/Report/DamageStockReportRedux/action";
import DynamicColumnHook from "../../components/Common/TableCommonFunc";
import { mode, pageId } from "../../routes/index"
import CustomTable from "../../CustomTable2";
import PartyDropdownForReport, { ReportComponent, ShowAndExcelBtn } from "../ReportComponent";
import { Go_Button } from "../../components/Common/CommonButton";
import { GetRoutesList, GetRoutesListSuccess } from "../../store/Administrator/RoutesRedux/actions";
import { DamageStockReport_GoBtn_API, OutStandingBalance_GoBtn_API } from "../../helpers/backend_helper";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";

const PartyOutstandingReport = (props) => {

	const dispatch = useDispatch();
	const history = useHistory();
	const currentDate_ymd = _cfunc.date_ymd_func();
	const isSCMParty = _cfunc.loginIsSCMParty();

	const [headerFilters, setHeaderFilters] = useState('');
	const [userPageAccessState, setUserAccState] = useState('');
	const [subPageMode] = useState(history.location.pathname)

	const [partyDropdown, setPartyDropdown] = useState('');
	const [routeDropdown, setRouteDropdown] = useState({value:"",label:"All"});
	const [tableData, setTableData] = useState([]);
	const [btnMode, setBtnMode] = useState(0);

	const reducers = useSelector(
		(state) => ({
			listBtnLoading: state.DamageStockReportReducer.listBtnLoading,
			RouteListLoading: state.RoutesReducer.goBtnLoading,
			RoutesList: state.RoutesReducer.RoutesList,
			goButtonData: state.DamageStockReportReducer.StockReportGobtn,
			userAccess: state.Login.RoleAccessUpdateData,
			pageField: state.CommonPageFieldReducer.pageField
		})
	);

	const { userAccess, pageField, RoutesList, RouteListLoading, goButtonData = [], listBtnLoading } = reducers;
	const { date = currentDate_ymd, todate = currentDate_ymd } = headerFilters;

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

		if (goButtonData.StatusCode === 200) {
			setTableData(goButtonData.Data)
		}
	}, [goButtonData]);

	useEffect(() => {

		dispatch(commonPageFieldSuccess(null));
		dispatch(commonPageField(pageId.PARTY_OUTSTANDING_REPORT))
		dispatch(BreadcrumbShowCountlabel(`Count:${0}`));
		dispatch(GetRoutesList());
		return () => {
			dispatch(commonPageFieldSuccess(null));
			dispatch(GetRoutesListSuccess([]));
			dispatch(damageStockReport_GoButton_API_Success([]));
		}
	}, [])

	const [tableColumns] = DynamicColumnHook({ pageField })

	const RoutesListOptions = RoutesList.reduce((options, data) => {
		options.push({ value: data.id, label: data.Name });
		return options;
	  }, [{ value: "", label: "All" }]);

	async function goButtonHandler(e, btnMode) {
		try {
			setBtnMode(btnMode)

			if ((isSCMParty) && (partyDropdown === "")) {
				customAlert({ Type: 3, Message: "Please Select Party" });
				return;
			}

			const jsonBody = JSON.stringify({
				"Date": date,
				"RouteID": routeDropdown === '' ? "" : routeDropdown.value,
				"PartyID": partyDropdown === "" ? _cfunc.loginPartyID() : partyDropdown.value,
			});

			dispatch(damageStockReport_GoButton_API({ jsonBody, subPageMode }))

		} catch (error) { _cfunc.CommonConsole(error) }
	}

	function dateOnchange(e, date) {
		let newObj = { ...headerFilters }
		newObj.date = date
		setHeaderFilters(newObj)
		setTableData([]);
	}

	function partyOnChangeHandler(e) {
		setPartyDropdown(e);
		setRouteDropdown({value:"",label:"All"});
		const jsonBody = JSON.stringify({ CompanyID: _cfunc.loginCompanyID(), PartyID: e.value });
		dispatch(GetRoutesList(jsonBody));
		setTableData([]);
	}

	return (
		<React.Fragment>
			<MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
			<div className="page-content">

				<div className="px-2 c_card_filter text-black mb-1">
					<div className="row">
						<Col sm={(isSCMParty) ? 4 : 3} className="">
							<FormGroup className="mb-2 row mt-3">
								<Label className="col-sm-4 p-2" style={{ width: "66px" }}>
									Date
								</Label>
								<Col sm={7}>
									<C_DatePicker
										name='date'
										value={date}
										onChange={dateOnchange}
									/>
								</Col>
							</FormGroup>
						</Col>

						<PartyDropdownForReport // Party Dropdown if isSCMParty true then Party dropdown show
							partyValue={partyDropdown}
							setPartyValue={partyOnChangeHandler}
						/>
						<Col sm={(isSCMParty) ? 4 : 3}>
							<FormGroup className="row mt-3">
								<Label className="col-sm-2 p-2" style={{ width: "85px" }}>
									Route
								</Label>
								<Col sm={7}>
									<C_Select
										name="Route"
										value={routeDropdown}
										// isDisabled={tableData.length > 0 && true}
										isSearchable={true}
										className="react-dropdown"
										isLoading={RouteListLoading}
										classNamePrefix="dropdown"
										styles={{
											menu: (provided) => ({ ...provided, zIndex: 2 }),
										}}
										options={RoutesListOptions}
										onChange={(e) => {
											setRouteDropdown(e);
											setTableData([]);
										}}
									/>
								</Col>
							</FormGroup>
						</Col>
						<Col sm="1" className="mt-3 mb-3">
							<Go_Button onClick={goButtonHandler} loading={listBtnLoading} />
						</Col>

					</div>
				</div>

				<div className="mt-1">
					<ToolkitProvider
						keyField="PartyID"
						data={tableData}
						columns={tableColumns}
						search
					>
						{(toolkitProps,) => (
							<React.Fragment>
								<Row>
									<Col xl="12">
										<div className="table-responsive table">
											<BootstrapTable
												keyField="PartyID"
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

export default PartyOutstandingReport;;
