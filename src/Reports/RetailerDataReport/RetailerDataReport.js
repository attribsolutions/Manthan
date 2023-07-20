import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { Go_Button } from "../../components/Common/CommonButton";
import * as _cfunc from "../../components/Common/CommonFunction";
import { url, mode, } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import Select from "react-select";
import * as XLSX from 'xlsx';
import { SSDD_List_under_Company } from "../../store/actions";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { postRetailerData_API, postRetailerData_API_Success } from "../../store/Report/RetailerDataRedux/action";

const RetailerDataReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const isSCMParty = _cfunc.loginIsSCMParty();

    const [userPageAccessState, setUserAccState] = useState('');
    const [partydropdown, setPartydropdown] = useState('')


    const reducers = useSelector(
        (state) => ({
            listBtnLoading: state.RetailerDataReducer.listBtnLoading,
            RetailerGobtn: state.RetailerDataReducer.RetailerGobtn,
            userAccess: state.Login.RoleAccessUpdateData,
            SSDD_List: state.CommonAPI_Reducer.SSDD_List,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );
    const { userAccess, RetailerGobtn, SSDD_List } = reducers;


    // Featch Modules List data  First Rendering
    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;
        if (hasShowModal) {
            locationPath = props.masterPath;
        };
        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (userAcc) {
            setUserAccState(userAcc)
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(() => {
        dispatch(SSDD_List_under_Company());
    }, [])

    useEffect(() => {

        if (RetailerGobtn.Status === true && RetailerGobtn.StatusCode === 200) {
            const { Data } = RetailerGobtn
            const worksheet = XLSX.utils.json_to_sheet(Data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "RetailerDataReport");
            XLSX.writeFile(workbook, "Retailer Data Report.xlsx");
            dispatch(postRetailerData_API_Success([]));
        }
    }, [RetailerGobtn]);


    const Party_Option = SSDD_List.map(i => ({
        value: i.id,
        label: i.Name
    }));


    function goButtonHandler() {
        if (partydropdown === "") {
            customAlert({
                Type: 3,
                Message: "Please Select Party",
            })
        }
        else {
            const btnId = `gobtn-${url.RETAILER_DATA_REPORT}`
            const jsonBody = JSON.stringify({
                "Party": partydropdown.value
            });
            dispatch(postRetailerData_API({ jsonBody, btnId }));
        }
        
    }

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="px-2   c_card_filter text-black" >
                    <div className="row" >

                        {isSCMParty &&
                            <Col sm={3} className="">
                                <FormGroup className="mb- row mt-3" >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "65px" }}>Party</Label>
                                    <Col sm="7">
                                        <Select
                                            name="party"
                                            value={partydropdown}
                                            isSearchable={true}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                            options={Party_Option}
                                            onChange={(e) => { setPartydropdown(e) }}

                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        }

                        <Col sm="1" className="mt-3 ">
                            <Go_Button onClick={goButtonHandler} loading={reducers.listBtnLoading} />
                        </Col>
                    </div>
                </div>

            </div>
        </React.Fragment >
    )
}

export default RetailerDataReport;