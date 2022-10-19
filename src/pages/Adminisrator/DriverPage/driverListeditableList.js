import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Col, Input, Modal, Row } from "reactstrap";
import paginationFactory, {
    PaginationListStandalone,
    PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, useDispatch } from "react-redux";
import "../../../assets/scss/CustomTable2/datatables.scss";
import DriverMaster from "./DriverMaster";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import {
    deleteDriverTypeIDSuccess,
    updateDriverTypeIDSuccess,
    getMethodForDriverList,
    editDriverTypeId,
    delete_DriverType_ID,
    PostMethod_ForDriverMasterSuccess,
} from "../../../store/Administrator/DriverRedux/action";
import { AlertState } from "../../../store/actions";
import { listPageCommonButtonFunction }
    from "../../../components/Common/CmponentRelatedCommonFile/listPageCommonButtons";

import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import Select from "react-select";


const DriverList = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [modal_center, setmodal_center] = useState(false);

    const {
        TableListData,
        editData,
        updateMessage,
        deleteMessage,
        PostAPIResponse,
        RoleAccessModifiedinSingleArray,
    } = useSelector(
        (state) => ({
            TableListData: state.DriverReducer.DriverList,
            editData: state.DriverReducer.editData,
            updateMessage: state.DriverReducer.updateMessage,
            deleteMessage: state.DriverReducer.deleteMessage,
            RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
            PostAPIResponse: state.DriverReducer.PostDataMessage,
        })
    );


    useEffect(() => {
        const locationPath = history.location.pathname
        let userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }
    }, [RoleAccessModifiedinSingleArray])

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(getMethodForDriverList());
    }, []);

    // This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal
    useEffect(() => {

        if (updateMessage.Status === true && updateMessage.StatusCode === 200) {
            dispatch(updateDriverTypeIDSuccess({ Status: false }));
            dispatch(
                AlertState({
                    Type: 1,
                    Status: true,
                    Message: updateMessage.Message,
                    AfterResponseAction: getMethodForDriverList,
                })
            );
            tog_center();
        } else if (updateMessage.Status === true) {
            dispatch(updateDriverTypeIDSuccess({ Status: false }));
            dispatch(
                AlertState({
                    Type: 3,
                    Status: true,
                    Message: JSON.stringify(updateMessage.Message),
                })
            );
        }
    }, [updateMessage]);

    useEffect(() => {
        if (deleteMessage.Status === true && deleteMessage.StatusCode === 200) {
            dispatch(deleteDriverTypeIDSuccess({ Status: false }));
            dispatch(
                AlertState({
                    Type: 1,
                    Status: true,
                    Message: deleteMessage.Message,
                    AfterResponseAction: getMethodForDriverList,
                })
            );
        } else if (deleteMessage.Status === true) {
            dispatch(deleteDriverTypeIDSuccess({ Status: false }));
            dispatch(
                AlertState({
                    Type: 3,
                    Status: true,
                    Message: JSON.stringify(deleteMessage.Message),
                })
            );
        }
    }, [deleteMessage]);


    useEffect(() => {

        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {
            dispatch(PostMethod_ForDriverMasterSuccess({ Status: false }))
            tog_center();
            dispatch(getMethodForDriverList());
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: PostAPIResponse.Message,
            }))
        }

        else if ((PostAPIResponse.Status === true)) {
            dispatch(PostMethod_ForDriverMasterSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(PostAPIResponse.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }


    }, [PostAPIResponse.Status])
    // Edit Modal Show When Edit Data is true
    useEffect(() => {
        if (editData.Status === true) {
            tog_center();
        }
    }, [editData]);

    function tog_center() {
        setmodal_center(!modal_center);
    }

    const defaultSorted = [
        {
            dataField: "Name", // if dataField is not match to any column you defined, it will be ignored.
            order: "asc", // desc or asc
        },
    ];

    const pageOptions = {
        sizePerPage: 10,
        totalSize: TableListData.length,
        custom: true,
    };
    const options = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'In Active' },
        { value: 'deleted', label: 'Delete' },
    ];


    const pagesListColumns = [
        {
            text: "Name",
            dataField: "Name",
            sort: true,
            editor: {
                type: Type.SELECT,
                getOptions: (setOptions, { row, column }) => {
                    console.log(`current editing row id: ${row.id}`, row);
                    console.log(`current editing column: ${column.dataField}`, column);
                    console.log(`setOptions editing column: ${setOptions}`, setOptions);
                    return [{
                        value: 'A',
                        label: 'Avxv'
                    }, {
                        value: 'B',
                        label: 'Bcvvx'
                    }, {
                        value: 'C',
                        label: 'Ccvcv'
                    }, {
                        value: 'D',
                        label: 'Dcvcv'
                    }, {
                        value: 'Ecvcv',
                        label: 'Evcvcvc'
                    }];
                }
            }
        },

        {
            text: "Date Of Birth",
            dataField: "DOB",
            sort: true,

            editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
                // <QualityRanger { ...editorProps } value={ value } />
                <>
                    <Input type="checkbox" />
                    <Input type="text" onChange={(e)=>{debugger}}></Input>
                    <Select
                                                                        defaultValue={options[0]}
                                                                        isSearchable={false}
                                                                        className="react-dropdown"
                                                                        // onChange={(v, e) => onChangeSelect({ e, v, state, setState })}
                                                                        classNamePrefix="dropdown"
                                                                        options={options}
                                                                        name="Address"
                                                                        styles={{
                                                                            control: base => ({
                                                                                ...base,
                                                                                // border: isError.Address.length > 0 ? '1px solid red' : '',

                                                                            })
                                                                        }}
                                                                    />
                </>


            )
        },

        {
            text: "Address",
            dataField: "Address",
            sort: true,
            //   editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (

            // <QualityRanger { ...editorProps } value={ value } />
            //   )
        },
        {
            text: "UID",
            dataField: "UID",
            sort: true,
        },

        // For Edit, Delete ,and View Button Common Code function
        listPageCommonButtonFunction({
            dispatchHook: dispatch,
            ButtonMsgLable: "DriverType",
            deleteName: "Name",
            userPageAccessState: userPageAccessState,
            editActionFun: editDriverTypeId,
            deleteActionFun: delete_DriverType_ID
        })
    ];





    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>
                    <title>DriverList| FoodERP-React FrontEnd</title>
                </MetaTags>
                <div className="page-content">
                    <PaginationProvider pagination={paginationFactory(pageOptions)}>
                        {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                                keyField="id"
                                defaultSorted={defaultSorted}
                                data={TableListData}
                                columns={pagesListColumns}
                                search
                            >
                                {(toolkitProps) => (
                                    <React.Fragment>
                                        <Breadcrumbs
                                            title={"Count :"}
                                            breadcrumbItem={userPageAccessState.PageHeading}
                                            IsButtonVissible={(userPageAccessState.RoleAccess_IsSave) ? true : false}
                                            SearchProps={toolkitProps.searchProps}
                                            breadcrumbCount={`Product Count: ${TableListData.length}`}
                                            IsSearchVissible={true}
                                            RedirctPath={`/DriverMaster`}
                                            isExcelButtonVisible={true}
                                            ExcelData={TableListData}
                                        />
                                        <Row>
                                            <Col xl="12">
                                                <div className="table-responsive">
                                                    <BootstrapTable
                                                        keyField={"id"}
                                                        responsive
                                                        bordered={false}
                                                        striped={false}
                                                        cellEdit={cellEditFactory({ mode: 'click', blurToSave: true })}
                                                        classes={"table  table-bordered"}
                                                        {...toolkitProps.baseProps}
                                                        {...paginationTableProps}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="align-items-md-center mt-30">
                                            <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                <PaginationListStandalone {...paginationProps} />
                                            </Col>
                                        </Row>
                                    </React.Fragment>
                                )}
                            </ToolkitProvider>
                        )}
                    </PaginationProvider>
                    <Modal
                        isOpen={modal_center}
                        toggle={() => {
                            tog_center();
                        }}
                        size="xl"
                    >

                        {/* <A state={editData.Data} relatatedPage={"/DriverMaster"} pageMode={editData.pageMode} /> */}
                    </Modal>
                </div>
            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
}

export default DriverList;


// import React, { Component } from "react";
// import ReactDOM from "react-dom";
// import BootstrapTable from "react-bootstrap-table-next";
// // import "./styles.css";
// import { ChromePicker } from "react-color";
// import { Input } from "reactstrap";

// export default class DriverList extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             dataResultsTable: [
//                 { id: 1, name: "Item 1", price: 100, color: "#0000ff" },
//                 { id: 2, name: "Item 2", price: 102, color: "#f000ff" }
//             ],
//             selectedResultsTableIndex: 0,
//             displayColorPicker: false,
//             xPosColorPicker: "0px",
//             yPosColorPicker: "0px",
//             changeColor: "#999",
//             color: {
//                 r: "0",
//                 g: "9",
//                 b: "153",
//                 a: "1"
//             }
//         };

//         this.columns = [
//             {
//                 dataField: "id",
//                 text: "Product ID"
//             },
//             {
//                 dataField: "name",
//                 text: "Product Name"
//             },
//             {
//                 dataField: "price",
//                 text: "Product Price",
//                 editable: (content, row, rowIndex, columnIndex) => {
//                     debugger
//                 },
//                 events: {
//                     onchange:(a,b,c,d)=>{
//                         debugger
//                     }
//                 }
//             },
//             {
//                 dataField: "color",
//                 text: "Color",
//                 formatter: (e1, column1, columnIndex1, row1, rowIndex1) => {
//                     debugger
//                     return (
//                         <div
//                         // style={{ width: "25px", height: "25px", backgroundColor: cell }}
//                         >
//                             {/* <Input /> */}
//                         </div>
//                     )
//                 },

//                 events: {
//                     onClick: (e, column, columnIndex, row, rowIndex) => {
//                         debugger
//                         column.formatter = (e1, column1, columnIndex1, row1, rowIndex1) => {
//                             debugger
//                             return (
//                                 <div
//                                 // style={{ width: "25px", height: "25px", backgroundColor: cell }}
//                                 >
//                                     <Input />
//                                 </div>
//                             )
//                         }
//             // column.formatter((cell)=>(
//             //     <Input></Input>
//             //   ))
//             // // get the x,y coordinates of the mouse click
//             // document.addEventListener("click", getClickPosition, false);
//             // function getClickPosition(e) {
//             //   return [e.clientX, e.clientY];
//             // }
//             // const [xPosClick, yPosClick] = getClickPosition(e);
//             // this.setState({ xPosColorPicker: `${xPosClick}px` });
//             // this.setState({ yPosColorPicker: `${yPosClick}px` });
//             // // get the color of the selected row
//             // var id = rowIndex;
//             // this.setState({ selectedResultsTableIndex: id });
//             // let clickedColor = this.state.dataResultsTable[id].color;
//             // this.setState({ color: clickedColor });
//             // // Make sure that if no new color is choosen the old one stays
//             // this.setState({ changeColor: clickedColor });
//             // // show the ColorPicker
//             // this.handleShowColorPicker();
//           }
//                 }
//             }
//         ];
//     }

//     // color picker functions
//     handleShowColorPicker = () => {
//         // this will trigger to rerender with colorPicker right here
//         this.setState({ displayColorPicker: true });
//     };

//     handleCloseColorPicker = () => {
//         const newColor = this.state.changeColor;
//         const selectedResultsTableIndex = this.state.selectedResultsTableIndex;

//         let dataResultsTable = [...this.state.dataResultsTable];
//         const oldColor = dataResultsTable[selectedResultsTableIndex].color;
//         // dataResultsTable[selectedResultsTableIndex].color = newColor;

//         // . This is correct way to update data immutability
//         const newDataResultsTable = this.state.dataResultsTable.map((row, index) => {
//             if (index === selectedResultsTableIndex) {
//                 return {
//                     ...row,
//                     color: newColor
//                 };
//             }
//             return { ...row };
//         })

//         this.setState({ dataResultsTable: newDataResultsTable });

//         this.setState({ displayColorPicker: false });

//         let dataResultsTable2 = [...this.state.dataResultsTable];
//         const newStateColor = dataResultsTable2[selectedResultsTableIndex].color;
//         console.log(`changing color from ${oldColor} to ${newStateColor}`);
//     };

//     changeColorPicker = color => {
//         this.setState({ color: color.rgb, changeColor: color.hex });
//     };

//     render() {
//         return (
//             <div>
//                 <div style={{ padding: "20px" }}>
//                     <h1 className="h2">Products</h1>
//                     <BootstrapTable
//                         keyField="id"
//                         data={this.state.dataResultsTable}
//                         columns={this.columns}
//                     />
//                 </div>
//                 <div>
//                     {this.state.displayColorPicker && (
//                         <div
//                             style={{
//                                 position: "fixed",
//                                 top: this.state.yPosColorPicker,
//                                 left: this.state.xPosColorPicker
//                             }}
//                         >
//                             <div className={"color-picker-container"}>
//                                 <div className={"color-picker-palette"}>
//                                     <div
//                                         className={"color-picker-cover"}
//                                         onClick={() => this.handleCloseColorPicker()}
//                                     />
//                                     <ChromePicker
//                                         disableAlpha
//                                         color={this.state.color}
//                                         onChange={this.changeColorPicker}
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//                 Check the console log that the color in the state changed but not in the
//                 table.
//             </div>
//         );
//     }
// }