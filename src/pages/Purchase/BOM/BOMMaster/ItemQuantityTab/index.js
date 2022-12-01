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

function ItemTab(props) {

    const dispatch = useDispatch();
    const [contentItemSelect, setContentItemSelect] = useState('');
    const [ItemQuantity, setItemQuantity] = useState('');
    const [unitSelect, setUnitSelect] = useState('');

    const { Items, Unit } = useSelector((state) => ({
        Items: state.ItemMastersReducer.pages,
        Unit: state.ItemMastersReducer.BaseUnit,
    }));

    useEffect(() => {
        dispatch(getItemList())
        dispatch(getBaseUnit_ForDropDown());

    }, [dispatch]);

    const ItemDropdown_Options = Items.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const Unit_DropdownOptions = Unit.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const ContentItem_Handler = (event) => {
        setContentItemSelect(event);
    };

    const Unit_Handler = (event) => {
        setUnitSelect(event);
    };

    const addRowsHandler = (data) => {
        
        const val = {
            ItemID: contentItemSelect === "" ? "" : contentItemSelect.value,
            ItemName: contentItemSelect.label,
            ItemID: unitSelect === "" ? "" : unitSelect.value,
            ItemName: unitSelect.label,
            GSTPercentage: ItemQuantity,
           
        };

        // if (!(GST === "")
        //     && !(HSNCode === "")
        //     && !(effectiveDate === "")
        // ) {
        //     const totalTableData = props.tableData.length;
        //     val.id = totalTableData + 1;
        //     const updatedTableData = [...props.tableData];
        //     updatedTableData.push(val);
        //     props.func(updatedTableData)
        //     clearState();

        // }
        // else {
        //     alert("Please Enter value")
        // }
    };
    const clearState = () => {

    };

    return (

        <Row>
            <Col md={12}  >
                <Card className="text-black">
                    <CardBody style={{ backgroundColor: "whitesmoke" }}>
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
                                <Input type="text"
                                    value={ItemQuantity}
                                    placeholder="Please Enter Margin"
                                    autoComplete="off"
                                    onChange={(event) => setItemQuantity(event.target.value)}
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
                    {/* <ItemTable tableData={props.tableData} func={props.func} /> */}
                </Row>
            </Col>
        </Row>
    );
}

export default ItemTab;
