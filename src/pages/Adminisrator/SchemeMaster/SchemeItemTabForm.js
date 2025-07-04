import { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { Card, CardBody, Col, Label, Button, Input } from 'reactstrap'
import Select from "react-select";
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import GlobalCustomTable from '../../../GlobalCustomTable';
import { mode } from '../../../routes';

const SchemeItemTabForm = forwardRef(({ props }, ref) => {

    const history = useHistory();
    const { location } = history
    const hasShowloction = location.hasOwnProperty("rowData")
    const hasShowModal = props.hasOwnProperty(mode.editValue)


    const [selectedItem, setSelectedItem] = useState(null);
    const [tableData, setTableData] = useState([]);
    debugger
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


    useEffect(() => {

        if ((hasShowloction || hasShowModal)) {

            let hasEditVal = null
            if (hasShowloction) {

                hasEditVal = location.rowData
            }
            else if (hasShowModal) {
                hasEditVal = props.editValue
            }
            if (hasEditVal) {
                debugger
                const { ItemDetails
                } = hasEditVal[0]
                setTableData(ItemDetails.map(i => ({
                    ...i,
                    label: i.ItemName,
                    value: i.ItemID
                })))

            }
        }
    }, [location]);

    const handleAdd = () => {
        if (selectedItem && !tableData.some(i => i.value === selectedItem.value)) {
            const newItem = {
                ...selectedItem,
                isDefault: false,
                TypeForItem: {},
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
            dataField: 'TypeForItem',
            text: 'Type For Item',
            formatExtraData: update,
            formatter: (_, row) => {
                const Options = [{ value: 1, label: 'Aplicable' }, { value: 2, label: 'Not Aplicable' }, { value: 3, label: 'Effective' }]
                return (
                    <Select
                        id="Item"
                        name="Item"
                        value={Options.find(opt => opt.value === row.TypeForItem)}
                        isSearchable={true}
                        className="react-dropdown  mt-2"
                        classNamePrefix="dropdown"
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        options={Options}
                        onChange={(e) => {
                            debugger
                            row.TypeForItem = e.value;
                            forceUpdate(n => n + 1);
                        }}
                    />
                )
            },
        },

        {
            dataField: '',
            text: 'Quantity',
            formatExtraData: update,

            formatter: (_, row) => (

                <Input
                    name="Quantity"
                    id={`Quantity`}
                    value={row.Quantity || ""}
                    type="text"
                    placeholder="Enter Value"
                    autoComplete="off"
                    className="font-size-12 mt-2"
                    style={{ maxWidth: "150px" }}
                    onChange={(event) => {
                        row.Quantity = event.target.value;
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
            <CardBody className="text-black" style={{ marginTop: "3px", height: "500px", overflow: "hidden" }}>
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
                            <Button
                                type="button"
                                color="primary"
                                onClick={handleAdd}
                                disabled={!selectedItem}
                            >
                                Add
                            </Button>
                        </Col>
                    </div>
                </form>

                <hr />
                <div style={{ height: "376px", overflowY: "auto" }}>
                    <GlobalCustomTable
                        keyField={"id"}
                        data={tableData}
                        columns={columns}
                        id="table_Arrow"
                        noDataIndication={
                            <div className="text-danger text-center">
                                Items Not available
                            </div>
                        }
                    />
                </div>
            </CardBody>
        </Card>
    )
})

export default SchemeItemTabForm;
