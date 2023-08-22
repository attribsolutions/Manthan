import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import './CustomTable.scss';
import { customTableSearch } from '../components/Common/SearchBox/MySearch';
import BootstrapTable from 'react-bootstrap-table-next';
import CustomPagination from './TablePagination';


const CustomTable = ({
    data,
    columns,
    keyField,
    defaultSearchText,
    onDataSizeChange,
    itemsPerPage = 15,
    paginationEnabled = false,
    classes,
    updatedRowBlinkId,
    ...rest
}) => {


    const [searchText, setSearchText] = useState(defaultSearchText || '');
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearch = (val) => {
        setSearchText(val);
        setCurrentPage(1);
    };

    customTableSearch({ onSearch: handleSearch });

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const rowClesess = (row) => {
        let cs = '';
        if (row.IsRecordDeleted) {
            cs += '_deleted-Row '; // Add a space after the class name
        }
        if ((row[keyField] === updatedRowBlinkId)) {
            cs += '_row-blink '; // Add a space after the class name
        }
        return cs;
    };

    const sortCaretFunction = {
        sortCaret: (order, column) => {
            if (!order) {
                return null;
            } else if (order === 'asc') {
                return <i className="fas fa-arrow-up pl-1 font-size-12"></i>;
            } else if (order === 'desc') {
                return <i className="fas fa-arrow-down pl-1 font-size-12"></i>;
            }
            return null;
        }
    };


    useEffect(() => {
        handleSearch(searchText);
    }, []);

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
        onDataSizeChange({ dataCount: filteredData.length, filteredData: filteredData }); // Notify the parent about the filtered data count
        return paginationEnabled ? filteredData.slice(startIndex, endIndex) : filteredData;
    }, [filteredData, startIndex, endIndex, paginationEnabled]);


    return (
        <div className="table-responsive"  >
            <BootstrapTable data={slicedData} columns={columns}
                keyField={keyField}
                classes='custom-table'
                rowClasses={rowClesess}
                sort={sortCaretFunction}
                hover
                {...rest} />

            {paginationEnabled &&
                <CustomPagination
                    pageCount={pageCount}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                />
            }
        </div>
    );
};

CustomTable.propTypes = {
    keyField: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    defaultSearchText: PropTypes.string,
    onDataSizeChange: PropTypes.func,
    itemsPerPage: PropTypes.number,
    paginationEnabled: PropTypes.bool,
    classes: PropTypes.string,
    // ... Add any other props here
};
export default CustomTable;


function rowClesess(row) {

    let cs = '';

    if (row.IsRecordDeleted) {
        cs += '_deleted-Row '; // Add a space after the class name
    }
    if ((row[this.keyField] === this.updatedRowBlinkId)) {
        cs += '_row-blink '; // Add a space after the class name
    }

    return cs;
};