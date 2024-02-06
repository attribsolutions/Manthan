import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../store/actions";
import C_Report from "../../components/Common/C_Report";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import DynamicColumnHook from "../../components/Common/TableCommonFunc";
import { mode, pageId } from "../../routes/index"
import PartyDropdownForReport from "../ReportComponent";
import { Change_Button, Go_Button } from "../../components/Common/CommonButton";
import { GetRoutesList, GetRoutesListSuccess } from "../../store/Administrator/RoutesRedux/actions";
import { PartyOutstandingReport_GoButton_API, PartyOutstandingReport_GoButton_API_Success } from "../../store/Report/PartyOutstandingRedux/action";
import CustomTable from "../../CustomTable2";
import { alertMessages } from "../../components/Common/CommonErrorMsg/alertMsg";
import { allLabelWithBlank } from "../../components/Common/CommonErrorMsg/HarderCodeData";


const PartyOutstandingReport = (props) => {

	const dispatch = useDispatch();
	const history = useHistory();
	const currentDate_ymd = _cfunc.date_ymd_func();
	const isSCMParty = _cfunc.loginIsSCMParty();

	const [headerFilters, setHeaderFilters] = useState('');
	const [userPageAccessState, setUserAccState] = useState('');

	const [partyDropdown, setPartyDropdown] = useState('');
	const [routeDropdown, setRouteDropdown] = useState(allLabelWithBlank);
	const [tableData, setTableData] = useState([]);

	const reducers = useSelector(
		(state) => ({
			listBtnLoading: state.DamageStockReportReducer.listBtnLoading,
			RouteListLoading: state.RoutesReducer.goBtnLoading,
			RoutesList: state.RoutesReducer.RoutesList,
			goButtonData: state.PartyOutStanding_Reducer.partyOutStanding_Gobtn,
			userAccess: state.Login.RoleAccessUpdateData,
			pageField: state.CommonPageFieldReducer.pageField
		})
	);

	const { userAccess, pageField, RoutesList, RouteListLoading, goButtonData = [], listBtnLoading } = reducers;
	const { date = currentDate_ymd, } = headerFilters;

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

		dispatch(commonPageFieldSuccess(null));
		dispatch(commonPageField(pageId.PARTY_OUTSTANDING_REPORT))
		dispatch(BreadcrumbShowCountlabel(`Count:${0} ₹ ${0.00}`));
		if (_cfunc.CommonPartyDropValue().value > 0) {
            setPartyDropdown(_cfunc.CommonPartyDropValue())
        }
		dispatch(GetRoutesList());
		return () => {
			dispatch(commonPageFieldSuccess(null));
			dispatch(GetRoutesListSuccess([]));
			dispatch(PartyOutstandingReport_GoButton_API_Success([]));
		}
	}, [])

	const [tableColumns] = DynamicColumnHook({ pageField })

	const RoutesListOptions = RoutesList.reduce((options, data) => {
		options.push({ value: data.id, label: data.Name });
		return options;
	}, [allLabelWithBlank]);

	async function goButtonHandler() {
		try {

			if ((isSCMParty) && (partyDropdown === "")) {
				customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
				return;
			}

			const jsonBody = JSON.stringify({
				"Date": date,
				"RouteID": routeDropdown === '' ? "" : routeDropdown.value,
				"PartyID": partyDropdown === "" ? _cfunc.loginPartyID() : partyDropdown.value,
			});

			dispatch(PartyOutstandingReport_GoButton_API({ jsonBody }))

		} catch (error) { _cfunc.CommonConsole(error) }
	}

	function dateOnchange(e, date) {
		let newObj = { ...headerFilters }
		newObj.date = date
		setHeaderFilters(newObj)
		dispatch(PartyOutstandingReport_GoButton_API_Success([]));
	}

	function partyOnChangeHandler(e) {
		setPartyDropdown(e);
		setRouteDropdown(allLabelWithBlank);
		const jsonBody = JSON.stringify({ CompanyID: _cfunc.loginCompanyID(), PartyID: e.value });
		dispatch(GetRoutesList(jsonBody));
		dispatch(PartyOutstandingReport_GoButton_API_Success([]));
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
											dispatch(PartyOutstandingReport_GoButton_API_Success([]));
										}}
									/>
								</Col>
							</FormGroup>
						</Col>
						<Col sm="1" className="mt-3 mb-3">
							{
								goButtonData.length === 0 ?
									<Go_Button onClick={goButtonHandler} loading={listBtnLoading} />
									: <Change_Button onClick={() => dispatch(PartyOutstandingReport_GoButton_API_Success([]))} />
							}
						</Col>

					</div>
				</div>

				<div className="mb-1">
					<CustomTable
						keyField={"id"}
						data={goButtonData}
						columns={tableColumns}
						id="table_Arrow"
						noDataIndication={
							<div className="text-danger text-center ">
								Items Not available
							</div>
						}
						onDataSizeChange={({ dataCount, filteredData = [] }) => {
							let totalAmount = filteredData.reduce((total, item) => {
								return total + Number(item.recordsAmountTotal) || 0;

							}, 0);
							let commaSeparateAmount = _cfunc.amountCommaSeparateFunc(Number(totalAmount).toFixed(2));

							dispatch(BreadcrumbShowCountlabel(`Count:${dataCount} ₹ ${commaSeparateAmount}`));
						}}
					/>
				</div>
			</div>
			<C_Report />
		</React.Fragment >
	)
}

export default PartyOutstandingReport;;
