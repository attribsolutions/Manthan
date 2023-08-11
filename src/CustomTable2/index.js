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
    const [modifiyRowKeys, setModifiyRowKeys] = useState([]);
    const dispatch = useDispatch();




    const { RadioButtonNonDeleteValue, RadioButtonDeleteValue } = useSelector(state => ({
        RadioButtonNonDeleteValue: state.BreadcrumbReducer.RadioButtonNonDeleteValue,
        RadioButtonDeleteValue: state.BreadcrumbReducer.RadioButtonDeleteValue,
    }))

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

    //  code for deleted, nondeleted and both  Record   ///
    useEffect(() => {
        

        const IsDeleted = slicedData
            .filter(item => item.IsRecordDeleted === true)
            .map(item => item.id);
        const IsNonDeleted = slicedData
            .filter(item => item.IsRecordDeleted !== true)
            .map(item => item.id);

        // const IsBoth = slicedData.map(item => item.id);

        if ((RadioButtonDeleteValue.CheckedValue === true) && (RadioButtonNonDeleteValue.CheckedValue === true)) {
            setModifiyRowKeys([]);
        } else {
            if ((RadioButtonNonDeleteValue.CheckedValue === true) && (RadioButtonNonDeleteValue.type === "isNonDeleted")) {
                setModifiyRowKeys(IsDeleted);
            } else if ((RadioButtonDeleteValue.CheckedValue === true) && (RadioButtonDeleteValue.type === "isDeleted")) {
                setModifiyRowKeys(IsNonDeleted);
            } else if ((RadioButtonDeleteValue.CheckedValue === false) && (RadioButtonNonDeleteValue.CheckedValue === false)) {
                dispatch(BreadcrumbNonDeleteButton({ CheckedValue: true, type: "isNonDeleted" }))
            }
        }



    }, [RadioButtonNonDeleteValue, RadioButtonDeleteValue, slicedData])


    //  code for deleted, nondeleted and both  Record   /////




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
                hiddenRows={modifiyRowKeys}
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

