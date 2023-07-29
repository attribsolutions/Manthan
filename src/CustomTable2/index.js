import React, { useState, useMemo } from 'react';
import './CustomTable.scss';
import { customTableSearch } from '../components/Common/SearchBox/MySearch';
import BootstrapTable from 'react-bootstrap-table-next';

const CustomTable = ({
    data, // table row data
    columns, // table columns
    onDataSizeChange = () => { }, // table data changes by search, pagination, sort - callback function
    itemsPerPage = 15, // Number of items per page
    ...rest
}) => {
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Function to handle search
    const handleSearch = (val) => {
        setSearchText(val);
        setCurrentPage(1);
    };

    // Call the main theme search function
    customTableSearch({ onSearch: handleSearch });

    // Function to filter the data based on search text
    const filteredData = useMemo(() => {
        return data.filter((row) =>
            columns.some((column) => {
                const columnValue = row[column.dataField];
                const isHidden = column.hidden;

                if (columnValue === null || isHidden || columnValue === undefined) {
                    return false;
                }
                return columnValue.toString().toLowerCase().includes(searchText.toLowerCase());
            })
        );
    }, [data, searchText, columns]);

    const pageCount = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;

    const slicedData = useMemo(() => {
        // ...
        onDataSizeChange({ dataCount: filteredData.length }); // Notify the parent about the filtered data count
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, startIndex, endIndex]);


    // Function to handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <BootstrapTable data={slicedData} columns={columns} {...rest} />

            {/* Pagination component */}
            <div className="pagination-container1">
                <CustomPagination
                    pageCount={pageCount}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                />
            </div>
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

    // Function to render pagination item
    const renderPageItem = (pageNumber, label) => {
        const isActive = pageNumber === currentPage;

        return (
            <li
                key={label}
                className={isActive ? 'active' : ''}
                onClick={() => handlePageChange(pageNumber)}
            >
                {label}
            </li>
        );
    };

    // Render start arrow
    if (currentPage > 1) {
        pages.push(renderPageItem(1, '<<'));
    }

    // Render previous arrow
    if (currentPage > 1) {
        const previousPage = currentPage - 1;
        pages.push(renderPageItem(previousPage, '<'));
    }

    // Render page numbers
    for (let i = 0; i < visiblePages.length; i++) {
        const pageNumber = visiblePages[i];
        pages.push(renderPageItem(pageNumber, pageNumber));
    }

    // Render next arrow
    if (currentPage < pageCount) {
        const nextPage = currentPage + 1;
        pages.push(renderPageItem(nextPage, '>'));
    }

    // Render end arrow
    if (currentPage < pageCount) {
        pages.push(renderPageItem(pageCount, '>>'));
    }

    return <ul id="c__pagination">{pages}</ul>;
}
