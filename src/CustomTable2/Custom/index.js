import React, { useCallback, useState, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CustomTable.scss';
import { Table } from 'reactstrap';
import { useEffect } from 'react';
import { customTableSearch, mySearchProps } from '../../components/Common/SearchBox/MySearch';

const CustomTable = ({
    id,
    data,        // table row data
    columns,     // table colomn 
    classes,     //custome table  css class
    showPagination = true,//show Pagination condition wise
    dataChange = () => { },//table data changes by search,pagination ,sort call function 
    itemsPerPage = 15,// Number of items per page
    keyField = 'id',
    defaultSorted = null
}) => {
    const columns1 = columns;

    const [sortConfig, setSortConfig] = useState('');
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (defaultSorted.length > 0) {
            setSortConfig({ column: defaultSorted[0].dataField, direction: defaultSorted[0].order })
        }
    }, [defaultSorted])

    const handleSort = (column) => {
        if (column.sort) {
            let columnName = column.dataField;

            let direction = 'asc';
            if (sortConfig && sortConfig.column === columnName && sortConfig.direction === 'asc') {
                direction = 'desc';
            }
            setSortConfig({ column: columnName, direction }) //**direction:  desc or asc*/
        }
    };


    const handleSearch = (val) => {
        setSearchText(val);
        setCurrentPage(1);
    };
    customTableSearch({ onSearch: handleSearch });// main theme search function



    const filteredData = useMemo(() => {
        return data.filter((row) =>
            columns1.some((column) => {
                const columnValue = row[column.dataField];
                const isHidden = column.hidden;

                if (columnValue === null || isHidden || columnValue === undefined) {
                    return false;
                }
                return columnValue.toString().toLowerCase().includes(searchText.toLowerCase());
            })
        );
    }, [data, searchText, columns1]);


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const sortedData = useMemo(() => {
        return sortConfig
            ? [...filteredData].sort((a, b) => {
                if (a[sortConfig.column] < b[sortConfig.column]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.column] > b[sortConfig.column]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            })
            : filteredData;
    }, [filteredData, sortConfig]);


    const pageCount = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;



    const formatRow = (row,rowkey) => {
        return (
            <tr key={row[keyField]}>
                {columns1.map((column) => {
                    if (column.hidden) return null;//if colomn hiiden then not show colomn 
                    return (
                        <td
                            key={`td-${row[keyField]}`}
                            dataField={column.dataField} style={column.rowStyle && column.rowStyle()}
                        >
                            {column.formatter ?
                                column.formatter(row[column.dataField], row,rowkey)
                                : (typeof row[column.dataField] === 'boolean' ? String(row[column.dataField]) : row[column.dataField])
                            }
                        </td>
                    )
                })}
            </tr>
        );
    };

    const tHeder = columns1.map((column) => {
        if (column.hidden) return null;
        return (
            <th dataField={column.dataField}
                style={column.headerStyle && column.headerStyle()}
                onClick={() => handleSort(column)}>

                {column.headerFormatter ? column.headerFormatter(column, data) : column.text}
                {sortConfig && sortConfig.column === column.dataField && (
                    <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                )}
            </th>
        );
    });

    const tBody = useMemo(() => {
        dataChange({ dataCount: sortedData.length, })
        return showPagination ?
            sortedData.slice(startIndex, endIndex).map((row,rowkey) => formatRow(row,rowkey))
            : sortedData.map((row,rowkey) => formatRow(row,rowkey));
    }, [sortedData, startIndex, endIndex]);

    return (
        <div>
            <Table className={classes} id={id}>
                <thead>
                    <tr>
                        {tHeder}
                    </tr>
                </thead>
                <tbody>
                    {tBody}
                </tbody>
            </Table>
            {showPagination &&
                <div className="pagination-container1">
                    <CustomPagination
                        pageCount={pageCount}
                        currentPage={currentPage}
                        handlePageChange={handlePageChange}
                    />
                </div>
            }
        </div>
    );
};

export default CustomTable;







function CustomPagination({ pageCount, currentPage, handlePageChange }) {
    const pages = [];
    const maxVisiblePages = 5; // Total number of visible pagination items

    const getPageNumbers = () => {
        let startPage = Math.max(currentPage - 2, 1);
        let endPage = Math.min(startPage + maxVisiblePages - 1, pageCount);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(endPage - maxVisiblePages + 1, 1);
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    const visiblePages = getPageNumbers();

    // Render start arrow
    if (currentPage > 1) {
        const startItem = (
            <li key="start" onClick={() => handlePageChange(1)}>
                <samp >  &laquo;&laquo;</samp>
            </li>
        );
        pages.push(startItem);
    }

    // Render previous arrow
    if (currentPage > 1) {
        const previousPage = currentPage - 1;
        const previousItem = (
            <li key="previous" onClick={() => handlePageChange(previousPage)}>
                <samp>&laquo;</samp>
            </li>
        );
        pages.push(previousItem);
    }

    // Render page numbers
    for (let i = 0; i < visiblePages.length; i++) {
        const pageNumber = visiblePages[i];
        const isActive = pageNumber === currentPage;

        const pageItem = (
            <li
                key={pageNumber}
                className={isActive ? "active" : ""}
                onClick={() => handlePageChange(pageNumber)}
            >
                {pageNumber}
            </li>
        );

        pages.push(pageItem);
    }

    // Render next arrow
    if (currentPage < pageCount) {
        const nextPage = currentPage + 1;
        const nextItem = (
            <li key="next" onClick={() => handlePageChange(nextPage)}>
                &raquo;
            </li>
        );
        pages.push(nextItem);
    }

    // Render end arrow
    if (currentPage < pageCount) {
        const endItem = (
            <li key="end" onClick={() => handlePageChange(pageCount)}>
                &raquo;&raquo;
            </li>
        );
        pages.push(endItem);
    }

    return <ul className="pagination1">{pages}</ul>;
}



