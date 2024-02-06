import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import './CustomTable.scss';
import BootstrapTable from 'react-bootstrap-table-next';
import { customTableSearch } from '../components/Common/SearchBox/MySearch';
import _debounce from 'lodash/debounce';
import paginationFactory, {
    PaginationProvider,
    PaginationListStandalone,
    SizePerPageDropdownStandalone,
    PaginationTotalStandalone
} from 'react-bootstrap-table2-paginator';




const CustomTable = ({
    data,
    columns,
    keyField,
    defaultSearchText,
    classes,
    updatedRowBlinkId,
    onDataSizeChange,
    ...rest
}) => {
    const updatedRowBlinkIds_string = updatedRowBlinkId?.toString() || '';
    const [searchText, setSearchText] = useState(defaultSearchText || '');


    const debounceHandleSearch = _debounce((val) => {
        setSearchText(val);
    }, 300);

    useEffect(() => {
        customTableSearch({ onSearch: debounceHandleSearch });
    }, []); // Ensure that customTableSearch is called after mounting


    const rowClasses = (row) => {
        let cs = '';
        if (row.IsRecordDeleted) {
            cs += '_deleted-Row ';
        }

        if (updatedRowBlinkIds_string.includes(row[keyField])) {
            cs += '_row-blink ';
        }
        return cs;
    };

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


    const debounceIsDataChangeFunc = _debounce(() => {
        if (onDataSizeChange) {
            onDataSizeChange({ dataCount: filteredData.length, filteredData: filteredData });
        }
    }, 300);




    const options = {
        page: 1,
        paginationSize: 5,
        pageStartIndex: 1,
        sizePerPage: 25,
        // hideSizePerPage: true,
        custom: true,
        totalSize: filteredData.length,
        hidePageListOnlyOnePage: true,
     
        sizePerPageList: [{
            text: '10', value: 10
        }, {
            text: '25', value: 25
        },
        {
            text: '50', value: 50
        }, {
            text: 'All', value: filteredData.length
        }]
    };


    const sortCaretFunction = {
        sortCaret: (order, column) => {
            if (!order) {
                return null;
            } else if (order === 'asc') {
                return <i className="fas fa-sort-up pl-1 font-size-12"></i>;
            } else if (order === 'desc') {
                return <i className="fas fa-sort-down pl-1 font-size-12"></i>;
            }
            return null;
        }
    };

    return (
        <PaginationProvider
            data={filteredData}
            columns={columns}
            keyField={keyField}
            pagination={paginationFactory(options)}
        >
            {
                ({
                    paginationProps,
                    paginationTableProps
                }) => (
                    <div>

                        <BootstrapTable
                            data={filteredData}
                            columns={columns}
                            keyField={keyField}
                            classes='custom-table '
                            rowClasses={rowClasses}
                            sort={sortCaretFunction} // Include the sortCaret function
                            onDataSizeChange={debounceIsDataChangeFunc}
                            {...rest}
                            {...paginationTableProps}
                            bootstrap4
                        />
                        <PaginationTotalStandalone
                            {...paginationProps}
                        />
                        <div className=" pagination pagination-rounded justify-content-end  mb-3" style={{ marginTop: "-20px" }}>
                            <PaginationListStandalone
                                {...paginationProps}
                            />
                        </div>

                    </div>
                )
            }
        </PaginationProvider>


    );
};

CustomTable.propTypes = {
    keyField: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    defaultSearchText: PropTypes.string,
    classes: PropTypes.string,
    // ... Add any other props here
};

export default React.memo(CustomTable);
