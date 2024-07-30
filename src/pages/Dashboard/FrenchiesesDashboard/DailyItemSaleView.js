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

    const [data, setData] = useState({});
    const [loading, setloading] = useState(false);

    const [dateRange, setDateRange] = useState({
        fromDate: currentDate_ymd,
        toDate: currentDate_ymd,
    });

    const decodeId = (encodedId) => {
        return atob(encodedId); // Converts Base64 encoded string back to ID
    };

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
        setloading(true)
        const decodeId_PartyID = decodeId(Party_Id)
        const jsonData = await GetDailySaleData({ fromDate: dateRange.fromDate, toDate: dateRange.toDate, Party_Id: Number(decodeId_PartyID), })
        setloading(false)
        setData(jsonData.Data[0])
    }, [Party_Id, dateRange])

    return (
        Object.keys(data).length === 0 ?
            <button className="btn btn-primary w-100 waves-effect waves-light" autoFocus type="button">
                <div className="dot-pulse"> <span>Fetching Details </span> &nbsp;
                    <div className="bounce1" style={{ background: "white" }}></div>
                    <div className="bounce2" style={{ background: "white" }}></div>
                    <div className="bounce3" style={{ background: "white" }}></div>
                </div> </button>
            :
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
                    <h2 style={{ color: '#5156be' }}>{data?.PartyName}</h2>
                    <h5 style={{ color: '#5156be' }}>{data?.PartyAddress}</h5>
                    <h6 style={{ color: '#5156be' }}>(Bill Count:{data?.BillCount})</h6>

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
                        {!loading ? <div className="flex-shrink-0">
                            <span className="badge rounded-pill badge-soft-primary fw-large" style={{ fontSize: "35px" }}> ₹ {data?.TotalAmount ? amountCommaSeparateFunc(data.TotalAmount) : 0}</span>
                        </div>
                            :
                            <div className="flex-shrink-0">
                                <span className="badge rounded-pill badge-soft-primary fw-large" style={{ fontSize: "40px" }}>
                                    <div className="dot-pulse" style={{ marginTop: "-14px" }}> <span></span> &nbsp;
                                        <div className="bounce1" style={{ background: "white" }}></div>
                                        <div className="bounce2" style={{ background: "white" }}></div>
                                        <div className="bounce3" style={{ background: "white" }}></div>
                                    </div>
                                </span>
                            </div>
                        }

                    </Row>
                </CardBody>

                <Row className="align-items-center">
                    <div className="d-flex flex-wrap align-items-center mb-n2 mt-1 ">
                        <div style={{ marginLeft: "5px" }}>
                            <select className="form-select form-select-lg"
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
                                data?.TopSaleItems?.map((element, index) => {
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
                    {(data?.TopSaleItems?.length === undefined) || (data?.TopSaleItems?.length === 0) ?

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

                        : <Pie Item={data.TopSaleItems} />}


                </div>
                {/* </CardBody> */}
            </Card>
    )
}

export default DailyItemSaleView