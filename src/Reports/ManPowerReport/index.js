import React, { useEffect } from 'react';
import MetaTags from 'react-meta-tags';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
    Button,
    CardBody,
    Col,
    Container,
    Row,
    Spinner,
} from "reactstrap";
import { breadcrumbReturnFunc, loginPartyID, loginSelectedPartyID, loginUserDetails, metaTagLabel } from '../../components/Common/CommonFunction';
import * as pageId from "../../routes/allPageID"
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from '../../store/actions';
import * as mode from "../../routes/PageMode"
import { getExcel_Button_API, getExcel_Button_API_Success } from '../../store/Report/SapLedger Redux/action';
import { useState } from 'react';
import { ReportComponent } from '../ReportComponent';
import { url } from '../../routes';
import { ManPower_Get_Action, ManPower_Get_Success } from '../../store/Report/ManPowerRedux/action';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import { mySearchProps } from '../../components/Common/SearchBox/MySearch';
import { C_Button } from '../../components/Common/CommonButton';
import PartyDropdown_Common from "../../components/Common/PartyDropdown";
import { customAlert } from '../../CustomAlert/ConfirmDialog';

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

const ManPowerReport = (props) => {           // this component also use for ManPower report 

    const history = useHistory()
    const dispatch = useDispatch();

    const [subPageMode] = useState(history.location.pathname);
    const [userPageAccessState, setUserAccState] = useState('');

    const [page_Id] = useState(() => initialState(history).page_Id);
    const [buttonLable] = useState(() => initialState(history).buttonLable);
    const [tableData, setTableData] = useState([]);
    const [btnMode, setBtnMode] = useState("");
    const [columns, setcolumn] = useState([{}]);
    const [columnsCreated, setColumnsCreated] = useState(false)

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
        dispatch(ManPower_Get_Success([]));
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

    const createColumns = () => {
        if ((manPowerReportRedux.length > 0)) {
            let columns = []
            const objectAtIndex0 = ((manPowerReportRedux[0]));
            for (const key in objectAtIndex0) {
                const column = {
                    text: key,
                    dataField: key,
                    sort: true,
                    classes: "table-cursor-pointer",
                };
                columns.push(column);
            }
            setcolumn(columns)
            setColumnsCreated(true)
        }
    }
    if (!columnsCreated) {
        createColumns();
    }

    useEffect(() => {

        if (manPowerReportRedux.length > 0) {
            if (btnMode === "Show") {
                setTableData(manPowerReportRedux)

            } else if (btnMode === "Excel") {
                ReportComponent({      // Download CSV
                    excelData: manPowerReportRedux,
                    excelFileName: "Distributor & ManPower Report"
                })
            }
            dispatch(ManPower_Get_Success([]));   // Reset Excel Data
        }

    }, [pageField, manPowerReportRedux]);

    function GobtnExcelhandler(Type) {
        setBtnMode(Type)
        
        dispatch(ManPower_Get_Action({ btnId: url.MAN_POWER_REPORT }))
    }

    return (
        <React.Fragment>
            <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
               
                <CardBody className=" c_card_filter text-black ">

                    <Row className="justify-content-end">
                        <Col sm={1} className=" mt-n2 mb-n2" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={(downloadManPower) && btnMode === "Show"}
                                className="btn btn-success"
                                onClick={() => GobtnExcelhandler("Show")}
                            >
                                Show
                            </C_Button>

                        </Col>
                        <Col lg={2} className=" mt-n2 mb-n2 ">
                            {(downloadManPower) && btnMode === "Excel" ?
                                <Button type="button"
                                    color='btn btn-primary'
                                    id="excelbtn-id"
                                > Downloading..    &nbsp;
                                    <Spinner style={{ height: "13px", width: "13px" }} color="white" />
                                </Button> :

                                <Button type="button"
                                    color='btn btn-primary'
                                    id="excelbtn-id"
                                    onClick={() => GobtnExcelhandler("Excel")}>Excel Download
                                </Button>
                            }
                        </Col>
                    </Row>
                </CardBody>

                <div className="mt-1">
                    <ToolkitProvider
                        keyField="id"
                        data={tableData}
                        columns={columns}
                        search
                    >
                        {(toolkitProps,) => (
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
                                                    dispatch(BreadcrumbShowCountlabel(`Count:${dataSize}`));
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
}

export default ManPowerReport;