import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { Go_Button } from "../../components/Common/CommonButton";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import { SSDD_List_under_Company, commonPageField, commonPageFieldSuccess } from "../../store/actions";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { postRetailerData_API, postRetailerData_API_Success } from "../../store/Report/RetailerDataRedux/action";
import { C_Select } from "../../CustomValidateForm";
import { ReportComponent } from "../ReportComponent";

const RetailerDataReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const [userPageAccessState, setUserAccState] = useState('');
    const [partydropdown, setPartydropdown] = useState({ value: 0, label: " All" })

    const reducers = useSelector(
        (state) => ({
            listBtnLoading: state.RetailerDataReducer.listBtnLoading,
            partyLoading: state.CommonAPI_Reducer.SSDD_ListLoading,
            RetailerGobtn: state.RetailerDataReducer.RetailerGobtn,
            userAccess: state.Login.RoleAccessUpdateData,
            SSDD_List: state.CommonAPI_Reducer.SSDD_List,
            pageField: state.CommonPageFieldReducer.pageField
        })
    );
    const { userAccess, SSDD_List, listBtnLoading, partyLoading, pageField } = reducers;
    const { RetailerGobtn = [] } = reducers

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
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.RETAILER_DATA_REPORT));
        dispatch(SSDD_List_under_Company());
        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(postRetailerData_API_Success([]));
        }
    }, [])

    useEffect(() => {
        try {
            if ((RetailerGobtn.Status === true) && (RetailerGobtn.StatusCode === 200)) {
                const { Data } = RetailerGobtn
                ReportComponent({      // Download CSV
                    pageField,
                    excelData: Data.ReportExportSerializerDetails,
                    excelFileName: "Retailer Data Report"
                })
                dispatch(postRetailerData_API_Success([]));
            }
            else if ((RetailerGobtn.Status === true) && (RetailerGobtn.StatusCode === 204)) {
                dispatch(postRetailerData_API_Success([]));
                customAlert({
                    Type: 3,
                    Message: JSON.stringify(RetailerGobtn.Message),
                })
            }
        }
        catch (e) { { _cfunc.CommonConsole(e) } }

    }, [RetailerGobtn]);

    const Party_Option = SSDD_List.map(i => ({
        value: i.id,
        label: i.Name
    }));

    Party_Option.unshift({
        value: 0,
        label: "All"
    });

    function goButtonHandler() {
        dispatch(postRetailerData_API(JSON.stringify({ "Party": partydropdown.value })));
    }

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="px-2   c_card_filter text-black" >
                    <div className="row" >

                        <Col sm={4} >
                            <FormGroup className="mb- row mt-3 mb-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px" }}>Party</Label>
                                <Col sm="8">
                                    <C_Select
                                        name="party"
                                        value={partydropdown}
                                        isSearchable={true}
                                        isLoading={partyLoading}
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

                        <Col sm="1" className="mt-3 mb-3 ">
                            <Go_Button onClick={goButtonHandler} loading={listBtnLoading} />
                        </Col>
                    </div>
                </div>

            </div>
        </React.Fragment >
    )
}

export default RetailerDataReport;