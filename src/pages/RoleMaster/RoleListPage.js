// import React, { useEffect, useState } from 'react'
// import { useHistory } from "react-router-dom";
// import Breadcrumbs from "../../components/Common/Breadcrumb";
// import MetaTags from "react-meta-tags";
// import { Button } from "reactstrap";

// import {
//     Card,
//     CardBody,
//     Col,
//     Container,
//     Row,
// } from "reactstrap";

// import {
//     getRole,
//     deleteRole,
//     editRoleId,
// } from "../../store/RoleMasterRedux/actions";

// import paginationFactory, {
//     PaginationListStandalone,
//     PaginationProvider, SizePerPageDropdownStandalone,
// } from "react-bootstrap-table2-paginator";
// import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
// import BootstrapTable from "react-bootstrap-table-next";
// import { useSelector, useDispatch } from "react-redux";

// const RoleListPage = () => {
//     const [EditId, setId] = useState('')
//     const dispatch = useDispatch();
//     const history = useHistory();
//     const { SearchBar } = Search;
    
// //// get data
//     const { pages,editData ,} = useSelector((state) => ({
//         pages:state.RoleMaster.pages,
//         editData:state.RoleMaster.editData,
//     }));
//     console.log("get data",pages);

//     console.log("editData",editData); /// id select
   
// //// select id for delete row
//     const deleteHandeler = (id) => { 
//         setId(id);
//         dispatch(deleteRole(id));
//         dispatch(getRole());  
//     };

//     useEffect(()=>{
//         dispatch(editRoleId(0));
//         dispatch(getRole());
//     },[dispatch,EditId]);
  
//     /// if editdata is not equal to 0 ,then go to AddRoleList page
//     useEffect(() => {
//         if ( !(editData.ID === 0)) {
//             dispatch(editRoleId(0));
//             history.push({
//                 pathname: "/AddRoleList",
//                 state: editData
//             });
//         }
//     }, [dispatch, editData.ID]);
  
// //// edit id select
//     const EditPageHandler = (id) => {
//         console.log("selected ID",id)
//         dispatch(editRoleId(id));
//     }
    
//     const pageOptions = {
//         sizePerPage: 10,
//         totalSize: pages.length,
//         custom:true,
//     };
    
//     const pagesListColumns = [
//         {
//             text: "PageID",
//             dataField: "ID",
//             sort: true,
//             hidden: true,
//             formatter: (cellContent, Role) => <>{Role.ID}</>,
//         },

//         {
//             text: "Name",
//             dataField: "Name",
//             sort: true,
//             formatter: (cellContent, Role) => <>{Role.Name}</>,
//         },

//         {
//             text: "Description",
//             dataField: "Description",
//             sort: true,
//             formatter: (cellContent, Role) => <>{Role.Description}</>,
//         },
//         {
//             text: "IsActive",
//             dataField: "IsActive",
//             sort: true,
//             formatter: (cellContent, Role) =>
//              <>
//           {( Role.IsActive)?"true" :"false"}
//             </>
//         },
//         {
//             text: "Icon",
//             dataField: "Icon",
//             sort: true,
//             formatter: (cellContent, Role) => <>{Role.Icon}</>,
//         },
//         {
//             text: "Dashboard",
//             dataField: "Dashboard",
//             sort: true,
//             formatter: (cellContent, Role) => <>{Role.Dashboard}</>,
//         },
//         {
//             text: "",
//             dataField: "buttons",
//             sort: true,
//             formatter: (cellContent, Role) => (
//                 <>
//                     <div>

//                         <Button
//                             type="button"
//                             onClick={() => {

//                                 EditPageHandler(Role.ID);    
//                             }}
//                             className="me-2 bg-primary badge badge-secondary"
//                             data-toggle="modal"
//                             data-target=".bs-example-modal-lg"
//                         >
//                             Edit
//                         </Button>{" "}
                       
//                    <button 
//                            className="me-2 bg-danger badge badge-secondary"
//                             onClick={() => {
//                                 const deleteID= window.confirm(
//                                   "Are you sure you want to Delete ?"
//                                         )
//                                if ( deleteID=== true) {
//                                 deleteHandeler(Role.ID );
//                                         }
//                                     }}>
//                                         Delete
//                                    </button>
//                     </div>
//                 </>
//             ),
//         },
//     ];

//      return (
//         <React.Fragment>
//             <div className="page-content">
//                 <MetaTags>  <title>Role List Page </title>  </MetaTags>
//                 <Container fluid>
//                     {/* Render Breadcrumbs */}
//                     <Breadcrumbs title="Pages Count" breadcrumbItem=" Role List Page " breadcrumbCount={pages.length} />
//                     <Row>
//                         <Col lg="12">
//                             <Card>
//                                 <CardBody>
//                                     <PaginationProvider
//                                         pagination={paginationFactory(pageOptions)}
//                                     >
//                                         {({ paginationProps, paginationTableProps }) => (
//                                             <ToolkitProvider
//                                                 keyField="id"
//                                                 data={pages}
//                                                 columns={pagesListColumns}
//                                                 bootstrap4
//                                                 search
//                                             >
//                                                 {toolkitProps => (
//                                                     <React.Fragment>
//                                                         <Row className="mb-12">
//                                                             <Col sm="12">
//                                                                 <div className="search-box ms-12 mb-12 d-inline-block">
//                                                                     <div className="position-relative">
//                                                                         <SearchBar {...toolkitProps.searchProps} />
//                                                                         <i className="bx bx-search-alt search-icon-search" />
//                                                                     </div>
//                                                                 </div>

//                                                             </Col>
//                                                         </Row>
//                                                         <Row>
//                                                             <Col xl="12">
//                                                                 <div className="table-responsive">
//                                                                     <BootstrapTable
//                                                                         keyField={"id"}
//                                                                         responsive
//                                                                         bordered={false}
//                                                                         striped={false}
//                                                                         //defaultSorted={defaultSorted}
//                                                                         // selectRow={selectRow}
//                                                                         classes={
//                                                                             "table align-middle table-nowrap"
//                                                                         }
//                                                                         headerWrapperClasses={"thead-light"}
//                                                                         {...toolkitProps.baseProps}
//                                                                         {...paginationTableProps}
//                                                                     />

//                                                                 </div>
//                                                             </Col>
//                                                         </Row>

//                                                         <Row className="align-items-md-center mt-30">
//                                                             <Col className="inner-custom-pagination d-flex">
//                                                                 <div className="d-inline">
//                                                                     <SizePerPageDropdownStandalone
//                                                                         {...paginationProps}
//                                                                     />
//                                                                 </div>
//                                                                 <div className="text-md-right ms-auto">
//                                                                     <PaginationListStandalone
//                                                                         {...paginationProps}
//                                                                     />
//                                                                 </div>
//                                                             </Col>

//                                                         </Row>
//                                                         <br></br>


//                                                     </React.Fragment>
//                                                 )}
//                                             </ToolkitProvider>
//                                         )}
//                                     </PaginationProvider>
//                                 </CardBody>
//                             </Card>
//                         </Col>
//                     </Row>
//                 </Container>
//             </div>
//         </React.Fragment>
//     );
// };

// export default RoleListPage;