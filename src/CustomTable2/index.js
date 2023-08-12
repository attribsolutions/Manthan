import React, { useState, useMemo, useEffect } from 'react';
import './CustomTable.scss';
import { customTableSearch } from '../components/Common/SearchBox/MySearch';
import BootstrapTable from 'react-bootstrap-table-next';
import CustomPagination from './CustomPagination';
import { useDispatch, useSelector } from 'react-redux';
import { BreadcrumbNonDeleteButton } from '../store/actions';

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

  
    const rowStyles = (row) => {
        if (row.IsRecordDeleted) {
            return { textDecoration: 'line-through' };
        }
        return {};
    };

    return (
        <div className="table-responsive table "  >

            <BootstrapTable data={slicedData} columns={columns}
                rowStyle={rowStyles}
                {...rest} />

            {/* Pagination component */}
            <div>
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

