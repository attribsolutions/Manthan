import { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { Input } from 'reactstrap'
import { useSelector } from 'react-redux';
import GlobalCustomTable from '../../../GlobalCustomTable';
import { useHistory } from "react-router-dom";
import { mode } from '../../../routes';

const SchemePartyTabForm = forwardRef(({ props }, ref) => {

    const history = useHistory();
    const { location } = history

    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty(mode.editValue)
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [update, forceUpdate] = useState(0);

    const [tableData, setTableData] = useState([]);
    const [selectAll, setSelectAll] = useState({
        IsPartySelect: false,

    });


    const { PartyDropDown } = useSelector((state) => ({
        PartyDropDown: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
    }));



    useImperativeHandle(ref, () => ({
        getValue: () => tableData,
        updateValue: (newVal) => setTableData(newVal)
    }));


    useEffect(() => {
        if (pageMode === mode.defaultsave) {
            const PartyList_Options = PartyDropDown.map((item) => ({
                value: item.id,
                label: item.Name,
                IsPartySelect: false,

            }));
            setTableData(PartyList_Options)
        }
    }, [PartyDropDown])


    useEffect(() => {

        if ((hasShowloction || hasShowModal)) {

            let hasEditVal = null
            if (hasShowloction) {
                setPageMode(location.pageMode)
                hasEditVal = location.editValue
            }
            else if (hasShowModal) {
                hasEditVal = props.editValue
                setPageMode(props.pageMode)
            }
            if (hasEditVal) {

                const { PartyDetails
                } = hasEditVal[0]
                setTableData(PartyDetails.map(i => ({
                    label: i.PartyName,
                    value: i.PartyID,
                    IsPartySelect: true,

                })))

            }
        }
    }, [location]);


    const handleHeaderCheckboxChange = (IsPartySelect) => {

        const updatedData = tableData.map(row => ({
            ...row,
            IsPartySelect: IsPartySelect// toggle entire column
        }));
        setSelectAll({ IsPartySelect: IsPartySelect })
        setTableData(updatedData);

    };

    const columns = [
        {
            dataField: 'label',
            text: 'Party Name',
        },
        {
            dataField: 'label',
            text: 'Select',
            formatExtraData: update,
            headerFormatter: () => (
                <div className="d-flex align-items-center">
                    <div className="form-check mb-0 d-flex align-items-center">
                        <Input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectAll.IsPartySelect}
                            onChange={(event) => handleHeaderCheckboxChange(event.target.checked)}
                            id="selectAllCheckbox"
                        />
                        <label className="form-check-label ms-2 mt-lg-1" htmlFor="selectAllCheckbox">
                            Select
                        </label>
                    </div>
                </div>

            ),
            formatter: (cell, row) => {

                return <div className="">
                    <Input type="checkbox"
                        onChange={(event) => {
                            row["IsPartySelect"] = event.target.checked
                            forceUpdate(n => n + 1);
                        }}
                        checked={row.IsPartySelect}

                    />
                </div>
            }
        },


    ];

    return (

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

    )
})

export default SchemePartyTabForm;
