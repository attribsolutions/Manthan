import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";
import { BreadcrumbFilterSize, commonPageFieldList, commonPageFieldListSuccess, } from "../../../../store/actions";
import PurchaseListPage from "../../../../components/Common/ComponentRelatedCommonFile/purchase"
import { BIllOf_MATERIALS, BIllOf_MATERIALS_LIST } from "../../../../routes/route_url";
import { Button, Col, FormGroup, Label } from "reactstrap";
import Breadcrumb from "../../../../components/Common/Breadcrumb";
import { useHistory } from "react-router-dom";
import { currentDate, excelDownCommonFunc, userCompany } from "../../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { useMemo } from "react";
import { deleteBOMId, deleteBOMIdSuccess, editBOMList, getBOMListPage, updateBOMListSuccess } from "../../../../store/Purchase/BOMRedux/action";
import BOMMaster from "../BOMMaster/BOMIndex";

const BOMList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const hasPagePath = history.location.pathname

    const [pageMode, setpageMode] = useState(BIllOf_MATERIALS_LIST)
    const [userAccState, setUserAccState] = useState('');
    const [fromdate, setFromdate] = useState();
    const [todate, setTodate] = useState();
    const reducers = useSelector(
        (state) => ({
            tableList: state.BOMReducer.BOMList,
            deleteMsg: state.BOMReducer.deleteMsg,
            updateMsg: state.BOMReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.BOMReducer.editData,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );

    const action = {
        getList: getBOMListPage,
        editId: editBOMList,
        deleteId: deleteBOMId,
        postSucc: postMessage,
        updateSucc: updateBOMListSuccess,
        deleteSucc: deleteBOMIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        setpageMode(hasPagePath)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(70))
        dispatch(BreadcrumbFilterSize(`${"BOM Count"} :0`))
        goButtonHandler(true)

    }, []);

    const { userAccess, pageField, tableList } = reducers;

    const downList = useMemo(() => {
        let PageFieldMaster = []
        if (pageField) { PageFieldMaster = pageField.PageFieldMaster; }
        return excelDownCommonFunc({ tableList, PageFieldMaster })
    }, [tableList])


    useEffect(() => {
        const pageId = 70
        let userAcc = userAccess.find((inx) => {
            return (inx.id === pageId)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
        }
    }, [userAccess])

    const goButtonHandler = (onload = false) => {

        let FromDate
        let ToDate

        if (onload) {
            const currentdate = currentDate()
            FromDate = currentdate;
            ToDate = currentdate;
        } else {
            ToDate = todate;
            FromDate = fromdate;
        }

        const jsonBody = JSON.stringify({
            FromDate: FromDate,
            ToDate: ToDate,
            Company: userCompany(),
        });
        dispatch(getBOMListPage(jsonBody));
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Breadcrumb
                    pageHeading={userAccState.PageHeading}
                    newBtnView={true}
                    showCount={true}
                    excelBtnView={true}
                    excelData={downList} />

                <div className="px-2  mt-n1 c_card_header" style={{ marginBottom: "-12px" }} >
                    <div className=" mt-1 row">
                        <Col sm="4" className="">
                            <FormGroup className="mb- row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "83px" }}>From Date</Label>
                                <Col sm="7">
                                    <Flatpickr
                                        name='fromdate'
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="Select..."
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                            defaultDate: "today"

                                        }}
                                        onChange={(e, date) => { setFromdate(date) }}
                                        onReady={(e, date) => { setFromdate(date) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col sm="4" className="">
                            <FormGroup className="mb- row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "65px" }}>To Date</Label>
                                <Col sm="7 ">
                                    <Flatpickr
                                        name="todate"
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="Select..."
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                            defaultDate: "today"
                                        }}
                                        onChange={(e, date) => { setTodate(date) }}
                                        onReady={(e, date) => { setTodate(date) }}

                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm="1">
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
                            MasterModal={BOMMaster}
                            masterPath={BIllOf_MATERIALS}
                            ButtonMsgLable={"BOM"}
                            deleteName={"ItemName"}
                            pageMode={pageMode}
                            goButnFunc={goButtonHandler}
                        />
                        : null
                }
            </div>


        </React.Fragment>
    )
}

export default BOMList;