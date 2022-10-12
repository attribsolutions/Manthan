import React, { useState } from 'react';
import {
    Button,
    Card,
    CardBody,
    Col,
    FormGroup,
    Input,
    Label,
    Row
} from 'reactstrap';
import Flatpickr from "react-flatpickr"
import GSTTable from './Table';

function GSTTab(props) {

    const [effectiveDate, setEffectiveDate] = useState('');
    const [GST, setGST] = useState('');
    const [HSNCode, setHSNCode] = useState('');

    const EffectiveDateHandler = (e, date) => {
        setEffectiveDate(date)
    }

    const addRowsHandler = (data) => {
        const val = {
            GSTPercentage: GST,
            HSNCode: HSNCode,
            EffectiveDate: effectiveDate,
            CreatedBy: 1,
            UpdatedBy: 1,
            Company: 1,
            IsAdd:true
        };

        if (!(GST === "")
            && !(HSNCode === "")
            && !(effectiveDate === "")
        ) {
            const totalTableData = props.tableData.length;
            val.id = totalTableData + 1;
            const updatedTableData = [...props.tableData];
            updatedTableData.push(val);
            props.func(updatedTableData)
            clearState();

        }
        else {
            alert("Please Enter value")
        }
    };
    const clearState = () => {
        setGST('');
        setHSNCode('');
        setEffectiveDate('');
    };

    return (

        <Row>
            <Col md={12}  >
                <Card className="text-black">
                    <CardBody style={{ backgroundColor: "whitesmoke" }}>
                        <Row>

                            <FormGroup className="mb-3 col col-sm-3 ">
                                <Label>Effective Date</Label>
                                <div id={`txtEffectiveDate${0}`} >
                                    <Flatpickr
                                        id={`txtEffectiveDate${0}`}
                                        name="FSSAIExipry"
                                        value={effectiveDate}
                                        required={true}
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="YYYY-MM-DD"
                                        autoComplete='off'
                                        options={{
                                            altInput: true,
                                            altFormat: "F j, Y",
                                            dateFormat: "Y-m-d"
                                        }}
                                        onChange={EffectiveDateHandler}
                                    />
                                </div>
                            </FormGroup>

                            <FormGroup className="mb-3 col col-sm-3 " >
                                <Label >GST</Label>
                                <Input type="text"
                                    id={`txtGST${0}`}
                                    value={GST}
                                    placeholder="Please Enter Margin"
                                    onChange={(event) => setGST(event.target.value)}
                                />

                            </FormGroup>

                            <FormGroup className="mb-3 col col-sm-3 " >
                                <Label >HSNCode</Label>
                                <Input type="text"
                                    id={`txtHSNCode${0}`}
                                    value={HSNCode}
                                    placeholder="Please Enter Margin"
                                    onChange={(event) => setHSNCode(event.target.value)}
                                />

                            </FormGroup>
                            <Col md={1}>

                                <Row className=" mt-3">
                                    <Col >
                                        <Button
                                            className="btn btn-sm mt-1 mt-3 btn-light  btn-outline-primary  "
                                            type="button"
                                            onClick={addRowsHandler}
                                        >
                                            <i className="dripicons-plus mt-3"> </i> Add
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <Row>
                    <GSTTable tableData={props.tableData} func={props.func} />
                </Row>
            </Col>
        </Row>
    );
}

export default GSTTab;
