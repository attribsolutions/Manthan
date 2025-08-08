import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../../components/Common/CommonButton";
import { C_DatePicker, C_Select } from "../../../CustomValidateForm";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { mode, pageId } from "../../../routes/index"
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import DynamicColumnHook from "../../../components/Common/TableCommonFunc";
import GlobalCustomTable from "../../../GlobalCustomTable";
import { changeCommonPartyDropDetailsAction } from "../../../store/Utilites/PartyDrodown/action";
import { DataExportTo_SAP_Action, DataExportTo_SAP_Action_Success, Fetch_UploadFile_Action } from "../../../store/Administrator/ExportToSAPRedux/action";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
;

const DataExportToSAP = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isFrenchieses = _cfunc.loginUserIsFranchisesRole();


    const [headerFilters, setHeaderFilters] = useState({ InvoiceDate: currentDate_ymd, });
    const [userPageAccessState, setUserAccState] = useState('');
    const [PartyDropdown, setPartyDropdown] = useState([]);

    const [tableData, setTableData] = useState([]);


    const {
        pageField,
        userAccess,
        partyDropdownLoadings,
        UploaledFileData,
        Party,
        ExportToSAPData
    } = useSelector((state) => ({
        ExportToSAPData: state.ExportToSapReducer.ExportToSAPData,
        UploaledFileData: state.ExportToSapReducer.UploaledFileData,
        partyDropdownLoadings: state.CommonPartyDropdownReducer.partyDropdownLoading,
        Party: state.CommonPartyDropdownReducer.commonPartyDropdownOption,

        Distributor: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    })
    );




    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.DATA_EXPORT_TO_SAP))
        dispatch(BreadcrumbShowCountlabel(`Count:${0}`));
        dispatch(changeCommonPartyDropDetailsAction({ isShow: false }))//change party drop-down show false
        dispatch(Fetch_UploadFile_Action())
        return () => {

            setTableData([]);
            dispatch(changeCommonPartyDropDetailsAction({ isShow: true }))//change party drop-down restore show state
            dispatch(DataExportTo_SAP_Action_Success([]))
        }
    }, []);

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

        dispatch(BreadcrumbShowCountlabel(`Count:${UploaledFileData.length}`));

    }, [UploaledFileData])


    useEffect(() => {
        debugger
        if (ExportToSAPData?.StatusCode === 200 && ExportToSAPData?.Status === true) {
            dispatch(Fetch_UploadFile_Action())

            customAlert({
                Type: 1,
                Message: ExportToSAPData.Message,
            })
        } else if (ExportToSAPData?.Status === false && [404, 400, 204].includes(ExportToSAPData?.StatusCode)) {
            dispatch(DataExportTo_SAP_Action_Success([]))
            customAlert({
                Type: 9,
                Message: ExportToSAPData.Message,
            })
        }
    }, [ExportToSAPData])



    const [tableColumns] = DynamicColumnHook({ pageField, })



    function UploadHandler(e) {
        debugger
        if (!PartyDropdown) {
            customAlert({ Type: 3, Message: alertMessages.selectPartyName });
            return
        }
        const jsonBody = JSON.stringify({
            "InvoiceDate": headerFilters.InvoiceDate,
            "Party": isFrenchieses ? String(_cfunc.loginPartyID()) : PartyDropdown.map(i => i.value).join(',')
        });
        let config = { jsonBody }
        dispatch(DataExportTo_SAP_Action(config));
    }

    function DateOnchange(e, date) {
        let newObj = { ...headerFilters }
        newObj.InvoiceDate = date
        setHeaderFilters(newObj)

    }

    const Party_Option = Party.map(i => ({
        value: i.id,
        label: i.Name,
        PartyType: i.PartyType
    })).filter(index => index.PartyType === "Franchises");
    // Party_Option.unshift(allLabelWithZero);

    function PartyDrodownOnChange(e) {
        setPartyDropdown(e);
        setTableData([]);
    }


    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="px-2   c_card_filter text-black " >
                    <Row>
                        <Col sm={3} className="">
                            <FormGroup className=" row mt-2  " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "100px" }}>Invoice Date</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        name='FromDate'
                                        value={headerFilters.InvoiceDate}
                                        onChange={DateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        {!isFrenchieses && < Col sm={4} className="">
                            <FormGroup className=" row mt-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px", marginRight: "20px" }}>Party</Label>
                                <Col sm="9">
                                    <C_Select
                                        name="Party"
                                        value={PartyDropdown}
                                        isMulti={true}
                                        isSearchable={true}
                                        isLoading={partyDropdownLoadings}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={Party_Option}
                                        onChange={PartyDrodownOnChange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>}



                        <Col sm={isFrenchieses ? 9 : 5} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                // loading={}
                                className="btn btn-success m-3 mr"
                                onClick={(e) => UploadHandler(e)}
                            >
                                Upload
                            </C_Button>
                        </Col>
                    </Row>
                </div>
                <div className="mb-1 table-responsive table">
                    <GlobalCustomTable
                        keyField={"id"}
                        data={UploaledFileData}
                        columns={tableColumns}
                        id="table_Arrow"
                        noDataIndication={
                            <div className="text-danger text-center ">
                                Items Not available
                            </div>
                        }
                        onDataSizeChange={({ dataCount, filteredData = [] }) => {
                            dispatch(BreadcrumbShowCountlabel(`Count:${dataCount} currency_symbol ${_cfunc.TotalAmount_Func(filteredData)}`));
                        }}
                    />
                </div>


            </div>

        </React.Fragment >
    )
}

export default DataExportToSAP;