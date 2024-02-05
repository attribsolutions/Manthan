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
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { ExcelReportComponent } from "../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import DynamicColumnHook from "../../components/Common/TableCommonFunc";

const RetailerDataReport = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [userPageAccessState, setUserAccState] = useState("");
  const [partydropdown, setPartydropdown] = useState({
    value: 0,
    label: " All",
  });
  const [tableData, setTableData] = useState([]);
  const [btnMode, setBtnMode] = useState("");

  const [columns, setcolumn] = useState([{}]);
  const [columnsCreated, setColumnsCreated] = useState(false);

  const reducers = useSelector((state) => ({
    listBtnLoading: state.RetailerDataReducer.listBtnLoading,
    partyLoading: state.CommonAPI_Reducer.SSDD_ListLoading,
    partyList: state.CommonAPI_Reducer.SSDD_List,
    RetailerGobtn: state.RetailerDataReducer.RetailerGobtn,
    pageField: state.CommonPageFieldReducer.pageField,
    userAccess: state.Login.RoleAccessUpdateData,
  }));
  const { userAccess, partyList, listBtnLoading, partyLoading, pageField } =
    reducers;
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
    dispatch(BreadcrumbShowCountlabel(`Count:${tableData.length}`));
    return () => {
      dispatch(commonPageFieldSuccess(null));
      dispatch(postRetailerData_API_Success([]));
    };
  }, []);

  const [tableColumns] = DynamicColumnHook({ pageField });

  // const createColumns = () => {

  //     if ((RetailerGobtn.Status === true) && (RetailerGobtn.StatusCode === 200)) {
  //         const { Data } = RetailerGobtn
  //         let columns = []
  //         const objectAtIndex0 = (Data.ReportExportSerializerDetails[0]);
  //         for (const key in objectAtIndex0) {
  //             const column = {
  //                 text: key,
  //                 dataField: key,
  //                 sort: true,
  //                 classes: "table-cursor-pointer",
  //             };
  //             columns.push(column);
  //         }
  //         setcolumn(columns)
  //         setColumnsCreated(true)
  //     }
  // }
  // useEffect(() => {
  //     if (!columnsCreated) {
  //         createColumns();
  //     }
  // }, [RetailerGobtn]);

  useEffect(() => {
    if (RetailerGobtn.Status === true && RetailerGobtn.StatusCode === 200) {
      const { Data } = RetailerGobtn;
      if (btnMode === "Show" && Data.ReportExportSerializerDetails.length > 0) {
        setTableData(Data.ReportExportSerializerDetails);
      } else if (btnMode === "Excel") {
        ExcelReportComponent({
          // Download CSV
          pageField,
          excelTableData: Data.ReportExportSerializerDetails,
          excelFileName: "Retailer Data Report",
          // numericHeaders: ['id', 'MobileNo', 'AlternateContactNo', 'FSSAINo', 'PIN', 'Routeid', 'Supplierid'],
          // dateHeader: 'FSSAIExipry'
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

  Party_Option.unshift({
    value: 0,
    label: "All",
  });

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
        <div className="px-2   c_card_filter text-black">
          <div className="row">
            <Col sm={4}>
              <FormGroup className="mb- row mt-3 mb-2">
                <Label className="col-sm-4 p-2" style={{ width: "65px" }}>
                  Party
                </Label>
                <Col sm="8">
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

            <Col sm={1} className="mt-3">
              <C_Button
                type="button"
                spinnerColor="white"
                loading={listBtnLoading && btnMode === "Show"}
                className="btn btn-success"
                onClick={() => excelhandler("Show")}
              >
                Show
              </C_Button>
            </Col>
            <Col lg={2} className=" mt-3 ">
              {listBtnLoading && btnMode === "Excel" ? (
                <Button type="button" color="btn btn-primary" id="excelbtn-id">
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
                  onClick={() => excelhandler("Excel")}
                >
                  Excel 
                </Button>
              )}
            </Col>
          </div>
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
                    <div className="table-responsive table">
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
                      {mySearchProps(toolkitProps.searchProps)}
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
