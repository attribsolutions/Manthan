import { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { Input } from 'reactstrap'
import GlobalCustomTable from '../../../GlobalCustomTable';
import { useHistory } from "react-router-dom";
import { mode } from '../../../routes';


const SchemePartyTabForm = forwardRef(({ props, setState, state }, ref) => {
    
    const history = useHistory();
    const { location } = history

    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty(mode.editValue)
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [update, forceUpdate] = useState(0);

    // const [state, setState] = useState(PartyTabledata);

    const [selectAll, setSelectAll] = useState({
        IsPartySelect: false,

    });


    useImperativeHandle(ref, () => ({
        getValue: () => state,
        updateValue: (newVal) => setState(newVal)
    }));




    const handleHeaderCheckboxChange = (IsPartySelect) => {

        const updatedData = state.map(row => ({
            ...row,
            IsPartySelect: IsPartySelect// toggle entire column
        }));
        setSelectAll({ IsPartySelect: IsPartySelect })
        setState(updatedData);

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
            data={state}
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
