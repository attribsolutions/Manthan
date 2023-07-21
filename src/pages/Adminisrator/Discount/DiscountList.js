import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import * as _cfunc from "../../../components/Common/CommonFunction";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import { Go_Button, PageLoadingSpinner } from "../../../components/Common/CommonButton";
import DiscountMaster from "./DiscountMaster";
import { Col, FormGroup, Label, Row } from "reactstrap";
import { C_DatePicker } from "../../../CustomValidateForm";
import { getDiscountList, getDiscountListSuccess } from "../../../store/Administrator/DiscountRedux/actions";

const DiscountList = () => {

    const dispatch = useDispatch();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const [headerFilters, setHeaderFilters] = useState('');

    const reducers = useSelector(
        (state) => ({
            tableList: state.DiscountReducer.discountList,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
            goBtnLoading: state.DiscountReducer.goBtnLoading,
        })
    );
    const { pageField, goBtnLoading } = reducers
    const { fromdate = currentDate_ymd, todate = currentDate_ymd } = headerFilters;

    const action = {}

    useEffect(() => {
        const page_Id = pageId.DISCOUNT_LIST;
        dispatch(commonPageFieldListSuccess(null));
        dispatch(commonPageFieldList(page_Id));
        goButtonHandler(true);
        return () => {
            dispatch(getDiscountListSuccess([]));
            dispatch(commonPageFieldListSuccess(null));
        }
    }, []);

    const goButtonHandler = () => {

        const jsonBody = JSON.stringify({
            "FromDate": fromdate,
            "ToDate": todate,
            "Party": _cfunc.loginPartyID()
        });
        dispatch(getDiscountList(jsonBody));
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

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />
            <div className="page-content">

                <div className="px-3 c_card_filter header text-black mb-1" >

                    <Row >
                        <Col sm="6" className="mt-1 mb-1">
                            <FormGroup className="row mt-2" >
                                <Label className="col-sm-1 p-2"
                                    style={{ width: "115px", marginRight: "0.1cm" }}>FromDate </Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        name='Date'
                                        value={fromdate}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col >

                        <Col sm="6" className="mt-1 mb-1" >
                            <FormGroup className=" row mt-2 " >
                                <Label className="col-sm-1 p-2"
                                    style={{ width: "115px", marginRight: "0.1cm" }}>ToDate</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        name='Date'
                                        value={todate}
                                        onChange={todateOnchange}
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
                    <div className="mt-n1">
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            MasterModal={DiscountMaster}
                            masterPath={url.DISCOUNT_MASTER}
                            newBtnPath={url.DISCOUNT_MASTER}
                            ButtonMsgLable={"Discount"}
                            deleteName={"Name"}
                            goButnFunc={goButtonHandler}
                        />
                    </div>

                }
            </div>
        </React.Fragment>
    )
}

export default DiscountList;
