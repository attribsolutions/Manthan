import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import Select from "react-select"
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardBody, Col, FormGroup, Input, Label, Row } from 'reactstrap'
import { comAddPageFieldFunc, initialFiledFunc, onChangeCheckbox, onChangeSelect, onChangeText } from '../../../../../components/Common/validationFunction'
import { Breadcrumb_inputName } from '../../../../../store/actions'
import { getDistrictOnState } from '../../../../../store/Administrator/PartyRedux/action'
import { priceListByPartyAction } from '../../../../../store/Administrator/PriceList/action'
import PriceDropOptions from './PriceDropOptions'
import PartyType from '../../../PartyTypes/PartyType'
import * as url from "../../../../../routes/route_url";
import AddMaster from "../../../EmployeePages/Drodown";
import * as pageId from "../../../../../routes/allPageID"
import { loginPartyID } from '../../../../../components/Common/CommonFunction'
import { getCityOnDistrict, getCityOnDistrictSuccess } from '../../../../../store/Administrator/EmployeeRedux/action'
import CityMaster from '../../../CityPages/CityMaster'

const BaseTabForm = forwardRef(({ subPageMode }, ref) => {

    const dispatch = useDispatch();

    const fileds = {
        Name: "",
        MobileNo: "",
        PartyType: "",
        SAPPartyCode: "",
        Supplier: [],
        PAN: "",
        Email: "",
        AlternateContactNo: "",
        State: "",
        District: "",
        GSTIN: "",
        CityName: "",
        Distance: "",
        MkUpMkDn: false,
        isActive: true,

    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [priceListSelect, setPriceListSelect] = useState({ value: '' });
    const [partyType_AddMasterAccess, setPartyType_AddMasterAccess] = useState(false)
    const [city_AddMasterAccess, setCity_AddMasterAccess] = useState(false)

    const { values } = state;
    const { isError } = state;
    const { fieldLabel } = state;

    useImperativeHandle(ref, () => ({
        setCurrentState(arr) {
            setState(arr)
        },
        getCurrentState: () => {
            return state
        },
        getPriceListSelect: () => {
            return priceListSelect
        },
        setPriceListSelect(arr) {
            setPriceListSelect(arr)
        }
    }));

    const {
        stateRedux,
        DistrictOnState,
        PartyTypes,
        priceListByPartyType,
        SupplierRedux,
        pageField,
        CityOnDistrict,
        userAccess
    } = useSelector((state) => ({
        stateRedux: state.EmployeesReducer.State,
        DistrictOnState: state.PartyMasterReducer.DistrictOnState,
        CityOnDistrict: state.EmployeesReducer.City,
        PartyTypes: state.PartyTypeReducer.ListData,
        priceListByPartyType: state.PriceListReducer.priceListByPartyType,
        SupplierRedux: state.CommonAPI_Reducer.SSDD_List,
        pageField: state.CommonPageFieldReducer.pageField,
        userAccess: state.Login.RoleAccessUpdateData,
    }));

    useEffect(() => {

        userAccess.forEach((index) => {
            if (index.id === pageId.PARTYTYPE) {
                return setPartyType_AddMasterAccess(true)
            }
            if (index.id === pageId.CITY) {
                return setCity_AddMasterAccess(true)
            }
        });

    }, [userAccess])

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    useEffect(() => {
        if (PartyTypes.length === 1) {
            setState((i) => {
                let a = { ...i }
                a.values.PartyType = {
                    value: PartyTypes[0].id,
                    label: PartyTypes[0].Name
                }
                a.hasValid.valid = true;
                return a
            })

            dispatch(priceListByPartyAction(PartyTypes[0].id))
        }
    }, [PartyTypes])



    useEffect(() => {
        let retailerParty = PartyTypes.find(i => (i.IsRetailer))

        if ((subPageMode === url.RETAILER_MASTER) && !(retailerParty === undefined)) {

            setState((i) => {
                let a = { ...i }
                let supilerArr = [{
                    value: loginPartyID()
                }]

                a.values.PartyType = {
                    value: retailerParty.id,
                    label: retailerParty.Name
                }
                a.values.Supplier = supilerArr
                a.hasValid.PartyType.valid = true;
                a.hasValid.Supplier.valid = true;

                delete a.required.PartyType
                delete a.required.Supplier
                return a
            })
            dispatch(priceListByPartyAction(retailerParty.id))
        }
    }, [PartyTypes, pageField])

    const PartyTypeDropdown_Options = PartyTypes.map((index) => ({
        value: index.id,
        label: index.Name,
        division: index.IsDivision,
        IsRetailer: index.IsRetailer
    }));


    const StateValues = stateRedux.map((index) => ({
        value: index.id,
        label: index.Name
    }));

    const DistrictOnStateValues = DistrictOnState.map((index) => ({
        value: index.id,
        label: index.Name
    }));

    const SupplierOptions = SupplierRedux.map((index) => ({
        value: index.id,
        label: index.Name
    }));

    const City_DropdownOptions = CityOnDistrict.map((index) => ({
        value: index.id,
        label: index.Name
    }));

    function partyTypeOnChange(hasSelect, evn) {

        onChangeSelect({ hasSelect, evn, state, setState })
        setPriceListSelect({ label: '' })
        dispatch(priceListByPartyAction(hasSelect.value))
    }

    function handllerState(hasSelect, evn,) {
        onChangeSelect({ hasSelect, evn, state, setState })
        dispatch(getDistrictOnState(hasSelect.value))
        dispatch(getCityOnDistrictSuccess([]))

        setState((i) => {
            const a = { ...i }
            a.values.District = "";
            a.hasValid.District.valid = false

            a.values.CityName = "";
            a.hasValid.CityName.valid = false
            return a
        })
    }


    function District_Dropdown_Handler(e) {
        dispatch(getCityOnDistrict(e.value))
        setState((i) => {
            const a = { ...i }
            a.values.CityName = "";
            a.hasValid.CityName.valid = false
            return a
        })
    }

    const priceListOnClick = function () {

        const hasNone = document.getElementById("price-drop").style;

        if ((priceListByPartyType.length > 0)) {
            if ((hasNone.display === "none") || (hasNone.display === "")) {
                hasNone.display = "block";
            } else {
                hasNone.display = "none";
            }
        }

    };

    const FirstTab = (
        <div id={"base-tabe-area"}>
            <Row >
                <Card className="text-black" style={{ backgroundColor: "whitesmoke" }} >
                    <CardBody >
                        <Row className="mt-3 ">
                            <Col md="3">
                                <FormGroup className="mb-3">
                                    <Label >{fieldLabel.Name} </Label>
                                    <Input
                                        name="Name"
                                        id="txtName"
                                        value={values.Name}
                                        type="text"
                                        disabled={(subPageMode === url.PARTY_SELF_EDIT) && true}
                                        className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
                                        placeholder="Please Enter Name"
                                        autoComplete='off'
                                        autoFocus={true}
                                        onChange={(event) => {
                                            onChangeText({ event, state, setState })
                                            dispatch(Breadcrumb_inputName(event.target.value))
                                        }}
                                    />
                                    {isError.Name.length > 0 && (
                                        <span className="invalid-feedback">{isError.Name}</span>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col md="1">  </Col>
                            <Col md="3">
                                <FormGroup className="mb-3">
                                    <Label >{fieldLabel.MobileNo} </Label>
                                    <Input
                                        name="MobileNo"
                                        value={values.MobileNo}
                                        type="text"
                                        className={isError.MobileNo.length > 0 ? "is-invalid form-control" : "form-control"}
                                        placeholder="Please Enter Mobile"
                                        autoComplete='off'
                                        onChange={(event) => {
                                            onChangeText({ event, state, setState })
                                        }}
                                    />
                                    {isError.MobileNo.length > 0 && (
                                        <span className="invalid-feedback">{isError.MobileNo}</span>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col md="1">  </Col>

                            <Col md="3">
                                <FormGroup className="mb-3">
                                    <Label >{fieldLabel.AlternateContactNo}</Label>
                                    <Input
                                        name="AlternateContactNo"
                                        value={values.AlternateContactNo}
                                        type="text"
                                        className={isError.AlternateContactNo.length > 0 ? "is-invalid form-control" : "form-control"}
                                        placeholder="Please AlternateContactNo"
                                        autoComplete='off'
                                        onChange={(event) => {
                                            onChangeText({ event, state, setState })
                                        }}
                                    />
                                    {isError.AlternateContactNo.length > 0 && (
                                        <span className="invalid-feedback">{isError.AlternateContactNo}</span>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col md="3">
                                <FormGroup className="mb-3">
                                    <Label >{fieldLabel.Email} </Label>
                                    <Input
                                        name="Email"
                                        value={values.Email}
                                        type="text"
                                        className={isError.Email.length > 0 ? "is-invalid form-control" : "form-control"}
                                        placeholder="Please Enter Email"
                                        autoComplete='off'
                                        onChange={(event) => {
                                            onChangeText({ event, state, setState })
                                        }}
                                    />
                                    {isError.Email.length > 0 && (
                                        <span className="invalid-feedback">{isError.Email}</span>
                                    )}
                                </FormGroup>
                            </Col>

                            <Col md="1"></Col>
                            {!(subPageMode === url.RETAILER_MASTER) && // SAPPartyCode   show only (Party Master) mode
                                <Col md="3">
                                    <FormGroup className="mb-3">
                                        <Label htmlFor="validationCustom01">{fieldLabel.SAPPartyCode} </Label>
                                        <Input
                                            name="SAPPartyCode"
                                            value={values.SAPPartyCode}
                                            disabled={(subPageMode === url.PARTY_SELF_EDIT) && true}
                                            type="text"
                                            className={isError.SAPPartyCode.length > 0 ? "is-invalid form-control" : "form-control"}
                                            placeholder="Please Enter SAP Code"
                                            autoComplete='off'
                                            onChange={(event) => {
                                                onChangeText({ event, state, setState })
                                            }}
                                        />
                                        {isError.SAPPartyCode.length > 0 && (
                                            <span className="invalid-feedback">{isError.SAPPartyCode}</span>
                                        )}
                                    </FormGroup>
                                </Col>
                            }

                            <Col md="1"></Col>
                            {!(subPageMode === url.RETAILER_MASTER) &&  // Distance   show only (Party Master) mode
                                <Col md="3">
                                    <FormGroup className="mb-3">
                                        <Label htmlFor="validationCustom01">{fieldLabel.Distance} </Label>
                                        <Input
                                            name="Distance"
                                            value={values.Distance}
                                            type="text"
                                            disabled={(subPageMode === url.PARTY_SELF_EDIT) && true}
                                            className={isError.Distance.length > 0 ? "is-invalid form-control" : "form-control"}
                                            placeholder="Please Enter Distance"
                                            autoComplete='off'
                                            onChange={(event) => {
                                                onChangeText({ event, state, setState })
                                            }}
                                        />
                                        {isError.Distance.length > 0 && (
                                            <span className="invalid-feedback">{isError.Distance}</span>
                                        )}
                                    </FormGroup>
                                </Col>
                            }

                        </Row>
                    </CardBody>
                </Card>
            </Row>
            <Row>
                <Card className=" text-black mt-n2" style={{ backgroundColor: "whitesmoke" }} >
                    <CardBody >
                        <Row className="mt-3 ">
                            {!(subPageMode === url.RETAILER_MASTER) ?
                                <Col md="3">
                                    <FormGroup className="mb-3">
                                        <Label > {fieldLabel.PartyType}</Label>
                                        <Col sm={12}>
                                            <Select
                                                name="PartyType"
                                                value={values.PartyType}
                                                isSearchable={true}
                                                isDisabled={(subPageMode === url.PARTY_SELF_EDIT) && true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={PartyTypeDropdown_Options}
                                                onChange={partyTypeOnChange}
                                            />
                                            {isError.PartyType.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.PartyType}</small></span>
                                            )}

                                        </Col>
                                    </FormGroup>

                                </Col>
                                : null
                            }
                            {/* <Col md="1"> </Col> */}
                            {
                                !(subPageMode === url.RETAILER_MASTER) ?
                                    (partyType_AddMasterAccess) ?
                                        <Col md="1" className=" mt-3">
                                            <AddMaster
                                                masterModal={PartyType}
                                                masterPath={url.PARTYTYPE}
                                            />
                                        </Col> : <Col md="1"> </Col>
                                    : null
                            }


                            <Col md="3" className="mb-3">
                                <FormGroup>
                                    <Label>Price List </Label>
                                    <Input
                                        value={priceListSelect.label}
                                        autoComplete={"off"}
                                        disabled={(subPageMode === url.PARTY_SELF_EDIT) && true}
                                        placeholder="Select..."
                                        onClick={priceListOnClick}
                                    >
                                    </Input>

                                    <PriceDropOptions
                                        data={priceListByPartyType}
                                        priceList={priceListSelect}
                                        setPriceSelect={setPriceListSelect} />
                                </FormGroup>

                            </Col>
                            <Col md="1">  </Col>

                            {!(subPageMode === url.RETAILER_MASTER) &&// SUPLIER dropdown  show only (Party Master) mode
                                < Col md="3">
                                    <FormGroup className="mb-3">
                                        <Label> {fieldLabel.Supplier} </Label>
                                        <Col sm={12}>
                                            <Select
                                                name="Supplier"
                                                value={values.Supplier}
                                                isDisabled={(subPageMode === url.PARTY_SELF_EDIT) && true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={SupplierOptions}
                                                isMulti={true}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState })
                                                }}
                                            />
                                            {isError.Supplier.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Supplier}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>
                            }
                        </Row>
                        <Row>
                            <Col md="3">
                                <FormGroup className="mb-3">
                                    <Label>{fieldLabel.PAN} </Label>
                                    <Input
                                        name="PAN"
                                        value={values.PAN}
                                        disabled={(subPageMode === url.PARTY_SELF_EDIT) && true}
                                        type="text"
                                        className={isError.PAN.length > 0 ? "is-invalid form-control" : "form-control"}
                                        placeholder="Please Enter PAN"
                                        autoComplete='off'
                                        onChange={(event) => {
                                            onChangeText({ event, state, setState })
                                        }}
                                    />
                                    {isError.PAN.length > 0 && (
                                        <span className="invalid-feedback">{isError.PAN}</span>
                                    )}
                                </FormGroup>
                            </Col>

                            <Col md="1">  </Col>
                            <Col md="3">
                                <FormGroup className="mb-3">
                                    <Label> {fieldLabel.GSTIN} </Label>
                                    <Input
                                        type="text"
                                        name="GSTIN"
                                        value={values.GSTIN}
                                        disabled={(subPageMode === url.PARTY_SELF_EDIT) && true}
                                        className={isError.GSTIN.length > 0 ? "is-invalid form-control" : "form-control"}
                                        placeholder="Please Enter GSTIN"
                                        autoComplete='off'
                                        onChange={(event) => {
                                            onChangeText({ event, state, setState })
                                        }}
                                    />
                                    {isError.GSTIN.length > 0 && (
                                        <span className="invalid-feedback">{isError.GSTIN}</span>
                                    )}
                                </FormGroup>
                            </Col>

                            <Col md="1">  </Col>
                            <Col md="3">
                                <FormGroup className="mb-3">
                                    <Row style={{ marginTop: '25px' }}>
                                        <Label
                                            className="col-sm-4 col-form-label">
                                            {fieldLabel.MkUpMkDn}
                                        </Label>
                                        <Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">
                                            <div className="form-check form-switch form-switch-md mb-3">
                                                <Input
                                                    name="MkUpMkDn"
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={values.MkUpMkDn}
                                                    onChange={(event) => onChangeCheckbox({ event, state, setState })}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </FormGroup>
                            </Col>

                        </Row>
                        <Row>
                            <Col md="3">
                                <FormGroup className="mb-3">
                                    <Label> {fieldLabel.State} </Label>
                                    <Col sm={12}>
                                        <Select
                                            name="State"
                                            value={values.State}
                                            isDisabled={(subPageMode === url.PARTY_SELF_EDIT) && true}
                                            isSearchable={true}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            options={StateValues}
                                            onChange={handllerState}
                                        />
                                        {isError.State.length > 0 && (
                                            <span className="text-danger f-8"><small>{isError.State}</small></span>
                                        )}
                                    </Col>
                                </FormGroup>
                            </Col>

                            <Col md="1">  </Col>
                            <Col md="3">
                                <FormGroup className="mb-3">
                                    <Label > {fieldLabel.District} </Label>
                                    <Col sm={12}>
                                        <Select
                                            name="District"
                                            value={values.District}
                                            isDisabled={(subPageMode === url.PARTY_SELF_EDIT) && true}
                                            isSearchable={true}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            options={DistrictOnStateValues}
                                            onChange={(hasSelect, evn) => {
                                                onChangeSelect({ hasSelect, evn, state, setState, })
                                                District_Dropdown_Handler(hasSelect)
                                            }}
                                        />
                                        {isError.District.length > 0 && (
                                            <span className="text-danger f-8"><small>{isError.District}</small></span>
                                        )}
                                    </Col>
                                </FormGroup>
                            </Col>

                            <Col md="1"></Col>
                            <Col md="3">
                                <FormGroup className="mb-3">
                                    <Label htmlFor="validationCustom01">{fieldLabel.CityName} </Label>
                                    <Select
                                        name="CityName"
                                        id="CityName"
                                        value={values.CityName}
                                        isDisabled={(subPageMode === url.PARTY_SELF_EDIT) && true}
                                        isSearchable={true}
                                        classNamePrefix="dropdown"
                                        options={City_DropdownOptions}
                                        onChange={(hasSelect, evn) => {
                                            onChangeSelect({ hasSelect, evn, state, setState, })
                                        }}
                                    />
                                    {isError.CityName.length > 0 && (
                                        <span className="text-danger f-8"><small>{isError.CityName}</small></span>
                                    )}
                                </FormGroup>
                            </Col>
                            {

                                (city_AddMasterAccess) ?
                                    <Col md="1" className=" mt-3">
                                        <AddMaster
                                            masterModal={CityMaster}
                                            masterPath={url.CITY}
                                        />
                                    </Col> : <Col md="1"> </Col>

                            }
                        </Row>
                        <Row>

                            <Col md="3">
                                <FormGroup className="mb-3">
                                    <Row style={{ marginTop: '25px' }}>
                                        <Label
                                            className="col-sm-4 col-form-label">
                                            {fieldLabel.isActive}
                                        </Label>
                                        <Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">
                                            <div className="form-check form-switch form-switch-md mb-3">
                                                <Input type="checkbox" className="form-check-input"
                                                    checked={values.isActive}
                                                    name="isActive"
                                                    onChange={(event) => onChangeCheckbox({ event, state, setState })}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </FormGroup>
                            </Col>

                        </Row>
                    </CardBody>
                </Card>
            </Row>
        </div >
    )
    return FirstTab
})

export default BaseTabForm



