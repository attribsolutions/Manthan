import { useState } from 'react';
import React, { createContext } from 'react'
import { currentDate_ymd } from '../../components/Common/CommonFunction';
import * as initail from "./hardcodeDetails";
import { useContext } from 'react';
import { SortButtonFunc } from './SortAndExcelDownloadFunc';

const Context = createContext();

export default function ContextDataProvider({ children }) {

    const [userPageAccessState, setUserAccState] = useState('');

    const [hederFilters, setHederFilters] = useState({
        fromdate: currentDate_ymd,
        todate: currentDate_ymd,
    });

    const [channelFromSelect, setChannelFromSelect] = useState(initail.INITIAL_ZERO);
    const [supplierSelect, setSupplierSelect] = useState(initail.INITIAL_ZERO);

    const [channelToSelect, setChannelToSelect] = useState(initail.INITIAL_ARRAY);
    const [routeSelect, setRouteSelect] = useState(initail.INITIAL_ARRAY);
    const [customerSelect, setCustomerSelect] = useState(initail.INITIAL_ARRAY);
    const [itemNameSelect, setItemNameSelect] = useState(initail.INITIAL_ARRAY);
    const [productSelect, setProductSelect] = useState(initail.INITIAL_ARRAY);
    const [subProductSelect, setSubProductSelect] = useState(initail.INITIAL_ARRAY);
    const [unitDropdownSelect, setUnitDropdownSelect] = useState({ value: '', label: "select" });

    const [customerCheckbox, setCustomerCheckbox] = useState(false);
    const [routeCheckbox, setRouteCheckbox] = useState(false);
    const [channelToCheckbox, setChannelToCheckbox] = useState(false);
    const [productCheckbox, setProductCheckbox] = useState(true);
    const [subProductCheckbox, setSubProductCheckbox] = useState(false);
    const [itemNameCheckbox, setItemNameCheckbox] = useState(false);
    const [fromDateCheckbox, setFromDateCheckbox] = useState(false);
    const [channelFromCheckbox, setChannelFromCheckbox] = useState(false);
    const [supplierCheckbox, setSupplierCheckbox] = useState(false);

    const [showAlsoSelect, setShowAlsoSelect] = useState([]);

    const [tableData, setTableData] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState(initail.DEFAULT_TABLE_COLUMNS);
    const [initaialBaseData, setInitaialBaseData] = useState([]);

    async function sortManipulationFunc(baseData) {

        let baseState = await SortButtonFunc({
            baseData,
            fromDateCheckbox,
            channelFromCheckbox,
            channelToCheckbox,
            supplierCheckbox,
            showAlsoSelect,
            routeCheckbox,
            customerCheckbox,
            productCheckbox,
            subProductCheckbox,
            itemNameCheckbox,
            unitDropdownSelect,
            routeSelect,
            channelToSelect,
            customerSelect,
            itemNameSelect,
            subProductSelect,
            productSelect,
        })

        return baseState
    }

    const providerState = {
        userPageAccessState, setUserAccState,
        hederFilters, setHederFilters,
        channelFromSelect, setChannelFromSelect,
        channelToSelect, setChannelToSelect,
        routeSelect, setRouteSelect,
        supplierSelect, setSupplierSelect,
        customerSelect, setCustomerSelect,
        unitDropdownSelect, setUnitDropdownSelect,
        itemNameSelect, setItemNameSelect,
        productSelect, setProductSelect,
        subProductSelect, setSubProductSelect,
        customerCheckbox, setCustomerCheckbox,
        routeCheckbox, setRouteCheckbox,
        channelToCheckbox, setChannelToCheckbox,
        productCheckbox, setProductCheckbox,
        subProductCheckbox, setSubProductCheckbox,
        itemNameCheckbox, setItemNameCheckbox,
        fromDateCheckbox, setFromDateCheckbox,
        channelFromCheckbox, setChannelFromCheckbox,
        supplierCheckbox, setSupplierCheckbox,
        showAlsoSelect, setShowAlsoSelect,
        tableData, setTableData,
        selectedColumns, setSelectedColumns,
        initaialBaseData, setInitaialBaseData,
        sortManipulationFunc
    };

    return (
        <Context.Provider value={providerState}>
            {children}
        </Context.Provider>
    );
}
export const ItemSaleContext = () => useContext(Context)
