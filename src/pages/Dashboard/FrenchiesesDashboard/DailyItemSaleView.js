import React, { useEffect, useState } from 'react'


import { Card, CardBody, Col, Label, Row } from 'reactstrap'
import Pie from './pie'


import { amountCommaSeparateFunc, currentDate_dmy, currentDate_ymd, isFutureDate } from '../../../components/Common/CommonFunction'


import { useParams } from 'react-router-dom';

import { convertTo12Hour, formatDate, GetDailySaleData } from './Function'
import { C_DatePicker } from '../../../CustomValidateForm';
import { Go_Button } from '../../../components/Common/CommonButton';

const DailyItemSaleView = () => {

    const [selectedOption, setSelectedOption] = useState('TODAYS');
    const { Party_Id } = useParams();

    const [data, setData] = useState({});
    const [loading, setloading] = useState(false);

    const [dateRange, setDateRange] = useState({
        fromDate: currentDate_ymd,
        toDate: currentDate_ymd,
    });

    const [CoustomDate, setCoustomDate] = useState({
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
        } else if (value === 'CUSTOM') {
            return
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

    const goButtonHandler = async () => {
        setloading(true)
        const decodeId_PartyID = decodeId(Party_Id)
        const jsonData = await GetDailySaleData({ fromDate: CoustomDate.fromDate, toDate: CoustomDate.toDate, Party_Id: Number(decodeId_PartyID), })
        setloading(false)
        setData(jsonData.Data[0])
    }

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
                    <h6 style={{ color: '#5156be', fontSize: "20px" }}>    <span style={{ fontSize: "20px" }} className="badge rounded-pill badge-soft-primary font-size-19 fw-medium"> Bill Count:{data?.BillCount} </span> </h6>

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
                    <div className="d-flex flex-wrap align-items-center mb-n2 mt-1 w-100">
                        <div style={{ marginLeft: "5px", marginRight: "5px" }} className="w-100">
                            <select className="form-select form-select-lg w-100"
                                value={selectedOption}
                                onChange={handleChange}
                            >
                                <option value="TODAYS">Today's</option>
                                <option value="YESTERDAY">Yesterday</option>
                                <option value="MONTH">Month</option>
                                <option value="SIX_MONTH">Six Month</option>
                                <option value="CUSTOM">Custom Date</option>


                            </select>
                            {selectedOption === "CUSTOM" && (
                                <div style={{ marginTop: "10px", backgroundColor: "#whitesmoke" }}>
                                    <CardBody className="c_card_body">
                                        <Label className="col-sm-5 "
                                            style={{ width: "115px" }}>From Date</Label>
                                        <C_DatePicker
                                            options={{
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                                maxDate: "today",
                                            }}
                                            name="FromDate"
                                            value={CoustomDate.fromDate}
                                            onChange={(e, date) => {
                                                setCoustomDate((i) => {
                                                    const a = { ...i }
                                                    a.fromDate = date;
                                                    return a
                                                })
                                            }}
                                        />
                                        <Label className="col-sm-5 mt-1"
                                            style={{ width: "115px" }}>To Date</Label>
                                        <C_DatePicker
                                            options={{
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                                maxDate: "today",
                                            }}
                                            name="ToDate"
                                            value={CoustomDate.toDate}
                                            onChange={(e, date) => {
                                                setCoustomDate((i) => {
                                                    const a = { ...i }
                                                    a.toDate = date;
                                                    return a
                                                })
                                            }}
                                        />

                                        <Col sm="1" className="mt-3 ">
                                            <Go_Button
                                                onClick={goButtonHandler}
                                                loading={loading}
                                            />
                                        </Col>
                                    </CardBody>
                                </div>
                            )}
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
                                                <span style={{ width: "90px" }} className="badge rounded-pill badge-soft-success font-size-12 fw-medium">{element.TotalQuantity} {element.UnitName}</span>
                                            </div>

                                            <div className="flex-shrink-0">
                                                <span style={{ width: "90px" }} className="badge rounded-pill badge-soft-primary font-size-12 fw-medium"> ₹&nbsp;{amountCommaSeparateFunc(element.TotalAmount)}</span>
                                            </div>
                                        </div>
                                    </div>

                                })
                            }


                        </div>


                    </Col>
                </Row>

                {/* <CardBody> */}
                <span className="badge rounded-pill badge-soft-primary font-size-18 fw-medium"> First Bill :{data?.FirstBillTime ? convertTo12Hour(data?.FirstBillTime) : ""} </span>

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
                <span className="badge rounded-pill badge-soft-primary font-size-18 fw-medium"> Last Bill :{data?.LastBillTime ? convertTo12Hour(data?.LastBillTime) : ""} </span>
                {/* </CardBody> */}
            </Card>
    )
}

export default DailyItemSaleView