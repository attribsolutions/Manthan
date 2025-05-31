import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import {
  commonPageFieldList,
  commonPageFieldListSuccess
} from "../../../store/actions";
import {
  deleteGroupTypeID,
  deleteGroupTypeIDSuccess,
  editGroupTypeID,
  saveGroupTypeMasterSuccess,
  updateGroupTypeIDSuccess
} from "../../../store/Administrator/GroupTypeRedux/action";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { Go_Button, PageLoadingSpinner } from "../../../components/Common/CommonButton";
import SchemeType from "./SchemeType";
import { currentDate_ymd, disablePriviousTodate, loginPartyID, ToDate } from "../../../components/Common/CommonFunction";
import { Col, FormGroup, Label } from "reactstrap";
import { C_DatePicker } from "../../../CustomValidateForm";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import { getSchemeTypelist, getSchemeTypelistSuccess } from "../../../store/Administrator/SchemeRedux/action";

const SchemeTypeList = () => {
  const dispatch = useDispatch();

  const [hederFilters, setHederFilters] = useState({ todate: currentDate_ymd, fromdate: currentDate_ymd });


  const reducers = useSelector(
    (state) => ({
      listBtnLoading: state.SchemeTypeReducer.listBtnLoading,
      goBtnLoading: state.SchemeTypeReducer.goBtnLoading,
      tableList: state.SchemeTypeReducer.GroupType,
      editData: state.SchemeTypeReducer.editData,
      updateMsg: state.SchemeTypeReducer.updateMessage,
      deleteMsg: state.SchemeTypeReducer.deleteMessage,
      postMsg: state.SchemeTypeReducer.PostData,
      goBtnloading: state.SchemeTypeReducer.goBtnloading,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getSchemeTypelist,
    editId: editGroupTypeID,
    deleteId: deleteGroupTypeID,
    postSucc: saveGroupTypeMasterSuccess,
    updateSucc: updateGroupTypeIDSuccess,
    deleteSucc: deleteGroupTypeIDSuccess
  }
  useEffect(() => {
    const page_Id = pageId.SCHEME_TYPE_LIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    goButtonHandler();



    return () => {
      dispatch(getSchemeTypelistSuccess([]));
      dispatch(commonPageFieldListSuccess(null))
    }

  }, []);

  const {
    fromdate,
    todate,
  } = hederFilters;


  function goButtonHandler() {
    try {
      const jsonBody = JSON.stringify({
        FromDate: fromdate,
        ToDate: todate,
        PartyID: loginPartyID()
      });

      dispatch(getSchemeTypelist({ jsonBody }));

    } catch (error) { }
  }


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


  useEffect(() => {
    const Todate = ToDate({ FromDate: hederFilters.fromdate, Todate: hederFilters.todate })
    setHederFilters((i) => {
      const a = { ...i }
      a.todate = Todate;
      return a
    })

  }, [hederFilters.fromdate]);
  const HeaderContent = () => {

    return (
      <div className="px-2   c_card_filter text-black" >
        <div className="row" >

          <Col sm="5" className="">
            <FormGroup className="mb- row mt-1 " >
              <Label className="col-sm-5 p-2"
                style={{ width: "83px" }}>FromDate</Label>
              <Col sm="7">
                <C_DatePicker
                  options={{
                    altInput: true,
                    altFormat: "d-m-Y",
                    dateFormat: "Y-m-d",
                  }}
                  name='fromdate'
                  value={fromdate}
                  onChange={fromdateOnchange}
                />
              </Col>
            </FormGroup>
          </Col>

          <Col sm="5" className="">
            <FormGroup className="mb- row mt-1 " >
              <Label className="col-sm-5 p-2"
                style={{ width: "65px" }}>ToDate</Label>
              <Col sm="7">
                <C_DatePicker
                  options={{
                    minDate: (disablePriviousTodate({ fromDate: fromdate })),
                    altInput: true,
                    altFormat: "d-m-Y",
                    dateFormat: "Y-m-d",
                  }}
                  name="todate"
                  value={ToDate({ FromDate: fromdate, Todate: todate })}
                  onChange={todateOnchange}
                />
              </Col>
            </FormGroup>
          </Col>


          <Col sm="1" className="mt-1 ">
            <Go_Button onClick={goButtonHandler}
              loading={reducers.goBtnloading} />
          </Col>
        </div>
      </div>
    )
  }



  const { pageField, goBtnLoading } = reducers

  return (
    <React.Fragment>
      <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />
      {
        (pageField) &&
        <CommonPurchaseList
          action={action}
          reducers={reducers}
          goButnFunc={goButtonHandler}
          newBtnPath={url.SCHEME_TYPE}
          MasterModal={SchemeType}
          filters={hederFilters}
          HeaderContent={HeaderContent}
          masterPath={url.SCHEME_TYPE}
          totalAmountShow={true}
          ButtonMsgLable={"SchemeType"}
          deleteName={"Name"}
        />

      }
    </React.Fragment>
  )
}

export default SchemeTypeList;
