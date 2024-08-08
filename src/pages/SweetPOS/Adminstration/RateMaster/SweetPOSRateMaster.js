import React, { useEffect, useState, } from "react";
import { MetaTags } from "react-meta-tags";
import { commonPageField, commonPageFieldSuccess, postSelect_Field_for_dropdown, postSelect_Field_for_dropdown_Success } from "../../../../store/actions";
import { useHistory } from "react-router-dom";
import { BreadcrumbShowCountlabel } from "../../../../store/Utilites/Breadcrumb/actions";
import { useDispatch, useSelector } from "react-redux";
import { Go_Button, PageLoadingSpinner, SaveButton } from "../../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    date_ymd_func,
    loginCompanyID,
    metaTagLabel,
} from "../../../../components/Common/CommonFunction";
import * as pageId from "../../../../routes/allPageID"
import * as mode from "../../../../routes/PageMode"
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { globalTableSearchProps } from "../../../../components/Common/SearchBox/MySearch";
import SaveButtonDraggable from "../../../../components/Common/saveButtonDraggable";
import { getPosRateList_Action, getPosRateListSuccess, PosRateSave_Action, PosRateSave_Success } from "../../../../store/SweetPOSStore/Administrator/SweetPOSRateMasterRedux/action";
import { customAlert } from "../../../../CustomAlert/ConfirmDialog";
import { url } from "../../../../routes";
import { Col, FormGroup, Input, Label } from "reactstrap";
import { C_DatePicker, C_Select, CInput, decimalRegx } from "../../../../CustomValidateForm";
import { alertMessages } from "../../../../components/Common/CommonErrorMsg/alertMsg";

const SweetPOSRateMaster = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();
    const currentDate_ymd = date_ymd_func();

    const [pageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState(123);
    const [effectiveFrom, setEffectiveFrom] = useState(currentDate_ymd);
    const [rateTypeSelect, setRateTypeSelect] = useState([]);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        saveBtnloading,
        postMsg,
        listBtnLoading,
        PosRateMasterListData,
        RateTypeList,
        userAccess } = useSelector((state) => ({
            saveBtnloading: state.PosRateMasterReducer.saveBtnloading,
            postMsg: state.PosRateMasterReducer.postMsg,
            listBtnLoading: state.PosRateMasterReducer.listBtnLoading,
            PosRateMasterListData: state.PosRateMasterReducer.PosRateMasterListData,
            RateTypeList: state.PartyMasterBulkUpdateReducer.SelectField,
            userAccess: state.Login.RoleAccessUpdateData,
        }));

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        const page_Id = pageId.SWEET_POS_RATE_MASTER
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(BreadcrumbShowCountlabel(`Count:${0}`));
        return () => {
            dispatch(getPosRateListSuccess([]));
            dispatch(postSelect_Field_for_dropdown_Success([]));
        }
    }, []);

    useEffect(() => { // Rate Type Dropdown useEffect
        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
            TypeID: 173
        });
        dispatch(postSelect_Field_for_dropdown(jsonBody));
    }, []);

    const RateTypeListOptions = RateTypeList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

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
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    //This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(PosRateSave_Success({ Status: false }));
            dispatch(getPosRateListSuccess([]));
            // goButtonHandler();

            if (pageMode === "other") {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                customAlert({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                    RedirectPath: url.SWEET_POS_RATE_MASTER
                })

            }
        }
        else if (postMsg.Status === true) {
            dispatch(PosRateSave_Success({ Status: false }))
            dispatch(getPosRateListSuccess([]));
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    const goButtonHandler = () => {
        try {
            if ((rateTypeSelect.length === 0)) {
                customAlert({ Type: 3, Message: alertMessages.rateTypeIsRequired });
                return;
            };
            const jsonBody = JSON.stringify({
                "EffectiveFrom": effectiveFrom,
                "POSRateType": rateTypeSelect.value,
            });

            dispatch(getPosRateList_Action({ jsonBody }));
        } catch (error) { }
    };

    const pagesListColumns = [
        {
            text: "ItemName",
            dataField: "ItemName",
            headerStyle: () => { return { width: '300px' } },
        },
        {
            text: "Rate",
            dataField: "Rate",
            headerStyle: () => { return { width: '150px' } },
            formatter: (cellContent, row) => {

                return (<span style={{ justifyContent: 'center' }}>
                    < CInput
                        key={`posRate${row.ItemID}`}
                        id=""
                        type="text"
                        defaultValue={row.Rate}
                        cpattern={decimalRegx}
                        className="col col-sm text-end"
                        onChange={(e) => { row["Rate"] = e.target.value }}
                    />
                </span>)
            },
        },

        {
            text: "Primary Rate (MRP)",
            dataField: "PrimaryRate",
            headerStyle: () => { return { width: '100px' } },
            formatter: (cellContent, row) => {

                return (<span style={{ justifyContent: 'center' }}>
                    < CInput
                        key={`posRate${row.ItemID}`}
                        id=""
                        type="text"
                        disabled={true}
                        defaultValue={row.PrimaryRate}
                        cpattern={decimalRegx}
                        className="col col-sm text-end"
                        onChange={(e) => { row["PrimaryRate"] = e.target.value }}
                    />
                </span>)
            },
        },
        {
            text: "Default Rate",
            dataField: "IsChangeRateToDefault",
            headerStyle: () => { return { width: '200px' } },
            formatter: (cellContent, row) => {

                return (<span style={{ justifyContent: 'center' }}>
                    < Input
                        key={`posRate${row.ItemID}`}
                        id=""
                        type="checkbox"
                        defaultChecked={row.IsChangeRateToDefault}
                        className="col col-sm text-end"
                        onChange={(e) => { row["IsChangeRateToDefault"] = e.target.checked }}
                    />
                </span>)
            },
        },
    ];

    const SaveHandler = async (event) => {

        event.preventDefault();
        try {

            if (rateTypeSelect.length === 0) {
                customAlert({ Type: 3, Message: alertMessages.rateTypeIsRequired });
                return;
            }
            let filteredData = PosRateMasterListData.filter(item => ((item.PrimaryRate !== null) && (item.PrimaryRate !== null)));

            const jsonBody = JSON.stringify(filteredData.map((i) => ({
                "POSRateType": rateTypeSelect.value,
                "IsChangeRateToDefault": i.IsChangeRateToDefault,
                "EffectiveFrom": effectiveFrom,
                "Rate": i.Rate === null ? i.PrimaryRate : i.Rate,
                "ItemID": i.ItemID,
            })))

            dispatch(PosRateSave_Action({ jsonBody }));

        } catch (e) { }
    };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <PageLoadingSpinner isLoading={(listBtnLoading)} />
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content" >
                    <div className="px-2   c_card_header text-black " >
                        <div className="row">

                            <Col sm="5">
                                <FormGroup className=" row mt-2  " >
                                    <Label className="col-sm-3 p-2"
                                        style={{ width: "83px" }}> Effective From</Label>
                                    <Col sm="6">
                                        <C_DatePicker
                                            id="EffectiveDate"
                                            name="EffectiveDate"
                                            placeholder={"DD/MM/YYYY"}
                                            value={effectiveFrom}
                                            onChange={(e, date) => {
                                                setEffectiveFrom(date);
                                                dispatch(getPosRateListSuccess([]));
                                            }}
                                            options={{
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                            }}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col sm="5">
                                <FormGroup className=" row mt-2  " >
                                    <Label className="col-sm-5 p-2"
                                        style={{ width: "83px" }}> Rate Type</Label>
                                    <Col sm="6">
                                        <C_Select
                                            name="rateType"
                                            value={rateTypeSelect}
                                            isSearchable={true}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            autoFocus={true}
                                            options={RateTypeListOptions}
                                            onChange={(e) => {
                                                setRateTypeSelect(e);
                                                dispatch(getPosRateListSuccess([]));
                                            }}
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col sm={1} className="mt-2">
                                <Go_Button
                                    loading={listBtnLoading}
                                    onClick={goButtonHandler} />
                            </Col>
                        </div>
                    </div>

                    <form noValidate>
                        <ToolkitProvider
                            keyField="ItemID"
                            data={PosRateMasterListData}
                            columns={pagesListColumns}
                            search
                        >
                            {toolkitProps => (
                                <React.Fragment>
                                    <div className="table">
                                        <BootstrapTable
                                            keyField={"ItemID"}
                                            bordered={true}
                                            striped={true}
                                            noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                                            classes={"table align-middle table-nowrap table-hover"}
                                            headerWrapperClasses={"thead-light"}
                                            {...toolkitProps.baseProps}
                                            onDataSizeChange={({ dataSize }) => {
                                                dispatch(BreadcrumbShowCountlabel(`Count:${dataSize}`));
                                            }}
                                        />
                                        {globalTableSearchProps(toolkitProps.searchProps)}
                                    </div>

                                </React.Fragment>
                            )
                            }
                        </ToolkitProvider>

                        {PosRateMasterListData.length > 0 &&
                            <SaveButtonDraggable>
                                <SaveButton pageMode={pageMode}
                                    loading={saveBtnloading}
                                    onClick={SaveHandler}
                                    userAcc={userPageAccessState}
                                />
                            </SaveButtonDraggable>
                        }

                    </form>
                </div>
            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default SweetPOSRateMaster
