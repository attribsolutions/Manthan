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
import { breadcrumbReturnFunc, loginUserDetails, metaTagLabel } from '../../components/Common/CommonFunction';
import * as pageId from "../../routes/allPageID"
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from '../../store/actions';
import * as mode from "../../routes/PageMode"
import { getExcel_Button_API, getExcel_Button_API_Success } from '../../store/Report/SapLedger Redux/action';
import { useState } from 'react';
import { ReportComponent } from '../ReportComponent';
import { url } from '../../routes';
import { ManPower_Get_Action, ManPower_Get_Success } from '../../store/Report/ManPowerRedux/action';
import DynamicColumnHook from "../../components/Common/TableCommonFunc";
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import { mySearchProps } from '../../components/Common/SearchBox/MySearch';
import { C_Button } from '../../components/Common/CommonButton';


function initialState(history) {

    let page_Id = '';
    let buttonLable = ''
    let sub_Mode = history.location.pathname;

    if (sub_Mode === url.PRODUCT_MARGIN_REPORT) {
        page_Id = pageId.PRODUCT_MARGIN_REPORT;
        buttonLable = "ProductMarginReport"
    }
    else if (sub_Mode === url.MAN_POWER_REPORT) {
        page_Id = pageId.MAN_POWER_REPORT;
        buttonLable = "Distributor & ManPower"
    }
    return { page_Id, buttonLable }
};

const ProductMarginReport = (props) => {           // this component also use for ManPower report 

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
        ProductMargin,
        downloadManPower,
        manPowerReportRedux,
        userAccess,
        downloadProductMargin,
        pageField
    } = useSelector((state) => ({
        downloadManPower: state.ManPowerReportReducer.goBtnLoading,
        downloadProductMargin: state.SapLedgerReducer.downloadProductMargin,
        ProductMargin: state.SapLedgerReducer.ProductMargin,
        manPowerReportRedux: state.ManPowerReportReducer.manPowerReportGobtn,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
    }));

    useEffect(() => {

        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getExcel_Button_API_Success([]));
        dispatch(ManPower_Get_Success([]));
    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)//changes
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
        if ((ProductMargin.length > 0) || (manPowerReportRedux.length > 0)) {
            let columns = []
            const objectAtIndex0 = ((ProductMargin[0]) || (manPowerReportRedux[0]));
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

        if ((ProductMargin.length > 0) && (subPageMode === url.PRODUCT_MARGIN_REPORT)) {
            debugger
            if (btnMode === "Show") {
                setTableData(ProductMargin)
            } else if (btnMode === "Excel") {
                ReportComponent({  // Download CSV
                    excelData: ProductMargin,
                    excelFileName: "Product Margin Report"
                })
            }

            dispatch(getExcel_Button_API_Success([]));   // Reset Excel Data
        }
        else if (manPowerReportRedux.length > 0) {
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

    }, [ProductMargin, pageField, manPowerReportRedux]);

    function excelhandler(Type) {

        setBtnMode(Type)
        if (subPageMode === url.PRODUCT_MARGIN_REPORT) {
            const userDetails = loginUserDetails()
            dispatch(getExcel_Button_API(Number(userDetails.IsSCMPartyType) || 0, userDetails.Party_id))
        }
        else {
            dispatch(ManPower_Get_Action({ btnId: url.MAN_POWER_REPORT }))
        }
    }

    return (
        <React.Fragment>
            <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">

                <Container fluid>
                    <Row>
                        <Col >
                            <CardBody className=" c_card_filter text-black ">

                                <Row className="justify-content-end">
                                    <Col sm={1} className=" mt-n2 mb-n2" >
                                        <C_Button
                                            type="button"
                                            spinnerColor="white"
                                            loading={(downloadManPower || downloadProductMargin) && btnMode === "Show"}
                                            className="btn btn-success"
                                            onClick={() => excelhandler("Show")}
                                        >
                                            Show
                                        </C_Button>

                                    </Col>
                                    <Col lg={2} className=" mt-n2 mb-n2 ">
                                        {(downloadManPower || downloadProductMargin) && btnMode === "Excel" ?
                                            <Button type="button"
                                                color='btn btn-primary'
                                                id="excelbtn-id"
                                            > Downloading..    &nbsp;
                                                <Spinner style={{ height: "13px", width: "13px" }} color="white" />
                                            </Button> :

                                            <Button type="button"
                                                color='btn btn-primary'
                                                id="excelbtn-id"
                                                onClick={() => excelhandler("Excel")}>Excel Download
                                            </Button>
                                        }
                                    </Col>

                                </Row>
                            </CardBody>
                        </Col>
                    </Row>

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
                </Container>
            </div>
        </React.Fragment>
    );
}

export default ProductMarginReport;