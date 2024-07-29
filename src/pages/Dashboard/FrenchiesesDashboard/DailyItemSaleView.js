import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import { Card, CardBody, Col, Row } from 'reactstrap'
import Pie from './pie'

import data_1 from './data.json'
import { amountCommaSeparateFunc, currentDate_dmy, currentDate_ymd } from '../../../components/Common/CommonFunction'
import { Frenchies_Daily_sale_Report_API } from '../../../helpers/backend_helper'

import { useParams } from 'react-router-dom';
import { FRENCHIESE_DAILY_SALE_REPORT } from '../../../helpers/url_helper'
import SERVER_HOST_PATH from '../../../helpers/_serverPath'
import { formatDate, GetDailySaleData } from './Function'

const DailyItemSaleView = () => {

    const [selectedOption, setSelectedOption] = useState('TODAYS');
    const { Party_Id } = useParams();

    const [data, setData] = useState([]);



    const [dateRange, setDateRange] = useState({
        fromDate: currentDate_ymd,
        toDate: currentDate_ymd,
    });

    const Data = data[0];

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedOption(value);

        const today = new Date();
        let fromDate;
        let toDate;

        if (value === 'TODAYS') {
            fromDate = toDate = formatDate(today);
        } else if (value === 'YESTERDAY') {
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            fromDate = toDate = formatDate(yesterday);
        } else if (value === 'MONTH') {
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            fromDate = formatDate(firstDayOfMonth);
            toDate = formatDate(today);
        } else if (value === 'SIX_MONTH') {
            const sixMonthsAgo = new Date(today);
            sixMonthsAgo.setMonth(today.getMonth() - 6);
            fromDate = formatDate(sixMonthsAgo);
            toDate = formatDate(today);
        }

        setDateRange({ fromDate, toDate });
    };






    useEffect(async () => {
        const jsonData = await GetDailySaleData({ fromDate: dateRange.fromDate, toDate: dateRange.toDate, Party_Id: Party_Id, })
        setData(jsonData.Data)
    }, [Party_Id, dateRange])




    return (
        <Card style={{ background: 'whitesmoke', margin: "10px", boxShadow: '0px 1px 5px 1px grey', }}>


            <CardBody style={{
                margin: "5px",
                background: 'rgb(224 227 245)',
                marginTop: "10px",
                paddingBottom: '15px',
                paddingLeft: '13px',
                paddingRight: '13px',
                borderRadius: '8px',
                boxShadow: '0px 1px 5px 1px grey',
                opacity: 0.8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
            }}>




                <h1 style={{ color: '#5156be' }}>{Data?.PartyName}</h1>
                <h4 style={{ color: '#5156be' }}>{Data?.PartyAddress}</h4>




            </CardBody>


            <CardBody style={{
                margin: "5px",
                background: 'rgb(235 238 255)',
                marginTop: "6px",
                paddingBottom: '15px',
                paddingLeft: '13px',
                paddingRight: '13px',
                borderRadius: '8px',
                boxShadow: '0px 1px 5px 1px grey',
                opacity: 0.8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
            }}>
                <Row>

                    <div className="flex-shrink-0">
                        <span className="badge rounded-pill badge-soft-primary fw-large" style={{ fontSize: "35px" }}> ₹ {Data?.TotalAmount ? amountCommaSeparateFunc(Data.TotalAmount) : 0}</span>
                    </div>

                </Row>
            </CardBody>

            <Row className="align-items-center">
                <div className="d-flex flex-wrap align-items-center mb-n2 mt-1 ">
                    <div style={{ marginLeft: "5px" }}>
                        <select className="form-select form-select-sm"
                            value={selectedOption}
                            onChange={handleChange}
                        >
                            <option value="TODAYS">Today's</option>
                            <option value="YESTERDAY">Yesterday</option>
                            <option value="MONTH">Month</option>
                            <option value="SIX_MONTH">Six Month</option>

                        </select>
                    </div>
                </div>
                <Col xl={4}>

                    <div className="p-1 mt-1">
                        {
                            Data?.TopSaleItems.map((element, index) => {
                                return <div className="mt-1">
                                    <div className="d-flex align-items-center">

                                        <div className="flex-grow-1 ms-1">
                                            <span className="font-size-16">{element.ItemName}</span>
                                        </div>

                                        <div className="flex-shrink-0" style={{ marginRight: "10px" }}>
                                            <span style={{ width: "80px" }} className="badge rounded-pill badge-soft-success font-size-12 fw-medium">{element.TotalQuantity}</span>
                                        </div>

                                        <div className="flex-shrink-0">
                                            <span className="badge rounded-pill badge-soft-primary font-size-12 fw-medium"> ₹{amountCommaSeparateFunc(element.TotalAmount)}</span>
                                        </div>
                                    </div>
                                </div>

                            })
                        }


                    </div>


                </Col>
            </Row>

            {/* <CardBody> */}
            <div id="pie-chart" className="e-chart">
                {data.length === 0 ?

                    <CardBody style={{
                        margin: "5px",
                        background: 'rgb(224 227 245)',
                        marginTop: "10px",
                        paddingBottom: '15px',
                        paddingLeft: '13px',
                        paddingRight: '13px',
                        borderRadius: '8px',
                        boxShadow: '0px 1px 5px 1px grey',
                        opacity: 0.8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center'
                    }}>

                        <h1 style={{ color: 'red' }}>Record's Not Available</h1>

                    </CardBody>

                    : <Pie Item={Data?.TopSaleItems ? Data?.TopSaleItems : []} />}


            </div>
            {/* </CardBody> */}
        </Card>
    )
}

export default DailyItemSaleView