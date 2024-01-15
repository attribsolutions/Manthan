// SelectUnit.js
import React from 'react';
import Select from 'react-select';
import * as mode from "../../../../routes/PageMode";

const SelectUnit = React.memo(({
    unitSelected,
    unitOptions,
    index1,
    onSelectChange,
    isDisabled
}) => {
    
    return (
        <div id="select">
            <Select
                classNamePrefix="select2-selection"
                id="ddlUnit"
                isDisabled={isDisabled}
                defaultValue={unitSelected}
                options={unitOptions.map(({ UnitName, UnitID, ...rest }) => ({
                    label: UnitName,
                    value: UnitID,
                    ...rest
                }))}
                onChange={(event) => onSelectChange(event, index1)}
            ></Select>
        </div>
    );
});

export default SelectUnit;
