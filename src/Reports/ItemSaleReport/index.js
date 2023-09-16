import React from "react";

import ContextDataProvider from "./ContextDataProvider";
import HeaderSection from "./HeaderSection";
import ShowTable from "./showTable";

const ItemSaleReport = () => {

    return (
        <ContextDataProvider>
            <HeaderSection />
            <ShowTable />
        </ContextDataProvider>
    )
}

export default ItemSaleReport;
