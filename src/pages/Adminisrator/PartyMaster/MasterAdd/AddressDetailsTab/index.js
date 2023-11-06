import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import AddressDetailsTable from './Table';
import { useSelector } from 'react-redux';
import {
	comAddPageFieldFunc,
	formValid,
	initialFiledFunc,
	onChangeCheckbox,
	onChangeDate,
	onChangeText,
	resetFunction
} from '../../../../../components/Common/validationFunction';
import { CInput, C_DatePicker, decimalRegx } from '../../../../../CustomValidateForm';
import { C_Button } from '../../../../../components/Common/CommonButton';
import { date_ymd_func } from '../../../../../components/Common/CommonFunction';

const AddressTabForm = forwardRef((props, ref) => {

	const fileds = {
		PartyAddress: "",
		FSSAINo: '',
		FSSAIExipry: null,
		PIN: '',
		IsDefault: false
	}

	const [state, setState] = useState(() => initialFiledFunc(fileds))

	const [addressTable, setAddressTable] = useState([]);
	const [imageTable, setImageTable] = useState('');

	const [buttonShow, setButtonShow] = useState(false);

	const { values } = state;
	const { isError } = state;
	const { fieldLabel } = state;

	useImperativeHandle(ref, () => ({
		setCurrentState(arr) {
			setAddressTable(arr)
		},
		getCurrentState: () => {
			return addressTable
		},
		IsAddressEnter: () => {
			return state
		}

	}));

	const {
		pageField,
	} = useSelector((state) => ({
		pageField: state.CommonPageFieldReducer.pageField
	}));

	useEffect(() => {
		if (pageField) {
			const fieldArr = pageField.PageFieldMaster
			comAddPageFieldFunc({ state, setState, fieldArr })
		}
	}, [pageField])

	const addOrUpdateDataHandler = (e, btnMode) => {

		try {
			if (btnMode === "update") { setButtonShow(true) }

			const isvalid = formValid(state, setState);

			let editRow = state.values

			if (isvalid) {
				const val = {
					Address: values.PartyAddress,
					FSSAINo: values.FSSAINo,
					FSSAIExipry: values.FSSAIExipry,
					PIN: values.PIN,
					IsDefault: values.IsDefault,
					fssaidocument: imageTable
				};

				if (values.IsDefault) {
					addressTable.forEach(ele => {
						ele.IsDefault = false;
					});
				}

				if (btnMode === "update") {

					// Update the selected row
					const updatedTableData = addressTable.map((row) => {
						if (row.RowId === editRow.RowId) {
							return { ...editRow, ...val }; // Update the selected row
						} else {
							return row; // Keep other rows unchanged
						}
					});
					setAddressTable(updatedTableData);

				} else {
					// Add a new row
					const tableleth = addressTable.length;
					val.RowId = tableleth + 1;
					const updatedTableData = [...addressTable];
					updatedTableData.push(val);

					if (updatedTableData.length === 1) {
						updatedTableData[0] = { ...updatedTableData[0], IsDefault: true };
					}
					setAddressTable(updatedTableData);
				}
				setButtonShow(false);

				setState(resetFunction(fileds, state)); // Clear form values

			}
		} catch (error) { }
	};

	const onchangeHandler = async (event) => {

		const file = event.target.files[0]
		const base64 = await convertBase64(file);
		let ImageUpload = base64
		setImageTable(ImageUpload)
	}

	const convertBase64 = (file) => {

		return new Promise((resolve, reject) => {
			const fileReader = new FileReader()
			fileReader.readAsDataURL(file);

			fileReader.onload = () => {
				resolve(fileReader.result)
			};
			fileReader.onerror = (error) => {
				reject(error)
			}
		})
	}

	const FSSAIverifyhandler = () => {
		window.open("https://foscos.fssai.gov.in/");
	}

	const handleEditRow = (row) => {

		setButtonShow(true);
		setState((i) => {

			const a = { ...i }
			a.values.PartyAddress = row.Address;
			a.values.FSSAINo = row.FSSAINo;
			a.values.FSSAIExipry = date_ymd_func(row.FSSAIExipry)
			a.values.PIN = row.PIN;
			a.values.IsDefault = row.IsDefault;
			a.values["RowId"] = row.RowId;
			a.values["id"] = row.id

			a.hasValid.PartyAddress.valid = true
			a.hasValid.FSSAINo.valid = true
			a.hasValid.FSSAIExipry.valid = true
			a.hasValid.PIN.valid = true
			a.hasValid.IsDefault.valid = true

			return a
		})
	}

	const AddressTab = (
		<Row>
			<Card className="text-black" style={{ backgroundColor: "whitesmoke" }}>
				<CardBody >
					<Row >
						<Col md="9" >
							<FormGroup className="mb-3">
								<Label htmlFor="validationCustom01">{fieldLabel.PartyAddress} </Label>
								<Input
									name="PartyAddress"
									value={values.PartyAddress}
									type="text"
									className={isError.PartyAddress.length > 0 ? "is-invalid form-control" : "form-control"}
									placeholder="Please Enter Address"
									autoComplete='off'
									onChange={(event) => {
										onChangeText({ event, state, setState })
									}}
								/>
								{isError.PartyAddress.length > 0 && (
									<span className="invalid-feedback">{isError.PartyAddress}</span>
								)}
							</FormGroup>

						</Col>
						{!(buttonShow) ?
							<Col md={1}>
								<Row className=" mt-3">
									<Col >
										<Button
											className="button_add badge badge-soft-primary font-size-12 waves-effect  waves-light  btn-outline-primary  "
											type="button"
											onClick={(e) => addOrUpdateDataHandler(e, "add")}
										>
											<i className="dripicons-plus mt-3"> </i>
										</Button>
									</Col>
								</Row>
							</Col> :
							<Col md={1}>
								<Row style={{ marginTop: "29px" }}>
									<Col >

										<C_Button
											// style={{ backgroundColor: "#0762ab", color: "#fff" }}
											type="button"
											className="btn btn-info font-size-12 text-center"
											onClick={(e) => addOrUpdateDataHandler(e, "update")}
										>
											Update
										</C_Button>
									</Col>
								</Row>
							</Col>}
					</Row>

					<Row>
						<Col md="4">
							<FormGroup className="mb-3">
								<Label htmlFor="validationCustom01">{fieldLabel.FSSAINo} </Label>
								<Input
									name="FSSAINo"
									value={values.FSSAINo}
									type="text"
									className={isError.FSSAINo.length > 0 ? "is-invalid form-control" : "form-control"}
									placeholder="Please Enter FSSAINo"
									autoComplete='off'
									onChange={(event) => {
										onChangeText({ event, state, setState })
									}}
								/>
								{(isError.FSSAINo.length > 0) && (
									<span className="invalid-feedback">{isError.FSSAINo}</span>
								)}
							</FormGroup>
						</Col>
						<Col md="1" className=" mt-3">
							<Button
								className=" p-1 mt-3 "
								color="btn btn-outline-primary border-2 font-size-10 "
								type="button"
								title={`After Redirect Click on FBO Search`}

								onClick={FSSAIverifyhandler}
							> Verify FSSAI
							</Button>
						</Col>

						{/* <Col md="1"> </Col> */}
						<Col md="4">
							<FormGroup className="mb-3">
								<Label htmlFor="validationCustom01">{fieldLabel.FSSAIExipry} </Label>
								<C_DatePicker
									options={{
										minDate: "today",
										altInput: true,
										altFormat: "d-m-Y",
										dateFormat: "Y-m-d",
									}}
									name="FSSAIExipry"
									value={values.FSSAIExipry}
									placeholder={"DD/MM/YYYY"}
									onChange={(c, v, e) => onChangeDate({ v, e, state, setState })}
								/>
								{(isError.FSSAIExipry.length > 0) && (
									<span className="text-danger f-8"><small>{isError.FSSAIExipry}</small></span>
								)}
							</FormGroup>
						</Col>
					</Row>

					<Row >
						<Col md="4">
							<FormGroup className="mb-3">
								<Label htmlFor="validationCustom01">{fieldLabel.PIN} </Label>
								<CInput
									name="PIN"
									value={values.PIN}
									type="text"
									cpattern={decimalRegx}
									className={isError.PIN.length > 0 ? "is-invalid form-control" : "form-control"}
									placeholder="Please Enter PIN"
									autoComplete='off'
									onChange={(event) => {
										onChangeText({ event, state, setState })
									}}
								/>
								{isError.PIN.length > 0 && (
									<span className="invalid-feedback">{isError.PIN}</span>
								)}
							</FormGroup>
						</Col>

						<Col md="1"></Col>

						<Col md="4" >
							<FormGroup >
								<Label >FSSI Document</Label>
								<Input type="file"
									className="form-control "
									name="image"
									id="file"
									accept=".jpg, .jpeg, .png ,.pdf"
									onChange={(event) => { onchangeHandler(event) }}
								/>
							</FormGroup>
						</Col>
					</Row>

					<Row>
						<Col md="3">
							<FormGroup className="mb-3">
								<Row style={{ marginTop: '25px' }}>
									<Label className="col-sm-4 col-form-label">{fieldLabel.IsDefault} </Label>
									<Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">
										<div className="form-check form-switch form-switch-md mb-3">
											<Input type="checkbox"
												name="IsDefault"
												className="form-check-input"
												checked={values.IsDefault}
												onChange={(event) => {
													onChangeCheckbox({ event, state, setState })
												}}
											/>
										</div>
									</Col>
								</Row>
							</FormGroup>
						</Col>
					</Row>

				</CardBody>
			</Card>
			<Row>
				<AddressDetailsTable
					addressTable={addressTable}
					onEdit={handleEditRow}
					setAddressTable={setAddressTable}
				/>

				{/* <AddressDetailsTable addressTable={addressTable} setAddressTable={setAddressTable} /> */}
			</Row>

		</Row>
	);
	function curruntState() {
		return addressTable
	}
	return AddressTab
	// [AddressTab, curruntState, setAddressTable]
})

export default AddressTabForm;
