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

function ItemTab(props) {

    const dispatch = useDispatch();
    const [contentItemSelect, setContentItemSelect] = useState('');
    const [Quantity, setQuantity] = useState('');
    const [unitSelect, setUnitSelect] = useState('');
    const [ItemUnitOptions, setItemUnitOptions] = useState([]);

    const { Items } = useSelector((state) => ({
        Items: state.ItemMastersReducer.pages,
    }));

    useEffect(() => {
        dispatch(getItemList())
        dispatch(getBaseUnit_ForDropDown());
    }, [dispatch]);

    const ItemDropdown_Options = Items.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    function ContentItem_Handler(e) {
        setUnitSelect('')
        setContentItemSelect(e)
        let Item = Items.filter((index) => {
            return index.id === e.value
        })
        let ItemUnits = Item[0].UnitDetails.map((data) => ({
            value: data.UnitID,
            label: data.UnitName
        }))
        setItemUnitOptions(ItemUnits)

    }

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
            <Col  >
                <div className="px-2  mb-1 c_card_body text-black mt-1" style={{ width: "100%" }}>
                    <Row >
                        <Col sm={3}>
                            <FormGroup className='mt-2 mb-2'>
                                <Label >Content Item</Label>
                                <Col sm={8} >
                                    <Select
                                        value={contentItemSelect}
                                        options={ItemDropdown_Options}
                                        onChange={ContentItem_Handler}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col sm={3} >

                            <FormGroup className='mt-2 mb-2' >
                                <Label >Item Quantity</Label>
                                <Col sm={8} >
                                    <Input
                                        // style={{ textAlign: "right" }}
                                        type="text"
                                        className='text-end'
                                        value={Quantity}
                                        placeholder="Please Enter Quantity"
                                        autoComplete="off"
                                        onChange={handleChange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col sm={4}>
                            <FormGroup className='mt-2 mb-2'>
                                <Label >Unit</Label>
                                <Col sm={7}>
                                    <Select
                                        value={unitSelect}
                                        options={ItemUnitOptions}
                                        onChange={Unit_Handler}
                                    />
                                </Col>
                            </FormGroup>
                        </Col >

                        <Col md={1}>
                            <Row className=" mt-4">
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
