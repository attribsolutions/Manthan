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
import {  getBaseUnit_ForDropDown, getItemList } from '../../../../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import BOMTable from './Table';
import { customAlert } from '../../../../../CustomAlert/ConfirmDialog';

function ItemTab(props) {

    const dispatch = useDispatch();
    const [contentItemSelect, setContentItemSelect] = useState('');
    const [Quantity, setQuantity] = useState('');
    const [unitSelect, setUnitSelect] = useState('');
    const [ItemUnitOptions, setItemUnitOptions] = useState([]);

    const { Items } = useSelector((state) => ({
        Items: state.ItemMastersReducer.ItemList,
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
            value: data.id,
            label: data.UnitName
        }))
        setItemUnitOptions(ItemUnits)

    }

    const Unit_Handler = (event) => {
        setUnitSelect(event);
    };
    const addRowsHandler = (data) => {
        const invalidMsg1 = []

        if ((contentItemSelect === "")) {
            invalidMsg1.push(`Content Item Is Required`)
        }
        if (Quantity === "") {
            invalidMsg1.push(`Item Quantity Is Required`)
        };
        if ((unitSelect === "")) {
            invalidMsg1.push(`Unit Is Required`)
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

                <div className="px-2  mb-1 c_card_body text-black mt-1" style={{ width: "100%" }}>
                    <div className="row">
                        <div className=" row">
                            <Col sm="3" >
                                <FormGroup className=" row mt-3 " >
                                    <Label className="col-sm-4 p-2"
                                    >Content Item</Label>
                                    <Col sm="7">
                                        <Select
                                            value={contentItemSelect}
                                            options={ItemDropdown_Options}
                                            onChange={ContentItem_Handler}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>

                            <Col sm="3" >
                                <FormGroup className=" row mt-3 " >
                                    <Label className="col-sm-4 p-2"
                                    >Item Quantity</Label>
                                    <Col sm="7">
                                        <Input
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

                            <Col sm="3" className="">
                                <FormGroup className="mb- row mt-3 " >
                                    <Label className="col-sm-2 p-2"
                                    >Unit</Label>
                                    <Col sm="7">
                                        <Select
                                            value={unitSelect}
                                            options={ItemUnitOptions}
                                            onChange={Unit_Handler}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>

                            <Col sm="1" className="mt-3 ">
                                <Button type="button" color="btn btn-outline-primary border-1 font-size-11 text-center"
                                    onClick={addRowsHandler}
                                >        <i className="dripicons-plus pt-2 "> </i>Add</Button>
                            </Col>
                        </div>
                    </div>
                </div>
                <Row>
                    <BOMTable tableData={props.tableData} func={props.func} />
                </Row>
            </Col>
        </Row>
    );
}
export default ItemTab;
