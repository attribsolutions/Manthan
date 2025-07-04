import { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { Card, CardBody, Col, Label, Button, Input } from 'reactstrap'
import Select from "react-select";
import { useSelector } from 'react-redux';

import GlobalCustomTable from '../../../GlobalCustomTable';
import { useHistory } from "react-router-dom";
import { mode } from '../../../routes';
const SchemePartyTabForm = forwardRef(({ props }, ref) => {

    const history = useHistory();
    const { location } = history

    const hasShowloction = location.hasOwnProperty("rowData")
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const [selectedParty, setSelectedParty] = useState(null);
    const [tableData, setTableData] = useState([]);


    const { PartyDropDown } = useSelector((state) => ({
        PartyDropDown: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
    }));

    const PartyList_Options = PartyDropDown.map((item) => ({
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
                const { PartyDetails
                } = hasEditVal[0]
                setTableData(PartyDetails.map(i => ({
                    label: i.PartyName,
                    value: i.PartyID
                })))

            }
        }
    }, [location]);




    const handleAdd = () => {
        if (selectedParty && !tableData.some(i => i.value === selectedParty.value)) {
            const newParty = {
                ...selectedParty,
                isDefault: false,
                PartyType: {},
                DiscountType: "", // Default value for DiscountType

            };

            setTableData(prev => [newParty, ...prev]);
            setSelectedParty(null);
        }
    };

    const handleDelete = (row) => {
        setTableData(prev => prev.filter(i => i.value !== row.value));
    };

    const columns = [
        {
            dataField: 'label',
            text: 'Party Name',
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
                            <Label htmlFor="validationCustom01">Party</Label>
                            <Select
                                id="Party"
                                name="Party"
                                value={selectedParty}
                                isSearchable={true}
                                className="react-dropdown"
                                classNamePrefix="dropdown"
                                styles={{ menu: provided => ({ ...provided, zIndex: 2 }) }}
                                options={PartyList_Options}
                                onChange={(e) => setSelectedParty(e)}
                            />
                        </Col>
                        <Col md={2} className="d-flex align-items-end my-xxl-1">
                            <Button type="button" color="primary" onClick={handleAdd} disabled={!selectedParty}>
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
                            <div className="text-danger text-center ">
                                Partys Not available
                            </div>
                        }

                    />
                </div>
            </CardBody>
        </Card>
    )
})

export default SchemePartyTabForm;
