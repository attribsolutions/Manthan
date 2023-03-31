import React, { useEffect, useState, } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormGroup, Label } from "reactstrap";
import Select from "react-select";
import { getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";

const PartyDropdownMaster = (props) => {

    const { state, setState, fieldLabel } = props

    const dispatch = useDispatch();

    const { PartyList } = useSelector((state) => ({
        PartyList: state.PartyMasterReducer.partyList
    }));
    useEffect(() => {
        dispatch(getPartyListAPI())
    }, []);

    const Party_DropdownOptions = PartyList.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    return (
        <React.Fragment>
           
                <Label htmlFor="validationCustom01">{fieldLabel} </Label>
                <Select
                    id="Party "
                    name="Party"
                    value={state}
                    isSearchable={false}
                    className="react-dropdown"
                    classNamePrefix="dropdown"
                    options={Party_DropdownOptions}
                    onChange={(e) => {
                        setState((i) => {
                            const a = { ...i }
                            a.values.Party = e;
                            return a
                        })
                    }}
                />
        </React.Fragment >
    );
}

export default PartyDropdownMaster

