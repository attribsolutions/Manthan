import React, { useEffect, useState, } from "react";
import {
	Col,
	FormGroup,
	Label,
	Row,
} from "reactstrap";

import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, GetVenderSupplierCustomer, GetVenderSupplierCustomerSuccess } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Change_Button, C_Button, Go_Button } from "../../../components/Common/CommonButton";
import {
	breadcrumbReturnFunc,
	metaTagLabel,
} from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode"
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { selectAllCheck } from "../../../components/Common/TableCommonFunc";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { C_Select } from "../../../CustomValidateForm";
import { mobileApp_Send_Retailer_Api } from "../../../helpers/backend_helper"
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";

const Index = (props) => {

	const history = useHistory()
	const dispatch = useDispatch();

	const [modalCss] = useState(false);
	const [pageMode] = useState(mode.defaultsave);
	const [userPageAccessState, setUserAccState] = useState(123);

	const [partyName, setPartyName] = useState([]);
	const [saveBtnLoading, setSaveBtnLoading] = useState(false);

	//Access redux store Data / 'save_ModuleSuccess' action data
	const {
		partyDropdownLoading,
		partyList = [],
		RetailerList,
		goBtnLoading,
		userAccess,
	} = useSelector((state) => ({
		partyList: state.CommonPartyDropdownReducer.commonPartyDropdown,
		partyDropdownLoading: state.CommonPartyDropdownReducer.partyDropdownLoading,
		goBtnLoading: state.CommonAPI_Reducer.vendorSupplierCustomerLoading,
		RetailerList: state.CommonAPI_Reducer.vendorSupplierCustomer,
		userAccess: state.Login.RoleAccessUpdateData,
	}));

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
			breadcrumbReturnFunc({ dispatch, userAcc });
		};
	}, [userAccess])

	// userAccess useEffect
	useEffect(() => {
		dispatch(BreadcrumbShowCountlabel(`Count:${0}`));
		return () => {
			dispatch(GetVenderSupplierCustomerSuccess([]));
		}
	}, [])

	const location = { ...history.location }
	const hasShowloction = location.hasOwnProperty(mode.editValue)
	const hasShowModal = props.hasOwnProperty(mode.editValue)

	const partyListOptions = partyList.map((index) => ({
		value: index.id,
		label: index.Name,
	}));

	const pagesListColumns = [
		{
			text: "Retailer Name",
			dataField: "Name",
		}
	];

	function goButtonOnchange() {
		if (partyName.length === 0) {
			customAlert({
				Type: 4,
				Message: alertMessages.commonPartySelectionIsRequired
			});
			return;
		}
		dispatch(GetVenderSupplierCustomer({ subPageMode: url.MOBILE_RETAILER_SEND, PartyID: partyName.value }));
	}

	function rowSelected() {
		return RetailerList.map((index) => { return (index.selectCheck) && index.id })
	}

	const SaveHandler = async (event) => {

		event.preventDefault();
		const CheckArray = RetailerList.filter(index => index.selectCheck === true);

		if (CheckArray.length === 0) {
			customAlert({ Type: 4, Status: true, Message: alertMessages.atLeastOneRetailerIsRequired });
			return;
		}

		const RetailerJson = {
			RetailerID: CheckArray.map(index => index.id).join(',')
		};

		const jsonBody = JSON.stringify(RetailerJson);

		try {
			setSaveBtnLoading(true);
			const mobilApiResp = await mobileApp_Send_Retailer_Api({ jsonBody });

			if (mobilApiResp.StatusCode === 200) {
				customAlert({ Type: 1, Status: true, Message: mobilApiResp.Message });
				dispatch(GetVenderSupplierCustomerSuccess([]));
				setPartyName('');
			}
			else {
				customAlert({ Type: 4, Status: true, Message: mobilApiResp.Message });
			}
		} catch (e) { }
		finally {
			setSaveBtnLoading(false);
		}
	};

	const nonSelectedRow = () => {
		return RetailerList.filter(row => (!(row.SkyggeID === null))).map(row => row.id)
	}

	// IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
	var IsEditMode_Css = ''
	if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

	if (!(userPageAccessState === '')) {
		return (
			<React.Fragment>
				<MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

				<div className="page-content" style={{ marginTop: IsEditMode_Css, marginBottom: "200px" }}>
					<div className="px-2   c_card_header text-black mb-1" >
						<div className="row">
							<Col sm="5">
								<FormGroup className=" row mt-2  mb-1" >
									<Label className="col-sm-5 p-2"
										style={{ width: "83px" }}>Party </Label>
									<Col sm="6">
										<C_Select
											name="Party"
											value={partyName}
											isSearchable={true}
											className="react-dropdown"
											classNamePrefix="dropdown"
											autoFocus={true}
											options={partyListOptions}
											isLoading={partyDropdownLoading}
											isDisabled={RetailerList.length > 0 && true}
											onChange={(e) => {
												setPartyName(e)
											}}
											styles={{
												menu: provided => ({ ...provided, zIndex: 2 })
											}}
										/>
									</Col>
								</FormGroup>
							</Col>

							<Col sm="1" className="mt-2">
								{RetailerList.length === 0 ?
									<Go_Button
										loading={goBtnLoading}
										onClick={goButtonOnchange} />
									:
									<Change_Button onClick={() => { dispatch(GetVenderSupplierCustomerSuccess([])) }} />
								}

							</Col>

						</div>
					</div>

					<form noValidate>
						<ToolkitProvider
							keyField="id"
							data={RetailerList}
							columns={pagesListColumns}
							search
						>
							{toolkitProps => (
								<React.Fragment>
									<div className="table">
										<BootstrapTable
											keyField={"id"}
											bordered={true}
											striped={true}
											selectRow={selectAllCheck({
												rowSelected: rowSelected(),
												nonSelectable: nonSelectedRow(),
												bgColor: '',
												tableList: RetailerList

											})}
											noDataIndication={<div className="text-danger text-center ">Record Not Found</div>}
											classes={"table align-middle table-nowrap table-hover"}
											headerWrapperClasses={"thead-light"}
											{...toolkitProps.baseProps}
											onDataSizeChange={({ dataSize }) => {
												dispatch(BreadcrumbShowCountlabel(`Count:${dataSize}`));
											}}
										/>

										{mySearchProps(toolkitProps.searchProps)}
									</div>

								</React.Fragment>
							)
							}
						</ToolkitProvider>

						{RetailerList.length > 0 ?
							<FormGroup style={{ marginTop: "-25px" }}>
								<Row >
									<Col sm={2} className="mt-n4"> <div className="row save1" style={{ paddingBottom: 'center' }}>
										<C_Button
											title={`Send Retailer`}
											className="btn btn-primary w-md"
											type="button"
											onClick={SaveHandler}
											loading={saveBtnLoading}
											spinnerColor="white"
										><i className="bx bx-send"></i> Send</C_Button>
									</div>
									</Col>
								</Row>
							</FormGroup >
							: null
						}

					</form>
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

export default Index

