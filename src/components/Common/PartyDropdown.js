import React, { useLayoutEffect, } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, FormGroup, Label, } from "reactstrap";
import Select from "react-select";
import { getPartyListAPI, getPartyListAPISuccess } from "../../store/Administrator/PartyRedux/action";
import { Change_Button, Go_Button } from "./CommonButton";
import { C_Select } from "../../CustomValidateForm";


const PartyDropdown_Common = (props) => {

    const dispatch = useDispatch();

    const { partySelect, setPartyFunc, goButtonHandler, change_ButtonHandler, changeBtnShow } = props


    const { partyList, partyDropDownLoading } = useSelector((state) => ({
        partyDropDownLoading: state.PartyMasterReducer.goBtnLoading,
        partyList: state.PartyMasterReducer.partyList,
    }));

    useLayoutEffect(() => {
        dispatch(getPartyListAPI())
        return () => {
            dispatch(getPartyListAPISuccess([]))
        }
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
                                <C_Select
                                    value={partySelect}
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 2 })
                                    }}
                                    isSearchable={true}
                                    className="react-dropdown"
                                    classNamePrefix="dropdown"
                                    isLoading={partyDropDownLoading}
                                    options={party_DropdownOptions}
                                    isDisabled={changeBtnShow}
                                    onChange={(e) => { setPartyFunc(e) }}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    {goButtonHandler &&
                        <Col sm="1" >
                            {!changeBtnShow ?
                                < Go_Button
                                    forceDisabled={partyDropDownLoading}
                                    onClick={() => goButtonHandler()} />
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
