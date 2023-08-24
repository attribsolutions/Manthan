import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_DatePicker } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { MetaTags } from "react-meta-tags";
import Select from "react-select";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess, getBaseUnit_ForDropDown, getBaseUnit_ForDropDownSuccess } from "../../store/actions";
import C_Report from "../../components/Common/C_Report";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { damageStockReport_GoButton_API, damageStockReport_GoButton_API_Success } from "../../store/Report/DamageStockReportRedux/action";
import DynamicColumnHook from "../../components/Common/TableCommonFunc";
import { mode, pageId } from "../../routes/index"
import CustomTable from "../../CustomTable2";
import PartyDropdownForReport, { ReportComponent, ShowAndExcelBtn } from "../ReportComponent";

const DamageStockReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isSCMParty = _cfunc.loginIsSCMParty();

    const [headerFilters, setHeaderFilters] = useState('');
    const [userPageAccessState, setUserAccState] = useState('');

    const [partyDropdown, setPartyDropdown] = useState("");
    const [unitDropdown, setUnitDropdown] = useState("");
    const [tableData, setTableData] = useState([]);
    const [btnMode, setBtnMode] = useState(0);

    const reducers = useSelector(
        (state) => ({
            listBtnLoading: state.DamageStockReportReducer.listBtnLoading,
            goButtonData: state.DamageStockReportReducer.StockReportGobtn,
            BaseUnit: state.ItemMastersReducer.BaseUnit,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        })
    );

    const { userAccess, BaseUnit, pageField, goButtonData = [], } = reducers;
    const { fromdate = currentDate_ymd, todate = currentDate_ymd } = headerFilters;

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

        dispatch(getBaseUnit_ForDropDown());
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.DAMAGE_STOCK_REPORT))
        dispatch(BreadcrumbShowCountlabel(`Count:${0}`));
        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(damageStockReport_GoButton_API_Success([]));
            dispatch(getBaseUnit_ForDropDownSuccess([]));
        }
    }, [])

    useEffect(() => {
        if (tableData.length === 0) {
            setBtnMode(0)
        }
    }, [tableData]);

    useEffect(() => {

        try {
            if ((goButtonData.Status === true) && (goButtonData.StatusCode === 200)) {
                setBtnMode(0);
                if (btnMode === 2) {
                    ReportComponent({      // Download CSV
                        pageField,
                        excelData: goButtonData.Data,
                        excelFileName: "Damage Stock Export"
                    })
                    dispatch(damageStockReport_GoButton_API_Success([]));
                }
                else {
                    setTableData(goButtonData.Data)
                }
            }
            else if ((goButtonData.Status === true)) {
                setTableData([]);
            }
            setBtnMode(0);
        }
        catch (e) { console.log(e) }

    }, [goButtonData]);

    const [tableColumns] = DynamicColumnHook({ pageField })

    const BaseUnit_DropdownOptions = BaseUnit.filter(index => index.Name === "No" || index.Name === "Kg" || index.Name === "Box")
        .map(data => ({
            value: data.id,
            label: data.Name
        }));

    function goButtonHandler(e, btnMode) {
        try {
            setBtnMode(btnMode)
            if (unitDropdown === "") {
                customAlert({
                    Type: 3,
                    Message: "Please Select Unit"
                })
                setBtnMode(0)
                return
            }
            else if ((isSCMParty) && (partyDropdown === "")) {
                customAlert({ Type: 3, Message: "Please Select Party" });
                setBtnMode(0)
                return;
            }

            const jsonBody = JSON.stringify({
                "FromDate": fromdate,
                "ToDate": todate,
                "Unit": unitDropdown.value,
                "PartyID": partyDropdown === "" ? _cfunc.loginPartyID() : partyDropdown.value,
            });

            dispatch(damageStockReport_GoButton_API({ jsonBody }))

        } catch (error) { _cfunc.CommonConsole(error) }
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...headerFilters }
        newObj.fromdate = date
        setHeaderFilters(newObj)
    }

    function todateOnchange(e, date) {
        let newObj = { ...headerFilters }
        newObj.todate = date
        setHeaderFilters(newObj)
    }

    function partyOnChangeHandler(e) {
        setPartyDropdown(e);
        setTableData([]);
    }

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="px-2 c_card_filter text-black mb-1" >
                    <div className="row" >
                        <Col sm={(isSCMParty) ? 2 : 3} className="">
                            <FormGroup className=" mb-2 row mt-3 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "66px" }}>FromDate</Label>
                                <Col sm={7}>
                                    <C_DatePicker
                                        name='fromdate'
                                        value={fromdate}
                                        disabled={true}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={(isSCMParty) ? 2 : 3} className="">
                            <FormGroup className=" row mt-3 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "60px" }}>ToDate</Label>
                                <Col sm={7}>
                                    <C_DatePicker
                                        nane='todate'
                                        value={todate}
                                        disabled={true}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={(isSCMParty) ? 2 : 3}>
                            <FormGroup className=" row mt-3 " >
                                <Label className="col-sm-2 p-2"
                                    style={{ width: "85px" }}>Unit</Label>
                                <Col sm={7}>
                                    <Select
                                        name="Unit"
                                        value={unitDropdown}
                                        // isDisabled={tableData.length > 0 && true}
                                        isSearchable={true}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={BaseUnit_DropdownOptions}
                                        onChange={(e) => {
                                            setUnitDropdown(e);
                                            setTableData([]);
                                        }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col >

                        <PartyDropdownForReport  // Party Dropdown if isSCMParty true then Party dropdown show
                            partyValue={partyDropdown}
                            setPartyValue={partyOnChangeHandler}
                        />

                        <ShowAndExcelBtn  // Excel download and Show button function
                            showLoading={btnMode === 1 && true}
                            excelLoading={btnMode === 2 && true}
                            showOnClick={(e) => goButtonHandler(e, 1)}
                            excelOnClick={(e) => goButtonHandler(e, 2)}
                        />

                    </div>
                </div>

                <CustomTable
                    keyField={"id"}
                    data={tableData}
                    columns={tableColumns}
                    paginationEnabled={false}
                    onDataSizeChange={({ dataCount }) => {
                        dispatch(BreadcrumbShowCountlabel(`Count:${dataCount}`));
                    }}
                    noDataIndication={<div className="text-danger text-center table-cursor-pointer"  >Data Not available</div>}
                />

            </div>
            <C_Report />
        </React.Fragment >
    )
}

export default DamageStockReport;;