// import React, { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//     deleteCategoryTypeIDSuccess,
//     delete_CategoryType_ID,
//     editCategoryTypeID,
//     getCategoryTypelist,
//     saveCategoryTypeMaster_Success,
//     updateCategoryTypeIDSuccess
// } from "../../../store/actions";
// import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
// import CommonListPage from "../../../components/Common/CommonMasterListPage";
// import * as pageId from "../../../routes/allPageID"
// import * as url from "../../../routes/route_url";
// import { getCityList } from "../../../store/Administrator/CityRedux/action";
// import CityMaster from "./CityMaster";

// const CityList = () => {

//     const dispatch = useDispatch();
//     const reducers = useSelector(
//         (state) => ({
//             tableList: state.CityReducer.cityListData,
//             postMsg: state.categoryTypeReducer.PostData,
//             editData: state.categoryTypeReducer.editData,
//             updateMsg: state.categoryTypeReducer.updateMessage,
//             deleteMsg: state.categoryTypeReducer.deleteMessage,
//             userAccess: state.Login.RoleAccessUpdateData,
//             pageField: state.CommonPageFieldReducer.pageFieldList
//         })
//     );

//     const action = {
//         getList: getCityList,
//         editId: editCategoryTypeID,
//         deleteId: delete_CategoryType_ID,
//         postSucc: saveCategoryTypeMaster_Success,
//         updateSucc: updateCategoryTypeIDSuccess,
//         deleteSucc: deleteCategoryTypeIDSuccess,
//     }

//     //  This UseEffect => Featch Modules List data  First Rendering
//     useEffect(() => {
//         const page_Id = pageId.CITY_LIST
//         dispatch(commonPageFieldListSuccess(null))
//         dispatch(commonPageFieldList(page_Id))
//         dispatch(getCityList());
//     }, []);

//     const { pageField, userAccess = [] } = reducers;

//     return (
//         <React.Fragment>
//             {
//                 (pageField) ?
//                     <CommonListPage
//                         action={action}
//                         reducers={reducers}
//                         MasterModal={CityMaster}
//                         masterPath={url.CITY}
//                         ButtonMsgLable={"City"}
//                         deleteName={"Name"}
//                     />
//                     : null
//             }

//         </React.Fragment>
//     )
// }

// export default CityList;








import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    BreadcrumbShowCountlabel,
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
    GetOpeningBalance,
    ReceiptGoButtonMaster,
    ReceiptGoButtonMaster_Success,
    ReceiptListAPI, ReceiptListAPISuccess, ReceiptTypeAPI,
} from "../../../store/Accounting/Receipt/action";
import { initialFiledFunc, onChangeSelect } from "../../../components/Common/validationFunction";
import { getSupplier, Retailer_List } from "../../../store/CommonAPI/SupplierRedux/actions";
import { Go_Button } from "../../../components/Common/CommonButton";
import { Receipt_Print } from "../../../helpers/backend_helper";
import * as report from '../../../Reports/ReportIndex'
import { getpdfReportdata } from "../../../store/Utilites/PdfReport/actions";
import { C_DatePicker } from "../../../CustomValidateForm";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { url, mode, pageId } from "../../../routes/index"
import CityMaster from "./CityMaster";
import { getCityList } from "../../../store/Administrator/CityRedux/action";
import { getCityOnDistrict, getCityOnDistrictSuccess, getState } from "../../../store/Administrator/EmployeeRedux/action";
import { getDistrictOnState } from "../../../store/Administrator/PartyRedux/action";

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
            loading: state.ReceiptReducer.loading,
            tableList: state.EmployeesReducer.City,
            deleteMsg: state.ReceiptReducer.deleteMsg,
            updateMsg: state.BOMReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            district: state.PartyMasterReducer.DistrictOnState,
            State: state.EmployeesReducer.State,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,

        })
    );

    const { userAccess, pageField, State, district } = reducers;

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
                                <Select
                                    name="DistrictName"
                                    value={values.DistrictName}
                                    isSearchable={true}
                                    className="react-dropdown"
                                    classNamePrefix="dropdown"
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 2 })
                                    }}
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
                    (pageField) ?
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            newBtnPath={url.CITY}
                            masterPath={url.CITY}
                            HeaderContent={HeaderContent}
                            goButnFunc={goButtonHandler}
                            ButtonMsgLable={"CityMaster"}
                            deleteName={"FullReceiptNumber"}
                            MasterModal={CityMaster}

                        />
                        : null
                }
            </div>
        </React.Fragment>
    )
}

export default CityList;