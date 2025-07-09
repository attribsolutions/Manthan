




import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { commonPageFieldList, commonPageFieldListSuccess, getpdfReportdata, getpdfReportdataSuccess } from "../../store/actions";
import * as pageId from "../../routes/allPageID"
import CommonPurchaseList from "../../components/Common/CommonPurchaseList";
import { Go_Button, PageLoadingSpinner } from "../../components/Common/CommonButton";
import { mode, url } from "../../routes";
import { PartyListforApproval_Action, PartyListforApproval_Success, editPartyID } from "../../store/Administrator/PartyRedux/action";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Col, FormGroup, Label } from "reactstrap";
import { C_DatePicker } from "../../CustomValidateForm";
import { currentDate_ymd, disablePriviousTodate, loginSelectedPartyID, ToDate } from "../../components/Common/CommonFunction";
import { getWorkOrderListPage } from "../../store/Production/WorkOrder/action";
import { BatchTraceabilityReport_API } from "../../helpers/backend_helper";
import * as report from '../../Reports/ReportIndex'
import BatchTrace from "./BatchTrace";

const BatchTraceability = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const [hederFilters, setHederFilters] = useState({ fromdate: currentDate_ymd, todate: currentDate_ymd, })


    const [batchTraceabilityData, setBatchTraceabilityData] = useState(null);


    const [pageMode] = useState(mode.modeSTPList);

    const reducers = useSelector(
        (state) => ({
            goBtnLoading: state.WorkOrderReducer.loading,
            listBtnLoading: state.WorkOrderReducer.listBtnLoading,
            tableList: state.WorkOrderReducer.WorkOrderList,
            editData: state.WorkOrderReducer.editData,
            pdfdata: state.PdfReportReducers.pdfdata,
            RetailerApprovalID: state.WorkOrderReducer.PartyListForApproval_ID,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
            commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
        })
    );


    const { pageField, goBtnLoading, pdfdata } = reducers;

    const { fromdate, todate } = hederFilters
    const action = {}

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = pageId.BATCH_TRACEABILITY
        dispatch(commonPageFieldListSuccess(null));
        goButtonHandler(true);
        dispatch(commonPageFieldList(page_Id));
        return () => {
            dispatch(getpdfReportdataSuccess({ Status: false }))
        };

    }, []);




    function fromdateOnchange(e, date) {

        let newObj = { ...hederFilters }
        newObj.fromdate = date
        setHederFilters(newObj)
    }

    function todateOnchange(e, date) {

        let newObj = { ...hederFilters }
        newObj.todate = date
        setHederFilters(newObj)
    }

    const makeBtnFunc = async (config) => {

        const newConfig = {
            ...config,
            ReportType: "BatchTrace",
            jsonBody: { WorkOrderID: config[0].id }
        };


        const result = await BatchTraceabilityReport_API(newConfig);
        if (result.Status === true && result.StatusCode === 200) {
            debugger
            result.Data["WorkOrderID"] = config[0].id;
            result.Data["ItemName"] = config[0].ItemName;

            setBatchTraceabilityData(result.Data);
        }
    }

    const goButtonHandler = (onload) => {
        const subPageMode = url.BATCH_TRACEABILITY;
        const jsonBody = JSON.stringify({
            FromDate: (onload === true) ? "" : fromdate,
            ToDate: (onload === true) ? "" : todate,
            Party: loginSelectedPartyID()
        });
        dispatch(getWorkOrderListPage({ jsonBody, subPageMode }));
    }

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />

            <div className="page-content">
                {batchTraceabilityData ? <BatchTrace Data={batchTraceabilityData} updateBatchData={setBatchTraceabilityData} /> : <>
                    <div className="px-2   c_card_filter text-black"  >
                        <div className="row" >
                            <Col sm="5" >
                                <FormGroup className=" row mt-3 " >
                                    <Label className="col-sm-5 p-2"
                                        style={{ width: "83px" }}>FromDate</Label>
                                    <Col sm="6">
                                        <C_DatePicker
                                            name='fromdate'
                                            value={fromdate}
                                            onChange={fromdateOnchange}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col sm="5">
                                <FormGroup className=" mb-1 row mt-3 " >
                                    <Label className="col-sm-1 p-2"
                                        style={{ width: "65px", marginRight: "0.4cm" }}>ToDate</Label>
                                    <Col sm="6 ">
                                        <C_DatePicker
                                            options={{
                                                minDate: (disablePriviousTodate({ fromDate: fromdate })),
                                                maxDate: "today",
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                            }}
                                            value={ToDate({ FromDate: fromdate, Todate: todate })}
                                            nane='todate'
                                            onChange={todateOnchange}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>


                            <Col sm="1" ></Col>
                            <Col sm="1" className="mt-3 ">
                                <Go_Button loading={goBtnLoading} onClick={goButtonHandler} />
                            </Col>
                        </div>
                    </div>
                    {
                        (pageField) &&
                        <div className="mt-n1">
                            <CommonPurchaseList
                                action={action}
                                reducers={reducers}
                                pageMode={pageMode}
                                makeBtnShow={true}
                                ButtonMsgLable={"Trace"}
                                goButnFunc={goButtonHandler}
                                makeBtnFunc={makeBtnFunc}
                            />
                        </div>
                    }
                </>}
            </div>

        </React.Fragment>
    )
}

export default BatchTraceability;
