import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import Select from "react-select"
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Row } from 'reactstrap'
import { comAddPageFieldFunc, initialFiledFunc, onChangeCheckbox, onChangeSelect, onChangeText } from '../../../../../components/Common/validationFunction'
import { Breadcrumb_inputName } from '../../../../../store/actions'
import { getDistrictOnState } from '../../../../../store/Administrator/PartyRedux/action'
import { priceListByPartyAction, priceListByPartyActionSuccess } from '../../../../../store/Administrator/PriceList/action'
import PriceDropOptions from './PriceDropOptions'
import PartyType from '../../../PartyTypes/PartyType'
import * as url from "../../../../../routes/route_url";
import AddMaster from "../../../EmployeePages/Drodown";
import * as pageId from "../../../../../routes/allPageID"
import { getSettingBasedPartyTypeID, loginJsonBody, loginPartyID, loginPartyName, loginPartyTypeName, loginRoleID, loginSystemSetting } from '../../../../../components/Common/CommonFunction'
import { getCityOnDistrict, getCityOnDistrictSuccess } from '../../../../../store/Administrator/EmployeeRedux/action'
import CityMaster from '../../../CityPages/CityMaster'
import { C_Select } from '../../../../../CustomValidateForm'
import { GetRoutesList, GetRoutesListSuccess } from '../../../../../store/Administrator/RoutesRedux/actions'
import { Get_Subcluster_On_cluster_API } from '../../../../../helpers/backend_helper'

const BaseTabForm = forwardRef(({ subPageMode }, ref) => {

    const dispatch = useDispatch();
    const loginPartyType = loginPartyTypeName()

    const fileds = {
        Name: "",
        MobileNo: "",
        ShortName: "",
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
        Route: "",
        Distance: "",
        isActive: true,
        Latitude: "",
        Longitude: "",
        Cluster: "",
        SubCluster: "",
        PriceList: "",
        CountryName: { value: 1, label: "India" }
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [priceListSelect, setPriceListSelect] = useState({ value: '' });
    const [partyType_AddMasterAccess, setPartyType_AddMasterAccess] = useState(false)
    const [city_AddMasterAccess, setCity_AddMasterAccess] = useState(false)

    const [SubClusterOptions, setSubClusterOptions] = useState({});

    const [partyTypeDisabled, setPartyTypeDisabled] = useState(false)
    const [supplierDisabled, setSupplierDisabled] = useState(false)

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
        RoutesList,
        userAccess,
        districtDropDownLoading,
        cityDropDownLoading,
        clusterDropdown,
        commonPartyDropSelect,
        countryList,
        countryListloading
    } = useSelector((state) => ({
        countryList: state.CountryReducer.CountryList,
        countryListloading: state.CountryReducer.loading,
        clusterDropdown: state.ClusterReducer.ClusterListData,
        stateRedux: state.EmployeesReducer.State,
        DistrictOnState: state.PartyMasterReducer.DistrictOnState,
        CityOnDistrict: state.EmployeesReducer.City,
        PartyTypes: state.PartyTypeReducer.ListData,
        priceListByPartyType: state.PriceListReducer.priceListByPartyType,
        SupplierRedux: state.CommonAPI_Reducer.SSDD_List,
        RoutesList: state.RoutesReducer.RoutesList,
        pageField: state.CommonPageFieldReducer.pageField,
        userAccess: state.Login.RoleAccessUpdateData,
        districtDropDownLoading: state.PartyMasterReducer.districtDropDownLoading,
        cityDropDownLoading: state.EmployeesReducer.cityDropDownLoading,
        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
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

    // Common Party Dropdown useEffect
    useEffect(() => {

        if (commonPartyDropSelect.value <= 0) {
            setPriceListSelect({ value: '' })
            dispatch(Breadcrumb_inputName(""))
        }


        setState((i) => {
            let a = { ...i }

            a.values.Name = ''
            a.values.MobileNo = ''
            a.values.PartyType = ''
            a.values.SAPPartyCode = ''
            a.values.Supplier = []
            a.values.PAN = ''
            a.values.Email = ''
            a.values.AlternateContactNo = ''
            a.values.State = ''
            a.values.District = ''
            a.values.GSTIN = ''
            a.values.CityName = ''
            a.values.Route = ''
            a.values.Distance = ''
            a.values.isActive = true
            a.values.Latitude = ''
            a.values.Longitude = ''
            a.values.ShortName = ''

            a.hasValid.Name.valid = false;
            a.hasValid.MobileNo.valid = false;
            a.hasValid.PartyType.valid = false;
            a.hasValid.SAPPartyCode.valid = false;
            a.hasValid.Supplier.valid = false;
            a.hasValid.PAN.valid = false;
            a.hasValid.Email.valid = false;
            a.hasValid.AlternateContactNo.valid = false;
            a.hasValid.State.valid = false;
            a.hasValid.District.valid = false;
            a.hasValid.GSTIN.valid = false;
            a.hasValid.CityName.valid = false;
            a.hasValid.Distance.valid = false;
            a.hasValid.Latitude.valid = false;
            a.hasValid.Longitude.valid = false;
            a.hasValid.Route.valid = false;
            a.hasValid.ShortName.valid = false;



            
            return a
        })

        if (commonPartyDropSelect.value > 0) {
            dispatch(GetRoutesList({ ...loginJsonBody(), "PartyID": commonPartyDropSelect.value }))
            if (subPageMode === url.RETAILER_MASTER) {
                dispatch(priceListByPartyAction(11))
            }

        }
        return () => {
            dispatch(GetRoutesListSuccess([]));
        }
    }, [commonPartyDropSelect]);

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
        
        const PartyTypeID = getSettingBasedPartyTypeID(loginSystemSetting().PriceListSetting, loginRoleID())
        let PartyType = null
        if (PartyTypeID !== null) {
            PartyType = PartyTypes.find(i => (i.id === PartyTypeID))
        } else {
            PartyType = PartyTypes.find(i => (i.IsRetailer))
        }

        if ((subPageMode === url.RETAILER_MASTER) && !(PartyType === undefined)) {

            setState((i) => {
                let a = { ...i }
                let supilerArr = [{
                    value: commonPartyDropSelect.value
                }]

                a.values.PartyType = {
                    value: PartyType.id,
                    label: PartyType.Name
                }
                a.values.Supplier = supilerArr
                a.hasValid.PartyType.valid = true;
                a.hasValid.Supplier.valid = true;

                delete a.required.PartyType
                delete a.required.Supplier
                return a
            })
            dispatch(priceListByPartyAction(PartyType.id))
        }
    }, [PartyTypes, pageField])

    useEffect(() => {

        if (loginPartyType && subPageMode === url.FRANCHISE_CUSTOMER_MASTER) {
            
            setState((i) => {
                const a = { ...i }
                a.values.PartyType = { value: 31, label: "Franchise Customer" };
                a.hasValid.PartyType.valid = true


                a.values.Supplier = [{ value: loginPartyID(), label: loginPartyName() }];
                a.hasValid.Supplier.valid = true

                setSupplierDisabled(true);
                setPartyTypeDisabled(true);
                dispatch(priceListByPartyAction(31))
                return a
            })
        }

    }, [loginPartyType, PartyTypes, SupplierRedux])

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

    const RoutesListOptions = RoutesList.map((index) => ({
        value: index.id,
        label: index.Name,
        IsActive: index.IsActive
    }));

    const Cluster_Options = clusterDropdown.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const CountryListOptions = countryList?.map((data) => ({
        value: data.id,
        label: data.Country
    }));

    const getSubCluster = async ({ Select }) => {
        const response = await Get_Subcluster_On_cluster_API(Select.value);

        if (response.StatusCode === 200) {
            setSubClusterOptions(response.Data.map(index => ({ value: index.id, label: index.Name })))
        }
    }

    const RouteName_Options = RoutesListOptions.filter((index) => {
        return index.IsActive === true
    });

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
    const GSTINverifyhandler = () => {

        window.open("https://services.gst.gov.in/services/searchtp");
    }

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
                                    <Label >{fieldLabel.ShortName} </Label>
                                    <Input
                                        name="ShortName"
                                        id="txtName"
                                        value={values.ShortName}
                                        type="text"
                                        disabled={(subPageMode === url.PARTY_SELF_EDIT) && true}
                                        className={isError.ShortName.length > 0 ? "is-invalid form-control" : "form-control"}
                                        placeholder="Please Enter ShortName"
                                        autoComplete='off'
                                        autoFocus={true}
                                        onChange={(event) => {
                                            onChangeText({ event, state, setState })
                                            dispatch(Breadcrumb_inputName(event.target.value))
                                        }}
                                    />
                                    {isError.ShortName.length > 0 && (
                                        <span className="invalid-feedback">{isError.ShortName}</span>
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
                            {(!(subPageMode === url.RETAILER_MASTER || subPageMode === url.FRANCHISE_CUSTOMER_MASTER)) && // SAPPartyCode   show only (Party Master) mode
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
                            {(!(subPageMode === url.RETAILER_MASTER || subPageMode === url.FRANCHISE_CUSTOMER_MASTER)) &&  // Distance   show only (Party Master) mode
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
                                                isDisabled={(subPageMode === url.PARTY_SELF_EDIT || partyTypeDisabled) && true}
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
                                    <Label>{fieldLabel.PriceList} </Label>
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
                                    {/* {(isError.PriceList.length > 0 && (priceListSelect.value === "" || priceListSelect.label === "")) && (
                                        <span className="text-danger f-8"><small>{isError.PriceList}</small></span>
                                    )} */}
                                </FormGroup>

                            </Col>
                            <Col md="1">  </Col>

                            {!(subPageMode === url.RETAILER_MASTER) &&// SUPLIER dropdown  show only (Party Master) mode
                                < Col md="3">
                                    <FormGroup className="mb-3">
                                        <Label> {fieldLabel.Supplier} </Label>
                                        <Col sm={12}>
                                            <Select
                                                id="supplierName"
                                                name="Supplier"
                                                value={values.Supplier}
                                                isDisabled={(subPageMode === url.PARTY_SELF_EDIT || supplierDisabled) && true}
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
                            <Col md="1" className=" mt-3">
                                <Button
                                    className=" p-1 mt-3 "
                                    color="btn btn-outline-primary border-2 font-size-12 "
                                    type="button"
                                    onClick={GSTINverifyhandler}
                                > Verify GSTIN
                                </Button>
                            </Col>

                            {subPageMode === url.PARTY && <Col md="3">
                                <FormGroup className="mb-3">
                                    <Label> {fieldLabel.CountryName} </Label>
                                    <C_Select
                                        name="CountryName"
                                        value={values.CountryName}
                                        isLoading={countryListloading}
                                        isSearchable={true}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        options={CountryListOptions}
                                        onChange={(hasSelect, evn) => {
                                            onChangeSelect({ hasSelect, evn, state, setState });
                                        }}
                                    />
                                    {/* {isError.CountryName.length > 0 && (
                                        <span className="text-danger f-8"><small>{isError.CountryName}</small></span>
                                    )} */}
                                </FormGroup>
                            </Col>}


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
                                        <C_Select
                                            name="District"
                                            value={values.District}
                                            isDisabled={(subPageMode === url.PARTY_SELF_EDIT) && true}
                                            isSearchable={true}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            isLoading={districtDropDownLoading}
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
                                    <C_Select
                                        name="CityName"
                                        id="CityName"
                                        value={values.CityName}
                                        isDisabled={(subPageMode === url.PARTY_SELF_EDIT) && true}
                                        isSearchable={true}
                                        classNamePrefix="dropdown"
                                        isLoading={cityDropDownLoading}
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
                            {subPageMode === url.RETAILER_MASTER &&

                                <Col md="3">
                                    <FormGroup className="mb-3">
                                        <Label htmlFor="validationCustom01">{fieldLabel.Route} </Label>
                                        <Select
                                            name="Route"
                                            id="Route"
                                            value={values.Route}
                                            isSearchable={true}
                                            classNamePrefix="dropdown"
                                            options={RouteName_Options}
                                            onChange={(hasSelect, evn) => {
                                                onChangeSelect({ hasSelect, evn, state, setState, })
                                            }}
                                        />
                                        {isError.Route.length > 0 && (
                                            <span className="text-danger f-8"><small>{isError.Route}</small></span>
                                        )}
                                    </FormGroup>
                                </Col>
                            }
                            {subPageMode === url.RETAILER_MASTER &&
                                <Col md="1"> </Col>}

                            <Col md="3">
                                <FormGroup className="mb-3">
                                    <Label>{fieldLabel.Latitude} </Label>
                                    <Input
                                        name="Latitude"
                                        value={values.Latitude}
                                        type="text"
                                        className={isError.Latitude.length > 0 ? "is-invalid form-control" : "form-control"}
                                        placeholder="Please Enter Latitude"
                                        autoComplete='off'
                                        onChange={(event) => {
                                            onChangeText({ event, state, setState })
                                        }}
                                    />
                                    {isError.Latitude.length > 0 && (
                                        <span className="invalid-feedback">{isError.Latitude}</span>
                                    )}
                                </FormGroup>
                            </Col>


                            <Col md="1"> </Col>


                            <Col md="3">
                                <FormGroup className="mb-3">
                                    <Label>{fieldLabel.Longitude} </Label>
                                    <Input
                                        name="Longitude"
                                        value={values.Longitude}
                                        type="text"
                                        className={isError.Longitude.length > 0 ? "is-invalid form-control" : "form-control"}
                                        placeholder="Please Enter Longitude"
                                        autoComplete='off'
                                        onChange={(event) => {
                                            onChangeText({ event, state, setState })
                                        }}
                                    />
                                    {isError.Longitude.length > 0 && (
                                        <span className="invalid-feedback">{isError.Longitude}</span>
                                    )}
                                </FormGroup>
                            </Col>


                            <Col md="1"> </Col>

                            <Col md="3">
                                <FormGroup className="mb-3">
                                    <Row style={{ marginTop: '25px' }}>
                                        <Label
                                            className="col-sm-4 col-form-label">
                                            {fieldLabel.isActive}
                                        </Label>
                                        <Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">
                                            <div className="form-check form-switch form-switch-md mb-3">
                                                <Input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={values.isActive}
                                                    disabled={(subPageMode === url.PARTY_SELF_EDIT) && true}
                                                    name="isActive"
                                                    onChange={(event) => onChangeCheckbox({ event, state, setState })}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </FormGroup>
                            </Col>

                            {(!(subPageMode === url.RETAILER_MASTER || subPageMode === url.FRANCHISE_CUSTOMER_MASTER)) &&
                                <Col md="3">
                                    <FormGroup className="mb-3">
                                        <Label htmlFor="validationCustom01">{fieldLabel.Cluster} </Label>
                                        <C_Select
                                            name="Cluster"
                                            id="Cluster"
                                            value={values.Cluster}
                                            isDisabled={values.PartyType.value === 11}
                                            isSearchable={true}
                                            classNamePrefix="dropdown"
                                            options={Cluster_Options}
                                            onChange={(hasSelect, evn) => {
                                                onChangeSelect({ hasSelect, evn, state, setState, })
                                                getSubCluster({ Select: hasSelect })
                                            }}
                                        />
                                        {isError.Cluster.length > 0 && (
                                            <span className="text-danger f-8"><small>{isError.Cluster}</small></span>
                                        )}
                                    </FormGroup>
                                </Col>}


                            <Col md="1"> </Col>

                            {
                                (!(subPageMode === url.RETAILER_MASTER || subPageMode === url.FRANCHISE_CUSTOMER_MASTER)) &&
                                <Col md="3">
                                    <FormGroup className="mb-3">
                                        <Label htmlFor="validationCustom01">{fieldLabel.SubCluster} </Label>
                                        <C_Select
                                            name="SubCluster"
                                            id="SubCluster"
                                            value={values.SubCluster}
                                            isDisabled={values.PartyType.value === 11}
                                            isSearchable={true}
                                            classNamePrefix="dropdown"
                                            options={SubClusterOptions
                                            }
                                            onChange={(hasSelect, evn) => {
                                                onChangeSelect({ hasSelect, evn, state, setState, })
                                            }}
                                        />
                                        {isError.SubCluster.length > 0 && (
                                            <span className="text-danger f-8"><small>{isError.SubCluster}</small></span>
                                        )}
                                    </FormGroup>
                                </Col>
                            }
                        </Row>
                    </CardBody>
                </Card>
            </Row>
        </div >
    )
    return FirstTab
})

export default BaseTabForm



