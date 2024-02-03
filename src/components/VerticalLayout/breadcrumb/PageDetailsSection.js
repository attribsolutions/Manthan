import React from 'react';
import ChangeCommonParty from '../chnageParty/changeCommonParty';
import CountLabelComp from './CountLabelComp';
import HeaderTitleNewBtn from './HeaderTitleNewBtn';
// import BreadcrumbVertical from '.';

const PageDetailsSection = (props) => {
    return (
        <div className="vertical-menu" >
            <ChangeCommonParty {...props} />
            <div >
                <div id="sidebar-menu" className="detailed-div" style={{ boxShadow: "#c19c464a", }} >
                    <div style={{ padding: "2px", paddingTop: "3px" }}>
                        <div style={{
                            padding: "5px",
                            borderRadius: "3px",
                            backgroundColor: "#977f4a2b", color: "#f4f4f4", height: "100%"
                        }}>
                            <HeaderTitleNewBtn hederTextColor={"white"} />
                            <CountLabelComp />
                            <div className='mt-1'>
                            </div>

                            {/* <div style={{ marginBottom: "15px", marginTop: "15px" }}>
                    <h5 style={{ color: "#f4f4f4eb" }}>Summary</h5>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        <li>
                            Total Transactions: <strong>256</strong>
                        </li>
                        <li>
                            Customers: <strong>120</strong>
                        </li>
                        <li>
                            Date Range: <strong>January 1, 2022 - January 31, 2022</strong>
                        </li>
                    </ul>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <h5 style={{ color: "#f4f4f4eb" }}>Customer Details</h5>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        <li>
                            Customer Name: <strong>John Doe</strong>
                        </li>
                        <li>
                            Email: <strong>john.doe@example.com</strong>
                        </li>
                        <li>
                            Account Type: <strong>Premium</strong>
                        </li>
                    </ul>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <h5 style={{ color: "#f4f4f4eb" }}>Transaction History</h5>
                </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageDetailsSection;
