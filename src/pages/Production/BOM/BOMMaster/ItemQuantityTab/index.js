
import React, { useState } from 'react';
import {
    Button,
    Col,
    FormGroup,
    Input,
    Label,
    Row
} from 'reactstrap';
import Select from "react-select";
import { useSelector } from 'react-redux';
import BOMTable from './Table';
import { customAlert } from '../../../../../CustomAlert/ConfirmDialog';
import { alertMessages } from '../../../../../components/Common/CommonErrorMsg/alertMsg';
import { C_Select } from '../../../../../CustomValidateForm';
import * as mode from "../../../../../routes/PageMode";

function ItemTab(props) {

    const [contentItemSelect, setContentItemSelect] = useState('');
    const [Quantity, setQuantity] = useState('');
    const [unitSelect, setUnitSelect] = useState('');
    const [ItemUnitOptions, setItemUnitOptions] = useState([]);

    const { Items, ItemListloading } = useSelector((state) => ({
        Items: state.ItemMastersReducer.ItemList,
        ItemListloading: state.ItemMastersReducer.loading,
    }));
    const ItemDropdown_Options = Items
        .filter(item => item.IsMixItem === 0)
        .map(item => ({
            value: item.id,
            label: item.Name,
        }));


    function ContentItem_Handler(e) {

        setUnitSelect('')
        setContentItemSelect(e)
        let Item = Items.filter((index) => {
            return index.id === e.value
        })
        let ItemUnits = Item[0]?.UnitDetails.map((data) => ({
            value: data.UnitID,
            label: data.UnitName
        }))
        setItemUnitOptions(ItemUnits)
    }

    const Unit_Handler = (event) => {
        setUnitSelect(event);
    };
    const addRowsHandler = () => {
        const invalidMsg1 = []

        if ((contentItemSelect === "")) {
            invalidMsg1.push(alertMessages.contentItemQtyIsReq)
        }
        if (Quantity === "") {
            invalidMsg1.push(alertMessages.itemQtyIsReq)
        };
        if ((unitSelect === "")) {
            invalidMsg1.push(alertMessages.unitIsRequired)
        };

        if ((contentItemSelect === "")
            || (unitSelect === "")
            || (Quantity === "")
        ) {
            customAlert({
                Type: 4,
                Status: true,
                Message: JSON.stringify(invalidMsg1),
                RedirectPath: false,
                PermissionAction: false,
            })

            return;
        }
        const val = {
            Item: contentItemSelect.value,
            ItemName: contentItemSelect.label,
            Unit: unitSelect.value,
            UnitName: unitSelect.label,
            Quantity: Quantity,
        };

        const totalTableData = props.tableData.length;
        val.id = totalTableData + 1;
        const updatedTableData = [...props.tableData];
        updatedTableData.push(val);
        props.func(updatedTableData)
        clearState();

    }
    const clearState = () => {
        setContentItemSelect('');
        setQuantity('');
        setUnitSelect('');
    };

    const handleChange = event => {

        let val = event.target.value
        const result = /^-?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)$/.test(val);
        if (result) {
            setQuantity(val);
        }
        else if (val === "") {
            setQuantity(val)
        }
        else {
            event.target.value = ""
        }
    };


    return (
        <Row>
            <Col  >
                <div className="px-2 c_card_filter header text-black" >
                    <div className=" row  ">
                        <Col sm="4">
                            <FormGroup className="mb-2 row mt-2  ">
                                <Label className="mt-2" style={{ width: "115px" }}>Content Item</Label>
                                <Col sm="7">
                                    <C_Select
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        isDisabled={props.pageMode === mode.view}
                                        value={contentItemSelect}
                                        options={ItemDropdown_Options}
                                        onChange={ContentItem_Handler}
                                        isLoading={ItemListloading}
                                    />

                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm="4">
                            <FormGroup className="mb-2 row mt-2 ">
                                <Label className="mt-2" style={{ width: "115px" }}> Item Quantity </Label>
                                <Col sm={7}>
                                    <Input
                                        type="text"
                                        className='text-end'
                                        disabled={props.pageMode === mode.view}
                                        value={Quantity}
                                        placeholder="Please Enter Quantity"
                                        autoComplete="off"
                                        onChange={handleChange}
                                    />

                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm="4">
                            <FormGroup className="mb-2 row mt-2">
                                <Label className="mt-2" style={{ width: "115px" }} >Unit</Label>
                                <Col sm="7">
                                    <Select
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        isDisabled={props.pageMode === mode.view}
                                        value={unitSelect}
                                        options={ItemUnitOptions}
                                        onChange={Unit_Handler}
                                    />

                                </Col>

                                <Col sm="2" className=" mt-1">
                                    <Button type="button" color="btn btn-outline-primary border-1 font-size-13 text-center"
                                        disabled={props.pageMode === mode.view}
                                        onClick={addRowsHandler}
                                    >Add</Button>
                                </Col>

                            </FormGroup>



                        </Col>


                    </div>
                </div>
                <Row>
                    <BOMTable tableData={props.tableData} func={props.func} pageMode={props.pageMode} />
                </Row>
            </Col>
        </Row>
    );
}
export default ItemTab;

