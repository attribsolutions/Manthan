import { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { Card, CardBody, Col, Label, Button, Input } from 'reactstrap'

import { useHistory } from "react-router-dom";
import GlobalCustomTable from '../../../GlobalCustomTable';
import { mode } from '../../../routes';
import { loginCompanyID } from '../../../components/Common/CommonFunction';
import { get_SubGroup_Group } from '../../../helpers/backend_helper';
import { event } from 'jquery';

const SchemeItemTabForm = forwardRef(({ props, GroupSelect, SubGroupSelect, Validation, ItemTabledata }, ref) => {

    const history = useHistory();
    const { location } = history
    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const [update, forceUpdate] = useState(0);
    const [pageMode, setPageMode] = useState(mode.defaultsave);

    const [ItemData, setItemData] = useState(ItemTabledata);
    const [FilteredItems, setFilteredItems] = useState([]);


    debugger

    const [selectAll, setSelectAll] = useState({
        applicable: false,
        not_applicable: false,
        effective: false
    });


    useEffect(async () => {
   
        setItemData(ItemTabledata)
     
    }, [ItemTabledata])

    // useEffect(() => {

    //     if (GroupSelect.value === 0 && SubGroupSelect.value === 0) {
    //         const allItems = ItemData.flatMap(group => group.Items || []);
    //         setFilteredItems(allItems.map(i => ({
    //             ...i,

    //             Quantity: "",
    //             applicable: false,
    //             not_applicable: false,
    //             effective: false
    //         })));

    //     } else if (GroupSelect.value !== 0 && (SubGroupSelect.value && SubGroupSelect.value !== 0)) {
    //         const subGroupItems = ItemData
    //             .filter(g => g.SubGroupID === SubGroupSelect.value)
    //             .flatMap(g => g.Items || []);
    //         setFilteredItems(subGroupItems.map(i => ({
    //             ...i,

    //             Quantity: "",
    //             applicable: false,
    //             not_applicable: false,
    //             effective: false

    //         })));
    //     } else if (GroupSelect.value !== 0) {
    //         const groupItems = ItemData
    //             .filter(g => g.GroupID === GroupSelect.value)
    //             .flatMap(g => g.Items || []);
    //         setFilteredItems(groupItems.map(i => ({
    //             ...i,

    //             Quantity: "",
    //             applicable: false,
    //             not_applicable: false,
    //             effective: false

    //         })));

    //     }
    // }, [GroupSelect, SubGroupSelect, ItemData]);



    useImperativeHandle(ref, () => ({
        getValue: () => FilteredItems,
        updateValue: (newVal) => setFilteredItems(newVal)
    }));


    useEffect(() => {

        if ((hasShowloction || hasShowModal)) {

            let hasEditVal = null
            if (hasShowloction) {
                hasEditVal = location.editValue
                setPageMode(location.pageMode)
            }
            else if (hasShowModal) {
                hasEditVal = props.editValue
                setPageMode(props.location.pageMode)
            }
            if (hasEditVal) {
                const { ItemDetails
                } = hasEditVal[0]
                debugger
                setFilteredItems(ItemDetails.map(i => ({
                    ...i,
                    label: i.ItemName,
                    value: i.ItemID
                })))

            }
        }
    }, [location]);




    const AplicableheaderCheckboxChange = (isAplicable) => {

        const updatedData = FilteredItems.map(row => ({
            ...row,
            applicable: isAplicable,
            not_applicable: false
        }));

        setFilteredItems(updatedData);

        setSelectAll(prev => ({
            ...prev,
            applicable: isAplicable,
            not_applicable: false
        }));

    };



    const Not_AplicableheaderCheckboxChange = (isNotAplicable) => {
        const updatedData = FilteredItems.map(row => ({
            ...row,
            not_applicable: isNotAplicable,
            applicable: false,
        }));
        setFilteredItems(updatedData);
        setSelectAll(prev => ({
            ...prev,
            not_applicable: isNotAplicable,
            applicable: false,
        }));
    };

    const effectiveheaderCheckboxChange = (isEffective) => {
        const updatedData = FilteredItems.map(row => ({
            ...row,
            effective: isEffective
        }));
        setFilteredItems(updatedData);
        setSelectAll(prev => ({
            ...prev,
            effective: isEffective
        }));
    };



    const columns = [
        {
            dataField: 'ItemName',
            text: 'Item Name',

        },
        {
            dataField: 'applicable',
            text: 'Aplicable',
            formatExtraData: update,
            headerFormatter: () => {
                return (
                    <div className="d-flex align-items-center">
                        <div className="form-check mb-0 d-flex align-items-center">
                            <Input
                                type="checkbox"
                                className="form-check-input"
                                checked={selectAll.applicable}
                                onChange={(event) => AplicableheaderCheckboxChange(event.target.checked)}
                                id="applicableAllCheckbox"
                            />
                            <label className="form-check-label ms-2 mt-lg-1" htmlFor="selectAllCheckbox">
                                Aplicable
                            </label>
                        </div>
                    </div>
                )
            },
            formatter: (cell, row, rowIndex, FilteredItems) => {

                return (
                    <Input
                        type="checkbox"
                        checked={row.applicable && !(row.not_applicable)}
                        onChange={(event) => {

                            row.applicable = event.target.checked;
                            if (event.target.checked) {
                                row.not_applicable = !(event.target.checked);
                            }

                            forceUpdate(n => n + 1);
                        }}
                    />
                )
            }
        },
        {
            dataField: 'not_applicable',
            text: 'Not Aplicable',
            formatExtraData: update,

            headerFormatter: () => (


                <div className="d-flex align-items-center">
                    <div className="form-check mb-0 d-flex align-items-center">
                        <Input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectAll.not_applicable}
                            onChange={(event) => Not_AplicableheaderCheckboxChange(event.target.checked)}
                            id="not_applicableAllCheckbox"
                        />
                        <label className="form-check-label ms-2 mt-lg-1" htmlFor="selectAllCheckbox">
                            Not Aplicable
                        </label>
                    </div>
                </div>
            ),
            formatter: (cell, row, rowIndex) => {

                return (
                    <Input
                        type="checkbox"
                        checked={row.not_applicable && !(row.applicable)}
                        onChange={(event) => {
                            row.not_applicable = event.target.checked;
                            if (event.target.checked) {
                                row.applicable = !(event.target.checked);
                            }
                            forceUpdate(n => n + 1);
                        }}
                    />
                )
            }
        },
        {
            dataField: 'effective',
            text: 'Effective',
            formatExtraData: update,

            headerFormatter: () => (
                <div className="d-flex align-items-center">
                    <div className="form-check mb-0 d-flex align-items-center">
                        <Input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectAll.effective}
                            onChange={(e) => effectiveheaderCheckboxChange(e.target.checked)}
                            id="applicableAllCheckbox"
                        />
                        <label className="form-check-label ms-2 mt-lg-1" htmlFor="selectAllCheckbox">
                            Effective
                        </label>
                    </div>
                </div>
            ),
            formatter: (cell, row, rowIndex) => (
                <Input
                    type="checkbox"
                    checked={row.effective}
                    onChange={(event) => {
                        row.effective = event.target.checked;
                        forceUpdate(n => n + 1);
                    }}
                />
            )
        },
        {

            dataField: '',
            text: 'Quantity',
            formatExtraData: update,
            // hidden: SchemeItemTab.Quantityhidden,

            formatter: (_, row) => {
                if (!(row.effective)) {
                    row["Quantity"] = ""
                }
                return (
                    <Input
                        name="Quantity"
                        id={`Quantity`}
                        value={row.Quantity || ""}
                        type="text"
                        disabled={!(row.effective)}
                        placeholder="Enter Quantity"
                        autoComplete="off"
                        className="font-size-12 mt-2"
                        style={{ maxWidth: "150px" }}
                        onChange={(event) => {
                            row.Quantity = event.target.value;
                            forceUpdate(n => n + 1);
                        }}
                    />

                )
            },
        },

        {
            dataField: 'label',
            text: 'Discount',
            // hidden: SchemeItemTab.Discounthidden,
            formatExtraData: update,
            formatter: (_, row) => {
                if (!(row.effective)) {
                    row["DiscountValue"] = ""
                    row["DiscountType"] = ""
                }

                return (
                    <div className="d-flex align-items-center gap-2 col-xxl-12 ">
                        <Input
                            name="DiscountValue"
                            id={`discount-value-${row.ItemID}`}
                            value={row.DiscountValue || ""}
                            type="text"
                            disabled={!(row.effective)}
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
                                id={`discount-rs-${row.ItemID}`}
                                className="btn-check"
                                autoComplete="off"
                                disabled={!(row.effective)}
                                checked={row.DiscountType === "RS"}
                                onChange={() => {
                                    row.DiscountType = "RS";
                                    forceUpdate(n => n + 1);
                                }}
                            />
                            <label className="btn btn-outline-secondary" htmlFor={`discount-rs-${row.ItemID}`}>
                                ₹
                            </label>

                            <input
                                type="checkbox"
                                id={`discount-percent-${row.ItemID}`}
                                className="btn-check"
                                autoComplete="off"
                                disabled={!(row.effective)}
                                checked={row.DiscountType === "%"}
                                onChange={() => {
                                    row.DiscountType = "%";
                                    forceUpdate(n => n + 1);
                                }}
                            />
                            <label className="btn btn-outline-secondary" htmlFor={`discount-percent-${row.ItemID}`}>
                                %
                            </label>
                        </div>
                    </div>
                )
            },
        },





    ];

    return (

        <>
            <GlobalCustomTable
                keyField={"id"}
                data={ItemData}
                columns={columns}
                paginationEnabled={25}
                id="table_Arrow"
                noDataIndication={
                    <div className="text-danger text-center">
                        Items Not available
                    </div>
                }
            />
        </>

    )
})

export default SchemeItemTabForm;
