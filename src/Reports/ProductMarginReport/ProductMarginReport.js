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
import { commonPageField, commonPageFieldSuccess } from '../../store/actions';
import * as mode from "../../routes/PageMode"
import { getExcel_Button_API, getExcel_Button_API_Success } from '../../store/Report/SapLedger Redux/action';
import { useState } from 'react';
import { ReportComponent } from '../ReportComponent';

const ProductMarginReport = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();
    const [userPageAccessState, setUserAccState] = useState('');
    
    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        ProductMargin,
        userAccess,
        downloadProductMargin,
        pageField
    } = useSelector((state) => ({
        downloadProductMargin: state.SapLedgerReducer.downloadProductMargin,
        ProductMargin:state.SapLedgerReducer.ProductMargin,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
    }));

    useEffect(() => {
        const page_Id = pageId.PRODUCT_MARGIN_REPORT//changes
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getExcel_Button_API_Success([]))
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

    useEffect(() => {
                   
            if (ProductMargin.length > 0) {
                ReportComponent({      // Download CSV
                    pageField,
                    excelData: ProductMargin,
                    excelFileName: "Product Margin Report"
                })
                dispatch(getExcel_Button_API_Success([]));   // Reset Excel Data
            }
     
    }, [ ProductMargin, pageField]);

    function excelhandler() {
        const userDetails = loginUserDetails()
        dispatch(getExcel_Button_API(Number(userDetails.IsSCMPartyType) || 0, userDetails.Party_id))
    }

    return (
        <React.Fragment>
            <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">

                <Container fluid>
                    <Row>
                        <Col xl={4} md={4} >
                            <CardBody>
                                <Row>
                                    <Col lg={6}>
                                        {downloadProductMargin ?
                                            <Button type='button'
                                                className='btn btn-success'
                                                id="excelbtn-id"
                                            > Downloading..    &nbsp;
                                                <Spinner style={{ height: "13px", width: "13px" }} color="white" />
                                            </Button> :

                                            <Button type='button'
                                                className='btn btn-success'
                                                id="excelbtn-id"
                                                onClick={excelhandler}>ProductMarginReport
                                            </Button>
                                        }

                                    </Col>
                                </Row>
                            </CardBody>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default ProductMarginReport;