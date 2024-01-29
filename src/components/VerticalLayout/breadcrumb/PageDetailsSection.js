import React from 'react';
import ChangeCommonParty from '../chnageParty/changeCommonParty';
import CountLabelComp from './CountLabelComp';
import HeaderTitleNewBtn from './HeaderTitleNewBtn';
// import BreadcrumbVertical from '.';

const PageDetailsSection = () => {
    return (
        <div style={{ padding: "5px", paddingTop: "10px" }}>
            <ChangeCommonParty />
            <div style={{ padding: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: "#4fa2eb3d", color: "#f4f4f4", height: "100%" }}>
                <HeaderTitleNewBtn hederTextColor={"white"} />
                <div className='mt-1'>
                    <CountLabelComp />
                </div>

                <div style={{ marginBottom: "15px", marginTop: "15px" }}>
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
                    {/* Include your transaction history or other relevant content here */}
                    {/* You may use tables, lists, or other components based on your design */}
                </div>
            </div>
        </div>
    );
};

export default PageDetailsSection;
