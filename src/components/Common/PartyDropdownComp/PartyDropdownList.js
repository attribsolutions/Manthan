import React, { useEffect, useState, } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, FormGroup, Label } from "reactstrap";
import Select from "react-select";
import { getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";

const PartyDropdownList = (props) => {
    
    const dispatch = useDispatch();

    const { state, setState, action } = props

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

    // const goButtonHandler = () => {
    //     
    //     if (state.length === 0) {
    //         customAlert({
    //             Type: 3,
    //             Message: "Select Party",
    //         })
    //         return;
    //     }
    //     const jsonBody = JSON.stringify({
    //         CompanyID: loginCompanyID(),
    //         PartyID: loginPartyID(),

    //     });
    //     dispatch(action(jsonBody));
    // }

    return (
        <React.Fragment>
            <div className="px-2   c_card_header text-black" >
                <div className="row">
                    <Col sm="5">
                        <FormGroup className=" row mt-3 " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "83px" }}>Party</Label>
                            <Col sm="6">
                                <Select
                                    name="RoutesName"
                                    value={state}
                                    isSearchable={true}
                                    className="react-dropdown"
                                    classNamePrefix="dropdown"
                                    options={Party_DropdownOptions}
                                    onChange={(e) => { setState(e) }}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col sm="1" className="mx-4 ">
                        <Button type="button" color="btn btn-outline-success border-2 font-size-12 m-3  "
                            onClick={() => action()}
                        >Go</Button>
                    </Col>
                </div>
            </div>
        </React.Fragment >
    );
}

export default PartyDropdownList

