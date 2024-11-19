import React, { useMemo, useState } from 'react';
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import Select from "react-select";
import { useSelector } from 'react-redux';
import MarginTable from './Table';
import { loginUserID, loginCompanyID } from '../../../../../components/Common/CommonFunction';
import { customAlert } from '../../../../../CustomAlert/ConfirmDialog';
import { C_DatePicker, C_Select } from '../../../../../CustomValidateForm';
import { alertMessages } from '../../../../../components/Common/CommonErrorMsg/alertMsg';

function Margin_Tab(props) {

    const [priceList, setPriceList] = useState('');
    const [partyName, setPartyName] = useState('');
    const [effectiveDate, setEffectiveDate] = useState('');
    const [margin, setMargin] = useState('');

    const {
        Party,
        partyApiLoading,
        PriceList
    } = useSelector((state) => ({
        Party: state.ItemMastersReducer.Party,
        partyApiLoading: state.ItemMastersReducer.partyApiLoading,
        PriceList: state.PriceListReducer.priceListByCompany,
    }));

    const Party_DropdownOptions = useMemo(() => Party.map((data) => ({
        value: data.id,
        label: data.Name
    })), [Party])


    const PriceList_DropdownOptions = useMemo(() => PriceList.map((data) => ({
        value: data.id,
        label: data.Name
    })), [PriceList])

    const PriceListHandler = (event) => {
        setPriceList(event)
    }

    const EffectiveDateHandler = (e, date) => {
        setEffectiveDate(date)
    }

    const PartyNameHandler = (event) => {
        setPartyName(event)
    }

    const MarginHandler = (event) => {
        setMargin(event.target.value)
    }


    const addRowsHandler = (data) => {

        const val = {
            PriceList: priceList.value,
            PriceListName: priceList.label,
            PartyName: partyName.label,
            Party: partyName === "" ? "" : partyName.value,
            EffectiveDate: effectiveDate,
            Margin: margin,
            CreatedBy: loginUserID(),
            UpdatedBy: loginUserID(),
            Company: loginCompanyID(),
            CommonID: 0,
            IsDeleted: 0,
            IsAdd: true
        };

        if (!(priceList === "")
            && !(margin === "")
            && !(effectiveDate === "")
        ) {
            let highestId = -Infinity;
            for (const item of props.tableData) {
                if (item.id !== undefined && item.id > highestId) {
                    highestId = item.id;
                }
            }
            val.id = highestId + 1;
            const updatedTableData = [...props.tableData];
            updatedTableData.push(val);
            props.func(updatedTableData)
            clearState();

        }
        else { customAlert({ Type: 4, Message: alertMessages.enterValue }) }
    };

    const clearState = () => {
        setPriceList('');
        setPartyName('');
        setEffectiveDate('');
        setMargin('');
    };

    return (
        <Row>
            <Col md={12}  >
                <Card className="text-black">
                    <CardBody className='c_card_body'>
                        <Row className="mt-3">
                            <Col className=" col col-11 ">
                                <Row>
                                    <FormGroup className=" col col-sm-3 " >
                                        <Label >Price List</Label>
                                        <Select
                                            id={`dropPriceList-${0}`}
                                            value={priceList}
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                            options={PriceList_DropdownOptions}
                                            onChange={PriceListHandler}
                                        />
                                    </FormGroup>

                                    <FormGroup className="mb-3 col col-sm-3 " >
                                        <Label >Party Name</Label>
                                        <C_Select
                                            id={`dropPartyName-${0}`}
                                            value={partyName}
                                            isLoading={partyApiLoading}
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                            options={Party_DropdownOptions}
                                            onChange={PartyNameHandler}
                                        />
                                    </FormGroup>

                                    <FormGroup className="mb-3 col col-sm-3 ">
                                        <Label>Effective Date</Label>
                                        <div id={`txtEffectiveDate${0}`} >
                                            <C_DatePicker
                                                id={`txtEffectiveDate${0}`}
                                                value={effectiveDate}
                                                placeholder="Please Enter EffectiveDate"
                                                onChange={EffectiveDateHandler}
                                                options={{
                                                    altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                }}
                                            />
                                        </div>
                                    </FormGroup>

                                    <FormGroup className="mb-3 col col-sm-3 " >
                                        <Label >Margin (%)</Label>
                                        <Input
                                            type="text"
                                            id={`txtMargin${0}`}
                                            value={margin}
                                            placeholder="Please Enter Margin"
                                            autoComplete="off"
                                            onChange={MarginHandler}
                                        />
                                    </FormGroup>

                                </Row>
                            </Col>
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
                    <MarginTable tableData={props.tableData} func={props.func} />
                </Row>
            </Col>
        </Row>
    );
}

export default React.memo(Margin_Tab);


