import React from 'react';
import MetaTags from 'react-meta-tags';
import { Container, } from "reactstrap";

const Dashboard = () => {

    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Dashboard | FoodERP 2.0 - React Admin & Dashboard Template</title>
                </MetaTags>
                <Container fluid>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default Dashboard;