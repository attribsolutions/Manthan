import React, { useState, useMemo, useEffect } from 'react';
import './CustomTable.scss';
import { customTableSearch } from '../components/Common/SearchBox/MySearch';

import CustomPagination from './CustomPagination';
import { Table, Thead, Tbody, Tr, Th, Td, } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { Input } from 'reactstrap';

const CustomTable = ({
    keyField,
    data,
    columns,
    itemsPerPage = 15,
    defaultSorted = [],
    noDataIndication,
    selectRow = undefined,
    defaultSearchText,
    onDataSizeChange,
    updatedRowBlinkId
}) => {

    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState([]);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const handleSearch = (val) => {
        setSearchText(val);
        setCurrentPage(1);
    };

    customTableSearch({ onSearch: handleSearch });

    useEffect(() => {
        setSelectedRows([])
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
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;

    const slicedData = sortedData.slice(startIndex, endIndex);


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
        onDataSizeChange({ dataCount: sortedData.length,filteredData:sortedData}); // Call the on DataSize Change function with the length of sortedData
    }, [sortedData]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSelectAllRows = () => {
        const nonSelected = selectRow && selectRow.nonSelected ? selectRow.nonSelected : [];
        const selectableRows = slicedData.reduce((selectable, row) => {
            if (!nonSelected.includes(row[keyField])) {
                selectable.push(row[keyField])
            }
            return selectable
        }, []);



        if (selectedRows.length === selectableRows.length) {
            setSelectedRows([]);
            data.forEach(row => {
                if (selectableRows.includes(row[keyField])) {
                    row.selectCheck = false
                }
            })
        } else {
            data.forEach(row => {
                if ((selectableRows.includes(row[keyField]))) {
                    row.selectCheck = true
                }
            })
            setSelectedRows(selectableRows);
        }
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const handleRowSelect = (e, row) => {
        const rowId = row[keyField];
        data.forEach(row => {
            if (row[keyField] === rowId) {
                row.selectCheck = e.target.checked;
            }
        })
        setSelectedRows(() => {

            if (selectedRows.includes(rowId)) {
                return selectedRows.filter((selectedRow) => selectedRow !== rowId);
            } else {
                return [...selectedRows, rowId];
            }
        });
    };

    const isAllSelected = slicedData.every(row => selectedRows.includes(row[keyField]) || (selectRow && selectRow.nonSelected.includes(row[keyField])));

    return (
        <div className="table-rep-plugin">
            <div className="table-responsive mb-0" data-pattern="priority-columns">
                <div className="table-container1">
                    <Table className="table  table-bordered">
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
                                            <span className="column-text">{column.text}</span>
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
                            {slicedData.length === 0 && noDataIndication && (
                                <Tr>
                                    <Td colSpan={selectRow ? columns.length + 1 : columns.length}>
                                        {noDataIndication}
                                    </Td>
                                </Tr>
                            )}
                            {slicedData.map((row) => {
                                // Check if the row should blink
                                const shouldBlink = updatedRowBlinkId !== undefined && row[keyField] === updatedRowBlinkId;
                                return (
                                    <Tr
                                        key={row[keyField]}
                                        data-selected={selectedRows.includes(row[keyField])}
                                        data-record-deleted={row.IsRecordDeleted}
                                        className={shouldBlink ? 'row-blink' : ''} // Apply blinking class if shouldBlink is true
                                    >
                                        {selectRow && (
                                            <Td>
                                                <Input
                                                    type="checkbox"
                                                    className='check-disabled'
                                                    checked={selectedRows.includes(row[keyField])}
                                                    disabled={
                                                        (selectRow && selectRow.nonSelected.includes(row[keyField]))
                                                    }
                                                    onChange={(e) => handleRowSelect(e, row)}
                                                />
                                            </Td>
                                        )}
                                        {columns.map((column, colIndex) => (
                                            <Td key={colIndex} data-label={column.text}>
                                                {column.formatter
                                                    ? column.formatter(row[column.dataField], row, colIndex, column.formatExtraData)
                                                    : row[column.dataField]}
                                            </Td>
                                        ))}
                                    </Tr>
                                )
                            })}
                        </Tbody>
                    </Table>
                    <CustomPagination pageCount={pageCount} currentPage={currentPage} handlePageChange={handlePageChange} />
                </div>
            </div>
        </div>
    );
};

export default CustomTable;