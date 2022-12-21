import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";
import { BreadcrumbFilterSize, commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import PurchaseListPage from "../../../components/Common/ComponentRelatedCommonFile/purchase"
import { Button, Col, FormGroup, Label } from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { useHistory } from "react-router-dom";
import { excelDownCommonFunc } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { useMemo } from "react";
import { deleteWorkOrderId, deleteWorkOrderIdSuccess, editWorkOrderList, updateWorkOrderListSuccess } from "../../../store/Purchase/WorkOrder/action";
import MaterialIssueMaster from "./Material_IssueMaster";
import { getMaterialIssueListPage, MaterialIssuelistfilters } from "../../../store/Purchase/Matrial_Issue/action";
import * as url from "../../../routes/route_url"
import * as pageId from "../../../routes/allPageID"
import { getProduction_Mode2 } from "../../../store/Purchase/ProductionRedux/actions";

const MaterialIssueList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const hasPagePath = history.location.pathname

    const [pageMode, setpageMode] = useState(url.MATERIAL_ISSUE_LIST)
    const [userAccState, setUserAccState] = useState('');
    const reducers = useSelector(
        (state) => ({
            tableList: state.MaterialIssueReducer.materialIssueList,
            deleteMsg: state.WorkOrderReducer.deleteMsg,
            updateMsg: state.WorkOrderReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.WorkOrderReducer.editData,
            materialIssuelistFilters: state.MaterialIssueReducer.materialIssuelistFilters,
            produtionMake: state.ProductionReducer.produtionMake,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );

    const { userAccess, pageField, tableList, materialIssuelistFilters, produtionMake } = reducers;
    const { fromdate, todate } = materialIssuelistFilters

    const action = {
        getList: getMaterialIssueListPage,
        editId: editWorkOrderList,
        deleteId: deleteWorkOrderId,
        postSucc: postMessage,
        updateSucc: updateWorkOrderListSuccess,
        deleteSucc: deleteWorkOrderIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = (hasPagePath === url.PRODUCTION_ADD_Mode_2) ? pageId.PRODUCTION_ADD_Mode_2 : pageId.MATERIAL_ISSUE_LIST;
        setpageMode(hasPagePath)
        dispatch(BreadcrumbFilterSize(`${"Material Issue Count"} :0`))
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        goButtonHandler(true)

    }, []);

    const downList = useMemo(() => {
        let PageFieldMaster = []
        if (pageField) { PageFieldMaster = pageField.PageFieldMaster; }
        return excelDownCommonFunc({ tableList, PageFieldMaster })
    }, [tableList])


    useEffect(() => {
        const page_Id = (hasPagePath === url.PRODUCTION_ADD_Mode_2) ? pageId.PRODUCTION_ADD_Mode_2 : pageId.MATERIAL_ISSUE_LIST;
        let userAcc = userAccess.find((inx) => {
            return (inx.id === page_Id)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
        }
    }, [userAccess])

    useEffect(() => {
        debugger
        if (produtionMake.Status === true && produtionMake.StatusCode === 406) {
            history.push({
                pathname: produtionMake.path,
                pageMode: produtionMake.pageMode,
            })
        }
    }, [produtionMake])

    const makeBtnFunc = (list = []) => {
        debugger
        var isSelect = ''
        if (list.length > 0) {
            list.forEach(ele => {
                if (ele.hasSelect) {
                    isSelect = isSelect.concat(`${ele.id},`)
                }
            });
            if (isSelect) {
                const withoutLastComma = isSelect.replace(/,*$/, '');
                const jsonBody = JSON.stringify({
                    MaterialIssueID: withoutLastComma
                })

                dispatch(getProduction_Mode2({ jsonBody, pageMode, path: url.PRODUCTION_MASTER }))

            } else {
                alert("Please Select Material Issue")
            }
        }

    }
    const goButtonHandler = () => {
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: fromdate,
        });
        dispatch(getMaterialIssueListPage(jsonBody));
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...materialIssuelistFilters }
        newObj.fromdate = date
        dispatch(MaterialIssuelistfilters(newObj))
    }

    function todateOnchange(e, date) {
        let newObj = { ...materialIssuelistFilters }
        newObj.todate = date
        dispatch(MaterialIssuelistfilters(newObj))
    }

    return (
        <React.Fragment>
            <div className="page-content">

                {/* <Breadcrumb
                    pageHeading={userAccState.PageHeading}
                    newBtnView={(pageMode === url.MATERIAL_ISSUE_LIST) ? true : false}
                    showCount={true}
                    excelBtnView={true}
                    excelData={downList} /> */}

                <Breadcrumb
                    pageHeading={userAccState.PageHeading}
                    newBtnView={(pageMode === url.MATERIAL_ISSUE_LIST) ? true : false}
                    showCount={true}
                    excelBtnView={true}
                    pageMode={url.MATERIAL_ISSUE_ADD_Mode_2}
                    newBtnPagePath={url.MATERIAL_ISSUE_ADD_Mode_2}
                    excelData={downList} />

                <div className="px-2 mt-n1  c_card_header text-black" style={{ marginBottom: "-12px" }} >
                    <div className="mt-1  row" >
                        <Col sm="5" >
                            <FormGroup className=" row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "83px" }}>From Date</Label>
                                <Col sm="6">
                                    <Flatpickr
                                        name='fromdate'
                                        value={fromdate}
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="Select..."
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                            defaultDate: "today"

                                        }}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col sm="5">
                            <FormGroup className=" mb-1 row mt-3 " >
                                <Label className="col-sm-1 p-2"
                                    style={{ width: "65px", marginRight: "0.4cm" }}>To Date</Label>
                                <Col sm="6 ">
                                    <Flatpickr
                                        name="todate"
                                        value={todate}
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="Select..."
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                            defaultDate: "today"
                                        }}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm="1" className="mx-4 ">
                            <Button type="button" color="btn btn-outline-success border-2 font-size-12 m-3  "
                                onClick={() => goButtonHandler()}
                            >Go</Button>
                        </Col>
                    </div>
                </div>
                {
                    (pageField) ?
                        <PurchaseListPage
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            MasterModal={MaterialIssueMaster}
                            masterPath={url.MATERIAL_ISSUE}
                            ButtonMsgLable={"Material Issue"}
                            deleteName={"ItemName"}
                            pageMode={pageMode}
                            goButnFunc={goButtonHandler}
                            makeBtnFunc={makeBtnFunc}
                            makeBtnShow={pageMode === url.MATERIAL_ISSUE_LIST ? false : true}
                            makeBtnName={"Make Production"}
                        />
                        : null
                }
            </div>


        </React.Fragment>
    )
}

export default MaterialIssueList;