

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    commonPageFieldList,
    commonPageFieldListSuccess
} from "../../../store/actions";
import Select from "react-select";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import {
    deleteReceiptList,
    deleteReceiptList_Success,
    ReceiptListAPI,
} from "../../../store/Accounting/Receipt/action";
import { initialFiledFunc, onChangeSelect } from "../../../components/Common/validationFunction";
import { Go_Button, Listloader } from "../../../components/Common/CommonButton";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { url, pageId } from "../../../routes/index"
import CityMaster from "./CityMaster";
import { getCityOnDistrict, getCityOnDistrictSuccess, getState } from "../../../store/Administrator/EmployeeRedux/action";
import { getDistrictOnState } from "../../../store/Administrator/PartyRedux/action";
import { C_Select } from "../../../CustomValidateForm";

const CityList = () => {

    const dispatch = useDispatch();
    const history = useHistory();


    const fileds = {
        StateName: "",
        DistrictName: "",
        DistrictID: ""
    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [userAccState, setUserAccState] = useState('');
    const [subPageMode] = useState(history.location.pathname);

    const reducers = useSelector(
        (state) => ({
            listBtnLoading: state.CityReducer.listBtnLoading,
            tableList: state.EmployeesReducer.City,
            deleteMsg: state.ReceiptReducer.deleteMsg,
            district: state.PartyMasterReducer.DistrictOnState,
            State: state.EmployeesReducer.State,
            userAccess: state.Login.RoleAccessUpdateData,
            districtDropDownLoading: state.PartyMasterReducer.districtDropDownLoading,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );

    const { userAccess, pageField, State, district,districtDropDownLoading } = reducers;

    const values = { ...state.values }

    const action = {
        getList: ReceiptListAPI,
        deleteId: deleteReceiptList,
        postSucc: postMessage,
        deleteSucc: deleteReceiptList_Success
    }

    useEffect(() => {
        const page_Id = pageId.CITY_LIST
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(getState());
        dispatch(getCityOnDistrictSuccess([]))
    }, []);

    useEffect(() => {
        const page_Id = pageId.CITY_LIST
        let userAcc = userAccess.find((inx) => {
            return (inx.id === page_Id)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
        }
    }, [userAccess])


    const State_DropdownOptions = State.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const District_DropdownOptions = district.map((data) => ({
        value: data.id,
        label: data.Name
    }));



    function goButtonHandler() {

        dispatch(getCityOnDistrict(values.DistrictName.value))

    }

    function District_Dropdown_Handler(e) {

        setState((i) => {
            const a = { ...i }
            a.values.DistrictID = "";
            a.hasValid.DistrictID.valid = false
            return a
        })
    }

    function State_Dropdown_Handler(e) {
        dispatch(getCityOnDistrictSuccess([]))
        dispatch(getDistrictOnState(e.value))
        setState((i) => {
            const a = { ...i }
            a.values.DistrictName = "";
            a.hasValid.DistrictName.valid = false
            return a
        })
    }


    const HeaderContent = () => {
        return (
            <div className="px-2   c_card_filter text-black" >
                <div className="row" >
                    <Col sm="5" className="">
                        <FormGroup className="mb- row mt-2 " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "83px" }}>State</Label>
                            <Col sm="7">
                                <Select
                                    name="StateName"
                                    id="state"
                                    value={values.StateName}
                                    isSearchable={true}
                                    classNamePrefix="dropdown"
                                    autoFocus={true}
                                    options={State_DropdownOptions}
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 2 })
                                    }}
                                    onChange={(hasSelect, evn) => {
                                        onChangeSelect({ hasSelect, evn, state, setState, })
                                        State_Dropdown_Handler(hasSelect)
                                    }}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col sm="6" className="">
                        <FormGroup className="mb- row mt-2 " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "65px" }}>District</Label>
                            <Col sm="7">
                                <C_Select
                                    name="DistrictName"
                                    value={values.DistrictName}
                                    isSearchable={true}
                                    className="react-dropdown"
                                    classNamePrefix="dropdown"
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 2 })
                                    }}
                                    isLoading={districtDropDownLoading}
                                    options={District_DropdownOptions}
                                    onChange={(hasSelect, evn) => {
                                        onChangeSelect({ hasSelect, evn, state, setState, })
                                        District_Dropdown_Handler(hasSelect)
                                    }}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col sm="1" className="mt-2 ">
                        <Go_Button loading={reducers.loading} onClick={goButtonHandler} />
                    </Col>
                </div>
            </div>
        )
    }

    return (
        <React.Fragment>
            <div className="page-content">
            
                {
                   
                        (pageField) &&
                            <CommonPurchaseList
                                action={action}
                                reducers={reducers}
                                showBreadcrumb={false}
                                newBtnPath={url.CITY}
                                masterPath={url.CITY}
                                HeaderContent={HeaderContent}
                                goButnFunc={goButtonHandler}
                                ButtonMsgLable={"CityMaster"}
                                deleteName={"DistrictName"}
                                MasterModal={CityMaster}

                            />
                }
                
            </div>
        </React.Fragment>
    )
}

export default CityList;