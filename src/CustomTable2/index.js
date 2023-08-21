import React, { useState, useMemo, useEffect, useCallback } from 'react';
import './CustomTable.scss';
import { customTableSearch } from '../components/Common/SearchBox/MySearch';

import TablePagination from './TablePagination';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { Input } from 'reactstrap';

const CustomTable = ({
    keyField,
    data,
    columns,
    itemsPerPage = 15,
    paginationEnabled=true,
    defaultSorted = [],
    noDataIndication,
    selectRow = undefined,
    defaultSearchText,
    onDataSizeChange,
    updatedRowBlinkId,
   
}) => {
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState([]);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const handleSearch = useCallback((val) => {
        setSearchText(val);
        setCurrentPage(1);
    }, []);

    useEffect(() => {
        customTableSearch({ onSearch: handleSearch });
    }, [handleSearch]);

    useEffect(() => {
        setSelectedRows([]);
    }, [data]);

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

    const sortedData = useMemo(() => {
        if (sortField && sortOrder) {
            return [...filteredData].sort((a, b) => {
                const aValue = a[sortField];
                const bValue = b[sortField];

                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
                }
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }
                if (aValue === null || aValue === undefined) {
                    return sortOrder === 'asc' ? -1 : 1;
                }
                if (bValue === null || bValue === undefined) {
                    return sortOrder === 'asc' ? 1 : -1;
                }
                return sortOrder === 'asc' ? aValue.toString().localeCompare(bValue.toString()) : bValue.toString().localeCompare(aValue.toString());
            });
        }
        return filteredData;
    }, [filteredData, sortField, sortOrder]);

    const pageCount = Math.ceil(sortedData.length / itemsPerPage);
    
    // Using useMemo to compute displayedData
    const displayedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = currentPage * itemsPerPage;
        return sortedData.slice(startIndex, endIndex);
    }, [currentPage, sortedData, itemsPerPage]);

    useEffect(() => {
        if (defaultSorted.length > 0) {
            const defaultSort = defaultSorted[0];
            setSortField(defaultSort.dataField);
            setSortOrder(defaultSort.order);
        }
    }, [defaultSorted]);

    useEffect(() => {
        if (defaultSearchText !== undefined && defaultSearchText !== null) {
            setSearchText(defaultSearchText);
            setCurrentPage(1);
        }
    }, [defaultSearchText]);

    useEffect(() => {
        onDataSizeChange({ dataCount: sortedData.length, filteredData: sortedData });
    }, [sortedData]);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    const handleSelectAllRows = useCallback(() => {
        const nonSelected = selectRow && selectRow.nonSelected ? selectRow.nonSelected : [];
        const selectableRows = displayedData.reduce((selectable, row) => {
            if (!nonSelected.includes(row[keyField])) {
                selectable.push(row[keyField]);
            }
            return selectable;
        }, []);

        if (selectedRows.length === selectableRows.length) {
            setSelectedRows([]);
            data.forEach(row => {
                if (selectableRows.includes(row[keyField])) {
                    row.selectCheck = false;
                }
            });
        } else {
            data.forEach(row => {
                if ((selectableRows.includes(row[keyField]))) {
                    row.selectCheck = true;
                }
            });
            setSelectedRows(selectableRows);
        }
    }, [selectedRows, keyField, displayedData, selectRow, data]);

    const handleSort = useCallback((field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    }, [sortField, sortOrder]);

    const handleRowSelect = useCallback((e, row) => {
        const rowId = row[keyField];
        data.forEach(row => {
            if (row[keyField] === rowId) {
                row.selectCheck = e.target.checked;
            }
        });
        setSelectedRows(prevSelectedRows => {
            if (prevSelectedRows.includes(rowId)) {
                return prevSelectedRows.filter((selectedRow) => selectedRow !== rowId);
            } else {
                return [...prevSelectedRows, rowId];
            }
        });
    }, [selectedRows, keyField, data]);

    const isAllSelected = useMemo(() => {
        return displayedData.every(row =>
            selectedRows.includes(row[keyField]) || (selectRow && selectRow.nonSelected.includes(row[keyField]))
        );
    }, [displayedData, selectedRows, keyField, selectRow]);

    return (
        <div className="table-rep-plugin">
            <div className="table-responsive mb-0" data-pattern="priority-columns">
                <Table className="table table-bordered custom-table">
                    <Thead>
                        <Tr>
                            {selectRow && (
                                <Th>
                                    <span>
                                        <Input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={handleSelectAllRows}
                                        />{' '}
                                        <label>{selectRow.selectHeaderLabel}</label>
                                    </span>
                                </Th>
                            )}
                            {columns.map((column, key) => (
                                <Th
                                    key={key}
                                    onClick={() => {
                                        if (column.sort) {
                                            handleSort(column.dataField);
                                        }
                                    }}
                                >
                                    <div className="column-header">
                                        {column.headerFormatter ? column.headerFormatter(column, key) : <span className="column-text">{column.text}</span>}
                                        {column.sort && (
                                            <span className={`sort-icon ${sortField === column.dataField ? 'active' : ''}`}>
                                                {sortField === column.dataField && sortOrder === 'asc' && '↑'}
                                                {sortField === column.dataField && sortOrder === 'desc' && '↓'}
                                            </span>
                                        )}
                                    </div>
                                </Th>
                            ))}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {displayedData.length === 0 && noDataIndication && (
                            <Tr>
                                <Td colSpan={selectRow ? columns.length + 1 : columns.length}>
                                    {noDataIndication}
                                </Td>
                            </Tr>
                        )}
                        {displayedData.map((row) => {
                            const shouldBlink = updatedRowBlinkId !== undefined && row[keyField] === updatedRowBlinkId;
                            return (
                                <Tr
                                    key={row[keyField]}
                                    data-selected={selectedRows.includes(row[keyField])}
                                    data-record-deleted={row.IsRecordDeleted}
                                    className={shouldBlink ? 'row-blink' : ''}
                                >
                                    {selectRow && (
                                        <Td>
                                            <Input
                                                type="checkbox"
                                                className='check-disabled'
                                                checked={selectedRows.includes(row[keyField])}
                                                disabled={(selectRow && selectRow.nonSelected.includes(row[keyField]))}
                                                onChange={(e) => handleRowSelect(e, row)}
                                            />
                                        </Td>
                                    )}
                                    {columns.map((column, colIndex) => (
                                        <Td key={colIndex}  className={`text-align-${column.align || 'left'} ${column.classes || ''}`}>
                                            {!column.headerFormatter && <div data-testid="td-before" className="tdBefore">{column.text}</div>}
                                            {column.formatter
                                                ? column.formatter(row[column.dataField], row, colIndex, column.formatExtraData)
                                                : row[column.dataField]}
                                        </Td>
                                    ))}
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
                {paginationEnabled && (
                    <TablePagination pageCount={pageCount} currentPage={currentPage} handlePageChange={handlePageChange} />
                )}
            </div>
        </div>
    );
};

export default CustomTable;


// import React from 'react';
// import './CustomTable.scss'; // Import your stylesheet
// import useCustomTable from './useCustomTable';
// import TableHeader from './TableHeader';
// import TableRow from './TableRow';
// import TablePagination from './TablePagination';
// import PropTypes from 'prop-types';

// const CustomTable = ({
//   data,
//   columns,
//   itemsPerPage = 15,
//   onDataSizeChange,
// }) => {
//   const {
//     handleSort,
//     handleSelectAllRows,
//     handleRowSelect,
//     slicedData,
//     pageCount,
//     isAllSelected,
//     currentPage,
//     handlePageChange,
//   } = useCustomTable({
//     data,
//     itemsPerPage,
//     onDataSizeChange,
//   });

//   return (
//     <div className="table-rep-plugin">
//       <div className="table-responsive mb-0" data-pattern="priority-columns">
//         <table className="table table-bordered custom-table">
//           <TableHeader
//             columns={columns}
//             sortField={sortField}
//             sortOrder={sortOrder}
//             handleSort={handleSort}
//             isAllSelected={isAllSelected}
//             handleSelectAllRows={handleSelectAllRows}
//           />
//           <tbody>
//             {slicedData.length === 0 ? (
//               <tr>
//                 <td colSpan={columns.length + 1}>No data available.</td>
//               </tr>
//             ) : (
//               slicedData.map((row) => (
//                 <TableRow
//                   key={row.keyField}
//                   row={row}
//                   selectedRows={selectedRows}
//                   handleRowSelect={handleRowSelect}
//                 />
//               ))
//             )}
//           </tbody>
//         </table>
//         <TablePagination
//           pageCount={pageCount}
//           currentPage={currentPage}
//           handlePageChange={handlePageChange}
//         />
//       </div>
//     </div>
//   );
// };

// CustomTable.propTypes = {
//   data: PropTypes.array.isRequired,
//   columns: PropTypes.array.isRequired,
//   itemsPerPage: PropTypes.number,
//   onDataSizeChange: PropTypes.func,
// };

// export default CustomTable;

