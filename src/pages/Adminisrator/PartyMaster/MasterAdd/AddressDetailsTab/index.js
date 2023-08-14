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
import { C_DatePicker } from '../../../../../CustomValidateForm';

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

    const addRowsHandler = (e) => {
        e.preventDefault();

        try {
            const isvalid = formValid(state, setState)
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
                        ele.IsDefault = false
                    });
                }
                const tableleth = addressTable.length;
                val.RowId = tableleth + 1;
                const updatedTableData = [...addressTable];
                updatedTableData.push(val);
                setAddressTable(updatedTableData)
                setState(resetFunction(fileds, state))// Clear form values 
            }
        } catch (error) { }
    }

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

                        <Col md={1}>
                            <Row className=" mt-3">
                                <Col >
                                    <Button
                                        className="button_add badge badge-soft-primary font-size-12 waves-effect  waves-light  btn-outline-primary  "
                                        type="button"
                                        onClick={addRowsHandler}
                                    >
                                        <i className="dripicons-plus mt-3"> </i>
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
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
                                <Input
                                    name="PIN"
                                    value={values.PIN}
                                    type="text"
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
                <AddressDetailsTable addressTable={addressTable} setAddressTable={setAddressTable} />
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
