import React, { useState, useEffect } from "react";

import Select, { components } from "react-select";
import { Col, Input, Row } from "reactstrap";



export const C_FilterSelect = React.memo(({ State, isDisabled, SelectState, SelecthandleChange, CustomerOption, ItemOption, CashierOption, onFilterChange, ...rest }) => {


    useEffect(() => {
        console.log("useEffect triggered");
    }, []);

    // const initial_state = {
    //     paymentMode: {
    //         Cash: false,
    //         Card: false,
    //         UPI: false,
    //     },
    //     invoiceAmount: {
    //         Less_Than: false,
    //         Greater_Than: false,
    //         Invoice_Amount: "",
    //         Between_InvoiceAmount: false,
    //         Between_InvoiceAmount_1: "",
    //         Between_InvoiceAmount_2: "",
    //     },
    //     InvoiceNumber: {
    //         Less_Than: false,
    //         Greater_Than: false,
    //         Invoice_Number: "",
    //         Between_InvoiceNumber: false,
    //         Between_InvoiceNumber_1: "",
    //         Between_InvoiceNumber_2: "",
    //     },
    //     Customer: { SelectedCustomer: [] },
    //     cashier: { SelectedCashier: [] },
    //     Item: { SelectedItem: [] },
    //     EInvoice: {
    //         EInvoiceCreated: false,
    //         EInvoiceNotCreated: false,
    //     },
    //     EWayBill: {
    //         EWayBillCreated: false,
    //         EWayBillNotCreated: false,
    //     },


    // };

    const [selectedOption, setSelectedOption] = useState(SelectState);
    const [state, setState] = useState(State);
    debugger
    const [isOpen, setIsOpen] = useState(true);


    const options = [
        { label: "Payment Mode", value: "paymentMode" },
        { label: "Grand Total", value: "invoiceAmount" },
        { label: "Cashier", value: "cashier" },
        { label: "Customer", value: "Customer" },
        { label: "E-Invoice", value: "EInvoice" },
        { label: "E-WayBill", value: "EWayBill" },
        { label: "Item", value: "Item" },
        { label: "Invoice Number", value: "InvoiceNumber" },


    ];

    const ItemList_Options = ItemOption?.map((index) => ({
        value: index.Item,
        label: index.ItemName,
    }));

    const onChangehandler = (option) => {
        setSelectedOption(option);
        SelecthandleChange(option)
        const advanceFilter = document.getElementById("Advance-Filter");
        if (advanceFilter && option.length > 0) {
            setIsOpen(true);
            advanceFilter.style.display = "block";
        } else {
            advanceFilter.style.display = "none";
        }

    };

    useEffect(() => {
        debugger
        if (SelectState.length > 0) {
            const hasNone = document.getElementById("Advance-Filter").style;
            hasNone.display = "block";
        } else {
            const hasNone = document.getElementById("Advance-Filter").style;
            hasNone.display = "none";
        }
    }, [])


    const handleSelectClick = () => {

        const hasNone = document.getElementById("Advance-Filter").style;
        hasNone.display = "none";

    };



    const handleInvoiceAmountChange = (SelectMode, key, value) => {

        setState((prevState) => {
            let currentMode = prevState[SelectMode] || {};

            if (SelectMode === "paymentMode") {
                currentMode = {
                    Cash: false,
                    Card: false,
                    UPI: false,
                };
            }
            if (SelectMode === "invoiceAmount" && key !== "Between_InvoiceAmount_1" && key !== "Between_InvoiceAmount_2" && key !== "Invoice_Amount") {
                currentMode = {
                    Less_Than: false,
                    Greater_Than: false,
                    Invoice_Amount: "",
                    Between_InvoiceAmount: false,
                    Between_InvoiceAmount_1: "",
                    Between_InvoiceAmount_2: "",
                };
            }
            if ((SelectMode === "InvoiceNumber") && key !== "Between_InvoiceNumber_1" && key !== "Between_InvoiceNumber_2" && key !== "Invoice_Number") {
                currentMode = {
                    Less_Than: false,
                    Greater_Than: false,
                    Invoice_Number: "",
                    Between_InvoiceNumber: false,
                    Between_InvoiceNumber_1: "",
                    Between_InvoiceNumber_2: "",
                };
            }
            if (SelectMode === "EInvoice") {
                currentMode = {
                    EInvoiceCreated: false,
                    EInvoiceNotCreated: false,
                };
            }
            if (SelectMode === "EWayBill") {
                currentMode = {
                    EWayBillCreated: false,
                    EWayBillNotCreated: false,
                };
            }


            const updatedState = {
                ...prevState,
                [SelectMode]: {
                    ...currentMode,
                    [key]: value,
                },
            };

            let jsonFilter = {
                ...updatedState,
                Item: { SelectedItem: updatedState?.Item?.SelectedItem?.map(item => item.value).join(',') },
                Customer: { SelectedCustomer: updatedState?.Customer?.SelectedCustomer?.map(item => item.value).join(',') },
                cashier: { SelectedCashier: updatedState?.cashier?.SelectedCashier?.map(item => item.value).join(',') },

            }

            onFilterChange({ jsonFilter: jsonFilter, updatedState: updatedState })
            return updatedState;
        });

    };




    const toggleAdvanceFilter = (e) => {

        // Prevent default dropdown toggle behavior
        e.stopPropagation();
        e.preventDefault();
        // Toggle the visibility of the Advance-Filter block
        setIsOpen((prev) => !prev);
        // Get the Advance-Filter block and update its display style
        const advanceFilter = document.getElementById("Advance-Filter");
        if (advanceFilter && selectedOption.length > 0) {
            advanceFilter.style.display = isOpen ? "none" : "block";
        }
    };

    const CustomDropdownIndicator = (props) => {
        return (
            <components.DropdownIndicator {...props}>
                {(selectedOption.length > 0) && <span
                    onMouseDown={toggleAdvanceFilter}
                    title="Select options and toggle to apply filters"
                    style={{ cursor: "pointer" }}
                >
                    {(!isOpen) ? "Open Filters" : "Close Filters"}
                </span>}
            </components.DropdownIndicator>
        );
    };

    return (
        <div>
            <Select
                {...rest}
                options={options}
                value={selectedOption}
                onChange={(option) => { onChangehandler(option) }}
                isMulti={true}
                onMenuOpen={handleSelectClick} // Add onMenuOpen event handler
                onFocus={handleSelectClick}
                isDisabled={isDisabled}
                className="react-dropdown"
                classNamePrefix="select2-selection"
                closeMenuOnSelect
                components={{
                    DropdownIndicator: CustomDropdownIndicator,
                }}
            />
            <div id="Advance-Filter" className="price-drop-options"
                onClick={(e) => e.stopPropagation()}
            >
                {selectedOption.some(item => item.value === "paymentMode") && (
                    <div style={{ border: "ridge", borderRadius: "7px", padding: "8px" }}>
                        <span>Payment Mode</span>
                        <div style={{ marginTop: "10px", marginLeft: "15px" }}>
                            <label style={{ marginRight: "40px", fontSize: "16px", }}>
                                <Input type="radio" name="Cash" style={{ marginRight: "7px" }} className="p-2"
                                    checked={state.paymentMode.Cash}
                                    onChange={(e) => handleInvoiceAmountChange("paymentMode", "Cash", e.target.checked)}

                                />
                                Cash
                            </label>
                            <label style={{ marginRight: "40px", fontSize: "16px" }}>
                                <Input type="radio" name="Card" style={{ marginRight: "7px" }} className="p-2"
                                    checked={state.paymentMode.Card}

                                    onChange={(e) => handleInvoiceAmountChange("paymentMode", "Card", e.target.checked)}

                                />
                                Card
                            </label>
                            <label style={{ marginRight: "40px", fontSize: "16px" }}>
                                <Input type="radio" name="UPI" style={{ marginRight: "7px" }} className="p-2"
                                    checked={state.paymentMode.UPI}
                                    onChange={(e) => handleInvoiceAmountChange("paymentMode", "UPI", e.target.checked)}

                                />
                                UPI
                            </label>
                        </div>
                    </div>
                )}
                {selectedOption.some(item => item.value === "invoiceAmount") && (
                    <div style={{ border: "ridge", borderRadius: "7px", padding: "8px" }}>
                        <span> Grand Total</span>
                        <div style={{ marginTop: "10px", marginLeft: "15px" }}>
                            <label style={{ marginRight: "32px", fontSize: "16px" }}>
                                <Input
                                    type="radio"
                                    name="Less_Than"
                                    checked={state.invoiceAmount.Less_Than}
                                    style={{ marginRight: "7px" }} className="p-2"
                                    onChange={(e) => handleInvoiceAmountChange("invoiceAmount", "Less_Than", e.target.checked)}
                                />
                                Less Than
                            </label>
                            <label style={{ marginRight: "32px", fontSize: "16px" }}>
                                <Input
                                    type="radio"
                                    name="Greater_Than"
                                    checked={state.invoiceAmount.Greater_Than}
                                    style={{ marginRight: "7px" }} className="p-2"
                                    onChange={(e) => handleInvoiceAmountChange("invoiceAmount", "Greater_Than", e.target.checked)}
                                />
                                Greater Than
                            </label>
                            <label style={{ marginRight: "32px", fontSize: "16px" }}>
                                <Input
                                    type="radio"
                                    name="Between_InvoiceAmount"
                                    checked={state.invoiceAmount.Between_InvoiceAmount}
                                    style={{ marginRight: "7px" }} className="p-2"
                                    onChange={(e) => handleInvoiceAmountChange("invoiceAmount", "Between_InvoiceAmount", e.target.checked)}
                                />
                                Between
                            </label>
                        </div>
                        {!(state.invoiceAmount.Between_InvoiceAmount) && <Input
                            type="text"
                            placeholder="Enter Amount"
                            value={state.invoiceAmount.Invoice_Amount}
                            onChange={(e) => handleInvoiceAmountChange("invoiceAmount", "Invoice_Amount", e.target.value)}
                            style={{
                                width: "100%",
                                marginTop: "10px",
                                padding: "5px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                            }}
                        />}


                        {(state.invoiceAmount.Between_InvoiceAmount) && <Row>
                            <Col>
                                <Input
                                    type="text"
                                    placeholder="Enter Amount"
                                    value={state.invoiceAmount.Between_InvoiceAmount_1 || ""}
                                    onChange={(e) => handleInvoiceAmountChange("invoiceAmount", "Between_InvoiceAmount_1", e.target.value)}
                                    style={{
                                        width: "100%",
                                        marginTop: "10px",
                                        padding: "5px",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                    }}
                                />
                            </Col>
                            <Col>
                                <Input
                                    type="text"
                                    placeholder="Enter Amount"
                                    value={state.invoiceAmount.Between_InvoiceAmount_2 || ""}
                                    onChange={(e) => handleInvoiceAmountChange("invoiceAmount", "Between_InvoiceAmount_2", e.target.value)}
                                    style={{
                                        width: "100%",
                                        marginTop: "10px",
                                        padding: "5px",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                    }}
                                />
                            </Col>
                        </Row>}
                    </div>
                )}
                {selectedOption.some(item => item.value === "InvoiceNumber") && (
                    <div style={{ border: "ridge", borderRadius: "7px", padding: "8px" }}>
                        <span> Invoice Number</span>
                        <div style={{ marginTop: "10px", marginLeft: "15px" }}>
                            <label style={{ marginRight: "32px", fontSize: "16px" }}>
                                <Input
                                    type="radio"
                                    name="Less_Than"
                                    checked={state.InvoiceNumber.Less_Than}
                                    style={{ marginRight: "7px" }} className="p-2"
                                    onChange={(e) => handleInvoiceAmountChange("InvoiceNumber", "Less_Than", e.target.checked)}
                                />
                                Less Than
                            </label>
                            <label style={{ marginRight: "32px", fontSize: "16px" }}>
                                <Input
                                    type="radio"
                                    name="Greater_Than"
                                    checked={state.InvoiceNumber.Greater_Than}
                                    style={{ marginRight: "7px" }} className="p-2"
                                    onChange={(e) => handleInvoiceAmountChange("InvoiceNumber", "Greater_Than", e.target.checked)}
                                />
                                Greater Than
                            </label>
                            <label style={{ marginRight: "32px", fontSize: "16px" }}>
                                <Input
                                    type="radio"
                                    name="Between_InvoiceNumber"
                                    checked={state.InvoiceNumber.Between_InvoiceNumber}
                                    style={{ marginRight: "7px" }} className="p-2"
                                    onChange={(e) => handleInvoiceAmountChange("InvoiceNumber", "Between_InvoiceNumber", e.target.checked)}
                                />
                                Between
                            </label>
                        </div>
                        {!(state.InvoiceNumber.Between_InvoiceNumber) && <Input
                            type="text"
                            placeholder="Enter Invoice Number"
                            value={state.InvoiceNumber.Invoice_Number}
                            onChange={(e) => handleInvoiceAmountChange("InvoiceNumber", "Invoice_Number", e.target.value)}
                            style={{
                                width: "100%",
                                marginTop: "10px",
                                padding: "5px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                            }}
                        />}


                        {(state.InvoiceNumber.Between_InvoiceNumber) && <Row>
                            <Col>
                                <Input
                                    type="text"
                                    placeholder="Enter Invoice Number"
                                    value={state.InvoiceNumber.Between_InvoiceNumber_1 || ""}
                                    onChange={(e) => handleInvoiceAmountChange("InvoiceNumber", "Between_InvoiceNumber_1", e.target.value)}
                                    style={{
                                        width: "100%",
                                        marginTop: "10px",
                                        padding: "5px",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                    }}
                                />
                            </Col>
                            <Col>
                                <Input
                                    type="text"
                                    placeholder="Enter Invoice Number"
                                    value={state.InvoiceNumber.Between_InvoiceNumber_2 || ""}
                                    onChange={(e) => handleInvoiceAmountChange("InvoiceNumber", "Between_InvoiceNumber_2", e.target.value)}
                                    style={{
                                        width: "100%",
                                        marginTop: "10px",
                                        padding: "5px",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                    }}
                                />
                            </Col>
                        </Row>}
                    </div>
                )}
                {selectedOption.some(item => item.value === "Customer") && (

                    <div style={{ border: "ridge", borderRadius: "7px", padding: "8px" }}>
                        <span>Customer</span>
                        <Select
                            value={state.Customer.SelectedCustomer}
                            options={CustomerOption}
                            isMulti={true}
                            onChange={(e) => handleInvoiceAmountChange("Customer", "SelectedCustomer", e)}
                            style={{
                                width: "100%",
                                marginTop: "10px",
                                padding: "5px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                            }}
                        />

                    </div>
                )}
                {selectedOption.some(item => item.value === "cashier") && (
                    <div style={{ border: "ridge", borderRadius: "7px", padding: "8px" }}>
                        <span>Cashier</span>

                        <Select
                            value={state.cashier.SelectedCashier}
                            options={CashierOption}
                            isMulti={true}
                            onChange={(e) => handleInvoiceAmountChange("cashier", "SelectedCashier", e)}
                            style={{
                                width: "100%",
                                marginTop: "10px",
                                padding: "5px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                            }}
                        />

                    </div>
                )}
                {selectedOption.some(item => item.value === "Item") && (
                    <div style={{ border: "ridge", borderRadius: "7px", padding: "8px" }}>
                        <span>Item</span>
                        <Select
                            value={state.Item.SelectedItem}
                            options={ItemList_Options}
                            isMulti={true}
                            onChange={(e) => handleInvoiceAmountChange("Item", "SelectedItem", e)}
                            cashier
                            style={{
                                width: "100%",
                                marginTop: "10px",
                                padding: "5px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                            }}
                        />

                    </div>
                )}
                {selectedOption.some(item => item.value === "EInvoice") && (
                    <div style={{ border: "ridge", borderRadius: "7px", padding: "8px" }}>
                        <span>E-Invoice</span>
                        <div style={{ marginTop: "10px", marginLeft: "15px" }}>
                            <label style={{ marginRight: "40px", fontSize: "16px" }}>
                                <Input type="radio" name="EInvoiceCreated" style={{ marginRight: "7px" }} className="p-2"
                                    checked={state.EInvoice.EInvoiceCreated}
                                    onChange={(e) => handleInvoiceAmountChange("EInvoice", "EInvoiceCreated", e.target.checked)}

                                />
                                Created
                            </label>
                            <label style={{ marginRight: "40px", fontSize: "16px" }}>
                                <Input type="radio" name="EInvoiceNotCreated" style={{ marginRight: "7px" }} className="p-2"
                                    checked={state.EInvoice.EInvoiceNotCreated}
                                    onChange={(e) => handleInvoiceAmountChange("EInvoice", "EInvoiceNotCreated", e.target.checked)}

                                />
                                Not Created
                            </label>

                        </div>
                    </div>
                )}
                {selectedOption.some(item => item.value === "EWayBill") && (
                    <div style={{ border: "ridge", borderRadius: "7px", padding: "8px" }}>
                        <span>E-WayBill</span>
                        <div style={{ marginTop: "10px", marginLeft: "15px" }}>
                            <label style={{ marginRight: "40px", fontSize: "16px" }}>
                                <Input type="radio" name="Created" style={{ marginRight: "7px" }} className="p-2"
                                    checked={state.EWayBill.EWayBillCreated}
                                    onChange={(e) => handleInvoiceAmountChange("EWayBill", "EWayBillCreated", e.target.checked)}
                                />
                                Created
                            </label>
                            <label style={{ marginRight: "40px", fontSize: "16px" }}>
                                <Input type="radio" name="NotCreated" style={{ marginRight: "7px" }} className="p-2"
                                    checked={state.EWayBill.EWayBillNotCreated}
                                    onChange={(e) => handleInvoiceAmountChange("EWayBill", "EWayBillNotCreated", e.target.checked)}
                                />
                                Not Created
                            </label>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});



























