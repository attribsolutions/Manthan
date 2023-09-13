import React, { useState } from 'react'
import { useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Col, FormGroup, Label, Row } from 'reactstrap';
import { Go_Button, PageLoadingSpinner } from '../../components/Common/CommonButton';
import { breadcrumbReturnFunc } from '../../components/Common/CommonFunction';
import { mySearchProps } from '../../components/Common/SearchBox/MySearch';
import { C_DatePicker, C_Select } from '../../CustomValidateForm';

const TransactionLog = () => {
    const dispatch = useDispatch();
    const history = useHistory()



    const [userPageAccessState, setUserAccState] = useState('');


    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        goBtnloading,
        userAccess,
        pageField } = useSelector((state) => ({
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));



    // userAccess useEffect
    useEffect(() => {
        let locationPath = history.location.pathname;
        let userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (userAcc) {
            setUserAccState(userAcc);
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    const HeaderContent = () => {
        return <div className="px-2  c_card_filter text-black " >
         
                <div className=" row">
                    <Col sm="3" className="">
                        <FormGroup className="mb- row mt-3 " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "83px" }}>From Date</Label>
                            <Col sm="7">
                                <C_DatePicker
                                    name='fromdate'
                                // value={fromdate}
                                // onChange={fromdateOnchange}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col sm="3" className="">
                        <FormGroup className="mb- row mt-3 " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "65px" }}>To Date</Label>
                            <Col sm="7">
                                <C_DatePicker
                                    nane='todate'
                                // value={todate}
                                // onChange={todateOnchange}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col sm="5">
                        <FormGroup className="mb-2 row mt-3 " >
                            <Label className="col-md-4 p-2"
                                style={{ width: "115px" }}>Supplier Name</Label>
                            <Col md="5">
                                <C_Select
                                    // value={venderSelect}
                                    classNamePrefix="select2-Customer"
                                    options={[]}
                                    // onChange={venderOnchange}
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 2 })
                                    }}
                                />
                            </Col>
                        </FormGroup>
                    </Col >

                </div>
                <div className=" row">
                    <Col sm="3" className="">
                        <FormGroup className="mb- row mt-3 " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "83px" }}>From Date</Label>
                            <Col sm="7">
                                <C_DatePicker
                                    name='fromdate'
                                // value={fromdate}
                                // onChange={fromdateOnchange}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col sm="3" className="">
                        <FormGroup className="mb- row mt-3 " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "65px" }}>To Date</Label>
                            <Col sm="7">
                                <C_DatePicker
                                    nane='todate'
                                // value={todate}
                                // onChange={todateOnchange}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col sm="5">
                        <FormGroup className="mb-2 row mt-3 " >
                            <Label className="col-md-4 p-2"
                                style={{ width: "115px" }}>Supplier Name</Label>
                            <Col md="5">
                                <C_Select
                                    // value={venderSelect}
                                    classNamePrefix="select2-Customer"
                                    options={[]}
                                    // onChange={venderOnchange}
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 2 })
                                    }}
                                />
                            </Col>
                        </FormGroup>
                    </Col >

                    <Col sm="1" className="mt-3 ">
                        <Go_Button
                        // id={gobtnId}
                        // loading={reducers.loading}
                        // onClick={goButtonHandler}
                        />
                    </Col>
                </div>
            
        </div>
    }

    return (
        <React.Fragment>
            {/* <PageLoadingSpinner isLoading={goBtnloading || !pageField} /> */}
            <div className="page-content">
                {/* <PartyDropdown_Common
                    goButtonHandler={partySelectButtonHandler}
                    changeButtonHandler={partyOnChngeButtonHandler} /> */}
                <HeaderContent />
                <ToolkitProvider
                    keyField={"Item_id"}
                    // defaultSorted={defaultSorted}
                    data={[]}
                    columns={[{}]}
                    search
                >
                    {(toolkitProps,) => (
                        <React.Fragment>
                            <Row>
                                <Col xl="12">
                                    <div className="table-responsive table" style={{ minHeight: "45vh" }}>
                                        <BootstrapTable
                                            keyField={"Item_id"}
                                            id="table_Arrow"
                                            classes={"table  table-bordered table-hover"}
                                            noDataIndication={
                                                <div className="text-danger text-center ">
                                                    Items Not available
                                                </div>
                                            }
                                            onDataSizeChange={(e) => {
                                                // _cfunc.tableInputArrowUpDounFunc("#table_Arrow")
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
        </React.Fragment>
    )
}

export default TransactionLog
