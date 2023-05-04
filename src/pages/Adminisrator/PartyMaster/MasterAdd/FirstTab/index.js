import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import Select from "react-select"
import { useDispatch, useSelector } from 'react-redux'
import { Card, Col, FormGroup, Input, Label, Row } from 'reactstrap'
import { comAddPageFieldFunc, initialFiledFunc, onChangeSelect, onChangeText } from '../../../../../components/Common/validationFunction'
import { Breadcrumb_inputName } from '../../../../../store/actions'
import { getDistrictOnState } from '../../../../../store/Administrator/PartyRedux/action'
import { priceListByPartyAction } from '../../../../../store/Administrator/PriceList/action'
import Tree from '../Tree'
import '../Tree.scss'


const BaseTabForm = forwardRef((props, ref) => {

    const dispatch = useDispatch();
    const fileds = {
        Name: "",
        MobileNo: "",
        PriceList: "",
        PartyType: "",
        SAPPartyCode: "",
        Supplier: [],
        PAN: "",
        Email: "",
        AlternateContactNo: "",
        State: "",
        District: "",
        GSTIN: "",
        MkUpMkDn: false,
        isActive: true,

    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [priceListSelect, setPriceListSelect] = useState({ value: '' });

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
        State,
        DistrictOnState,
        PartyTypes,
        priceListByPartyType,
        SupplierRedux,
        pageField,
    } = useSelector((state) => ({
        State: state.EmployeesReducer.State,
        DistrictOnState: state.PartyMasterReducer.DistrictOnState,
        PartyTypes: state.PartyTypeReducer.ListData,
        priceListByPartyType: state.PriceListReducer.priceListByPartyType,
        SupplierRedux: state.CommonAPI_Reducer.SSDD_List,
        pageField: state.CommonPageFieldReducer.pageField
    }));

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
                a.hasValid.valid = true
            })
            dispatch(priceListByPartyAction(PartyTypes[0].id))
        }
    }, [PartyTypes])
    const PartyTypeDropdown_Options = PartyTypes.map((index) => ({
        value: index.id,
        label: index.Name,
        division: index.IsDivision
    }));

    const StateValues = State.map((index) => ({
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

    function handllerState(e) {
        // setState_DropDown_select(e)
        dispatch(getDistrictOnState(e.value))
        // setDistrict_dropdown_Select('')
    }

    function partyTypeOnChange(hasSelect, evn) {
        onChangeSelect({ hasSelect, evn, state, setState })
        setPriceListSelect({ label: '' })
        dispatch(priceListByPartyAction(hasSelect.value))
    }

    const onclickselect = function () {
       
        const hasNone = document.getElementById("price-drop").style;
        if ((priceListByPartyType.length > 0)) {
            if ((hasNone.display === "none")) {
                hasNone.display = "block";
            } else {
                hasNone.display = "none";
            }
        }
    };
    const test1 = () => {

        return (
            <>
                <div id="price-drop" style={{ display: "none" }}  >
                    <div style={{ width: "20cm", marginBottom: "-60px" }} >

                        <Tree id="tree" data={priceListByPartyType} priceList={priceListSelect}
                            func1={setPriceListSelect} />
                    </div>
                </div>

            </>
        )
    }
    const FirstTab = (
        <div>
            <Row>
                <Card className="text-black" style={{ backgroundColor: "whitesmoke" }} >

                    <Row className="mt-3 ">
                        <Col md="3">
                            <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom01">{fieldLabel.Name} </Label>
                                <Input
                                    name="Name"
                                    id="txtName"
                                    value={values.Name}
                                    type="text"
                                    className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
                                    placeholder="Please Enter Name"
                                    autoComplete='off'
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
                                <Label htmlFor="validationCustom01">{fieldLabel.MobileNo} </Label>
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
                                <Label htmlFor="validationCustom01">{fieldLabel.AlternateContactNo}</Label>
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
                                <Label htmlFor="validationCustom01">{fieldLabel.Email} </Label>
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
                        <Col md="3">
                            <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom01">{fieldLabel.SAPPartyCode} </Label>
                                <Input
                                    name="SAPPartyCode"
                                    value={values.SAPPartyCode}
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
                    </Row>
                </Card>
            </Row>
            <Row>
                <Card className=" text-black mt-n2" style={{ backgroundColor: "whitesmoke" }} >
                    <Row className="mt-3 ">
                        <Col md="3">
                            <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom01"> {fieldLabel.PartyType}</Label>
                                <Col sm={12}>
                                    <Select
                                        name="PartyType"
                                        value={values.PartyType}
                                        isSearchable={true}
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

                        <Col md="1">  </Col>
                        <Col md="3">
                            <FormGroup>
                                <Label htmlFor="validationCustom01">Price List </Label>
                                <Input
                                    value={priceListSelect.label}
                                    autoComplete={"off"}
                                    placeholder="Select..."
                                    onClick={onclickselect}
                                >
                                </Input>
                                {test1()}
                            </FormGroup>
                        </Col>
                        <Col md="1">  </Col>

                        <Col md="3">
                            <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom01"> {fieldLabel.Supplier} </Label>
                                <Col sm={12}>
                                    <Select
                                        name="Supplier"
                                        value={values.Supplier}
                                        isSearchable={false}
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
                    </Row>

                    <Row>
                        <Col md="3">
                            <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom01">{fieldLabel.PAN} </Label>
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
                                <Label htmlFor="validationCustom01"> {fieldLabel.GSTIN} </Label>
                                <Input
                                    name="GSTIN"
                                    value={values.GSTIN}
                                    type="text"
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
                                        htmlFor="horizontal-firstname-input"
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
                                                onChange={(event) => onChangeText({ event, state, setState })}
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
                                <Label htmlFor="validationCustom01"> {fieldLabel.State} </Label>
                                <Col sm={12}>
                                    <Select
                                        name="State"
                                        value={values.State}
                                        isSearchable={true}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        options={StateValues}
                                        onChange={(hasSelect, evn) => {
                                            handllerState(hasSelect)
                                            onChangeSelect({ hasSelect, evn, state, setState })
                                        }}
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
                                <Label htmlFor="validationCustom01"> {fieldLabel.District} </Label>
                                <Col sm={12}>
                                    <Select
                                        name="District"
                                        value={values.District}
                                        isSearchable={true}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        options={DistrictOnStateValues}
                                        onChange={(hasSelect, evn) => {
                                            onChangeSelect({ hasSelect, evn, state, setState })
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
                                <Row style={{ marginTop: '25px' }}>
                                    <Label
                                        htmlFor="horizontal-firstname-input"
                                        className="col-sm-4 col-form-label">
                                        {fieldLabel.isActive}
                                    </Label>
                                    <Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">
                                        <div className="form-check form-switch form-switch-md mb-3">
                                            <Input type="checkbox" className="form-check-input"
                                                checked={values.isActive}
                                                name="isActive"
                                                onChange={(event) => onChangeText({ event, state, setState })}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Col>


                    </Row>
                </Card>
            </Row>
        </div>
    )
    return FirstTab
    // return [FirstTab, state, setState]
})

export default BaseTabForm



