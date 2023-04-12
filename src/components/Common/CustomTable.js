import { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "./SearchBox/MySearch";



export const CustomHook = (data) => {
    const [tableData, setTableData] = useState([]);
    useEffect(() => {
        setTableData(data)
    }, [data]);
    return [tableData, setTableData];
};


export function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

const CustomTable = (props) => {
    let { data = [], columns, customSearch } = props
    const [tableData, setTableData] = CustomHook(data);

    const serach = (text) => {

        let search = text.toLowerCase()

        const filter = data.filter((item) => {
            let found = false

            if (item.header) { return true }

            for (let i = 0; i < columns.length; i++) {

                let isCell = item[columns[i].dataField]
                if (!(isCell === null)
                    && !(isCell === undefined)
                    && typeof isCell !== 'object'
                    && !Array.isArray(isCell)
                ) {
                    if (!found) {
                        isCell = JSON.stringify(isCell)
                        isCell = isCell.toLowerCase(isCell)
                        found = isCell.includes(search)
                    }
                }
            }
            return found

        })
        let hasHedRow1 = []

        const grouped = groupBy(filter, pet => pet.Party);
        grouped.forEach(i => {
            if (i.length > 1) {
                i.forEach(k => {
                    hasHedRow1.push(k)
                })
            }
        })

        setTableData(hasHedRow1)

    }
    mySearchProps({
        onSearch: customSearch ? customSearch : serach,
    })
    const props2 = Object.assign({}, props, { data: tableData });
    return (
        <>
            <BootstrapTable
                {...props2}
            ></BootstrapTable>
        </>
    );
};

export default CustomTable;