import React, { useState } from 'react';
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import Flatpickr from "react-flatpickr"
import AddressDetailsTable from './Table';
import { AvField, AvInput } from 'availity-reactstrap-validation';
import { AlertState } from '../../../../store/actions';
import { useDispatch } from 'react-redux';

function AddressDetails_Tab(props) {


    const [address, setAddress] = useState('');
    const [FSSAINo, setFSSAINo] = useState('');
    const [FSSAIExipry, setFSSAIExipry] = useState('');
    const [PIN, setPIN] = useState('');
    const [IsDefault, setIsDefault] = useState(true);
    const [imageTable, setImageTable] = useState('');


    const FSSAIExipryHandler = (e, date) => {
        setFSSAIExipry(date)
    }

    const FSSAINoHandler = (event) => {
        setFSSAINo(event.target.value)
    }

    const AddressHandler = (event) => {
        setAddress(event.target.value)
    }

    const IsDefaultHandler = (event) => {
        setIsDefault(event.target.checked)
    }

    const addRowsHandler = (data) => {

        const invalidMsg1 = []

        if ((address === "")) {
            invalidMsg1.push(`Address Is Required`)
        }
        if (FSSAINo === "") {
            invalidMsg1.push(`FSSAINo Is Required`)
        };
        if ((FSSAIExipry === "")) {
            invalidMsg1.push(`FSSAIExipry Is Required`)
        };
        if ((PIN === "")) {
            invalidMsg1.push(`PIN Is Required`)
        };
        // if ((address === "") || (FSSAINo === "") || (FSSAIExipry === "") || (PIN === "")) {
        //     dispatch(
        //         AlertState({
        //             Type: 4,
        //             Status: true,
        //             Message: JSON.stringify(invalidMsg1),
        //             RedirectPath: false,
        //             PermissionAction: false,
        //         })
        //     );
        //     return;
        // }

        const val = {
            Address: address,
            FSSAINo: FSSAINo,
            FSSAIExipry: FSSAIExipry,
            PIN: PIN,
            IsDefault: IsDefault,
            fssaidocument: imageTable
        };
        if (IsDefault) {
            props.tableData.forEach(ele => {
                ele.IsDefault = false
            });
        }
        const tableleth = props.tableData.length;
        val.id = tableleth + 1;
        const updatedTableData = [...props.tableData];
        updatedTableData.push(val);
        props.func(updatedTableData)
        clearState();
    }

    const clearState = () => {
        
        setAddress('');
        setFSSAIExipry('');
        setFSSAINo('');
        setIsDefault(false);
        setPIN('');
        setImageTable('')
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

    const handleChange = event => {
        let val = event.target.value
        const result = /^-?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)$/.test(val);
        if (result) {
            setPIN(val);
        }
        else if (val === "") {
            setPIN(val)
        }
        else {
            event.target.value = ""
        }
    };

    return (
        <Row>
            {/* <div className='abc1'> */}
            {/* < img id='add-img' src="https://images.pexels.com/photos/1563355/pexels-photo-1563355.jpeg?auto=compress&cs=tinysrgb&w=600" /> */}
            {/* </div> */}
            <Col md={12}  >
                <Card className="text-black" style={{ backgroundColor: "whitesmoke" }}>
                    <CardBody >
                        <Row >
                            <Col md="9" >
                                <FormGroup className="mb-3">
                                    <Label htmlFor="validationCustom01">Address </Label>
                                    <AvField name="Address" value={address} type="text"
                                        placeholder=" Please Enter Address "
                                        autoComplete='off'
                                        // validate={{
                                        //     required: { value: true, errorMessage: 'Please Enter your Address' },
                                        // }}
                                        onChange={AddressHandler}
                                    />
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
                            {/* <Col md="4"></Col> */}
                            <Col md="4">
                                <FormGroup className="mb-3">
                                    <Label htmlFor="validationCustom01">
                                        FSSAI No </Label>
                                    <AvField
                                        name="FSSAINo"
                                        value={FSSAINo}
                                        placeholder="Please Enter FSSAINo"
                                        autoComplete='off'
                                        type="text"
                                        errorMessage="Please Enter FSSAI Number."
                                        className="form-control"
                                        // validate={{
                                        //     required: { value: true },
                                        //     tel: {
                                        //         pattern: /^(?:\d[- ]*){14}$/,
                                        //         errorMessage: 'FSSAINo Should be Fourteen Digit Only.'
                                        //     }
                                        // }}
                                        onChange={FSSAINoHandler}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="1">

                            </Col>
                            <Col md="4">
                                <FormGroup className="mb-3">
                                    <Label htmlFor="validationCustom01">FSSAI Exipry </Label>
                                    <Flatpickr
                                        id="FSSAIExipry"
                                        name="FSSAIExipry"
                                        value={FSSAIExipry}
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder=" Please Enter FSSAI Exipry"
                                        autoComplete='off'
                                        options={{
                                            altInput: true,
                                            altFormat: "F j, Y",
                                            dateFormat: "Y-m-d"
                                        }}
                                        onChange={FSSAIExipryHandler}
                                    />
                                </FormGroup>

                            </Col>

                            <Col md="1">

                            </Col>
                            <Row className='col col-12'>
                                <Col md="4">
                                    <FormGroup >
                                        <Label> PIN </Label>
                                        <Input name="PIN" type="text"
                                            value={PIN}
                                            placeholder=" PIN No. "
                                            autoComplete='off'
                                            // validate={{
                                            //     required: { value: true, errorMessage: 'Please Enter your PIN No.' },
                                            //     tel: {
                                            //         pattern: "^[1-9][0-9]{5}$",
                                            //         errorMessage: 'PIN Should be Six Digit Only.'
                                            //     }
                                            // }
                                            // }
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                </Col>

                                <Col md="1">  </Col>

                                <Col md="4" >
                                    <FormGroup >
                                        <Label >FSSI Document</Label>
                                        <Input type="file"
                                            className="form-control "
                                            // value={FileName}
                                            name="image"
                                            id="file"
                                            accept=".jpg, .jpeg, .png ,.pdf"
                                            onChange={(event) => { onchangeHandler(event) }}
                                        />
                                    </FormGroup>
                                </Col>

                                <Col md="1">  </Col>
                                <FormGroup className="col col-sm-4 mt-4">
                                    <Row className="justify-content-md-left">
                                        <Label htmlFor="horizontal-firstname-input" className="col-sm-4 col-form-label" >IsDefault </Label>
                                        <Col md={3} style={{ marginTop: '9px' }} >
                                            <div className="form-check form-switch form-switch-md " dir="ltr">
                                                <AvInput type="checkbox"
                                                    id="IsDefault"
                                                    className="form-check-input"
                                                    checked={IsDefault}
                                                    name="IsDefault"
                                                    onChange={IsDefaultHandler}
                                                />
                                                <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                            </div>
                                        </Col>
                                    </Row>
                                </FormGroup>

                            </Row>
                        </Row>


                        {/* <div className='abc1'> */}
                        {/* </div> */}


                    </CardBody>
                </Card>
                <Row>
                    <AddressDetailsTable tableData={props.tableData} func={props.func} />
                </Row>
            </Col>
            {/*            
            <div id="myModal" class="modal">
                <span class="close">&times;</span>
                <img class="modal-content" id="img01"/>
                <div id="caption"></div>
            </div> */}

        </Row>
    );
}

export default AddressDetails_Tab;
