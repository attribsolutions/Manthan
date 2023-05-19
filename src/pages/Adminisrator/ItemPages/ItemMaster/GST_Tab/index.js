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
import GSTTable from './Table';
import { loginUserID, loginCompanyID } from '../../../../../components/Common/CommonFunction';
import { customAlert } from '../../../../../CustomAlert/ConfirmDialog';
import { C_DatePicker } from '../../../../../CustomValidateForm';

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
            CreatedBy: loginUserID(),
            UpdatedBy: loginUserID(),
            Company: loginCompanyID(),
            CommonID: 0,
            IsDeleted: 0,
            IsAdd: true,
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
            customAlert({ Type: 4, Message: "Please Enter value" })
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
                    <CardBody className='c_card_body'>
                        <Row>

                            <FormGroup className="mb-3 col col-sm-3 ">
                                <Label>Effective Date</Label>
                                <div id={`txtEffectiveDate${0}`} >
                                    <C_DatePicker
                                        id={`txtEffectiveDate${0}`}
                                        name="FSSAIExipry"
                                        placeholder = "Please Enter EffectiveDate"
                                        value={effectiveDate}
                                        required={true}
                                        onChange={EffectiveDateHandler}
                                    />
                                </div>
                            </FormGroup>

                            <FormGroup className="mb-3 col col-sm-3 " >
                                <Label >GST</Label>
                                <Input type="text"
                                    id={`txtGST${0}`}
                                    value={GST}
                                    placeholder="Please Enter GST"
                                    autoComplete="off"
                                    onChange={(event) => setGST(event.target.value)}
                                />

                            </FormGroup>

                            <FormGroup className="mb-3 col col-sm-3 " >
                                <Label >HSNCode</Label>
                                <Input type="text"
                                    id={`txtHSNCode${0}`}
                                    value={HSNCode}
                                    placeholder="Please Enter HSNCode"
                                    autoComplete="off"
                                    onChange={(event) => setHSNCode(event.target.value)}
                                />

                            </FormGroup>
                            <Col md={1}>

                                <Row className=" mt-3">
                                    <Col >
                                        <Button
                                              className=" button_add"
                                              color="btn btn-outline-primary border-2 font-size-12"
                                            type="button"
                                            onClick={addRowsHandler}
                                        >
                                            <i className="dripicons-plus mt-3"> </i>
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
