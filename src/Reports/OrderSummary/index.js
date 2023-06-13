import React, { useEffect, useState } from 'react';
import MetaTags from 'react-meta-tags';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container, Label, Row,
} from "reactstrap";
import { breadcrumbReturnFunc, loginUserDetails, metaTagLabel } from '../../components/Common/CommonFunction';
import { pageId,mode} from "../../routes/PageMode"
import { commonPageField, commonPageFieldSuccess } from '../../store/actions';
import { getExcel_Button_API, getExcel_Button_API_Success } from '../../store/Report/SapLedger Redux/action';
import * as XLSX from 'xlsx';

const Index = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const [pageMode, setPageMode] = useState(mode.defaultsave);//changes
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState(123);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        userAccess,
        ProductMarginData,
    } = useSelector((state) => ({
        userAccess: state.Login.RoleAccessUpdateData,
        ProductMarginData: state.SapLedgerReducer.ProductMargin,
        pageField: state.CommonPageFieldReducer.pageField,

    }));


    useEffect(() => {
        const page_Id = pageId.ORDER_SUMMARY_REPORT//changes
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
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

        if (ProductMarginData.length > 1) {

            let newArray = []
            ProductMarginData.forEach(i => {
                let obj = i
                i.ItemMargins.forEach(ele => {
                    const keys = Object.keys(ele);
                    keys.forEach(key => {
                        obj[key] = ele[key]
                    })
                })
                delete obj.ItemMargins
                newArray.push(obj)
            })

            const worksheet = XLSX.utils.json_to_sheet(newArray);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "ProductMargin1");
            XLSX.writeFile(workbook, "Product Margin Report.xlsx");

            dispatch(getExcel_Button_API_Success([]));
        }
    }, [ProductMarginData]);

    function excelhandler(event) {
        debugger
        event.preventDefault();
        const userDetails = loginUserDetails()
        const btnId = "excelbtn-id"
        const ProductMargin = []
        dispatch(getExcel_Button_API())
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
                </MetaTags>
                <Container fluid>
                    <Row>
                        <Col xl={4} md={4} >
                            <CardBody>
                                <Row>
                                    <Col lg={6}>
                                        <Button type='button'
                                            className='btn btn-success'
                                            id="excelbtn-id"
                                            onClick={excelhandler}>ProductMarginReport
                                        </Button>
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

export default Index;