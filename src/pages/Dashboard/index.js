import React from 'react';
import { useEffect } from 'react';
import MetaTags from 'react-meta-tags';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {  Container,} from "reactstrap";

const Dashboard = () => {
    // const history = useHistory();
    // const { roleAccessSidbarData } = useSelector(state => ({
    //     roleAccessSidbarData: state.Login.roleAccessSidbarData
    // }))

    // useEffect(() => {
      
    //     if (roleAccessSidbarData.length > 0) {
    //         const findDashboard = roleAccessSidbarData.find((index) => (index.ModuleName === "Dashboard"))
    //         if (!(findDashboard === undefined)) {
    //             history.push(findDashboard.ModuleData[0].ActualPagePath)
    //         }
    //     }

    // }, [roleAccessSidbarData])
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