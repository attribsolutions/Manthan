import React, { useState } from 'react';
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import Flatpickr from "react-flatpickr"
function StudentForm(props) {
    const [GST, setGST] = useState('');
    const [HSNCode, setHSNCode] = useState('');
    const [EffectiveDate, setEffectiveDate] = useState('');

    const transferValue = (event) => {
        event.preventDefault();
        const val = {
            GST,
            HSNCode,
            EffectiveDate
        };
        props.func(val);
        clearState();
    };

    const clearState = () => {
        setGST('');
        setHSNCode('');
        setEffectiveDate('');
    };

    return (

        <Card className="text-black">
            <CardBody style={{ backgroundColor: "whitesmoke" }}>
                <Row>

                    <FormGroup className="mb-3 col col-sm-3 ">
                        <Label>Effective Date</Label>
                        <div id={`txtEffectiveDate${0}`} >
                            <Flatpickr
                                id={`txtEffectiveDate${0}`}
                                // id="EffectiveDate"
                                name="FSSAIExipry"
                                value={EffectiveDate}
                                required={true}
                                // value={DOB_Date_Select}
                                // defaultValue={GStDetailsMaster[0].EffectiveDate}
                                className="form-control d-block p-2 bg-white text-dark"
                                placeholder="YYYY-MM-DD"
                                autoComplete='off'
                                options={{
                                    altInput: true,
                                    altFormat: "F j, Y",
                                    dateFormat: "Y-m-d"
                                }}
                                onChange={(ee, dateStr) => setEffectiveDate(dateStr)}
                            />
                        </div>
                    </FormGroup>

                    <FormGroup className="mb-3 col col-sm-3 " >
                        <Label >GST</Label>
                        <Input type="text"
                            id={`txtGST${0}`}
                            value={GST}
                            // defaultValue={GStDetailsMaster[0].GST}
                            placeholder="Please Enter Margin"
                            onChange={(event) => setGST(event.target.value)}
                        />

                    </FormGroup>

                    <FormGroup className="mb-3 col col-sm-3 " >
                        <Label >HSNCode</Label>
                        <Input type="text"
                            id={`txtHSNCode${0}`}
                            value={HSNCode}
                            // defaultValue={GStDetailsMaster[0].HSNCode}
                            placeholder="Please Enter Margin"
                            onChange={(event) => setHSNCode(event.target.value)}
                        />

                    </FormGroup>
                    {/* <button onClick={transferValue}> <i className="dripicons-plus"></i></button> */}
                    <Col md={1}>

                        <Row className=" mt-3">


                            <Col md={6}>
                                <Button className="btn btn-sm btn-light mt-3   align-items-sm-end"
                                    type="button"
                                    onClick={transferValue}>
                                    <i className="dripicons-plus"></i>
                                </Button>
                            </Col>
                        </Row>


                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
}

export default StudentForm;
