import React, { useEffect } from 'react';
import MetaTags from 'react-meta-tags';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
    Button,
    CardBody,
    Col,
    Row,
    Spinner,
} from "reactstrap";
import { breadcrumbReturnFunc, loginEmployeeID, metaTagLabel } from '../../components/Common/CommonFunction';
import * as pageId from "../../routes/allPageID"
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from '../../store/actions';
import * as mode from "../../routes/PageMode"
import { useState } from 'react';
import { url } from '../../routes';
import { ManPower_Get_Action, ManPower_Get_Success } from '../../store/Report/ManPowerRedux/action';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import { globalTableSearchProps } from '../../components/Common/SearchBox/MySearch';
import { C_Button } from '../../components/Common/CommonButton';
import { ExcelReportComponent } from '../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS';
import { changeCommonPartyDropDetailsAction } from '../../store/Utilites/PartyDrodown/action';
import DynamicColumnHook from '../../components/Common/TableCommonFunc';
import SimpleBar from "simplebar-react";

function initialState(history) {

    let page_Id = '';
    let buttonLable = ''
    let sub_Mode = history.location.pathname;

    if (sub_Mode === url.MAN_POWER_REPORT) {
        page_Id = pageId.MAN_POWER_REPORT;
        buttonLable = "Distributor & ManPower"
    }
    return { page_Id, buttonLable }
};

const ManPowerReport = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const [userPageAccessState, setUserAccState] = useState('');

    const [page_Id] = useState(() => initialState(history).page_Id);
    const [tableData, setTableData] = useState([]);
    const [btnMode, setBtnMode] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        downloadManPower,
        manPowerReportRedux,
        userAccess,
        pageField
    } = useSelector((state) => ({
        downloadManPower: state.ManPowerReportReducer.goBtnLoading,
        manPowerReportRedux: state.ManPowerReportReducer.manPowerReportGobtn,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
    }));

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(BreadcrumbShowCountlabel(`Count:${0}`));
        dispatch(ManPower_Get_Success([]));
        dispatch(changeCommonPartyDropDetailsAction({ isShow: false }))//change party drop-down show false

        return () => {
            dispatch(changeCommonPartyDropDetailsAction({ isShow: true }))//change party drop-down restore show state
        }
    }, []);

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)//changes

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

    const [tableColumns] = DynamicColumnHook({ pageField });

    const modifiedColumns = tableColumns.map((col) => {
        if (col.dataField === "FSSAIDocument") {
            return {
                ...col,
                formatter: (cell, row) => {
                    if (row.FSSAIDocumentFilename && row.FSSAIDocument) { // Check if the filename and document link exist
                        return (
                            <a
                                href={row.FSSAIDocument}
                                download

                                rel="noopener noreferrer"
                                className="text-primary text-decoration-underline"
                                title="Download FSSAI Document "
                            >
                                {row.FSSAIDocumentFilename}
                            </a>
                        );
                    } else {
                        return "";
                    }
                }
            };
        }
        return col;
    });



    useEffect(() => {

        if (manPowerReportRedux.length > 0) {
            if (btnMode === "Show") {
                setTableData(manPowerReportRedux)

            } else if (btnMode === "Excel") {
                ExcelReportComponent({      // Download CSV
                    pageField,
                    excelTableData: manPowerReportRedux,
                    excelFileName: "Distributor & ManPower Report",
                })
            }
            dispatch(ManPower_Get_Success([]));   // Reset Excel Data
        }

    }, [pageField, manPowerReportRedux]);

    function GobtnExcelhandler(Type) {
        setBtnMode(Type)
        dispatch(ManPower_Get_Action({ btnId: url.MAN_POWER_REPORT, EmployeeID: loginEmployeeID() }))
    }

    return (
        <React.Fragment>
            <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="px-2   c_card_filter text-black " >
                    <Row>

                        <Col sm={12} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={(downloadManPower) && btnMode === "Show"}
                                className="btn btn-success m-3 mr"
                                onClick={() => GobtnExcelhandler("Show")}
                            >
                                Show
                            </C_Button>
                            {(downloadManPower) && btnMode === "Excel" ?
                                <Button type="button"
                                    color='btn btn-primary'
                                    className="btn btn-primary m-3 mr"
                                    id="excelbtn-id"
                                > Downloading..    &nbsp;
                                    <Spinner style={{ height: "13px", width: "13px" }} color="white" />
                                </Button> :

                                <Button type="button"
                                    className="btn btn-primary m-3 mr"
                                    color='btn btn-primary'
                                    id="excelbtn-id"
                                    onClick={() => GobtnExcelhandler("Excel")}> Excel
                                </Button>}
                        </Col>
                    </Row>
                </div>






                <div className="mt-1">
                    <ToolkitProvider
                        keyField="id"
                        data={tableData}
                        //  columns={tableColumns}
                        columns={modifiedColumns}
                        search
                    >
                        {(toolkitProps,) => (
                            <React.Fragment>
                                <Row>
                                    <Col xl="12">
                                        <div className="table-responsive table" style={{ maxHeight: "77vh" }}>
                                            <BootstrapTable
                                                keyField="PartyID"
                                                classes={"custom-table"}
                                                noDataIndication={
                                                    <div className="text-danger text-center ">
                                                        Record Not available
                                                    </div>
                                                }
                                                onDataSizeChange={({ dataSize }) => {
                                                    dispatch(BreadcrumbShowCountlabel(`Count:${dataSize}`));
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
}

export default ManPowerReport;