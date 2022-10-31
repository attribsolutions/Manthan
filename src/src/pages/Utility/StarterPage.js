import React from "react";
import MetaTags from 'react-meta-tags';
import { Container } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const PagesStarter = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Starter Page | Minia - React Admin & Dashboard Template</title>
                </MetaTags>
                <Container fluid>
                    {/* Render Breadcrumbs */}
                    <Breadcrumbs title="Pages" breadcrumbItem="Starter Page" />
                </Container>
            </div>
        </React.Fragment>
    );
};

export default PagesStarter;
