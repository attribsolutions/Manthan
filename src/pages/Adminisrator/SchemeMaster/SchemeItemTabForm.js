import { forwardRef, useImperativeHandle, useState } from 'react'
import { Card, CardBody, Col, Label, Button, Input } from 'reactstrap'
import Select from "react-select";
import { useSelector } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import GlobalCustomTable from '../../../GlobalCustomTable';

const SchemeItemTabForm = forwardRef((props, ref) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [update, forceUpdate] = useState(0);

    const { ItemDropDown } = useSelector((state) => ({
        ItemDropDown: state.ItemMastersReducer.ItemList,
    }));

    const ItemList_Options = ItemDropDown.map((item) => ({
        value: item.id,
        label: item.Name,
    }));

    useImperativeHandle(ref, () => ({
        getValue: () => tableData,
        updateValue: (newVal) => setTableData(newVal)
    }));

    const handleAdd = () => {
        if (selectedItem && !tableData.some(i => i.value === selectedItem.value)) {
            const newItem = {
                ...selectedItem,
                isDefault: false,
                ItemType: {},
                DiscountType: "", // Default value for DiscountType

            };

            setTableData(prev => [newItem, ...prev]);
            setSelectedItem(null);
        }
    };

    const handleDelete = (row) => {
        setTableData(prev => prev.filter(i => i.value !== row.value));
    };

    const columns = [
        {
            dataField: 'label',
            text: 'Item Name',
        },
        {
            dataField: 'label',
            text: 'Type For Item',
            formatExtraData: update,
            formatter: (_, row) => (
                <Select
                    id="Item"
                    name="Item"
                    value={row.ItemType}
                    isSearchable={true}
                    className="react-dropdown  mt-2"
                    classNamePrefix="dropdown"
                    styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    options={[{ value: 1, label: 'Aplicable' }, { value: 2, label: 'Mot Aplicable' }, { value: 3, label: 'Effective' }]}
                    onChange={(e) => {
                        row.ItemType = e;
                        forceUpdate(n => n + 1);
                    }}
                />
            ),
        },
        {
            dataField: 'label',
            text: 'Discount',
            formatExtraData: update,

            formatter: (_, row) => (
                <div className="d-flex align-items-center gap-2 col-xxl-12 ">
                    <Input
                        name="DiscountValue"
                        id={`discount-value-${row.value}`}
                        value={row.DiscountValue || ""}
                        type="text"
                        placeholder="Enter Value"
                        autoComplete="off"

                        className="font-size-12"
                        style={{ maxWidth: "150px" }}
                        onChange={(event) => {
                            row.DiscountValue = event.target.value;
                            forceUpdate(n => n + 1);
                        }}
                    />
                    <div className="btn-group mt-2" role="group" aria-label="Value type">
                        <input
                            type="checkbox"
                            id={`discount-rs-${row.value}`}
                            className="btn-check"
                            autoComplete="off"
                            checked={row.DiscountType === "RS"}
                            onChange={() => {
                                row.DiscountType = "RS";
                                forceUpdate(n => n + 1);
                            }}
                        />
                        <label className="btn btn-outline-secondary" htmlFor={`discount-rs-${row.value}`}>
                            ₹
                        </label>

                        <input
                            type="checkbox"
                            id={`discount-percent-${row.value}`}
                            className="btn-check"
                            autoComplete="off"
                            checked={row.DiscountType === "%"}
                            onChange={() => {
                                row.DiscountType = "%";
                                forceUpdate(n => n + 1);
                            }}
                        />
                        <label className="btn btn-outline-secondary" htmlFor={`discount-percent-${row.value}`}>
                            %
                        </label>
                    </div>


                </div>


            ),
        },
        {
            dataField: 'action',
            text: 'Action',
            formatter: (_, row) => (
                <Button color="danger" size="sm" onClick={() => handleDelete(row)}>
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <Card className="text-black" style={{ marginTop: "3px" }}>
            <CardBody className="vh-50 text-black" style={{ marginTop: "3px", height: "500px" }} >
                <form noValidate>
                    <div className="row">
                        <Col md={4}>
                            <Label htmlFor="validationCustom01">Item</Label>
                            <Select
                                id="Item"
                                name="Item"
                                value={selectedItem}
                                isSearchable={true}
                                className="react-dropdown"
                                classNamePrefix="dropdown"
                                styles={{ menu: provided => ({ ...provided, zIndex: 2 }) }}
                                options={ItemList_Options}
                                onChange={(e) => setSelectedItem(e)}
                            />
                        </Col>
                        <Col md={2} className="d-flex align-items-end my-xxl-1">
                            <Button type="button" color="primary" onClick={handleAdd} disabled={!selectedItem}>
                                Add
                            </Button>
                        </Col>
                    </div>
                </form>

                <hr />

                <GlobalCustomTable
                    keyField={"id"}
                    data={tableData}
                    columns={columns}
                    id="table_Arrow"
                    noDataIndication={
                        <div className="text-danger text-center ">
                            Items Not available
                        </div>
                    }

                />

            </CardBody>
        </Card>
    )
})

export default SchemeItemTabForm;
