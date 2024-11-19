import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Col, FormGroup, Label, Row, Spinner } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../components/Common/CommonButton";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId } from "../../routes/index";
import { MetaTags } from "react-meta-tags";
import {
  BreadcrumbShowCountlabel,
  SSDD_List_under_Company,
  commonPageField,
  commonPageFieldSuccess,
} from "../../store/actions";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import {
  postRetailerData_API,
  postRetailerData_API_Success,
} from "../../store/Report/RetailerDataRedux/action";
import { C_Select } from "../../CustomValidateForm";
import BootstrapTable from "react-bootstrap-table-next";
import { globalTableSearchProps } from "../../components/Common/SearchBox/MySearch";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { ExcelReportComponent } from "../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import DynamicColumnHook from "../../components/Common/TableCommonFunc";
import { allLabelWithZero } from "../../components/Common/CommonErrorMsg/HarderCodeData";

const RetailerDataReport = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [userPageAccessState, setUserAccState] = useState("");
  const [partydropdown, setPartydropdown] = useState(allLabelWithZero);
  const [tableData, setTableData] = useState([]);
  const [btnMode, setBtnMode] = useState("");

  const reducers = useSelector((state) => ({
    listBtnLoading: state.RetailerDataReducer.listBtnLoading,
    partyLoading: state.CommonAPI_Reducer.SSDD_ListLoading,
    partyList: state.CommonAPI_Reducer.SSDD_List,
    RetailerGobtn: state.RetailerDataReducer.RetailerGobtn,
    pageField: state.CommonPageFieldReducer.pageField,
    userAccess: state.Login.RoleAccessUpdateData,
  }));
  const { userAccess, partyList, listBtnLoading, partyLoading, pageField } = reducers;
  const { RetailerGobtn } = reducers;

  // Featch Modules List data  First Rendering
  const location = { ...history.location };
  const hasShowModal = props.hasOwnProperty(mode.editValue);

  // userAccess useEffect
  useEffect(() => {
    let userAcc = null;
    let locationPath = location.pathname;
    if (hasShowModal) {
      locationPath = props.masterPath;
    }
    userAcc = userAccess.find((inx) => {
      return `/${inx.ActualPagePath}` === locationPath;
    });
    if (userAcc) {
      setUserAccState(userAcc);
      _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
    }
  }, [userAccess]);

  useEffect(() => {
    dispatch(commonPageFieldSuccess(null));
    dispatch(commonPageField(pageId.RETAILER_DATA_REPORT));
    dispatch(SSDD_List_under_Company());
    return () => {
      dispatch(commonPageFieldSuccess(null));
      dispatch(postRetailerData_API_Success([]));
    };
  }, []);

  const [tableColumns] = DynamicColumnHook({ pageField });

  useEffect(() => {
    if (RetailerGobtn.Status === true && RetailerGobtn.StatusCode === 200) {
      const { Data } = RetailerGobtn;
      if (btnMode === "Show" && Data.ReportExportSerializerDetails.length > 0) {
        setTableData(Data.ReportExportSerializerDetails);
      } else if (btnMode === "Excel") {
        ExcelReportComponent({                   // Download CSV
          pageField,
          excelTableData: Data.ReportExportSerializerDetails,
          excelFileName: "Retailer Data Report",
        });
      }

      dispatch(postRetailerData_API_Success([]));
    } else if (
      RetailerGobtn.Status === true &&
      RetailerGobtn.StatusCode === 204
    ) {
      dispatch(postRetailerData_API_Success([]));
      customAlert({
        Type: 3,
        Message: JSON.stringify(RetailerGobtn.Message),
      });
    }
  }, [RetailerGobtn]);

  const Party_Option = partyList.map((i) => ({
    value: i.id,
    label: i.Name,
  }));

  Party_Option.unshift(allLabelWithZero);

  function excelhandler(Type) {
    setBtnMode(Type);
    dispatch(
      postRetailerData_API(JSON.stringify({ Party: partydropdown.value }))
    );
  }

  function PartyDropdown_OnChange_Handler(e) {
    setPartydropdown(e);
    dispatch(postRetailerData_API_Success([]));
    setTableData([]);
  }

  return (
    <React.Fragment>
      <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
      <div className="page-content">
        <div className="px-2   c_card_filter text-black " >
          <Row>
            <Col sm={5} className="">
              <FormGroup className=" row mt-2  " >
                <Label className="col-sm-4 p-2"
                  style={{ width: "83px" }}>Party</Label>
                <Col sm="6">
                  <C_Select
                    name="party"
                    value={partydropdown}
                    isSearchable={true}
                    isLoading={partyLoading}
                    className="react-dropdown"
                    classNamePrefix="dropdown"
                    styles={{
                      menu: (provided) => ({ ...provided, zIndex: 2 }),
                    }}
                    options={Party_Option}
                    onChange={(e) => {
                      PartyDropdown_OnChange_Handler(e);
                    }}
                  />
                </Col>
              </FormGroup>
            </Col>

            <Col sm={7} className=" d-flex justify-content-end" >
              <C_Button
                type="button"
                spinnerColor="white"
                loading={listBtnLoading && btnMode === "Show"}
                className="btn btn-success m-3 mr"
                onClick={() => excelhandler("Show")}
              >
                Show
              </C_Button>
              {listBtnLoading && btnMode === "Excel" ? (
                <Button type="button" className="btn btn-primary m-3 mr" color="btn btn-primary" id="excelbtn-id">
                  {" "}
                  Downloading.. &nbsp;
                  <Spinner
                    style={{ height: "13px", width: "13px" }}
                    color="white"
                  />
                </Button>
              ) : (
                <Button
                  type="button"
                  color="btn btn-primary"
                  id="excelbtn-id"
                  className="btn btn-primary m-3 mr"
                  onClick={() => excelhandler("Excel")}
                >
                  Excel
                </Button>
              )}
            </Col>
          </Row>
        </div>

        <div className="mt-1">
          <ToolkitProvider
            keyField="id"
            data={tableData}
            columns={tableColumns}
            search
          >
            {(toolkitProps) => (
              <React.Fragment>
                <Row>
                  <Col xl="12">
                    <div className="table-responsive table" style={{ minHeight: "75vh" }}>
                      <BootstrapTable
                        keyField="PartyID"
                        classes={"table  table-bordered table-hover"}
                        noDataIndication={
                          <div className="text-danger text-center ">
                            Record Not available
                          </div>
                        }
                        onDataSizeChange={({ dataSize }) => {
                          dispatch(
                            BreadcrumbShowCountlabel(`Count:${dataSize}`)
                          );
                        }}
                        {...toolkitProps.baseProps}
                      />
                      {globalTableSearchProps(toolkitProps.searchProps)}
                    </div>
                  </Col>
                </Row>
              </React.Fragment>
            )}
          </ToolkitProvider>
        </div>
      </div>
    </React.Fragment>
  );
};

export default RetailerDataReport;
