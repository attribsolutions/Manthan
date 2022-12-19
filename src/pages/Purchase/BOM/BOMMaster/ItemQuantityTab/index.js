import React, { useEffect, useState } from 'react';
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
import Select from "react-select";
import { getBaseUnit_ForDropDown, getItemList } from '../../../../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import BOMTable from './Table';
import { GetItemUnitsDrodownAPI } from '../../../../../store/Purchase/BOMRedux/action';

function ItemTab(props) {
    const dispatch = useDispatch();
    const [contentItemSelect, setContentItemSelect] = useState('');
    const [Quantity, setQuantity] = useState('');
    const [unitSelect, setUnitSelect] = useState('');
    const { Items, GetItemUnits } = useSelector((state) => ({
        Items: state.ItemMastersReducer.pages,
        GetItemUnits: state.BOMReducer.GetItemUnits,
    }));

    useEffect(() => {
        dispatch(getItemList())
        dispatch(getBaseUnit_ForDropDown());
    }, [dispatch]);
    const ItemDropdown_Options = Items.map((index) => ({
        value: index.id,
        label: index.Name,
    }));
    const Unit_DropdownOptions = GetItemUnits.map((data) => ({
        value: data.value,
        label: data.label
    }));

    const ContentItem_Handler = (event) => {
        const jsonBody = JSON.stringify({
            Item: event.value,
        });
        dispatch(GetItemUnitsDrodownAPI(jsonBody))
        setContentItemSelect(event);
        setUnitSelect('')
    };
    const Unit_Handler = (event) => {
        setUnitSelect(event);
    };
    const addRowsHandler = (data) => {
        const val = {
            Item: contentItemSelect === "" ? "" : contentItemSelect.value,
            ItemName: contentItemSelect.label,
            Unit: unitSelect === "" ? "" : unitSelect.value,
            UnitName: unitSelect.label,
            Quantity: Quantity,
        };

        if (!(contentItemSelect === "")
            && !(unitSelect === "")
            && !(Quantity === "")
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
        setContentItemSelect('');
        setQuantity('');
        setUnitSelect('');
    };

    const handleChange = event => {
        const result = event.target.value.replace(/\D/g, '');
        setQuantity(result);
    };
    return (
        <Row>
            <Col md={12}  >
                <div className="px-2  mb-1 c_card_body text-black mt-1" style={{ width: "100%" }}>
                    <Row>
                        <FormGroup className="mb-3 col col-sm-3 ">
                            <Label>Content Item</Label>
                            <Select
                                value={contentItemSelect}
                                options={ItemDropdown_Options}
                                onChange={ContentItem_Handler}
                            />
                        </FormGroup>
                        <FormGroup className="mb-3 col col-sm-3 " >
                            <Label >Item Quantity</Label>
                            <Input
                                style={{ textAlign: "right" }}
                                type="text"
                                value={Quantity}
                                placeholder="Please Enter Quantity" 
                                autoComplete="off"
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup className="mb-3 col col-sm-3 ">
                            <Label>Unit</Label>
                            <Select
                                value={unitSelect}
                                options={Unit_DropdownOptions}
                                onChange={Unit_Handler}
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
                </div>
                <Row>
                    <BOMTable tableData={props.tableData} func={props.func} />
                </Row>
            </Col>
        </Row>
    );
}
export default ItemTab;
