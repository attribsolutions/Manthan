import React from 'react';
import BreadcrumbNew from './BreadcrumbNew'; // Adjust the path based on your project structure
import ChangeCommonParty from './changeCommonParty';

const PageDetailsSection = () => {
    return (
        <div style={{marginTopTop:"-10px"}}>
            <ChangeCommonParty />
            <div style={{ padding: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", color: "#f4f4f4", height: "100%" }}>
                <BreadcrumbNew />

                <div style={{ marginBottom: "15px", marginTop: "15px" }}>
                    <h5 style={{ color: "#f4f4f4" }}>Summary</h5>
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
                    <h5 style={{ color: "#f4f4f4" }}>Customer Details</h5>
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
                    <h5 style={{ color: "#f4f4f4" }}>Transaction History</h5>
                    {/* Include your transaction history or other relevant content here */}
                    {/* You may use tables, lists, or other components based on your design */}
                </div>
            </div>
        </div>
    );
};

export default PageDetailsSection;
