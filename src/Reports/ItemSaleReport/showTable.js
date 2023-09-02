import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import ToolkitProvider from 'react-bootstrap-table2-toolkit'
import { Col, Row } from 'reactstrap'
import { mySearchProps } from '../../components/Common/SearchBox/MySearch'


function ShowTable(initialProps) {
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
    return (
        <div className="mt-1">
            <ToolkitProvider
                keyField="id"
                {...initialProps}
                search
            >
                {(toolkitProps,) => (
                    <React.Fragment>
                        <Row>
                            <Col xl="12">
                                <div className="table-responsive table">
                                    <BootstrapTable 
                                        keyField="id"
                                        classes={"table  table-bordered "}
                                        sort={sortCaretFunction}
                                        noDataIndication={
                                            <div className="text-danger text-center ">
                                                Record Not available
                                            </div>
                                        }
                                        // onDataSizeChange={({ dataSize }) => {
                                        //     // dispatch(BreadcrumbShowCountlabel(`Count:${dataSize > 0 && dataSize - 1}`));
                                        // }}
                                        {...toolkitProps.baseProps}
                                    />
                                    {mySearchProps(toolkitProps.searchProps)}
                                </div>
                            </Col>
                        </Row>

                    </React.Fragment>
                )}
            </ToolkitProvider>
        </div>
    )
}

export default React.memo(ShowTable);

