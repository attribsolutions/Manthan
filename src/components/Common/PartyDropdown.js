import React, { useLayoutEffect, } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Col, FormGroup, Label, } from "reactstrap";
import Select from "react-select";
import { getPartyListAPI } from "../../store/Administrator/PartyRedux/action";
import { Change_Button, Go_Button } from "./CommonButton";


const PartyDropdown_Common = (props) => {

    const dispatch = useDispatch();

    const { partySelect, setPartyFunc, goButtonHandler, change_ButtonHandler, changeBtnShow } = props


    const { partyList } = useSelector((state) => ({
        partyList: state.PartyMasterReducer.partyList,
    }));

    useLayoutEffect(() => {
        dispatch(getPartyListAPI())
    }, []);

    const party_DropdownOptions = partyList.map((data) => ({
        value: data.id,
        label: data.Name
    }));


    return (
        <React.Fragment>
            <div className="px-2   c_card_header text-black  " >
                <div className="row pt-2">
                    <Col sm="5">
                        <FormGroup className=" row " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "83px" }}>Party</Label>
                            <Col sm="6">
                                <Select
                                    value={partySelect}
                                    isSearchable={true}
                                    className="react-dropdown"
                                    classNamePrefix="dropdown"
                                    options={party_DropdownOptions}
                                    onChange={(e) => { setPartyFunc(e) }}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    {goButtonHandler &&
                        <Col sm="1" >
                            {!changeBtnShow ?
                                < Go_Button onClick={() => goButtonHandler()} />
                                :
                                <Change_Button onClick={() => change_ButtonHandler()} />
                            }
                        </Col>
                    }
                </div>
            </div>
        </React.Fragment >
    )
}
export default PartyDropdown_Common
