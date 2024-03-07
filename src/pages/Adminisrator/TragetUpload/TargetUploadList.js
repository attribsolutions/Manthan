import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import {
    commonPageFieldList,
    commonPageFieldListSuccess,
} from "../../../store/actions";
import {
    editGroupID,
    updateGroupIDSuccess
} from "../../../store/Administrator/GroupRedux/action";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { Go_Button, PageLoadingSpinner } from "../../../components/Common/CommonButton";
import TargetUpload from "./TargetUploadMaster";
import { deleteTargetUploadSuccess, delete_TargetUpload_ID, editTargetUploadID, getTargetUploadList, getTargetUploadListSuccess, saveTargetUploadMaster_Success } from "../../../store/Administrator/TargetUploadRedux/action";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import { getPreviousMonthAndYear } from "../../../components/Common/CommonFunction";
import { initialFiledFunc } from "../../../components/Common/validationFunction";
import Select from "react-select";
import { allLabelWithBlank } from "../../../components/Common/CommonErrorMsg/HarderCodeData";

const SelectedMonth = () => getPreviousMonthAndYear({ date: new Date(), Privious: 0 })
const fileds = () => ({
    PartyName: "",
    SelectedMonth: SelectedMonth(),
})

const TargetUploadList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const [subPageMode] = useState(history.location.pathname);
    const [state, setState] = useState(() => initialFiledFunc(fileds()))
    const [PartyDropdown, setPartyDropdown] = useState(allLabelWithBlank);

    const reducers = useSelector(
        (state) => ({
            listBtnLoading: state.TargetUploadReducer.listBtnLoading,
            tableList: state.TargetUploadReducer.targetList,
            editData: state.TargetUploadReducer.editData,
            updateMsg: state.TargetUploadReducer.updateMsg,
            deleteMsg: state.TargetUploadReducer.deleteMsg,
            postMsg: state.TargetUploadReducer.postMsg,
            Parties: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const values = { ...state.values }

    const { Parties } = reducers

    const action = {
        getList: getTargetUploadList,
        editId: editTargetUploadID,
        deleteId: delete_TargetUpload_ID,
        postSucc: saveTargetUploadMaster_Success,
        updateSucc: updateGroupIDSuccess,
        deleteSucc: deleteTargetUploadSuccess
    }

    useEffect(() => {
        const page_Id = pageId.TARGET_UPLOAD_LIST
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(getTargetUploadList());
        goButtonHandler()
        return () => {
            dispatch(getTargetUploadListSuccess([]));
            dispatch(commonPageFieldListSuccess(null))
        }
    }, []);




    const selectDeleteBtnHandler = (row = []) => {
        let isAllcheck = row.filter(i => (i.hasAllSelect))
        let isRowcheck = row.filter(i => (i.selectCheck))
        let ischeck = [];
        if (isAllcheck.length > 0 && isRowcheck.length > 0 && isAllcheck.length === isRowcheck.length) {
            ischeck = row.filter(i => !(i.forceSelectDissabled))
        } else {
            ischeck = row.filter(i => (!i.forceSelectDissabled && i.selectCheck))
        }
        if (!ischeck.length > 0) {
            customAlert({
                Type: 4,
                Message: alertMessages.selectOneCheckbox,
            });
            return
        }

        let MonthString = ischeck.map(obj => obj.Month).join(',')
        let YearString = ischeck.map(obj => obj.Year).join(',')
        let PartyIDString = ischeck.map(obj => obj.PartyID).join(',')
        let jsonBody = JSON.stringify({ Month: MonthString, Year: YearString, Party: PartyIDString })
        dispatch(delete_TargetUpload_ID({ jsonBody }))
    }


    function goButtonHandler() {
        try {
            const date = values.SelectedMonth
            const [year, month] = date.split('-');
            const jsonBody = {
                Month: parseInt(month),
                Year: parseInt(year),
                Party: PartyDropdown.value,
            }
            dispatch(getTargetUploadList({ jsonBody }))

        }
        catch (error) { console.log(error) }
        return
    };

    function MonthAndYearOnchange(e,) {
        const selectedMonth = e.target.value
        setState((i) => {
            const a = { ...i }
            a.values.SelectedMonth = selectedMonth;
            a.hasValid.SelectedMonth.valid = true
            return a
        })

    }
    const partyOnchange = (e) => {
        debugger
        setPartyDropdown(e)
    }

    const Party_Option = Parties.map(i => ({
        value: i.id,
        label: i.Name
    }));
    Party_Option.unshift(allLabelWithBlank)


    const { pageField, goBtnLoading } = reducers
    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />


            <div className="px-3 c_card_filter header text-black mb-1" >
                <Row >
                    <Col sm="6" className="mt-1 mb-1">
                        <FormGroup className="row mt-2" >
                            <Label className="col-sm-1 p-2"
                                style={{ width: "115px", marginRight: "0.1cm" }}>Month </Label>
                            <Col sm="7">
                                <Input className="form-control"
                                    type="month"
                                    defaultValue={values.SelectedMonth}
                                    id="example-month-input"
                                    onChange={MonthAndYearOnchange}

                                />
                            </Col>
                        </FormGroup>
                    </Col >

                    <Col sm="6" className="mt-1 mb-1" >
                        <FormGroup className=" row mt-2 " >
                            <Label className="col-sm-1 p-2"
                                style={{ width: "115px", marginRight: "0.1cm" }}>Party</Label>
                            <Col sm="7">
                                <Select
                                    name="Party"
                                    value={PartyDropdown}
                                    isSearchable={true}
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 2 })
                                    }}
                                    options={Party_Option}
                                    onChange={(e) => { partyOnchange(e) }}
                                />
                            </Col>
                            <Col md={1}></Col>
                            <Col sm="1" className="mx-6" >
                                < Go_Button
                                    loading={goBtnLoading}
                                    onClick={(e) => goButtonHandler()}
                                />
                            </Col>
                        </FormGroup>
                    </Col >
                </Row>
            </div>
            {
                (pageField) &&
                <CommonPurchaseList
                    action={action}
                    reducers={reducers}
                    MasterModal={TargetUpload}
                    goButnFunc={goButtonHandler}
                    newBtnPath={url.TARGET_UPLOAD}
                    masterPath={url.TARGET_UPLOAD}
                    selectCheckParams={{
                        isShow: (subPageMode === url.TARGET_UPLOAD_LIST),
                        selectSaveBtnHandler: selectDeleteBtnHandler,
                        selectSaveBtnLabel: "Delete",
                        selectHeaderLabel: "Select",
                        selectSaveBtnLoading: reducers.listBtnLoading,
                        pageloading: reducers.listBtnLoading     ////   non selectable  till page loading
                    }}

                    ButtonMsgLable={"Target Upload"}
                    deleteName={"SheetNo"}
                />
            }
        </React.Fragment>
    )
}

export default TargetUploadList;
