import React from "react";

import ContextDataProvider from "./ContextDataProvider";
import HeaderSection from "./HeaderSection";
import ShowTable from "./showTable";

const ItemSaleReport = () => {

    return (
        <div className="page-content " style={{ paddingBottom: "10vh" }}>
            <ContextDataProvider>
                <HeaderSection />
                <ShowTable />
            </ContextDataProvider>
        </div >
    )
}

export default ItemSaleReport;
